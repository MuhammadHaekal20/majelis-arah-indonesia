"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-full flex-col bg-[var(--mai-bg)]">
      <SiteHeader />
      <main className="flex min-h-screen flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
