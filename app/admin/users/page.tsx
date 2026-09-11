import { AdminButton } from "@/components/admin/AdminButton";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-mai-dark">
            Users
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Modul pengelolaan pengguna akan dilanjutkan pada tahap berikutnya.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton variant="primary">Simpan</AdminButton>
          <AdminButton variant="neutral">Lihat</AdminButton>
          <AdminButton variant="danger">Hapus</AdminButton>
          <AdminButton variant="secondary">Kembali</AdminButton>
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Tabel pengguna akan ditampilkan di sini.
        </p>
      </div>
    </div>
  );
}
