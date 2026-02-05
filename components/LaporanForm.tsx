
import React, { useState } from 'react';
import { UNIT_DATA, TAHAP_LIST, SCHOOL_LOGO } from '../constants';
import { LaporanPerjumpaan, UnitCategory } from '../types';
import { saveLaporan } from '../services/storage';
import { Camera, Send, Eye, X, Loader2, ArrowLeft, Printer, FileText } from 'lucide-react';

const LaporanForm: React.FC = () => {
  const [step, setStep] = useState<'form' | 'preview' | 'submitting'>('form');
  const [formData, setFormData] = useState<Partial<LaporanPerjumpaan>>({
    perjumpaanKe: 1,
    tahun: new Date().getFullYear().toString(),
    images: [],
    category: 'Unit Beruniform'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + (formData.images?.length || 0) > 4) {
      alert("Hanya 4 keping gambar dibenarkan.");
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setStep('submitting');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await saveLaporan({
      ...formData as LaporanPerjumpaan,
      id: Date.now().toString(),
      timestamp: Date.now()
    });
    alert("Laporan berjaya dihantar!");
    window.location.reload();
  };

  if (step === 'submitting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-2xl shadow-sm">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Menghantar Laporan...</h2>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center no-print">
          <button onClick={() => setStep('form')} className="flex items-center text-gray-600 hover:text-gray-900 font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Edit Semula
          </button>
          <div className="flex space-x-3">
             <button onClick={() => window.print()} className="bg-slate-100 px-6 py-2 rounded-lg font-bold flex items-center">
              <Printer className="w-4 h-4 mr-2" /> Cetak
            </button>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center">
              <Send className="w-4 h-4 mr-2" /> Sah & Hantar
            </button>
          </div>
        </div>

        <div className="bg-white p-12 shadow-xl border rounded-lg max-w-4xl mx-auto text-sm print:shadow-none print:border-0">
          <div className="flex items-center justify-between border-b-2 border-blue-900 pb-6 mb-8">
            <img src={SCHOOL_LOGO} alt="SKGS" className="h-16" />
            <div className="text-right">
              <h2 className="text-xl font-bold text-blue-900 uppercase">Laporan Perjumpaan Kokurikulum</h2>
              <p className="font-semibold">SK Gombak Setia</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <DetailRow label="Unit" value={formData.unit} />
            <DetailRow label="Kehadiran" value={`${formData.kehadiranMurid} orang`} />
          </div>
          <Section title="Ringkasan Aktiviti" content={formData.ringkasanAktiviti} />
          <div className="grid grid-cols-2 gap-4 mt-6">
            {formData.images?.map((img, i) => <img key={i} src={img} className="w-full h-48 object-cover rounded-lg border" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-8 flex items-center text-blue-600"><FileText className="mr-3"/> Laporan Aktiviti</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block text-sm font-bold">Kategori
            <select name="category" className="w-full mt-1 border p-3 rounded-lg bg-gray-50" onChange={handleInputChange}>
              {Object.keys(UNIT_DATA).map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </label>
          <label className="block text-sm font-bold">Unit
            <select name="unit" className="w-full mt-1 border p-3 rounded-lg bg-gray-50" value={formData.unit || ''} onChange={handleInputChange}>
              <option value="">Pilih Unit</option>
              {UNIT_DATA[formData.category as UnitCategory || 'Unit Beruniform'].map(u => <option key={u}>{u}</option>)}
            </select>
          </label>
          <label className="block text-sm font-bold">Bilangan Kehadiran
            <input type="number" name="kehadiranMurid" className="w-full mt-1 border p-3 rounded-lg bg-gray-50" onChange={handleInputChange} />
          </label>
      </div>
      <textarea name="ringkasanAktiviti" placeholder="Ringkasan Aktiviti..." className="w-full mt-6 border p-4 rounded-lg bg-gray-50 h-32" onChange={handleInputChange}></textarea>
      
      <div className="mt-6">
        <p className="text-sm font-bold mb-3">Gambar (Maks 4)</p>
        <div className="grid grid-cols-4 gap-3">
          {formData.images?.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img} className="h-20 w-full object-cover rounded-lg border" />
              <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
            </div>
          ))}
          {(formData.images?.length || 0) < 4 && (
            <label className="h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50">
              <Camera size={20} className="text-gray-400"/>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          )}
        </div>
      </div>
      <button disabled={!formData.unit} onClick={() => setStep('preview')} className="w-full mt-10 bg-blue-600 text-white py-4 rounded-xl font-bold disabled:opacity-50">Semak Laporan</button>
    </div>
  );
};

const DetailRow = ({ label, value }: any) => (
  <div className="flex flex-col border-b pb-1">
    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</span>
    <span className="text-gray-800 font-medium">{value || '-'}</span>
  </div>
);

const Section = ({ title, content }: any) => (
  <div className="bg-gray-50 p-4 rounded-lg border">
    <h4 className="font-bold text-blue-900 text-xs uppercase mb-2">{title}</h4>
    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{content || '-'}</p>
  </div>
);

export default LaporanForm;
