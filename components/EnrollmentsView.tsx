
import React, { useState } from 'react';
import { 
  UserPlus, 
  Check, 
  X, 
  Phone, 
  Clock, 
  Search, 
  Save, 
  User, 
  Trash2, 
  Edit, 
  Filter,
  Mail,
  ChevronRight,
  ShieldCheck,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { MOCK_ENROLLMENTS } from '../constants';

// Define Enrollment interface to properly type the registration status
interface Enrollment {
  id: number;
  name: string;
  parent: string;
  phone: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const EnrollmentsView: React.FC = () => {
  // Use Enrollment interface to fix the type inference issue where status was narrowed to a 'Pending' literal from mock data
  const [enrollments, setEnrollments] = useState<Enrollment[]>(MOCK_ENROLLMENTS as Enrollment[]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    parent: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending' as 'Pending' | 'Approved' | 'Rejected'
  });

  const handleOpenForm = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        parent: item.parent,
        phone: item.phone,
        date: item.date,
        status: item.status
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        parent: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      });
    }
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setEnrollments(prev => prev.map(en => en.id === editingId ? { ...en, ...formData } : en));
    } else {
      setEnrollments(prev => [{ id: Date.now(), ...formData }, ...prev]);
    }
    setShowForm(false);
  };

  const updateStatus = (id: number, status: 'Approved' | 'Rejected') => {
    setEnrollments(prev => prev.map(en => en.id === id ? { ...en, status } : en));
  };

  const handleDelete = (id: number) => {
    if (confirm('Hapus antrean pendaftaran ini?')) {
      setEnrollments(prev => prev.filter(en => en.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Antrean Pendaftaran</h1>
          <p className="text-slate-500">Manajemen verifikasi calon siswa baru.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <UserPlus size={20} /> Registrasi Manual
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Pending', 'Approved', 'Rejected'].map((status) => (
          <div key={status} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{status}</p>
              <p className="text-2xl font-black text-slate-800">
                {enrollments.filter(e => e.status === status).length}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'Pending' ? 'bg-amber-50 text-amber-500' : status === 'Approved' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
               {status === 'Pending' ? <Clock size={20} /> : status === 'Approved' ? <Check size={20} /> : <X size={20} />}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative w-full md:w-80">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
             <input type="text" placeholder="Cari pendaftar..." className="w-full bg-slate-50 border-none rounded-2xl py-3 px-12 text-sm font-bold" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Calon Siswa</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Orang Tua</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kontak</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {enrollments.map((enroll) => (
                <tr key={enroll.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black shadow-sm">
                        {enroll.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{enroll.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{enroll.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{enroll.parent}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold"><Phone size={12} className="text-blue-500" /> {enroll.phone}</div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${enroll.status === 'Pending' ? 'bg-amber-50 text-amber-600' : enroll.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {enroll.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                       {enroll.status === 'Pending' && (
                         <>
                            <button onClick={() => updateStatus(enroll.id, 'Approved')} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Setujui"><Check size={18} /></button>
                            <button onClick={() => updateStatus(enroll.id, 'Rejected')} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Tolak"><X size={18} /></button>
                         </>
                       )}
                       <button onClick={() => handleOpenForm(enroll)} className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 transition-all"><Edit size={18} /></button>
                       <button onClick={() => handleDelete(enroll.id)} className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ENROLLMENT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
                 <h2 className="text-xl font-bold flex items-center gap-3">
                   <UserPlus /> {editingId ? 'Edit Data Pendaftar' : 'Registrasi Pendaftar'}
                 </h2>
                 <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/20 rounded-full"><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Calon Siswa</label>
                    <div className="relative">
                       <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                        required 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold" 
                        placeholder="Nama Lengkap Anak"
                       />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Orang Tua</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.parent}
                      onChange={e => setFormData({...formData, parent: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold" 
                      placeholder="Nama Ayah/Ibu"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">No. WhatsApp</label>
                       <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            required 
                            type="tel" 
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold" 
                            placeholder="081..."
                          />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tgl Pendaftaran</label>
                       <input 
                        required 
                        type="date" 
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                       />
                    </div>
                 </div>
                 <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold">Batal</button>
                    <button type="submit" className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2">
                       <Save size={18} /> Simpan Data
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentsView;
