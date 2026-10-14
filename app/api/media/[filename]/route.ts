import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isSafeUploadFilename } from "@/lib/upload";

type RouteProps = {
  params: Promise<{ filename: string }>;
};

function mimeFromFilename(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { filename } = await params;

  if (!filename || !isSafeUploadFilename(filename)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const headers = {
    "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
  };

  try {
    const diskPath = path.join(process.cwd(), "public", "uploads", filename);
    const data = await readFile(diskPath);
    return new NextResponse(data, {
      headers: {
        ...headers,
        "Content-Type": mimeFromFilename(filename),
      },
    });
  } catch {
    // File disk hilang setelah redeploy — ambil dari DB.
  }

  const asset = await prisma.mediaAsset
    .findUnique({ where: { filename } })
    .catch(() => null);

  if (!asset) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(asset.bytes), {
    headers: {
      ...headers,
      "Content-Type": asset.mime_type || mimeFromFilename(filename),
    },
  });
}
