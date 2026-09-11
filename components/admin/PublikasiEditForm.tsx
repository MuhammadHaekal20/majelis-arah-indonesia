"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { AdminButton } from "@/components/admin/AdminButton";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import {
  updatePublikasi,
  type PublikasiActionState,
} from "@/lib/actions/publikasi";

const initialState: PublikasiActionState = { ok: false, message: "" };

type PublikasiEditFormProps = {
  id: string;
  initial: {
    judul: string;
    excerpt: string;
    konten: string;
    cover_url: string;
  };
};

export function PublikasiEditForm({ id, initial }: PublikasiEditFormProps) {
  const [konten, setKonten] = useState(initial.konten);
  const [coverName, setCoverName] = useState("");
  const boundAction = updatePublikasi.bind(null, id);
  const [state, formAction, pending] = useActionState(
    boundAction,
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
              defaultValue={initial.judul}
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
              defaultValue={initial.excerpt}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
              placeholder="Ringkasan singkat untuk kartu publikasi"
            />
          </label>

          <div className="space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">
              Cover Image
            </span>
            {initial.cover_url ? (
              <div className="relative mb-3 aspect-[16/9] max-w-md overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                <Image
                  src={initial.cover_url}
                  alt="Cover saat ini"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
            ) : null}
            <input
              name="cover"
              type="file"
              accept="image/*"
              onChange={(event) =>
                setCoverName(event.target.files?.[0]?.name ?? "")
              }
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-mai-blue file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#0D7EB0]"
            />
            <p className="text-xs text-slate-500">
              Kosongkan jika ingin mempertahankan cover lama.
              {coverName ? ` File baru: ${coverName}` : ""}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-sm font-medium text-mai-dark">Konten</span>
            <input type="hidden" name="konten" value={konten} />
            <RichTextEditor
              value={konten}
              onChange={setKonten}
              placeholder="Perbarui isi artikel…"
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
          {pending ? "Menyimpan…" : "Simpan perubahan"}
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
