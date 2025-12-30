
import React, { useState } from 'react';
import { Package, Plus, MapPin, Tag, MoreVertical, Search, Box, X, Save, Edit, Trash2, Home } from 'lucide-react';
import { MOCK_MATERIALS, LEARNING_AREAS } from '../constants';

const MaterialsView: React.FC = () => {
  const [materials, setMaterials] = useState(MOCK_MATERIALS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    area: 'Sensorial', 
    status: 'Available', 
    shelf: '', 
    photo: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setMaterials(prev => prev.map(m => m.id === editingId ? { ...m, ...formData } : m));
    } else {
      const newMaterial = { id: Date.now(), ...formData };
      setMaterials(prev => [newMaterial, ...prev]);
    }
    closeForm();
  };

  const deleteItem = (id: number) => {
    if (confirm('Hapus material ini dari inventaris?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({ name: item.name, area: item.area, status: item.status, shelf: item.shelf, photo: item.photo });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', area: 'Sensorial', status: 'Available', shelf: '', photo: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400' });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventaris Material</h1>
          <p className="text-slate-500">Kelola dan pantau ketersediaan perlengkapan Montessori.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Tambah Material
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Item', value: materials.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Tersedia', value: materials.filter(m => m.status === 'Available').length, icon: Box, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Sedang Dipakai', value: materials.filter(m => m.status === 'In Use').length, icon: Tag, color: 'text-amber-500', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl ${stat.bg} flex items-center justify-between transition-all`}>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
            </div>
            <stat.icon size={32} className={`${stat.color} opacity-40`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((item) => {
          const area = LEARNING_AREAS.find(a => a.area_name === item.area);
          return (
            <div key={item.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex gap-5 hover:shadow-xl transition-all group relative">
               <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => openEdit(item)} className="p-2 bg-white shadow-md rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                  <Edit size={14} />
                </button>
                <button onClick={() => deleteItem(item.id)} className="p-2 bg-white shadow-md rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img src={item.photo} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <h3 className="font-bold text-slate-800 truncate pr-12">{item.name}</h3>
                
                <div className="flex items-center gap-2 mt-2">
                   <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: area?.color_code || '#cbd5e1' }}>
                     {item.area}
                   </span>
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'Available' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                     {item.status}
                   </span>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-50 flex items-center gap-3 text-slate-400">
                   <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span className="text-[10px] font-bold uppercase">{item.shelf || 'N/A'}</span>
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Material' : 'Tambah Material'}</h2>
              <button onClick={closeForm} className="p-2 bg-white/10 hover:bg-white/20 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nama Material</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Pink Tower" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Area Montessori</label>
                  <select value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100">
                    {LEARNING_AREAS.map(a => <option key={a.area_id}>{a.area_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Rak Lokasi</label>
                  <input required type="text" value={formData.shelf} onChange={e => setFormData({...formData, shelf: e.target.value})} placeholder="Contoh: A-1" className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Status Inventaris</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100">
                  <option value="Available">Tersedia</option>
                  <option value="In Use">Sedang Digunakan</option>
                  <option value="Maintenance">Perbaikan</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg mt-4 flex items-center justify-center gap-2 hover:bg-blue-700">
                <Save size={18} /> {editingId ? 'Update Inventaris' : 'Simpan ke Inventaris'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsView;
