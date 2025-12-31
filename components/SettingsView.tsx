
import React, { useState } from 'react';
import { 
  User, 
  School, 
  Shield, 
  Save, 
  Camera, 
  Mail, 
  Users,
  Lock,
  Menu as MenuIcon,
  LayoutGrid,
  ShieldCheck,
  ChevronRight,
  X,
  Palette,
  Globe,
  Bell,
  Eye,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { MOCK_USER, LEARNING_AREAS } from '../constants';

type TabType = 'profile' | 'school' | 'acl' | 'system';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [userProfile, setUserProfile] = useState(MOCK_USER);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      {/* SUCCESS TOAST */}
      {showToast && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom-10">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border border-white/20">
            <CheckCircle size={20} /> Perubahan Sistem Berhasil Disimpan!
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pengaturan Sistem</h1>
          <p className="text-slate-500">Konfigurasi otoritas, profil sekolah, dan preferensi aplikasi.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-80 shrink-0">
          <div className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm space-y-2">
             {(['profile', 'school', 'acl', 'system'] as const).map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] font-bold text-sm transition-all group ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                  <div className="flex items-center gap-4">
                    {tab === 'profile' ? <User size={18}/> : tab === 'school' ? <School size={18}/> : tab === 'acl' ? <Shield size={18}/> : <LayoutGrid size={18}/>}
                    <span className="capitalize">{tab === 'acl' ? 'Hak Akses' : tab}</span>
                  </div>
                  <ChevronRight size={14} className={activeTab === tab ? 'text-white' : 'text-slate-300'} />
               </button>
             ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-right-4">
               <div className="p-10 border-b border-slate-50 flex items-center gap-8 bg-gradient-to-br from-white to-slate-50/50">
                  <div className="relative">
                    <img src={userProfile.profile_picture} className="w-32 h-32 rounded-[3rem] object-cover ring-8 ring-white shadow-xl" alt="" />
                    <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg border-4 border-white hover:scale-110 transition-all"><Camera size={18}/></button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">{userProfile.full_name}</h2>
                    <p className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full inline-block mt-2 tracking-widest uppercase">{userProfile.user_type} • Staf Akademik</p>
                  </div>
               </div>
               <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                    <input name="full_name" type="text" value={userProfile.full_name} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Kependidikan</label>
                    <input name="email" type="email" value={userProfile.email} onChange={handleInputChange} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password Baru</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'school' && (
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 space-y-8 animate-in slide-in-from-right-4">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3"><Globe className="text-blue-600" /> Profil Instansi</h3>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama PAUD / Sekolah</label>
                    <input type="text" defaultValue="PAUD Cerdas Montessori" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Visi Sekolah (Ditampilkan di Landing Page)</label>
                    <textarea defaultValue="Membentuk generasi emas yang mandiri, kreatif, dan berakhlak mulia melalui metode Montessori terpadu." className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 h-32 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alamat Kantor</label>
                      <input type="text" defaultValue="Jl. Melati No. 123, Jakarta" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tahun Berdiri</label>
                      <input type="text" defaultValue="2010" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100" />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'acl' && (
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 space-y-8 animate-in slide-in-from-right-4">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3"><ShieldCheck className="text-blue-600" /> Access Control Matrix</h3>
                  <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">Kelola Role</button>
               </div>
               <div className="overflow-hidden border border-slate-100 rounded-[2rem]">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50">
                       <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Modul</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Admin</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Guru</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Orang Tua</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {['Data Siswa', 'Presensi', 'E-Learning', 'Rapor AI', 'Keuangan'].map(mod => (
                         <tr key={mod} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 text-sm font-bold text-slate-700">{mod}</td>
                            <td className="px-6 py-4 text-center"><div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center"><ShieldCheck size={12}/></div></td>
                            <td className="px-6 py-4 text-center"><div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center"><ShieldCheck size={12}/></div></td>
                            <td className="px-6 py-4 text-center"><div className="w-5 h-5 bg-slate-100 text-slate-400 rounded-full mx-auto flex items-center justify-center"><X size={12}/></div></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 space-y-8 animate-in slide-in-from-right-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3"><LayoutGrid className="text-blue-600" /> Preferensi Aplikasi</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-800">Notifikasi Email</p>
                    <p className="text-xs text-slate-500">Kirim laporan harian ke orang tua otomatis.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-6 h-6 rounded-md border-slate-300 text-blue-600 focus:ring-blue-100" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-800">Mode Maintenance</p>
                    <p className="text-xs text-slate-500">Hanya admin yang dapat mengakses sistem.</p>
                  </div>
                  <input type="checkbox" className="w-6 h-6 rounded-md border-slate-300 text-blue-600 focus:ring-blue-100" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
