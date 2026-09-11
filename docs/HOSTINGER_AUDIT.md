# Audit Hostinger — arahindonesia.org

Tanggal audit: 11 Sep 2026  
Akses: SSH `u711066753@46.202.186.124:65002` (key-based)  
Host: `id-dci-web1091.main-hosting.eu` (CloudLinux 8, shared)

## Ringkasan eksekutif

Paket ini adalah **web hosting bersama (PHP)**, bukan VPS dan bukan Hostinger **Node.js Web App**. Domain `https://arahindonesia.org` sudah HTTPS + CDN (`hcdn`), tetapi masih menampilkan halaman default PHP.

**Portal MAI (Next.js 16 + Prisma PostgreSQL + NextAuth) tidak boleh di-copy ke `public_html`.** Itu anti-pattern: App Router, Server Actions, dan Prisma membutuhkan proses Node yang berjalan terus, bukan file PHP statis.

## Temuan

| Area | Status | Catatan |
|---|---|---|
| OS / isolasi | CloudLinux 8 + CageFS | Shared; load server saat audit ~18 (noisy neighbor) |
| Domain | `arahindonesia.org` | Folder `~/domains/arahindonesia.org/public_html` |
| Situs live | PHP 8.3 default page | `X-Powered-By: PHP/8.3.33`, HTTP→HTTPS 301 |
| Node.js di PATH SSH | Tidak | Binary ada di `/opt/alt/alt-nodejs{20,22,24}` (v22.18.0) |
| Node.js Web App hPanel | Tidak terpasang | Tidak ada `~/nodevenv` / app entry |
| Database | MariaDB client saja | Tidak ada `psql`; Prisma proyek memakai **PostgreSQL** |
| Git di server | Ada (2.43) | Berguna setelah ada runtime Node yang dikelola |
| Cron | Kosong | — |
| SSH | Key di `~/.ssh/authorized_keys` | Passwordless dari PC ini sudah jalan |

Node.js Web App di hPanel, menurut [dokumentasi Hostinger](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/), tersedia pada **Business Web Hosting** dan **Cloud**, bukan Premium PHP shared.

## Risiko jika dipaksa deploy ke `public_html`

- Next.js tidak berjalan; pengunjung hanya melihat file mentah atau 500
- Secret `.env` mudah terekspos jika ter-upload
- Tidak ada process manager, health check, atau rollback
- PostgreSQL tidak tersedia di akun ini

## Rekomendasi (urutan)

1. **Jangan upload project ke `public_html`.**
2. Pilih runtime Node yang dikelola:
   - **Opsi A (disarankan jika tetap di Hostinger):** upgrade ke Business/Cloud → hPanel **Add Website → Deploy Web App → Node.js** → hubungkan repo GitHub `MuhammadHaekal20/majelis-arah-indonesia` → set env (lihat `docs/DEPLOYMENT.md`).
   - **Opsi B:** deploy app ke Vercel/Railway; DNS `arahindonesia.org` tetap di Hostinger (A/CNAME + SSL).
3. Database produksi: PostgreSQL terkelola (Neon / Prisma Postgres / Supabase). Jangan pakai MariaDB Hostinger tanpa migrasi schema.
4. Secret hanya di panel hosting / GitHub Secrets. Seed (`admin123`) jangan dipakai di produksi.
5. CI sudah ada (`.github/workflows/ci.yml`). CD mengikuti platform di opsi A atau B, bukan `scp` manual.

Langkah operasional ada di `docs/DEPLOYMENT.md`.
