
import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Target, Sparkles, CheckCircle2, LayoutGrid, Heart, Brain, Lightbulb } from 'lucide-react';
import { LEARNING_AREAS } from '../constants';

interface PublicCurriculumViewProps {
  onBack: () => void;
}

const PublicCurriculumView: React.FC<PublicCurriculumViewProps> = ({ onBack }) => {
  const [selectedArea, setSelectedArea] = useState(LEARNING_AREAS[0]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-900 text-white pt-20 pb-32 px-6 lg:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-12 font-bold text-sm"
        >
          <ArrowLeft size={20} /> Kembali ke Beranda
        </button>
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-500/30">
            <BookOpen size={14} /> Montessori Curriculum
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
            Menumbuhkan <span className="text-blue-500">Potensi Alami</span> Anak Sejak Dini.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed italic">
            "Bantu aku melakukannya sendiri." — Maria Montessori. Fokus kami adalah membimbing bukan memaksa.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-20 -mt-20 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Area Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-[3rem] p-6 shadow-2xl border border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-4">Pilih Area Belajar</h3>
              <div className="space-y-2">
                {LEARNING_AREAS.map(area => (
                  <button 
                    key={area.area_id}
                    onClick={() => setSelectedArea(area)}
                    className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all ${selectedArea.area_id === area.area_id ? 'bg-slate-900 text-white shadow-xl' : 'hover:bg-slate-50 text-slate-600'}`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: area.color_code }}>
                      <LayoutGrid size={20} />
                    </div>
                    <span className="font-bold text-sm">{area.area_name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
               <Heart className="text-blue-600 mb-4" />
               <h4 className="font-bold text-blue-900 mb-2">Mengapa Montessori?</h4>
               <p className="text-xs text-blue-700 leading-relaxed">Metode ini menekankan pada kemandirian, kebebasan (dalam batas tertentu), dan rasa hormat terhadap perkembangan alami anak secara fisik, sosial, dan emosional.</p>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[4rem] p-10 lg:p-16 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl" style={{ backgroundColor: selectedArea.color_code }}>
                    <Brain size={40} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-slate-800 mb-1">{selectedArea.area_name}</h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tujuan Utama & Filosofi</p>
                 </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed mb-12 italic">
                  {selectedArea.description} Area ini dirancang untuk membangun fondasi karakter yang kuat melalui eksplorasi langsung dengan material yang telah disiapkan secara seksama.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                      <Target size={18} className="text-blue-600" /> Fokus Perkembangan
                    </h4>
                    <ul className="space-y-3">
                      {['Kemandirian', 'Konsentrasi', 'Koordinasi Mata-Tangan', 'Rasa Tertib'].map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                          <CheckCircle2 size={16} className="text-emerald-500" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                      <Lightbulb size={18} className="text-amber-500" /> Contoh Aktivitas
                    </h4>
                    <ul className="space-y-3">
                      {['Eksplorasi Material', 'Observasi Mandiri', 'Praktik Langsung', 'Diskusi Kelompok'].map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                          <Sparkles size={16} className="text-amber-500" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                    <h4 className="font-bold text-slate-800">Tertarik dengan kurikulum ini?</h4>
                    <p className="text-sm text-slate-400">Jadwalkan kunjungan sekolah untuk melihat langsung.</p>
                 </div>
                 <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
                    Daftar Kunjungan Sekarang
                 </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center bg-slate-50">
        <p className="text-sm font-bold text-slate-400">© 2024 PAUD Cerdas Montessori. Semua konten bersifat edukatif.</p>
      </footer>
    </div>
  );
};

export default PublicCurriculumView;
