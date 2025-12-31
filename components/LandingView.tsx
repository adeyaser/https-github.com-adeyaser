
import React from 'react';
import { 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Sparkles,
  LayoutGrid,
  Heart,
  Globe,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Target,
  Trophy,
  Calendar,
  Eye
} from 'lucide-react';
import { LEARNING_AREAS, APP_NAME, MOCK_ACTIVITIES, MOCK_TEACHERS } from '../constants';

interface LandingViewProps {
  onLoginClick: () => void;
  onNavigate?: (path: string) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onLoginClick, onNavigate }) => {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-600">
      {/* Navigation Public */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-20 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate?.('/')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">P</div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">PAUD Cerdas</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-blue-600 transition-all">Beranda</button>
          <button onClick={() => onNavigate?.('/curriculum')} className="hover:text-blue-600 transition-all">Kurikulum</button>
          <button onClick={() => onNavigate?.('/about')} className="hover:text-blue-600 transition-all">Tentang Kami</button>
        </div>
        <button 
          onClick={onLoginClick}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-blue-600 transition-all active:scale-95"
        >
          Masuk Portal
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-hidden">
        <div className="space-y-8 animate-in slide-in-from-left-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} /> Montessori Method Certified
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1]">
            Membentuk <span className="text-blue-600">Masa Depan</span> dengan Cinta & Mandiri.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
            Platform edukasi Montessori terpadu yang membantu orang tua dan guru memantau setiap langkah kecil dalam tumbuh kembang buah hati secara holistik.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onLoginClick}
              className="px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-bold shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 group"
            >
              Mulai Belajar Sekarang <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate?.('/curriculum')}
              className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-[2rem] font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <LayoutGrid size={20} /> Lihat Kurikulum
            </button>
          </div>
        </div>
        <div className="relative animate-in zoom-in duration-1000">
           <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-50"></div>
           <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-100 rounded-full blur-[100px] opacity-50"></div>
           <img 
             src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=800&fit=crop" 
             className="w-full h-[600px] object-cover rounded-[4rem] shadow-2xl relative z-10" 
             alt="Montessori Activity" 
           />
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 px-6 lg:px-20 bg-slate-50 rounded-[4rem] lg:rounded-[6rem] -mt-10 relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Filosofi & Tujuan</h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">Visi & Misi Kami Untuk <br/> Masa Depan Si Kecil</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Target size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-4">Visi Utama</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Membangun ekosistem pendidikan anak usia dini yang memerdekakan potensi alami anak untuk menjadi individu yang mandiri, berempati, dan pembelajar sepanjang hayat.</p>
          </div>
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Heart size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-4">Misi Karakter</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Menyediakan lingkungan yang aman dan penuh kasih di mana setiap anak merasa dihargai dan didukung dalam mengeksplorasi minat unik mereka sendiri.</p>
          </div>
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Globe size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-4">Misi Akademik</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Menerapkan kurikulum Montessori standar internasional yang mengintegrasikan panca indera, logika, literasi, dan budaya dalam satu kesatuan belajar.</p>
          </div>
        </div>
      </section>

      {/* Montessori Areas Section (Existing but improved) */}
      <section className="py-24 px-6 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Kurikulum Unggulan</h2>
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">6 Area Utama Pengembangan Anak</h3>
          </div>
          <button onClick={() => onNavigate?.('/curriculum')} className="text-sm font-bold text-blue-600 flex items-center gap-2 hover:underline">Lihat Selengkapnya <ChevronRight size={18} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LEARNING_AREAS.map((area) => (
            <div key={area.area_id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group cursor-pointer" onClick={() => onNavigate?.('/curriculum')}>
               <div className="w-14 h-14 rounded-2xl mb-8 flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: area.color_code }}>
                  <LayoutGrid size={28} />
               </div>
               <h4 className="text-xl font-bold text-slate-800 mb-4">{area.area_name}</h4>
               <p className="text-sm text-slate-500 leading-relaxed mb-8">{area.description}</p>
               <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest">
                  Eksplorasi Area <ChevronRight size={14} />
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section - From Database (MOCK_ACTIVITIES) */}
      <section className="py-24 bg-slate-900 rounded-[4rem] lg:rounded-[6rem] px-6 lg:px-20 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Aktivitas Terkini</h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">Melihat Keceriaan Belajar Di PAUD Cerdas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_ACTIVITIES.map((activity) => (
            <div key={activity.activity_id} className="group relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-800 border border-slate-700/50 cursor-pointer" onClick={() => onNavigate?.('/public-gallery')}>
              <img src={activity.photos?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-80 group-hover:opacity-100" alt={activity.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[8px] font-black uppercase tracking-widest">
                    {LEARNING_AREAS.find(a => a.area_id === activity.area_id)?.area_name}
                  </span>
                  <span className="text-[8px] text-slate-300 font-bold flex items-center gap-1"><Calendar size={10} /> {activity.activity_date}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{activity.title}</h4>
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase">
                  Lihat Detail <ChevronRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
           <button 
            onClick={() => onNavigate?.('/public-gallery')}
            className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-bold text-sm hover:bg-white/10 transition-all"
           >
             Lihat Seluruh Galeri Kami
           </button>
        </div>
      </section>

      {/* Teachers Team Section */}
      <section className="py-24 px-6 lg:px-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Pengajar Profesional</h2>
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">Dibimbing Oleh Ahli <br/> Yang Berdedikasi</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_TEACHERS.map((teacher) => (
            <div key={teacher.user_id} className="text-center space-y-4 group">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-[20px] opacity-0 group-hover:opacity-20 transition-all"></div>
                <img 
                  src={teacher.profile_picture} 
                  className="w-48 h-48 rounded-full object-cover mx-auto ring-8 ring-slate-50 group-hover:ring-blue-100 transition-all relative z-10" 
                  alt={teacher.full_name} 
                />
              </div>
              <div className="pt-2">
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{teacher.full_name}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{(teacher as any).specialization || 'Montessori Educator'}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 p-12 bg-blue-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
              <Trophy size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold">Terakreditasi A</h4>
              <p className="text-blue-100 text-sm">Standar pengajaran internasional dengan sertifikasi resmi.</p>
            </div>
          </div>
          <button 
            onClick={onLoginClick}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-white hover:text-blue-600 transition-all"
          >
            Daftarkan Anak Sekarang <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-slate-900 text-slate-300 pt-24 pb-10 px-6 lg:px-20 rounded-t-[4rem] lg:rounded-t-[6rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">P</div>
              <span className="text-xl font-bold text-white tracking-tight">{APP_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Membimbing perkembangan alami anak melalui lingkungan yang disiapkan dengan cinta dan metode Montessori yang teruji secara internasional.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="p-2.5 bg-slate-800 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Tautan Cepat</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-blue-500 transition-all">Beranda Utama</button></li>
              <li><button onClick={() => onNavigate?.('/curriculum')} className="hover:text-blue-500 transition-all">Kurikulum Montessori</button></li>
              <li><button onClick={() => onNavigate?.('/about')} className="hover:text-blue-500 transition-all">Tentang Kami</button></li>
              <li><button onClick={onLoginClick} className="hover:text-blue-500 transition-all">Portal Guru & Wali Murid</button></li>
            </ul>
          </div>

          {/* Column 3: Areas */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Layanan</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="hover:text-blue-500 cursor-pointer transition-all">Pendaftaran Siswa Baru</li>
              <li className="hover:text-blue-500 cursor-pointer transition-all">E-Learning & Video Belajar</li>
              <li className="hover:text-blue-500 cursor-pointer transition-all">Monitoring Perkembangan</li>
              <li className="hover:text-blue-500 cursor-pointer transition-all">Konsultasi Pedagogi</li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Informasi Kontak</h4>
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <MapPin className="text-blue-500 shrink-0" size={20} />
                <p className="leading-relaxed">Gedung Pendidikan Cerdas, <br/>Jl. Montessori Raya No. 12, <br/>Jakarta Selatan, 12110.</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-blue-500 shrink-0" size={20} />
                <p>+62 (21) 555-0123</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-blue-500 shrink-0" size={20} />
                <p>hubungi@paudcerdas.sch.id</p>
              </div>
              <div className="pt-2">
                <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20">
                  <MessageCircle size={18} /> Chat WhatsApp Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-500">
            © 2024 PAUD Cerdas - Sistem Informasi Montessori Terpadu.
          </p>
          <div className="flex gap-8 text-xs font-medium text-slate-500">
            <a href="#" className="hover:text-white transition-all">Privasi</a>
            <a href="#" className="hover:text-white transition-all">Ketentuan Penggunaan</a>
            <a href="#" className="hover:text-white transition-all">Kebijakan Orang Tua</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
