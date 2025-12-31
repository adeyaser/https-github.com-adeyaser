
import React, { useState } from 'react';
import { Wallet, Search, Filter, Download, CheckCircle, XCircle, Clock, Plus, Receipt, X, Save, User as UserIcon, Trash2, Loader2 } from 'lucide-react';
import { MOCK_FINANCE, MOCK_STUDENTS } from '../constants';

const FinanceView: React.FC = () => {
  const [finances, setFinances] = useState(MOCK_FINANCE);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const [formData, setFormData] = useState({
    student_id: MOCK_STUDENTS[0].student_id,
    month: 'Maret',
    amount: 500000,
    status: 'Unpaid' as 'Paid' | 'Unpaid',
    date: '-'
  });

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = "Nama,NIS,Bulan,Jumlah,Status,Tanggal Bayar\n";
      const rows = finances.map(f => `${f.name},202400${f.student_id},${f.month},${f.amount},${f.status},${f.date}`).join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `Laporan_Keuangan_PAUD_${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsExporting(false);
      alert('Laporan berhasil diekspor ke CSV!');
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = MOCK_STUDENTS.find(s => s.student_id === formData.student_id);
    const newInvoice = {
      id: Date.now(),
      name: student?.full_name || 'Siswa',
      ...formData,
      date: formData.status === 'Paid' ? new Date().toLocaleDateString('id-ID') : '-'
    };
    setFinances(prev => [newInvoice, ...prev]);
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Batalkan/Hapus invoice ini?')) {
      setFinances(prev => prev.filter(f => f.id !== id));
    }
  };

  const filteredFinances = finances.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Keuangan</h1>
          <p className="text-slate-500">Pantau pembayaran SPP dan biaya administrasi siswa.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm shadow-sm flex items-center gap-2 hover:bg-slate-50 disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {isExporting ? 'Mengekspor...' : 'Ekspor CSV'}
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={18} /> Invoice Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Pendapatan (Bulan Ini)</p>
          <p className="text-3xl font-black text-slate-800">Rp {(finances.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString('id-ID')}</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-xs">
            <CheckCircle size={14} /> Keuangan Terverifikasi
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Siswa Sudah Bayar</p>
          <p className="text-3xl font-black text-blue-600">{finances.filter(f => f.status === 'Paid').length} Siswa</p>
          <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${(finances.filter(f => f.status === 'Paid').length / finances.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tunggakan</p>
          <p className="text-3xl font-black text-red-500">Rp {(finances.filter(f => f.status === 'Unpaid').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString('id-ID')}</p>
          <div className="mt-4 flex items-center gap-2 text-red-500 font-bold text-xs">
            <Clock size={14} /> Perlu Tindak Lanjut
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama siswa atau NIS..."
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Siswa</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bulan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Bayar</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFinances.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">NIS: 202400{item.student_id}</p>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{item.month}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-800">Rp {item.amount.toLocaleString('id-ID')}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {item.status === 'Paid' ? 'LUNAS' : 'BELUM BAYAR'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{item.date}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => window.print()}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Receipt size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICE FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
                 <h2 className="text-xl font-bold flex items-center gap-3"><Receipt /> Buat Tagihan Baru</h2>
                 <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Pilih Siswa</label>
                    <div className="relative">
                       <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <select 
                        required 
                        value={formData.student_id}
                        onChange={e => setFormData({...formData, student_id: parseInt(e.target.value)})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-sm font-bold"
                       >
                         {MOCK_STUDENTS.map(s => <option key={s.student_id} value={s.student_id}>{s.full_name}</option>)}
                       </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Periode Bulan</label>
                       <select 
                        required 
                        value={formData.month}
                        onChange={e => setFormData({...formData, month: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold"
                       >
                         {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => <option key={m} value={m}>{m}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Jumlah Tagihan</label>
                       <input 
                        required 
                        type="number" 
                        value={formData.amount}
                        onChange={e => setFormData({...formData, amount: parseInt(e.target.value)})}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold" 
                       />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Status Pembayaran</label>
                    <div className="flex gap-2">
                       {(['Unpaid', 'Paid'] as const).map(s => (
                         <button 
                          key={s}
                          type="button" 
                          onClick={() => setFormData({...formData, status: s})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all ${formData.status === s ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                         >
                            {s === 'Paid' ? 'Langsung Lunas' : 'Belum Bayar'}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold">Batal</button>
                    <button type="submit" className="flex-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2">
                       <Save size={18} /> Buat Invoice
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;
