"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { registerUser } from "@/lib/actions/auth";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function RegisterForm({
  googleEnabled,
  googleCallbackUrl,
}: {
  googleEnabled: boolean;
  googleCallbackUrl: string;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setPending(true);
    try {
      const result = await registerUser(formData);
      if (result && !result.ok) {
        setError(result.message);
      }
    } catch {
      setError("Pendaftaran gagal. Periksa koneksi database lalu coba lagi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(65,182,226,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(117,177,61,0.12),transparent_50%),linear-gradient(160deg,#f8fafc_0%,#eef6fb_50%,#f1f5f9_100%)]"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo.png"
            alt="Majelis Arah Indonesia"
            width={180}
            height={130}
            priority
            className="h-24 w-auto object-contain"
          />
        </div>

        <p className="text-center text-xs font-semibold tracking-[0.22em] text-mai-blue uppercase">
          Portal MAI
        </p>
        <h1 className="mt-2 text-center font-[family-name:var(--font-display)] text-4xl text-mai-dark">
          Daftar akun
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Buat akun untuk mengikuti berita dan menyampaikan gagasan.
        </p>

        <form action={handleSubmit} className="mt-8 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">
              Nama Lengkap
            </span>
            <input
              name="name"
              type="text"
              required
              maxLength={120}
              autoComplete="name"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
              placeholder="Nama lengkap"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
              placeholder="nama@email.com"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
              placeholder="Minimal 8 karakter"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">
              Konfirmasi Password
            </span>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
              placeholder="Ulangi kata sandi"
            />
          </label>

          {error ? (
            <p className="text-sm text-mai-red" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-mai-green px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#5A8F2E] disabled:opacity-60"
          >
            {pending ? "Menyimpan..." : "Daftar"}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3 text-xs tracking-wide text-slate-400 uppercase">
          <span className="h-px flex-1 bg-slate-200" />
          atau
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleSignInButton
          label="Daftar dengan Google"
          enabled={googleEnabled}
          callbackHint={googleCallbackUrl}
        />

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-mai-blue underline-offset-2 hover:underline"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
