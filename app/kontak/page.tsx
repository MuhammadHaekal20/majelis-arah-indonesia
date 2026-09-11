import { ExternalLink, Globe, Mail, MapPin, Share2 } from "lucide-react";
import { KontakForm } from "@/components/kontak/KontakForm";
import { prisma } from "@/lib/prisma";

async function getSettings() {
  const rows = await prisma.pengaturanWeb.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

const SOCIAL_META = [
  { key: "ig", label: "Instagram" },
  { key: "x", label: "X (Twitter)" },
  { key: "youtube", label: "YouTube" },
  { key: "facebook", label: "Facebook" },
] as const;

export default async function KontakPage() {
  const settings = await getSettings();
  const email = settings.email || "admin@mai.com";
  const alamat = settings.alamat || "Indonesia";
  const socials = SOCIAL_META.filter((item) => settings[item.key]?.trim());

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold tracking-[0.24em] text-mai-red uppercase">
            Hubungi kami
          </p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl text-mai-dark sm:text-5xl md:text-6xl">
            Mari membangun dialog gagasan bersama
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Sampaikan pertanyaan, kolaborasi, atau masukan untuk Majelis Arah
            Indonesia.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-mai-blue uppercase">
                Informasi kontak
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-mai-dark sm:text-4xl">
                Tim sekretariat siap membantu
              </h2>
            </div>

            <a
              href={`mailto:${email}`}
              className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-mai-green/40 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mai-dark text-mai-green">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-slate-500">Email resmi</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-mai-dark transition group-hover:text-mai-green">
                  {email}
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mai-dark text-mai-blue">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-slate-500">Alamat</p>
                <p className="mt-1 whitespace-pre-wrap font-[family-name:var(--font-display)] text-2xl leading-snug text-mai-dark">
                  {alamat}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mai-dark text-mai-red">
                  <Share2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-slate-500">Media sosial</p>
                  <p className="font-[family-name:var(--font-display)] text-xl text-mai-dark">
                    Kanal resmi MAI
                  </p>
                </div>
              </div>

              {socials.length === 0 ? (
                <p className="mt-5 text-sm text-slate-500">
                  Tautan media sosial belum diatur di CMS Pengaturan.
                </p>
              ) : (
                <div className="mt-5 flex flex-wrap gap-3">
                  {socials.map((item) => (
                    <a
                      key={item.key}
                      href={settings[item.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-mai-blue hover:text-mai-blue"
                    >
                      {item.key === "ig" || item.key === "youtube" ? (
                        <Globe className="h-4 w-4" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-mai-green uppercase">
              Formulir pesan
            </p>
            <KontakForm />
          </div>
        </div>
      </section>
    </div>
  );
}
