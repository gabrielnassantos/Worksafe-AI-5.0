
import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
  score: number;
  isAdmin?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate, score, isAdmin }) => {
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> 
    },
    { 
      id: 'checklists', 
      label: 'Missões', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> 
    },
    { 
      id: 'quizzes', 
      label: 'Quizzes', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> 
    }
  ];

  if (isAdmin) {
    navItems.push({
      id: 'admin-dashboard',
      label: 'Gestão',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    });
  }

  navItems.push(
    { 
      id: 'ranking', 
      label: 'Ranking', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> 
    },
    { 
      id: 'settings', 
      label: 'Perfil', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> 
    }
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-1 py-3 flex justify-between items-center z-[60] lg:hidden shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 active:scale-90 flex-1 ${
            activeView === item.id ? 'text-[#4A86E8] scale-105' : 'text-slate-400 dark:text-slate-600'
          }`}
        >
          <div className="p-1 rounded-xl">
            {item.icon}
          </div>
          <span className="text-[8px] font-black uppercase tracking-tighter leading-none">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
