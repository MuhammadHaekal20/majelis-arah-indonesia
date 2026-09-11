"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useRef } from "react";
import {
  createDiskusi,
  type DiskusiActionState,
} from "@/lib/actions/diskusi";

const initialState: DiskusiActionState = { ok: false, message: "" };

type FormKomentarProps = {
  publikasiId: string;
  slug: string;
};

export function FormKomentar({ publikasiId, slug }: FormKomentarProps) {
  const { data: session, status } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createDiskusi,
    initialState,
  );

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  if (status === "loading") {
    return <p className="text-sm text-slate-500">Memuat sesi pengguna…</p>;
  }

  if (!session?.user) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center">
        <p className="text-sm text-slate-600">
          Silakan{" "}
          <Link
            href="/login"
            className="font-medium text-mai-blue hover:underline"
          >
            Login
          </Link>{" "}
          untuk berkomentar.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="publikasi_id" value={publikasiId} />
      <input type="hidden" name="slug" value={slug} />
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-mai-dark">
          Tulis komentar sebagai {session.user.name}
        </span>
        <textarea
          name="konten"
          required
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
          placeholder="Sampaikan tanggapan Anda secara sopan dan konstruktif…"
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
        className="rounded-lg bg-mai-green px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5A8F2E] disabled:opacity-60"
      >
        {pending ? "Mengirim…" : "Kirim komentar"}
      </button>
    </form>
  );
}
