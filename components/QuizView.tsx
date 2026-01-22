
import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizViewProps {
  quizId: string;
  onComplete: (points: number, correctCount: number) => void;
  onCancel: () => void;
}

const QUIZ_DATA: Record<string, Question[]> = {
  q1: [
    { id: 1, text: "Qual deve ser a posição ideal do topo da tela do monitor em relação aos seus olhos?", options: ["Acima da linha dos olhos", "Na altura ou ligeiramente abaixo da linha dos olhos", "Na altura do peito", "Não importa a altura"], correctOption: 1, explanation: "O topo da tela deve estar na altura dos olhos para evitar que você incline o pescoço para cima ou para baixo." },
    { id: 2, text: "Ao sentar, como seus pés devem estar posicionados?", options: ["Cruzados um sobre o outro", "Apoiados totalmente no chão ou suporte", "Apenas as pontas dos pés tocando o chão", "Pendurados livremente"], correctOption: 1, explanation: "Pés bem apoiados garantem a distribuição do peso e evitam pressão excessiva nas coxas." },
    { id: 3, text: "Qual a frequência ideal para pausas curtas de alongamento?", options: ["A cada 15 minutos", "A cada 50-60 minutos", "Apenas na hora do almoço", "A cada 4 horas"], correctOption: 1, explanation: "Pausas de 5 a 10 minutos a cada hora ajudam a relaxar a musculatura e prevenir fadiga crônica." }
  ],
  q2: [
    { 
      id: 6, 
      text: "Qual organização da mesa é mais ergonômica?", 
      options: ["Objetos de uso frequente longe do alcance", "Mesa sempre vazia", "Itens de uso constante ao alcance das mãos", "Objetos empilhados para ganhar espaço"], 
      correctOption: 2, 
      explanation: "Manter itens frequentes ao alcance evita movimentos repetitivos de tronco e estiramento excessivo dos braços." 
    },
    { 
      id: 7, 
      text: "Qual é o melhor posicionamento do teclado?", 
      options: ["Longe do corpo para esticar os braços", "Muito próximo ao corpo", "Centralizado e alinhado ao corpo", "Deslocado para a esquerda"], 
      correctOption: 2, 
      explanation: "O teclado deve estar centralizado para manter o alinhamento neutro dos ombros e punhos." 
    },
    { 
      id: 8, 
      text: "Qual hábito reduz fadiga nos punhos ao usar teclado e mouse?", 
      options: ["Digitar com força", "Manter punhos alinhados e neutros", "Apoiar o peso do corpo sobre os punhos", "Trabalhar com o teclado no colo"], 
      correctOption: 1, 
      explanation: "A posição neutra reduz a compressão dos nervos e tendões do túnel do carpo." 
    }
  ]
};

