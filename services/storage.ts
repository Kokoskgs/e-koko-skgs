
import { LaporanPerjumpaan, MinitMesyuaratAgung } from '../types';

const LAPORAN_KEY = 'skgs_laporan_data';
const MINIT_KEY = 'skgs_minit_data';

/**
 * ID Google Sheet: 18sYXQto5_aBp4YAp2bV3UKo8Cpj5gmqyjFxUTEpfdVk
 * URL GAS yang baru (exec)
 */
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyp6psVT4shMhLeEi-wHzWAsJhAKt729qgt-NLtgLo/exec';
const SPREADSHEET_ID = '18sYXQto5_aBp4YAp2bV3UKo8Cpj5gmqyjFxUTEpfdVk';

export const saveLaporan = async (data: LaporanPerjumpaan) => {
  const existing = getLaporan();
  const updated = [...existing, data];
  localStorage.setItem(LAPORAN_KEY, JSON.stringify(updated));

  try {
    await fetch(GAS_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ 
        spreadsheetId: SPREADSHEET_ID,
        type: 'laporan', 
        payload: data 
      })
    });
  } catch (e) {
    console.error("Gagal hantar ke Cloud:", e);
  }
};

export const getLaporan = (): LaporanPerjumpaan[] => {
  const data = localStorage.getItem(LAPORAN_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveMinit = async (data: MinitMesyuaratAgung) => {
  const existing = getMinit();
  const updated = [...existing, data];
  localStorage.setItem(MINIT_KEY, JSON.stringify(updated));

  try {
    await fetch(GAS_API_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ 
        spreadsheetId: SPREADSHEET_ID,
        type: 'minit', 
        payload: data 
      })
    });
  } catch (e) {
    console.error("Gagal hantar ke Cloud:", e);
  }
};

export const getMinit = (): MinitMesyuaratAgung[] => {
  const data = localStorage.getItem(MINIT_KEY);
  return data ? JSON.parse(data) : [];
};
