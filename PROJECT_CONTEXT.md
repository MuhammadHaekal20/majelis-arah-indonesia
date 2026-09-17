# PROJECT_CONTEXT — Majelis Arah Indonesia (MAI)

Dokumen ini untuk onboarding AI / developer baru. Baca ini dulu sebelum mengubah kode.

## Ringkasan

Portal organisasi **Majelis Arah Indonesia (MAI)**: situs publik (berita, ruang gagasan, profil) + CMS admin.

Repo: `arah-indonesia-web`

## Stack

| Lapisan | Teknologi |
|---|---|
| Framework | Next.js **16.3** App Router, React **19** |
| Styling | Tailwind CSS **v4** (`app/globals.css` + `tailwind.config.ts`) |
| ORM | Prisma **7** + PostgreSQL via `@prisma/adapter-pg` |
| Auth | NextAuth **v4** (Credentials + Google OAuth + bcrypt) |
| Editor | `react-quill-new` (bukan `react-quill` lama) |
| Email | nodemailer (opsional, via env SMTP) |
| Icons | lucide-react |

### Aturan stack yang sering salah

1. **Next.js 16 ≠ Next lama.** Baca `AGENTS.md` dan docs di `node_modules/next/dist/docs/` sebelum mengubah routing / middleware / data fetching.
2. **Prisma 7:** URL database ada di `prisma.config.ts`, bukan di `schema.prisma` datasource url klasik. Client di-generate ke `app/generated/prisma`. Adapter `pg` wajib (`lib/prisma.ts`).
3. Path alias `@prisma/client` → `./app/generated/prisma/client` (lihat `tsconfig.json`). Import `@prisma/client` tetap dipakai di app code.
4. Setelah ubah schema: `npx prisma generate` (+ `db push` / migrate sesuai kebutuhan).

## Brand & UI

- Bahasa UI: **Indonesia**
- Logo: `public/logo.png`
- Font: Figtree (sans), Cormorant (display) — via CSS variables `--font-figtree` / `--font-cormorant`
- Warna Tailwind:
  - `mai-blue` `#41B6E2`
  - `mai-green` `#75B13D`
  - `mai-red` `#F96B2A`
  - `mai-dark` `#0f172a`
- Ikuti pola layout yang sudah ada (`SiteHeader`, `SiteFooter`, `AppShell`, admin sidebar). Jangan redesign besar tanpa diminta.

## Peta folder

```
app/                      # App Router: pages + API
  page.tsx                # Beranda
  layout.tsx              # Root layout + providers
  globals.css             # Tailwind v4 + brand tokens
  login/, register/       # Auth publik
  publikasi/              # Daftar + detail berita [slug]
  ruang-gagasan/          # Forum: list, buat, detail [id]
  tentang/, presidium/, kontak/
  admin/                  # CMS (role ADMIN)
  api/auth/[...nextauth]/ # NextAuth handler
  api/upload/             # Upload file
  generated/prisma/       # Prisma Client generated (jangan edit manual)

components/
  layout/                 # Header, Footer, AppShell
  admin/                  # Form & UI CMS
  editor/                 # RichTextEditor
  gagasan/, publikasi/, kontak/, providers/

lib/
  prisma.ts               # Singleton PrismaClient + adapter
  authOptions.ts          # NextAuth config
  mail.ts                 # Nodemailer helper
  upload.ts               # Simpan file ke public/uploads
  actions/                # Server Actions (mutasi data)
    publikasi.ts
    diskusi.ts
    gagasan.ts
    kontak.ts             # kontak + pengaturan web

middleware.ts             # Proteksi /admin → wajib ADMIN
prisma/
  schema.prisma           # Model data
  seed.ts                 # Data awal
prisma.config.ts          # Prisma 7 config + DATABASE_URL
types/next-auth.d.ts      # Session: id + role
public/uploads/           # File upload user
```

## Model data (`prisma/schema.prisma`)

**Enums**

- `Role`: `GUEST` | `MEMBER` | `ADMIN`
- `StatusModerasi`: `PENDING` | `APPROVED` | `REJECTED`

**Models**

| Model | Fungsi |
|---|---|
| `User` | Akun + role |
| `Publikasi` | Berita/artikel (slug, cover, konten HTML) |
| `Diskusi` | Komentar pada publikasi |
| `GagasanThread` | Thread ruang gagasan (dimoderasi) |
| `BalasanGagasan` | Balasan pada gagasan |
| `PesanKontak` | Form kontak |
| `PengaturanWeb` | Key-value pengaturan situs |
| `Presidium` | Profil anggota presidium |

