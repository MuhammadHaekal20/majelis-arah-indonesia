/** Normalisasi HTML artikel: &nbsp; antar kata memaksa layout melebar ke kanan. */
export function normalizeArticleHtml(html: string): string {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]{2,}/g, " ");
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isBlankHtml(html: string): boolean {
  return stripHtml(html).length === 0;
}

export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Konten lama plain-text tetap aman ditampilkan sebagai paragraf HTML. */
export function toDisplayHtml(konten: string): string {
  const normalized = normalizeArticleHtml(konten.trim());
  if (!normalized) return "";

  if (looksLikeHtml(normalized)) {
    return normalized;
  }

  return normalized
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
