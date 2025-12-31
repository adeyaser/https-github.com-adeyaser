
import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  FileText, 
  Clock, 
  Radio, 
  Plus, 
  Puzzle, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Link as LinkIcon,
  Type,
  Video as VideoIcon,
  Calendar,
  User,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Trophy,
  Eye,
  CheckCircle
} from 'lucide-react';
import { MOCK_MODULES, LEARNING_AREAS, MOCK_USER, MOCK_QUIZ_RESULTS } from '../constants';
import { ElearningModule, QuizResult } from '../types';

const MOCK_SCHEDULE = [
  { id: 1, title: 'Bercerita: Si Kancil & Buaya', time: '10:00 - 10:30', day: 'Senin', teacher: 'Ibu Dewi', type: 'Zoom' },
  { id: 2, title: 'Bernyanyi Lagu Nasional', time: '09:00 - 09:30', day: 'Selasa', teacher: 'Bpk. Ahmad', type: 'Google Meet' },
  { id: 3, title: 'Doa & Moral Dasar', time: '08:00 - 08:30', day: 'Rabu', teacher: 'Ibu Rina', type: 'Zoom' },
  { id: 4, title: 'Gerak & Lagu', time: '10:00 - 10:45', day: 'Kamis', teacher: 'Ibu Dewi', type: 'Zoom' },
  { id: 5, title: 'Pentas Seni Virtual', time: '09:00 - 10:00', day: 'Jumat', teacher: 'Tim Guru', type: 'YouTube Live' },
];

