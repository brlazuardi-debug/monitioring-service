import React, { useContext } from 'react';
import { DashboardProvider, DashboardContext } from './context/DashboardContext';
import Layout from './components/Layout';
import DashboardOverview from './views/DashboardOverview';
import AdminManagement from './views/AdminManagement';
import SystemCatalog from './views/SystemCatalog';
import NodeDetail from './views/NodeDetail';
import SecurityCenter from './views/SecurityCenter';
import SystemSettings from './views/SystemSettings';

function MainApp() {
  const { activeView } = useContext(DashboardContext);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'admin':
        return <AdminManagement />;
      case 'catalog':
        return <SystemCatalog />;
      case 'nodes':
        return <NodeDetail />;
      case 'security':
        return <SecurityCenter />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return <Layout>{renderActiveView()}</Layout>;
}

export default function App() {
  return (
    <DashboardProvider>
      <MainApp />
    </DashboardProvider>
  );
}
