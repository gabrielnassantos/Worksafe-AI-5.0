
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (updatedData: Partial<User>) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUser, darkMode, toggleDarkMode }) => {
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 128;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          onUpdateUser({ avatar: dataUrl });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoutAction = () => {
    if (!confirmLogout) {
      setConfirmLogout(true);
      // Reseta a confirmação após 3 segundos se não clicar de novo
      setTimeout(() => setConfirmLogout(false), 3000);
    } else {
      onLogout();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-view-fade-in pb-24 px-2">
      {/* Card Principal de Perfil */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="h-32 bg-gradient-to-r from-[#4A86E8] to-blue-400 relative">
           <div className="absolute -bottom-12 left-8 group">
              <div className="w-28 h-28 rounded-[36px] bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-2xl flex items-center justify-center text-4xl overflow-hidden relative ring-4 ring-blue-50/50 dark:ring-blue-900/20">
                 {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover object-center aspect-square transition-transform duration-700 group-hover:scale-110" 
                    />
                 ) : (
                    <span className="opacity-20 text-slate-400">👤</span>
                 )}
                 
                 <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
                    <svg className="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[8px] text-white font-black uppercase tracking-widest">Trocar Foto</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                 </label>
              </div>
           </div>
        </div>
        
        <div className="pt-16 px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase leading-none">{user.name}</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">{user.email}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-[9px] font-black px-4 py-2 rounded-full border uppercase tracking-widest ${
                user.role === 'admin' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800'
              }`}>
                 {user.role === 'admin' ? 'Administrador' : 'Colaborador'}
              </span>
              <span className="text-[9px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-tighter mt-2">{user.sector}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Score Total</p>
                <p className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">{user.score.toLocaleString()}</p>
             </div>
             <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Conquistas</p>
                <p className="text-4xl font-black text-slate-800 dark:text-slate-200 tracking-tighter">{user.badges.length}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Preferências de Visão (Dark Mode) */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 p-8 transition-colors">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Acesso & Visão</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[24px] transition-all border border-slate-100 dark:border-slate-800 cursor-pointer" onClick={toggleDarkMode}>
             <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${darkMode ? 'bg-indigo-600 text-white' : 'bg-amber-100 text-amber-600'}`}>
                   {darkMode ? (
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                   ) : (
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                   )}
                </div>
                <div>
                   <span className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest block">Modo Escuro</span>
                   <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Reduz fadiga ocular</span>
                </div>
             </div>
             <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 shadow-inner ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${darkMode ? 'left-7' : 'left-1'}`} />
             </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 p-8 transition-colors">
           <button 
            type="button"
            onClick={handleLogoutAction}
            className={`w-full font-black py-5 rounded-[24px] transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95 duration-300 ${
              confirmLogout ? 'bg-amber-500 text-white animate-pulse' : 'bg-red-600 text-white'
            }`}
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              {confirmLogout ? 'Clique de novo para sair' : 'Sair da Conta'}
           </button>
           <p className="text-center text-slate-300 dark:text-slate-700 text-[8px] font-black uppercase tracking-[0.3em] mt-6">WorkSafe Secure ID v2.9.0</p>
      </div>
    </div>
  );
};

export default Profile;
