import { normalizeArticleHtml, stripHtml } from "@/lib/html";

export type DocxExtractResult = {
  judul: string;
  konten: string;
  messages: string[];
};

function extractJudul(html: string, fallback: string): string {
  const heading = html.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
  if (heading?.[1]) {
    const text = stripHtml(heading[1]);
    if (text) return text.slice(0, 160);
  }

  const paragraph = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (paragraph?.[1]) {
    const text = stripHtml(paragraph[1]);
    if (text) return text.slice(0, 160);
  }

  return fallback.slice(0, 160);
}

/** Client-side: .docx → HTML siap editor gagasan. */
export async function extractDocxToGagasan(
  file: File,
): Promise<DocxExtractResult> {
  if (!file.name.toLowerCase().endsWith(".docx")) {
    throw new Error("Hanya file Word .docx yang didukung.");
  }

  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("Ukuran file maksimal 8MB.");
  }

  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const konten = normalizeArticleHtml(result.value || "");

  if (!stripHtml(konten)) {
    throw new Error("Tidak ada teks yang bisa diekstrak dari dokumen.");
  }

  const fallbackTitle = file.name.replace(/\.docx$/i, "").replace(/[_-]+/g, " ");
  const judul = extractJudul(konten, fallbackTitle);
  const messages = (result.messages ?? []).map((item) => item.message);

  return { judul, konten, messages };
}
