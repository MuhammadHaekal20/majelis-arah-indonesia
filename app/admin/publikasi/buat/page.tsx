import Link from "next/link";
import { PublikasiCreateForm } from "@/components/admin/PublikasiCreateForm";

export default function BuatPublikasiPage() {
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
          Buat Artikel
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Tulis dan publikasikan konten baru untuk portal MAI.
        </p>
      </div>

      <PublikasiCreateForm />
    </div>
  );
}
