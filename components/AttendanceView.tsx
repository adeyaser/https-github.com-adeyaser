
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, X, Clock, HelpCircle, Save, AlertCircle } from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';

type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' | 'Belum Presensi';

const AttendanceView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<Record<number, AttendanceStatus>>(
    Object.fromEntries(MOCK_STUDENTS.map(s => [s.student_id, 'Belum Presensi']))
  );
  const [isSaving, setIsSaving] = useState(false);

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const setStatus = (studentId: number, status: AttendanceStatus) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const stats = {
    Hadir: Object.values(attendanceData).filter(s => s === 'Hadir').length,
    Izin: Object.values(attendanceData).filter(s => s === 'Izin').length,
    Sakit: Object.values(attendanceData).filter(s => s === 'Sakit').length,
    Alpa: Object.values(attendanceData).filter(s => s === 'Alpa').length,
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Data Presensi Berhasil Disimpan ke Database!');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Presensi Harian</h1>
          <p className="text-slate-500">Catat kehadiran siswa secara kolektif hari ini.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500"><ChevronLeft size={20} /></button>
          <div className="flex items-center gap-2 px-4">
            <CalendarIcon size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-slate-700">
              {currentDate.getDate()} {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>
          <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as const).map((label) => (
          <div key={label} className={`p-6 rounded-3xl border border-slate-50 flex items-center justify-between shadow-sm bg-white`}>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats[label as keyof typeof stats]}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${label === 'Hadir' ? 'bg-emerald-50 text-emerald-500' : label === 'Izin' ? 'bg-blue-50 text-blue-500' : label === 'Sakit' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'}`}>
               {label === 'Hadir' ? <Check size={20} /> : label === 'Izin' ? <HelpCircle size={20} /> : label === 'Sakit' ? <Clock size={20} /> : <X size={20} />}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Siswa</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Kehadiran</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu Input</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.student_id} className="hover:bg-slate-50/30 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={student.photo} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" alt="" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{student.full_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{student.nis}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-3">
                      {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => setStatus(student.student_id, status)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${attendanceData[student.student_id] === status ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px]">
                      <Clock size={14} /> 07:45 WIB
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2 text-amber-600 text-[10px] font-bold">
              <AlertCircle size={16} /> Pastikan data sudah sesuai sebelum menyimpan
           </div>
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
           >
             {isSaving ? 'Menyimpan...' : <><Save size={20} /> Simpan Presensi Harian</>}
           </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;
