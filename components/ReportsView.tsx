
import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Star, 
  CheckCircle2, 
  Plus, 
  X, 
  Loader2, 
  Sparkles, 
  User, 
  Calendar,
  Save,
  ChevronRight,
  AlertCircle,
  BrainCircuit
} from 'lucide-react';
import { MOCK_STUDENTS, LEARNING_AREAS, MOCK_ACTIVITIES, MOCK_QUIZ_RESULTS, MOCK_QUIZZES } from '../constants';
import { generateComprehensiveAssessment } from '../services/gemini';

const ReportsView: React.FC = () => {
  const [showGenModal, setShowGenModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(MOCK_STUDENTS[0].student_id);
  const [semester, setSemester] = useState('1');
  const [generatedNarrative, setGeneratedNarrative] = useState('');

  const handleGenerateReport = async () => {
    const student = MOCK_STUDENTS.find(s => s.student_id === selectedStudentId);
    if (!student) return;

    setIsGenerating(true);
    setGeneratedNarrative('');

    // Prepare context for AI
    const studentActivities = MOCK_ACTIVITIES
      .filter(a => a.student_id === selectedStudentId || a.student_id === undefined)
      .map(a => `${a.title}: ${a.content}`);
    
    const studentQuizzes = MOCK_QUIZ_RESULTS
      .filter(r => r.student_id === selectedStudentId)
      .map(r => {
        const q = MOCK_QUIZZES.find(qz => qz.quiz_id === r.quiz_id);
        return `${q?.quiz_title}: Skor ${r.score}% (${r.status})`;
      });

    try {
      const result = await generateComprehensiveAssessment(
        student.full_name,
        studentActivities,
        studentQuizzes,
        "Menunjukkan kemajuan yang sangat baik dalam bersosialisasi dan kemandirian."
      );
      setGeneratedNarrative(result || "Gagal mengenerate narasi.");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghubungi AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const closeGenModal = () => {
    setShowGenModal(false);
    setIsGenerating(false);
    setGeneratedNarrative('');
  };

  const currentStudent = MOCK_STUDENTS.find(s => s.student_id === selectedStudentId);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Perkembangan (Rapor)</h1>
          <p className="text-slate-500">Evaluasi holistik capaian belajar siswa per semester.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => alert('Fitur Export PDF sedang disiapkan.')}
             className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 shadow-sm"
           >
             <Download size={18} /> Export PDF
           </button>
           <button 
             onClick={() => setShowGenModal(true)}
             className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
           >
             <Plus size={20} /> Generate Rapor Baru
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Student Selector */}
        <div className="xl:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Pilih Siswa</h3>
          {MOCK_STUDENTS.map(student => (
            <div 
              key={student.student_id} 
              onClick={() => setSelectedStudentId(student.student_id)}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer shadow-sm ${selectedStudentId === student.student_id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 hover:border-blue-400 text-slate-800'}`}
            >
              <img src={student.photo} className="w-10 h-10 rounded-xl object-cover border-2 border-white/20" alt="" />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{student.full_name}</p>
                <p className={`text-[10px] ${selectedStudentId === student.student_id ? 'text-blue-100' : 'text-slate-500'}`}>{student.nis}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Report Preview */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in duration-500">
             {/* Report Header */}
             <div className="p-10 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
                  <FileText size={200} />
                </div>
                <div className="relative z-10 flex justify-between items-start mb-10">
                   <div>
                     <h2 className="text-3xl font-bold mb-2">Laporan Perkembangan Anak</h2>
                     <p className="text-slate-400 font-medium">Semester {semester} • Tahun Ajaran 2024/2025</p>
                   </div>
                   <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl font-black shadow-2xl border border-white/20">P</div>
                </div>

                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-slate-800">
                   <div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Nama Siswa</p>
                     <p className="text-sm font-bold">{currentStudent?.full_name}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">NIS</p>
                     <p className="text-sm font-bold">{currentStudent?.nis}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Kelas</p>
                     <p className="text-sm font-bold">TK A - Bulan</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Status</p>
                     <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/30">APPROVED</span>
                   </div>
                </div>
             </div>

             {/* Report Body */}
             <div className="p-10 space-y-12 bg-white">
                {/* Developmental Summary */}
                <section>
                   <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <Star size={20} className="text-amber-400 fill-amber-400" /> Ringkasan Perkembangan Montessori
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {LEARNING_AREAS.map(area => (
                        <div key={area.area_id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group">
                           <div className="flex items-center justify-between mb-4">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">{area.area_name}</span>
                              <div className="flex gap-1">
                                 {[1,2,3,4].map(s => <CheckCircle2 key={s} size={14} className={s <= 3 ? "text-blue-500" : "text-slate-200"} />)}
                              </div>
                           </div>
                           <p className="text-sm text-slate-600 leading-relaxed italic">"Menunjukkan minat tinggi dalam koordinasi motorik halus, mulai mahir menggunakan alat menuang."</p>
                        </div>
                      ))}
                   </div>
                </section>

                {/* Detailed Feedback */}
                <section className="space-y-6">
                   <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                         <BrainCircuit size={80} className="text-blue-600" />
                      </div>
                      <h4 className="text-sm font-black text-blue-800 mb-4 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={16} /> Catatatan Guru (Analisa AI Komprehensif)
                      </h4>
                      <p className="text-sm text-blue-900/80 leading-relaxed italic font-medium whitespace-pre-line">
                        {currentStudent?.full_name} adalah anak yang sangat tekun dan memiliki rasa ingin tahu yang besar. Berdasarkan data observasi semester ini, perkembangan sosialnya meningkat drastis, ia mulai berani memimpin kelompok kecil saat kegiatan bernyanyi. Pertahankan kemandirian yang sudah terbentuk dengan baik di rumah melalui latihan menuang dan merapikan alat main sendiri.
                      </p>
                   </div>

                   <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-slate-100 gap-8">
                      <div className="text-center md:text-left px-4">
                         <div className="w-32 h-px bg-slate-200 mx-auto md:mx-0 mb-4" />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanda Tangan Orang Tua</p>
                      </div>
                      <div className="text-center md:text-right px-4">
                         <p className="text-sm font-black text-slate-800 italic mb-1">Dewi Kartika, S.Pd</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guru Kelas / Homeroom Teacher</p>
                      </div>
                   </div>
                </section>
             </div>
          </div>
        </div>
      </div>

      {/* GENERATE MODAL */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/20 rounded-2xl">
                   <Sparkles size={28} />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold">Reporting Wizard</h2>
                   <p className="text-blue-100 text-xs">AI-Powered Student Performance Aggregator</p>
                 </div>
               </div>
               <button 
                onClick={closeGenModal}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
               >
                 <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {!generatedNarrative ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest px-1">Pilih Siswa</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <select 
                          value={selectedStudentId}
                          onChange={(e) => setSelectedStudentId(parseInt(e.target.value))}
                          className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 appearance-none transition-all cursor-pointer"
                        >
                          {MOCK_STUDENTS.map(s => <option key={s.student_id} value={s.student_id}>{s.full_name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest px-1">Pilih Semester</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <select 
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 appearance-none transition-all cursor-pointer"
                        >
                          <option value="1">Semester Ganjil (1)</option>
                          <option value="2">Semester Genap (2)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                    <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <AlertCircle size={14} /> Cara Kerja AI Reporting
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-xs text-blue-700 flex items-center gap-2">
                        <CheckCircle2 size={12} className="shrink-0" /> Menganalisa seluruh dokumentasi kegiatan harian
                      </li>
                      <li className="text-xs text-blue-700 flex items-center gap-2">
                        <CheckCircle2 size={12} className="shrink-0" /> Mengkalkulasi rata-rata skor quiz kognitif
                      </li>
                      <li className="text-xs text-blue-700 flex items-center gap-2">
                        <CheckCircle2 size={12} className="shrink-0" /> Menyusun narasi perkembangan menggunakan metode Montessori
                      </li>
                    </ul>
                  </div>

                  <button 
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Sedang Menganalisa Data...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        <span>Mulai Generate Rapor Otomatis</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" /> Hasil Generasi Narasi AI
                      </h3>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Gemini 3 Pro Analysed</span>
                   </div>
                   <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] relative">
                      <p className="text-sm text-slate-700 leading-relaxed italic font-medium whitespace-pre-line">
                        {generatedNarrative}
                      </p>
                   </div>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => setGeneratedNarrative('')}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                      >
                        Generate Ulang
                      </button>
                      <button 
                        onClick={() => {
                          alert('Berhasil disimpan ke database rapor.');
                          closeGenModal();
                        }}
                        className="flex-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
                      >
                        <Save size={20} /> Simpan ke Sistem
                      </button>
                   </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-50 flex justify-between items-center shrink-0 bg-slate-50/50">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">Data Source: SQL Server 2.0</p>
               {!generatedNarrative && (
                 <button 
                  onClick={closeGenModal}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all"
                 >
                   Batal
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsView;
