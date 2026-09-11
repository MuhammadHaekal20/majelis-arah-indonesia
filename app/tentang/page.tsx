import Link from "next/link";
import {
  BookOpen,
  Handshake,
  Landmark,
  Lightbulb,
  Scale,
  Shield,
  Sparkles,
} from "lucide-react";

const misi = [
  "Mengintegrasikan nilai-nilai Islam dan keilmuan dalam membaca serta memberikan solusi terhadap persoalan kebangsaan.",
  "Menghasilkan kajian dan rekomendasi kebijakan yang objektif, berbasis data, dan berorientasi pada kemaslahatan masyarakat.",
  "Menjadi mitra strategis pemerintah dalam memberikan gagasan, masukan, kritik, dan alternatif solusi terhadap berbagai kebijakan publik.",
  "Membangun ruang dialog antara ulama, intelektual, akademisi, pemerintah, dunia usaha, aktivis, media, dan masyarakat.",
  "Memperkuat literasi keumatan dan kebangsaan, khususnya dalam menghadapi dinamika sosial, politik, ekonomi, dan perkembangan teknologi digital.",
  "Mendorong pemberdayaan umat melalui penguatan ekonomi, pendidikan, kewirausahaan, teknologi, dan berbagai sektor strategis lainnya.",
  "Membangun jejaring ulama dan intelektual di seluruh Indonesia sebagai kekuatan pemikiran dan solusi bagi persoalan bangsa.",
  "Menjaga persatuan dan kerukunan bangsa dengan mengedepankan dialog, toleransi, keadilan, dan sikap kritis yang konstruktif.",
];

const nilai = [
  {
    title: "Keislaman",
    desc: "Menjadikan nilai-nilai Islam sebagai landasan moral dan etika dalam memberikan pandangan terhadap persoalan masyarakat dan bangsa.",
    icon: Sparkles,
    className: "md:col-span-2",
  },
  {
    title: "Keilmuan",
    desc: "Setiap gagasan dan rekomendasi diupayakan berdasarkan kajian, data, metodologi, dan argumentasi yang dapat dipertanggungjawabkan.",
    icon: BookOpen,
    className: "",
  },
  {
    title: "Kebangsaan",
    desc: "Menempatkan kepentingan bangsa dan negara serta kemaslahatan masyarakat sebagai orientasi utama.",
    icon: Landmark,
    className: "",
  },
  {
    title: "Keadilan",
    desc: "Mengedepankan objektivitas dan keberpihakan kepada kebenaran serta kepentingan masyarakat luas.",
    icon: Scale,
    className: "md:col-span-2 lg:col-span-1",
  },
  {
    title: "Independensi",
    desc: "Menjaga independensi pemikiran dan tidak terjebak pada kepentingan politik praktis.",
    icon: Shield,
    className: "",
  },
  {
    title: "Kolaborasi",
    desc: "Membangun kerja sama dengan berbagai elemen bangsa untuk menghasilkan solusi yang lebih komprehensif.",
    icon: Handshake,
    className: "",
  },
  {
    title: "Kemanfaatan",
    desc: "Mengukur keberhasilan organisasi dari sejauh mana gagasan dan kerja-kerjanya memberikan manfaat nyata bagi umat dan bangsa.",
    icon: Lightbulb,
    className: "md:col-span-2",
  },
];

export default function TentangPage() {
  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="relative overflow-hidden bg-mai-dark text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(65,182,226,0.25),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(117,177,61,0.18),transparent_35%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold tracking-[0.24em] text-mai-blue uppercase">
            Profil organisasi
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl md:text-6xl">
            Majelis Arah Indonesia
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">
            Lembaga pemikir dan wadah kolaborasi ulama, intelektual, akademisi,
            serta profesional untuk memberi arah gagasan bagi kemajuan umat,
            bangsa, dan negara.
          </p>
          <p className="mt-6 font-[family-name:var(--font-display)] text-xl italic text-mai-green">
            “Menyatukan Gagasan, Menguatkan Arah, Menghadirkan Manfaat”
          </p>
        </div>
      </section>

      {/* Tentang */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-mai-red uppercase">
              Tentang MAI
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-mai-dark sm:text-4xl">
              Mitra strategis, bukan oposisi
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-slate-600 lg:col-span-8">
            <p>
              Majelis Arah Indonesia (MAI) adalah lembaga pemikir (think tank)
              dan wadah kolaborasi ulama, intelektual, akademisi, profesional,
              serta berbagai elemen masyarakat yang berkomitmen memberikan arah
              pemikiran, gagasan, kajian, dan rekomendasi kebijakan bagi
              kemajuan umat, bangsa, dan negara.
            </p>
            <p>
              MAI lahir dari kesadaran bahwa Indonesia membutuhkan ruang dialog
              yang mempertemukan nilai-nilai keislaman, keilmuan, kebangsaan,
              dan kepentingan masyarakat dalam membaca berbagai persoalan
              strategis nasional.
            </p>
            <p>
              MAI tidak menempatkan diri sebagai kelompok oposisi maupun
              pendukung pemerintah. MAI hadir sebagai mitra strategis dan
              sparing partner pemerintah serta masyarakat, dengan menjalankan
              fungsi kritis-konstruktif.
            </p>
          </div>
        </div>
      </section>

      {/* Visi & Misi split */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-semibold tracking-[0.2em] text-mai-blue uppercase">
              Visi
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl leading-snug text-mai-dark sm:text-4xl">
              Lembaga pemikir Islam dan kebangsaan yang terpercaya
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Menghadirkan arah pemikiran, gagasan, dan solusi strategis bagi
              terwujudnya Indonesia yang berdaulat, adil, maju, bermartabat, dan
              berkemaslahatan.
            </p>
            <div className="mt-8 h-1 w-20 rounded-full bg-gradient-to-r from-mai-blue to-mai-green" />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-mai-green uppercase">
              Misi
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-mai-dark">
              Delapan langkah kerja
            </h2>
            <ol className="mt-8 space-y-4">
              {misi.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mai-dark text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-slate-600">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Nilai bento */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-mai-red uppercase">
              Nilai-nilai dasar
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-mai-dark sm:text-4xl">
              Fondasi yang menuntun setiap gagasan
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nilai.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className={`group rounded-2xl border border-slate-100 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-mai-green/30 hover:bg-white hover:shadow-lg ${item.className}`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mai-dark text-mai-blue transition group-hover:bg-mai-green group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl text-mai-dark">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/presidium"
              className="rounded-lg bg-mai-green px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5A8F2E]"
            >
              Lihat Dewan Presidium
            </Link>
            <Link
              href="/kontak"
              className="rounded-lg border border-mai-blue px-5 py-3 text-sm font-medium text-mai-blue transition hover:bg-mai-blue/5"
            >
              Hubungi kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
