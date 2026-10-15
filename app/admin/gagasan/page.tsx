import Link from "next/link";
import { StatusModerasi } from "@/app/generated/prisma/client";
import { adminActionClass } from "@/components/admin/AdminButton";
import { deleteGagasan, moderateGagasan } from "@/lib/actions/gagasan";
import { stripHtml } from "@/lib/html";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusLabel(status: StatusModerasi) {
  switch (status) {
    case StatusModerasi.APPROVED:
      return { text: "Tayang", className: "bg-mai-green/10 text-mai-green" };
    case StatusModerasi.REJECTED:
      return { text: "Ditolak", className: "bg-mai-red/10 text-mai-red" };
    default:
      return { text: "Pending", className: "bg-amber-100 text-amber-800" };
  }
}

export default async function AdminGagasanPage() {
  const items = await prisma.gagasanThread.findMany({
    orderBy: { created_at: "desc" },
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { balasan: true } },
    },
  });

  const pendingCount = items.filter(
    (item) => item.status_moderasi === StatusModerasi.PENDING,
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-mai-dark">
            Moderasi Gagasan
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {pendingCount > 0
              ? `${pendingCount} gagasan menunggu persetujuan. Hapus menghilangkan gagasan beserta balasannya.`
              : "Kelola semua gagasan. Hapus menghilangkan gagasan beserta balasannya."}
          </p>
        </div>
        <Link
          href="/ruang-gagasan/buat"
          className={adminActionClass("primary")}
        >
          Buat gagasan
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Judul</th>
                <th className="px-4 py-3 font-semibold">Konten</th>
                <th className="px-4 py-3 font-semibold">Pengirim</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Belum ada gagasan.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const status = statusLabel(item.status_moderasi);
                  const isPending =
                    item.status_moderasi === StatusModerasi.PENDING;

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-slate-50 align-top last:border-0"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold tracking-wide uppercase ${status.className}`}
                        >
                          {status.text}
                        </span>
                        {item._count.balasan > 0 ? (
                          <p className="mt-1 text-xs text-slate-400">
                            {item._count.balasan} balasan
                          </p>
                        ) : null}
                      </td>
                      <td className="max-w-[12rem] px-4 py-3 font-medium text-mai-dark">
                        {item.judul}
                      </td>
                      <td className="max-w-sm px-4 py-3 text-slate-700">
                        <p className="line-clamp-4">{stripHtml(item.konten)}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p>{item.author.name}</p>
                        <p className="text-xs text-slate-400">
                          {item.author.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {item.status_moderasi === StatusModerasi.APPROVED ? (
                            <Link
                              href={`/ruang-gagasan/${item.id}`}
                              className={adminActionClass("neutral")}
                              target="_blank"
                            >
                              Lihat
                            </Link>
                          ) : null}
                          {isPending ? (
                            <>
                              <form
                                action={moderateGagasan.bind(
                                  null,
                                  item.id,
                                  "APPROVED",
                                )}
                              >
                                <button
                                  type="submit"
                                  className={adminActionClass("primary")}
                                >
                                  Setujui
                                </button>
                              </form>
                              <form
                                action={moderateGagasan.bind(
                                  null,
                                  item.id,
                                  "REJECTED",
                                )}
                              >
                                <button
                                  type="submit"
                                  className={adminActionClass("secondary")}
                                >
                                  Tolak
                                </button>
                              </form>
                            </>
                          ) : null}
                          <form action={deleteGagasan.bind(null, item.id)}>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
