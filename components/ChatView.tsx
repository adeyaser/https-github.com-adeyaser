
import React, { useState } from 'react';
import { Search, Send, Phone, MoreVertical, Paperclip, Smile, User, ChevronLeft } from 'lucide-react';
import { MOCK_CHATS, MOCK_USER } from '../constants';

const ChatView: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number>(MOCK_CHATS[0].id);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Record<number, any[]>>({
    1: [
      { id: 1, sender: 'parent', text: 'Selamat pagi Bu Guru, bagaimana perkembangan Alya di sekolah hari ini?', time: '09:00' },
      { id: 2, sender: 'teacher', text: 'Selamat pagi Pak Andi. Alya luar biasa hari ini! Dia sangat aktif di area Practical Life.', time: '09:05' }
    ]
  });

  const activeChat = MOCK_CHATS.find(c => c.id === selectedChatId) || MOCK_CHATS[0];

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'teacher',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg]
    }));
    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-80 lg:w-96 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden transition-all ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 border-b border-slate-50 bg-gradient-to-br from-white to-slate-50">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Pesan Masuk</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Cari orang tua / siswa..." 
              className="w-full bg-white border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {MOCK_CHATS.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChatId(chat.id)}
              className={`p-4 flex gap-4 cursor-pointer rounded-[2rem] transition-all relative group ${selectedChatId === chat.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'hover:bg-slate-50'}`}
            >
              <div className="relative shrink-0">
                <img src={chat.photo} className="w-12 h-12 rounded-2xl object-cover shadow-sm ring-2 ring-white" alt="" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-4 border-white rounded-full ${selectedChatId === chat.id ? 'bg-white' : 'bg-green-500'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold truncate ${selectedChatId === chat.id ? 'text-white' : 'text-slate-800'}`}>Bpk. {chat.parent}</h4>
                  <span className={`text-[10px] font-bold ${selectedChatId === chat.id ? 'text-blue-100' : 'text-slate-400'}`}>{chat.time}</span>
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${selectedChatId === chat.id ? 'text-blue-100' : 'text-blue-500'}`}>Anak: {chat.student}</p>
                <p className={`text-xs truncate ${selectedChatId === chat.id ? 'text-blue-50' : 'text-slate-400'}`}>{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && selectedChatId !== chat.id && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-black">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden transition-all ${!selectedChatId ? 'hidden' : 'flex'}`}>
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <button onClick={() => setSelectedChatId(0)} className="md:hidden p-2 text-slate-400"><ChevronLeft /></button>
             <img src={activeChat.photo} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100" alt="" />
             <div>
               <h4 className="text-sm font-bold text-slate-800">Bpk. {activeChat.parent}</h4>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Wali Murid • {activeChat.student}</p>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><Phone size={20} /></button>
            <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
          <div className="flex justify-center mb-8">
            <span className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border border-slate-100 shadow-sm">Hari Ini</span>
          </div>
          
          {(chatHistory[selectedChatId] || []).map((msg) => (
            <div key={msg.id} className={`flex flex-col gap-2 ${msg.sender === 'teacher' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[75%] p-5 rounded-[2rem] shadow-sm text-sm font-medium leading-relaxed ${msg.sender === 'teacher' ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                {msg.text}
                <p className={`text-[10px] mt-2 font-bold ${msg.sender === 'teacher' ? 'text-blue-100 text-right' : 'text-slate-400 text-left'}`}>{msg.time} {msg.sender === 'teacher' && '• Dibaca'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-50">
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <button className="p-3 text-slate-400 hover:text-blue-600 transition-all"><Paperclip size={22} /></button>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tulis pesan untuk orang tua..." 
              className="flex-1 bg-transparent border-none py-3 px-2 text-sm font-bold text-slate-700 focus:ring-0"
            />
            <button className="p-3 text-slate-300 hover:text-amber-500 transition-all"><Smile size={22} /></button>
            <button 
              onClick={handleSend}
              className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-90"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
