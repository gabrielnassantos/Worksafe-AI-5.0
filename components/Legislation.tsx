
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

interface NR {
  id: string;
  number: string;
  title: string;
  description: string;
  category: 'Gestão' | 'Saúde' | 'Construção' | 'Equipamentos' | 'Riscos' | 'Elétrica' | 'Químicos';
  status: 'Vigente' | 'Atualizada';
  link: string;
}

const NR_DATA: NR[] = [
  { 
    id: 'nr1', 
    number: 'NR 01', 
    title: 'Disposições Gerais e Gerenciamento de Riscos Ocupacionais', 
    category: 'Gestão', 
    status: 'Vigente', 
    description: 'Estabelece as diretrizes para o gerenciamento de riscos ocupacionais e as medidas de prevenção em segurança e saúde no trabalho.', 
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-01-atualizada-2024-i-1.pdf' 
  },
  { 
    id: 'nr5', 
    number: 'NR 05', 
    title: 'Comissão Interna de Prevenção de Acidentes - CIPA', 
    category: 'Gestão', 
    status: 'Atualizada', 
    description: 'Regulamenta a organização e o funcionamento da CIPA, visando à prevenção de acidentes e doenças decorrentes do trabalho.', 
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/NR05atualizada2023.pdf' 
  },
  { 
    id: 'nr6', 
    number: 'NR 06', 
    title: 'Equipamentos de Proteção Individual - EPI', 
    category: 'Equipamentos', 
    status: 'Vigente', 
    description: 'Define as obrigações de empregadores e empregados quanto ao uso, fornecimento e manutenção de EPIs.', 
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-06-atualizada-2025-ii.pdf' 
  },
  { 
    id: 'nr10', 
    number: 'NR 10', 
    title: 'Segurança em Instalações e Serviços em Eletricidade', 
    category: 'Elétrica', 
    status: 'Vigente', 
    description: 'Estabelece os requisitos e condições mínimas objetivando a implementação de medidas de controle e sistemas preventivos em eletricidade.', 
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/arquivos/normas-regulamentadoras/nr-10.pdf' 
  },
  { 
    id: 'nr12', 
    number: 'NR 12', 
    title: 'Segurança no Trabalho em Máquinas e Equipamentos', 
    category: 'Equipamentos', 
    status: 'Vigente', 
    description: 'Define referências técnicas, princípios fundamentais e medidas de proteção para garantir a saúde e a integridade física dos trabalhadores em máquinas.', 
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-12-atualizada-2025.pdf' 
  },
  { 
    id: 'nr17', 
    number: 'NR 17', 
    title: 'Ergonomia', 
    category: 'Saúde', 
    status: 'Vigente', 
    description: 'Estabelece parâmetros para permitir a adaptação das condições de trabalho às características psicofisiológicas dos trabalhadores.', 
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-17-atualizada-2023.pdf' 
  },
  { 
    id: 'nr18', 
    number: 'NR 18', 
    title: 'Segurança na Indústria da Construção', 
    category: 'Construção', 
    status: 'Atualizada', 
    description: 'Diretrizes de ordem administrativa, de planejamento e de organização, que visam à implementação de medidas de controle e sistemas preventivos na construção.', 
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-18-atualizada-2025-1.pdf' 
  },
  { 
    id: 'nr20', 
    number: 'NR 20', 
    title: 'Segurança com Inflamáveis e Combustíveis', 
    category: 'Químicos', 
    status: 'Vigente', 
    description: 'Extração, produção, armazenamento, transferência, manuseio e manipulação de inflamáveis e líquidos combustíveis.', 
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-20-atualizada-2025.pdf' 
  },
  { 
    id: 'nr35', 
    number: 'NR 35', 
    title: 'Trabalho em Altura', 
    category: 'Riscos', 
    status: 'Vigente', 
    description: 'Estabelece os requisitos mínimos e as medidas de proteção para o trabalho em altura, envolvendo o planejamento e a execução.', 
    link: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-35-atualizada-2025-1.pdf' 
  },
];

