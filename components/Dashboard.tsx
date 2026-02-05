
import React, { useState, useEffect, useMemo } from 'react';
import { getLaporan, getMinit } from '../services/storage';
import { LaporanPerjumpaan, MinitMesyuaratAgung, Tahap, UnitCategory } from '../types';
import { UNIT_DATA, TAHAP_LIST } from '../constants';
import { Filter, Search, FileText, ClipboardList, TrendingUp, Users, Calendar, ArrowRight, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [laporanList, setLaporanList] = useState<LaporanPerjumpaan[]>([]);
  const [minitList, setMinitList] = useState<MinitMesyuaratAgung[]>([]);
  const [activeTab, setActiveTab] = useState<'laporan' | 'minit'>('laporan');
  
  // Filters
  const [filterTahap, setFilterTahap] = useState<Tahap | ''>('');
  const [filterCategory, setFilterCategory] = useState<UnitCategory | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLaporanList(getLaporan());
    setMinitList(getMinit());
  }, []);

  const filteredLaporan = laporanList.filter(l => 
    (!filterTahap || l.tahap === filterTahap) &&
    (!filterCategory || l.category === filterCategory) &&
    (l.unit.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredMinit = minitList.filter(m => 
    (!filterTahap || m.tahap === filterTahap) &&
    (!filterCategory || m.category === filterCategory) &&
    (m.unit.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Data for Bar Chart: Reports per Month (Last 6 Months)
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
    const now = new Date();
    const result = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = months[d.getMonth()];
      const year = d.getFullYear();
      const count = laporanList.filter(l => {
        const ld = new Date(l.timestamp);
        return ld.getMonth() === d.getMonth() && ld.getFullYear() === year;
      }).length;
      result.push({ label: `${monthLabel} ${year}`, count });
    }
    return result;
  }, [laporanList]);

  // Data for Pie Chart: Unit Distribution (Minit Agung)
  const unitDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    minitList.forEach(m => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    
    const total = minitList.length || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: (count / total) * 100
    }));
  }, [minitList]);

  const categoryColors: Record<string, string> = {
    'Rumah Sukan': '#ef4444',
    'Unit Beruniform': '#10b981',
    'Kelab & Persatuan': '#8b5cf6',
    'Sukan & Permainan': '#f59e0b'
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Laporan" value={laporanList.length} icon={<FileText className="text-blue-600" />} />
        <StatCard title="Total Minit Agung" value={minitList.length} icon={<ClipboardList className="text-emerald-600" />} />
        <StatCard title="Purata Kehadiran" value={`${Math.round(laporanList.reduce((acc, l) => acc + (l.kehadiranMurid || 0), 0) / (laporanList.length || 1))} org`} icon={<Users className="text-orange-600" />} />
        <StatCard title="Aktiviti Tahun 2025" value={laporanList.length + minitList.length} icon={<TrendingUp className="text-purple-600" />} />
      </div>

      {/* Visualisasi Data Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart - Laporan Trend */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">Trend Penghantaran Laporan (6 Bulan)</h3>
          </div>
          <div className="h-48 flex items-end justify-between space-x-2 px-2">
            {monthlyData.map((data, i) => {
              const maxCount = Math.max(...monthlyData.map(d => d.count)) || 1;
              const heightPercent = (data.count / maxCount) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  <div className="absolute -top-8 bg-blue-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.count} laporan
                  </div>
                  <div 
                    className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all duration-500"
                    style={{ height: `${heightPercent}%`, minHeight: data.count > 0 ? '4px' : '0' }}
                  ></div>
                  <span className="text-[10px] text-gray-400 font-bold mt-2 rotate-[-25deg] origin-top-left md:rotate-0">{data.label.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie Chart / Progress - Agihan Unit */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-800">Agihan Unit Minit Mesyuarat Agung</h3>
          </div>
          <div className="space-y-4">
            {unitDistribution.length > 0 ? (
              unitDistribution.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-900">{item.count} Unit ({Math.round(item.percent)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${item.percent}%`, 
                        backgroundColor: categoryColors[item.name] || '#94a3b8' 
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-400 text-sm italic">
                Tiada data agihan tersedia.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {/* Tabs & Controls */}
        <div className="border-b px-6 pt-4">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('laporan')}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'laporan' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Senarai Laporan Perjumpaan
            </button>
            <button 
              onClick={() => setActiveTab('minit')}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'minit' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Senarai Minit Mesyuarat Agung
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-gray-50 border-b flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari unit..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="rounded-lg border-gray-300 py-2 px-4 shadow-sm" onChange={(e) => setFilterTahap(e.target.value as any)}>
            <option value="">Semua Tahap</option>
            {TAHAP_LIST.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="rounded-lg border-gray-300 py-2 px-4 shadow-sm" onChange={(e) => setFilterCategory(e.target.value as any)}>
            <option value="">Semua Kategori</option>
            {Object.keys(UNIT_DATA).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Filter className="w-5 h-5 text-gray-400 ml-auto" />
        </div>

        {/* List */}
        <div className="overflow-x-auto">
          {activeTab === 'laporan' ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b">Tarikh</th>
                  <th className="px-6 py-4 border-b">Unit</th>
                  <th className="px-6 py-4 border-b">Tahap</th>
                  <th className="px-6 py-4 border-b">Bil</th>
                  <th className="px-6 py-4 border-b">Kehadiran</th>
                  <th className="px-6 py-4 border-b">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLaporan.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(item.timestamp).toLocaleDateString('ms-MY')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{item.unit}</div>
                      <div className="text-xs text-gray-400">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{item.tahap}</td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">{item.perjumpaanKe}</td>
                    <td className="px-6 py-4 text-sm">{item.kehadiranMurid} org</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 font-bold text-sm flex items-center">
                        Lihat <ArrowRight className="w-3 h-3 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredLaporan.length === 0 && (
                   <tr><td colSpan={6} className="text-center py-12 text-gray-400 italic">Tiada laporan dijumpai.</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 border-b">Tarikh</th>
                  <th className="px-6 py-4 border-b">Unit</th>
                  <th className="px-6 py-4 border-b">Tahap</th>
                  <th className="px-6 py-4 border-b">Tahun</th>
                  <th className="px-6 py-4 border-b">Kehadiran</th>
                  <th className="px-6 py-4 border-b">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMinit.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.timestamp).toLocaleDateString('ms-MY')}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{item.unit}</div>
                      <div className="text-xs text-gray-400">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{item.tahap}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{item.tahun}</td>
                    <td className="px-6 py-4 text-sm">{item.kehadiranMurid} org</td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-600 hover:text-emerald-800 font-bold text-sm flex items-center">
                        Lihat <ArrowRight className="w-3 h-3 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMinit.length === 0 && (
                   <tr><td colSpan={6} className="text-center py-12 text-gray-400 italic">Tiada minit agung dijumpai.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center space-x-4">
    <div className="bg-gray-50 p-3 rounded-xl">{icon}</div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;
