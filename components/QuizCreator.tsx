
import React, { useState } from 'react';

interface QuizCreatorProps {
  onSave: () => void;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Ergonomia');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', ''], correct: 0 }]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', ''], correct: 0 }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].options[oIdx] = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest text-center">Configuração do Quiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 block">Título do Quiz</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" 
              placeholder="Ex: Treinamento NR-17" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 block">Categoria</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold"
            >
              <option>Ergonomia</option>
              <option>Primeiros Socorros</option>
              <option>EPIs</option>
              <option>Maquinário</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 block">Descrição Curta</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            className="w-full px-5 py-4 rounded-[20px] bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold resize-none" 
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Questão {qIdx + 1}</span>
            </div>
            <input 
              value={q.text} 
              onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
              className="w-full px-6 py-4 mb-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 font-bold" 
              placeholder="Pergunta aqui..."
            />
            <div className="space-y-4">
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-4">
                  <button 
                    onClick={() => updateQuestion(qIdx, 'correct', oIdx)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${q.correct === oIdx ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}
                  />
                  <input 
                    value={opt} 
                    onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                    className="flex-1 px-5 py-3 rounded-xl bg-slate-50 focus:bg-white border border-transparent focus:border-slate-200 font-medium" 
                    placeholder={`Opção ${oIdx + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={addQuestion}
          className="flex-1 bg-white border-2 border-dashed border-slate-200 text-slate-400 hover:border-[#4A86E8] hover:text-[#4A86E8] font-black py-5 rounded-[24px] transition-all uppercase text-[10px] tracking-widest"
        >
          + ADICIONAR QUESTÃO
        </button>
        <button 
          onClick={onSave}
          className="flex-1 bg-[#4A86E8] text-white font-black py-5 rounded-[24px] shadow-xl shadow-blue-100 hover:bg-[#3B75D4] transition-all uppercase text-[10px] tracking-widest"
        >
          PUBLICAR QUIZ
        </button>
      </div>
    </div>
  );
};

export default QuizCreator;
