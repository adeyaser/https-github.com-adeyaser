
import React, { useState } from 'react';
import { Menu, X, Bell, Search, User } from 'lucide-react';
import { MENU_ITEMS, APP_NAME, MOCK_USER } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePath, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 z-50
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              P
            </div>
            <span className="text-xl font-bold text-slate-800">{APP_NAME}</span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${activePath === item.path 
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
              <img 
                src={MOCK_USER.profile_picture} 
                className="w-10 h-10 rounded-full object-cover" 
                alt="Profile"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{MOCK_USER.full_name}</p>
                <p className="text-xs text-slate-500 capitalize">{MOCK_USER.user_type}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari data..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-48 lg:w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
            <button className="flex items-center gap-2 p-1 pl-3 hover:bg-slate-50 rounded-full border border-transparent hover:border-slate-100 transition-all">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Akun Saya</span>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={18} />
              </div>
            </button>
          </div>
        </header>

        {/* Page Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
