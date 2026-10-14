"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import {
  createGagasan,
  type GagasanActionState,
} from "@/lib/actions/gagasan";
import { extractDocxToGagasan } from "@/lib/docx";

const initialState: GagasanActionState = { ok: false, message: "" };

type InputMode = "editor" | "word";

type GagasanCreateFormProps = {
  /** Admin: gagasan langsung tayang tanpa antre moderasi. */
  isAdmin?: boolean;
};

export function GagasanCreateForm({ isAdmin = false }: GagasanCreateFormProps) {
  const [state, formAction, pending] = useActionState(
    createGagasan,
    initialState,
  );
  const [mode, setMode] = useState<InputMode>("editor");
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importNote, setImportNote] = useState("");
  const [wordName, setWordName] = useState("");

  async function handleWordFile(file: File | undefined) {
    if (!file) return;

    setImporting(true);
    setImportError("");
    setImportNote("");
    setWordName(file.name);

    try {
      const extracted = await extractDocxToGagasan(file);
      setJudul(extracted.judul);
      setKonten(extracted.konten);
      setMode("editor");
      setImportNote(
        "Dokumen berhasil diekstrak. Periksa judul & isi di editor sebelum mengirim. Gambar dari Word tidak ikut diimpor.",
      );
    } catch (error) {
      setImportError(
        error instanceof Error
          ? error.message
          : "Gagal membaca file Word.",
      );
    } finally {
      setImporting(false);
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("editor")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === "editor"
                ? "bg-mai-green text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
            }`}
          >
            Editor WYSIWYG
          </button>
          <button
            type="button"
            onClick={() => setMode("word")}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              mode === "word"
                ? "bg-mai-green text-white"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
            }`}
          >
            Impor Word (.docx)
          </button>
        </div>

        {mode === "word" ? (
          <div className="mt-5 space-y-3">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-mai-dark">
                Unggah dokumen Word
              </span>
              <input
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                disabled={importing || pending}
                onChange={(event) => {
                  void handleWordFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-mai-blue file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#0D7EB0]"
              />
            </label>
            <p className="text-xs text-slate-500">
              Format .docx saja (maks. 8MB). Setelah diekstrak, Anda bisa
              menyunting di Editor WYSIWYG.
              {wordName ? ` File: ${wordName}` : ""}
            </p>
            {importing ? (
              <p className="text-sm text-slate-500">Mengekstrak dokumen…</p>
            ) : null}
            {importError ? (
              <p className="text-sm text-mai-red" role="alert">
                {importError}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {importNote ? (
              <p className="rounded-lg border border-mai-green/30 bg-mai-green/5 px-3 py-2 text-sm text-slate-700">
                {importNote}
              </p>
            ) : null}

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-mai-dark">Judul</span>
              <input
                name="judul"
                required
                value={judul}
                onChange={(event) => setJudul(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-mai-blue"
                placeholder="Judul gagasan"
              />
            </label>

            <div className="space-y-1.5">
              <span className="text-sm font-medium text-mai-dark">Konten</span>
              <input type="hidden" name="konten" value={konten} />
              <RichTextEditor
                value={konten}
                onChange={setKonten}
                placeholder="Uraikan gagasan Anda, atau impor dari Word lalu sunting di sini…"
              />
            </div>
          </div>
        )}
      </div>

      {state.message ? (
        <p className="text-sm text-mai-red" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending || importing || mode === "word"}
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
      {mode === "word" ? (
        <p className="text-xs text-slate-500">
          Impor dulu file Word-nya — setelah sukses, form berpindah ke editor
          untuk Anda tinjau dan kirim.
        </p>
      ) : null}
    </form>
  );
}
