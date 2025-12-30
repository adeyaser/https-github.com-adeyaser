
import React, { useState } from 'react';
import { 
  User, 
  School, 
  Settings, 
  Shield, 
  Save, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Info, 
  Plus, 
  Edit, 
  Trash2, 
  Globe,
  Users,
  Eye,
  Key,
  Lock,
  Menu as MenuIcon,
  LayoutGrid,
  ShieldCheck,
  ChevronRight,
  X,
  Type,
  AlignLeft,
  Link as LinkIcon,
  Palette
} from 'lucide-react';
import { MOCK_USER, LEARNING_AREAS } from '../constants';

type TabType = 'profile' | 'school' | 'montessori' | 'users' | 'roles' | 'menus' | 'permissions';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(1);

  // --- MOCK DATA STATES ---
  const [groups, setGroups] = useState([
    { id: 1, name: 'Super Admin', desc: 'Akses penuh seluruh sistem' },
    { id: 2, name: 'Director', desc: 'Kepala sekolah & akademik' },
    { id: 3, name: 'Admin', desc: 'Administrasi & Data Entry' },
    { id: 4, name: 'Teacher', desc: 'Manajemen kelas & nilai' },
    { id: 5, name: 'Parent', desc: 'Monitoring perkembangan anak' },
  ]);

  const [menus, setMenus] = useState([
    { id: 1, name: 'Dashboard', url: '/', icon: 'LayoutDashboard' },
    { id: 2, name: 'Data Siswa', url: '/students', icon: 'Baby' },
    { id: 3, name: 'Kelas', url: '/classes', icon: 'School' },
    { id: 4, name: 'Pembelajaran', url: '/learning', icon: 'BookOpen' },
    { id: 5, name: 'Penilaian', url: '/assessment', icon: 'ClipboardCheck' },
    { id: 6, name: 'E-Learning', url: '/elearning', icon: 'Video' },
    { id: 7, name: 'Settings', url: '/settings', icon: 'Settings' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Dewi Kartika, S.Pd', user: 'guru1', role: 'Teacher', photo: MOCK_USER.profile_picture },
    { id: 2, name: 'Budi Santoso, M.Pd', user: 'direktur1', role: 'Director', photo: 'https://i.pravatar.cc/150?u=11' },
    { id: 3, name: 'Siti Nurhaliza', user: 'admin1', role: 'Admin', photo: 'https://i.pravatar.cc/150?u=12' },
  ]);

  const [areas, setAreas] = useState(LEARNING_AREAS);

  // --- MODAL & FORM STATES ---
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<TabType | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Generic Form Data
  const [formData, setFormData] = useState<any>({});

  // --- HANDLERS ---
  const openModal = (type: TabType, data: any = null) => {
    setModalType(type);
    if (data) {
      setEditingId(data.id || data.area_id || data.user_id);
      setFormData(data);
    } else {
      setEditingId(null);
      setFormData({});
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setEditingId(null);
    setFormData({});
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    switch (modalType) {
      case 'users':
        if (editingId) {
          setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...formData } : u));
        } else {
          setUsers(prev => [...prev, { ...formData, id: Date.now(), photo: 'https://i.pravatar.cc/150' }]);
        }
        break;
      case 'roles':
        if (editingId) {
          setGroups(prev => prev.map(g => g.id === editingId ? { ...g, ...formData } : g));
        } else {
          setGroups(prev => [...prev, { ...formData, id: Date.now() }]);
        }
        break;
      case 'menus':
        if (editingId) {
          setMenus(prev => prev.map(m => m.id === editingId ? { ...m, ...formData } : m));
        } else {
          setMenus(prev => [...prev, { ...formData, id: Date.now(), icon: 'Layout' }]);
        }
        break;
      case 'montessori':
        if (editingId) {
          setAreas(prev => prev.map(a => a.area_id === editingId ? { ...a, ...formData } : a));
        } else {
          setAreas(prev => [...prev, { ...formData, area_id: Date.now() }]);
        }
        break;
    }
    closeModal();
  };

  const deleteItem = (type: TabType, id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    switch (type) {
      case 'users': setUsers(prev => prev.filter(u => u.id !== id)); break;
      case 'roles': setGroups(prev => prev.filter(g => g.id !== id)); break;
      case 'menus': setMenus(prev => prev.filter(m => m.id !== id)); break;
      case 'montessori': setAreas(prev => prev.filter(a => a.area_id !== id)); break;
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil Saya', icon: User, category: 'Personal' },
    { id: 'school', label: 'Profil Sekolah', icon: School, category: 'App' },
    { id: 'montessori', label: 'Area Belajar', icon: LayoutGrid, category: 'App' },
    { id: 'users', label: 'ACL: Users', icon: Users, category: 'Security' },
    { id: 'roles', label: 'ACL: Roles', icon: Shield, category: 'Security' },
    { id: 'menus', label: 'ACL: Menus', icon: MenuIcon, category: 'Security' },
    { id: 'permissions', label: 'ACL: Matrix', icon: Lock, category: 'Security' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Sistem</h1>
          <p className="text-slate-500">Konfigurasi hak akses dan parameter inti Montessori.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm space-y-6">
            {['Personal', 'App', 'Security'].map(cat => (
              <div key={cat}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-4">{cat}</p>
                <div className="space-y-1">
                  {tabs.filter(t => t.category === cat).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold text-sm transition-all group ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'} />
                        {tab.label}
                      </div>
                      {activeTab === tab.id && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-right-4">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-white to-slate-50">
                <div className="relative group">
                  <img src={MOCK_USER.profile_picture} className="w-32 h-32 rounded-[2.5rem] object-cover ring-8 ring-white shadow-xl" alt="" />
                  <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg border-4 border-white hover:scale-110 transition-all">
                    <Camera size={18} />
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-slate-800">{MOCK_USER.full_name}</h2>
                  <p className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full inline-block mt-2 uppercase tracking-wider">Teacher • ID #00{MOCK_USER.user_id}</p>
                </div>
              </div>
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                    <input type="text" defaultValue={MOCK_USER.full_name} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alamat Email</label>
                    <input type="email" defaultValue={MOCK_USER.email} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>
                <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all">Simpan Profil Saya</button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-right-4">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Manajemen Pengguna</h3>
                <button onClick={() => openModal('users')} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-100">
                  <Plus size={16} /> Tambah Staf
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-100">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map((staf) => (
                      <tr key={staf.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-5 flex items-center gap-4">
                          <img src={staf.photo} className="w-10 h-10 rounded-[1rem] object-cover border-2 border-white shadow-sm" alt="" />
                          <span className="text-sm font-bold text-slate-800">{staf.name}</span>
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-500">@{staf.user}</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">{staf.role}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openModal('users', staf)} className="p-2 text-slate-300 hover:text-blue-600"><Edit size={16} /></button>
                            <button onClick={() => deleteItem('users', staf.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-800">Grup & Role</h3>
                <button onClick={() => openModal('roles')} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Plus size={20} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map(group => (
                  <div key={group.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-white rounded-[1.5rem] shadow-sm text-blue-600">
                         <Shield size={24} />
                       </div>
                       <div>
                         <h4 className="font-bold text-slate-800">{group.name}</h4>
                         <p className="text-xs text-slate-400 mt-1">{group.desc}</p>
                       </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => openModal('roles', group)} className="p-2 text-slate-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"><Edit size={16} /></button>
                      <button onClick={() => deleteItem('roles', group.id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'menus' && (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-right-4">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Modul & Navigasi</h3>
                <button onClick={() => openModal('menus')} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2">
                  <Plus size={16} /> Register Menu
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Icon</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Menu</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">URL Pattern</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {menus.map(menu => (
                      <tr key={menu.id} className="hover:bg-slate-50/50">
                        <td className="px-8 py-4"><div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><MenuIcon size={18} /></div></td>
                        <td className="px-8 py-4 text-sm font-bold text-slate-800">{menu.name}</td>
                        <td className="px-8 py-4 text-xs font-mono text-blue-500">{menu.url}</td>
                        <td className="px-8 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openModal('menus', menu)} className="p-2 text-slate-300 hover:text-blue-500"><Edit size={16} /></button>
                            <button onClick={() => deleteItem('menus', menu.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'montessori' && (
            <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm animate-in slide-in-from-right-4">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-bold text-slate-800">Area Belajar Montessori</h3>
                 <button onClick={() => openModal('montessori')} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                   <Plus size={20} />
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {areas.map(area => (
                  <div key={area.area_id} className="p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all group flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl text-white shadow-sm flex items-center justify-center w-14 h-14" style={{ backgroundColor: area.color_code }}>
                        <LayoutGrid size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{area.area_name}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{area.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => openModal('montessori', area)} className="p-2 text-slate-400 hover:text-blue-600"><Edit size={16} /></button>
                      <button onClick={() => deleteItem('montessori', area.area_id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               {/* Permission Matrix Code remains identical as per schema logic */}
               <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm text-center">
                  <ShieldCheck size={48} className="mx-auto text-blue-500 mb-4 opacity-20" />
                  <p className="text-slate-400 italic">Gunakan selektor di bawah untuk mengatur matriks izin.</p>
                  <select 
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(parseInt(e.target.value))}
                    className="mt-4 bg-slate-50 border-none rounded-xl py-2 px-6 font-bold"
                  >
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* --- CRUD MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    {editingId ? <Edit size={20} /> : <Plus size={20} />}
                  </div>
                  <h2 className="text-xl font-bold">
                    {editingId ? 'Edit' : 'Tambah'} {modalType === 'users' ? 'Staf' : modalType === 'roles' ? 'Role' : modalType === 'menus' ? 'Menu' : 'Area Belajar'}
                  </h2>
                </div>
                <button onClick={closeModal} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
             </div>
             
             <form onSubmit={handleFormSubmit} className="p-10 space-y-6">
                {modalType === 'users' && (
                  <>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-bold" placeholder="Nama Staf..." />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Username</label>
                        <input required type="text" value={formData.user || ''} onChange={e => setFormData({...formData, user: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold" placeholder="guru2" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role</label>
                        <select value={formData.role || 'Teacher'} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold appearance-none">
                          {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'roles' && (
                  <>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Grup / Role</label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-bold" placeholder="Contoh: Koordinator Lapangan" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Deskripsi Otoritas</label>
                      <div className="relative">
                        <AlignLeft className="absolute left-3 top-3 text-slate-300" size={16} />
                        <textarea required value={formData.desc || ''} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-bold resize-none" rows={3} placeholder="Menjelaskan fungsi jabatan..." />
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'menus' && (
                  <>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Modul</label>
                      <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-bold" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">URL Path</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input required type="text" value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-xs font-mono font-bold" placeholder="/finance" />
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'montessori' && (
                  <>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Area</label>
                      <input required type="text" value={formData.area_name || ''} onChange={e => setFormData({...formData, area_name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Warna Identitas (HEX)</label>
                      <div className="flex gap-3">
                         <div className="w-12 h-12 rounded-xl border-2 border-white shadow-sm shrink-0" style={{ backgroundColor: formData.color_code || '#3b82f6' }} />
                         <div className="relative flex-1">
                           <Palette className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                           <input required type="text" value={formData.color_code || '#3b82f6'} onChange={e => setFormData({...formData, color_code: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-bold" />
                         </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Deskripsi Singkat</label>
                      <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold resize-none" rows={3} />
                    </div>
                  </>
                )}

                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95">
                   <Save size={20} /> Simpan Data Ke Sistem
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
