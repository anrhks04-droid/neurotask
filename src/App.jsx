import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Trash2, CheckCircle, Circle, Calendar, Download, LogOut, Lock, X } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {

    try {
      return localStorage.getItem('neuropad_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [thoughts, setThoughts] = useState(() => {
    try {
      const saved = localStorage.getItem('neuropad_notes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse notes:", e);
      return [];
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('neuropad_notes', JSON.stringify(thoughts));
    } catch (e) {
      console.error("Failed to save notes:", e);
    }
  }, [thoughts]);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    const correctPin = (import.meta.env && import.meta.env.VITE_ACCESS_PIN) || '1111';
    if (pinInput === correctPin) {
      setIsAuthenticated(true);
      localStorage.setItem('neuropad_auth', 'true');
    } else {
      setPinInput('');
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddNote = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() && !selectedImage) return;

    const newNote = {
      id: Date.now().toString(),
      text: inputValue,
      image: selectedImage,
      date: new Date().toISOString(),
      isCompleted: false,
    };

    setThoughts(prev => [newNote, ...prev]);
    setInputValue('');
    setSelectedImage(null);
  };

  const toggleComplete = (id) => {
    setThoughts(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteNote = (id) => {
    if (window.confirm("메모를 삭제하시겠습니까?")) {
      setThoughts(prev => prev.filter(t => t.id !== id));
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(thoughts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neuropad_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white border border-gray-100 rounded-[40px] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.05)] text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Lock className="text-blue-500" size={28} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">NeuroPad</h1>
          <p className="text-gray-400 text-sm mb-10">개인용 메모장 입구입니다.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="••••"
              maxLength={4}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all">입장</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20 selection:bg-blue-100">
      <div className="max-w-3xl mx-auto px-6">
        <header className="py-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-1">NeuroPad</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Minimalist Image Diary</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportData} title="백업 다운로드" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-all shadow-sm">
              <Download size={20} />
            </button>
            <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem('neuropad_auth'); }} title="로그아웃" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <form onSubmit={handleAddNote} className="bg-white border border-gray-100 rounded-[32px] p-6 mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all focus-within:border-blue-200">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="기록하고 싶은 생각을 적어보세요..."
            className="w-full bg-transparent border-none text-xl placeholder-gray-200 resize-none min-h-[120px] focus:ring-0 mb-4"
          />
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-4">
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${selectedImage ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                <ImageIcon size={18} />
                <span className="text-sm font-bold">{selectedImage ? '이미지 변경' : '이미지 추가'}</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              
              {selectedImage && (
                <div className="relative group">
                  <img src={selectedImage} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                  <button type="button" onClick={() => setSelectedImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all">
                    <X size={10} />
                  </button>
                </div>
              )}
            </div>
            
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 active:scale-95">
              기록하기
            </button>
          </div>
        </form>

        <div className="space-y-8">
          {thoughts.length > 0 ? thoughts.map((note) => (
            <div key={note.id} className="group relative flex gap-8 items-start">
              <div className="flex flex-col items-center gap-2 pt-2">
                <button 
                  onClick={() => toggleComplete(note.id)}
                  className={`p-1 rounded-full transition-all ${note.isCompleted ? 'text-blue-500' : 'text-gray-200 hover:text-gray-400'}`}
                >
                  {note.isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
                </button>
                <div className="w-[2px] h-full min-h-[40px] bg-gray-50 group-last:hidden"></div>
              </div>

              <div className={`flex-1 bg-white border border-gray-100 rounded-[24px] p-6 flex gap-6 shadow-sm ${note.isCompleted ? 'opacity-50' : ''}`}>
                {note.image && (
                  <div className="w-1/3 min-w-[100px] max-w-[150px]">
                    <img src={note.image} alt="memo" className="w-full aspect-square object-cover rounded-2xl border border-gray-50" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-gray-300 font-bold uppercase tracking-widest mb-2">
                    <Calendar size={10} />
                    {new Date(note.date).toLocaleDateString()}
                  </div>
                  <p className={`text-lg text-gray-800 leading-relaxed whitespace-pre-wrap ${note.isCompleted ? 'line-through' : ''}`}>
                    {note.text}
                  </p>
                </div>
                
                <button 
                  onClick={() => deleteNote(note.id)} 
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all absolute top-6 right-6"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
              <p className="text-gray-300 font-bold">아직 기록된 메모가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

