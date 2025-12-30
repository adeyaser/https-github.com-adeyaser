
import React from 'react';
import { Search, Send, Phone, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { MOCK_CHATS } from '../constants';

const ChatView: React.FC = () => {
  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in duration-500">
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-80 lg:w-96 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Pesan Masuk</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari orang tua..." 
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {MOCK_CHATS.map((chat) => (
            <div key={chat.id} className="p-4 flex gap-4 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50 relative group">
              <div className="relative">
                <img src={chat.photo} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-slate-800 truncate">Bpk. {chat.parent}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mb-1">Anak: {chat.student}</p>
                <p className="text-xs text-slate-400 truncate">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="absolute right-4 bottom-4 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="hidden md:flex flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src={MOCK_CHATS[0].photo} className="w-10 h-10 rounded-xl object-cover" alt="" />
             <div>
               <h4 className="text-sm font-bold text-slate-800">Bpk. {MOCK_CHATS[0].parent}</h4>
               <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><Phone size={18} /></button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          <div className="flex flex-col gap-2">
            <div className="max-w-[70%] self-start bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700">
              Selamat pagi Bu Guru, bagaimana perkembangan Alya di sekolah hari ini? Apakah dia sudah mulai berani berinteraksi?
              <p className="text-[10px] text-slate-400 mt-2 text-right">09:00</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="max-w-[70%] bg-blue-600 p-4 rounded-2xl rounded-tr-none shadow-lg text-sm text-white">
              Selamat pagi Pak Andi. Alya luar biasa hari ini! Dia sangat aktif di area Practical Life dan sudah berani menyapa teman sebangkunya.
              <p className="text-[10px] text-blue-200 mt-2 text-right">09:05 • Dibaca</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-50">
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Paperclip size={20} /></button>
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Ketik pesan..." 
                className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-500 transition-all">
                <Smile size={20} />
              </button>
            </div>
            <button className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
