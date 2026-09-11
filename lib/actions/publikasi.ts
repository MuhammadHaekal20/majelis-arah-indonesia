"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";

export type PublikasiActionState = {
  ok: boolean;
  message: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = base || `artikel-${Date.now()}`;
  let counter = 1;

  while (true) {
    const existing = await prisma.publikasi.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) {
      return slug;
    }
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

function revalidatePublikasiPaths(slug?: string) {
  revalidatePath("/admin/publikasi");
  revalidatePath("/publikasi");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/publikasi/${slug}`);
  }
}

/** Dipakai oleh useActionState di PublikasiCreateForm */
export async function createPublikasi(
  _prev: PublikasiActionState,
  formData: FormData,
): Promise<PublikasiActionState> {
  const session = await requireAdmin();

  if (!session) {
    return { ok: false, message: "Anda tidak berwenang membuat publikasi." };
  }

  const judul = String(formData.get("judul") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const konten = String(formData.get("konten") ?? "").trim();
  const cover = formData.get("cover");

  if (!judul || !excerpt || !konten) {
    return { ok: false, message: "Judul, excerpt, dan konten wajib diisi." };
  }

  if (!(cover instanceof File) || cover.size === 0) {
    return { ok: false, message: "Cover image wajib diunggah." };
  }

  try {
    const cover_url = await saveUploadedFile(cover);
    const slug = await uniqueSlug(slugify(judul));

    await prisma.publikasi.create({
      data: {
        judul,
        excerpt,
        konten,
        cover_url,
        slug,
        author_id: session.user.id,
      },
    });

    revalidatePublikasiPaths(slug);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menyimpan publikasi.";
    return { ok: false, message };
  }

  redirect("/admin/publikasi");
}

/** Dipakai oleh useActionState + .bind(null, id) di PublikasiEditForm */
export async function updatePublikasi(
  id: string,
  _prev: PublikasiActionState,
  formData: FormData,
): Promise<PublikasiActionState> {
  const session = await requireAdmin();

  if (!session) {
    return { ok: false, message: "Anda tidak berwenang mengubah publikasi." };
  }

  const judul = String(formData.get("judul") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const konten = String(formData.get("konten") ?? "").trim();
  const cover = formData.get("cover");

  if (!judul || !excerpt || !konten) {
    return { ok: false, message: "Judul, excerpt, dan konten wajib diisi." };
  }

  try {
    const existing = await prisma.publikasi.findUnique({ where: { id } });

    if (!existing) {
      return { ok: false, message: "Publikasi tidak ditemukan." };
    }

    let cover_url = existing.cover_url;
    if (cover instanceof File && cover.size > 0) {
      cover_url = await saveUploadedFile(cover);
    }

    const slug = await uniqueSlug(slugify(judul), id);

    await prisma.publikasi.update({
      where: { id },
      data: {
        judul,
        excerpt,
        konten,
        cover_url,
        slug,
      },
    });

    revalidatePublikasiPaths(slug);
    revalidatePath(`/admin/publikasi/${id}/edit`);

    return { ok: true, message: "Publikasi berhasil diperbarui." };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal memperbarui publikasi.";
    return { ok: false, message };
  }
}

/** Dipakai sebagai form action: deletePublikasi.bind(null, id) */
export async function deletePublikasi(id: string): Promise<void> {
  const session = await requireAdmin();

  if (!session) {
    throw new Error("Anda tidak berwenang menghapus publikasi.");
  }

  try {
    const existing = await prisma.publikasi.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!existing) {
      throw new Error("Publikasi tidak ditemukan.");
    }

    await prisma.publikasi.delete({ where: { id } });
    revalidatePublikasiPaths(existing.slug);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menghapus publikasi.";
    throw new Error(message);
  }
}
