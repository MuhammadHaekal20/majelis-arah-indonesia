"use server";

import { StatusModerasi } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { sendAdminNotification, sendUserNotification } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export type GagasanActionState = {
  ok: boolean;
  message: string;
};

export type BalasanActionState = {
  ok: boolean;
  message: string;
};

export async function createGagasan(
  _prev: GagasanActionState,
  formData: FormData,
): Promise<GagasanActionState> {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session?.user?.id) {
    return { ok: false, message: "Silakan login untuk mengajukan gagasan." };
  }

  if (role !== "MEMBER" && role !== "ADMIN") {
    return {
      ok: false,
      message: "Hanya MEMBER atau ADMIN yang dapat mengajukan gagasan baru.",
    };
  }

  const judul = String(formData.get("judul") ?? "").trim();
  const konten = String(formData.get("konten") ?? "").trim();

  if (!judul || !konten) {
    return { ok: false, message: "Judul dan konten wajib diisi." };
  }

  await prisma.gagasanThread.create({
    data: {
      judul,
      konten,
      author_id: session.user.id,
      status_moderasi: StatusModerasi.PENDING,
    },
  });

  await sendAdminNotification("gagasan", judul);

  revalidatePath("/ruang-gagasan");
  revalidatePath("/admin/gagasan");
  redirect("/ruang-gagasan");
}

export async function moderateGagasan(
  id: string,
  status: "APPROVED" | "REJECTED",
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const gagasan = await prisma.gagasanThread.update({
    where: { id },
    data: { status_moderasi: StatusModerasi[status] },
    include: {
      author: { select: { email: true } },
    },
  });

  await sendUserNotification(
    gagasan.author.email,
    "gagasan",
    gagasan.judul,
    status,
  );

  revalidatePath("/admin/gagasan");
  revalidatePath("/ruang-gagasan");
  revalidatePath(`/ruang-gagasan/${id}`);
}

export async function createBalasanGagasan(
  _prev: BalasanActionState,
  formData: FormData,
): Promise<BalasanActionState> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { ok: false, message: "Silakan login untuk ikut berdiskusi." };
  }

  const konten = String(formData.get("konten") ?? "").trim();
  const gagasan_id = String(formData.get("gagasan_id") ?? "").trim();

  if (!konten || !gagasan_id) {
    return { ok: false, message: "Balasan tidak boleh kosong." };
  }

  const gagasan = await prisma.gagasanThread.findUnique({
    where: { id: gagasan_id },
    select: { id: true, status_moderasi: true },
  });

  if (!gagasan || gagasan.status_moderasi !== StatusModerasi.APPROVED) {
    return { ok: false, message: "Gagasan tidak tersedia untuk diskusi." };
  }

  await prisma.balasanGagasan.create({
    data: {
      konten,
      gagasan_id,
      user_id: session.user.id,
    },
  });

  revalidatePath(`/ruang-gagasan/${gagasan_id}`);
  revalidatePath("/ruang-gagasan");

  return { ok: true, message: "Balasan berhasil dikirim." };
}
