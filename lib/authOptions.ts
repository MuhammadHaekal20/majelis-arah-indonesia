import { randomBytes } from "node:crypto";
import type { NextAuthOptions, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare, hash } from "bcrypt";
import { Role } from "@/app/generated/prisma/client";
import { isGoogleAuthConfigured, sanitizeRuntimeEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

sanitizeRuntimeEnv();

function googleEmailVerified(profile?: Profile): boolean {
  if (!profile) {
    return false;
  }

  const verified = (profile as { email_verified?: boolean }).email_verified;
  return verified !== false;
}

const googleConfigured = isGoogleAuthConfigured();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(googleConfigured
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          if (!user.emailVerified) {
            return null;
          }

          const passwordValid = await compare(password, user.password);

          if (!passwordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("[auth] credentials lookup failed", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user.email?.trim().toLowerCase();
      if (!email || !googleEmailVerified(profile)) {
        return false;
      }

      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (!existing) {
        const unusablePassword = randomBytes(32).toString("hex");
        await prisma.user.create({
          data: {
            name: user.name?.trim() || email.split("@")[0],
            email,
            password: await hash(unusablePassword, 10),
            role: Role.MEMBER,
            emailVerified: new Date(),
          },
        });
      } else if (!existing.emailVerified) {
        await prisma.user.update({
          where: { id: existing.id },
          data: { emailVerified: new Date() },
        });
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        const email =
          (typeof token.email === "string" && token.email.toLowerCase()) ||
          user?.email?.trim().toLowerCase();

        if (!email) {
          return token;
        }

        const dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.email = dbUser.email;
          token.name = dbUser.name;
        }

        return token;
      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
