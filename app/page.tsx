import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { StatusModerasi } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function HomePage() {
  const empty = [[], []] as const;
  const [berita, gagasan] = await Promise.all([
    prisma.publikasi.findMany({
      take: 4,
      orderBy: { created_at: "desc" },
      include: { author: { select: { name: true } } },
    }),
    prisma.gagasanThread.findMany({
      where: { status_moderasi: StatusModerasi.APPROVED },
      take: 4,
      orderBy: { created_at: "desc" },
      include: { author: { select: { name: true } } },
    }),
  ]).catch((error) => {
    console.error("[HomePage] Gagal mengambil data dari database:", error);
    return empty;
  });

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(65,182,226,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(117,177,61,0.1),transparent_45%)]"
        />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
          <p className="mai-fade text-xs font-semibold tracking-[0.24em] text-mai-red uppercase">
            Portal resmi
          </p>
          <h1 className="mai-rise mt-4 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] text-mai-dark sm:text-6xl md:text-7xl">
            Majelis Arah Indonesia
          </h1>
          <p
            className="mai-rise mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl"
            style={{ animationDelay: "80ms" }}
          >
            Wadah kolaborasi ulama, intelektual,
            serta profesional yang berkomitmen memberikan arah pemikiran,
            gagasan strategis, dan solusi konstruktif bagi kemajuan umat,
            bangsa, dan negara.
          </p>
          <div
            className="mai-rise mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "140ms" }}
          >
            <Link
              href="/publikasi"
              className="bg-mai-green px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5A8F2E]"
            >
              Baca berita
            </Link>
            <Link
              href="/tentang"
              className="border border-mai-blue bg-white px-5 py-3 text-sm font-medium text-mai-blue transition hover:bg-mai-blue/5"
            >
              Tentang MAI
            </Link>
          </div>
        </div>
      </section>

      {/* Tentang ringkas */}
      <section className="border-y border-slate-100 bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-mai-blue uppercase">
              Tentang MAI
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-mai-dark sm:text-4xl">
              Arah pemikiran yang jernih untuk bangsa
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-slate-600 lg:col-span-8">
            <p>
              Indonesia merupakan bangsa besar dengan keragaman sosial, budaya,
              agama, ekonomi, dan politik yang sangat kompleks. Perubahan global
              yang berlangsung cepat juga menghadirkan tantangan baru bagi
              kehidupan berbangsa, mulai dari ketahanan ekonomi dan pangan,
              perkembangan teknologi digital, dinamika demokrasi, hingga
              persoalan sosial dan keumatan.
            </p>
            <p>
              Di tengah kondisi tersebut, diperlukan lembaga yang mampu
              menghadirkan pandangan yang jernih, berbasis ilmu, berlandaskan
              nilai moral dan agama, serta berorientasi pada kepentingan bangsa.
              Atas dasar itulah Majelis Arah Indonesia hadir sebagai ruang
              bersama bagi ulama dan intelektual.
            </p>
            <Link
              href="/tentang"
              className="inline-flex items-center gap-2 text-sm font-medium text-mai-green transition hover:gap-3"
            >
              Selengkapnya tentang MAI <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Berita terkini */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-mai-red uppercase">
                Berita terkini
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-mai-dark sm:text-4xl">
                Wacana &amp; kabar terbaru
              </h2>
            </div>
            <Link
              href="/publikasi"
              className="rounded-lg border border-mai-blue px-4 py-2 text-sm font-medium text-mai-blue transition hover:bg-mai-blue/5"
            >
              Lihat Semua Berita
            </Link>
          </div>

          {berita.length === 0 ? (
            <p className="mt-10 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Belum ada berita yang dipublikasikan.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {berita.map((item) => (
                <article
                  key={item.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    href={`/publikasi/${item.slug}`}
                    className="flex h-full flex-col"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      <Image
                        src={item.cover_url}
                        alt={item.judul}
                        fill
                        className="object-cover object-center transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <div className="flex flex-grow flex-col p-5">
                      <p className="text-xs text-slate-500">
                        {formatDate(item.created_at)} · {item.author.name}
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-snug text-mai-dark">
                        {item.judul}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-grow text-sm text-slate-600">
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Opini & Gagasan */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-mai-green uppercase">
                Opini &amp; gagasan
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-mai-dark sm:text-4xl">
                Suara yang telah disetujui
              </h2>
            </div>
            <Link
              href="/ruang-gagasan"
              className="rounded-lg border border-mai-green px-4 py-2 text-sm font-medium text-mai-green transition hover:bg-mai-green/5"
            >
              Lihat Semua Gagasan
            </Link>
          </div>

          {gagasan.length === 0 ? (
            <p className="mt-10 rounded-xl border border-slate-100 bg-slate-50 p-8 text-center text-slate-500">
              Belum ada gagasan yang disetujui.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gagasan.map((item) => (
                <Link
                  key={item.id}
                  href={`/ruang-gagasan/${item.id}`}
                  className="group flex h-full cursor-pointer flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-mai-green/30 hover:bg-white hover:shadow-lg"
                >
                  <div>
                    <Quote
                      className="mb-4 h-5 w-5 text-mai-blue/70"
                      aria-hidden
                    />
                    <h3 className="font-[family-name:var(--font-display)] text-2xl leading-snug text-mai-dark transition group-hover:text-mai-blue">
                      {item.judul}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {item.konten}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      {item.author.name} · {formatDate(item.created_at)}
                    </p>
                    <p className="mt-2 text-sm font-medium text-mai-green">
                      Buka diskusi →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
