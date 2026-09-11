"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  submitKontak,
  type KontakActionState,
} from "@/lib/actions/kontak";

const initialState: KontakActionState = { ok: false, message: "" };

export function KontakForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    submitKontak,
    initialState,
  );

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
    >
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-mai-dark">Nama</span>
        <input
          name="nama"
          required
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-mai-green"
          placeholder="Nama lengkap"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-mai-dark">Email</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-mai-green"
          placeholder="nama@email.com"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-mai-dark">Pesan</span>
        <textarea
          name="pesan"
          required
          rows={6}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-mai-green"
          placeholder="Tuliskan pesan Anda…"
        />
      </label>

      {state.message ? (
        <p
          className={`text-sm ${state.ok ? "text-mai-green" : "text-mai-red"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-mai-green px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5A8F2E] disabled:opacity-60"
      >
        {pending ? "Mengirim…" : "Kirim Pesan"}
      </button>
    </form>
  );
}
