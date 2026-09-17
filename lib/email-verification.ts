import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { publicAppUrl } from "@/lib/env";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export function hashEmailToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function verificationLink(token: string): string {
  return `${publicAppUrl()}/verify-email?token=${encodeURIComponent(token)}`;
}

export async function issueEmailVerificationToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashEmailToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.emailVerificationToken.deleteMany({
    where: { user_id: userId },
  });

  await prisma.emailVerificationToken.create({
    data: {
      tokenHash,
      expires_at: expiresAt,
      user_id: userId,
    },
  });

  return token;
}

export async function consumeEmailVerificationToken(token: string): Promise<{
  ok: boolean;
  reason: "missing" | "invalid" | "expired" | "ok";
}> {
  if (!token?.trim()) {
    return { ok: false, reason: "missing" };
  }

  const tokenHash = hashEmailToken(token.trim());
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true, emailVerified: true } } },
  });

  if (!record) {
    return { ok: false, reason: "invalid" };
  }

  if (record.expires_at.getTime() < Date.now()) {
    await prisma.emailVerificationToken.delete({ where: { id: record.id } });
    return { ok: false, reason: "expired" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.user_id },
      data: { emailVerified: record.user.emailVerified ?? new Date() },
    }),
    prisma.emailVerificationToken.deleteMany({
      where: { user_id: record.user_id },
    }),
  ]);

  return { ok: true, reason: "ok" };
}
