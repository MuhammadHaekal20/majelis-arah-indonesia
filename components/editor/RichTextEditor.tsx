"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p className="text-sm text-slate-500">Loading editor...</p>,
});

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    throw new Error(data.error ?? "Gagal mengunggah gambar.");
  }

  return data.url;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis konten…",
  className,
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "link", "image"],
          ["clean"],
        ],
        handlers: {
          image: function (this: { quill: { getSelection: (focus?: boolean) => { index: number } | null; getLength: () => number; insertEmbed: (index: number, type: string, value: string) => void; setSelection: (index: number, length: number) => void } }) {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;

              try {
                const url = await uploadImage(file);
                const quill = this.quill;
                const range = quill.getSelection(true);
                const index = range?.index ?? quill.getLength();
                quill.insertEmbed(index, "image", url);
                quill.setSelection(index + 1, 0);
              } catch (error) {
                const message =
                  error instanceof Error
                    ? error.message
                    : "Gagal mengunggah gambar.";
                window.alert(message);
              }
            };
          },
        },
      },
    }),
    [],
  );

  return (
    <div className={`rich-text-editor bg-white ${className ?? ""}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
