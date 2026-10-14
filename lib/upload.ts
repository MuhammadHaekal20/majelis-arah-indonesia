import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 5 * 1024 * 1024;

const SAFE_FILENAME = /^[a-zA-Z0-9._-]+$/;

export function isSafeUploadFilename(filename: string) {
  return SAFE_FILENAME.test(filename);
}

export async function saveUploadedFile(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran file maksimal 5MB.");
  }

  // Ekstensi dari MIME agar isi file cocok dengan nama.
  const extension = guessExtension(file.type);
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Utama: DB (survive redeploy). Disk opsional untuk dev lokal.
  await prisma.mediaAsset.create({
    data: {
      filename,
      mime_type: file.type || "application/octet-stream",
      bytes: buffer,
    },
  });

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
  } catch (error) {
    console.warn("[upload] Gagal menulis ke disk (lanjut pakai DB):", error);
  }

  return `/uploads/${filename}`;
}

function guessExtension(mime: string) {
  switch (mime) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".jpg";
  }
}
