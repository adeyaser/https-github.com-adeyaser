
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Star, 
  X, 
  Clock, 
  MousePointer2,
  CheckCircle2,
  Sparkles,
  Plus,
  Wand2,
  Save,
  Loader2,
  Trash2,
  LayoutGrid,
  Filter as FilterIcon,
  Layers,
  Info,
  ChevronRight,
  Shapes,
  Calculator,
  Hand,
  Trophy as TrophyIcon,
  CircleDot,
  Dices,
  Play
} from 'lucide-react';
import { MOCK_GAMES, BEAD_COLORS } from '../constants';
import { LearningGame } from '../types';
import { generateGameContent } from '../services/gemini';

interface Card { id: number; symbol: string; isFlipped: boolean; isMatched: boolean; }
interface SortingItem { id: number; symbol: string; category: string; status?: 'correct' | 'wrong' | 'idle'; }
interface StepItem { step: number; text: string; icon: string; status?: 'done' | 'next' | 'locked'; }
interface CustomGame extends LearningGame { custom_items?: any[]; categories?: string[]; }

const GamesView: React.FC = () => {
  const [gamesList, setGamesList] = useState<CustomGame[]>(MOCK_GAMES);
  const [activeGame, setActiveGame] = useState<CustomGame | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [moves, setMoves] = useState(0);

  // General States
  const [isProcessing, setIsProcessing] = useState(false);

  // Engine Specific States
  const [gameCards, setGameCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [sortingItems, setSortingItems] = useState<SortingItem[]>([]);
  const [beadTarget, setBeadTarget] = useState<number | null>(null);
  const [bankTarget, setBankTarget] = useState<number>(0);
  const [bankInput, setBankInput] = useState({ thousand: 0, hundred: 0, ten: 0, unit: 0 });
  const [plSteps, setPlSteps] = useState<StepItem[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [snakeTarget, setSnakeTarget] = useState<number>(0);
  const [snakeCombo, setSnakeCombo] = useState<number[]>([]);

  // Creation State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [formData, setFormData] = useState({ title: '', description: '', type: 'memory' as any, min_score: 70, items: [] as any[], categories: [] as string[] });

  const initGame = (game: CustomGame) => {
    setActiveGame(game);
    setTimer(0);
    setMoves(0);
    setIsFinished(false);
    setIsProcessing(false);

    switch (game.game_type) {
      case 'memory':
        const symbols = game.custom_items && game.custom_items.length > 0 ? game.custom_items : ['🍎', '🍌', '🍇', '🍓', '🍋', '🥝'];
        setGameCards([...symbols, ...symbols].sort(() => Math.random() - 0.5).map((s, i) => ({ id: i, symbol: typeof s === 'string' ? s : (s.symbol || '❓'), isFlipped: false, isMatched: false })));
        setFlippedCards([]);
        break;
      case 'sorting':
        const rawItems = game.custom_items || [{symbol:'🦁', category:'Darat'}, {symbol:'🐳', category:'Air'}];
        setSortingItems(rawItems.map((item: any, idx: number) => ({ ...item, id: idx, status: 'idle' } as SortingItem)).sort(() => Math.random() - 0.5));
        break;
      case 'bead_stair':
        setBeadTarget(Math.floor(Math.random() * 10) + 1);
        break;
      case 'golden_beads':
      case 'stamp_game':
        setBankTarget(Math.floor(Math.random() * 9000) + 1000);
        setBankInput({ thousand: 0, hundred: 0, ten: 0, unit: 0 });
        break;
      case 'practical_life':
        // Ensure steps are sorted and have required fields
        const rawSteps = game.custom_items || [
          { step: 1, text: "Siapkan peralatan", icon: "📦" },
          { step: 2, text: "Lakukan aktivitas", icon: "✨" },
          { step: 3, text: "Rapikan kembali", icon: "🧹" }
        ];
        // Fix: Explicitly annotating normalizedSteps as StepItem[] and casting the status value to resolve the assignment error
        const normalizedSteps: StepItem[] = rawSteps
          .sort((a: any, b: any) => (a.step || 0) - (b.step || 0))
          .map((s: any, idx: number) => {
            const stepVal = s.step || (idx + 1);
            return {
              step: stepVal,
              text: s.text || "Langkah tanpa deskripsi",
              icon: s.icon || "📍",
              status: (stepVal === 1 ? 'next' : 'locked') as 'done' | 'next' | 'locked'
            };
          });
        setPlSteps(normalizedSteps);
        setCurrentStep(1);
        break;
      case 'snake_game':
        setSnakeTarget(10);
        setSnakeCombo([]);
        break;
    }
  };

  useEffect(() => {
    let interval: any;
    if (activeGame && !isFinished) interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [activeGame, isFinished]);

  // --- LOGIC HANDLERS ---
  const handleMemoryClick = (id: number) => {
    if (flippedCards.length === 2 || gameCards[id].isFlipped || gameCards[id].isMatched) return;
    const newCards = [...gameCards];
    newCards[id].isFlipped = true;
    setGameCards(newCards);
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [f, s] = newFlipped;
      if (newCards[f].symbol === newCards[s].symbol) {
        setTimeout(() => {
          setGameCards(prev => {
            const matched = [...prev];
            matched[f].isMatched = true;
            matched[s].isMatched = true;
            if (matched.every(c => c.isMatched)) setIsFinished(true);
            return matched;
          });
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setGameCards(prev => {
            const reset = [...prev];
            reset[f].isFlipped = false;
            reset[s].isFlipped = false;
            return reset;
          });
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleStepClick = (step: number) => {
    if (step !== currentStep) return;
    setMoves(prev => prev + 1);
    setPlSteps(prev => prev.map(s => s.step === step ? { ...s, status: 'done' } : s.step === step + 1 ? { ...s, status: 'next' } : s));
    if (step === plSteps.length) {
      setTimeout(() => setIsFinished(true), 500);
    } else {
      setCurrentStep(step + 1);
    }
  };

  const handleSnakeBead = (val: number) => {
    const newCombo = [...snakeCombo, val];
    setSnakeCombo(newCombo);
    setMoves(prev => prev + 1);
    const total = newCombo.reduce((a, b) => a + b, 0);
    if (total === snakeTarget) {
      setIsFinished(true);
    } else if (total > snakeTarget) {
      alert("Terlalu banyak! Ular harus pas berjumlah 10.");
      setSnakeCombo([]);
    }
  };

  const checkMathGame = () => {
    setMoves(prev => prev + 1);
    const total = bankInput.thousand * 1000 + bankInput.hundred * 100 + bankInput.ten * 10 + bankInput.unit;
    if (total === bankTarget) setIsFinished(true);
    else alert("Hitungan belum pas, coba lagi!");
  };

  const handleAiGenerate = async () => {
    if (!aiTopic) return;
    setIsGenerating(true);
    try {
      const result = await generateGameContent(aiTopic, formData.type);
      if (result) {
        setFormData({ ...formData, title: result.title, description: result.description, items: result.custom_items, categories: result.categories || [] });
        // Optionally close modal or stay to allow edits
      } else {
        alert("Gagal mengolah materi. Coba gunakan topik yang lebih sederhana.");
      }
    } catch (err) {
      alert("Gagal generate.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    const newGame: CustomGame = {
      game_id: Date.now(),
      game_title: formData.title,
      game_description: formData.description,
      game_type: formData.type,
      image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
      min_score: formData.min_score,
      custom_items: formData.items,
      categories: formData.categories
    };
    setGamesList(prev => [newGame, ...prev]);
    setShowCreateModal(false);
    setAiTopic("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">E-Learning Montessori</h1>
          <p className="text-slate-500">Pusat permainan edukatif sensorial dan matematik.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"><Plus size={20} /> Buat Game AI</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gamesList.map(game => (
          <div key={game.game_id} className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
             <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 relative bg-slate-100">
                <img src={game.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt="" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
                <div onClick={() => initGame(game)} className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xl hover:scale-110 active:scale-95"><Play size={24} fill="currentColor" /></div>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest shadow-sm border border-white">
                  {game.game_type.replace('_', ' ')}
                </div>
             </div>
             <div className="px-4 pb-4">
                <h3 className="text-xl font-bold text-slate-800 mb-1 truncate">{game.game_title}</h3>
                <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2 leading-relaxed">{game.game_description}</p>
                <button onClick={() => initGame(game)} className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all">Main Sekarang</button>
             </div>
          </div>
        ))}
      </div>

      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Gamepad2 size={24} /></div>
                   <div>
                      <h2 className="text-xl font-bold text-slate-800 truncate">{activeGame.game_title}</h2>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kurikulum Montessori Digital</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-4">
                      <div className="text-center"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Waktu</p><div className="flex items-center gap-1 font-bold text-slate-700"><Clock size={14} /> {timer}s</div></div>
                      <div className="text-center"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Langkah</p><div className="flex items-center gap-1 font-bold text-slate-700"><MousePointer2 size={14} /> {moves}</div></div>
                   </div>
                   <button onClick={() => setActiveGame(null)} className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:text-red-500 transition-all"><X size={20} /></button>
                </div>
             </div>

             <div className="flex-1 p-8 bg-slate-50/30 overflow-y-auto flex flex-col items-center justify-center relative min-h-[500px]">
                {!isFinished ? (
                   <div className="w-full h-full flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 duration-500">
                      
                      {/* 1. BEAD STAIR ENGINE */}
                      {activeGame.game_type === 'bead_stair' && (
                        <div className="space-y-12 text-center w-full">
                           <div>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tunjukan Manik Bilangan:</p>
                              <h2 className="text-8xl font-black text-blue-600">{beadTarget}</h2>
                           </div>
                           <div className="flex flex-wrap justify-center gap-6">
                              {[1,2,3,4,5,6,7,8,9,10].map(v => (
                                <button key={v} onClick={() => { setMoves(m => m+1); if(v === beadTarget) setIsFinished(true); else alert("Salah! Hitung lagi butiran maniknya."); }} className="p-4 bg-white rounded-3xl border-4 border-transparent hover:border-blue-500 shadow-sm hover:shadow-xl transition-all">
                                   <div className="flex flex-col gap-1 items-center">
                                      {Array.from({length: v}).map((_, i) => <div key={i} className="w-5 h-5 rounded-full bead-sphere" style={{ backgroundColor: (BEAD_COLORS as any)[v] }} />)}
                                   </div>
                                </button>
                              ))}
                           </div>
                        </div>
                      )}

                      {/* 2. GOLDEN BEADS / STAMP GAME ENGINE */}
                      {(activeGame.game_type === 'golden_beads' || activeGame.game_type === 'stamp_game') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-4xl">
                           <div className="bg-white p-10 rounded-[3rem] border-4 border-dashed border-blue-200 text-center">
                              <p className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Sajikan Nilai Berikut:</p>
                              <h2 className="text-7xl font-black text-slate-800 tracking-widest">{bankTarget}</h2>
                           </div>
                           <div className="space-y-4">
                              {(['thousand', 'hundred', 'ten', 'unit'] as const).map(type => (
                                <div key={type} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xs ${type==='thousand'?'bg-green-600':type==='hundred'?'bg-red-500':type==='ten'?'bg-blue-500':'bg-green-500'}`}>
                                      {type[0].toUpperCase()}
                                   </div>
                                   <div className="flex items-center gap-4">
                                      <button onClick={() => setBankInput(p => ({...p, [type]: Math.max(0, p[type]-1)}))} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">-</button>
                                      <span className="w-10 text-center font-black text-xl">{bankInput[type]}</span>
                                      <button onClick={() => setBankInput(p => ({...p, [type]: Math.min(9, p[type]+1)}))} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">+</button>
                                   </div>
                                </div>
                              ))}
                              <button onClick={checkMathGame} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all">Selesai Berhitung</button>
                           </div>
                        </div>
                      )}

                      {/* 3. PRACTICAL LIFE ENGINE */}
                      {activeGame.game_type === 'practical_life' && (
                        <div className="w-full max-w-2xl space-y-8">
                           <div className="text-center mb-10">
                              <h3 className="text-2xl font-bold text-slate-800">Urutkan Aktivitas Berikut</h3>
                              <p className="text-slate-500">Klik langkah yang harus dilakukan secara berurutan.</p>
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              {plSteps.map((step) => (
                                <button 
                                  key={step.step}
                                  onClick={() => handleStepClick(step.step)}
                                  className={`p-6 rounded-[2.5rem] border-4 transition-all flex items-center gap-6 text-left group
                                    ${step.status === 'done' ? 'bg-emerald-50 border-emerald-500 grayscale-0' : 
                                      step.status === 'next' ? 'bg-white border-blue-500 shadow-xl scale-105' : 
                                      'bg-slate-50 border-slate-100 opacity-60 grayscale cursor-not-allowed'}`}
                                >
                                   <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl shadow-sm transition-transform group-hover:rotate-12 ${step.status === 'done' ? 'bg-emerald-500' : 'bg-white border-2'}`}>
                                      {step.status === 'done' ? <CheckCircle2 className="text-white" /> : step.icon}
                                   </div>
                                   <div className="flex-1">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Langkah {step.step}</p>
                                      <p className={`font-bold text-lg ${step.status === 'done' ? 'text-emerald-700' : 'text-slate-800'}`}>{step.text}</p>
                                   </div>
                                   {step.status === 'next' && <ChevronRight className="text-blue-500 animate-bounce-x" />}
                                </button>
                              ))}
                           </div>
                        </div>
                      )}

                      {/* 4. SNAKE GAME ENGINE */}
                      {activeGame.game_type === 'snake_game' && (
                        <div className="w-full text-center space-y-12">
                           <div>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Buat Ular Berjumlah Sepuluh:</p>
                              <div className="flex justify-center items-center gap-1 bg-white p-6 rounded-[3rem] shadow-inner min-h-[100px] border-4 border-dashed border-amber-200">
                                 {snakeCombo.map((v, i) => (
                                   <div key={i} className="flex flex-col gap-0.5 animate-in zoom-in duration-300">
                                      {Array.from({length: v}).map((_, j) => <div key={j} className="w-4 h-4 rounded-full shadow-inner bead-sphere" style={{ backgroundColor: (BEAD_COLORS as any)[v] }} />)}
                                   </div>
                                 ))}
                                 {snakeCombo.length === 0 && <span className="text-slate-300 italic font-medium">Klik manik di bawah untuk menyusun ular...</span>}
                              </div>
                           </div>
                           <div className="flex flex-wrap justify-center gap-4">
                              {[1,2,3,4,5,6,7,8,9].map(v => (
                                <button key={v} onClick={() => handleSnakeBead(v)} className="p-3 bg-white rounded-2xl hover:scale-110 shadow-sm transition-all border-2 border-transparent hover:border-blue-500">
                                   <div className="flex flex-col gap-0.5 items-center">
                                      {Array.from({length: v}).map((_, i) => <div key={i} className="w-3 h-3 rounded-full shadow-inner bead-sphere" style={{ backgroundColor: (BEAD_COLORS as any)[v] }} />)}
                                   </div>
                                </button>
                              ))}
                           </div>
                           <button onClick={() => setSnakeCombo([])} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Ulangi Ular</button>
                        </div>
                      )}

                      {/* 5. MEMORY ENGINE */}
                      {activeGame.game_type === 'memory' && (
                         <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl w-full">
                            {gameCards.map(card => (
                              <div key={card.id} onClick={() => handleMemoryClick(card.id)} className={`aspect-square relative cursor-pointer transition-all duration-500 preserve-3d ${card.isFlipped || card.isMatched ? '[transform:rotateY(180deg)]' : ''}`}>
                                 <div className={`absolute inset-0 bg-blue-500 rounded-[2rem] border-4 border-white shadow-lg flex items-center justify-center backface-hidden z-10 ${card.isFlipped || card.isMatched ? 'opacity-0' : 'opacity-100'}`}><Star size={32} className="text-white/20" fill="currentColor" /></div>
                                 <div className={`absolute inset-0 bg-white rounded-[2rem] border-4 border-blue-100 shadow-xl flex items-center justify-center [transform:rotateY(180deg)] backface-hidden ${card.isMatched ? 'bg-emerald-50 border-emerald-200' : ''}`}><span className="text-5xl">{card.symbol}</span></div>
                              </div>
                            ))}
                         </div>
                      )}

                   </div>
                ) : (
                  <div className="text-center animate-in zoom-in duration-500 max-w-sm">
                     <div className="w-32 h-32 bg-amber-100 text-amber-500 rounded-[3rem] flex items-center justify-center mx-auto mb-8 relative">
                        <TrophyIcon size={64} />
                        <Sparkles className="absolute -top-4 -right-4 text-emerald-500 animate-pulse" />
                     </div>
                     <h2 className="text-3xl font-black text-slate-800 mb-2">Hebat Sekali!</h2>
                     <p className="text-slate-500 mb-10 text-sm">Kamu telah menguasai materi ini dengan sangat baik.</p>
                     <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Waktu</p><p className="text-2xl font-black text-blue-600">{timer}s</p></div>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Langkah</p><p className="text-2xl font-black text-purple-600">{moves}</p></div>
                     </div>
                     <button onClick={() => setActiveGame(null)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all mb-4">Simpan Hasil Belajar</button>
                     <button onClick={() => initGame(activeGame!)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Main Lagi</button>
                  </div>
                )}
             </div>

             <div className="p-6 bg-blue-50 flex items-center gap-3 shrink-0">
                <Info size={18} className="text-blue-600" />
                <p className="text-xs font-bold text-blue-800/60 uppercase tracking-widest">{activeGame.game_description}</p>
             </div>
          </div>
        </div>
      )}

      {/* AI GENERATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/20 rounded-2xl"><Wand2 size={28} /></div>
                 <div><h2 className="text-xl font-bold">Pusat Kreativitas AI</h2><p className="text-blue-100 text-xs">Generate materi game dalam hitungan detik</p></div>
               </div>
               <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {id:'memory', icon: LayoutGrid, label: 'Memory'},
                    {id:'bead_stair', icon: CircleDot, label: 'Beads'},
                    {id:'practical_life', icon: Hand, label: 'Routine'},
                    {id:'snake_game', icon: Dices, label: 'Snake'},
                  ].map(p => (
                    <button key={p.id} onClick={() => setFormData({...formData, type: p.id})} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${formData.type === p.id ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                       <p.icon size={24} /><span className="text-[10px] font-bold uppercase">{p.label}</span>
                    </button>
                  ))}
               </div>
               
               {!isGenerating && formData.items.length === 0 ? (
                 <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Topik Belajar (Contoh: Membersihkan Meja, Mencari Sepasang Hewan)</label>
                    <input type="text" value={aiTopic} onChange={e => setAiTopic(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiGenerate()} placeholder="Tulis instruksi materi di sini..." className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-blue-100" />
                    <button onClick={handleAiGenerate} disabled={isGenerating || !aiTopic} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95">
                      {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate Konten Game
                    </button>
                 </div>
               ) : (
                 <form onSubmit={handleSaveGame} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                       <p className="text-xs font-bold text-blue-800">✨ AI telah menyusun materi: <span className="font-black underline">{formData.title}</span></p>
                       <button type="button" onClick={() => {setFormData({...formData, items: []}); setAiTopic("");}} className="text-[10px] font-bold text-blue-600 hover:underline">Generate Ulang</button>
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest px-1">Judul Game</label>
                      <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest px-1">Instruksi</label>
                      <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold resize-none" rows={2} />
                    </div>
                    <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-95">
                       <Save size={20} /> Simpan ke Koleksi Game
                    </button>
                 </form>
               )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .bead-sphere {
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 50%), currentColor;
          box-shadow: inset -2px -2px 4px rgba(0,0,0,0.3), 1px 1px 2px rgba(0,0,0,0.2);
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
      `}</style>
    </div>
  );
};

export default GamesView;