## Aturan domain (wajib diikuti)

| Fitur | Siapa | Perilaku |
|---|---|---|
| Komentar berita (`Diskusi`) | User login | Langsung `APPROVED` |
| Ajukan gagasan (`GagasanThread`) | MEMBER / ADMIN | Status `PENDING` sampai admin approve |
| Balasan gagasan | User login | Langsung tampil (tanpa moderasi) |
| Form kontak | Publik | Simpan `PesanKontak` (+ email opsional) |
| CMS `/admin/*` | ADMIN saja | Middleware redirect ke `/login` jika bukan ADMIN |

Jangan mengubah aturan moderasi di atas tanpa permintaan eksplisit.

## Auth

- Config: `lib/authOptions.ts`
- Route: `app/api/auth/[...nextauth]/route.ts`
- Provider: Credentials (email + password, bcrypt)
- Session strategy: JWT; token/session membawa `id` dan `role`
- Tipe: `types/next-auth.d.ts`
- Proteksi admin: `middleware.ts` (`getToken`, cek `role === "ADMIN"`)
- Catatan: Next.js 16 memperingatkan konvensi `middleware` deprecated → prefer `proxy`; belum dimigrasi kecuali diminta

## Admin CMS routes

| Path | Fungsi |
|---|---|
| `/admin` | Dashboard |
| `/admin/publikasi` | List berita |
| `/admin/publikasi/buat` | Buat berita |
| `/admin/publikasi/[id]/edit` | Edit berita |
| `/admin/komentar` | Moderasi komentar |
| `/admin/gagasan` | Moderasi gagasan |
| `/admin/pesan` | Pesan kontak |
| `/admin/pengaturan` | Pengaturan web |
| `/admin/users` | Manajemen user |

## Server Actions (titik mutasi utama)

- `lib/actions/publikasi.ts` — create / update / delete
- `lib/actions/diskusi.ts` — create komentar / moderate
- `lib/actions/gagasan.ts` — create gagasan / moderate / balasan
- `lib/actions/kontak.ts` — submit kontak / mark read / delete / save pengaturan
- `app/register/actions.ts` — registrasi user

Saat menambah fitur data: ikuti pola Server Action yang ada (validasi session/role → Prisma → `revalidatePath` / redirect).

## Environment (.env)

Variabel penting:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/arah_indonesia?schema=public"
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
ADMIN_EMAIL=...
```

Jangan commit `.env`.

## Local database

- PostgreSQL (`provider = "postgresql"` + `@prisma/adapter-pg`)
- Jika error Prisma `ECONNREFUSED`: DB tidak jalan — bukan bug query
- Perintah tipikal:

```bash
npx prisma db push
npx prisma db seed
npm run dev
```

### Akun seed (dari `prisma/seed.ts`)

| Role | Email | Password |
|---|---|---|
| ADMIN | `admin@mai.com` | `admin123` |
| MEMBER | `anggota@test.com` | `anggota123` |
| MEMBER | `anggota2@test.com` | `anggota123` |

Seed juga mengisi publikasi, gagasan, komentar/balasan, pengaturan, dan 9 anggota presidium.

## Alur kerja untuk AI

1. Baca dokumen ini + `AGENTS.md`.
2. Untuk perubahan data: baca `prisma/schema.prisma` dulu.
3. Lacak Server Action di `lib/actions/`, lalu page di `app/`.
4. Ubah UI di `components/` hanya seperlunya; ikuti pola existing.
5. Jangan refactor besar, jangan ganti library, jangan ubah auth/schema tanpa alasan jelas.
6. Jangan commit / push kecuali user meminta.
7. Prefer perubahan kecil, terfokus, dan bisa diuji lokal.

### Contoh end-to-end (referensi)

**Publikasi:** `app/publikasi` → detail `app/publikasi/[slug]` → admin `app/admin/publikasi*` → actions `lib/actions/publikasi.ts` → model `Publikasi`.

**Gagasan:** `app/ruang-gagasan*` → `lib/actions/gagasan.ts` → moderasi `app/admin/gagasan`.

## Yang tidak perlu disentuh kecuali diminta

- `.agents/skills/**` (referensi Prisma skill)
- `app/generated/prisma/**` (hasil generate)
- Migrasi middleware → proxy
- Redesign brand / ganti font stack
- Ganti NextAuth ke Auth.js v5 / ganti Prisma adapter
