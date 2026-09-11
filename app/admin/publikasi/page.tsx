import Link from "next/link";
import { adminActionClass } from "@/components/admin/AdminButton";
import { deletePublikasi } from "@/lib/actions/publikasi";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AdminPublikasiPage() {
  const items = await prisma.publikasi.findMany({
    orderBy: { created_at: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-mai-dark">
            Publikasi
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Kelola artikel dan materi portal MAI.
          </p>
        </div>
        <Link href="/admin/publikasi/buat" className={adminActionClass("primary")}>
          + Buat Artikel
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Judul</th>
                <th className="px-4 py-3 font-semibold">Penulis</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Belum ada publikasi. Buat artikel pertama Anda.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-mai-dark">
                      {item.judul}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.author.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/publikasi/${item.slug}`}
                          className={adminActionClass("neutral")}
                          target="_blank"
                        >
                          Lihat
                        </Link>
                        <Link
                          href={`/admin/publikasi/${item.id}/edit`}
                          className={adminActionClass("primary")}
                        >
                          Edit
                        </Link>
                        <form action={deletePublikasi.bind(null, item.id)}>
                          <button
                            type="submit"
                            className={adminActionClass("danger")}
                          >
                            Hapus
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
