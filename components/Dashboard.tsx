
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Incident } from '../types';

interface DashboardProps {
  incidents: Incident[];
}

const Dashboard: React.FC<DashboardProps> = ({ incidents }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '1y'>('7d');

  const stats = [
    { label: 'Riscos Ativos', value: incidents.filter(i => i.status !== 'resolved').length, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    { label: 'Problemas Críticos', value: incidents.filter(i => i.severity === 'critical').length, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/20' },
    { label: 'Dias Sem Acidentes', value: '124', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Auditorias Pendentes', value: '3', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  ];

  const chartData = timeRange === '7d' 
    ? [ { name: 'Seg', count: 4 }, { name: 'Ter', count: 7 }, { name: 'Qua', count: 2 }, { name: 'Qui', count: 5 }, { name: 'Sex', count: 8 }, { name: 'Sáb', count: 1 }, { name: 'Dom', count: 0 } ]
    : timeRange === '30d'
    ? [ { name: 'Sem 1', count: 12 }, { name: 'Sem 2', count: 18 }, { name: 'Sem 3', count: 8 }, { name: 'Sem 4', count: 15 } ]
    : [ { name: 'Jan', count: 40 }, { name: 'Fev', count: 35 }, { name: 'Mar', count: 50 }, { name: 'Abr', count: 20 } ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2 mb-2">
        {(['7d', '30d', '1y'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              timeRange === range ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800'
            }`}
          >
            {range === '7d' ? '7 Dias' : range === '30d' ? '30 Dias' : '1 Ano'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-6">Incidentes por Período</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: '#1e293b', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4A86E8' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black mb-6 text-slate-800 dark:text-slate-100 uppercase tracking-tight">Feed Recente</h3>
          <div className="space-y-4">
            {incidents.length > 0 ? incidents.slice(0, 4).map((incident) => (
              <div key={incident.id} className="flex gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  incident.severity === 'critical' ? 'bg-red-500' : 
                  incident.severity === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{incident.description}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{incident.location} • {new Date(incident.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center">
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Nenhum registro</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-4 text-xs font-black uppercase tracking-widest text-[#4A86E8] hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-2xl transition-colors border-2 border-dashed border-blue-100 dark:border-blue-900/30">
            Ver Todos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
