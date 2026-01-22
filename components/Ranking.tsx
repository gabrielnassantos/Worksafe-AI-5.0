
import React, { useMemo, useState, useEffect } from 'react';
import { User, Sector } from '../types';

interface RankingProps {
  users: any[];
  currentUser: User;
}

const SECTOR_METADATA: Record<Sector, { icon: string; color: string; bg: string }> = {
  'Faturamento': { icon: '🧾', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  'Contas a Receber': { icon: '💰', color: 'text-amber-500', bg: 'bg-amber-50' },
  'SSMA': { icon: '🛡️', color: 'text-blue-500', bg: 'bg-blue-50' },
  'Administrativo/Comercial': { icon: '🏢', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  'Financeiro': { icon: '📊', color: 'text-violet-500', bg: 'bg-violet-50' },
};

const getRankDetails = (score: number) => {
  if (score >= 5000) return { title: 'Diamante', color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200', icon: '💎' };
  if (score >= 3000) return { title: 'Platina', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: '🛡️' };
  if (score >= 1500) return { title: 'Ouro', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', icon: '🥇' };
  if (score >= 500) return { title: 'Prata', color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200', icon: '🥈' };
  return { title: 'Bronze', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: '🥉' };
};

const Ranking: React.FC<RankingProps> = ({ users, currentUser }) => {
  const [viewType, setViewType] = useState<'individual' | 'sector'>('individual');
  const [filter, setFilter] = useState<'weekly' | 'monthly' | 'all'>('all');
  const [previousRanks, setPreviousRanks] = useState<Record<string, number>>({});

  const individualSorted = useMemo(() => {
    return [...users].map(u => ({
      ...u,
      displayScore: filter === 'weekly' ? Math.floor(u.score * 0.15) : filter === 'monthly' ? Math.floor(u.score * 0.45) : u.score
    })).sort((a, b) => b.displayScore - a.displayScore);
  }, [users, filter]);

  // Efeito para persistir e comparar ranks
  useEffect(() => {
    const saved = localStorage.getItem('worksafe_rank_history');
    if (saved) {
      setPreviousRanks(JSON.parse(saved));
    }
    
    // Salva o rank atual para a próxima visualização
    const currentRanks: Record<string, number> = {};
    individualSorted.forEach((u, idx) => {
      currentRanks[u.id] = idx + 1;
    });
    localStorage.setItem('worksafe_rank_history', JSON.stringify(currentRanks));
  }, [individualSorted]);

  const sectorSorted = useMemo(() => {
    const scores: Record<string, number> = {};
    const memberCount: Record<string, number> = {};
    Object.keys(SECTOR_METADATA).forEach(s => { scores[s] = 0; memberCount[s] = 0; });

    users.forEach(u => {
      if (u.sector) {
        const points = filter === 'weekly' ? Math.floor(u.score * 0.15) : filter === 'monthly' ? Math.floor(u.score * 0.45) : u.score;
        scores[u.sector] += points;
        memberCount[u.sector] += 1;
      }
    });

    return Object.entries(scores)
      .map(([name, total]) => ({ name: name as Sector, score: total, members: memberCount[name] }))
      .sort((a, b) => b.score - a.score);
  }, [users, filter]);

  const currentUserRank = individualSorted.findIndex(u => u.id === currentUser.id) + 1;
  const maxSectorScore = Math.max(...sectorSorted.map(s => s.score), 1);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-view-fade-in pb-12 px-2">
      
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[24px] shadow-inner border border-slate-200 dark:border-slate-700">
        <button onClick={() => setViewType('individual')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all ${viewType === 'individual' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>👤 Rank Individual</button>
        <button onClick={() => setViewType('sector')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all ${viewType === 'sector' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>🚀 Rank Setorial</button>
      </div>

      {viewType === 'individual' ? (
        <>
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-all">
            <div className="absolute top-0 right-0 p-12 opacity-10 scale-[3]">{getRankDetails(currentUser.score).icon}</div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[24px] border-4 border-[#FFB800] bg-white flex items-center justify-center text-3xl overflow-hidden shadow-2xl">
                   {currentUser.avatar ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" /> : "👤"}
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase">{currentUser.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${getRankDetails(currentUser.score).bg} ${getRankDetails(currentUser.score).color}`}>LIGA {getRankDetails(currentUser.score).title}</span>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">#{currentUserRank} GLOBAL</span>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Score {filter === 'all' ? 'Total' : 'Período'}</p>
                 <p className="text-4xl font-black text-[#FFB800] tracking-tighter">{individualSorted.find(u => u.id === currentUser.id)?.displayScore.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Quadro de Liderança</h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {individualSorted.map((user, index) => {
                const rank = index + 1;
                const prevRank = previousRanks[user.id];
                const isMe = user.id === currentUser.id;
                
                let movement = null;
                if (prevRank) {
                  if (rank < prevRank) movement = <span className="text-emerald-500 text-xs font-black animate-bounce">▲</span>;
                  else if (rank > prevRank) movement = <span className="text-red-500 text-xs font-black animate-pulse">▼</span>;
                }

                return (
                  <div key={user.id} className={`flex items-center gap-5 p-6 transition-all ${isMe ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                    <div className="w-8 flex flex-col items-center">
                      <span className="font-black text-slate-300 dark:text-slate-700 text-sm">#{rank}</span>
                      {movement}
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                       {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-xl opacity-20">👥</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`font-black uppercase text-sm tracking-tight ${isMe ? 'text-blue-600' : 'text-slate-800 dark:text-slate-200'}`}>{user.name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase">{user.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{user.displayScore.toLocaleString()}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase">PTS</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {sectorSorted.map((sector, index) => {
            const meta = SECTOR_METADATA[sector.name as Sector];
            const percentage = (sector.score / maxSectorScore) * 100;
            const isUserSector = currentUser.sector === sector.name;

            return (
              <div key={sector.name} className={`bg-white dark:bg-slate-900 rounded-[32px] p-6 border transition-all ${isUserSector ? 'border-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/10' : 'border-slate-100 dark:border-slate-800'}`}>
                <div className="flex items-center gap-5 mb-4">
                   <div className="text-xl font-black text-slate-200 dark:text-slate-700 w-6 text-center">#{index + 1}</div>
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${meta.bg}`}>
                      {meta.icon}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-black text-slate-800 dark:text-slate-200 uppercase text-sm tracking-tight">{sector.name}</h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{sector.members} Membros</p>
                   </div>
                   <div className="text-right">
                      <p className={`text-xl font-black tracking-tighter ${meta.color}`}>{sector.score.toLocaleString()}</p>
                   </div>
                </div>
                <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%`, backgroundColor: 'currentColor' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Ranking;
