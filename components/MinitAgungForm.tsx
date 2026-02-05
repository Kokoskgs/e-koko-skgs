
import React, { useState } from 'react';
import { UNIT_DATA, SCHOOL_LOGO } from '../constants';
import { MinitMesyuaratAgung, UnitCategory } from '../types';
import { saveMinit } from '../services/storage';
import { Send, Eye, Loader2, ArrowLeft, Printer, Users, ClipboardList } from 'lucide-react';

const MinitAgungForm: React.FC = () => {
  const [step, setStep] = useState<'form' | 'preview' | 'submitting'>('form');
  const [formData, setFormData] = useState<Partial<MinitMesyuaratAgung>>({
    tahun: new Date().getFullYear().toString(),
    category: 'Unit Beruniform',
    tahap: 'Tahap 2',
    jk: {
      pengerusi: '',
      naibPengerusi: '',
      bendahari: '',
      naibBendahari: '',
      setiausaha: '',
      naibSetiausaha: '',
      ajkTahun6: '',
      ajkTahun5: '',
      ajkTahun4: '',
      ajkTahun3: ''
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentData = (prev[parent as keyof MinitMesyuaratAgung] as any) || {};
        return {
          ...prev,
          [parent]: { 
            ...parentData, 
            [child]: value 
          }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setStep('submitting');
    try {
      await saveMinit({
        ...formData as MinitMesyuaratAgung,
        id: Date.now().toString(),
        timestamp: Date.now()
      });
      alert("Minit & Carta Organisasi berjaya dihantar!");
      window.location.reload();
    } catch (error) {
      alert("Gagal menghantar laporan. Sila cuba lagi.");
      setStep('form');
    }
  };

  if (step === 'submitting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-2xl shadow-sm">
        <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Menghantar Minit Agung...</h2>
      </div>
    );
  }

  if (step === 'preview') {
    const jk = formData.jk || {} as any;
    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center no-print">
          <button onClick={() => setStep('form')} className="flex items-center text-gray-600 hover:text-gray-900 font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </button>
          <div className="flex space-x-3">
             <button onClick={() => window.print()} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-bold flex items-center hover:bg-gray-200">
              <Printer className="w-4 h-4 mr-2" /> Cetak
            </button>
            <button onClick={handleSubmit} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold flex items-center hover:bg-emerald-700 shadow-md">
              <Send className="w-4 h-4 mr-2" /> Sah & Hantar
            </button>
          </div>
        </div>

        <div className="bg-white p-16 shadow-xl border rounded-lg max-w-4xl mx-auto text-sm leading-relaxed text-gray-800 print:shadow-none print:border-0 print:p-0">
          <div className="text-center mb-12 border-b-2 border-black pb-4">
             <img src={SCHOOL_LOGO} alt="SKGS" className="h-20 w-auto mx-auto mb-4" />
             <h1 className="text-xl font-bold uppercase underline">Minit Mesyuarat Agung Unit Kokurikulum</h1>
             <h2 className="text-lg font-bold uppercase">{String(formData.unit || '')}</h2>
             <h2 className="text-md font-bold uppercase">{String(formData.tahap || '')} ({String(formData.tahun || '')})</h2>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="font-bold border-b mb-2">1. Senarai Kehadiran</h3>
              <p className="font-semibold">Kehadiran Guru:</p>
              <p className="whitespace-pre-line ml-4 mb-4">{String(formData.kehadiranGuru || 'Tiada maklumat')}</p>
              <p className="font-semibold">Kehadiran Murid: <span className="font-normal">{String(formData.kehadiranMurid || 0)} orang</span></p>
            </section>

            <section>
              <h3 className="font-bold border-b mb-2">2. Pelantikan Jawatankuasa {String(formData.tahun || '')}</h3>
              <table className="w-full border-collapse border border-black mb-6">
                <tbody>
                  {[
                    { l: 'Pengerusi', v: jk.pengerusi },
                    { l: 'Naib Pengerusi', v: jk.naibPengerusi },
                    { l: 'Setiausaha', v: jk.setiausaha },
                    { l: 'Naib Setiausaha', v: jk.naibSetiausaha },
                    { l: 'Bendahari', v: jk.bendahari },
                    { l: 'Naib Bendahari', v: jk.naibBendahari },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="border border-black p-2 font-semibold">{String(row.l)}</td>
                      <td className="border border-black p-2">{String(row.v || '-')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <div className="mt-12">
              <p>Disediakan oleh,</p>
              <div className="mt-8">
                <p className="font-bold border-b border-black inline-block min-w-[200px] pb-1 uppercase">{String(formData.disediakanOleh || '')}</p>
                <p>Setiausaha {String(formData.unit || '')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-16 shadow-xl border rounded-lg max-w-4xl mx-auto print:shadow-none print:border-0 print:p-0 page-break-before">
          <div className="text-center mb-12">
            <h1 className="text-2xl font-bold uppercase text-blue-900 mb-2">Carta Organisasi</h1>
            <h2 className="text-xl font-bold uppercase text-gray-700">{String(formData.unit || '')}</h2>
            <p className="font-medium text-gray-500">Sesi {String(formData.tahun || '')}</p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <OrgBox label="PENGERUSI" name={jk.pengerusi} />
            <OrgBox label="NAIB PENGERUSI" name={jk.naibPengerusi} color="bg-blue-50 border-blue-200" />
            <div className="flex justify-center space-x-12 w-full">
               <OrgBox label="SETIAUSAHA" name={jk.setiausaha} color="bg-emerald-50 border-emerald-200" />
               <OrgBox label="BENDAHARI" name={jk.bendahari} color="bg-amber-50 border-amber-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="flex items-center space-x-3 mb-8 pb-4 border-b">
          <ClipboardList className="w-6 h-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-800">Borang Minit Mesyuarat Agung</h2>
        </div>

        <div className="space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl">
             <label className="block">
                <span className="text-sm font-semibold text-gray-700">Kategori Unit</span>
                <select name="category" value={formData.category} className="mt-1 block w-full rounded-lg border-gray-300 py-3 px-4 shadow-sm" onChange={(e) => { handleInputChange(e); setFormData(p => ({...p, unit: ''})); }}>
                  {Object.keys(UNIT_DATA).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">Nama Unit</span>
                <select name="unit" className="mt-1 block w-full rounded-lg border-gray-300 py-3 px-4 shadow-sm" onChange={handleInputChange} value={formData.unit || ''}>
                  <option value="">Pilih Unit</option>
                  {UNIT_DATA[formData.category as UnitCategory || 'Unit Beruniform'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </label>
          </section>

          <section className="space-y-4">
             <h3 className="font-bold text-lg text-gray-800 flex items-center"><Users className="w-5 h-5 mr-2" /> Senarai Kehadiran</h3>
             <textarea name="kehadiranGuru" rows={3} placeholder="Nama guru..." className="mt-1 block w-full rounded-lg border-gray-300 py-3 px-4 shadow-sm" onChange={handleInputChange}></textarea>
             <div className="grid grid-cols-2 gap-6">
                <input type="number" name="kehadiranMurid" placeholder="Bil. Murid" className="mt-1 block w-full rounded-lg border-gray-300 py-3 px-4 shadow-sm" onChange={handleInputChange} />
                <input type="text" name="ketuaGuruPenasihat" placeholder="Ketua Guru Penasihat" className="mt-1 block w-full rounded-lg border-gray-300 py-3 px-4 shadow-sm" onChange={handleInputChange} />
             </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <JKInput label="Pengerusi" name="jk.pengerusi" value={formData.jk?.pengerusi} onChange={handleInputChange} />
             <JKInput label="Naib Pengerusi" name="jk.naibPengerusi" value={formData.jk?.naibPengerusi} onChange={handleInputChange} />
             <JKInput label="Setiausaha" name="jk.setiausaha" value={formData.jk?.setiausaha} onChange={handleInputChange} />
             <JKInput label="Bendahari" name="jk.bendahari" value={formData.jk?.bendahari} onChange={handleInputChange} />
          </div>

          <section className="space-y-4 pt-4 border-t">
             <input type="text" name="disediakanOleh" placeholder="Nama Setiausaha (Penyedia)" className="mt-1 block w-full rounded-lg border-gray-300 py-3 px-4 shadow-sm" onChange={handleInputChange} />
          </section>

          <div className="pt-8 border-t flex justify-end">
             <button 
                onClick={() => setStep('preview')}
                disabled={!formData.unit || !formData.disediakanOleh}
                className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold flex items-center hover:bg-emerald-700 disabled:opacity-50 shadow-lg"
              >
                <Eye className="w-5 h-5 mr-2" /> Pratinjau Minit
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JKInput = ({ label, name, value, onChange }: any) => (
  <label className="block">
    <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
    <input 
      type="text" 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      className="mt-1 block w-full rounded-lg border-gray-300 py-2 px-3 bg-gray-50" 
    />
  </label>
);

const OrgBox = ({ label, name, color = "bg-white border-gray-300" }: any) => (
  <div className={`w-full max-w-xs border-2 p-3 rounded-lg shadow-sm text-center mx-auto ${color}`}>
     <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b mb-1">{String(label)}</p>
     <p className="text-sm font-bold text-blue-900 truncate">
       {String(name || 'Tiada')}
     </p>
  </div>
);

export default MinitAgungForm;
