
import React, { useState, useEffect } from 'react';
import { Sector } from '../types';

interface LoginProps {
  onLogin: (email: string, name?: string, sector?: Sector) => void;
  onAuthAction?: (email: string, password?: string, name?: string, sector?: Sector, isSignup?: boolean) => string | null;
}

type AuthMode = 'login' | 'signup' | 'forgot';

const SECTORS: Sector[] = ['Faturamento', 'Contas a Receber', 'SSMA', 'Administrativo/Comercial', 'Financeiro'];

const Login: React.FC<LoginProps> = ({ onAuthAction }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedSector, setSelectedSector] = useState<Sector>('SSMA');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Carregar e-mail lembrado ao montar componente
  useEffect(() => {
    const savedEmail = localStorage.getItem('worksafe_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const triggerError = (msg: string) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || (mode !== 'forgot' && !password)) {
      triggerError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      triggerError('As senhas não coincidem.');
      return;
    }

    if (onAuthAction) {
      const result = onAuthAction(email, password, name, selectedSector, mode === 'signup');
      if (result) {
        triggerError(result);
      } else {
        // Se o login for bem sucedido e "lembrar" estiver marcado
        if (rememberEmail) {
          localStorage.setItem('worksafe_remembered_email', email.toLowerCase().trim());
        } else {
          localStorage.removeItem('worksafe_remembered_email');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 font-sans">
      <div className={`w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col min-h-[640px] animate-in fade-in zoom-in duration-500 relative ${isShaking ? 'animate-bounce' : ''}`}>
        
        {mode !== 'login' && (
          <button onClick={() => setMode('login')} className="absolute top-8 left-8 bg-[#4A86E8] text-white p-2 rounded-lg shadow-lg z-10 active:scale-90 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}

        <div className="pt-16 pb-6 text-center px-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-6 border border-gray-50 dark:border-slate-700">
            <svg viewBox="0 0 120 120" className="w-16 h-16">
              <path d="M20,65 Q20,20 60,20 Q100,20 100,65 L100,72 Q100,80 90,80 L30,80 Q20,80 20,72 Z" fill="#FFD700" stroke="#222" strokeWidth="2" />
              <path d="M15,65 L105,65 Q115,65 115,72 L115,75 Q115,82 105,82 L15,82 Q5,82 5,75 L5,72 Q5,65 15,65 Z" fill="#FFB800" stroke="#222" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">WorkSafe</h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Gestão de Acesso Seguro</p>
        </div>

        <form onSubmit={handleSubmit} className="px-10 pb-12 flex-1 flex flex-col space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-3xl text-[11px] font-black border border-red-100 dark:border-red-900/30 flex items-center gap-2 animate-in slide-in-from-top-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-4 mb-1 block">Nome Completo</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-6 py-4 rounded-[24px] bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-750 focus:border-blue-500 transition-all outline-none font-bold dark:text-white" placeholder="Nome do colaborador" />
                </div>
                <div className="group">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-4 mb-1 block">Setor</label>
                  <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value as Sector)} className="w-full px-6 py-4 rounded-[24px] bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-750 focus:border-blue-500 transition-all outline-none font-bold dark:text-white">
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="group">
              <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-4 mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 rounded-[24px] bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-750 focus:border-blue-500 transition-all outline-none font-bold dark:text-white" placeholder="exemplo@empresa.com" />
            </div>

            {mode !== 'forgot' && (
              <div className="group relative">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-4 mb-1 block">Senha</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-6 py-4 rounded-[24px] bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-750 focus:border-blue-500 transition-all outline-none font-bold dark:text-white pr-14" 
                    placeholder="••••••••" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500 transition-colors">
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center gap-3 ml-4 mt-2">
                <button 
                  type="button"
                  onClick={() => setRememberEmail(!rememberEmail)}
                  className={`w-10 h-6 rounded-full relative transition-all duration-300 ${rememberEmail ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-gray-200 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${rememberEmail ? 'left-5' : 'left-1'}`} />
                </button>
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Lembrar meu e-mail</span>
              </div>
            )}

            {mode === 'signup' && (
              <div className="group">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-4 mb-1 block">Confirmar Senha</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full px-6 py-4 rounded-[24px] bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:bg-white dark:focus:bg-slate-750 focus:border-blue-500 transition-all outline-none font-bold dark:text-white" 
                  placeholder="••••••••" 
                />
              </div>
            )}
          </div>

          <div className="pt-6 flex-1 flex flex-col justify-end space-y-4">
            <button type="submit" className="w-full bg-[#4A86E8] text-white font-black py-5 px-4 rounded-[24px] shadow-xl text-xs uppercase tracking-[0.2em] active:scale-95 transition-all hover:bg-blue-700 hover:shadow-blue-200 dark:hover:shadow-none">
              {mode === 'login' ? 'Entrar' : mode === 'signup' ? 'Cadastrar' : 'Recuperar'}
            </button>
            <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-500 transition-colors">
              {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre agora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
