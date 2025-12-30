
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, X, Clock, HelpCircle } from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';

const AttendanceView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Presensi Kelas</h1>
          <p className="text-slate-500">Catat kehadiran harian siswa Kelas A.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-4">
            <CalendarIcon size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-slate-700">
              {currentDate.getDate()} {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>
          <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-500">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Hadir', value: 10, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Izin', value: 1, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Sakit', value: 1, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Alpa', value: 0, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl ${stat.bg} flex items-center justify-between`}>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Siswa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Waktu Masuk</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.student_id} className="hover:bg-slate-50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={student.photo} className="w-10 h-10 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{student.full_name}</p>
                        <p className="text-xs text-slate-500">{student.nis}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 rounded-xl bg-green-50 text-green-600 ring-2 ring-green-100 hover:scale-110 transition-all shadow-sm">
                        <Check size={18} />
                      </button>
                      <button className="p-2 rounded-xl text-slate-300 hover:text-blue-600 transition-all">
                        <HelpCircle size={18} />
                      </button>
                      <button className="p-2 rounded-xl text-slate-300 hover:text-amber-600 transition-all">
                        <Clock size={18} />
                      </button>
                      <button className="p-2 rounded-xl text-slate-300 hover:text-red-600 transition-all">
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-700">07:45 WIB</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-bold text-blue-600 hover:underline">Detail Log</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button className="px-6 py-2 bg-slate-200 text-slate-600 rounded-xl font-bold text-sm">Batal</button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100">Simpan Presensi</button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;
