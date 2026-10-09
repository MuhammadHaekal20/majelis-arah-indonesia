import Image from "next/image";
import { PRESIDIUM_MEMBERS } from "@/lib/presidium-members";

export default function PresidiumPage() {
  const members = PRESIDIUM_MEMBERS;

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(65,182,226,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(117,177,61,0.1),transparent_50%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#C4A35A] via-mai-green to-mai-blue"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="mai-fade text-xs font-semibold tracking-[0.24em] text-mai-green uppercase">
            Dewan Presidium
          </p>
          <h1 className="mai-rise mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-tight text-mai-dark sm:text-5xl md:text-6xl">
            Sembilan presidium, satu majelis, satu arah
          </h1>
          <p
            className="mai-rise mt-5 max-w-2xl text-lg leading-relaxed text-slate-600"
            style={{ animationDelay: "80ms" }}
          >
            Dipimpin secara kolektif oleh ulama dan intelektual Muslim Indonesia
            yang mempertemukan latar keulamaan, akademik, ekonomi, dakwah, dan
            kepakaran sosial-politik.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <ol className="grid list-none gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((member, index) => (
            <li
              key={member.urutan}
              className="mai-rise group flex flex-col"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <div className="relative mx-auto w-full max-w-[280px]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-[#f3f5f7] shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_28px_50px_-24px_rgba(15,23,42,0.4)]">
                  <Image
                    src={member.foto_url}
                    alt={member.nama}
                    fill
                    priority={index < 3}
                    className="object-cover object-[center_12%] transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 80vw, (max-width: 1280px) 40vw, 280px"
                  />
                </div>
                <p className="absolute top-3 left-3 rounded-md bg-mai-dark/90 px-2.5 py-1 font-[family-name:var(--font-display)] text-[11px] tracking-[0.14em] text-white">
                  {String(member.urutan).padStart(2, "0")}
                </p>
              </div>

              <div className="mx-auto mt-6 w-full max-w-[280px] text-center">
                <div
                  aria-hidden
                  className="mx-auto mb-4 h-px w-12 bg-gradient-to-r from-transparent via-[#C4A35A] to-transparent"
                />
                <h2 className="font-[family-name:var(--font-display)] text-[1.35rem] leading-snug text-mai-dark sm:text-[1.45rem]">
                  {member.nama}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-mai-blue">
                  {member.gelar}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
