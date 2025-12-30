
import React, { useState } from 'react';
import { School, Users, GraduationCap, MapPin, Plus, MoreHorizontal, X, Save, Edit, Trash2 } from 'lucide-react';
import { MOCK_CLASSES } from '../constants';

const ClassesView: React.FC = () => {
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    class_name: '', 
    class_level: 'TK A' as const, 
    academic_year: '2024/2025', 
    max_students: 20 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Fix: Use c.class_id instead of c.id because the Class interface defines it as class_id
      setClasses(prev => prev.map(c => c.class_id === editingId ? { ...c, ...formData } : c));
    } else {
      const newClass = { class_id: Date.now(), ...formData, current_students: 0 };
      setClasses(prev => [newClass, ...prev]);
    }
    closeForm();
  };

  const deleteClass = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
      setClasses(prev => prev.filter(c => c.class_id !== id));
    }
  };

  const openEdit = (cls: any) => {
    setEditingId(cls.class_id);
    setFormData({ 
      class_name: cls.class_name, 
      class_level: cls.class_level, 
      academic_year: cls.academic_year, 
      max_students: cls.max_students 
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ class_name: '', class_level: 'TK A', academic_year: '2024/2025', max_students: 20 });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Kelas</h1>
          <p className="text-slate-500">Atur pembagian kelas, guru, dan kapasitas siswa.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Buka Kelas Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.class_id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col group relative">
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(cls)} className="p-2 bg-white shadow-md rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                <Edit size={16} />
              </button>
              <button onClick={() => deleteClass(cls.class_id)} className="p-2 bg-white shadow-md rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${cls.class_level === 'Playgroup' ? 'bg-amber-100 text-amber-600' : cls.class_level === 'TK A' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                <School size={24} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-1">{cls.class_name}</h3>
            <p className="text-sm font-semibold text-slate-400 mb-6">{cls.academic_year}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-600">
                <GraduationCap size={18} className="text-slate-400" />
                <span className="text-sm font-medium">Belum Ditugaskan</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={18} className="text-slate-400" />
                <span className="text-sm font-medium">Lantai 1</span>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">{cls.current_students} / {cls.max_students} Siswa</span>
                </div>
                <span className="text-xs font-bold text-slate-400">{cls.max_students > 0 ? Math.round((cls.current_students/cls.max_students)*100) : 0}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${cls.current_students >= cls.max_students ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${cls.max_students > 0 ? (cls.current_students/cls.max_students)*100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Kelas' : 'Buka Kelas Baru'}</h2>
              <button onClick={closeForm} className="p-2 bg-white/10 hover:bg-white/20 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nama Kelas</label>
                <input required type="text" value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})} placeholder="Contoh: Kelas A-2 Bintang" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Level Kelas</label>
                  <select value={formData.class_level} onChange={e => setFormData({...formData, class_level: e.target.value as any})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100">
                    <option>Playgroup</option>
                    <option>TK A</option>
                    <option>TK B</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Kapasitas Maksimal</label>
                  <input required type="number" value={formData.max_students} onChange={e => setFormData({...formData, max_students: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Tahun Akademik</label>
                <input required type="text" value={formData.academic_year} onChange={e => setFormData({...formData, academic_year: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100" />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg mt-4 flex items-center justify-center gap-2 hover:bg-blue-700">
                <Save size={18} /> {editingId ? 'Simpan Perubahan' : 'Buat Kelas'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesView;
