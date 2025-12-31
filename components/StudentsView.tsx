
import React, { useState, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  MapPin, 
  Calendar, 
  CreditCard, 
  X, 
  Save, 
  User as UserIcon, 
  Hash, 
  Camera,
  ChevronDown,
  Upload,
  Heart,
  Phone,
  FileText,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_STUDENTS, LEARNING_AREAS } from '../constants';
import { Student } from '../types';

const MOCK_ACADEMIC_DATA = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 90 },
];

interface StudentsViewProps {
  onNavigate: (path: string, studentId?: number) => void;
}

const StudentsView: React.FC<StudentsViewProps> = ({ onNavigate }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Student | null>(null);
  const [selectedAcademic, setSelectedAcademic] = useState<Student | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    nis: '',
    birth_place: '',
    birth_date: '',
    gender: 'Laki-laki',
    photo_url: '',
    parent_name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddModal(false);
    setFormData({
      full_name: '', nis: '', birth_place: '', birth_date: '', gender: 'Laki-laki', photo_url: '', parent_name: ''
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Siswa</h1>
          <p className="text-slate-500">Kelola data profil dan administrasi siswa PAUD.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Cari NIS/Nama..." className="bg-white border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all w-64 shadow-sm" />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={20} /> Tambah Siswa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_STUDENTS.map((student) => (
          <div key={student.student_id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative">
                <img 
                  src={student.photo} 
                  className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-slate-50 shadow-lg group-hover:scale-105 transition-transform duration-500" 
                  alt={student.full_name} 
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>
              
              <h3 className="mt-4 text-lg font-bold text-slate-800 text-center">{student.full_name}</h3>
              <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2 uppercase tracking-widest">
                {student.nis}
              </p>

              <div className="w-full mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin size={16} className="text-blue-500" />
                  <span className="text-xs font-semibold">{student.birth_place}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar size={16} className="text-emerald-500" />
                  <span className="text-xs font-semibold">Aktif</span>
                </div>
              </div>

              <div className="w-full mt-6 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setSelectedProfile(student)}
                  className="px-4 py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  Profil Lengkap
                </button>
                <button 
                  onClick={() => setSelectedAcademic(student)}
                  className="px-4 py-3 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  Akademik
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: PROFIL LENGKAP */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-8 text-white relative">
              <button onClick={() => setSelectedProfile(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all"><X /></button>
              <div className="flex items-center gap-6">
                 <img src={selectedProfile.photo} className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-white/10 shadow-2xl" alt="" />
                 <div>
                    <h2 className="text-2xl font-bold">{selectedProfile.full_name}</h2>
                    <p className="text-blue-400 font-bold uppercase text-xs tracking-widest mt-1">{selectedProfile.nis} • Kelas A-1</p>
                 </div>
              </div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Pribadi</h4>
                    <div className="space-y-3">
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><Calendar size={16} className="text-blue-500" /> {selectedProfile.birth_date} ({selectedProfile.birth_place})</div>
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><UserIcon size={16} className="text-blue-500" /> {selectedProfile.gender}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Data Orang Tua</h4>
                    <div className="space-y-3">
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><Heart size={16} className="text-red-500" /> Wali: Bpk/Ibu Wali</div>
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><Phone size={16} className="text-emerald-500" /> +62 812-3456-XXXX</div>
                    </div>
                  </div>
               </div>
               <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Catatan Medis & Alamat</h4>
                  <div className="space-y-4">
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">Alamat: Jl. Melati Raya No. 45, Kebayoran Baru, Jakarta Selatan.</p>
                     <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-2">
                        <Award size={16} className="text-amber-600" />
                        <span className="text-[10px] font-bold text-amber-700">Alergi: Tidak ada alergi makanan.</span>
                     </div>
                  </div>
                  <button className="w-full mt-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">Edit Data Profil</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AKADEMIK DASHBOARD */}
      {selectedAcademic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col lg:flex-row">
            {/* Sidebar Modal */}
            <div className="lg:w-72 bg-blue-600 p-8 text-white flex flex-col justify-between">
               <div>
                  <button onClick={() => setSelectedAcademic(null)} className="mb-8 p-2 hover:bg-white/10 rounded-full transition-all"><ChevronDown className="rotate-90" /></button>
                  <img src={selectedAcademic.photo} className="w-20 h-20 rounded-[2rem] object-cover mb-4 ring-4 ring-white/20" alt="" />
                  <h2 className="text-xl font-bold leading-tight">{selectedAcademic.full_name}</h2>
                  <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">Progress Akademik</p>
               </div>
               <div className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-2xl">
                     <p className="text-[10px] font-black text-blue-200 uppercase mb-1">Kehadiran</p>
                     <p className="text-2xl font-black">98%</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl">
                     <p className="text-[10px] font-black text-blue-200 uppercase mb-1">Total Quiz</p>
                     <p className="text-2xl font-black">12</p>
                  </div>
               </div>
            </div>
            
            {/* Main Academic Content */}
            <div className="flex-1 p-10 bg-white">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-800">Capaian Belajar</h3>
                  <div className="flex bg-slate-50 p-1 rounded-xl">
                     <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-black text-blue-600">GRAFIK</button>
                     <button className="px-4 py-1.5 text-xs font-black text-slate-400">DETAIL</button>
                  </div>
               </div>

               {/* Chart */}
               <div className="h-48 w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_ACADEMIC_DATA}>
                      <defs>
                        <linearGradient id="colorScoreS" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScoreS)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>

               {/* Mastery Areas */}
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Montessori Areas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {LEARNING_AREAS.slice(0, 4).map(area => (
                      <div key={area.area_id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: area.color_code }}><TrendingUp size={14}/></div>
                           <span className="text-xs font-bold text-slate-700">{area.area_name}</span>
                         </div>
                         <span className="text-xs font-black text-blue-600">85%</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <CheckCircle2 size={18} className="text-emerald-500" />
                     <span className="text-xs font-bold text-slate-500 italic">"Menunjukkan minat tinggi pada area sensorial."</span>
                  </div>
                  <button 
                    onClick={() => {
                      const studentId = selectedAcademic.student_id;
                      setSelectedAcademic(null);
                      // Mengirim ID siswa ke onNavigate
                      onNavigate('/reports', studentId);
                    }}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                  >
                    Lihat Rapor Lengkap <ArrowRight size={14}/>
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRASI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-8 text-white relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"><X size={20} /></button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl"><Plus size={32} /></div>
                <div><h2 className="text-2xl font-bold">Pendaftaran Siswa Baru</h2><p className="text-blue-100 text-sm">Lengkapi formulir untuk registrasi siswa ke sistem.</p></div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Nama Lengkap</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="Alya Ramadhani" className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">NIS</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required type="text" name="nis" value={formData.nis} onChange={handleInputChange} placeholder="PAUD-2024-XXXX" className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-bold" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Foto Profil</label>
                  <div onClick={() => fileInputRef.current?.click()} className={`relative h-28 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all ${formData.photo_url ? 'border-none overflow-hidden' : ''}`}>
                       {formData.photo_url ? <img src={formData.photo_url} className="w-full h-full object-cover" alt="" /> : <Camera size={20} className="text-slate-300" />}
                       <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Batal</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"><Save size={18} /> Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsView;
