"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Dashboard", exact: true, accent: "green" as const },
  { href: "/admin/publikasi", label: "Publikasi", accent: "blue" as const },
  { href: "/admin/komentar", label: "Komentar", accent: "green" as const },
  { href: "/admin/gagasan", label: "Gagasan", accent: "blue" as const },
  { href: "/admin/pesan", label: "Pesan Masuk", accent: "green" as const },
  { href: "/admin/pengaturan", label: "Pengaturan", accent: "blue" as const },
  { href: "/admin/users", label: "Users", accent: "green" as const },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-mai-dark text-slate-300">
      <div className="border-b border-slate-800 px-5 py-5">
        <Image
          src="/logo.png"
          alt="Majelis Arah Indonesia"
          width={140}
          height={101}
          className="mx-auto h-16 w-auto object-contain"
          priority
        />
        <p className="mt-3 text-center text-[10px] font-semibold tracking-[0.22em] text-mai-green uppercase">
          CMS MAI
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const accentBorder =
            link.accent === "green" ? "border-mai-green" : "border-mai-blue";
          const accentText =
            link.accent === "green" ? "text-mai-green" : "text-mai-blue";

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg border-l-2 px-3 py-2.5 text-sm transition-colors ${
                active
                  ? `bg-slate-800 text-white ${accentBorder}`
                  : `border-transparent text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white`
              }`}
            >
              <span className={active ? accentText : undefined}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-800 p-4">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          ← Kembali ke situs
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-lg border border-slate-600 bg-transparent px-3 py-2 text-left text-sm text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-white"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}
