// Tipos do usuário
export interface User {
  id: string;
  name: string;
  email: string;
  monthlyIncome: number;
  savingsGoal: number;
  currentDebt?: number; // Novo campo para dívidas atuais
  debtPaid?: number; // Novo campo para dívidas já pagas
  profile: UserProfile;
  preferences: UserPreferences;
  personalityType?: 'disciplined_achiever' | 'impulsive_spender' | 'cautious_saver' | 'ambitious_investor'; // Novo campo
  primaryGoal?: 'debt_elimination' | 'wealth_building' | 'emergency_fund' | 'retirement'; // Novo campo
  secondaryGoal?: 'debt_elimination' | 'wealth_building' | 'emergency_fund' | 'retirement'; // Novo campo
  preferredLearningStyle?: 'visual' | 'practical' | 'theoretical' | 'interactive'; // Novo campo
  motivationalTriggers?: string[]; // Novo campo para gatilhos motivacionais
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  financialKnowledge: 'beginner' | 'intermediate' | 'advanced';
  behaviorPattern: 'impulsive' | 'analytical' | 'emotional';
  financialProfile?: 'beginner' | 'intermediate' | 'advanced' | 'debt_recovery'; // Adicionado debt_recovery
  emotionalState?: 'anxious' | 'happy' | 'sad' | 'stressed' | 'excited' | 'neutral' | 'motivated' | 'satisfied'; // Expandido
}

export interface UserPreferences {
  notifications: boolean;
  chatPersonality: 'friendly' | 'professional' | 'motivational';
  language: string;
  currency: string;
}

// Tipos de transação
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  classification: 'asset' | 'liability' | 'neutral';
  description: string;
  date: Date;
  isRecurring: boolean;
  emotionalState: 'happy' | 'sad' | 'stressed' | 'neutral' | 'excited' | 'anxious' | 'motivated' | 'satisfied';
  aiAnalysis?: AIAnalysis;
}

export interface AIAnalysis {
  recommendation: string;
  bookReference: 'pai_rico_pai_pobre' | 'psicologia_financeira' | 'homem_mais_rico_babilonia';
  behaviorFlag: string;
  severity: 'low' | 'medium' | 'high';
}

// Tipos do chat
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: MessageContext;
}

export interface MessageContext {
  transactionId?: string;
  bookReference?: string;
  recommendation?: string;
  userEmotion?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  sessionType: 'expense_analysis' | 'education' | 'general' | 'goal_setting';
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de análise financeira
export interface FinancialAnalysis {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  assetsPurchased: number;
  liabilitiesPurchased: number;
  behaviorScore: number;
  recommendations: string[];
  trends: FinancialTrend[];
}

export interface FinancialTrend {
  category: string;
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  description: string;
}

// Tipos de educação financeira
export interface EducationContent {
  id: string;
  title: string;
  content: string;
  bookReference: 'pai_rico_pai_pobre' | 'psicologia_financeira' | 'homem_mais_rico_babilonia';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  tags: string[];
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  currentLevel: number;
  totalScore: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

// Tipos de metas financeiras
export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: 'emergency_fund' | 'investment' | 'purchase' | 'debt_payment' | 'debt_payoff'; // Adicionado debt_payoff
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
}

// Tipos de estatísticas mensais (novo)
export interface MonthlyStats {
  id: string;
  userId: string;
  year: number;
  month: number;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  assets: number;
  liabilities: number;
  debtPayments?: number; // Novo campo para pagamentos de dívida
  debtPaymentRate?: number; // Novo campo para taxa de pagamento de dívida
  updatedAt: Date;
}

// Tipos de navegação
export type RootStackParamList = {
  Main: undefined;
  Dashboard: undefined;
  Chat: { initialMessage?: string };
  Analysis: { period?: string };
  Education: { lessonId?: string };
  Settings: undefined;
  Profile: undefined;
  Goals: undefined;
  Transactions: undefined;
};

// Tipos de estado do Redux
export interface RootState {
  user: UserState;
  transactions: TransactionState;
  chat: ChatState;
  education: EducationState;
  goals: GoalState;
}

export interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilters;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  type?: 'income' | 'expense';
  classification?: 'asset' | 'liability' | 'neutral';
}

export interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
}

export interface EducationState {
  content: EducationContent[];
  userProgress: UserProgress | null;
  currentLesson: EducationContent | null;
  isLoading: boolean;
  error: string | null;
}

export interface GoalState {
  goals: FinancialGoal[];
  isLoading: boolean;
  error: string | null;
}

// Tipos de API
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface OpenAIRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model: string;
  max_tokens: number;
  temperature: number;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

