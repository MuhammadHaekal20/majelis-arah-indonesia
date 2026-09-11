import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 5 * 1024 * 1024;

export async function saveUploadedFile(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran file maksimal 5MB.");
  }

  const extension = path.extname(file.name).toLowerCase() || guessExtension(file.type);
  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

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
