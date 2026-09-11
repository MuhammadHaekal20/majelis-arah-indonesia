import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-primary/20 bg-mai-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl">
            Majelis Arah Indonesia
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
            Menyatukan gagasan, menguatkan arah, dan menghadirkan manfaat bagi
            umat, bangsa, dan negara.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-white/80">
          <Link href="/tentang" className="transition-colors hover:text-primary">
            Tentang
          </Link>
          <Link
            href="/publikasi"
            className="transition-colors hover:text-primary"
          >
            Berita
          </Link>
          <Link
            href="/ruang-gagasan"
            className="transition-colors hover:text-primary"
          >
            Gagasan
          </Link>
          <Link
            href="/presidium"
            className="transition-colors hover:text-primary"
          >
            Presidium
          </Link>
          <Link href="/kontak" className="transition-colors hover:text-primary">
            Kontak
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/50 sm:px-6">
          © {new Date().getFullYear()} Majelis Arah Indonesia. Seluruh hak
          dilindungi.
        </p>
      </div>
    </footer>
  );
}
