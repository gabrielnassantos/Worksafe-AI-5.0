
import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IncidentReport from './components/IncidentReport';
import Checklists from './components/Checklists';
import Ranking from './components/Ranking';
import BottomNav from './components/BottomNav';
import QuizLista from './components/QuizList';
import QuizCreator from './components/QuizCreator';
import QuizView from './components/QuizView';
import Legislation from './components/Legislation';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import { User, View, Incident, Sector } from './types';

const INITIAL_USERS = [
  { id: 'admin123', email: 'admin@worksafe.com', password: 'Admin@123', name: 'Administrador Sistema', score: 5000, role: 'admin', badges: ['Master'], sector: 'SSMA' },
  { id: 'worker1', email: 'joao@empresa.com', password: 'User@1234', name: 'João Silva', score: 1200, role: 'worker', badges: ['Seguro'], sector: 'SSMA' }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('worksafe_theme') === 'dark';
  });

  useEffect(() => {
    const savedUsers = localStorage.getItem('worksafe_db_users');
    const usersList = savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
    setRegisteredUsers(usersList);
    if (!savedUsers) localStorage.setItem('worksafe_db_users', JSON.stringify(INITIAL_USERS));

    const savedUser = localStorage.getItem('worksafe_user');
    const savedIncidents = localStorage.getItem('worksafe_incidents');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const stillExists = usersList.find((u: any) => u.email === parsedUser.email);
      if (stillExists) setUser(stillExists);
    }
    
    if (savedIncidents) setIncidents(JSON.parse(savedIncidents));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('worksafe_user', JSON.stringify(user));
      setRegisteredUsers(prev => {
        const updated = prev.map(u => u.email === user.email ? { ...u, ...user } : u);
        localStorage.setItem('worksafe_db_users', JSON.stringify(updated));
        return updated;
      });
    }
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('worksafe_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogin = (email: string, password?: string, name?: string, sector?: Sector, isSignup?: boolean): string | null => {
    const emailLower = email.toLowerCase().trim();

    if (isSignup) {
      const exists = registeredUsers.find(u => u.email.toLowerCase() === emailLower);
      if (exists) return "Este e-mail já está cadastrado no sistema.";

      const isAdmin = name?.toLowerCase().includes('admin') || emailLower.includes('admin');
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: emailLower,
        password,
        name: name || emailLower.split('@')[0],
        role: isAdmin ? 'admin' : 'worker',
        score: 0,
        badges: [],
        sector: sector || 'SSMA'
      };

      const newList = [...registeredUsers, newUser];
      setRegisteredUsers(newList);
      localStorage.setItem('worksafe_db_users', JSON.stringify(newList));
      setUser(newUser as User);
      return null;
    } else {
      const foundUser = registeredUsers.find(u => u.email.toLowerCase() === emailLower);
      
      if (!foundUser) return "E-mail não encontrado na base de dados.";
      if (foundUser.password !== password) return "Senha incorreta. Verifique e tente novamente.";

      setUser(foundUser as User);
      setCurrentView('dashboard');
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('worksafe_user');
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleQuizComplete = (points: number, correctCount: number) => {
    if (user) {
      let finalPointsChange = points;
      let newBadges = [...user.badges];

      if (correctCount === 0) {
        finalPointsChange = -500;
      } else if (points >= 500) {
        const badge = 'Mestre Ergonomia';
        if (!newBadges.includes(badge)) newBadges.push(badge);
      }

      const newScore = Math.max(0, user.score + finalPointsChange);
      setUser({ ...user, score: newScore, badges: newBadges });
    }
    setActiveQuizId(null);
    navigateTo('score');
  };

  const handleMissionComplete = (points: number) => {
    if (user) {
      setUser({ ...user, score: user.score + points });
    }
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
  };

  if (!user) return <Login onLogin={() => {}} onAuthAction={handleLogin} />;

  return (
    <div className={`flex min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} pb-20 lg:pb-0`}>
      <Sidebar 
        activeView={currentView} 
        onNavigate={navigateTo} 
        onLogout={handleLogout}
        isAdmin={user.role === 'admin'}
        user={user}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">
               {currentView === 'settings' ? 'Meu Perfil' : 
                currentView === 'admin-dashboard' ? 'Relatórios' : 
                currentView === 'legislation' ? 'Legislação' :
                currentView === 'checklists' ? 'Checklists & Missões' :
                currentView === 'quizzes' ? 'Avaliações' : 
                currentView === 'ranking' ? 'Ranking Global' :
                currentView === 'dashboard' ? 'Home' : currentView}
            </h1>
            
            <div className="flex items-center gap-3 md:gap-4">
               <div className="hidden sm:flex bg-white dark:bg-slate-900 px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score Global</span>
                  <span className={`font-black text-lg ${user.score < 500 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>{user.score.toLocaleString()}</span>
               </div>
               
               <button 
                  onClick={() => navigateTo('settings')}
                  className="flex items-center gap-3 p-1 bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300">👤</div>}
                  </div>
               </button>
            </div>
          </header>

          <div key={currentView} className="view-transition-container">
            {currentView === 'dashboard' && <Dashboard incidents={incidents} />}
            {currentView === 'quizzes' && <QuizList onStartQuiz={(id) => { setActiveQuizId(id); navigateTo('quiz-view'); }} />}
            {currentView === 'quiz-view' && activeQuizId && <QuizView quizId={activeQuizId} onComplete={handleQuizComplete} onCancel={() => navigateTo('quizzes')} />}
            {currentView === 'ranking' && <Ranking users={registeredUsers} currentUser={user} />}
            {currentView === 'legislation' && <Legislation />}
            {currentView === 'checklists' && <Checklists onReward={handleMissionComplete} />}
            {currentView === 'admin-dashboard' && <AdminDashboard users={registeredUsers} />}
            {currentView === 'score' && (
              <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-[56px] p-12 shadow-2xl text-center border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-500">
                <div className={`w-40 h-40 rounded-full mx-auto flex flex-col items-center justify-center border-4 border-slate-900 dark:border-white shadow-lg mb-8 ${user.score > 1000 ? 'bg-[#FFB800]' : 'bg-red-500 text-white'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest mb-1">{user.score > 1000 ? 'Level Up!' : 'Status'}</span>
                  <span className="text-4xl font-black">{user.score}</span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-slate-800 dark:text-white">Perfil Atualizado</h3>
                <p className="text-slate-400 text-xs font-bold mb-10 leading-relaxed uppercase">Sua dedicação reflete no ranking da empresa.</p>
                <button onClick={() => navigateTo('ranking')} className="w-full bg-[#4A86E8] text-white font-black py-6 rounded-[28px] uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-2xl">VISUALIZAR RANKING</button>
              </div>
            )}
            {currentView === 'settings' && (
              <Profile 
                user={user} 
                onLogout={handleLogout} 
                onUpdateUser={(d) => setUser(prev => prev ? {...prev, ...d} : null)} 
                darkMode={darkMode} 
                toggleDarkMode={() => setDarkMode(!darkMode)}
              />
            )}
          </div>
        </div>
      </main>
      <BottomNav activeView={currentView} onNavigate={navigateTo} score={user.score} isAdmin={user.role === 'admin'} />
    </div>
  );
};

export default App;
