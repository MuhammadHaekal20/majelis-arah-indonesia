import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { adminActionClass } from "@/components/admin/AdminButton";
import { deletePesan } from "@/lib/actions/kontak";
import { authOptions } from "@/lib/authOptions";
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

export default async function AdminPesanDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    notFound();
  }

  const { id } = await params;

  const item = await prisma.pesanKontak.findUnique({ where: { id } });
  if (!item) {
    notFound();
  }

  if (!item.is_read) {
    await prisma.pesanKontak.update({
      where: { id },
      data: { is_read: true },
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/pesan"
          className="text-sm font-medium text-mai-blue hover:underline"
        >
          ← Kembali ke pesan masuk
        </Link>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-mai-dark">
          Detail pesan
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {formatDate(item.created_at)}
          {item.is_read ? " · Dibaca" : " · Baru (ditandai dibaca saat dibuka)"}
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Nama</dt>
            <dd className="mt-1 text-base text-mai-dark">{item.nama}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Email</dt>
            <dd className="mt-1">
              <a
                href={`mailto:${item.email}`}
                className="text-mai-blue hover:underline"
              >
                {item.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Pesan</dt>
            <dd className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50 px-4 py-4 text-base leading-relaxed text-slate-800">
              {item.pesan}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${item.email}?subject=${encodeURIComponent(`Balasan MAI — pesan dari ${item.nama}`)}`}
            className={adminActionClass("neutral")}
          >
            Balas via email
          </a>
          <form action={deletePesan.bind(null, item.id)}>
            <button type="submit" className={adminActionClass("danger")}>
              Hapus pesan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
