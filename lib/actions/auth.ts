"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { Role } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type RegisterState = {
  ok: boolean;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;
const MAX_NAME_LENGTH = 120;

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

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return { ok: false, message: "Email sudah terdaftar." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.MEMBER,
    },
  });

  redirect("/login?registered=1");
}
