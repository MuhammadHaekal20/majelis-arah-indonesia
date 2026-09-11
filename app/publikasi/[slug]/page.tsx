import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusModerasi } from "@prisma/client";
import { FormKomentar } from "@/components/publikasi/FormKomentar";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function PublikasiDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const item = await prisma.publikasi.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      diskusi: {
        where: { status_moderasi: StatusModerasi.APPROVED },
        orderBy: { created_at: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!item) {
    notFound();
  }

  return (
    <article className="bg-white">
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <Link
            href="/publikasi"
            className="text-sm font-medium text-mai-blue hover:underline"
          >
            ← Semua publikasi
          </Link>
          <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-mai-green uppercase">
            Artikel
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-tight text-mai-dark sm:text-5xl">
            {item.judul}
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            {formatDate(item.created_at)} · Ditulis oleh {item.author.name}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {item.excerpt}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={item.cover_url}
            alt={item.judul}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        <div
          className="prose prose-slate max-w-none prose-headings:font-[family-name:var(--font-display)] prose-headings:text-mai-dark prose-a:text-mai-blue prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: item.konten }}
        />

        <section className="mt-14 border-t border-slate-100 pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-mai-blue uppercase">
                Tanggapan pembaca
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-mai-dark">
                Komentar
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {item.diskusi.length} komentar pada berita ini
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {item.diskusi.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                Belum ada komentar. Jadilah yang pertama menanggapi.
              </p>
            ) : (
              item.diskusi.map((diskusi) => (
                <div
                  key={diskusi.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-5 shadow-sm transition hover:bg-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-mai-dark">
                      {diskusi.user.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(diskusi.created_at)}
                    </p>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {diskusi.konten}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <FormKomentar publikasiId={item.id} slug={item.slug} />
          </div>
        </section>
      </div>
    </article>
  );
}
