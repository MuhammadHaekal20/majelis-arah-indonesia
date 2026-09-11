import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Majelis Arah Indonesia",
  description: "Menyatukan Gagasan. Menguatkan Arah. Menghadirkan Manfaat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
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
