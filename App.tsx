
import React from 'react';
import { useStore } from './store';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ContractList } from './components/ContractList';
import { ContractDetails } from './components/ContractDetails';
import { Layout } from './components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const currentView = useStore((state) => state.currentView);
  const user = useStore((state) => state.user);

  // If not logged in, show Login only
  if (!user || currentView === 'login') {
    return <Login />;
  }

  // Render view content based on state
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'contracts':
        return <ContractList />;
      case 'contract-details':
        return <ContractDetails />;
      case 'settings':
        return (
            <div className="p-8 flex items-center justify-center h-full text-gray-500">
                Configurações do sistema (Em breve)
            </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default App;
