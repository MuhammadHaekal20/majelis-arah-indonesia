import { adminActionClass } from "@/components/admin/AdminButton";
import { moderateDiskusi } from "@/lib/actions/diskusi";
import { prisma } from "@/lib/prisma";
import { StatusModerasi } from "@/app/generated/prisma/client";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminKomentarPage() {
  const items = await prisma.diskusi.findMany({
    where: { status_moderasi: StatusModerasi.PENDING },
    orderBy: { created_at: "asc" },
    include: {
      user: { select: { name: true, email: true } },
      publikasi: { select: { judul: true, slug: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-mai-dark">
          Moderasi Komentar
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Tinjau komentar yang menunggu persetujuan.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Komentar</th>
                <th className="px-4 py-3 font-semibold">Artikel</th>
                <th className="px-4 py-3 font-semibold">Pengirim</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Tidak ada komentar pending.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-50 align-top last:border-0"
                  >
                    <td className="max-w-sm px-4 py-3 text-slate-700">
                      <p className="whitespace-pre-wrap">{item.konten}</p>
                    </td>
                    <td className="px-4 py-3 text-mai-dark">
                      {item.publikasi.judul}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <p>{item.user.name}</p>
                      <p className="text-xs text-slate-400">{item.user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <form
                          action={moderateDiskusi.bind(null, item.id, "APPROVED")}
                        >
                          <button
                            type="submit"
                            className={adminActionClass("primary")}
                          >
                            Setujui
                          </button>
                        </form>
                        <form
                          action={moderateDiskusi.bind(null, item.id, "REJECTED")}
                        >
                          <button
                            type="submit"
                            className={adminActionClass("danger")}
                          >
                            Tolak
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
