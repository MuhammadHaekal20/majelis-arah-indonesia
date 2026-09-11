import Link from "next/link";
import { adminActionClass } from "@/components/admin/AdminButton";

const stats = [
  {
    label: "Total Artikel",
    value: "24",
    hint: "Publikasi yang terbit di portal",
    accent: "blue" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M7 4h7l3 3v13H7V4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 10h5M9.5 13.5h5M9.5 17h3.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Total Pengguna",
    value: "128",
    hint: "Akun terdaftar di sistem MAI",
    accent: "green" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M3.5 18.5c.8-2.8 3-4.5 5.5-4.5s4.7 1.7 5.5 4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M15.2 18.5c.4-1.6 1.5-2.8 3-3.3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <section className="mai-fade">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-mai-dark">
          Ringkasan
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Pantau aktivitas portal dari satu layar ringkas.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat, index) => (
          <article
            key={stat.label}
            className="mai-rise rounded-xl border border-slate-100 bg-white p-6 shadow-sm"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                {stat.label}
              </p>
              <span
                className={`rounded-lg p-2 ${
                  stat.accent === "blue"
                    ? "bg-mai-blue/10 text-mai-blue"
                    : "bg-mai-green/10 text-mai-green"
                }`}
              >
                {stat.icon}
              </span>
            </div>
            <p className="mt-3 font-[family-name:var(--font-display)] text-5xl text-mai-dark">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-slate-500">{stat.hint}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="font-[family-name:var(--font-display)] text-xl text-mai-dark">
          Pintasan cepat
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Modul CMS siap dikembangkan: publikasi, pengguna, dan moderasi
          gagasan.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/publikasi"
            className={adminActionClass("primary")}
          >
            Kelola Publikasi
          </Link>
          <Link href="/admin/users" className={adminActionClass("neutral")}>
            Kelola Users
          </Link>
          <Link href="/admin/gagasan" className={adminActionClass("secondary")}>
            Moderasi Gagasan
          </Link>
        </div>
      </section>
    </div>
  );
}
