import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcrypt";
import {
  PrismaClient,
  Role,
  StatusModerasi,
} from "../app/generated/prisma/client";
import { databaseUrl, sanitizeRuntimeEnv } from "../lib/env";

sanitizeRuntimeEnv();

const adapter = new PrismaMariaDb(databaseUrl());

const prisma = new PrismaClient({ adapter });

const PRESIDIUM = [
  { urutan: 1, nama: "KH. Thoha Yusuf Zakariya", gelar: "Lc." },
  { urutan: 2, nama: "Dr. H. Das'ad Latif", gelar: "Ph.D." },
  { urutan: 3, nama: "Prof. H. Abdul Somad", gelar: "Ph.D." },
  { urutan: 4, nama: "Ust. H. Slamet Ma'arif", gelar: "S.Ag., M.M." },
  { urutan: 5, nama: "Prof. Dr. Irfan Syauqi Beik", gelar: "S.P., M.Sc.Ec." },
  { urutan: 6, nama: "KH. Nonop Hanafi", gelar: "M.Pd.I." },
  { urutan: 7, nama: "KH. Fahmi Salim", gelar: "Lc., M.A." },
  {
    urutan: 8,
    nama: "Dr. Phil. H. Habiburrahman El Shirazy",
    gelar: "Lc., M.A.",
  },
  { urutan: 9, nama: "Iwel Sastra", gelar: "S.H., M.Si." },
] as const;

const PUBLIKASI_SEED = [
  {
    slug: "membangun-ketahanan-pangan-berbasis-pemberdayaan-umat",
    judul: "Membangun Ketahanan Pangan Berbasis Pemberdayaan Umat",
    excerpt:
      "MAI mendorong optimalisasi lahan produktif dan kemitraan petani dengan lembaga filantropi Islam.",
    konten: `<p>Kedaulatan pangan adalah fondasi ketahanan nasional. MAI merekomendasikan kolaborasi antara pemerintah daerah, pesantren, dan pelaku usaha syariah untuk memperkuat rantai pasok pangan lokal.</p>
<p>Melalui pemberdayaan umat, optimalisasi lahan wakaf produktif, serta literasi agribisnis di tingkat akar rumput, ketahanan pangan dapat dibangun secara berkelanjutan dan berkeadilan.</p>`,
  },
  {
    slug: "transformasi-digital-bagi-umkm-syariah",
    judul: "Transformasi Digital bagi UMKM Syariah",
    excerpt:
      "Peluang dan tantangan literasi digital pelaku usaha mikro berbasis nilai syariah.",
    konten: `<p>Perkembangan teknologi harus dimanfaatkan untuk memperluas akses pasar UMKM syariah tanpa mengorbankan etika bisnis Islam.</p>
<p>MAI menekankan pentingnya pelatihan literasi digital, infrastruktur pembayaran halal, serta pendampingan pemasaran daring bagi pelaku usaha mikro dan kecil.</p>`,
  },
  {
    slug: "menjaga-harmoni-di-tengah-dinamika-sosial",
    judul: "Menjaga Harmoni di Tengah Dinamika Sosial",
    excerpt:
      "Merawat kerukunan antarumat beragama sebagai modal utama persatuan bangsa.",
    konten: `<p>Perbedaan adalah kekayaan bangsa. Dalam dinamika sosial yang semakin cepat, dialog lintas komunitas menjadi instrumen penting untuk mencegah polarisasi.</p>
<p>MAI mengajak seluruh elemen masyarakat menjaga ruang publik yang sehat, saling menghormati, dan berorientasi pada kemaslahatan bersama.</p>`,
  },
  {
    slug: "membumikan-pendidikan-dan-literasi-di-era-disrupsi-informasi",
    judul: "Membumikan Pendidikan dan Literasi di Era Disrupsi Informasi",
    excerpt:
      "Literasi kritis menjadi benteng utama masyarakat di tengah gelombang informasi digital.",
    konten: `<p>Di tengah arus informasi yang tak terbendung, MAI mendorong pengembangan kurikulum literasi digital berbasis nilai-nilai luhur bangsa. Pendidikan tidak lagi sekadar transfer ilmu, melainkan pembentukan karakter.</p>
<p>Dengan literasi kritis, masyarakat mampu memilah fakta dari opini, menolak disinformasi, serta menjaga ruang publik yang sehat dan bermartabat.</p>`,
  },
  {
    slug: "peran-ulama-dalam-memperkokoh-bela-negara-dan-semangat-kebangsaan",
    judul:
      "Peran Ulama dalam Memperkokoh Bela Negara dan Semangat Kebangsaan",
    excerpt:
      "Cinta tanah air adalah bagian dari iman yang harus terus dipupuk dalam kehidupan berbangsa.",
    konten: `<p>Kesadaran bela negara harus terus dipupuk. Kolaborasi antara ulama dan pemerintah dalam menyampaikan pesan kebangsaan di mimbar-mimbar agama terbukti efektif menjaga persatuan.</p>
<p>MAI mengajak para ulama menjadi mitra strategis dalam memperkuat semangat kebangsaan tanpa meninggalkan akar keislaman dan kearifan lokal.</p>`,
  },
  {
    slug: "membangun-ekosistem-media-digital-yang-mencerdaskan",
    judul: "Membangun Ekosistem Media Digital yang Mencerdaskan",
    excerpt:
      "Media harus menjadi sarana edukasi, bukan polarisasi di ruang publik digital.",
    konten: `<p>MAI Policy Center merekomendasikan perlunya regulasi yang mendorong platform digital memprioritaskan konten edukatif dan menekan penyebaran disinformasi yang merusak kerukunan.</p>
<p>Ekosistem media yang sehat akan memperkuat literasi masyarakat serta memperluas ruang dialog gagasan yang konstruktif.</p>`,
  },
] as const;

