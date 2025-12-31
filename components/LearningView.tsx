
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Book, 
  CheckCircle2, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Calendar, 
  Tag,
  Search,
  ChevronRight,
  BookOpen,
  Target,
  Image as ImageIcon,
  Type,
  User,
  Clock,
  ArrowRight,
  LayoutGrid,
  Upload
} from 'lucide-react';
import { MOCK_ACTIVITIES, LEARNING_AREAS, MOCK_COMPETENCIES, MOCK_STUDENTS } from '../constants';
import { DailyActivity, Competency } from '../types';

const LearningView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'activities' | 'curriculum'>('activities');
  const [selectedArea, setSelectedArea] = useState<number | 'all'>(1);
  const [showCompForm, setShowCompForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<DailyActivity | null>(null);
  const [competencies, setCompetencies] = useState<Competency[]>(MOCK_COMPETENCIES);
  const [activities, setActivities] = useState<DailyActivity[]>(MOCK_ACTIVITIES);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for New Activity
  const [newActivity, setNewActivity] = useState({
    title: '',
    content: '',
    activity_date: new Date().toISOString().split('T')[0],
    area_id: 1,
    photo: '' // Base64 data URL
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewActivity(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter Logic for Activities
  const filteredActivities = selectedArea === 'all' 
    ? activities 
    : activities.filter(a => a.area_id === selectedArea);

  // Filter Logic for Competencies (Curriculum Tab)
  const curriculumAreaId = typeof selectedArea === 'number' ? selectedArea : 1;
  const filteredComp = competencies.filter(c => c.area_id === curriculumAreaId);
  const currentArea = LEARNING_AREAS.find(a => a.area_id === curriculumAreaId);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.photo) {
      alert("Silakan unggah foto kegiatan.");
      return;
    }
    const activity: DailyActivity = {
      activity_id: Date.now(),
      title: newActivity.title,
      content: newActivity.content,
      activity_date: newActivity.activity_date,
      area_id: newActivity.area_id,
      photos: [newActivity.photo],
      is_published: true
    };
    setActivities([activity, ...activities]);
    setShowActivityForm(false);
    setNewActivity({
      title: '',
      content: '',
      activity_date: new Date().toISOString().split('T')[0],
      area_id: 1,
      photo: ''
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pembelajaran & Kurikulum</h1>
          <p className="text-slate-500">Kelola standar kompetensi dan dokumentasi pedagogi.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => { setActiveTab('activities'); setSelectedArea('all'); }}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'activities' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
          >
            Kegiatan Harian
          </button>
          <button 
            onClick={() => { setActiveTab('curriculum'); setSelectedArea(1); }}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'curriculum' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
          >
            Kurikulum Montessori
          </button>
        </div>
      </div>

      {activeTab === 'activities' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Activity List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                {selectedArea === 'all' ? 'Semua Dokumentasi' : `Dokumentasi: ${LEARNING_AREAS.find(a => a.area_id === selectedArea)?.area_name}`}
              </h2>
              <button 
                onClick={() => setShowActivityForm(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg"
              >
                <Plus size={16} /> Buat Laporan Harian
              </button>
            </div>

            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity.activity_id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all group">
                  <div className="w-full md:w-48 h-48 rounded-[2rem] overflow-hidden shrink-0 bg-slate-100">
                    <img src={activity.photos?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {LEARNING_AREAS.find(a => a.area_id === activity.area_id)?.area_name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Calendar size={12} /> {activity.activity_date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{activity.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6">{activity.content}</p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i + 10}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="" />)}
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+8</div>
                      </div>
                      <button 
                        onClick={() => setSelectedActivity(activity)}
                        className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
                      >
                        Baca Detail <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium">Belum ada kegiatan untuk area ini.</p>
              </div>
            )}
          </div>

          {/* Sidebar Filter */}
          <div className="space-y-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-500" /> Filter Area Belajar
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setSelectedArea('all')}
                    className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${selectedArea === 'all' ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border-slate-50 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedArea === 'all' ? 'bg-white/20' : 'bg-slate-100'}`}>
                       <LayoutGrid size={18} />
                    </div>
                    <span className="text-sm font-bold">Semua Area</span>
                  </button>
                  {LEARNING_AREAS.map(area => (
                    <button 
                      key={area.area_id}
                      onClick={() => setSelectedArea(area.area_id)}
                      className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${selectedArea === area.area_id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-50 text-slate-500 hover:bg-slate-50'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedArea === area.area_id ? 'bg-white/20' : 'bg-slate-100'}`}>
                         <BookOpen size={18} />
                      </div>
                      <span className="text-sm font-bold">{area.area_name}</span>
                    </button>
                  ))}
                </div>
             </div>
             
             <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute -bottom-4 -right-4 opacity-10"><Target size={120} /></div>
                <h4 className="font-bold text-lg mb-2">Statistik Dokumentasi</h4>
                <p className="text-xs text-blue-100 mb-6">Total {activities.length} laporan kegiatan telah dibuat bulan ini.</p>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-[10px] mt-2 font-bold uppercase tracking-widest text-blue-200">65% Target Bulanan</p>
             </div>
          </div>
        </div>
      ) : (
        /* Curriculum Tab View */
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-4">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Area Kompetensi</h3>
             {LEARNING_AREAS.map(area => (
               <button 
                key={area.area_id}
                onClick={() => setSelectedArea(area.area_id)}
                className={`w-full p-6 rounded-[2rem] border transition-all text-left group ${selectedArea === area.area_id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 hover:border-blue-400'}`}
               >
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-3 rounded-2xl bg-white/10" style={{ backgroundColor: selectedArea === area.area_id ? undefined : area.color_code + '20' }}>
                      <Target size={24} className={selectedArea === area.area_id ? 'text-white' : ''} style={{ color: selectedArea === area.area_id ? undefined : area.color_code }} />
                    </div>
                    <ChevronRight size={16} className={selectedArea === area.area_id ? 'text-blue-400' : 'text-slate-200'} />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{area.area_name}</h4>
                  <p className={`text-[10px] ${selectedArea === area.area_id ? 'text-slate-400' : 'text-slate-500'}`}>{area.description}</p>
               </button>
             ))}
          </div>
          <div className="xl:col-span-3 space-y-6">
             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4">
                <div className="p-8 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/50 flex justify-between items-center">
                   <div>
                     <h3 className="text-xl font-bold text-slate-800">Indikator Capaian: {currentArea?.area_name}</h3>
                     <p className="text-xs text-slate-500 font-medium">Daftar kompetensi dasar yang harus dikuasai siswa.</p>
                   </div>
                   <button onClick={() => setShowCompForm(true)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-100 flex items-center gap-2"><Plus size={16} /> Tambah Indikator</button>
                </div>
                <div className="p-8 space-y-4">
                   {filteredComp.length > 0 ? (
                     filteredComp.map(comp => (
                       <div key={comp.competency_id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start justify-between group">
                          <div className="flex gap-6">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black text-xs shadow-sm shrink-0 border border-slate-100">{comp.competency_code}</div>
                             <div>
                                <h4 className="font-bold text-slate-800 mb-1">{comp.competency_desc}</h4>
                                <p className="text-sm text-slate-500 italic leading-relaxed">Indikator: {comp.indicator}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                             <button className="p-2 text-slate-300 hover:text-blue-600"><Edit size={16} /></button>
                             <button className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                          </div>
                       </div>
                     ))
                   ) : (
                     <div className="text-center py-12">
                        <Book size={40} className="mx-auto text-slate-200 mb-2" />
                        <p className="text-slate-400 text-sm">Belum ada indikator terdaftar.</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* MODAL: Baca Detail Activity */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="relative h-64 bg-slate-100">
                 <img src={selectedActivity.photos?.[0]} className="w-full h-full object-cover" alt="" />
                 <button 
                  onClick={() => setSelectedActivity(null)}
                  className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
                 >
                   <X size={20} />
                 </button>
                 <div className="absolute bottom-6 left-8">
                    <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                       {LEARNING_AREAS.find(a => a.area_id === selectedActivity.area_id)?.area_name}
                    </span>
                 </div>
              </div>
              <div className="p-10 space-y-6">
                 <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">{selectedActivity.title}</h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                       <Calendar size={14} /> {selectedActivity.activity_date}
                    </div>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-slate-600 leading-relaxed italic">"{selectedActivity.content}"</p>
                 </div>
                 <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                       <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-10 h-10 rounded-full object-cover" alt="" />
                       <div>
                          <p className="text-sm font-bold text-slate-800">Dewi Kartika, S.Pd</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Guru Kelas A</p>
                       </div>
                    </div>
                    <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-blue-600 transition-all">Bagikan ke Orang Tua</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: Form Buat Laporan Harian */}
      {showActivityForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/20 rounded-2xl"><Plus size={24} /></div>
                 <div>
                   <h2 className="text-xl font-bold">Laporan Harian Baru</h2>
                   <p className="text-blue-100 text-xs font-medium">Dokumentasikan progres belajar siswa hari ini.</p>
                 </div>
               </div>
               <button onClick={() => setShowActivityForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X /></button>
            </div>
            
            <form onSubmit={handleCreateActivity} className="flex-1 overflow-y-auto p-8 space-y-6">
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Judul Dokumentasi</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required 
                      type="text" 
                      value={newActivity.title}
                      onChange={e => setNewActivity({...newActivity, title: e.target.value})}
                      placeholder="Contoh: Praktik Menuang Air" 
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all" 
                    />
                  </div>
               </div>

               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Narasi Kegiatan</label>
                  <textarea 
                    required
                    rows={4}
                    value={newActivity.content}
                    onChange={e => setNewActivity({...newActivity, content: e.target.value})}
                    placeholder="Ceritakan apa yang dilakukan anak-anak..." 
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all resize-none" 
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Area Montessori</label>
                    <select 
                      value={newActivity.area_id}
                      onChange={e => setNewActivity({...newActivity, area_id: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold appearance-none cursor-pointer"
                    >
                      {LEARNING_AREAS.map(a => <option key={a.area_id} value={a.area_id}>{a.area_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Tanggal</label>
                    <input 
                      type="date" 
                      value={newActivity.activity_date}
                      onChange={e => setNewActivity({...newActivity, activity_date: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold" 
                    />
                  </div>
               </div>

               {/* FILE UPLOAD FOR ACTIVITY */}
               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Unggah Foto Kegiatan</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative h-40 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition-all group ${newActivity.photo ? 'border-none' : ''}`}
                  >
                     {newActivity.photo ? (
                        <>
                          <img src={newActivity.photo} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <p className="text-white font-bold text-xs flex items-center gap-2"><Upload size={16}/> Ganti Foto</p>
                          </div>
                        </>
                     ) : (
                        <>
                           <Upload size={24} className="text-slate-300 mb-2 group-hover:text-blue-500 transition-colors" />
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Pilih File Foto</p>
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

               <div className="pt-4 flex gap-4 shrink-0">
                  <button type="button" onClick={() => setShowActivityForm(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold">Batal</button>
                  <button type="submit" className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    <Save size={18} /> Simpan Laporan
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningView;
