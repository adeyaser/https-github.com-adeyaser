
import React from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Target, 
  Award, 
  Users, 
  CheckCircle2, 
  Star, 
  Quote,
  ShieldCheck,
  Globe,
  Smile,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';
import { APP_NAME } from '../constants';

interface PublicAboutViewProps {
  onBack: () => void;
}

const PublicAboutView: React.FC<PublicAboutViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Header */}
      <header className="bg-slate-900 text-white pt-24 pb-48 px-6 lg:px-20 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <img src="https://images.unsplash.com/photo-1502086223501-7ea2cea4e0ff?w=1600" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto relative z-10">
           <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-12 font-bold text-sm bg-white/5 px-4 py-2 rounded-full backdrop-blur-md"
           >
             <ArrowLeft size={18} /> Kembali ke Beranda
           </button>
           <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight">Menciptakan Dunia <br/><span className="text-blue-500">Yang Lebih Baik</span> Dimulai Dari Sini.</h1>
           <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed italic">
             "Pendidikan bukanlah apa yang diberikan oleh guru; pendidikan adalah sebuah proses alami yang dilakukan oleh manusia secara spontan." — Maria Montessori
           </p>
        </div>
      </header>

      {/* Vision & Mission Content */}
      <main className="px-6 lg:px-20 -mt-24 relative z-20 pb-32">
        <div className="max-w-6xl mx-auto space-y-12">
           {/* Summary Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Heart, label: 'Berasaskan Cinta', color: 'bg-red-50 text-red-600', desc: 'Setiap bimbingan dilakukan dengan empati penuh.' },
                { icon: ShieldCheck, label: 'Lingkungan Aman', color: 'bg-emerald-50 text-emerald-600', desc: 'Fasilitas yang dirancang khusus untuk eksplorasi anak.' },
                { icon: Globe, label: 'Wawasan Global', color: 'bg-blue-50 text-blue-600', desc: 'Menyiapkan anak menjadi warga dunia yang cakap.' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-50 text-center animate-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                   <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center mb-6 ${item.color}`}>
                      <item.icon size={32} />
                   </div>
                   <h4 className="font-bold text-slate-800 mb-2">{item.label}</h4>
                   <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>

           {/* Story Section */}
           <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest">
                    <Target size={14} /> Visi & Misi Kami
                 </div>
                 <h2 className="text-4xl font-bold text-slate-900">Membentuk Karakter Mandiri, Kreatif, dan Berakhlak Mulia.</h2>
                 <p className="text-slate-500 leading-relaxed">
                   Didirikan pada tahun 2010, PAUD Cerdas lahir dari kegelisahan akan metode pengajaran konvensional yang seringkali memaksakan standar dewasa kepada dunia anak-anak. Kami memilih Montessori karena metodenya yang menghargai keunikan individu.
                 </p>
                 <div className="space-y-4">
                    {[
                      'Menyediakan material belajar yang menstimulasi panca indera.',
                      'Menciptakan suasana kelas yang tertib namun penuh kebebasan eksplorasi.',
                      'Menjalin kemitraan erat dengan orang tua untuk tumbuh kembang anak.',
                      'Terus berinovasi dengan integrasi teknologi dalam observasi anak.'
                    ].map((misi, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm">{i+1}</div>
                         <p className="text-sm font-bold text-slate-700">{misi}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="relative">
                 <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-full opacity-10 animate-pulse"></div>
                 <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&h=800&fit=crop" className="w-full h-[600px] object-cover rounded-[4rem] shadow-2xl relative z-10" alt="Guru PAUD Cerdas" />
                 <div className="absolute -bottom-6 -right-6 p-10 bg-white rounded-[3rem] shadow-2xl border border-slate-100 z-20 max-w-xs animate-bounce-slow">
                    <Quote className="text-blue-600 mb-4" size={32} />
                    <p className="text-sm text-slate-700 font-bold italic leading-relaxed">"Kepuasan terbesar kami adalah melihat binar mata anak-anak saat mereka berhasil melakukan sesuatu untuk pertama kalinya."</p>
                    <p className="mt-4 text-xs font-black uppercase text-blue-600">— Ibu Dewi Kartika, Kepala Sekolah</p>
                 </div>
              </div>
           </div>

           {/* Achievements */}
           <div className="bg-slate-50 rounded-[4rem] p-16 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-12">Pencapaian & Sertifikasi</h2>
              <div className="flex flex-wrap justify-center gap-12">
                 {[
                   { icon: Award, label: 'Sekolah Inovatif 2022' },
                   { icon: CheckCircle2, label: 'Akreditasi A Nasional' },
                   { icon: Smile, label: '1000+ Alumni Sukses' },
                   { icon: Users, label: 'Community Choice Award' },
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-white rounded-[2rem] shadow-lg flex items-center justify-center text-blue-600">
                         <item.icon size={32} />
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Call to Action */}
           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[4rem] p-16 text-white text-center shadow-2xl shadow-blue-200">
              <h2 className="text-4xl font-bold mb-6">Bergabunglah Menjadi Bagian Dari Keluarga Besar Kami.</h2>
              <p className="text-blue-100 mb-10 max-w-2xl mx-auto font-medium">Kami selalu membuka pintu untuk diskusi dan kunjungan sekolah. Mari berkolaborasi demi masa depan buah hati Anda.</p>
              <div className="flex flex-wrap justify-center gap-4">
                 <button className="px-10 py-5 bg-white text-blue-700 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">Hubungi Kami via WhatsApp</button>
                 <button onClick={onBack} className="px-10 py-5 bg-blue-500/20 backdrop-blur-md border border-white/20 text-white rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">Daftar Kunjungan</button>
              </div>
           </div>
        </div>
      </main>

      {/* FOOTER COPIED FOR CONSISTENCY */}
      <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 px-6 lg:px-20 rounded-t-[4rem] mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">P</div>
              <span className="text-xl font-bold text-white tracking-tight">{APP_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Membimbing perkembangan alami anak melalui lingkungan yang disiapkan dengan cinta.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-xl hover:bg-blue-600 text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-xl hover:bg-blue-600 text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-xl hover:bg-blue-600 text-white transition-all"><Youtube size={18} /></a>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Informasi</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={onBack} className="hover:text-blue-500 transition-all">Beranda</button></li>
              <li><a href="#" className="hover:text-blue-500 transition-all">Kurikulum</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-all">Tentang Kami</a></li>
            </ul>
          </div>
          <div className="space-y-6 lg:col-span-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Kontak & Alamat</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-blue-500 shrink-0" size={20} />
                <p className="text-sm">Jl. Pendidikan Montessori No. 45, Jakarta Selatan.</p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <Phone className="text-blue-500" size={18} />
                  <p className="text-sm">+62 812 3456 7890</p>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="text-blue-500" size={18} />
                  <p className="text-sm">info@paudcerdas.sch.id</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-xs font-medium text-slate-500">
            © 2024 PAUD Cerdas Montessori. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default PublicAboutView;
