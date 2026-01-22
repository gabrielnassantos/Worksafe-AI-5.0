
export interface Incident {
  id: string;
  type: 'near-miss' | 'hazard' | 'accident' | 'ergonomics';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved';
  image?: string;
  aiAnalysis?: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions?: Question[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  category: string;
  completed: boolean;
  requiresProof: boolean;
  proofImage?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
}

export type Sector = 'Faturamento' | 'Contas a Receber' | 'SSMA' | 'Administrativo/Comercial' | 'Financeiro';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'supervisor' | 'worker';
  name: string;
  score: number;
  badges: string[];
  avatar?: string;
  sector: Sector;
}

export type View = 'dashboard' | 'new-report' | 'checklists' | 'settings' | 'ranking' | 'score' | 'ergonomics' | 'quizzes' | 'create-quiz' | 'quiz-view' | 'legislation' | 'admin-dashboard';
