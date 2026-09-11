"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useActionState } from "react";
import {
  createGagasan,
  type GagasanActionState,
} from "@/lib/actions/gagasan";

const initialState: GagasanActionState = { ok: false, message: "" };

export function GagasanCreateForm() {
  const { data: session, status } = useSession();
  const [state, formAction, pending] = useActionState(
    createGagasan,
    initialState,
  );

  const canSubmit =
    session?.user?.role === "MEMBER" || session?.user?.role === "ADMIN";

  if (status === "loading") {
    return <p className="text-sm text-slate-500">Memuat sesi…</p>;
  }

  if (!canSubmit) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-600">
          Pengajuan gagasan hanya untuk akun{" "}
          <strong className="text-mai-dark">MEMBER</strong> atau{" "}
          <strong className="text-mai-dark">ADMIN</strong>.{" "}
          <Link href="/login" className="text-mai-blue hover:underline">
            Masuk
          </Link>{" "}
          dengan akun yang sesuai.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-mai-dark">Judul</span>
          <input
            name="judul"
            required
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
            placeholder="Judul gagasan"
          />
        </label>

        <label className="mt-4 block space-y-1.5">
          <span className="text-sm font-medium text-mai-dark">Konten</span>
          <textarea
            name="konten"
            required
            rows={8}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
            placeholder="Uraikan gagasan Anda…"
          />
        </label>
      </div>

      {state.message ? (
        <p className="text-sm text-mai-red" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-mai-green px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5A8F2E] disabled:opacity-60"
        >
          {pending ? "Mengirim…" : "Ajukan Gagasan"}
        </button>
        <Link
          href="/ruang-gagasan"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
