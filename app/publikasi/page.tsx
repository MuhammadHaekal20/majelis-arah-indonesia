import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function PublikasiPage() {
  const items = await prisma.publikasi.findMany({
    orderBy: { created_at: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-mai-red uppercase">
          Berita
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-mai-dark sm:text-5xl">
          Kabar &amp; materi terbaru
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Baca berita, catatan, dan materi resmi Majelis Arah Indonesia.
        </p>

        {items.length === 0 ? (
          <p className="mt-12 rounded-xl border border-slate-100 bg-white p-8 text-center text-slate-500 shadow-sm">
            Belum ada berita yang tersedia.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <Link href={`/publikasi/${item.slug}`} className="block">
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <Image
                      src={item.cover_url}
                      alt={item.judul}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-500">
                      {formatDate(item.created_at)} · {item.author.name}
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-snug text-mai-dark">
                      {item.judul}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {item.excerpt}
                    </p>
                    <span className="mt-4 inline-block text-sm font-medium text-mai-blue">
                      Baca selengkapnya →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
