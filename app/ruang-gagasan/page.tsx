import Link from "next/link";
import { Quote } from "lucide-react";
import { getServerSession } from "next-auth";
import { StatusModerasi } from "@prisma/client";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function RuangGagasanPage() {
  const session = await getServerSession(authOptions);
  const canSubmit =
    session?.user?.role === "MEMBER" || session?.user?.role === "ADMIN";

  const gagasan = await prisma.gagasanThread
    .findMany({
      where: { status_moderasi: StatusModerasi.APPROVED },
      orderBy: { created_at: "desc" },
      include: {
        author: { select: { name: true } },
        _count: { select: { balasan: true } },
      },
    })
    .catch((error) => {
      console.error("[RuangGagasanPage] Gagal mengambil data:", error);
      return [];
    });

  return (
    <div className="bg-white">
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-4 py-14 sm:px-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-mai-green uppercase">
              Forum diskusi
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-mai-dark sm:text-5xl">
              Ruang Gagasan
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
              Kumpulan gagasan yang telah disetujui. Klik kartu untuk membuka
              diskusi dan ikut menyampaikan tanggapan.
            </p>
          </div>

          {canSubmit ? (
            <Link
              href="/ruang-gagasan/buat"
              className="rounded-lg bg-mai-green px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5A8F2E]"
            >
              Ajukan Gagasan
            </Link>
          ) : session?.user ? (
            <p className="max-w-xs text-sm text-slate-500">
              Pengajuan gagasan tersedia untuk role MEMBER atau ADMIN.
            </p>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-mai-blue px-5 py-3 text-sm font-medium text-mai-blue transition hover:bg-mai-blue/5"
            >
              Login untuk mengajukan
            </Link>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {gagasan.length === 0 ? (
          <p className="rounded-xl border border-slate-100 bg-slate-50 p-10 text-center text-slate-500">
            Belum ada gagasan yang disetujui.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <h2 className="font-[family-name:var(--font-display)] text-2xl leading-snug text-mai-dark transition group-hover:text-mai-blue">
                    {item.judul}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {stripHtml(item.konten)}
                  </p>
                </div>
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400">
                    {item.author.name} · {formatDate(item.created_at)}
                    {item._count.balasan > 0
                      ? ` · ${item._count.balasan} balasan`
                      : ""}
                  </p>
                  <p className="mt-2 text-sm font-medium text-mai-green">
                    Buka diskusi →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
