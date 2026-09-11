import { PengaturanForm } from "@/components/admin/PengaturanForm";
import { prisma } from "@/lib/prisma";

async function getSettingMap() {
  const rows = await prisma.pengaturanWeb.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export default async function AdminPengaturanPage() {
  const settings = await getSettingMap();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-mai-dark">
          Pengaturan Web
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Kelola informasi kontak dan tautan media sosial yang tampil di halaman
          publik.
        </p>
      </div>

      <PengaturanForm
        values={{
          alamat: settings.alamat ?? "",
          email: settings.email ?? "admin@mai.com",
          ig: settings.ig ?? "",
          x: settings.x ?? "",
          youtube: settings.youtube ?? "",
          facebook: settings.facebook ?? "",
        }}
      />
    </div>
  );
}
