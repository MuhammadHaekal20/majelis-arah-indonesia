import Image from "next/image";
import { prisma } from "@/lib/prisma";

function getInitials(nama: string) {
  return nama
    .replace(/^(KH\.|Dr\.|Prof\.|Ust\.|Ir\.)\s*/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function PresidiumPage() {
  const members = await prisma.presidium.findMany({
    orderBy: { urutan: "asc" },
  });

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#C4A35A] via-mai-green to-mai-blue"
        />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold tracking-[0.24em] text-mai-green uppercase">
            Dewan Presidium
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight text-mai-dark sm:text-5xl md:text-6xl">
            Sembilan arah, satu majelis
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Dipimpin secara kolektif oleh ulama dan intelektual Muslim Indonesia
            yang mempertemukan latar keulamaan, akademik, ekonomi, dakwah, dan
            kepakaran sosial-politik.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {members.length === 0 ? (
          <p className="rounded-xl border border-slate-100 bg-slate-50 p-8 text-center text-slate-500">
            Data presidium belum tersedia.
          </p>
        ) : (
          <div className="grid auto-rows-fr gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {members.map((member, index) => (
              <article
                key={member.id}
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  index % 2 === 0
                    ? "border-[#C4A35A]/40"
                    : "border-mai-green/35"
                }`}
              >
                <div className="flex h-full flex-col">
                  <div className="flex min-h-0 flex-1">
                    <div
                      className="w-1.5 shrink-0 bg-gradient-to-b from-[#C4A35A] via-mai-green to-mai-blue"
                      aria-hidden
                    />
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="relative mb-6 aspect-square overflow-hidden rounded-xl">
                        {member.foto_url ? (
                          <Image
                            src={member.foto_url}
                            alt={member.nama}
                            fill
                            className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mai-dark via-[#123a55] to-mai-blue grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0">
                            <span className="font-[family-name:var(--font-display)] text-5xl tracking-wide text-white/90 sm:text-6xl">
                              {getInitials(member.nama) || member.urutan}
                            </span>
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mai-dark/40 via-transparent to-transparent opacity-60" />
                        <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-mai-dark uppercase">
                          {String(member.urutan).padStart(2, "0")}
                        </p>
                      </div>

                      <p className="text-[11px] font-semibold tracking-[0.2em] text-[#C4A35A] uppercase">
                        Anggota Presidium
                      </p>

                      <div className="flex grow flex-col">
                        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-snug text-mai-dark sm:text-[1.7rem]">
                          {member.nama}
                        </h2>
                        <p className="mt-2 font-[family-name:var(--font-display)] text-base italic text-mai-blue">
                          {member.gelar}
                        </p>
                      </div>

                      <p className="mt-5 border-t border-slate-100 pt-4 font-[family-name:var(--font-display)] text-sm italic leading-relaxed text-slate-500">
                        “Memberi arah gagasan bagi kemaslahatan umat dan bangsa.”
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
