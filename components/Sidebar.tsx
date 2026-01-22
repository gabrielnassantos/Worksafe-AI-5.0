
import React from 'react';
import { View, User } from '../types';

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  isAdmin?: boolean;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, onLogout, isAdmin, user }) => {
  const commonItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> 
    },
    { 
      id: 'quizzes', 
      label: 'Avaliações', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> 
    },
    { 
      id: 'legislation', 
      label: 'Legislação', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> 
    },
    { 
      id: 'ranking', 
      label: 'Ranking', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> 
    },
    { 
      id: 'checklists', 
      label: 'Checklists IA', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> 
    },
    { 
      id: 'settings', 
      label: 'Meu Perfil', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> 
    }
  ];

  const adminItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'admin-dashboard', 
      label: 'Relatórios', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> 
    },
  ];

  const renderItem = (item: any) => (
    <button
      key={item.id}
      onClick={() => onNavigate(item.id)}
      className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[20px] transition-all duration-300 group ${
        activeView === item.id 
          ? 'bg-[#4A86E8] text-white shadow-xl shadow-blue-100 dark:shadow-none' 
          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
      }`}
    >
      <span className={`transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
        {item.icon}
      </span>
      <span className="font-bold text-[11px] uppercase tracking-widest">{item.label}</span>
    </button>
  );

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex-shrink-0 hidden lg:flex flex-col border-r border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white mb-8 animate-fade-in">
          <div className="bg-[#FFB800] p-1.5 rounded-xl shadow-md border-2 border-black transform hover:rotate-6 transition-transform">
            <svg viewBox="0 0 100 100" className="w-8 h-8">
              <path d="M10,60 Q10,25 50,25 Q90,25 90,60 L90,65 Q90,72 82,72 L18,72 Q10,72 10,65 Z" fill="#FFB800" stroke="#000" strokeWidth="4" />
              <path d="M30,28 Q50,15 70,28" fill="none" stroke="#000" strokeWidth="4" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tighter uppercase">WorkSafe</span>
        </div>
        
        <nav className="space-y-1.5 animate-fade-in">
          {commonItems.map(renderItem)}
          
          {isAdmin && (
            <div className="pt-6 mt-4 border-t border-slate-50 dark:border-slate-800">
              <p className="px-5 mb-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Gestão</p>
              {adminItems.map(renderItem)}
            </div>
          )}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-[28px] border border-slate-100 dark:border-slate-700 flex items-center gap-3 group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 transition-all" onClick={() => onNavigate('settings')}>
           <div className="w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden bg-white dark:bg-slate-900 ring-2 ring-blue-50/50 dark:ring-blue-900/10">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover object-center aspect-square" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">👤</div>
              )}
           </div>
           <div className="overflow-hidden">
              <p className="font-black text-[10px] text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">{user.name}</p>
              <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{user.sector}</p>
           </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-3.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-[20px] transition-all duration-300 group active:scale-95"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="font-bold text-[11px] uppercase tracking-widest">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
