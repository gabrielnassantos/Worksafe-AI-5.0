
import React, { useState } from 'react';
import { User } from '../types';

interface AdminDashboardProps {
  users: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [showAutoRefreshGuide, setShowAutoRefreshGuide] = useState(false);
  
  const exportToExcel = () => {
    const headers = ["ID", "Nome", "E-mail", "Setor", "Papel", "Pontuacao", "Conquistas"];
    const rows = users.map(user => [
      user.id,
      user.name,
      user.email,
      user.sector,
      user.role === 'admin' ? 'Administrador' : 'Colaborador',
      user.score,
      user.badges.join(' | ')
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(";"))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    // Nome fixo para facilitar o vínculo com o Excel
    link.setAttribute("download", `BASE_WORKSAFE_SYNC.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header de Ação Principal */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">Central de Relatórios</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">
              Gerencie a base de dados e configure a sincronização automática com o Microsoft Excel.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowAutoRefreshGuide(!showAutoRefreshGuide)}
              className="px-8 py-5 rounded-[24px] border-2 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all active:scale-95"
            >
              {showAutoRefreshGuide ? 'Fechar Ajustes' : 'Configurar 15 Minutos'}
            </button>
            <button 
              onClick={exportToExcel}
              className="bg-[#4A86E8] hover:bg-blue-700 text-white font-black py-5 px-12 rounded-[28px] shadow-xl shadow-blue-100 dark:shadow-none transition-all flex items-center justify-center gap-4 uppercase text-xs tracking-[0.2em] active:scale-95 group"
            >
              <svg className="w-6 h-6 group-hover:bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar CSV para Sincronia
            </button>
          </div>
        </div>
      </div>

      {/* Guia de Atualização Automática (15 min) */}
      {showAutoRefreshGuide && (
        <div className="bg-indigo-50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-900/30 rounded-[40px] p-8 md:p-12 animate-in zoom-in duration-300">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl">⏳</div>
            <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-tighter">Como atualizar o Excel a cada 15 min</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full flex items-center justify-center font-black text-xs">1</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Salve o arquivo exportado (<strong>BASE_WORKSAFE_SYNC.csv</strong>) em uma pasta fixa no seu computador (ex: Documentos/Seguranca).</p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full flex items-center justify-center font-black text-xs">2</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">No Excel, vá em <strong>Dados > Consultas e Conexões</strong>.</p>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full flex items-center justify-center font-black text-xs">3</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Clique com o botão direito na consulta criada e selecione <strong>Propriedades</strong>.</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
              <h4 className="font-black text-xs text-indigo-600 uppercase tracking-widest mb-4">Ajuste de Tempo</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-indigo-500 rounded flex items-center justify-center text-[10px] text-indigo-500">✔</div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Atualizar a cada: [ 15 ] minutos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-indigo-500 rounded flex items-center justify-center text-[10px] text-indigo-500">✔</div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Atualizar dados ao abrir o arquivo</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
                  <strong>Importante:</strong> Sempre que baixar um novo relatório com o mesmo nome na mesma pasta, o Excel lerá os dados novos automaticamente no próximo ciclo de 15 min.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Visualização */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Monitoramento de Base</h3>
          <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full uppercase border border-emerald-100 dark:border-emerald-800/30">
            {users.length} Colaboradores Ativos
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30 dark:bg-slate-800/10">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Colaborador</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Departamento</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Score de Segurança</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors">{user.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      {user.sector}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 tracking-tighter">{user.score.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
