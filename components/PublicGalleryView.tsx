
import React, { useState } from 'react';
import { ArrowLeft, Calendar, LayoutGrid, Heart, Share2, Filter, ImageIcon, Camera } from 'lucide-react';
import { MOCK_ACTIVITIES, LEARNING_AREAS } from '../constants';

interface PublicGalleryViewProps {
  onBack: () => void;
}

const PublicGalleryView: React.FC<PublicGalleryViewProps> = ({ onBack }) => {
  const [activeArea, setActiveArea] = useState<number | 'all'>('all');

  const filteredGallery = activeArea === 'all' 
    ? MOCK_ACTIVITIES 
    : MOCK_ACTIVITIES.filter(a => a.area_id === activeArea);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Header Section */}
      <header className="pt-24 pb-20 px-6 lg:px-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft size={18} /> Kembali ke Beranda
        </button>

        <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
          Galeri <span className="text-blue-500">Momen Cerdas</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 font-medium">
          Melihat lebih dekat bagaimana anak-anak bereksplorasi, belajar mandiri, dan merayakan pencapaian kecil mereka setiap hari.
        </p>
      </header>

      {/* Filter Bar */}
      <div className="sticky top-20 z-40 px-6 lg:px-20 mb-12">
        <div className="max-w-fit mx-auto flex flex-wrap justify-center gap-3 p-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl">
          <button 
            onClick={() => setActiveArea('all')}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeArea === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-500'}`}
          >
            Semua Foto
          </button>
          {LEARNING_AREAS.map(area => (
            <button 
              key={area.area_id}
              onClick={() => setActiveArea(area.area_id)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeArea === area.area_id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-500'}`}
            >
              {area.area_name}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="px-6 lg:px-20 pb-32">
        {filteredGallery.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredGallery.map((item, idx) => (
              <div 
                key={item.activity_id} 
                className="break-inside-avoid bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative overflow-hidden cursor-zoom-in">
                  <img 
                    src={item.photos?.[0]} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100" 
                    alt={item.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                       {LEARNING_AREAS.find(a => a.area_id === item.area_id)?.area_name}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-2">
                     <Calendar size={12} /> {item.activity_date}
                   </div>
                   <h3 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                   <p className="text-xs text-slate-400 leading-relaxed mb-6">{item.content}</p>
                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-all">
                          <Heart size={14} /> 24
                        </button>
                        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-500 transition-all">
                          <Share2 size={14} /> Bagikan
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-700 shadow-inner">
               <Camera size={48} />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white">Belum Ada Foto</h3>
               <p className="text-slate-500">Kategori ini belum memiliki dokumentasi publik.</p>
            </div>
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-white/5 text-center bg-slate-950">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">P</div>
          <span className="font-bold text-white">PAUD Cerdas Gallery</span>
        </div>
        <p className="text-xs font-bold text-slate-600">© 2024 Seluruh foto adalah hak milik PAUD Cerdas Montessori.</p>
      </footer>
    </div>
  );
};

export default PublicGalleryView;
