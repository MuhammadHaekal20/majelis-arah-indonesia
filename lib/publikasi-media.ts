import { publicAppUrl } from "@/lib/env";

/** Ambil src gambar pertama dari HTML konten (jika ada). */
export function firstImageFromHtml(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  const src = match?.[1]?.trim();
  return src || null;
}

/**
 * Cover untuk kartu / detail / OG:
 * pakai cover_url, kecuali masih logo/kosong → ambil foto di isi artikel.
 */
export function resolvePublikasiCover(
  coverUrl: string | null | undefined,
  konten: string,
): string {
  const cover = (coverUrl ?? "").trim();
  const isWeakCover =
    !cover ||
    cover === "/logo.png" ||
    cover.endsWith("/logo.png") ||
    cover.includes("logo.png");

  if (!isWeakCover) {
    return cover;
  }

  return firstImageFromHtml(konten) || cover || "/logo.png";
}

export function absoluteMediaUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const base = publicAppUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
