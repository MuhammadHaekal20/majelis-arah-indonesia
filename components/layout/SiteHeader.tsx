"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/publikasi", label: "Berita" },
  { href: "/ruang-gagasan", label: "Gagasan" },
  { href: "/presidium", label: "Presidium" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Majelis Arah Indonesia"
            width={88}
            height={64}
            priority
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-sm px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-slate-50 font-medium text-mai-blue"
                    : "text-slate-600 hover:text-mai-blue"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="hidden rounded-sm px-3 py-2 text-sm text-slate-600 transition-colors hover:text-mai-blue sm:inline-block"
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-sm border border-mai-blue px-3 py-2 text-sm font-medium text-mai-blue transition-colors hover:bg-mai-blue/5"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-sm border border-mai-blue px-3 py-2 text-sm font-medium text-mai-blue transition-colors hover:bg-mai-blue/5"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-sm border border-mai-green px-3 py-2 text-sm font-medium text-mai-green transition-colors hover:bg-mai-green/5"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