const QuizView: React.FC<QuizViewProps> = ({ quizId, onComplete, onCancel }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const pool = QUIZ_DATA[quizId] || QUIZ_DATA['q1'];
    const processedQuestions = [...pool]
      .sort(() => 0.5 - Math.random())
      .map(q => {
        const originalOptions = [...q.options];
        const correctText = originalOptions[q.correctOption];
        const shuffledOptions = [...originalOptions].sort(() => 0.5 - Math.random());
        const newCorrectIdx = shuffledOptions.indexOf(correctText);
        return { ...q, options: shuffledOptions, correctOption: newCorrectIdx };
      });
    setQuestions(processedQuestions);
  }, [quizId]);

  const handleOptionSelect = (idx: number) => {
    if (confirmed) return;
    setSelectedOption(idx);
  };

  const handleConfirm = () => {
    if (selectedOption === null || confirmed) return;
    setConfirmed(true);
    if (selectedOption === questions[currentIdx].correctOption) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setSelectedOption(null);
      setConfirmed(false);
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const finishQuiz = () => {
    const totalQuestions = questions.length;
    const ratio = correctAnswersCount / totalQuestions;
    let earnedPoints = 0;
    const maxPoints = quizId === 'q2' ? 600 : 500;

    if (ratio === 1) earnedPoints = maxPoints;
    else if (ratio >= 0.6) earnedPoints = Math.floor(maxPoints * 0.6);

    onComplete(earnedPoints, correctAnswersCount);
  };

  if (questions.length === 0) return <div className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">Sincronizando Desafios...</div>;

  if (isFinished) {
    const ratio = correctAnswersCount / questions.length;
    const isPerfect = ratio === 1;
    const isGood = ratio >= 0.6;
    const failedAll = ratio < 0.6;

    return (
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-[56px] p-10 text-center shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-500 overflow-hidden relative">
        <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl shadow-inner transition-transform duration-700 hover:rotate-12 ${
          isPerfect ? 'bg-amber-100 text-amber-500' : isGood ? 'bg-emerald-100 text-emerald-500' : 'bg-red-100 text-red-600'
        }`}>
          {isPerfect ? '🏆' : isGood ? '🎖️' : '⚠️'}
        </div>

        <h2 className={`text-3xl font-black uppercase tracking-tighter mb-4 ${isPerfect ? 'text-amber-600' : isGood ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPerfect ? 'Mestre Absoluto!' : isGood ? 'Bom Desempenho!' : 'Risco Detectado'}
        </h2>

        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-10 leading-relaxed px-4">
          {isPerfect ? 'Conhecimento impecável! Você é um guardião da ergonomia e segurança no trabalho.' : 
           isGood ? 'Bom trabalho, mas ainda há detalhes a ajustar para garantir sua segurança total.' : 
           'Seu score reflete falta de atenção às normas básicas. Revise os fundamentos para evitar acidentes.'}
        </p>

        <div className={`mb-10 p-8 rounded-[36px] border-2 flex flex-col items-center animate-pulse ${
          failedAll ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20'
        }`}>
           <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${failedAll ? 'text-red-400' : 'text-blue-400'}`}>Saldo de Experiência</span>
           <span className={`text-4xl font-black ${failedAll ? 'text-red-600' : 'text-blue-600 dark:text-blue-400'}`}>
             {failedAll ? '-500 PONTOS' : `+${isPerfect ? (quizId === 'q2' ? 600 : 500) : Math.floor((quizId === 'q2' ? 600 : 500) * 0.6)}`}
           </span>
        </div>

        <button onClick={finishQuiz} className={`w-full font-black py-6 rounded-[28px] shadow-2xl uppercase text-[11px] tracking-[0.2em] active:scale-95 transition-all ${
          failedAll ? 'bg-red-600 text-white shadow-red-200' : isPerfect ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-[#4A86E8] text-white shadow-blue-200'
        }`}>
          {failedAll ? 'VOLTAR E REESTUDAR' : 'RESGATAR RECOMPENSA'}
        </button>
      </div>
    );
  }

  const question = questions[currentIdx];
  const isCorrect = selectedOption === question.correctOption;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-view-fade-in px-2">
      <div className="flex justify-between items-center px-4">
        <button onClick={onCancel} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-red-500 p-2">Sair</button>
        <div className="bg-white dark:bg-slate-800 px-6 py-2.5 rounded-full text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest shadow-sm border border-slate-100 dark:border-slate-700">
          {currentIdx + 1} / {questions.length}
        </div>
      </div>
      
      <div 
        key={currentIdx}
        className="bg-white dark:bg-slate-900 rounded-[48px] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden question-card-animate"
      >
        <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full mb-12 overflow-hidden shadow-inner">
          <div className="h-full bg-[#4A86E8] transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>

        <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 mb-10 leading-tight tracking-tight uppercase">
          {question.text}
        </h3>

        <div className="space-y-4">
          {question.options.map((opt: string, idx: number) => {
             let borderClass = 'border-slate-100 dark:border-slate-800';
             let bgClass = 'bg-slate-50 dark:bg-slate-900';
             let textClass = 'text-slate-500 dark:text-slate-400';
             let scaleClass = 'scale-100';

             if (confirmed) {
               if (idx === question.correctOption) {
                 borderClass = 'border-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-900/20';
                 bgClass = 'bg-emerald-50 dark:bg-emerald-900/20';
                 textClass = 'text-emerald-700 dark:text-emerald-400';
                 scaleClass = 'scale-[1.03]';
               } else if (idx === selectedOption) {
                 borderClass = 'border-red-500 ring-4 ring-red-50 dark:ring-red-900/20';
                 bgClass = 'bg-red-50 dark:bg-red-900/20';
                 textClass = 'text-red-700 dark:text-red-400';
               } else {
                 textClass = 'opacity-20 grayscale';
               }
             } else if (selectedOption === idx) {
               borderClass = 'border-blue-500 bg-white dark:bg-slate-800 shadow-2xl';
               textClass = 'text-blue-700 dark:text-blue-400';
               scaleClass = 'scale-[1.02] animate-pulse-soft';
             }

             return (
              <button
                key={idx}
                disabled={confirmed}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-6 rounded-[32px] border-2 transition-all duration-500 flex items-center gap-6 ${borderClass} ${bgClass} ${textClass} ${scaleClass}`}
              >
                <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-sm transition-all duration-300 ${
                  confirmed && idx === question.correctOption ? 'bg-emerald-500 border-emerald-500 text-white' :
                  confirmed && idx === selectedOption ? 'bg-red-500 border-red-500 text-white' :
                  selectedOption === idx ? 'bg-[#4A86E8] border-[#4A86E8] text-white' : 'border-slate-200 dark:border-slate-700 text-slate-300'
                }`}>
                  {confirmed && idx === question.correctOption ? '✓' : confirmed && idx === selectedOption ? '✕' : String.fromCharCode(65 + idx)}
                </div>
                <span className="font-bold flex-1 text-sm md:text-base leading-tight">{opt}</span>
              </button>
             );
          })}
        </div>

        {!confirmed ? (
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className={`mt-12 w-full font-black py-7 rounded-[32px] uppercase text-xs tracking-[0.3em] transition-all duration-500 shadow-2xl active:scale-95 ${
              selectedOption !== null ? 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-300 scale-95 opacity-50'
            }`}
          >
            Confirmar Escolha
          </button>
        ) : (
          <div className={`mt-10 p-10 rounded-[48px] border-2 feedback-animate ${isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${isCorrect ? 'bg-emerald-100' : 'bg-red-100'}`}>
                {isCorrect ? '✨' : '⚠️'}
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 block">Nota Técnica</span>
                <span className="text-xs font-black uppercase tracking-widest">{isCorrect ? 'Precisão Máxima!' : 'Normas Vitais'}</span>
              </div>
            </div>
            <p className="text-sm font-bold leading-relaxed mb-10 text-left">{question.explanation}</p>
            <button 
              onClick={handleNext} 
              className="w-full bg-slate-900 dark:bg-slate-700 text-white font-black py-6 rounded-[28px] uppercase text-[11px] tracking-[0.2em] transition-all active:scale-95 shadow-xl hover:bg-[#4A86E8]"
            >
              {currentIdx < questions.length - 1 ? 'Próxima Questão' : 'Ver Meu Veredito'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
