"use server";

import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type RegisterState = {
  ok: boolean;
  message: string;
};

export async function registerUser(
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { ok: false, message: "Semua kolom wajib diisi." };
  }

  if (password.length < 6) {
    return { ok: false, message: "Kata sandi minimal 6 karakter." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, message: "Email sudah terdaftar." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: Role.GUEST,
    },
  });

  return { ok: true, message: "Registrasi berhasil. Silakan masuk." };
}
