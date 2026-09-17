import { completeEmailVerification } from "@/lib/actions/auth";
import Image from "next/image";
import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = await completeEmailVerification(token ?? "");
  const ok = result.ok;

  let title = "Email terverifikasi";
  let message = "Akun Anda sudah aktif. Silakan masuk.";

  if (!ok) {
    if (result.reason === "expired") {
      title = "Tautan kedaluwarsa";
      message =
        "Tautan verifikasi sudah tidak berlaku. Minta tautan baru dari halaman masuk.";
    } else {
      title = "Verifikasi gagal";
      message = "Tautan tidak valid. Periksa email terbaru atau minta tautan baru.";
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(65,182,226,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(117,177,61,0.12),transparent_50%),linear-gradient(160deg,#f8fafc_0%,#eef6fb_50%,#f1f5f9_100%)]"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo.png"
            alt="Majelis Arah Indonesia"
            width={180}
            height={130}
            className="h-24 w-auto object-contain"
          />
        </div>
        <h1 className="text-center font-[family-name:var(--font-display)] text-3xl text-mai-dark">
          {title}
        </h1>
        <p
          className={`mt-4 text-center text-sm ${ok ? "text-[#3f6f1f]" : "text-mai-red"}`}
          role={ok ? "status" : "alert"}
        >
          {message}
        </p>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            href={ok ? "/login?verified=1" : "/login?verify=1"}
            className="font-medium text-mai-blue underline-offset-2 hover:underline"
          >
            Kembali ke halaman masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
