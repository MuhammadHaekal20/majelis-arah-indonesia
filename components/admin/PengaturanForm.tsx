"use client";

import { useActionState } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import {
  savePengaturanWeb,
  type PengaturanActionState,
} from "@/lib/actions/kontak";

const initialState: PengaturanActionState = { ok: false, message: "" };

type PengaturanFormProps = {
  values: {
    alamat: string;
    email: string;
    ig: string;
    x: string;
    youtube: string;
    facebook: string;
  };
};

export function PengaturanForm({ values }: PengaturanFormProps) {
  const [state, formAction, pending] = useActionState(
    savePengaturanWeb,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="font-[family-name:var(--font-display)] text-xl text-mai-dark">
          Informasi kontak
        </h3>
        <div className="mt-4 grid gap-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">
              Alamat lengkap
            </span>
            <textarea
              name="alamat"
              rows={3}
              defaultValue={values.alamat}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-mai-blue"
              placeholder="Alamat sekretariat MAI"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">
              Email resmi
            </span>
            <input
              name="email"
              type="email"
              defaultValue={values.email}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-mai-blue"
              placeholder="admin@mai.com"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="font-[family-name:var(--font-display)] text-xl text-mai-dark">
          Media sosial
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Isi URL lengkap (contoh: https://instagram.com/mai).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">Instagram</span>
            <input
              name="ig"
              defaultValue={values.ig}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-mai-blue"
              placeholder="https://instagram.com/..."
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">X (Twitter)</span>
            <input
              name="x"
              defaultValue={values.x}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-mai-blue"
              placeholder="https://x.com/..."
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">YouTube</span>
            <input
              name="youtube"
              defaultValue={values.youtube}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-mai-blue"
              placeholder="https://youtube.com/..."
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">Facebook</span>
            <input
              name="facebook"
              defaultValue={values.facebook}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-mai-blue"
              placeholder="https://facebook.com/..."
            />
          </label>
        </div>
      </section>

      {state.message ? (
        <p
          className={`text-sm ${state.ok ? "text-mai-green" : "text-mai-red"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <AdminButton type="submit" variant="primary" disabled={pending}>
        {pending ? "Menyimpan…" : "Simpan pengaturan"}
      </AdminButton>
    </form>
  );
}
