import { MapPin, Phone } from "lucide-react";

const CONTACT = {
  org: "Majelis Arah Indonesia",
  addressLines: [
    "Jl. Pengukiran III Gg. 1 No. 19",
    "RT 4 / RW 3, Pekojan",
    "Kec. Tambora, Jakarta Barat 11240",
  ],
  phoneDisplay: "0813-5631-5423",
  phoneTel: "+6281356315423",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Jl Pengukiran III Gg 1 No 19 RT 4 RW 3 Pekojan Kec Tambora Jakarta Barat 11240",
    ),
} as const;

export default function KontakPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(65,182,226,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(117,177,61,0.12),transparent_50%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#C4A35A] via-mai-green to-mai-blue"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="mai-fade text-xs font-semibold tracking-[0.24em] text-mai-red uppercase">
            Hubungi kami
          </p>
          <h1 className="mai-rise mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight text-mai-dark sm:text-5xl md:text-6xl">
            Sekretariat Majelis Arah Indonesia
          </h1>
          <p
            className="mai-rise mt-4 max-w-2xl text-lg leading-relaxed text-slate-600"
            style={{ animationDelay: "80ms" }}
          >
            Silakan datang langsung atau hubungi nomor di bawah untuk pertanyaan,
            undangan, dan kerja sama.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="mai-rise lg:col-span-7">
            <article className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#C4A35A] via-mai-green to-mai-blue"
              />
              <div className="p-8 pl-10 sm:p-10 sm:pl-12">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mai-dark text-mai-blue">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-mai-blue uppercase">
                      Alamat
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-mai-dark sm:text-3xl">
                      {CONTACT.org}
                    </p>
                    <address className="mt-4 space-y-1 not-italic text-base leading-relaxed text-slate-600 sm:text-lg">
                      {CONTACT.addressLines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </address>
                    <a
                      href={CONTACT.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-mai-blue transition hover:text-mai-dark"
                    >
                      Buka di Google Maps
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div
            className="mai-rise flex flex-col gap-6 lg:col-span-5"
            style={{ animationDelay: "100ms" }}
          >
            <article className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mai-dark text-mai-green">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-mai-green uppercase">
                    Telepon / WhatsApp
                  </p>
                  <a
                    href={`tel:${CONTACT.phoneTel}`}
                    className="mt-3 block font-[family-name:var(--font-display)] text-3xl tracking-wide text-mai-dark transition hover:text-mai-green sm:text-4xl"
                  >
                    {CONTACT.phoneDisplay}
                  </a>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    Hubungi sekretariat pada hari kerja untuk informasi resmi
                    organisasi.
                  </p>
                </div>
              </div>
            </article>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-8 py-7 sm:px-10">
              <p className="text-xs font-semibold tracking-[0.18em] text-mai-red uppercase">
                Catatan
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Untuk undangan kegiatan atau kerja sama kelembagaan, cantumkan
                nama lembaga, keperluan, dan waktu yang diusulkan saat menghubungi
                nomor di atas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
