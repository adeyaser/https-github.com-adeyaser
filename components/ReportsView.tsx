
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  X, 
  Loader2, 
  Sparkles, 
  User, 
  Calendar,
  Save,
  CheckCircle2,
  BrainCircuit,
  History,
  Eye,
  Trash2,
  ChevronLeft
} from 'lucide-react';
import { MOCK_STUDENTS, LEARNING_AREAS, MOCK_ACTIVITIES, MOCK_QUIZ_RESULTS, MOCK_QUIZZES } from '../constants';
import { generateComprehensiveAssessment } from '../services/gemini';

interface ReportArchive {
  id: number;
  student_id: number;
  student_name: string;
  semester: string;
  date: string;
  content: string;
}

interface ReportsViewProps {
  initialStudentId?: number | null;
  onClearInitial?: () => void;
}

const ReportsView: React.FC<ReportsViewProps> = ({ initialStudentId, onClearInitial }) => {
  const [activeView, setActiveView] = useState<'current' | 'archive'>('current');
  const [showGenModal, setShowGenModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(MOCK_STUDENTS[0].student_id);
  const [semester, setSemester] = useState('1');
  const [generatedNarrative, setGeneratedNarrative] = useState('');
  const [selectedArchive, setSelectedArchive] = useState<ReportArchive | null>(null);
  
  const [archives, setArchives] = useState<ReportArchive[]>([
    { id: 1, student_id: 1, student_name: 'Alya Putri Ramadhani', semester: 'Genap 2023', date: '12 Des 2023', content: 'Alya menunjukkan perkembangan yang sangat baik dalam area praktikal life. Ia sekarang mampu menuang air tanpa tumpah dan sangat antusias membantu teman-temannya merapikan peralatan setelah bermain. Fokus konsentrasinya meningkat pesat.' }
  ]);

  useEffect(() => {
    if (initialStudentId) {
      setSelectedStudentId(initialStudentId);
      if (onClearInitial) onClearInitial();
    }
  }, [initialStudentId]);

  const handleGenerateReport = async () => {
    const student = MOCK_STUDENTS.find(s => s.student_id === selectedStudentId);
    if (!student) return;
    setIsGenerating(true);
    setGeneratedNarrative('');

    try {
      const result = await generateComprehensiveAssessment(
        student.full_name,
        ["Bermain Balok", "Berhitung 1-10"], 
        ["Quiz Warna: 100%"],
        "Sangat ramah and aktif."
      );
      setGeneratedNarrative(result || "Gagal mengenerate narasi.");
    } catch (err) {
      alert("Terjadi kesalahan AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = (studentName: string, customSemester?: string) => {
    setIsDownloading(true);
    const originalTitle = document.title;
    document.title = `Rapor_${studentName.replace(/\s+/g, '_')}_${(customSemester || `Semester_${semester}`).replace(/\s+/g, '_')}`;

    setTimeout(() => {
      setIsDownloading(false);
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }, 1500);
  };

  const saveToArchive = () => {
    const student = MOCK_STUDENTS.find(s => s.student_id === selectedStudentId);
    const newReport: ReportArchive = {
      id: Date.now(),
      student_id: selectedStudentId,
      student_name: student?.full_name || 'Siswa',
      semester: `Semester ${semester}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      content: generatedNarrative
    };
    setArchives([newReport, ...archives]);
    setShowGenModal(false);
    setGeneratedNarrative('');
    alert('Rapor Berhasil Diarsipkan!');
  };

  const handleDeleteArchive = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus arsip rapor ini?')) {
      setArchives(prev => prev.filter(a => a.id !== id));
    }
  };

  const currentStudent = MOCK_STUDENTS.find(s => s.student_id === selectedStudentId);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <style>{`
        @media print {
          aside, header, nav, .no-print, button, .xl:col-span-1 {
            display: none !important;
          }
          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          main, .print-container {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
          }
          .bg-slate-900 {
            background-color: #0f172a !important;
            -webkit-print-color-adjust: exact;
            color: white !important;
          }
          .bg-blue-600 {
            background-color: #2563eb !important;
            -webkit-print-color-adjust: exact;
          }
          .bg-blue-50 {
            background-color: #eff6ff !important;
            -webkit-print-color-adjust: exact;
          }
          .bg-slate-50 {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
          }
          .rounded-[3.5rem], .rounded-[2.5rem], .rounded-[3rem] {
            border-radius: 0.5rem !important;
          }
          .shadow-xl, .shadow-sm, .shadow-2xl {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
          }
        }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Rapor Digital</h1>
          <p className="text-slate-500">Hasil evaluasi AI komprehensif berbasis data harian.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button onClick={() => setActiveView('current')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'current' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Lihat Rapor</button>
          <button onClick={() => setActiveView('archive')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'archive' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Arsip Rapor</button>
        </div>
      </div>

      {activeView === 'current' ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-4 no-print">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Pilih Siswa</h3>
            {MOCK_STUDENTS.map(student => (
              <div 
                key={student.student_id} 
                onClick={() => setSelectedStudentId(student.student_id)}
                className={`p-4 rounded-[2rem] border transition-all flex items-center gap-4 cursor-pointer shadow-sm ${selectedStudentId === student.student_id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white border-slate-100 hover:border-blue-400 text-slate-800'}`}
              >
                <img src={student.photo} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white" alt="" />
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{student.full_name}</p>
                  <p className={`text-[10px] font-bold ${selectedStudentId === student.student_id ? 'text-blue-100' : 'text-slate-400'}`}>{student.nis}</p>
                </div>
              </div>
            ))}
            <button onClick={() => setShowGenModal(true)} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-[2rem] font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl"><Plus size={18} /> Generate Rapor Baru</button>
          </div>

          <div className="xl:col-span-3 print-container">
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in fade-in">
               <div className="p-10 bg-slate-900 text-white relative">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><FileText size={160} /></div>
                  <div className="relative z-10 flex justify-between items-center mb-8">
                     <h2 className="text-3xl font-bold">Rapor Perkembangan</h2>
                     <button 
                      onClick={() => handleDownloadPDF(currentStudent?.full_name || 'Siswa')}
                      disabled={isDownloading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 no-print"
                     >
                        {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                        {isDownloading ? 'Generating...' : 'Download PDF'}
                     </button>
                  </div>
                  <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-white/10">
                    <div><p className="text-[10px] text-white/40 font-black uppercase mb-1">Nama</p><p className="text-sm font-bold">{currentStudent?.full_name}</p></div>
                    <div><p className="text-[10px] text-white/40 font-black uppercase mb-1">NIS</p><p className="text-sm font-bold">{currentStudent?.nis}</p></div>
                    <div><p className="text-[10px] text-white/40 font-black uppercase mb-1">Kelas</p><p className="text-sm font-bold">TK A - Bulan</p></div>
                    <div><p className="text-[10px] text-white/40 font-black uppercase mb-1">Status</p><span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">APPROVED</span></div>
                  </div>
               </div>
               <div className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {LEARNING_AREAS.slice(0, 4).map(area => (
                      <div key={area.area_id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                         <div className="flex justify-between items-center mb-4"><span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{area.area_name}</span><div className="flex gap-1">{[1,2,3,4].map(s => <CheckCircle2 key={s} size={14} className={s <= 3 ? "text-blue-500" : "text-slate-200"} />)}</div></div>
                         <p className="text-sm text-slate-600 italic leading-relaxed">"Sangat mahir dalam mengidentifikasi tekstur dan dimensi benda."</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-10 bg-blue-50 rounded-[3rem] border border-blue-100 relative">
                    <Sparkles size={32} className="absolute -top-4 -right-4 text-amber-500 animate-pulse no-print" />
                    <h4 className="text-xs font-black text-blue-800 uppercase mb-4 tracking-widest">Narasi Komprehensif (AI Gemini Pro)</h4>
                    <p className="text-sm text-blue-900 leading-relaxed italic font-medium">Ananda menunjukkan lompatan kemajuan yang luar biasa pada semester ini. Fokus pada area Practical Life telah melatih kemandirian dan motorik halusnya dengan sempurna. Terus didampingi dalam latihan bersosialisasi di rumah.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
          {archives.map(report => (
            <div key={report.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
               <div className="flex justify-between items-start mb-6">
                 <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><History size={24} /></div>
                 <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                   <button 
                    onClick={() => setSelectedArchive(report)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                   >
                     <Eye size={18} />
                   </button>
                   <button 
                    onClick={() => handleDeleteArchive(report.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
               </div>
               <h4 className="font-bold text-slate-800 text-lg mb-1">{report.student_name}</h4>
               <p className="text-xs text-blue-600 font-bold">{report.semester}</p>
               <p className="text-xs text-slate-400 line-clamp-3 italic leading-relaxed mt-4 mb-6">{report.content}</p>
               <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-[10px] font-black text-slate-300 uppercase">{report.date}</span>
                <button 
                  onClick={() => handleDownloadPDF(report.student_name, report.semester)}
                  disabled={isDownloading}
                  className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                  Download Arsip
                </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: PRATINJAU ARSIP */}
      {selectedArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
             <div className="p-8 bg-slate-900 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl"><History size={24} /></div>
                  <div>
                    <h2 className="text-xl font-bold">Pratinjau Arsip Rapor</h2>
                    <p className="text-slate-400 text-xs">{selectedArchive.semester} • {selectedArchive.date}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedArchive(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X /></button>
             </div>
             <div className="p-10 overflow-y-auto space-y-8">
                <div className="border-b border-slate-100 pb-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nama Siswa</p>
                   <p className="text-lg font-bold text-slate-800">{selectedArchive.student_name}</p>
                </div>
                <div className="space-y-4">
                   <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                     <Sparkles size={16} /> Narasi Perkembangan
                   </h4>
                   <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 italic text-slate-600 leading-relaxed">
                     {selectedArchive.content}
                   </div>
                </div>
                <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                   <div className="p-2 bg-white rounded-xl text-amber-600 shadow-sm"><FileText size={20} /></div>
                   <div>
                     <p className="text-xs font-bold text-amber-800 mb-1">Catatan Dokumen</p>
                     <p className="text-[10px] text-amber-600 font-medium leading-relaxed">Dokumen ini merupakan arsip digital resmi. Gunakan tombol download di bawah untuk mencetak format PDF standar sekolah.</p>
                   </div>
                </div>
             </div>
             <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 shrink-0">
                <button 
                  onClick={() => setSelectedArchive(null)}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                >
                  Tutup
                </button>
                <button 
                  onClick={() => {
                    const name = selectedArchive.student_name;
                    const sem = selectedArchive.semester;
                    setSelectedArchive(null);
                    handleDownloadPDF(name, sem);
                  }}
                  className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                >
                  <Download size={18} /> Download Versi PDF
                </button>
             </div>
          </div>
        </div>
      )}

      {/* GENERATE MODAL */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 no-print">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="bg-blue-600 p-8 text-white flex justify-between items-center"><h2 className="text-xl font-bold flex items-center gap-3"><Sparkles /> Reporting Wizard AI</h2><button onClick={() => setShowGenModal(false)} className="p-2 hover:bg-white/20 rounded-full"><X /></button></div>
              <div className="p-10 space-y-6">
                 {!generatedNarrative ? (
                   <>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Pilih Siswa</label>
                      <select value={selectedStudentId} onChange={e => setSelectedStudentId(parseInt(e.target.value))} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold">
                        {MOCK_STUDENTS.map(s => <option key={s.student_id} value={s.student_id}>{s.full_name}</option>)}
                      </select>
                    </div>
                    <button onClick={handleGenerateReport} disabled={isGenerating} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50">{isGenerating ? <Loader2 className="animate-spin" /> : <BrainCircuit />} Analisa & Generate Rapor</button>
                   </>
                 ) : (
                   <div className="space-y-6">
                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 italic text-sm text-slate-600 leading-relaxed">{generatedNarrative}</div>
                      <div className="flex gap-4"><button onClick={() => setGeneratedNarrative('')} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Ulangi</button><button onClick={saveToArchive} className="flex-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2"><Save /> Simpan ke Arsip</button></div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportsView;
