
import React, { useState, useEffect, useRef } from 'react';
import { generateSafetyChecklist, verifyMissionProof } from '../services/geminiService';
import { Mission } from '../types';

interface ChecklistsProps {
  onReward?: (points: number) => void;
}

const MISSION_POOL: Mission[] = [
  { id: 'm1', title: 'Sentinela do Extintor', description: 'Localize o extintor de incêndio mais próximo e fotografe-o para validar o acesso livre.', points: 150, difficulty: 'easy', icon: '🧯', category: 'Prevenção', completed: false, requiresProof: true },
  { id: 'm2', title: 'Estação de Trabalho', description: 'Fotografe sua mesa mostrando a altura do monitor e alinhamento do teclado para validarmos sua ergonomia.', points: 300, difficulty: 'medium', icon: '🧘', category: 'Ergonomia', completed: false, requiresProof: true },
  { id: 'm3', title: 'Corredores Livres', description: 'Comprove que não há caixas ou fios obstruindo a passagem no seu setor com uma foto.', points: 100, difficulty: 'easy', icon: '🏃', category: 'Organização', completed: false, requiresProof: true },
  { id: 'm4', title: 'Equipamento de Proteção', description: 'Tire uma selfie utilizando seus óculos de proteção ou protetor auricular para validação diária.', points: 200, difficulty: 'easy', icon: '🥽', category: 'EPI', completed: false, requiresProof: true },
  { id: 'm5', title: 'Rota de Fuga', description: 'Localize e fotografe a sinalização de saída de emergência do seu setor.', points: 150, difficulty: 'medium', icon: '🚪', category: 'Segurança', completed: false, requiresProof: true },
];

const ROTATION_HOURS = 14;

