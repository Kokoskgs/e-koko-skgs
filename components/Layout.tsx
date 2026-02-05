
import React from 'react';
import { SCHOOL_LOGO } from '../constants';
import { AppRoute } from '../types';
import { LayoutDashboard, FileText, ClipboardList, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRoute, setRoute }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setRoute(AppRoute.HOME)}>
            <img src={SCHOOL_LOGO} alt="SK Gombak Setia" className="h-14 w-auto object-contain" />
            <div>
              <h1 className="font-bold text-lg text-blue-900 leading-tight">E-Kokurikulum</h1>
              <p className="text-sm text-gray-500 font-medium">SK Gombak Setia</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            <NavButton 
              active={activeRoute === AppRoute.LAPORAN} 
              onClick={() => setRoute(AppRoute.LAPORAN)}
              icon={<FileText className="w-4 h-4" />}
              label="Laporan Perjumpaan"
            />
            <NavButton 
              active={activeRoute === AppRoute.MINIT} 
              onClick={() => setRoute(AppRoute.MINIT)}
              icon={<ClipboardList className="w-4 h-4" />}
              label="Minit Agung"
            />
            <NavButton 
              active={activeRoute === AppRoute.DASHBOARD} 
              onClick={() => setRoute(AppRoute.DASHBOARD)}
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Dashboard"
            />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile Footer Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 shadow-2xl z-50">
         <MobileNavButton 
            active={activeRoute === AppRoute.HOME} 
            onClick={() => setRoute(AppRoute.HOME)}
            icon={<Home className="w-6 h-6" />}
          />
         <MobileNavButton 
            active={activeRoute === AppRoute.LAPORAN} 
            onClick={() => setRoute(AppRoute.LAPORAN)}
            icon={<FileText className="w-6 h-6" />}
          />
         <MobileNavButton 
            active={activeRoute === AppRoute.MINIT} 
            onClick={() => setRoute(AppRoute.MINIT)}
            icon={<ClipboardList className="w-6 h-6" />}
          />
         <MobileNavButton 
            active={activeRoute === AppRoute.DASHBOARD} 
            onClick={() => setRoute(AppRoute.DASHBOARD)}
            icon={<LayoutDashboard className="w-6 h-6" />}
          />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
      active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const MobileNavButton = ({ active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl ${active ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
  >
    {icon}
  </button>
);

export default Layout;
