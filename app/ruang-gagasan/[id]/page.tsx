import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusModerasi } from "@/app/generated/prisma/client";
import { FormBalasanGagasan } from "@/components/gagasan/FormBalasanGagasan";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
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

export default async function GagasanDetailPage({ params }: PageProps) {
  const { id } = await params;

  const gagasan = await prisma.gagasanThread.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      balasan: {
        orderBy: { created_at: "asc" },
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!gagasan || gagasan.status_moderasi !== StatusModerasi.APPROVED) {
    notFound();
  }

  return (
    <article className="bg-white">
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <Link
            href="/ruang-gagasan"
            className="text-sm font-medium text-mai-blue hover:underline"
          >
            ← Kembali ke Ruang Gagasan
          </Link>
          <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-mai-green uppercase">
            Diskusi gagasan
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-tight text-mai-dark sm:text-5xl">
            {gagasan.judul}
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            {formatDate(gagasan.created_at)} · Diajukan oleh{" "}
            {gagasan.author.name}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="prose prose-slate max-w-none whitespace-pre-wrap prose-headings:font-[family-name:var(--font-display)] prose-headings:text-mai-dark prose-a:text-mai-blue prose-p:leading-relaxed">
          {gagasan.konten}
        </div>

        <section className="mt-14 border-t border-slate-100 pt-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-mai-blue uppercase">
              Forum diskusi
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-mai-dark">
              Tanggapan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {gagasan.balasan.length} balasan pada gagasan ini
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {gagasan.balasan.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                Belum ada tanggapan. Jadilah yang pertama berdiskusi.
              </p>
            ) : (
              gagasan.balasan.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-5 shadow-sm transition hover:bg-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-mai-dark">
                      {item.user.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {item.konten}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-8">
            <FormBalasanGagasan gagasanId={gagasan.id} />
          </div>
        </section>
      </div>
    </article>
  );
}
