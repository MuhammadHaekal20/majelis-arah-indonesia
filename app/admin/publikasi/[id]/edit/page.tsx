import Link from "next/link";
import { notFound } from "next/navigation";
import { PublikasiEditForm } from "@/components/admin/PublikasiEditForm";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPublikasiPage({ params }: PageProps) {
  const { id } = await params;

  const item = await prisma.publikasi.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/publikasi"
          className="text-sm font-medium text-mai-blue hover:underline"
        >
          ← Kembali ke daftar
        </Link>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-mai-dark">
          Edit Artikel
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Perbarui judul, excerpt, cover, atau konten artikel.
        </p>
      </div>

      <PublikasiEditForm
        id={item.id}
        initial={{
          judul: item.judul,
          excerpt: item.excerpt,
          konten: item.konten,
          cover_url: item.cover_url,
        }}
      />
    </div>
  );
}
