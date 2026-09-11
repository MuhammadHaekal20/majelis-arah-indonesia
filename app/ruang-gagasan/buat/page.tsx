import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { GagasanCreateForm } from "@/components/gagasan/GagasanCreateForm";
import { authOptions } from "@/lib/authOptions";

export default async function BuatGagasanPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  const canSubmit = role === "MEMBER" || role === "ADMIN";

  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Link
          href="/ruang-gagasan"
          className="text-sm font-medium text-mai-blue hover:underline"
        >
          ← Kembali ke Ruang Gagasan
        </Link>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-mai-dark">
          Ajukan Gagasan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Gagasan baru akan berstatus pending dan baru tayang setelah disetujui
          admin.
        </p>

        <div className="mt-8">
          {canSubmit ? (
            <GagasanCreateForm />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
              Akun Anda telah login, tetapi pengajuan gagasan hanya tersedia
              untuk role <strong>MEMBER</strong> atau <strong>ADMIN</strong>.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
