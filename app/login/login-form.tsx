"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, Suspense, useState } from "react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import {
  isUnverifiedEmail,
  resendVerificationEmail,
} from "@/lib/actions/auth";

function oauthErrorMessage(
  code: string | null,
  googleCallbackUrl: string,
): string {
  if (!code) {
    return "";
  }

  if (code === "OAuthSignin" || code === "Configuration") {
    return "Login Google gagal. Periksa GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET.";
  }

  if (code === "OAuthCallback" || code === "Callback") {
    return `Callback Google ditolak (redirect_uri_mismatch). Di Google Cloud Console, tambahkan URI ini persis: ${googleCallbackUrl}`;
  }

  if (code === "AccessDenied") {
    return "Akses Google ditolak.";
  }

  return "Login Google gagal. Coba lagi.";
}

function LoginForm({
  googleEnabled,
  googleCallbackUrl,
}: {
  googleEnabled: boolean;
  googleCallbackUrl: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    oauthErrorMessage(searchParams.get("error"), googleCallbackUrl),
  );
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const registered = searchParams.get("registered") === "1";
  const needsVerify = searchParams.get("verify") === "1";
  const verified = searchParams.get("verified") === "1";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (await isUnverifiedEmail(email)) {
        setError(
          "Email belum diverifikasi. Cek kotak masuk (dan folder spam), lalu klik tautannya.",
        );
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau kata sandi tidak valid.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setInfo("");
    setResending(true);
    try {
      const formData = new FormData();
      formData.set("email", email);
      const result = await resendVerificationEmail(formData);
      if (result.ok) {
        setInfo(result.message);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Gagal mengirim ulang tautan verifikasi.");
    } finally {
      setResending(false);
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
          Masuk
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Masuk untuk mengakses CMS dan ruang anggota.
        </p>

        {registered ? (
          <p
            className="mt-6 rounded-lg border border-mai-green/30 bg-mai-green/10 px-3 py-2.5 text-center text-sm text-[#3f6f1f]"
            role="status"
          >
            Registrasi berhasil. Silakan masuk.
          </p>
        ) : null}

        {needsVerify ? (
          <p
            className="mt-6 rounded-lg border border-mai-green/30 bg-mai-green/10 px-3 py-2.5 text-center text-sm text-[#3f6f1f]"
            role="status"
          >
            Kami telah mengirim tautan verifikasi ke email Anda. Klik tautan
            itu sebelum masuk.
          </p>
        ) : null}

        {verified ? (
          <p
            className="mt-6 rounded-lg border border-mai-green/30 bg-mai-green/10 px-3 py-2.5 text-center text-sm text-[#3f6f1f]"
            role="status"
          >
            Email berhasil diverifikasi. Silakan masuk.
          </p>
        ) : null}

        {info ? (
          <p
            className="mt-6 rounded-lg border border-mai-green/30 bg-mai-green/10 px-3 py-2.5 text-center text-sm text-[#3f6f1f]"
            role="status"
          >
            {info}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
              placeholder="nama@email.com"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p className="text-sm text-mai-red" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-mai-green px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#5A8F2E] disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={resending || !email}
          className="mt-3 w-full text-center text-xs font-medium text-mai-blue underline-offset-2 hover:underline disabled:opacity-50"
        >
          {resending ? "Mengirim ulang..." : "Kirim ulang tautan verifikasi"}
        </button>

        <div className="mt-6 flex items-center gap-3 text-xs tracking-wide text-slate-400 uppercase">
          <span className="h-px flex-1 bg-slate-200" />
          atau
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleSignInButton
          enabled={googleEnabled}
          callbackHint={googleCallbackUrl}
        />

        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-mai-blue underline-offset-2 hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage({
  googleEnabled,
  googleCallbackUrl,
}: {
  googleEnabled: boolean;
  googleCallbackUrl: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center text-sm text-slate-500">
          Memuat...
        </div>
      }
    >
      <LoginForm
        googleEnabled={googleEnabled}
        googleCallbackUrl={googleCallbackUrl}
      />
    </Suspense>
  );
}
