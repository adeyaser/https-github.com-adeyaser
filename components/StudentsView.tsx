
import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';

const StudentsView: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Student Data Submitted:', formData);
    // Add logic here to update state/database
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Siswa</h1>
          <p className="text-slate-500">Kelola data profil dan administrasi siswa PAUD.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
            Filter
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Tambah Siswa
          </button>
        </div>
      </div>

      {/* Student List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_STUDENTS.map((student) => (
          <div key={student.student_id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative">
                <img 
                  src={student.photo} 
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-50 shadow-lg" 
                  alt={student.full_name} 
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>
              
              <h3 className="mt-4 text-lg font-bold text-slate-800 text-center">{student.full_name}</h3>
              <p className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2">
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
                <div className="flex items-center gap-2 text-slate-500">
                  <CreditCard size={16} className="text-amber-500" />
                  <span className="text-xs font-semibold">Lunas SPP</span>
                </div>
              </div>

              <div className="w-full mt-6 grid grid-cols-2 gap-3">
                <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
                  Profil Lengkap
                </button>
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all">
                  Akademik
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Student Placeholder Card */}
        <div 
          onClick={() => setShowAddModal(true)}
          className="bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer min-h-[300px]"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-500">Tambah Siswa Baru</p>
            <p className="text-xs text-slate-400 mt-1">Registrasi data administrasi & wali murid</p>
          </div>
        </div>
      </div>

      {/* Add Student Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-blue-600 p-8 text-white relative">
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Plus size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Pendaftaran Siswa Baru</h2>
                  <p className="text-blue-100 text-sm">Lengkapi formulir untuk registrasi siswa ke sistem.</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Profil Dasar */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Nama Lengkap</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Contoh: Alya Ramadhani"
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">NIS (Nomor Induk)</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="text"
                        name="nis"
                        value={formData.nis}
                        onChange={handleInputChange}
                        placeholder="PAUD-2024-XXXX"
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Jenis Kelamin</label>
                      <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Tanggal Lahir</label>
                      <input 
                        required
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Column 2: Data Tambahan */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Tempat Lahir</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="text"
                        name="birth_place"
                        value={formData.birth_place}
                        onChange={handleInputChange}
                        placeholder="Contoh: Jakarta"
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Nama Orang Tua / Wali</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="text"
                        name="parent_name"
                        value={formData.parent_name}
                        onChange={handleInputChange}
                        placeholder="Nama Ayah/Ibu"
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2 px-1">Foto Profil (URL)</label>
                    <div className="relative">
                      <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="url"
                        name="photo_url"
                        value={formData.photo_url}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsView;