const ElearningView: React.FC = () => {
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  
  // Progress tracking state (simulated local storage/DB)
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [viewedModules, setViewedModules] = useState<number[]>([]);

  const isTeacher = MOCK_USER.user_type === 'teacher' || MOCK_USER.user_type === 'admin';

  // Form State
  const initialFormState = {
    module_title: '',
    module_description: '',
    class_level: 'TK A',
    area_id: 1,
    content_type: 'video' as ElearningModule['content_type'],
    content_url: '',
    duration_minutes: 10
  };

  const [formData, setFormData] = useState(initialFormState);

  // Initialize progress
  useEffect(() => {
    // In a real app, this would fetch from an API
    setCompletedModules([2]); // Example: Module 2 is completed
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'area_id' || name === 'duration_minutes' ? parseInt(value) : value
    }));
  };

  const openEdit = (module: ElearningModule) => {
    setEditingModuleId(module.module_id);
    setFormData({
      module_title: module.module_title,
      module_description: module.module_description,
      class_level: module.class_level,
      area_id: module.area_id,
      content_type: module.content_type,
      content_url: module.content_url,
      duration_minutes: module.duration_minutes
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoinLive = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      alert("Menghubungkan ke Ruang Kelas Virtual (Secure Montessori Gateway)... Mohon tunggu hingga Guru memulai sesi.");
    }, 1500);
  };

  const markAsComplete = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
    }
    setActiveVideoId(null);
  };

  const markAsViewed = (moduleId: number) => {
    if (!viewedModules.includes(moduleId)) {
      setViewedModules(prev => [...prev, moduleId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingModuleId) {
      console.log('Updating Module ID:', editingModuleId, formData);
    } else {
      console.log('Creating New Module:', formData);
    }
    closeForm();
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingModuleId(null);
    setFormData(initialFormState);
  };

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url || url === '#') return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        return url.replace('watch?v=', 'embed/').split('&')[0];
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('/').pop();
        return `https://www.youtube.com/embed/${id}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  // Helper to check if a module has a completed quiz
  const getQuizStatus = (moduleId: number) => {
    // In our mock data, linked_quiz_id might be module_id for simplicity or explicitly mapped
    const quizResult = MOCK_QUIZ_RESULTS.find(r => r.quiz_id === moduleId); // Simple mapping for mock
    return quizResult;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">E-Learning Siswa</h1>
          <p className="text-slate-500">Materi pembelajaran digital interaktif dan live streaming.</p>
        </div>
        <div className="flex items-center gap-3">
          {isTeacher && (
            <button 
              onClick={() => {
                setIsManagementMode(!isManagementMode);
                if (isManagementMode) closeForm();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isManagementMode ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 shadow-sm'}`}
            >
              {isManagementMode ? 'Mode Siswa' : 'Kelola Materi'}
            </button>
          )}
          <div className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse border border-red-100">
            <Radio size={16} /> LIVE SEKARANG: Sesi Bercerita
          </div>
        </div>
      </div>

      {/* Progress Summary for Students */}
      {!isManagementMode && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Materi Selesai</p>
              <p className="text-xl font-bold text-slate-800">{completedModules.length} Modul</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sedang Dipelajari</p>
              <p className="text-xl font-bold text-slate-800">{viewedModules.length} Modul</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Skor Quiz</p>
              <p className="text-xl font-bold text-slate-800">100/100</p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Module Form */}
      {isManagementMode && showAddForm && (
        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="bg-blue-600 px-8 py-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              {editingModuleId ? <Edit size={20} /> : <Plus size={20} />}
              <h2 className="font-bold">{editingModuleId ? 'Edit Modul Pembelajaran' : 'Tambah Modul Baru'}</h2>
            </div>
            <button onClick={closeForm} className="hover:bg-blue-700 p-1 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Judul Modul</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    required
                    name="module_title"
                    value={formData.module_title}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="Mengenal Angka..." 
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Deskripsi Singkat</label>
                <textarea 
                  required
                  name="module_description"
                  value={formData.module_description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Jelaskan isi materi..." 
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Level Kelas</label>
                  <select 
                    name="class_level"
                    value={formData.class_level}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 appearance-none"
                  >
                    <option>Playgroup</option>
                    <option>TK A</option>
                    <option>TK B</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Area Montessori</label>
                  <select 
                    name="area_id"
                    value={formData.area_id}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 appearance-none"
                  >
                    {LEARNING_AREAS.map(area => (
                      <option key={area.area_id} value={area.area_id}>{area.area_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Tipe Konten</label>
                <select 
                  name="content_type"
                  value={formData.content_type}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 appearance-none"
                >
                  <option value="video">Video Pembelajaran</option>
                  <option value="document">Dokumen / E-Book</option>
                  <option value="interactive">Interactive Game</option>
                  <option value="quiz">Quiz Materi</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">URL Konten / File</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    required
                    name="content_url"
                    value={formData.content_url}
                    onChange={handleInputChange}
                    type="url" 
                    placeholder="https://youtube.com/..." 
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Durasi (Menit)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    required
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    type="number" 
                    min="1"
                    className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div className="pt-2 flex gap-4">
                <button 
                  type="button"
                  onClick={closeForm}
                  className="flex-1 bg-slate-100 text-slate-600 rounded-xl py-4 font-bold hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-2 bg-blue-600 text-white rounded-xl py-4 px-8 font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                >
                  <Save size={18} /> {editingModuleId ? 'Update Modul' : 'Simpan Modul'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isManagementMode && !showAddForm && (
          <button 
            onClick={() => {
              setEditingModuleId(null);
              setFormData(initialFormState);
              setShowAddForm(true);
            }}
            className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center group hover:bg-white hover:border-blue-400 transition-all cursor-pointer min-h-[300px]"
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm group-hover:text-blue-500 mb-4 transition-all">
              <Plus size={32} />
            </div>
            <h4 className="font-bold text-slate-500">Tambah Modul</h4>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Upload video, dokumen, atau link game</p>
          </button>
        )}

        {MOCK_MODULES.map(module => {
           const area = LEARNING_AREAS.find(a => a.area_id === module.area_id);
           const isPlaying = activeVideoId === module.module_id;
           const isVideo = module.content_type === 'video';
           const hasUrl = module.content_url && module.content_url !== '#';
           const isCompleted = completedModules.includes(module.module_id);
           const isViewed = viewedModules.includes(module.module_id);
           const quizStatus = getQuizStatus(module.module_id);

           return (
             <div key={module.module_id} className={`bg-white rounded-3xl overflow-hidden border transition-all flex flex-col relative animate-in zoom-in duration-300 ${isCompleted ? 'border-emerald-200 shadow-emerald-50' : 'border-slate-100 shadow-sm'} group hover:shadow-xl`}>
               {isManagementMode && (
                 <div className="absolute top-2 right-2 z-30 flex gap-1">
                   <button 
                    onClick={() => openEdit(module)}
                    className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                   >
                     <Edit size={14} />
                   </button>
                   <button className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 active:scale-95">
                     <Trash2 size={14} />
                   </button>
                 </div>
               )}

               {/* Completion Badge */}
               {!isManagementMode && isCompleted && (
                 <div className="absolute top-2 right-2 z-30 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                   <CheckCircle2 size={16} />
                 </div>
               )}
               
               <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center transition-all">
                  {isPlaying && isVideo && hasUrl ? (
                    <div className="w-full h-full relative animate-in fade-in duration-300">
                      {isYouTube(module.content_url) ? (
                        <iframe
                          src={`${getYouTubeEmbedUrl(module.content_url)}?autoplay=1`}
                          className="w-full h-full border-none"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={module.module_title}
                        />
                      ) : (
                        <video 
                          src={module.content_url} 
                          className="w-full h-full object-contain" 
                          controls 
                          autoPlay
                          onEnded={() => markAsComplete(module.module_id)}
                        />
                      )}
                      <div className="absolute top-2 right-2 flex gap-2">
                         <button 
                          onClick={() => markAsComplete(module.module_id)}
                          className="p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all shadow-xl"
                          title="Tandai Selesai"
                         >
                           <CheckCircle2 size={16} />
                         </button>
                         <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveVideoId(null);
                          }}
                          className="p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-all shadow-xl"
                         >
                           <X size={16} />
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`w-full h-full flex items-center justify-center relative ${(isVideo || module.content_type === 'document') && hasUrl ? 'cursor-pointer group/thumb' : ''}`}
                      onClick={() => {
                        if (hasUrl) {
                          if (isVideo) setActiveVideoId(module.module_id);
                          markAsViewed(module.module_id);
                          if (module.content_type === 'document') window.open(module.content_url, '_blank');
                        }
                      }}
                    >
                      <div 
                        className={`absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity ${isCompleted ? 'bg-emerald-500' : ''}`}
                        style={!isCompleted ? { backgroundColor: area?.color_code } : undefined}
                      ></div>
                      
                      {isVideo ? (
                        <div className="relative flex flex-col items-center gap-2">
                          <PlayCircle size={56} className="text-white opacity-80 group-hover/thumb:opacity-100 transform group-hover/thumb:scale-110 transition-all drop-shadow-2xl" />
                          <span className="text-[10px] font-bold text-white uppercase bg-black/40 px-3 py-1 rounded-full backdrop-blur-md shadow-lg border border-white/20">Putar Video</span>
                        </div>
                      ) : module.content_type === 'document' ? (
                        <div className="relative flex flex-col items-center gap-2">
                           <FileText size={56} className="text-emerald-400 opacity-60 group-hover:opacity-100 transition-all drop-shadow-xl" />
                           <span className="text-[10px] font-bold text-white uppercase bg-black/40 px-3 py-1 rounded-full backdrop-blur-md shadow-lg border border-white/20">Baca Materi</span>
                        </div>
                      ) : module.content_type === 'interactive' ? (
                        <Puzzle size={56} className="text-purple-400 opacity-60 group-hover:opacity-100 transition-all drop-shadow-xl" />
                      ) : (
                        <Edit size={56} className="text-amber-400 opacity-60 group-hover:opacity-100 transition-all drop-shadow-xl" />
                      )}

                      <div className="absolute top-4 left-4 z-10">
                        <span 
                          className="text-[10px] font-bold text-white px-2 py-1 rounded-full uppercase shadow-lg border border-white/20"
                          style={{ backgroundColor: area?.color_code }}
                        >
                          {area?.area_name}
                        </span>
                      </div>
                    </div>
                  )}
               </div>

               <div className="p-5 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className={`font-bold truncate leading-tight pr-4 ${isCompleted ? 'text-emerald-800' : 'text-slate-800'}`} title={module.module_title}>{module.module_title}</h3>
                   <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 shrink-0 uppercase tracking-widest">
                     {module.class_level}
                   </span>
                 </div>
                 <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed h-8">{module.module_description}</p>
                 
                 {/* Quiz Link Notification */}
                 {module.content_type === 'quiz' && quizStatus && (
                   <div className="mb-4 p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 animate-in slide-in-from-left-2">
                     <Trophy size={14} className="text-emerald-600" />
                     <span className="text-[10px] font-bold text-emerald-700">Quiz Selesai: {quizStatus.score}%</span>
                   </div>
                 )}

                 <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Clock size={12} className="text-slate-300" /> {module.duration_minutes} Menit
                    </div>
                    
                    <div className="flex gap-2">
                      {!isManagementMode && !isCompleted && hasUrl && (
                        <button 
                          onClick={() => markAsComplete(module.module_id)}
                          className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Tandai Selesai"
                        >
                          Selesaikan
                        </button>
                      )}
                      
                      {isVideo ? (
                        <button 
                          onClick={() => hasUrl ? setActiveVideoId(isPlaying ? null : module.module_id) : alert('URL Video tidak tersedia')}
                          className={`text-xs font-bold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${isPlaying ? 'bg-red-50 text-red-600' : isCompleted ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                        >
                          {isPlaying ? <><X size={14} /> Tutup</> : isCompleted ? <><CheckCircle2 size={14} /> Putar Lagi</> : <><PlayCircle size={14} /> Putar Video</>}
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (hasUrl) {
                              markAsViewed(module.module_id);
                              if (module.content_type === 'document') window.open(module.content_url, '_blank');
                            }
                          }}
                          className={`text-xs font-bold transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${isCompleted ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                        >
                          {module.content_type === 'document' ? <FileText size={14} /> : <Puzzle size={14} />} Buka Materi
                        </button>
                      )}
                    </div>
                 </div>
               </div>
             </div>
           );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-10 opacity-20 transform translate-x-1/4 -translate-y-1/4">
          <PlayCircle size={240} />
        </div>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl font-bold mb-4">Sesi Live Streaming Terjadwal</h2>
          <p className="text-blue-100 mb-6 opacity-90 leading-relaxed">Anak-anak dapat berinteraksi langsung dengan guru melalui platform video konferensi aman kami untuk kegiatan bernyanyi dan bercerita bersama.</p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleJoinLive}
              disabled={isConnecting}
              className="px-6 py-3 bg-white text-blue-700 rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-50 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70"
            >
              {isConnecting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Radio size={18} className="animate-pulse" />
              )}
              {isConnecting ? 'Menghubungkan...' : 'Gabung Sesi Live'}
            </button>
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm text-white border border-white/20 rounded-2xl font-bold hover:bg-blue-500/30 transition-all active:scale-95"
            >
              Lihat Jadwal
            </button>
          </div>
        </div>
      </div>

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
            <div className="bg-slate-800 p-8 text-white flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg">
                   <Calendar size={24} />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold">Jadwal Sesi Live</h2>
                   <p className="text-slate-400 text-xs">Agenda Virtual Classroom Mingguan</p>
                 </div>
               </div>
               <button 
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
               >
                 <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {MOCK_SCHEDULE.map((item) => (
                  <div key={item.id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-blue-200 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="w-16 text-center">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{item.day}</p>
                        <div className="bg-white border border-slate-100 rounded-xl py-2 px-1 shadow-sm">
                           <Clock size={16} className="mx-auto mb-1 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-slate-100">
                            <Clock size={10} /> {item.time}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-slate-100">
                            <User size={10} /> {item.teacher}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleJoinLive}
                      className="px-5 py-2.5 bg-white border border-slate-200 text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg active:scale-95"
                    >
                       Masuk Kelas <ExternalLink size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4 mt-4">
                <CheckCircle2 size={24} className="text-blue-600 shrink-0" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <p className="font-bold mb-1">Panduan Sesi Live:</p>
                  <ul className="list-disc pl-4 space-y-1 opacity-80">
                    <li>Mohon pastikan kamera dan microphone dalam keadaan aktif.</li>
                    <li>Gunakan headset agar suara terdengar lebih jelas.</li>
                    <li>Dampingi anak selama sesi interaktif berlangsung.</li>
                    <li>Hubungi Admin jika mengalami kendala teknis saat bergabung.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-50 flex justify-end shrink-0">
               <button 
                onClick={() => setShowScheduleModal(false)}
                className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
               >
                 Tutup Jadwal
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElearningView;
