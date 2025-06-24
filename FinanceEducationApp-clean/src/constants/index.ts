// Cores baseadas no design do Nubank
export const COLORS = {
  primary: '#8A05BE',      // Roxo Nubank
  secondary: '#E6E6FA',    // Lavanda claro
  success: '#00C851',      // Verde
  warning: '#FF8800',      // Laranja
  danger: '#FF4444',       // Vermelho
  background: '#F8F9FA',   // Cinza claro
  text: '#212529',         // Cinza escuro
  white: '#FFFFFF',
  gray: '#6C757D',
  lightGray: '#E9ECEF',
  darkGray: '#495057'
};

// Tipografia
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: 'normal' as const },
  caption: { fontSize: 14, fontWeight: 'normal' as const },
  small: { fontSize: 12, fontWeight: 'normal' as const }
};

// Espaçamentos
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

// Configurações da API OpenAI
export const OPENAI_CONFIG = {
  baseURL: 'https://api.openai.com/v1',
  model: 'gpt-4',
  maxTokens: 200,
  temperature: 0.7
};

// Categorias de gastos
export const EXPENSE_CATEGORIES = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  NEUTRAL: 'neutral'
};

// Tipos de transação
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

// Estados emocionais
export const EMOTIONAL_STATES = {
  HAPPY: 'happy',
  SAD: 'sad',
  STRESSED: 'stressed',
  NEUTRAL: 'neutral',
  EXCITED: 'excited',
  ANXIOUS: 'anxious'
};

// Referências dos livros
export const BOOK_REFERENCES = {
  PAI_RICO: 'pai_rico_pai_pobre',
  PSICOLOGIA: 'psicologia_financeira',
  BABILONIA: 'homem_mais_rico_babilonia'
};

// Configurações do usuário
export const USER_RISK_TOLERANCE = {
  CONSERVATIVE: 'conservative',
  MODERATE: 'moderate',
  AGGRESSIVE: 'aggressive'
};

export const FINANCIAL_KNOWLEDGE = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

export const BEHAVIOR_PATTERNS = {
  IMPULSIVE: 'impulsive',
  ANALYTICAL: 'analytical',
  EMOTIONAL: 'emotional'
};