const Checklists: React.FC<ChecklistsProps> = ({ onReward }) => {
  const [activeTab, setActiveTab] = useState<'generator' | 'missions'>('missions');
  const [taskName, setTaskName] = useState('');
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState<{ task: string; items: { check: string; priority: string }[] } | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  const [activeMissionForProof, setActiveMissionForProof] = useState<Mission | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<{success: boolean, text: string} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initializeMissions();
    const timer = setInterval(updateRotationTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateRotationTimer = () => {
    const lastReset = localStorage.getItem('worksafe_last_reset');
    if (!lastReset) return;
    const diff = Date.now() - parseInt(lastReset);
    const remaining = (ROTATION_HOURS * 3600 * 1000) - diff;
    if (remaining <= 0) {
      initializeMissions(true);
    } else {
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }
  };

  const initializeMissions = (forceReset = false) => {
    const savedMissions = localStorage.getItem('worksafe_missions');
    const lastReset = localStorage.getItem('worksafe_last_reset');
    const now = Date.now();

    if (!savedMissions || !lastReset || forceReset || (now - parseInt(lastReset)) > ROTATION_HOURS * 3600 * 1000) {
      const shuffled = [...MISSION_POOL].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);
      setMissions(selected);
      localStorage.setItem('worksafe_missions', JSON.stringify(selected));
      localStorage.setItem('worksafe_last_reset', now.toString());
    } else {
      setMissions(JSON.parse(savedMissions));
    }
  };

  const handleGenerate = async () => {
    if (!taskName) return;
    setLoading(true);
    try {
      const result = await generateSafetyChecklist(taskName);
      setChecklist(result);
    } finally {
      setLoading(false);
    }
  };

  const startProofCollection = async (mission: Mission) => {
    setActiveMissionForProof(mission);
    setVerificationFeedback(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Câmera bloqueada ou indisponível.");
      setActiveMissionForProof(null);
    }
  };

  const captureAndVerify = async () => {
    if (!videoRef.current || !canvasRef.current || !activeMissionForProof) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const imageBase64 = canvas.toDataURL('image/jpeg');
    
    (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    setIsVerifying(true);

    const result = await verifyMissionProof(
      activeMissionForProof.title,
      activeMissionForProof.description,
      imageBase64
    );

    setIsVerifying(false);
    if (result.verified) {
      setVerificationFeedback({ success: true, text: "Comprovação validada pela IA!" });
      setTimeout(() => {
        completeMission(activeMissionForProof.id);
        setActiveMissionForProof(null);
      }, 1500);
    } else {
      setVerificationFeedback({ success: false, text: result.reason });
    }
  };

  const completeMission = (id: string) => {
    setMissions(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, completed: true } : m);
      localStorage.setItem('worksafe_missions', JSON.stringify(updated));
      const m = updated.find(x => x.id === id);
      if (m && onReward) onReward(m.points);
      return updated;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-view-fade-in px-2">
      <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm">
        <button onClick={() => setActiveTab('missions')} className={`flex-1 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'missions' ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Mural de Missões</button>
        <button onClick={() => setActiveTab('generator')} className={`flex-1 py-4 rounded-[22px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'generator' ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>Gerador Checklist IA</button>
      </div>

      {activeTab === 'missions' ? (
        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-950 p-8 md:p-10 rounded-[40px] text-white flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-800 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
             <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Missões de Segurança</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Rotação em: <span className="text-blue-400 font-black">{timeLeft}</span></p>
             </div>
             <div className="relative z-10 flex items-center gap-4 bg-slate-800/50 p-4 px-6 rounded-3xl border border-slate-700">
                <span className="text-3xl">🎯</span>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase">Status Diário</p>
                  <p className="text-xl font-black">{missions.filter(m => m.completed).length}/{missions.length}</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {missions.map(mission => (
              <div key={mission.id} className={`bg-white dark:bg-slate-900 rounded-[40px] p-8 border-2 flex flex-col justify-between transition-all duration-300 ${mission.completed ? 'border-emerald-100 opacity-60' : 'border-slate-100 hover:border-[#4A86E8] hover:shadow-2xl'}`}>
                <div className="flex gap-6 mb-6">
                  <div className="w-16 h-16 rounded-[24px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">{mission.icon}</div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mission.category}</span>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-tight">{mission.title}</h3>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">{mission.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-black text-[#4A86E8] tracking-tighter">+{mission.points} XP</span>
                  <button
                    disabled={mission.completed}
                    onClick={() => mission.requiresProof ? startProofCollection(mission) : completeMission(mission.id)}
                    className={`px-8 py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all ${mission.completed ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-[#4A86E8]'}`}
                  >
                    {mission.completed ? 'CONCLUÍDO' : mission.requiresProof ? 'ENVIAR PROVA' : 'CONFIRMAR'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-view-fade-in">
           <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800">
             <div className="max-w-xl mx-auto text-center space-y-6">
               <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-sm border border-blue-100 dark:border-blue-800">✨</div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gerador de Segurança IA</h2>
               <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Diga qual tarefa você vai realizar e nossa IA criará um checklist de segurança personalizado em segundos.</p>
               
               <div className="relative group pt-4">
                 <input 
                  type="text" 
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Ex: Limpeza de vidros em altura, Troca de lâmpadas..."
                  className="w-full px-8 py-6 rounded-[28px] bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-750 focus:border-[#4A86E8] outline-none transition-all font-bold text-slate-800 dark:text-white shadow-inner pr-20"
                 />
                 <button 
                  onClick={handleGenerate}
                  disabled={!taskName || loading}
                  className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 bg-slate-900 dark:bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all disabled:opacity-50 active:scale-90"
                 >
                   {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 12h14" /></svg>}
                 </button>
               </div>
             </div>
           </div>

           {checklist && (
             <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in duration-300">
               <div className="p-8 md:p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Checklist: {checklist.task}</h3>
                  <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/40 text-[#4A86E8] px-4 py-2 rounded-full uppercase tracking-widest">Gerado por IA</span>
               </div>
               <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {checklist.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[28px] border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all group">
                       <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                         item.priority === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                         item.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                       }`} />
                       <div>
                         <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed mb-1">{item.check}</p>
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Prioridade {item.priority}</span>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-8 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                  <button onClick={() => window.print()} className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-[#4A86E8] transition-colors flex items-center justify-center gap-2 mx-auto">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2" /></svg>
                    Imprimir Checklist
                  </button>
               </div>
             </div>
           )}
        </div>
      )}

      {activeMissionForProof && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[48px] overflow-hidden shadow-2xl relative">
            <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Validar Missão</h3>
               <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-widest">Analizando em tempo real</p>
            </div>
            <div className="relative aspect-square bg-black overflow-hidden ring-4 ring-inset ring-slate-900">
               <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
               <canvas ref={canvasRef} className="hidden" />
               {isVerifying && (
                 <div className="absolute inset-0 bg-blue-600/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-10 text-center">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="font-black uppercase tracking-[0.2em] text-sm">Verificando evidência...</p>
                 </div>
               )}
               {verificationFeedback && (
                 <div className={`absolute bottom-6 left-6 right-6 p-6 rounded-[28px] text-center font-black text-xs uppercase shadow-2xl animate-in slide-in-from-bottom-4 ${verificationFeedback.success ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                   {verificationFeedback.text}
                 </div>
               )}
            </div>
            <div className="p-8 flex flex-col gap-4">
               <button disabled={isVerifying} onClick={captureAndVerify} className="w-full bg-[#4A86E8] text-white font-black py-6 rounded-[28px] uppercase text-sm tracking-widest active:scale-95 shadow-xl transition-all">CAPTURAR E VALIDAR</button>
               <button disabled={isVerifying} onClick={() => { (videoRef.current?.srcObject as MediaStream)?.getTracks().forEach(t => t.stop()); setActiveMissionForProof(null); }} className="w-full text-slate-400 font-black py-3 uppercase text-[10px] tracking-widest">SAIR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklists;
