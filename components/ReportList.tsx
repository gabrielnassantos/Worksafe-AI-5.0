
import React, { useState } from 'react';
import { Incident } from '../types';

interface ReportListProps {
  incidents: Incident[];
}

const ReportList: React.FC<ReportListProps> = ({ incidents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = incidents.filter(i => {
    const matchesSearch = i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         i.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || i.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (s: Incident['severity']) => {
    switch (s) {
      case 'critical': return 'bg-red-50 text-red-600 border-red-100';
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'low': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const translateStatus = (s: string) => {
    switch(s) {
      case 'open': return 'Aberto';
      case 'investigating': return 'Em Análise';
      case 'resolved': return 'Resolvido';
      default: return s;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative group">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Buscar por descrição ou local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-[24px] bg-white border border-slate-100 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 shadow-sm"
          />
        </div>

        <select 
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-6 py-4 rounded-[24px] bg-white border border-slate-100 font-bold text-slate-600 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="all">Todas Gravidades</option>
          <option value="low">Baixo</option>
          <option value="medium">Médio</option>
          <option value="high">Alto</option>
          <option value="critical">Crítico</option>
        </select>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-6 py-4 rounded-[24px] bg-white border border-slate-100 font-bold text-slate-600 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="all">Todos Status</option>
          <option value="open">Aberto</option>
          <option value="investigating">Em Análise</option>
          <option value="resolved">Resolvido</option>
        </select>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incidente</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Gravidade</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? filtered.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {report.description}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-tighter">
                        {report.location}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-[10px] uppercase font-black px-3 py-1.5 rounded-full border ${getSeverityColor(report.severity)} tracking-widest`}>
                      {report.severity === 'low' ? 'Baixo' : report.severity === 'medium' ? 'Médio' : report.severity === 'high' ? 'Alto' : 'Crítico'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                     <div className="flex items-center justify-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${report.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{translateStatus(report.status)}</span>
                     </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-400 text-right uppercase">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                     Nenhum registro corresponde aos filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportList;
