
import React, { useState } from 'react';
import { UserPlus, Check, X, Phone, Clock, Search, MoreHorizontal, Save, User, Trash2, Edit } from 'lucide-react';
import { MOCK_ENROLLMENTS } from '../constants';

const EnrollmentsView: React.FC = () => {
  // Explicitly type the state to allow all possible statuses
  const [enrollments, setEnrollments] = useState<Array<{
    id: number;
    name: string;
    parent: string;
    phone: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
  }>>(MOCK_ENROLLMENTS);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', parent: '', phone: '', date: new Date().toISOString().split('T')[0] });

  const handleAction = (id: number, action: 'Approve' | 'Reject' | 'Delete') => {
    if (action === 'Delete') {
      setEnrollments(prev => prev.filter(e => e.id !== id));
    } else {
      setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: action === 'Approve' ? 'Approved' : 'Rejected' } : e));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setEnrollments(prev => prev.map(e => e.id === editingId ? { ...e, ...formData } : e));
    } else {
      const newEntry = { id: Date.now(), ...formData, status: 'Pending' as const };
      setEnrollments(prev => [newEntry, ...prev]);
    }
    closeForm();
  };

  const openEdit = (enroll: any) => {
    setEditingId(enroll.id);
    setFormData({ name: enroll.name, parent: enroll.parent, phone: enroll.phone, date: enroll.date });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', parent: '', phone: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pendaftaran Baru</h1>
          <p className="text-slate-500">Kelola antrean pendaftaran dan persetujuan siswa baru.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-100 flex items-center gap-2 hover:bg-blue-700 transition-all"
        >
          <UserPlus size={20} /> Tambah Pendaftaran
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Calon Siswa</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Orang Tua</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tgl Daftar</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {enrollments.map((enroll) => (
              <tr key={enroll.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold uppercase">
                      {enroll.name.charAt(0)}
                    </div>
                    <p className="text-sm font-bold text-slate-800">{enroll.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex flex-col">
                      <p className="text-sm font-medium text-slate-700">{enroll.parent}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                        <Phone size={10} /> {enroll.phone}
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Clock size={14} /> {enroll.date}
                   </div>
                </td>
                <td className="px-6 py-4 text-center">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${enroll.status === 'Pending' ? 'bg-amber-50 text-amber-600' : enroll.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                     {enroll.status}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center justify-end gap-2">
                      {enroll.status === 'Pending' && (
                        <>
                          <button onClick={() => handleAction(enroll.id, 'Approve')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleAction(enroll.id, 'Reject')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm">
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button onClick={() => openEdit(enroll)} className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleAction(enroll.id, 'Delete')} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Pendaftaran' : 'Tambah Pendaftaran'}</h2>
              <button onClick={closeForm} className="p-2 bg-white/10 hover:bg-white/20 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nama Calon Siswa</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nama Orang Tua</label>
                <input required type="text" value={formData.parent} onChange={e => setFormData({...formData, parent: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">No. Telepon</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Tanggal</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg mt-4 flex items-center justify-center gap-2 hover:bg-blue-700">
                <Save size={18} /> {editingId ? 'Update Data' : 'Daftarkan Calon Siswa'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentsView;
