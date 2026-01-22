
import React, { useState, useEffect } from 'react';
import { Incident } from '../types';
import { analyzeIncident } from '../services/geminiService';

interface IncidentReportProps {
  onAdd: (incident: Incident) => void;
  initialType?: Incident['type'];
}

const IncidentReport: React.FC<IncidentReportProps> = ({ onAdd, initialType }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<Incident['type']>(initialType || 'hazard');
  const [severity, setSeverity] = useState<Incident['severity']>('low');
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  useEffect(() => {
    if (initialType) setType(initialType);
  }, [initialType]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalysis = async () => {
    if (!description) return;
    setAnalyzing(true);
    const result = await analyzeIncident(description, image || undefined);
    setAiResult(result);
    setAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncident: Incident = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      location,
      type,
      severity,
      timestamp: new Date().toISOString(),
      status: 'open',
      image: image || undefined,
      aiAnalysis: aiResult || undefined
    };
    onAdd(newIncident);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 text-center">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">
            {type === 'ergonomics' ? 'Avaliação de Ergonomia' : 'Detalhes do Registro'}
          </h2>
          <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-tight">Registre para manter a segurança e ganhar pontos.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">Tipo de Registro</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-5 py-4 rounded-[20px] bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-slate-700 shadow-sm"
              >
                <option value="ergonomics">Ergonomia (Postura/Ambiente)</option>
                <option value="hazard">Risco Identificado</option>
                <option value="near-miss">Quase Acidente</option>
                <option value="accident">Acidente</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">Nível de Impacto</label>
              <select 
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-5 py-4 rounded-[20px] bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-slate-700 shadow-sm"
              >
                <option value="low">Baixo - Ponto de Atenção</option>
                <option value="medium">Médio - Precisa Ajuste</option>
                <option value="high">Alto - Risco Imediato</option>
                <option value="critical">Crítico - Intervenção Urgente</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">Local / Posto de Trabalho</label>
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex: Estação 4, Almoxarifado, Escritório Central"
              className="w-full px-5 py-4 rounded-[20px] bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-slate-700 shadow-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">Descrição</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder={type === 'ergonomics' ? "Descreva seu conforto, altura da cadeira, iluminação..." : "O que foi observado?"}
              className="w-full px-5 py-4 rounded-[20px] bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-slate-700 shadow-sm resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">Foto (Opcional)</label>
            <div className="flex items-center gap-4">
               <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 border-dashed border-slate-300 active:scale-95">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  CAPTURAR/ANEXAR
               </label>
               {image && <span className="text-xs font-black text-emerald-500 uppercase flex items-center gap-1 animate-fade-in">✅ PRONTO</span>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-50">
            <button
              type="button"
              onClick={handleAIAnalysis}
              disabled={!description || analyzing}
              className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-200 text-white font-black py-5 px-6 rounded-[24px] shadow-xl shadow-violet-100 transition-all active:scale-[0.98] text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <><svg className="animate-spin h-4 w-4 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>ANALISANDO...</>
              ) : (
                <><span className="text-lg">✨</span> ANALISAR COM IA</>
              )}
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#4A86E8] hover:bg-[#3B75D4] text-white font-black py-5 px-6 rounded-[24px] shadow-xl shadow-blue-100 transition-all active:scale-[0.98] text-[10px] uppercase tracking-[0.2em]"
            >
              ENVIAR E GANHAR PONTOS
            </button>
          </div>
        </form>
      </div>

      {aiResult && (
        <div className="bg-white rounded-[32px] shadow-xl border-2 border-violet-100 p-8 animate-in zoom-in duration-300 transition-all">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-violet-100 rounded-2xl text-violet-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
             </div>
             <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Avaliação da Inteligência Gemini</h3>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-wrap">
            {aiResult}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentReport;
