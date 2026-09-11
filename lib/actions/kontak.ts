"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/authOptions";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export type KontakActionState = {
  ok: boolean;
  message: string;
};

export async function submitKontak(
  _prev: KontakActionState,
  formData: FormData,
): Promise<KontakActionState> {
  const nama = String(formData.get("nama") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const pesan = String(formData.get("pesan") ?? "").trim();

  if (!nama || !email || !pesan) {
    return { ok: false, message: "Semua kolom wajib diisi." };
  }

  await prisma.pesanKontak.create({
    data: { nama, email, pesan },
  });

  const settingEmail = await prisma.pengaturanWeb.findUnique({
    where: { key: "email" },
  });
  const adminEmail =
    settingEmail?.value ||
    process.env.ADMIN_EMAIL ||
    "admin@mai.com";

  try {
    await sendMail({
      to: adminEmail,
      subject: `[MAI Kontak] Pesan dari ${nama}`,
      html: `
        <p><strong>Nama:</strong> ${nama}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Pesan:</strong></p>
        <p>${pesan.replace(/\n/g, "<br/>")}</p>
      `,
      text: `Nama: ${nama}\nEmail: ${email}\n\n${pesan}`,
    });
  } catch (error) {
    console.error("[kontak] email gagal:", error);
  }

  revalidatePath("/admin/pesan");

  return {
    ok: true,
    message: "Pesan Anda telah dikirim. Tim MAI akan menindaklanjuti segera.",
  };
}

export async function markPesanRead(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.pesanKontak.update({
    where: { id },
    data: { is_read: true },
  });

  revalidatePath("/admin/pesan");
}

export async function deletePesan(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.pesanKontak.delete({ where: { id } });
  revalidatePath("/admin/pesan");
}

export type PengaturanActionState = {
  ok: boolean;
  message: string;
};

const SETTING_KEYS = [
  "alamat",
  "email",
  "ig",
  "x",
  "youtube",
  "facebook",
] as const;

export async function savePengaturanWeb(
  _prev: PengaturanActionState,
  formData: FormData,
): Promise<PengaturanActionState> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false, message: "Anda tidak berwenang." };
  }

  await Promise.all(
    SETTING_KEYS.map(async (key) => {
      const value = String(formData.get(key) ?? "").trim();
      await prisma.pengaturanWeb.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }),
  );

  revalidatePath("/admin/pengaturan");
  revalidatePath("/kontak");

  return { ok: true, message: "Pengaturan web berhasil disimpan." };
}
