
import React, { useState, useRef } from 'react';
import { ImageIcon, Search, Plus, Filter, Calendar, Heart, Share2, MoreVertical, X, Save, Camera, Type, Upload, Trash2 as TrashIcon } from 'lucide-react';
import { MOCK_ACTIVITIES, LEARNING_AREAS } from '../constants';

const GalleryView: React.FC = () => {
  const [activities, setActivities] = useState(MOCK_ACTIVITIES.map(a => ({ ...a, likes: Math.floor(Math.random() * 20), isLiked: false })));
  const [activeArea, setActiveArea] = useState<number | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    activity_date: new Date().toISOString().split('T')[0],
    area_id: 1,
    photo: '' 
  });

  const handleLike = (id: number) => {
    setActivities(prev => prev.map(a => {
      if (a.activity_id === id) {
        return {
          ...a,
          likes: a.isLiked ? a.likes - 1 : a.likes + 1,
          isLiked: !a.isLiked
        };
      }
      return a;
    }));
  };

  const handleShare = async (item: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.content,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      navigator.clipboard.writeText(`${item.title}: ${item.content}`);
      alert('Link/Konten disalin ke clipboard!');
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photo) {
      alert("Silakan pilih foto terlebih dahulu.");
      return;
    }
    const newActivity = {
      activity_id: Date.now(),
      is_published: true,
      photos: [formData.photo],
      likes: 0,
      isLiked: false,
      ...formData
    };
    setActivities(prev => [newActivity, ...prev]);
    setShowForm(false);
    setFormData({
      title: '',
      content: '',
      activity_date: new Date().toISOString().split('T')[0],
      area_id: 1,
      photo: ''
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Hapus foto/kegiatan ini dari galeri?')) {
      setActivities(prev => prev.filter(a => a.activity_id !== id));
    }
  };

  const filteredGallery = activeArea === 'all' 
    ? activities 
    : activities.filter(a => a.area_id === activeArea);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Galeri Kegiatan</h1>
          <p className="text-slate-500">Dokumentasi momen berharga siswa dalam setiap area Montessori.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Upload Foto
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => setActiveArea('all')}
          className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${activeArea === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}
        >
          Semua Area
        </button>
        {LEARNING_AREAS.map(area => (
          <button 
            key={area.area_id}
            onClick={() => setActiveArea(area.area_id)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${activeArea === area.area_id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}`}
          >
            {area.area_name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredGallery.map(item => (
          <div key={item.activity_id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm group hover:shadow-2xl transition-all duration-500 relative">
            <button 
              onClick={() => handleDelete(item.activity_id)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-xl text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg"
            >
              <TrashIcon size={16} />
            </button>
            <div className="h-64 relative overflow-hidden">
               <img 
                 src={item.photos?.[0]} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" 
                 alt="" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-2 w-full">
                     <button 
                      onClick={() => handleLike(item.activity_id)}
                      className={`flex-1 py-2 backdrop-blur-md rounded-xl text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${item.isLiked ? 'bg-red-500/80' : 'bg-white/20 hover:bg-white/40'}`}
                     >
                        <Heart size={14} fill={item.isLiked ? "currentColor" : "none"} /> {item.likes} Like
                     </button>
                     <button 
                      onClick={() => handleShare(item)}
                      className="flex-1 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-white/40"
                     >
                        <Share2 size={14} /> Share
                     </button>
                  </div>
               </div>
            </div>
            <div className="p-6">
               <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest">
                    {LEARNING_AREAS.find(a => a.area_id === (item as any).area_id)?.area_name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1"><Calendar size={10} /> {(item as any).activity_date}</span>
               </div>
               <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-1">{(item as any).title}</h3>
               <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{(item as any).content}</p>
               <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex -space-x-2">
                     <img src="https://i.pravatar.cc/30?u=1" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                     <img src="https://i.pravatar.cc/30?u=2" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                     <div className="w-6 h-6 bg-slate-100 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">+4</div>
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-slate-800"><MoreVertical size={16} /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* GALLERY FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
                 <h2 className="text-xl font-bold flex items-center gap-3"><ImageIcon /> Upload Momen Baru</h2>
                 <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Judul Kegiatan</label>
                    <div className="relative">
                       <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                        required 
                        type="text" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold" 
                        placeholder="Contoh: Praktik Menuang Air"
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Foto Kegiatan</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative h-48 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition-all group ${formData.photo ? 'border-none' : ''}`}
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
                             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors mb-3">
                                <Upload size={24} />
                             </div>
                             <p className="text-xs font-bold text-slate-500">Klik untuk pilih file foto</p>
                             <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">JPG, PNG (Maks 5MB)</p>
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

                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Narasi Singkat</label>
                    <textarea 
                      required 
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold resize-none h-24" 
                      placeholder="Ceritakan momen seru hari ini..."
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Area Montessori</label>
                       <select 
                        required 
                        value={formData.area_id}
                        onChange={e => setFormData({...formData, area_id: parseInt(e.target.value)})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold"
                       >
                         {LEARNING_AREAS.map(a => <option key={a.area_id} value={a.area_id}>{a.area_name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tgl Kegiatan</label>
                       <input 
                        required 
                        type="date" 
                        value={formData.activity_date}
                        onChange={e => setFormData({...formData, activity_date: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold"
                       />
                    </div>
                 </div>
                 
                 <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold">Batal</button>
                    <button type="submit" className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2">
                       <Save size={18} /> Simpan ke Galeri
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
