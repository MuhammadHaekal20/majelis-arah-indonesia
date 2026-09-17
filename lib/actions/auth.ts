"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { Role } from "@/app/generated/prisma/client";
import {
  consumeEmailVerificationToken,
  issueEmailVerificationToken,
  verificationLink,
} from "@/lib/email-verification";
import { isSmtpConfigured } from "@/lib/env";
import { sendVerificationEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export type RegisterState = {
  ok: boolean;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;
const MAX_NAME_LENGTH = 120;

async function sendNewVerificationLink(userId: string, email: string) {
  const token = await issueEmailVerificationToken(userId);
  await sendVerificationEmail(email, verificationLink(token));
}

export async function registerUser(formData: FormData): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name || !email || !password || !confirmPassword) {
    return { ok: false, message: "Semua kolom wajib diisi." };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, message: "Nama terlalu panjang." };
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { ok: false, message: "Format email tidak valid." };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      message: `Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`,
    };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return { ok: false, message: "Kata sandi terlalu panjang." };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: "Konfirmasi kata sandi tidak cocok." };
  }

  if (!isSmtpConfigured()) {
    return {
      ok: false,
      message:
        "Pengiriman email verifikasi belum dikonfigurasi. Hubungi pengelola situs.",
    };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });

    if (existing?.emailVerified) {
      return { ok: false, message: "Email sudah terdaftar." };
    }

    if (existing && !existing.emailVerified) {
      await sendNewVerificationLink(existing.id, email);
      redirect("/login?verify=1");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.MEMBER,
        emailVerified: null,
      },
    });

    await sendNewVerificationLink(user.id, email);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    const message = error instanceof Error ? error.message : "";
    if (message === "SMTP_NOT_CONFIGURED") {
      return {
        ok: false,
        message:
          "Pengiriman email verifikasi belum dikonfigurasi. Hubungi pengelola situs.",
      };
    }
    if (
      message.includes("parsing connection string") ||
      message.includes("ECONNREFUSED") ||
      message.includes("Can't reach database")
    ) {
      return {
        ok: false,
        message:
          "Database tidak terhubung. Periksa DATABASE_URL PostgreSQL lalu coba lagi.",
      };
    }
    return {
      ok: false,
      message: "Pendaftaran gagal. Coba lagi atau periksa koneksi database.",
    };
  }

  redirect("/login?verify=1");
}

export async function resendVerificationEmail(
  formData: FormData,
): Promise<RegisterState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, message: "Format email tidak valid." };
  }

  if (!isSmtpConfigured()) {
    return {
      ok: false,
      message:
        "Pengiriman email verifikasi belum dikonfigurasi. Hubungi pengelola situs.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true },
  });

  if (user?.emailVerified) {
    return { ok: true, message: "Email sudah terverifikasi. Silakan masuk." };
  }

  if (user) {
    try {
      await sendNewVerificationLink(user.id, email);
    } catch {
      return {
        ok: false,
        message: "Gagal mengirim email. Coba lagi nanti.",
      };
    }
  }

  return {
    ok: true,
    message:
      "Jika email terdaftar dan belum diverifikasi, tautan baru telah dikirim.",
  };
}

export async function completeEmailVerification(token: string) {
  return consumeEmailVerificationToken(token);
}

export async function isUnverifiedEmail(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(normalized)) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: { emailVerified: true },
  });

  return Boolean(user && !user.emailVerified);
}
