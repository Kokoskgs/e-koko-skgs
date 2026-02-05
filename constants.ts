
import { UnitCategory } from './types';

export const SCHOOL_LOGO = 'https://i.imgur.com/8TlJu2n.jpeg';

export const UNIT_DATA: Record<UnitCategory, string[]> = {
  'Rumah Sukan': ['Merah', 'Biru', 'Kuning', 'Ungu', 'Jingga', 'Hijau'],
  'Unit Beruniform': ['PPIM', 'Tuspa', 'TKRS', 'BSMM', 'Pengakap', 'Pengakap PPKI', 'Tunas Puteri'],
  'Kelab & Persatuan': [
    'Persatuan Bahasa Melayu',
    'Persatuan Bahasa Inggeris',
    'Persatuan Agama Islam',
    'Kelab STEM',
    'Kelab Rukun Negara',
    'Kelab Komputer & ICT',
    'Kelab SPBT',
    'Kelab Cegah Jenayah',
    'Kelab Dr. Muda',
    'Kelab Bimbingan dan Kerjaya'
  ],
  'Sukan & Permainan': [
    'Bola Sepak',
    'Bola Baling',
    'Bola Jaring',
    'Memanah',
    'Olahraga',
    'Catur',
    'Silat',
    'Ping Pong'
  ]
};

export const TAHAP_LIST = ['Tahap 1', 'Tahap 2'] as const;
