import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Majelis Arah Indonesia",
  description: "Menyatukan Gagasan. Menguatkan Arah. Menghadirkan Manfaat.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full font-sans text-mai-dark antialiased">
        <AuthProvider>
          {/* AppShell memasang SiteHeader + SiteFooter di rute publik;
              rute /admin dilewatkan tanpa chrome publik. */}
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
