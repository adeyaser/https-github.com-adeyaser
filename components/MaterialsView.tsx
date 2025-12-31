
import React, { useState, useRef } from 'react';
import { 
  Package, 
  Plus, 
  MapPin, 
  Tag, 
  Search, 
  Box, 
  X, 
  Save, 
  Edit, 
  Trash2, 
  Filter,
  AlertCircle,
  MoreVertical,
  CheckCircle,
  Camera,
  Layers,
  Upload
} from 'lucide-react';
import { MOCK_MATERIALS, LEARNING_AREAS } from '../constants';

const MaterialsView: React.FC = () => {
  const [materials, setMaterials] = useState(MOCK_MATERIALS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    area: 'Sensorial',
    status: 'Available' as 'Available' | 'Maintenance',
    shelf: '',
    photo: '' // Base64
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenForm = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        area: item.area,
        status: item.status,
        shelf: item.shelf,
        photo: item.photo
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        area: 'Sensorial',
        status: 'Available',
        shelf: '',
        photo: ''
      });
    }
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photo) {
      alert("Silakan unggah foto material.");
      return;
    }
    if (editingId) {
      setMaterials(prev => prev.map(m => m.id === editingId ? { ...m, ...formData } : m));
    } else {
      setMaterials(prev => [{ id: Date.now(), ...formData }, ...prev]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Hapus material ini dari inventaris?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
    }
  };

  const stats = [
    { label: 'Total Material', value: materials.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tersedia', value: materials.filter(m => m.status === 'Available').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Perlu Perbaikan', value: materials.filter(m => m.status === 'Maintenance').length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventaris Material</h1>
          <p className="text-slate-500">Pelacakan alat peraga Montessori dan status pemeliharaan.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Tambah Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => ( stat.label &&
          <div key={i} className={`p-8 rounded-[2.5rem] ${stat.bg} border border-white flex items-center justify-between shadow-sm`}>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-4 bg-white rounded-2xl shadow-sm ${stat.color}`}><stat.icon size={28} /></div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Cari material (mis: Pink Tower)..." 
              className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMaterials.map((item) => {
            const area = LEARNING_AREAS.find(a => a.area_name === item.area);
            return (
              <div key={item.id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="h-56 relative bg-slate-100 overflow-hidden">
                   <img src={item.photo} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt="" />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-blue-600 shadow-sm">{item.shelf}</div>
                </div>
                <div className="p-6">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h4 className="text-lg font-bold text-slate-800 mb-1">{item.name}</h4>
                         <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: area?.color_code }}>{item.area}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {item.status}
                      </span>
                   </div>
                   <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                      <button 
                        onClick={() => handleOpenForm(item)}
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MATERIAL FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-3">
                {editingId ? <Edit /> : <Plus />} {editingId ? 'Edit Material' : 'Tambah Material'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Alat Peraga</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold" 
                  placeholder="Contoh: Pink Tower"
                />
              </div>

              {/* FILE UPLOAD FOR MATERIAL */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Foto Alat Peraga</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative h-40 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-all overflow-hidden group ${formData.photo ? 'border-none' : ''}`}
                  >
                     {formData.photo ? (
                        <>
                          <img src={formData.photo} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <p className="text-white font-bold text-xs flex items-center gap-2"><Upload size={16}/> Ganti Foto</p>
                          </div>
                        </>
                     ) : (
                        <>
                           <Camera size={24} className="text-slate-300 mb-2 group-hover:text-blue-500 transition-colors" />
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Pilih Foto Material</p>
                        </>
                     )}
                     <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden" 
                     />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Area Kurikulum</label>
                  <select 
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold"
                  >
                    {LEARNING_AREAS.map(a => <option key={a.area_id} value={a.area_name}>{a.area_name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Lokasi Rak</label>
                  <input 
                    required
                    type="text" 
                    value={formData.shelf}
                    onChange={e => setFormData({...formData, shelf: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold" 
                    placeholder="Contoh: A-1"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Status Ketersediaan</label>
                <div className="flex gap-2">
                  {(['Available', 'Maintenance'] as const).map(s => (
                    <button 
                      key={s}
                      type="button"
                      onClick={() => setFormData({...formData, status: s})}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${formData.status === s ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      {s === 'Available' ? 'Siap Digunakan' : 'Perbaikan'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold">Batal</button>
                 <button type="submit" className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-2">
                    <Save size={18} /> Simpan Material
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsView;
