
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Book, 
  Image as ImageIcon, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Calendar, 
  Type, 
  AlignLeft,
  Tag,
  Camera,
  User as UserIcon,
  Upload
} from 'lucide-react';
import { MOCK_ACTIVITIES, LEARNING_AREAS, MOCK_COMPETENCIES, MOCK_STUDENTS } from '../constants';
import { DailyActivity, Competency } from '../types';

const LearningView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'activities' | 'curriculum'>('activities');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Activities State
  const [activities, setActivities] = useState<DailyActivity[]>(MOCK_ACTIVITIES);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<DailyActivity | null>(null);
  
  // Curriculum State
  const [competencies, setCompetencies] = useState<Competency[]>(MOCK_COMPETENCIES);
  const [showCompForm, setShowCompForm] = useState(false);
  const [editingComp, setEditingComp] = useState<Competency | null>(null);

  // Form States
  const [activityData, setActivityData] = useState({
    title: '',
    content: '',
    activity_date: new Date().toISOString().split('T')[0],
    area_id: 1,
    student_id: 0, // 0 means class-wide activity
    photoPreview: ''
  });

  const [compData, setCompData] = useState({
    area_id: 1,
    competency_code: '',
    competency_desc: '',
    indicator: ''
  });

  // --- ACTIVITY HANDLERS ---
  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPhotos = activityData.photoPreview 
      ? [activityData.photoPreview] 
      : (editingActivity?.photos || ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400']);

    if (editingActivity) {
      setActivities(prev => prev.map(a => a.activity_id === editingActivity.activity_id ? { 
        ...a, 
        ...activityData, 
        student_id: activityData.student_id || undefined,
        photos: finalPhotos
      } : a));
    } else {
      const newActivity: DailyActivity = {
        activity_id: Date.now(),
        title: activityData.title,
        content: activityData.content,
        activity_date: activityData.activity_date,
        area_id: activityData.area_id,
        student_id: activityData.student_id || undefined,
        is_published: true,
        photos: finalPhotos
      };
      setActivities(prev => [newActivity, ...prev]);
    }
    closeActivityForm();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setActivityData(prev => ({ ...prev, photoPreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditActivity = (activity: DailyActivity) => {
    setEditingActivity(activity);
    setActivityData({
      title: activity.title,
      content: activity.content,
      activity_date: activity.activity_date,
      area_id: activity.area_id,
      student_id: activity.student_id || 0,
      photoPreview: activity.photos?.[0] || ''
    });
    setShowActivityForm(true);
  };

  const closeActivityForm = () => {
    setShowActivityForm(false);
    setEditingActivity(null);
    setActivityData({ 
      title: '', 
      content: '', 
      activity_date: new Date().toISOString().split('T')[0], 
      area_id: 1,
      student_id: 0,
      photoPreview: ''
    });
  };

  const deleteActivity = (id: number) => {
    if (confirm('Hapus dokumentasi kegiatan ini?')) {
      setActivities(prev => prev.filter(a => a.activity_id !== id));
    }
  };

  // --- COMPETENCY HANDLERS ---
  const handleCompSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingComp) {
      setCompetencies(prev => prev.map(c => c.competency_id === editingComp.competency_id ? { ...c, ...compData } : c));
    } else {
      const newComp: Competency = {
        competency_id: Date.now(),
        ...compData
      };
      setCompetencies(prev => [...prev, newComp]);
    }
    closeCompForm();
  };

  const openEditComp = (comp: Competency) => {
    setEditingComp(comp);
    setCompData({
      area_id: comp.area_id,
      competency_code: comp.competency_code,
      competency_desc: comp.competency_desc,
      indicator: comp.indicator
    });
    setShowCompForm(true);
  };

  const closeCompForm = () => {
    setShowCompForm(false);
    setEditingComp(null);
    setCompData({ area_id: 1, competency_code: '', competency_desc: '', indicator: '' });
  };

  const deleteComp = (id: number) => {
    if (confirm('Hapus kompetensi ini dari kurikulum?')) {
      setCompetencies(prev => prev.filter(c => c.competency_id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pembelajaran</h1>
          <p className="text-slate-500">Kelola kurikulum dan dokumentasi kegiatan harian.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('activities')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'activities' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Kegiatan Harian
          </button>
          <button 
            onClick={() => setActiveTab('curriculum')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'curriculum' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Kurikulum
          </button>
        </div>
      </div>

      {activeTab === 'activities' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-700">Dokumentasi Terkini</h2>
            <button 
              onClick={() => setShowActivityForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md"
            >
              <Plus size={18} /> Tambah Kegiatan
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((activity) => {
              const area = LEARNING_AREAS.find(a => a.area_id === activity.area_id);
              const taggedStudent = MOCK_STUDENTS.find(s => s.student_id === activity.student_id);
              return (
                <div key={activity.activity_id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                    <button 
                      onClick={() => openEditActivity(activity)}
                      className="p-2 bg-white/90 backdrop-blur shadow-md rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteActivity(activity.activity_id)}
                      className="p-2 bg-white/90 backdrop-blur shadow-md rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {activity.photos?.[0] ? (
                      <img src={activity.photos[0]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="text-[10px] font-bold uppercase px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: area?.color_code }}
                      >
                        {area?.area_name}
                      </span>
                      {taggedStudent && (
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                          <UserIcon size={10} /> {taggedStudent.full_name.split(' ')[0]}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium ml-auto">{activity.activity_date}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg mb-2">{activity.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{activity.content}</p>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                      <div className="flex -space-x-2">
                        {taggedStudent ? (
                          <img src={taggedStudent.photo} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" alt="" />
                        ) : (
                          [1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                              <img src={`https://i.pravatar.cc/100?u=${activity.activity_id + i}`} alt="" />
                            </div>
                          ))
                        )}
                      </div>
                      <button className="text-blue-600 text-xs font-bold hover:underline">Lihat Detail</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Form Modal */}
          {showActivityForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
                  <h2 className="text-xl font-bold">{editingActivity ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}</h2>
                  <button onClick={closeActivityForm} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
                </div>
                <form onSubmit={handleActivitySubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">Judul Kegiatan</label>
                        <div className="relative">
                          <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input 
                            required 
                            type="text" 
                            value={activityData.title} 
                            onChange={e => setActivityData({...activityData, title: e.target.value})} 
                            placeholder="Contoh: Praktik Menuang Air" 
                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">Tanggal</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                              required 
                              type="date" 
                              value={activityData.activity_date} 
                              onChange={e => setActivityData({...activityData, activity_date: e.target.value})} 
                              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">Area Montessori</label>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <select 
                              value={activityData.area_id} 
                              onChange={e => setActivityData({...activityData, area_id: parseInt(e.target.value)})} 
                              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
                            >
                              {LEARNING_AREAS.map(a => <option key={a.area_id} value={a.area_id}>{a.area_name}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">Pilih Anak (Opsional)</label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <select 
                            value={activityData.student_id} 
                            onChange={e => setActivityData({...activityData, student_id: parseInt(e.target.value)})} 
                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
                          >
                            <option value={0}>Seluruh Kelas</option>
                            {MOCK_STUDENTS.map(s => <option key={s.student_id} value={s.student_id}>{s.full_name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">Foto Kegiatan</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden group relative"
                      >
                        {activityData.photoPreview ? (
                          <>
                            <img src={activityData.photoPreview} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <p className="text-white text-xs font-bold flex items-center gap-2"><Camera size={16} /> Ganti Foto</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-2">
                                <Upload size={24} />
                            </div>
                            <p className="text-xs font-bold text-slate-500">Klik untuk Upload Foto</p>
                            <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG (Max 2MB)</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRef} 
                          accept="image/*" 
                          onChange={handlePhotoUpload}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">Isi Laporan / Dokumentasi</label>
                    <div className="relative">
                      <AlignLeft className="absolute left-3 top-4 text-slate-300" size={18} />
                      <textarea 
                        required 
                        rows={3}
                        value={activityData.content} 
                        onChange={e => setActivityData({...activityData, content: e.target.value})} 
                        placeholder="Jelaskan proses pembelajaran yang berlangsung..." 
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all resize-none" 
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button" 
                      onClick={closeActivityForm}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                    >
                      <Save size={20} /> {editingActivity ? 'Simpan Perubahan' : 'Publish Dokumentasi'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-slate-700 mb-4 px-2">Area Montessori</h2>
            {LEARNING_AREAS.map(area => (
              <div key={area.area_id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-200 transition-all group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110`} style={{ backgroundColor: area.color_code }}>
                  <Book size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{area.area_name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{area.description}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-700">Kompetensi & Indikator</h2>
              <div className="flex gap-2">
                 <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 shadow-sm"><Filter size={18} /></button>
                 <button 
                  onClick={() => setShowCompForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md"
                 >
                   <Plus size={16} /> Tambah Kompetensi
                 </button>
              </div>
            </div>
            
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kode</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kompetensi</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Indikator</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {competencies.map(comp => (
                      <tr key={comp.competency_id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-6 py-4 text-sm font-bold text-blue-600">{comp.competency_code}</td>
                        <td className="px-6 py-4 text-sm text-slate-800 font-medium">{comp.competency_desc}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            <span className="line-clamp-1">{comp.indicator}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <button onClick={() => openEditComp(comp)} className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                                <Edit size={14} />
                              </button>
                              <button onClick={() => deleteComp(comp.competency_id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                                <Trash2 size={14} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Competency Form Modal */}
          {showCompForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
                  <h2 className="text-xl font-bold">{editingComp ? 'Edit Kompetensi' : 'Tambah Kompetensi'}</h2>
                  <button onClick={closeCompForm} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
                </div>
                <form onSubmit={handleCompSubmit} className="p-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">Kode</label>
                      <input 
                        required 
                        type="text" 
                        value={compData.competency_code} 
                        onChange={e => setCompData({...compData, competency_code: e.target.value})} 
                        placeholder="MIS: PL-001" 
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">Area</label>
                      <select 
                        value={compData.area_id} 
                        onChange={e => setCompData({...compData, area_id: parseInt(e.target.value)})} 
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                      >
                        {LEARNING_AREAS.map(a => <option key={a.area_id} value={a.area_id}>{a.area_name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">Deskripsi Kompetensi</label>
                    <input 
                      required 
                      type="text" 
                      value={compData.competency_desc} 
                      onChange={e => setCompData({...compData, competency_desc: e.target.value})} 
                      placeholder="Contoh: Menuang air dari teko" 
                      className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest px-1">Indikator Capaian</label>
                    <textarea 
                      required 
                      rows={3}
                      value={compData.indicator} 
                      onChange={e => setCompData({...compData, indicator: e.target.value})} 
                      placeholder="Contoh: Dapat menuang tanpa tumpah..." 
                      className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all resize-none" 
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-[2rem] font-bold shadow-xl shadow-blue-100 mt-4 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all transform hover:scale-[1.02]">
                    <Save size={20} /> {editingComp ? 'Simpan Perubahan' : 'Tambah Kompetensi'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningView;
