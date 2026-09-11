# Contributing — Majelis Arah Indonesia

Repo: [MuhammadHaekal20/majelis-arah-indonesia](https://github.com/MuhammadHaekal20/majelis-arah-indonesia.git)

Baca `PROJECT_CONTEXT.md` untuk domain dan stack. Proses di bawah ini adalah SDLC yang dipakai tim.

## Siklus kerja

1. **Plan** — pahami issue/tugas; jangan perluas scope.
2. **Branch** — dari `main` yang terbaru.
3. **Implement** — perubahan kecil, pola kode existing.
4. **Verify** — `npm run lint` dan `npm run typecheck`; uji UI yang tersentuh.
5. **Review** — Pull Request; tunggu CI hijau.
6. **Release** — merge ke `main`, lalu deploy dari branch itu.

## GitHub Flow

```text
main          production-ready
 └── feature/…  atau  fix/…  atau  chore/…
       └── Pull Request → CI → review → merge
```

```powershell
git checkout main
git pull origin main
git checkout -b feature/nama-singkat
```

Commit: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).  
Jangan commit `.env`. Jangan force-push ke `main`.

Agent di repo ini **langsung** membuat branch, commit, push, dan Pull Request setelah selesai mengubah kode — tanpa menunggu perintah "commit" atau "buat PR". Merge ke `main` tetap menunggu review / permintaan eksplisit.

## Lokal

```powershell
copy .env.example .env   # lalu isi DATABASE_URL & NEXTAUTH_SECRET
npm install
npx prisma generate
npx prisma db push       # development only
npx prisma db seed       # development only
npm run dev
```

Produksi: `prisma migrate deploy`, bukan `db push` / seed akun uji.

## CI

Setiap PR menjalankan `.github/workflows/ci.yml` (install, Prisma generate, lint, typecheck).  
Perbaikan yang merusak CI harus masuk di PR yang sama.

## Keamanan

- Secret hanya di `.env` atau GitHub Secrets / dashboard hosting.
- CMS `/admin` wajib role `ADMIN` (middleware). Jangan longgarkan di PR “sementara”.
