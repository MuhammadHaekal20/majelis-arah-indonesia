"use server";

import { StatusModerasi } from "@/app/generated/prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/authOptions";
import { sendUserNotification } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export type DiskusiActionState = {
  ok: boolean;
  message: string;
};

export async function createDiskusi(
  _prev: DiskusiActionState,
  formData: FormData,
): Promise<DiskusiActionState> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { ok: false, message: "Silakan login untuk berkomentar." };
  }

  const konten = String(formData.get("konten") ?? "").trim();
  const publikasi_id = String(formData.get("publikasi_id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();

  if (!konten || !publikasi_id) {
    return { ok: false, message: "Komentar tidak boleh kosong." };
  }

  const publikasi = await prisma.publikasi.findUnique({
    where: { id: publikasi_id },
    select: { id: true, judul: true, slug: true },
  });

  if (!publikasi) {
    return { ok: false, message: "Publikasi tidak ditemukan." };
  }

  await prisma.diskusi.create({
    data: {
      konten,
      publikasi_id,
      user_id: session.user.id,
      status_moderasi: StatusModerasi.APPROVED,
    },
  });

  revalidatePath(`/publikasi/${slug || publikasi.slug}`);
  revalidatePath("/admin/komentar");

  return {
    ok: true,
    message: "Komentar berhasil dikirim.",
  };
}

export async function moderateDiskusi(
  id: string,
  status: "APPROVED" | "REJECTED",
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const diskusi = await prisma.diskusi.update({
    where: { id },
    data: { status_moderasi: StatusModerasi[status] },
    include: {
      user: { select: { email: true } },
      publikasi: { select: { judul: true, slug: true } },
    },
  });

  await sendUserNotification(
    diskusi.user.email,
    "komentar",
    diskusi.publikasi.judul,
    status,
  );

  revalidatePath("/admin/komentar");
  revalidatePath(`/publikasi/${diskusi.publikasi.slug}`);
}
