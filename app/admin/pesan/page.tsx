import { adminActionClass } from "@/components/admin/AdminButton";
import { deletePesan, markPesanRead } from "@/lib/actions/kontak";
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

function truncate(text: string, max = 80) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

export default async function AdminPesanPage() {
  const items = await prisma.pesanKontak.findMany({
    orderBy: { created_at: "desc" },
  });

  const unread = items.filter((item) => !item.is_read).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-mai-dark">
          Pesan Masuk
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {unread > 0
            ? `${unread} pesan belum dibaca dari formulir kontak.`
            : "Semua pesan sudah ditandai dibaca."}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Pesan</th>
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
                    Belum ada pesan masuk.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-50 align-top last:border-0 ${
                      item.is_read ? "bg-white" : "bg-mai-blue/5"
                    }`}
                  >
                    <td className="px-4 py-3">
                      {item.is_read ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                          Dibaca
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-mai-red/10 px-2 py-1 text-[10px] font-semibold tracking-wide text-mai-red uppercase">
                          <span className="h-1.5 w-1.5 rounded-full bg-mai-red" />
                          Baru
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-mai-dark">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <a
                        href={`mailto:${item.email}`}
                        className="text-mai-blue hover:underline"
                      >
                        {item.email}
                      </a>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-slate-700">
                      <p title={item.pesan}>{truncate(item.pesan)}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {!item.is_read ? (
                          <form action={markPesanRead.bind(null, item.id)}>
                            <button
                              type="submit"
                              className={adminActionClass("neutral")}
                            >
                              Tandai dibaca
                            </button>
                          </form>
                        ) : null}
                        <form action={deletePesan.bind(null, item.id)}>
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
