
import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Bell, Search, User, Baby, BookOpen, Package, UserPlus, ChevronRight, FileSearch } from 'lucide-react';
import { MENU_ITEMS, APP_NAME, MOCK_USER, MOCK_STUDENTS, MOCK_ACTIVITIES, MOCK_MATERIALS, MOCK_ENROLLMENTS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

interface SearchResult {
  id: number | string;
  title: string;
  subtitle: string;
  type: 'student' | 'activity' | 'material' | 'enrollment';
  path: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activePath, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    MOCK_STUDENTS.forEach(s => {
      if (s.full_name.toLowerCase().includes(query) || s.nis.toLowerCase().includes(query)) {
        results.push({ id: `s-${s.student_id}`, title: s.full_name, subtitle: `Siswa • ${s.nis}`, type: 'student', path: '/students' });
      }
    });

    MOCK_ACTIVITIES.forEach(a => {
      if (a.title.toLowerCase().includes(query)) {
        results.push({ id: `a-${a.activity_id}`, title: a.title, subtitle: `Dokumentasi • ${a.activity_date}`, type: 'activity', path: '/learning' });
      }
    });

    MOCK_MATERIALS.forEach(m => {
      if (m.name.toLowerCase().includes(query)) {
        results.push({ id: `m-${m.id}`, title: m.name, subtitle: `Material • Rak ${m.shelf}`, type: 'material', path: '/materials' });
      }
    });

    MOCK_ENROLLMENTS.forEach(e => {
      if (e.name.toLowerCase().includes(query)) {
        results.push({ id: `e-${e.id}`, title: e.name, subtitle: `Pendaftar • Wali: ${e.parent}`, type: 'enrollment', path: '/enrollments' });
      }
    });

    setSearchResults(results.slice(0, 8));
    setIsSearchOpen(true);
  }, [searchQuery]);

  const handleResultClick = (path: string) => {
    onNavigate(path);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 z-50
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
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
            <div 
              onClick={() => onNavigate('/settings')}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-all group"
            >
              <img 
                src={MOCK_USER.profile_picture} 
                className="w-10 h-10 rounded-full object-cover group-hover:ring-2 ring-blue-400" 
                alt="Profile"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600">{MOCK_USER.full_name}</p>
                <p className="text-xs text-slate-500 capitalize">{MOCK_USER.user_type}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="relative" ref={searchRef}>
              <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search size={18} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari siswa, kegiatan, atau material..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
                  className="bg-transparent border-none focus:ring-0 text-sm w-48 lg:w-96 font-medium"
                />
              </div>

              {isSearchOpen && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[320px] lg:min-w-[400px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Hasil Pencarian Global</h4>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.path)}
                          className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50 transition-all group text-left"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm 
                            ${result.type === 'student' ? 'bg-blue-100 text-blue-600' : 
                              result.type === 'activity' ? 'bg-purple-100 text-purple-600' : 
                              result.type === 'material' ? 'bg-amber-100 text-amber-600' : 
                              'bg-emerald-100 text-emerald-600'}`}
                          >
                            {result.type === 'student' ? <Baby size={18} /> : 
                             result.type === 'activity' ? <BookOpen size={18} /> : 
                             result.type === 'material' ? <Package size={18} /> : 
                             <UserPlus size={18} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{result.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{result.subtitle}</p>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </button>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                           <FileSearch size={24} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">Data tidak ditemukan</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 relative">
            <button 
              onClick={() => setShowNotif(!showNotif)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            {showNotif && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in zoom-in-95">
                <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-400 uppercase tracking-widest">Notifikasi Baru</div>
                <div className="p-2 space-y-1">
                  <div className="p-3 hover:bg-blue-50 rounded-2xl transition-all cursor-pointer">
                    <p className="text-xs font-bold text-slate-800">Invoice baru dibuat</p>
                    <p className="text-[10px] text-slate-400">Tagihan SPP Alya telah terbit.</p>
                  </div>
                  <div className="p-3 hover:bg-blue-50 rounded-2xl transition-all cursor-pointer">
                    <p className="text-xs font-bold text-slate-800">Quiz Selesai</p>
                    <p className="text-[10px] text-slate-400">3 siswa baru saja menyelesaikan Quiz.</p>
                  </div>
                </div>
              </div>
            )}
            <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
            <button 
              onClick={() => onNavigate('/settings')}
              className="flex items-center gap-2 p-1 pl-3 hover:bg-slate-50 rounded-full border border-transparent hover:border-slate-100 transition-all"
            >
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Akun Saya</span>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={18} />
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
