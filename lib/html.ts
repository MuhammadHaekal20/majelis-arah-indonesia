/** Normalisasi HTML artikel: &nbsp; antar kata memaksa layout melebar ke kanan. */
export function normalizeArticleHtml(html: string): string {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]{2,}/g, " ");
}