const Legislation: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ id: string, text: string } | null>(null);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('worksafe_nr_clicks');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('worksafe_nr_clicks', JSON.stringify(clickCounts));
  }, [clickCounts]);

  const trackClick = (nrId: string) => {
    setClickCounts(prev => ({
      ...prev,
      [nrId]: (prev[nrId] || 0) + 1
    }));
  };

  const categories = ['Todos', 'Gestão', 'Saúde', 'Equipamentos', 'Riscos', 'Elétrica', 'Construção', 'Químicos'];

  const handleAISummary = async (nr: NR) => {
    trackClick(nr.id); 
    setSummarizingId(nr.id);
    setSummary(null);
    
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Como um especialista em Segurança do Trabalho (Engenheiro de Segurança), faça um resumo didático em 4 tópicos sobre a ${nr.number} - ${nr.title}. Foque no que um colaborador precisa saber para sua proteção imediata. Seja direto e use linguagem simples.`
      });
      setSummary({ id: nr.id, text: response.text || "Não foi possível gerar o resumo." });
    } catch (e) {
      console.error(e);
      setSummary({ id: nr.id, text: "Erro ao conectar com o assistente Gemini. Verifique sua conexão." });
    } finally {
      setSummarizingId(null);
    }
  };

  const filteredNRs = useMemo(() => {
    return NR_DATA.filter(nr => {
      const matchesCategory = activeCategory === 'Todos' || nr.category === activeCategory;
      const matchesSearch = nr.number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            nr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            nr.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-24 px-2">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Biblioteca Digital NR</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-tight">Estude os PDFs oficiais das Normas Regulamentadoras</p>
          </div>
          <div className="w-full md:w-96 relative group">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text"
              placeholder="Pesquisar norma (ex: NR 10)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-[24px] bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-750 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 dark:text-slate-300 shadow-inner"
            />
          </div>
        </div>

        <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNRs.length > 0 ? filteredNRs.map((nr) => (
          <div key={nr.id} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col group relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-[20px] flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs shadow-sm border border-blue-100 dark:border-blue-800 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  {nr.number.split(' ')[1]}
                </div>
                <div>
                  <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">{nr.number}</span>
                  <h3 className="font-black text-slate-800 dark:text-slate-100 leading-tight uppercase tracking-tight pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{nr.title}</h3>
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-4 flex items-center gap-2">
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {clickCounts[nr.id] || 0} Visualizações
                </span>
              </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed mb-8 flex-1 relative z-10">
              {nr.description}
            </p>

            {summary?.id === nr.id && (
              <div className="mb-6 p-5 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-800 animate-in zoom-in duration-300 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest flex items-center gap-1">
                    <span className="text-sm">✨</span> Resumo Técnico IA
                  </p>
                  <button onClick={() => setSummary(null)} className="text-violet-300 dark:text-violet-700 hover:text-violet-600 dark:hover:text-violet-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
                <div className="text-[11px] font-bold text-violet-800 dark:text-violet-200 leading-relaxed whitespace-pre-wrap">
                  {summary.text}
                </div>
              </div>
            )}

            <div className="flex gap-3 relative z-10 mt-auto">
              <a 
                href={nr.link} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackClick(nr.id)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all text-center border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 group/btn"
              >
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Abrir PDF
              </a>
              <button 
                onClick={() => handleAISummary(nr)}
                disabled={summarizingId === nr.id}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 dark:disabled:bg-slate-800 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-violet-100 dark:shadow-none transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {summarizingId === nr.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><span>✨</span> Resumir</>
                )}
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800">
             <div className="text-4xl mb-4 text-slate-300 dark:text-slate-700">🔍</div>
             <p className="text-slate-400 font-black uppercase text-sm tracking-widest">Nenhuma norma encontrada para "{searchQuery}"</p>
             <button onClick={() => {setSearchQuery(''); setActiveCategory('Todos')}} className="mt-4 text-blue-500 font-bold text-xs underline">Limpar filtros</button>
          </div>
        )}
      </div>

      <div className="bg-blue-600 p-10 rounded-[48px] shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 scale-[4] rotate-12">⚖️</div>
        <div className="relative z-10 space-y-2">
           <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Base Governamental Atualizada</h3>
           <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Os documentos acima são versões oficiais compiladas do Portal Gov.br.</p>
        </div>
        <a 
          href="https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/inspecao-do-trabalho/normas-regulamentadoras/normas-regulamentadoras-vigentes" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative z-10 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all active:scale-95"
        >
          Acessar Portal MTE
        </a>
      </div>
    </div>
  );
};

export default Legislation;
