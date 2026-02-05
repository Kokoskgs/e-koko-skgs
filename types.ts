
export type Tahap = 'Tahap 1' | 'Tahap 2';
export type UnitCategory = 'Rumah Sukan' | 'Sukan & Permainan' | 'Kelab & Persatuan' | 'Unit Beruniform';

export interface LaporanPerjumpaan {
  id: string;
  timestamp: number;
  unit: string;
  category: UnitCategory;
  tahap: Tahap;
  tahun: string;
  perjumpaanKe: number;
  masa: string;
  tempat: string;
  kehadiranMurid: number;
  kekuatan: string;
  kelemahan: string;
  cabaran: string;
  cadangan: string;
  ringkasanAktiviti: string;
  images: string[]; // Base64 strings
}

export interface Jawatankuasa {
  pengerusi: string;
  naibPengerusi: string;
  bendahari: string;
  naibBendahari: string;
  setiausaha: string;
  naibSetiausaha: string;
  ajkTahun6: string;
  ajkTahun5: string;
  ajkTahun4: string;
  ajkTahun3: string;
}

export interface MinitMesyuaratAgung {
  id: string;
  timestamp: number;
  unit: string;
  category: UnitCategory;
  tahap: Tahap;
  tahun: string;
  kehadiranGuru: string;
  kehadiranMurid: number;
  ketuaGuruPenasihat: string;
  jk: Jawatankuasa;
  yuran: string;
  laporan2025: string;
  cadanganAktiviti: string;
  disediakanOleh: string;
}

export enum AppRoute {
  HOME = 'home',
  LAPORAN = 'laporan',
  MINIT = 'minit',
  DASHBOARD = 'dashboard'
}
