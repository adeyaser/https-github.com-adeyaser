
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Loader2
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
  onBack: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'teacher'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Auth matching 'users' table
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        user_id: 1,
        username: formData.username,
        user_type: formData.role,
        full_name: formData.role === 'teacher' ? 'Dewi Kartika, S.Pd' : 'Orang Tua Alya'
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-30" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-30" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3.5rem] shadow-2xl shadow-blue-100/50 overflow-hidden relative z-10 border border-white">
        {/* Left Side: Illustration / Info */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 text-white relative">
          <div className="absolute inset-0 bg-blue-600 opacity-5" />
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold text-sm"
          >
            <ArrowLeft size={20} /> Kembali ke Landing
          </button>
          
          <div className="space-y-6 relative z-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl">P</div>
            <h2 className="text-4xl font-bold leading-tight">Portal Akademik <br /> <span className="text-blue-500">PAUD Cerdas.</span></h2>
            <p className="text-slate-400 leading-relaxed max-w-sm">Selamat datang kembali! Silakan masuk untuk mengelola kurikulum, dokumentasi kegiatan, dan memantau tumbuh kembang anak.</p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-slate-900" alt="" />)}
            </div>
            <p className="text-xs text-slate-500 font-bold">Terpercaya oleh 200+ Staf Pengajar</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-20 flex flex-col justify-center">
          <div className="mb-10">
             <h3 className="text-3xl font-bold text-slate-800 mb-2">Login Portal</h3>
             <p className="text-slate-400 text-sm font-medium">Gunakan kredensial yang telah didaftarkan oleh Admin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {(['teacher', 'parent', 'admin'] as const).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({...formData, role})}
                  className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.role === role ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-100'}`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Username / Email</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    placeholder="Contoh: dewi_kartika"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Security Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required
                    type={showPassword ? 'text' : 'password'} 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-100" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800">Ingat Saya</span>
              </label>
              <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Lupa Password?</button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-bold shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>Masuk ke Portal <ChevronRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
             <ShieldCheck size={24} className="text-blue-600 shrink-0" />
             <div className="text-[10px] text-slate-500 leading-relaxed font-medium">
               <p className="font-bold text-slate-700 mb-1">Akses Aman 256-bit</p>
               Data Anda terlindungi oleh enkripsi standar industri. Pastikan tidak memberikan kredensial login kepada siapapun.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
