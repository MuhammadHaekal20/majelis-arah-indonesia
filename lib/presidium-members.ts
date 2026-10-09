export type PresidiumMember = {
  urutan: number;
  nama: string;
  gelar: string;
  foto_url: string;
};

/** Urutan tetap sesuai foto resmi dari kiri ke kanan. */
export const PRESIDIUM_MEMBERS: PresidiumMember[] = [
  {
    urutan: 1,
    nama: "Prof. H. Abdul Somad",
    gelar: "Lc., D.E.S.A., Ph.D.",
    foto_url: "/presidium/01-abdul-somad.png",
  },
  {
    urutan: 2,
    nama: "Dr. H. Das’ad Latif",
    gelar: "Ph.D.",
    foto_url: "/presidium/02-dasad-latif.png",
  },
  {
    urutan: 3,
    nama: "KH. Thoha Yusuf Zakariya",
    gelar: "Lc.",
    foto_url: "/presidium/03-thoha-yusuf-zakariya.png",
  },
  {
    urutan: 4,
    nama: "KH. Fahmi Salim",
    gelar: "Lc., M.A.",
    foto_url: "/presidium/04-fahmi-salim.png",
  },
  {
    urutan: 5,
    nama: "KH. Nonop Hanafi",
    gelar: "M.Pd.I.",
    foto_url: "/presidium/05-nonop-hanafi.png",
  },
  {
    urutan: 6,
    nama: "Ust. H. Slamet Ma’arif",
    gelar: "S.Ag., M.M.",
    foto_url: "/presidium/06-slamet-maarif.png",
  },
  {
    urutan: 7,
    nama: "Prof. Dr. Irfan Syauqi Beik",
    gelar: "S.P., M.Sc.Ec.",
    foto_url: "/presidium/07-irfan-syauqi-beik.png",
  },
  {
    urutan: 8,
    nama: "Dr. Phil. H. Habiburrahman El Shirazy",
    gelar: "Lc., M.A.",
    foto_url: "/presidium/08-habiburrahman-el-shirazy.png",
  },
  {
    urutan: 9,
    nama: "Iwel Sastra",
    gelar: "S.H., M.Si.",
    foto_url: "/presidium/09-iwel-sastra.png",
  },
];
