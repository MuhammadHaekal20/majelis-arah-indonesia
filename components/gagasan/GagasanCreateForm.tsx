"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createGagasan,
  type GagasanActionState,
} from "@/lib/actions/gagasan";

const initialState: GagasanActionState = { ok: false, message: "" };

type GagasanCreateFormProps = {
  /** Admin: gagasan langsung tayang tanpa antre moderasi. */
  isAdmin?: boolean;
};

export function GagasanCreateForm({ isAdmin = false }: GagasanCreateFormProps) {
  const [state, formAction, pending] = useActionState(
    createGagasan,
    initialState,
  );

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
          {pending
            ? "Mengirim…"
            : isAdmin
              ? "Publikasikan Gagasan"
              : "Ajukan Gagasan"}
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
