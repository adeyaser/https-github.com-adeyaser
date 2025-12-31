
import React from 'react';
import { Users, School, Star, Activity, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_STUDENTS, LEARNING_AREAS } from '../constants';

const data = [
  { name: 'Sen', score: 65 },
  { name: 'Sel', score: 78 },
  { name: 'Rab', score: 82 },
  { name: 'Kam', score: 75 },
  { name: 'Jum', score: 88 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
          {trend} <ArrowUpRight size={14} className="ml-1" />
        </span>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  </div>
);

interface DashboardViewProps {
  onNavigate?: (path: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Halo, Ibu Dewi! 👋</h1>
          <p className="text-slate-500">Berikut adalah ringkasan perkembangan Kelas A hari ini.</p>
        </div>
        <button 
          onClick={() => onNavigate?.('/assessment')}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Activity size={20} />
          Catat Observasi Baru
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Siswa" value="12" icon={Users} color="bg-blue-600" trend="+2 bln ini" />
        <StatCard title="Kehadiran Hari Ini" value="95%" icon={School} color="bg-emerald-600" />
        <StatCard title="Rata-rata Quiz" value="84" icon={Star} color="bg-amber-600" trend="+4 pts" />
        <StatCard title="Kegiatan Aktif" value="6" icon={Activity} color="bg-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800">Tren Perkembangan Kognitif</h2>
            <select className="bg-slate-50 border-none text-xs font-bold px-3 py-2 rounded-xl focus:ring-0">
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Area Montessori</h2>
          <div className="space-y-4">
            {LEARNING_AREAS.map((area) => (
              <div key={area.area_id} className="group cursor-pointer" onClick={() => onNavigate?.('/learning')}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">{area.area_name}</span>
                  <span className="text-xs font-bold text-slate-400">85%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 group-hover:opacity-80" 
                    style={{ width: '85%', backgroundColor: area.color_code }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">Daftar Siswa Aktif</h2>
          <button onClick={() => onNavigate?.('/students')} className="text-blue-600 text-sm font-bold hover:underline">Lihat Semua</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_STUDENTS.map((student) => (
            <div 
              key={student.student_id} 
              onClick={() => onNavigate?.('/students')}
              className="flex items-center gap-4 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <img src={student.photo} className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt={student.full_name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{student.full_name}</p>
                <p className="text-xs text-slate-500 font-medium">NIS: {student.nis}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