const GAGASAN_JUDUL = [
  "Strategi Pencegahan Pinjol Ilegal",
  "Usulan Kurikulum Literasi Keuangan",
  "Usulan Pembuatan Podcast Dialog Lintas Agama",
  "Program Advokasi Hukum Gratis untuk UMKM",
  "Kajian Rutin Ekonomi Syariah di Kampus",
] as const;

async function seedUsers() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const memberPassword = await bcrypt.hash("anggota123", 10);
  const guestPassword = await bcrypt.hash("guest123", 10);

  // Migrasi email lama (admin@mai.com) → admin@mai.id agar upsert konsisten
  const legacyAdmin = await prisma.user.findUnique({
    where: { email: "admin@mai.com" },
  });
  if (legacyAdmin) {
    await prisma.user.update({
      where: { email: "admin@mai.com" },
      data: { email: "admin@mai.id" },
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@mai.id" },
    update: {
      name: "Administrator MAI",
      password: adminPassword,
      role: Role.ADMIN,
    },
    create: {
      name: "Administrator MAI",
      email: "admin@mai.id",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: "anggota@test.com" },
    update: {
      name: "Anggota Aktif",
      password: memberPassword,
      role: Role.MEMBER,
    },
    create: {
      name: "Anggota Aktif",
      email: "anggota@test.com",
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: "anggota2@test.com" },
    update: {
      name: "Anggota Dua",
      password: memberPassword,
      role: Role.MEMBER,
    },
    create: {
      name: "Anggota Dua",
      email: "anggota2@test.com",
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  // Pengunjung anonim disimulasikan sebagai GUEST (skema mewajibkan user_id)
  const budi = await prisma.user.upsert({
    where: { email: "budi.pengunjung@test.com" },
    update: {
      name: "Budi Santoso",
      password: guestPassword,
      role: Role.GUEST,
    },
    create: {
      name: "Budi Santoso",
      email: "budi.pengunjung@test.com",
      password: guestPassword,
      role: Role.GUEST,
    },
  });

  const aisyah = await prisma.user.upsert({
    where: { email: "aisyah.pengunjung@test.com" },
    update: {
      name: "Aisyah",
      password: guestPassword,
      role: Role.GUEST,
    },
    create: {
      name: "Aisyah",
      email: "aisyah.pengunjung@test.com",
      password: guestPassword,
      role: Role.GUEST,
    },
  });

  console.log(
    "Users seeded:",
    [admin.email, member.email, member2.email, budi.email, aisyah.email].join(
      ", ",
    ),
  );

  return { admin, member, member2, budi, aisyah };
}

async function seedPengaturanWeb() {
  const settings = [
    { key: "email", value: "admin@mai.com" },
    {
      key: "alamat",
      value:
        "Sekretariat Majelis Arah Indonesia, Gedung Menara Pemikiran Lt. 4, Jakarta",
    },
    { key: "ig", value: "https://instagram.com/majelisarah.id" },
    { key: "youtube", value: "https://youtube.com/@majelisarah" },
    { key: "x", value: "" },
    { key: "facebook", value: "" },
  ];

  for (const item of settings) {
    await prisma.pengaturanWeb.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }

  console.log("PengaturanWeb seeded");
}

async function seedPresidium() {
  await prisma.presidium.deleteMany();

  await prisma.presidium.createMany({
    data: PRESIDIUM.map((member) => ({
      nama: member.nama,
      gelar: member.gelar,
      urutan: member.urutan,
      foto_url: "",
    })),
  });

  console.log(`Presidium seeded: ${PRESIDIUM.length} anggota`);
}

async function seedPublikasi(adminId: string) {
  const slugs = PUBLIKASI_SEED.map((item) => item.slug);

  await prisma.diskusi.deleteMany({
    where: { publikasi: { slug: { in: [...slugs] } } },
  });
  await prisma.publikasi.deleteMany({
    where: { slug: { in: [...slugs] } },
  });

  const created = [];

  for (const item of PUBLIKASI_SEED) {
    const publikasi = await prisma.publikasi.create({
      data: {
        slug: item.slug,
        judul: item.judul,
        excerpt: item.excerpt,
        konten: item.konten,
        cover_url: "/logo.png",
        author_id: adminId,
      },
    });
    created.push(publikasi);
  }

  console.log(`Publikasi seeded: ${created.length} artikel`);
  return created;
}

async function seedGagasan(memberId: string, member2Id: string) {
  await prisma.balasanGagasan.deleteMany({
    where: {
      gagasan: {
        judul: { in: [...GAGASAN_JUDUL] },
      },
    },
  });

  await prisma.gagasanThread.deleteMany({
    where: {
      judul: { in: [...GAGASAN_JUDUL] },
    },
  });

  const g1 = await prisma.gagasanThread.create({
    data: {
      judul: "Strategi Pencegahan Pinjol Ilegal",
      konten:
        "Edukasi literasi keuangan di tingkat majelis taklim terbukti efektif menekan ketergantungan masyarakat pada pinjaman online ilegal. MAI perlu menyusun panduan praktis untuk komunitas keagamaan.",
      status_moderasi: StatusModerasi.APPROVED,
      author_id: memberId,
    },
  });

  const g2 = await prisma.gagasanThread.create({
    data: {
      judul: "Usulan Kurikulum Literasi Keuangan",
      konten:
        "Pesantren perlu dibekali modul kewirausahaan dan literasi keuangan agar santri siap menghadapi tantangan ekonomi digital secara mandiri dan beretika.",
      status_moderasi: StatusModerasi.PENDING,
      author_id: memberId,
    },
  });

  const gPodcast = await prisma.gagasanThread.create({
    data: {
      judul: "Usulan Pembuatan Podcast Dialog Lintas Agama",
      konten:
        "Untuk menekan polarisasi, MAI bisa memprakarsai seri podcast rutin yang mengundang tokoh-tokoh agama berdialog santai membahas isu sosial.",
      status_moderasi: StatusModerasi.APPROVED,
      author_id: memberId,
    },
  });

  const gUmkm = await prisma.gagasanThread.create({
    data: {
      judul: "Program Advokasi Hukum Gratis untuk UMKM",
      konten:
        "Banyak UMKM syariah yang kesulitan mengurus legalitas dan sertifikasi halal. MAI perlu membentuk tim advokasi pendampingan.",
      status_moderasi: StatusModerasi.APPROVED,
      author_id: member2Id,
    },
  });

  const gKampus = await prisma.gagasanThread.create({
    data: {
      judul: "Kajian Rutin Ekonomi Syariah di Kampus",
      konten:
        "Mahasiswa butuh wadah diskusi yang aplikatif mengenai ekonomi syariah, bukan sekadar teori kelas.",
      status_moderasi: StatusModerasi.PENDING,
      author_id: member2Id,
    },
  });

  console.log(`Gagasan seeded: ${GAGASAN_JUDUL.length} thread`);
  return { g1, g2, gPodcast, gUmkm, gKampus };
}

async function seedInteraksi(params: {
  memberId: string;
  member2Id: string;
  budiId: string;
  aisyahId: string;
  beritaAwalId: string;
  beritaAId: string;
  beritaBId: string;
  gagasanPodcastId: string;
}) {
  const {
    memberId,
    member2Id,
    budiId,
    aisyahId,
    beritaAwalId,
    beritaAId,
    beritaBId,
    gagasanPodcastId,
  } = params;

  await prisma.diskusi.deleteMany({
    where: {
      OR: [
        {
          konten: "Analisis yang sangat komprehensif, ditunggu draf teknisnya.",
        },
        {
          konten:
            "Sangat setuju, anak muda sekarang butuh panduan literasi yang kuat.",
        },
        {
          konten:
            "Langkah strategis yang harus segera direalisasikan di daerah-daerah.",
        },
      ],
    },
  });

  await prisma.diskusi.createMany({
    data: [
      {
        konten: "Analisis yang sangat komprehensif, ditunggu draf teknisnya.",
        status_moderasi: StatusModerasi.APPROVED,
        publikasi_id: beritaAwalId,
        user_id: memberId,
      },
      {
        konten:
          "Sangat setuju, anak muda sekarang butuh panduan literasi yang kuat.",
        status_moderasi: StatusModerasi.APPROVED,
        publikasi_id: beritaAId,
        user_id: budiId,
      },
      {
        konten:
          "Langkah strategis yang harus segera direalisasikan di daerah-daerah.",
        status_moderasi: StatusModerasi.APPROVED,
        publikasi_id: beritaBId,
        user_id: member2Id,
      },
    ],
  });

  await prisma.balasanGagasan.deleteMany({
    where: {
      gagasan_id: gagasanPodcastId,
    },
  });

  await prisma.balasanGagasan.createMany({
    data: [
      {
        gagasan_id: gagasanPodcastId,
        user_id: member2Id,
        konten: "Ide cemerlang! Saya siap membantu riset narasumbernya.",
      },
      {
        gagasan_id: gagasanPodcastId,
        user_id: aisyahId,
        konten:
          "Semoga formatnya santai dan mudah dipahami masyarakat awam.",
      },
    ],
  });

  await prisma.pesanKontak.deleteMany({
    where: { email: "ahmad@univ.edu" },
  });

  await prisma.pesanKontak.create({
    data: {
      nama: "Dr. Ahmad Sulaiman",
      email: "ahmad@univ.edu",
      pesan:
        "Kami mengundang perwakilan Presidium MAI untuk hadir sebagai pembicara dalam forum literasi kebangsaan di kampus kami pada bulan depan.",
      is_read: false,
    },
  });

  console.log("Interaksi seeded: komentar, balasan gagasan, pesan kontak");
}

async function main() {
  console.log("Starting MAI database seed…");

  const { admin, member, member2, budi, aisyah } = await seedUsers();
  await seedPengaturanWeb();
  await seedPresidium();

  const publikasi = await seedPublikasi(admin.id);
  // Index: 0 lama, 1 lama, 2 lama, 3=Berita A, 4=Berita B, 5=Berita C
  const beritaAwal = publikasi[0];
  const beritaA = publikasi[3];
  const beritaB = publikasi[4];

  const gagasan = await seedGagasan(member.id, member2.id);

  await seedInteraksi({
    memberId: member.id,
    member2Id: member2.id,
    budiId: budi.id,
    aisyahId: aisyah.id,
    beritaAwalId: beritaAwal.id,
    beritaAId: beritaA.id,
    beritaBId: beritaB.id,
    gagasanPodcastId: gagasan.gPodcast.id,
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
