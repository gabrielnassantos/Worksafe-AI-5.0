
import React from 'react';
import { Quiz } from '../types';

interface QuizListProps {
  onStartQuiz: (id: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({ onStartQuiz }) => {
  const quizzes: Quiz[] = [
    {
      id: 'q1',
      title: 'Ergonomia: Fundamentos',
      description: 'Teste seus conhecimentos sobre a postura correta, ajuste de cadeiras, altura do monitor e pausas para evitar lesões.',
      points: 500,
      category: 'Ergonomia',
      difficulty: 'easy'
    },
    {
      id: 'q2',
      title: 'Organização e Postura',
      description: 'Aprenda a organizar sua mesa de trabalho e posicionar seus periféricos de forma a reduzir o esforço físico e a fadiga muscular.',
      points: 600,
      category: 'Ergonomia',
      difficulty: 'medium'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Avaliações Disponíveis</h2>
      </div>

      {quizzes.map((quiz) => (
        <div 
          key={quiz.id} 
          className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden flex flex-col transform hover:-translate-y-2"
        >
          <div className="p-10 md:p-14 flex-1">
            <div className="flex justify-between items-center mb-8">
              <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[12px] font-black uppercase px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800 tracking-[0.2em]">
                {quiz.category}
              </span>
              <div className="flex items-center gap-2 bg-[#FFB800] text-black text-xs font-black px-4 py-2 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-lg">🏆</span> +{quiz.points} PONTOS
              </div>
            </div>

            <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight group-hover:text-[#4A86E8] transition-colors tracking-tighter">
              {quiz.title}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl leading-relaxed mb-10 font-medium">
              {quiz.description}
            </p>
            
            <div className="flex items-center gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border border-slate-100 dark:border-slate-800">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-700 bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Colaboradores ativos já completaram
              </span>
              <div className="ml-auto flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-[10px] font-black uppercase ${quiz.difficulty === 'easy' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {quiz.difficulty === 'easy' ? 'Iniciante' : 'Intermediário'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onStartQuiz(quiz.id)}
            className="w-full bg-[#4A86E8] hover:bg-[#3B75D4] text-white font-black py-8 transition-all uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            <span>INICIAR DESAFIO</span>
            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          </button>
        </div>
      ))}

      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-[32px] border-2 border-dashed border-blue-100 dark:border-blue-900/30 text-center">
        <p className="text-blue-400 dark:text-blue-500 text-xs font-black uppercase tracking-widest">
          Novos desafios serão liberados em breve
        </p>
      </div>
    </div>
  );
};

export default QuizList;
