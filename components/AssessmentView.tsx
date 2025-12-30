
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Star, 
  ClipboardList, 
  Target, 
  BrainCircuit, 
  Plus, 
  X, 
  Save, 
  Calendar, 
  Trophy, 
  Gamepad2, 
  Edit, 
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  User as UserIcon,
  Wand2,
  Loader2,
  Type as TypeIcon,
  Hash,
  Smile,
  BookOpen,
  History,
  Copy,
  Check
} from 'lucide-react';
import { MOCK_STUDENTS, MOCK_QUIZZES, LEARNING_AREAS, MOCK_QUIZ_RESULTS, MOCK_ACTIVITIES } from '../constants';
import { generateComprehensiveAssessment, generateQuizQuestions } from '../services/gemini';
import { Quiz, Question, QuizResult, DailyActivity } from '../types';

interface ObservationRecord {
  id: number;
  student_id: number;
  student_name: string;
  photo: string;
  date: string;
  content: string;
  type: 'AI_GENERATED' | 'MANUAL';
}

const AssessmentView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'observations' | 'quizzes'>('observations');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  
  // AI Note States
  const [aiNote, setAiNote] = useState("");
  const [isEditingAiNote, setIsEditingAiNote] = useState(false);
  const [tempAiNote, setTempAiNote] = useState("");

  // History / Saved Observations State
  const [savedObservations, setSavedObservations] = useState<ObservationRecord[]>([]);

  // Quiz Management State
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [results, setResults] = useState<QuizResult[]>(MOCK_QUIZ_RESULTS);
  const [activities] = useState<DailyActivity[]>(MOCK_ACTIVITIES);
  
  // UI States
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<number | null>(null);
  const [viewingQuizResults, setViewingQuizResults] = useState<Quiz | null>(null);
  const [activeQuizTaking, setActiveQuizTaking] = useState<Quiz | null>(null);

  // AI Assistant Specific States
  const [selectedStudentId, setSelectedStudentId] = useState<number>(MOCK_STUDENTS[0].student_id);
  const [ethicsInput, setEthicsInput] = useState("");

  // AI Quiz Gen Settings
  const [aiGenTopic, setAiGenTopic] = useState("");
  const [aiGenCount, setAiGenCount] = useState(3);

  // Form Data
  const [quizFormData, setQuizFormData] = useState<{
    quiz_title: string;
    quiz_type: 'game' | 'multiple_choice' | 'observation';
    start_date: string;
    end_date: string;
    passing_score: number;
    questions: Question[];
  }>({
    quiz_title: '',
    quiz_type: 'multiple_choice',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    passing_score: 75,
    questions: []
  });

  // Sync AI topic with Title initially
  useEffect(() => {
    if (quizFormData.quiz_title && !aiGenTopic) {
      setAiGenTopic(quizFormData.quiz_title);
    }
  }, [quizFormData.quiz_title]);

  // Quiz Taking Progress
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // --- HANDLERS ---

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuizId) {
      setQuizzes(prev => prev.map(q => q.quiz_id === editingQuizId ? { ...q, ...quizFormData } : q));
    } else {
      const newQuiz: Quiz = {
        quiz_id: Date.now(),
        ...quizFormData
      };
      setQuizzes(prev => [...prev, newQuiz]);
    }
    closeQuizForm();
  };

  const handleGenerateAIQuiz = async () => {
    const topic = aiGenTopic || quizFormData.quiz_title || "Pengetahuan Umum untuk Anak";
    setIsGeneratingQuiz(true);
    try {
      const aiQuestions = await generateQuizQuestions(topic, aiGenCount);
      if (aiQuestions && Array.isArray(aiQuestions)) {
        const mappedQuestions = aiQuestions.map((q: any) => ({
          ...q,
          id: Math.random() // Temp ID for new questions
        }));
        setQuizFormData(prev => ({
          ...prev,
          questions: [...prev.questions, ...mappedQuestions]
        }));
      } else {
        alert("Gagal mengenerate soal. Coba ganti judul/topik quiz.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghubungi AI.");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleGenerateComprehensiveAI = async () => {
    const student = MOCK_STUDENTS.find(s => s.student_id === selectedStudentId);
    if (!student) return;

    setIsGenerating(true);
    setIsEditingAiNote(false);
    
    const studentActivities = activities
      .filter(a => a.student_id === selectedStudentId || a.student_id === undefined)
      .slice(0, 5)
      .map(a => `${a.title}: ${a.content}`);
    
    const studentQuizzes = results
      .filter(r => r.student_id === selectedStudentId)
      .map(r => {
        const q = quizzes.find(qz => qz.quiz_id === r.quiz_id);
        return `${q?.quiz_title}: Skor ${r.score}% (${r.status})`;
      });

    try {
      const result = await generateComprehensiveAssessment(
        student.full_name,
        studentActivities,
        studentQuizzes,
        ethicsInput
      );
      setAiNote(result || "Gagal mengenerate narasi.");
      setTempAiNote(result || "");
    } catch (err) {
      console.error(err);
      setAiNote("Terjadi kesalahan sistem saat menghubungi Gemini.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditManual = () => {
    if (isEditingAiNote) {
      // Save changes from temp to main note
      setAiNote(tempAiNote);
      setIsEditingAiNote(false);
    } else {
      // Enter edit mode
      setTempAiNote(aiNote);
      setIsEditingAiNote(true);
    }
  };

  const handleInsertToReport = () => {
    const student = MOCK_STUDENTS.find(s => s.student_id === selectedStudentId);
    if (!student || !aiNote) return;

    const newRecord: ObservationRecord = {
      id: Date.now(),
      student_id: selectedStudentId,
      student_name: student.full_name,
      photo: student.photo || '',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      content: aiNote,
      type: 'AI_GENERATED'
    };

    setSavedObservations(prev => [newRecord, ...prev]);
    
    // Reset UI
    setAiNote("");
    setTempAiNote("");
    setEthicsInput("");
    setIsEditingAiNote(false);
    
    alert("Berhasil! Narasi telah disimpan ke histori perkembangan " + student.full_name);
  };

  const addQuestion = () => {
    const newQ: Question = {
      id: Date.now(),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setQuizFormData(prev => ({ ...prev, questions: [...prev.questions, newQ] }));
  };

  const updateQuestion = (qId: number, field: keyof Question, value: any) => {
    setQuizFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === qId ? { ...q, [field]: value } : q)
    }));
  };

  const removeQuestion = (qId: number) => {
    setQuizFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== qId)
    }));
  };

  const openEditQuiz = (quiz: Quiz) => {
    setEditingQuizId(quiz.quiz_id);
    setQuizFormData({
      quiz_title: quiz.quiz_title,
      quiz_type: quiz.quiz_type,
      start_date: quiz.start_date,
      end_date: quiz.end_date,
      passing_score: quiz.passing_score,
      questions: quiz.questions || []
    });
    setAiGenTopic(quiz.quiz_title);
    setShowQuizForm(true);
  };

  const closeQuizForm = () => {
    setShowQuizForm(false);
    setEditingQuizId(null);
    setQuizFormData({
      quiz_title: '',
      quiz_type: 'multiple_choice',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      passing_score: 75,
      questions: []
    });
    setAiGenTopic("");
    setAiGenCount(3);
  };

  const startQuizTaking = (quiz: Quiz) => {
    if (!quiz.questions || quiz.questions.length === 0) {
      alert("Quiz ini belum memiliki soal.");
      return;
    }
    setActiveQuizTaking(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setQuizFinished(false);
  };

  const finishQuiz = () => {
    if (!activeQuizTaking) return;
    
    let correctCount = 0;
    activeQuizTaking.questions?.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / (activeQuizTaking.questions?.length || 1)) * 100);
    const status = score >= activeQuizTaking.passing_score ? 'Pass' : 'Fail';

    const newResult: QuizResult = {
      result_id: Date.now(),
      quiz_id: activeQuizTaking.quiz_id,
      student_id: 1, // Simulated as current student
      score,
      status,
      completed_at: new Date().toLocaleString()
    };

    setResults(prev => [...prev, newResult]);
    setQuizFinished(true);
  };

  const deleteQuiz = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus quiz ini?')) {
      setQuizzes(prev => prev.filter(q => q.quiz_id !== id));
      setResults(prev => prev.filter(r => r.quiz_id !== id));
    }
  };

  const studentActivitiesCount = activities.filter(a => a.student_id === selectedStudentId || a.student_id === undefined).length;
  const studentQuizResultsCount = results.filter(r => r.student_id === selectedStudentId).length;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Penilaian & Observasi</h1>
          <p className="text-slate-500">Pantau progres tumbuh kembang siswa secara berkala.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('observations')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'observations' ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Observasi Harian
          </button>
          <button 
            onClick={() => setActiveTab('quizzes')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'quizzes' ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Quiz & Ujian
          </button>
        </div>
      </div>

      {activeTab === 'observations' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <BrainCircuit size={160} className="text-purple-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-purple-100 rounded-[1.5rem] text-purple-600 shadow-sm">
                      <Sparkles size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">AI Penilaian Komprehensif</h3>
                      <p className="text-sm text-slate-500">Generate narasi rapor otomatis dari data kegiatan, quiz, dan etika.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Pilih Siswa</label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select 
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(parseInt(e.target.value))}
                            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-10 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-purple-100 appearance-none transition-all cursor-pointer"
                          >
                            {MOCK_STUDENTS.map(s => <option key={s.student_id} value={s.student_id}>{s.full_name}</option>)}
                          </select>
                        </div>
                        {/* Data Context Indicators */}
                        <div className="flex gap-2 mt-3 px-1">
                           <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                             <BookOpen size={10} className="text-blue-500" />
                             <span className="text-[10px] font-bold text-blue-600">{studentActivitiesCount} Kegiatan</span>
                           </div>
                           <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                             <Trophy size={10} className="text-amber-500" />
                             <span className="text-[10px] font-bold text-amber-600">{studentQuizResultsCount} Hasil Quiz</span>
                           </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Etika & Karakter (Input Guru)</label>
                        <div className="relative">
                          <Smile className="absolute left-3 top-4 text-slate-400" size={18} />
                          <textarea 
                            value={ethicsInput}
                            onChange={(e) => setEthicsInput(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-100 h-24 resize-none"
                            placeholder="Contoh: Sopan, mau berbagi mainan, disiplin dalam merapikan alat..."
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleGenerateComprehensiveAI}
                      disabled={isGenerating}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-purple-100 flex items-center justify-center gap-2 hover:opacity-95 transition-all transform active:scale-[0.98] disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>AI Sedang Menganalisa Data & Perilaku...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          <span>Generate Narasi Rapor Komprehensif</span>
                        </>
                      )}
                    </button>

                    {aiNote && (
                      <div className="mt-8 p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-100 animate-in zoom-in duration-500 shadow-sm">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-purple-100/50">
                          <h4 className="text-sm font-black text-purple-800 uppercase tracking-widest flex items-center gap-2">
                             <CheckCircle2 size={16} /> Narasi Hasil Analisa AI
                          </h4>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(aiNote);
                              alert("Tersalin ke clipboard!");
                            }}
                            className="p-2 hover:bg-white rounded-xl text-purple-600 transition-all flex items-center gap-2 text-xs font-bold"
                          >
                            <Copy size={14} /> Salin Narasi
                          </button>
                        </div>
                        
                        {isEditingAiNote ? (
                          <textarea 
                            value={tempAiNote}
                            onChange={(e) => setTempAiNote(e.target.value)}
                            className="w-full bg-white border-2 border-purple-200 rounded-2xl p-4 text-sm text-slate-700 italic leading-relaxed h-48 focus:ring-0 focus:border-purple-400 transition-all"
                          />
                        ) : (
                          <p className="text-sm text-slate-700 italic leading-relaxed whitespace-pre-line font-medium">{aiNote}</p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                          <button 
                            onClick={handleEditManual}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                              isEditingAiNote 
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' 
                              : 'bg-white text-purple-600 border-purple-200 hover:shadow-md'
                            }`}
                          >
                            {isEditingAiNote ? <><Check size={14} /> Simpan Perubahan</> : <><Edit size={14} /> Edit Manual</>}
                          </button>
                          <button 
                            disabled={isEditingAiNote}
                            onClick={handleInsertToReport}
                            className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-50"
                          >
                            Masukkan ke Rapor
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
             </div>

             <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ClipboardList size={18} className="text-blue-500" /> Histori Observasi & Penilaian Terbaru
                </h3>
                <div className="space-y-4">
                  {/* Real History from Saved Observations */}
                  {savedObservations.map(obs => (
                    <div key={obs.id} className="flex gap-4 p-4 border border-purple-50 bg-purple-50/20 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                      <img src={obs.photo} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-slate-800">{obs.student_name}</h4>
                          <span className="text-[10px] text-slate-400 font-bold">{obs.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed italic">{obs.content}</p>
                        <div className="mt-3 flex items-center gap-2">
                           <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-[9px] font-bold uppercase tracking-widest">
                             {obs.type.replace('_', ' ')}
                           </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Mock history as fallback */}
                  {results.slice(0, 2).map(res => {
                    const student = MOCK_STUDENTS.find(s => s.student_id === res.student_id);
                    const quiz = quizzes.find(q => q.quiz_id === res.quiz_id);
                    return (
                      <div key={res.result_id} className="flex gap-4 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer opacity-60">
                        <img src={student?.photo} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-slate-800">{student?.full_name}</h4>
                            <span className="text-[10px] text-slate-400">{res.completed_at}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Quiz: {quiz?.quiz_title} • Skor: {res.score}%</p>
                          <div className="flex items-center gap-2 mt-2">
                             <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${res.status === 'Pass' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {res.status}
                             </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Target size={18} className="text-emerald-500" /> Target Kompetensi Kelas
              </h3>
              <div className="space-y-6">
                {LEARNING_AREAS.slice(0, 4).map(area => (
                  <div key={area.area_id}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-600">{area.area_name}</span>
                      <span className="text-emerald-600">75% Tercapai</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold border border-slate-100">
                Lihat Analisa Kelas Lengkap
              </button>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
               <div className="absolute -bottom-4 -right-4 opacity-20">
                  <History size={100} />
               </div>
               <h4 className="font-bold mb-2 flex items-center gap-2"><Clock size={16} /> Deadline Rapor</h4>
               <p className="text-xs text-indigo-100 mb-4">Pastikan semua observasi harian selesai sebelum tanggal 20 Maret untuk evaluasi semester.</p>
               <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm text-center">
                  <span className="text-2xl font-black">04</span>
                  <p className="text-[10px] font-bold uppercase">Hari Lagi</p>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => {
            const quizResults = results.filter(r => r.quiz_id === quiz.quiz_id);
            const completionRate = Math.round((quizResults.length / 15) * 100);
            return (
              <div key={quiz.quiz_id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col hover:shadow-lg transition-all group relative">
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditQuiz(quiz)} className="p-2 bg-white shadow-md rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => deleteQuiz(quiz.quiz_id)} className="p-2 bg-white shadow-md rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    quiz.quiz_type === 'game' ? 'bg-amber-50 text-amber-600' : 
                    quiz.quiz_type === 'multiple_choice' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {quiz.quiz_type}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Star size={14} /> Pass: {quiz.passing_score}%
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{quiz.quiz_title}</h3>
                <p className="text-xs text-slate-500 mb-6">Mulai: {quiz.start_date} s/d {quiz.end_date}</p>
                
                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                     <span className="text-slate-400">Peserta: {quizResults.length}/15</span>
                     <span className="text-blue-600 font-bold">{completionRate}% Selesai</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${completionRate}%` }}></div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <button 
                      onClick={() => setViewingQuizResults(quiz)}
                      className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100"
                    >
                      Hasil Peserta
                    </button>
                    <button 
                      onClick={() => startQuizTaking(quiz)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all"
                    >
                      Mulai Quiz
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div 
            onClick={() => setShowQuizForm(true)}
            className="bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-white hover:border-blue-400 transition-all min-h-[220px] group"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm group-hover:text-blue-500 transition-all">
              <Plus size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-500 text-sm">Buat Quiz Baru</p>
              <p className="text-[10px] text-slate-400">Tentukan tipe Game, Multiple Choice, atau Observasi</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Results Viewer */}
      {viewingQuizResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Hasil Peserta</h2>
                  <p className="text-xs text-blue-100">{viewingQuizResults.quiz_title}</p>
                </div>
                <button onClick={() => setViewingQuizResults(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {results.filter(r => r.quiz_id === viewingQuizResults.quiz_id).length > 0 ? (
                    results.filter(r => r.quiz_id === viewingQuizResults.quiz_id).map(res => {
                      const student = MOCK_STUDENTS.find(s => s.student_id === res.student_id);
                      return (
                        <div key={res.result_id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                          <img src={student?.photo} className="w-12 h-12 rounded-xl object-cover" alt="" />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-800">{student?.full_name}</h4>
                            <p className="text-[10px] text-slate-400">{res.completed_at}</p>
                          </div>
                          <div className="text-right">
                             <p className={`text-lg font-bold ${res.status === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>{res.score}%</p>
                             <span className={`text-[10px] font-bold uppercase ${res.status === 'Pass' ? 'text-green-500' : 'text-red-500'}`}>{res.status}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                       <AlertCircle size={48} className="mx-auto mb-3 opacity-20" />
                       <p>Belum ada peserta yang mengerjakan quiz ini.</p>
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>
      )}

      {/* MODAL: Quiz Taker */}
      {activeQuizTaking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 min-h-[400px]">
              <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
                 <h2 className="font-bold flex items-center gap-2"><Gamepad2 size={20} className="text-blue-400" /> {activeQuizTaking.quiz_title}</h2>
                 <button onClick={() => setActiveQuizTaking(null)} className="p-1 hover:bg-white/10 rounded-full"><X size={20} /></button>
              </div>
              
              {!quizFinished ? (
                <div className="flex-1 p-8 flex flex-col">
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                      <span>Soal {currentQuestionIdx + 1} dari {activeQuizTaking.questions?.length}</span>
                      <span>Progress: {Math.round(((currentQuestionIdx + 1) / (activeQuizTaking.questions?.length || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((currentQuestionIdx + 1) / (activeQuizTaking.questions?.length || 1)) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">
                      {activeQuizTaking.questions?.[currentQuestionIdx].text}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {activeQuizTaking.questions?.[currentQuestionIdx].options.map((opt, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIdx]: idx })}
                          className={`w-full p-4 text-left rounded-2xl border-2 transition-all font-medium text-sm flex items-center gap-3 ${
                            selectedAnswers[currentQuestionIdx] === idx 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] ${
                            selectedAnswers[currentQuestionIdx] === idx ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-200 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between gap-4">
                    <button 
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                      className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold disabled:opacity-30"
                    >
                      Kembali
                    </button>
                    {currentQuestionIdx === (activeQuizTaking.questions?.length || 0) - 1 ? (
                      <button 
                        onClick={finishQuiz}
                        disabled={selectedAnswers[currentQuestionIdx] === undefined}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                      >
                        Selesai Quiz
                      </button>
                    ) : (
                      <button 
                        onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                        disabled={selectedAnswers[currentQuestionIdx] === undefined}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                      >
                        Selanjutnya
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 p-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                   <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <Trophy size={48} />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Selesai!</h2>
                   <p className="text-slate-500 mb-8">Hasil pengerjaan Anda telah tersimpan ke sistem.</p>
                   
                   <div className="w-full bg-slate-50 p-6 rounded-3xl mb-8 flex items-center justify-center gap-12">
                      <div className="text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Skor Anda</p>
                         <p className={`text-4xl font-black ${results[results.length-1].score}%`}>{results[results.length-1].score}%</p>
                      </div>
                      <div className="w-px h-12 bg-slate-200"></div>
                      <div className="text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                         <p className={`text-xl font-bold ${results[results.length-1].status === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>{results[results.length-1].status === 'Pass' ? 'LULUS' : 'REMIDI'}</p>
                      </div>
                   </div>

                   <button 
                     onClick={() => setActiveQuizTaking(null)}
                     className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-all"
                   >
                     Tutup Halaman
                   </button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* FORM MODAL: Create/Edit Quiz with Questions */}
      {showQuizForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="bg-purple-600 p-8 text-white flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Star size={24} />
                </div>
                <h2 className="text-xl font-bold">{editingQuizId ? 'Edit Quiz / Ujian' : 'Buat Quiz Baru'}</h2>
              </div>
              <button onClick={closeQuizForm} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleQuizSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Metadata Section */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Informasi Umum</h3>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block tracking-widest">Judul Quiz / Topik Utama</label>
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required 
                      type="text" 
                      value={quizFormData.quiz_title} 
                      onChange={e => setQuizFormData({...quizFormData, quiz_title: e.target.value})} 
                      placeholder="Contoh: Mengenal Hewan Jinak" 
                      className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-100 transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block tracking-widest">Tipe Penilaian</label>
                    <div className="relative">
                      <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <select 
                        value={quizFormData.quiz_type} 
                        onChange={e => setQuizFormData({...quizFormData, quiz_type: e.target.value as any})} 
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-100 transition-all appearance-none"
                      >
                        <option value="game">Game Edukasi</option>
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="observation">Observasi Langsung</option>
                      </select>
                    </div>
                  </div>
                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-500 tracking-widest">Passing Score</label>
                        <span className="text-xs font-bold text-purple-600">{quizFormData.passing_score}%</span>
                     </div>
                     <input 
                        type="range" 
                        min="50" max="100" step="5"
                        value={quizFormData.passing_score}
                        onChange={e => setQuizFormData({...quizFormData, passing_score: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                     />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block tracking-widest">Tanggal Mulai</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        required type="date" 
                        value={quizFormData.start_date} 
                        onChange={e => setQuizFormData({...quizFormData, start_date: e.target.value})} 
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-9 pr-4 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-purple-100" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block tracking-widest">Tanggal Selesai</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        required type="date" 
                        value={quizFormData.end_date} 
                        onChange={e => setQuizFormData({...quizFormData, end_date: e.target.value})} 
                        className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-9 pr-4 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-purple-100" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI GENERATION CONFIG SECTION */}
              <div className="p-6 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                    <Wand2 size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-indigo-900">Konfigurasi AI Generator</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-indigo-400 uppercase mb-2 block tracking-widest">Topik Spesifik AI</label>
                    <div className="relative">
                      <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={16} />
                      <input 
                        type="text" 
                        value={aiGenTopic} 
                        onChange={e => setAiGenTopic(e.target.value)} 
                        placeholder="Contoh: Nama hewan di hutan..." 
                        className="w-full bg-white border-none rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-200 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-indigo-400 uppercase mb-2 block tracking-widest">Jumlah Soal</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={16} />
                      <input 
                        type="number" 
                        min="1" max="10"
                        value={aiGenCount} 
                        onChange={e => setAiGenCount(parseInt(e.target.value))} 
                        className="w-full bg-white border-none rounded-xl py-2.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-200 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleGenerateAIQuiz}
                  disabled={isGeneratingQuiz}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md shadow-indigo-100 mt-2"
                >
                  {isGeneratingQuiz ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  Generate Soal dengan AI Gemini
                </button>
                <p className="text-[10px] text-indigo-400 text-center">AI akan menambahkan soal pilihan ganda sesuai topik dan jumlah yang diminta.</p>
              </div>

              {/* Questions Editor Section */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Daftar Pertanyaan ({quizFormData.questions.length})</h3>
                   <button 
                    type="button" 
                    onClick={addQuestion}
                    className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-purple-100 transition-all"
                   >
                     <Plus size={14} /> Tambah Manual
                   </button>
                 </div>

                 <div className="space-y-6">
                    {quizFormData.questions.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Belum ada soal</p>
                         <p className="text-[10px] text-slate-400">Gunakan Generator AI di atas atau klik "Tambah Manual" untuk mulai.</p>
                      </div>
                    ) : (
                      quizFormData.questions.map((q, qIdx) => (
                        <div key={q.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative animate-in slide-in-from-top-2 duration-300">
                           <button 
                            type="button" 
                            onClick={() => removeQuestion(q.id)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-all"
                           >
                             <Trash2 size={14} />
                           </button>
                           
                           <div className="space-y-4">
                              <div>
                                 <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Pertanyaan #{qIdx + 1}</label>
                                 <textarea 
                                  value={q.text}
                                  onChange={e => updateQuestion(q.id, 'text', e.target.value)}
                                  placeholder="Tulis soal di sini..."
                                  className="w-full bg-white border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-purple-100 resize-none h-20"
                                 ></textarea>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 {q.options.map((opt, oIdx) => (
                                   <div key={oIdx} className="relative group">
                                      <input 
                                        type="text"
                                        value={opt}
                                        onChange={e => {
                                          const newOpts = [...q.options];
                                          newOpts[oIdx] = e.target.value;
                                          updateQuestion(q.id, 'options', newOpts);
                                        }}
                                        placeholder={`Opsi ${String.fromCharCode(65+oIdx)}`}
                                        className={`w-full py-2.5 pl-10 pr-4 text-xs font-medium bg-white rounded-xl border-2 transition-all ${
                                          q.correctAnswer === oIdx ? 'border-green-500 ring-2 ring-green-100' : 'border-transparent focus:border-purple-200'
                                        }`}
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => updateQuestion(q.id, 'correctAnswer', oIdx)}
                                        className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] font-black transition-all ${
                                          q.correctAnswer === oIdx ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-slate-400 bg-slate-50'
                                        }`}
                                      >
                                        {String.fromCharCode(65 + oIdx)}
                                      </button>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
              </div>

              <div className="pt-4 flex gap-4 flex-shrink-0">
                <button 
                  type="button" 
                  onClick={closeQuizForm}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all transform active:scale-95"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-purple-100 flex items-center justify-center gap-2 hover:bg-purple-700 transition-all transform active:scale-95"
                >
                  <Save size={20} /> {editingQuizId ? 'Update Quiz' : 'Simpan Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentView;
