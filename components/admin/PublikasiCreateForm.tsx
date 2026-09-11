"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import {
  createPublikasi,
  type PublikasiActionState,
} from "@/lib/actions/publikasi";

const initialState: PublikasiActionState = { ok: false, message: "" };

export function PublikasiCreateForm() {
  const [konten, setKonten] = useState("");
  const [coverName, setCoverName] = useState("");
  const [state, formAction, pending] = useActionState(
    createPublikasi,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">Judul</span>
            <input
              name="judul"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
              placeholder="Judul artikel"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">
              Excerpt (Singkatan)
            </span>
            <textarea
              name="excerpt"
              required
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
              placeholder="Ringkasan singkat untuk kartu publikasi"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">
              Cover Image
            </span>
            <input
              name="cover"
              type="file"
              accept="image/*"
              required
              onChange={(event) =>
                setCoverName(event.target.files?.[0]?.name ?? "")
              }
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-mai-blue file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#0D7EB0]"
            />
            {coverName ? (
              <p className="text-xs text-slate-500">Dipilih: {coverName}</p>
            ) : null}
          </label>

          <div className="space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">Konten</span>
            <input type="hidden" name="konten" value={konten} />
            <RichTextEditor
              value={konten}
              onChange={setKonten}
              placeholder="Tulis isi artikel. Sisipkan gambar lewat tombol image di toolbar."
            />
          </div>
        </div>
      </div>

      {state.message ? (
        <p className="text-sm text-mai-red" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <AdminButton type="submit" variant="primary" disabled={pending}>
          {pending ? "Menyimpan…" : "Publikasikan"}
        </AdminButton>
        <Link
          href="/admin/publikasi"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
