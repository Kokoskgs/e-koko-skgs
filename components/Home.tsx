
import React from 'react';
import { AppRoute } from '../types';
import { FileText, ClipboardList, LayoutDashboard } from 'lucide-react';

interface HomeProps {
  onNavigate: (route: AppRoute) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const cards = [
    {
      title: 'Laporan Perjumpaan',
      desc: 'Hantar laporan aktiviti kokurikulum mingguan.',
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      route: AppRoute.LAPORAN,
      color: 'bg-blue-50 border-blue-100 hover:border-blue-300'
    },
    {
      title: 'Minit Mesyuarat Agung',
      desc: 'Hantar minit mesyuarat agung & jana carta organisasi.',
      icon: <ClipboardList className="w-8 h-8 text-emerald-600" />,
      route: AppRoute.MINIT,
      color: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300'
    },
    {
      title: 'Dashboard Analisis',
      desc: 'Semak, edit, dan analisis data kokurikulum.',
      icon: <LayoutDashboard className="w-8 h-8 text-purple-600" />,
      route: AppRoute.DASHBOARD,
      color: 'bg-purple-50 border-purple-100 hover:border-purple-300'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Selamat Datang ke E-Kokurikulum</h2>
        <p className="text-lg text-gray-600">Sistem Pengurusan & Penghantaran Laporan Kokurikulum SK Gombak Setia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => onNavigate(card.route)}
            className={`${card.color} border-2 p-8 rounded-2xl flex flex-col items-center text-center transition-all transform hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              {card.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-500">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
