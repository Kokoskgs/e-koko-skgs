
import React, { useState } from 'react';
import { AppRoute } from './types';
import Layout from './components/Layout';
import Home from './components/Home';
import LaporanForm from './components/LaporanForm';
import MinitAgungForm from './components/MinitAgungForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.HOME);

  const renderContent = () => {
    switch (route) {
      case AppRoute.HOME:
        return <Home onNavigate={setRoute} />;
      case AppRoute.LAPORAN:
        return <LaporanForm />;
      case AppRoute.MINIT:
        return <MinitAgungForm />;
      case AppRoute.DASHBOARD:
        return <Dashboard />;
      default:
        return <Home onNavigate={setRoute} />;
    }
  };

  return (
    <Layout activeRoute={route} setRoute={setRoute}>
      {renderContent()}
    </Layout>
  );
};

export default App;
