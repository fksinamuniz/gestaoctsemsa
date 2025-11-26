import React from 'react';
import { useStore } from '../store';
import { LayoutDashboard, FileText, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentView, setView, user, logout } = useStore();

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`flex flex-col md:flex-row items-center md:space-x-3 p-2 md:px-4 md:py-3 rounded-xl transition-all ${
        currentView === view 
          ? 'text-blue-600 md:bg-blue-50 font-bold' 
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className={`w-6 h-6 ${currentView === view ? 'fill-current' : 'stroke-current'}`} strokeWidth={currentView === view ? 2 : 2} />
      <span className="text-[10px] md:text-sm mt-1 md:mt-0">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen md:flex-row bg-gray-50">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full">
        <div className="p-6">
           <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                 <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">SMS Gestão</h1>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="contracts" icon={FileText} label="Contratos" />
            <NavItem view="settings" icon={Settings} label="Ajustes" />
        </nav>

        <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 mb-4 px-2">
                <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
            </div>
            <button 
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
            >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe px-6 py-2 flex justify-between items-center z-50">
        <NavItem view="contracts" icon={FileText} label="Contratos" />
        <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem view="settings" icon={Settings} label="Ajustes" />
        <button onClick={logout} className="flex flex-col items-center p-2 text-gray-400">
            <UserIcon className="w-6 h-6" />
            <span className="text-[10px] mt-1">Perfil</span>
        </button>
      </nav>
    </div>
  );
};