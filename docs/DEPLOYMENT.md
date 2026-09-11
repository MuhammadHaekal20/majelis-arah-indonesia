# Deployment — Majelis Arah Indonesia

Stack: Next.js 16 (App Router) + Prisma 7 + PostgreSQL + NextAuth v4.

Baca `docs/HOSTINGER_AUDIT.md` sebelum deploy ke Hostinger.

## Prinsip

- Build di CI/platform, bukan di laptop lalu `scp` folder `.next`.
- Secret lewat environment hosting, bukan file di git.
- `main` = kandidat produksi. Deploy dari `main` yang CI-nya hijau.
- Produksi: `prisma migrate deploy` setelah ada folder `prisma/migrations`. Saat ini schema masih di-sync lokal dengan `db push` — buat migration sebelum go-live.

## Environment produksi (wajib)

Set di panel hosting / Vercel. Jangan commit nilai nyata.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?schema=public&sslmode=require
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://arahindonesia.org
ADMIN_EMAIL=admin@arahindonesia.org
```

SMTP opsional (`SMTP_*`). `NEXTAUTH_URL` harus URL publik HTTPS.

Di Hostinger, isi variabel **tanpa** tanda kutip di nilai. Panel menyuntikkan `DATABASE_URL='postgres://…'` secara literal; Prisma lalu gagal dengan `Can't reach database server at base`. Benar: `DATABASE_URL=postgres://…`

Build command: `npm run build` (sudah menjalankan `prisma generate`).  
Start command: `npm start` (bind `0.0.0.0`; `PORT` dari platform).  
Node: 20 atau 22 (lihat `.nvmrc`).

## Opsi A — Hostinger Node.js Web App

Syarat: paket **Business atau Cloud** ([syarat resmi](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)). Akun Premium PHP saat audit **tidak** punya alur ini.

1. hPanel → **Add Website** → **Deploy Web App** → **Node.js**.
2. Import GitHub: `MuhammadHaekal20/majelis-arah-indonesia`, branch `main`.
3. Framework: Next.js. Node 22. Build `npm run build`. Start `npm start`.
4. Isi environment variables di atas. Database: PostgreSQL eksternal (bukan MariaDB panel).
5. Domain: `arahindonesia.org`.
6. Setelah live: ganti password admin seed; jangan jalankan `db seed` di produksi.

## Opsi B — Vercel + DNS Hostinger

1. Import repo yang sama di Vercel. Env sama seperti di atas.
2. Di hPanel DNS, arahkan `@` / `www` ke target Vercel (A/CNAME sesuai instruksi Vercel).
3. Biarkan email/DNS lain tetap di Hostinger jika perlu.

## Yang tidak dilakukan

Tidak ada rsync/scp ke `~/domains/arahindonesia.org/public_html`. Hosting itu masih PHP default page; menaruh Next.js di sana akan merusak rilis.
