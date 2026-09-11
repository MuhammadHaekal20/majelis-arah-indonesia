"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import {
  registerUser,
  type RegisterState,
} from "@/app/register/actions";

const initialState: RegisterState = { ok: false, message: "" };

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialState,
  );

  useEffect(() => {
    if (state.ok) {
      const timer = setTimeout(() => router.push("/login"), 800);
      return () => clearTimeout(timer);
    }
  }, [state.ok, router]);

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(249,107,42,0.14),_transparent_50%),linear-gradient(200deg,#f4f8fb_0%,#e3f2f9_50%,#eef6fb_100%)]"
      />
      <div className="mai-rise relative w-full max-w-md border border-primary/20 bg-white/95 p-8 shadow-[0_24px_60px_rgba(13,126,176,0.14)] backdrop-blur-sm">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logo.png"
            alt="Majelis Arah Indonesia"
            width={160}
            height={116}
            priority
            className="h-24 w-auto object-contain"
          />
        </div>

        <p className="text-center text-xs font-semibold tracking-[0.2em] text-primary-dark uppercase">
          Bergabung
        </p>
        <h1 className="mt-2 text-center font-[family-name:var(--font-display)] text-4xl text-mai-navy">
          Daftar akun
        </h1>
        <p className="mt-2 text-center text-sm text-[var(--mai-muted)]">
          Buat akun baru untuk mengikuti publikasi dan menyampaikan gagasan.
        </p>

        <form action={formAction} className="mt-8 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-navy">Nama</span>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full border border-primary/25 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="Nama lengkap"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-navy">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-primary/25 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="nama@email.com"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-navy">Kata sandi</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full border border-primary/25 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="Minimal 6 karakter"
            />
          </label>

          {state.message ? (
            <p
              className={`text-sm ${state.ok ? "text-secondary-dark" : "text-accent-dark"}`}
              role="status"
            >
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {pending ? "Menyimpan…" : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--mai-muted)]">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-primary-dark underline-offset-2 hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
