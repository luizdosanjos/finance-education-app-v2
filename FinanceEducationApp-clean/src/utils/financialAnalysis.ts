import { Transaction, User, FinancialAnalysis } from '../types';

// Utilitários baseados em "Pai Rico, Pai Pobre"
export class PaiRicoAnalysis {
  // Classificar transação como ativo ou passivo
  static classifyTransaction(transaction: Transaction, user: User): 'asset' | 'liability' | 'neutral' {
    const { category, amount, description } = transaction;
    const monthlyIncome = user.monthlyIncome;

    // Ativos: geram renda ou se valorizam
    const assetKeywords = ['investimento', 'curso', 'livro', 'ação', 'fundo', 'imóvel', 'negócio'];
    const assetCategories = ['investment', 'education', 'business', 'real_estate'];

    // Passivos: geram gastos recorrentes
    const liabilityKeywords = ['financiamento', 'prestação', 'cartão', 'empréstimo'];
    const liabilityCategories = ['luxury', 'entertainment', 'debt', 'unnecessary'];

    // Verificar por palavras-chave na descrição
    const descriptionLower = description.toLowerCase();
    
    if (assetKeywords.some(keyword => descriptionLower.includes(keyword))) {
      return 'asset';
    }

    if (liabilityKeywords.some(keyword => descriptionLower.includes(keyword))) {
      return 'liability';
    }

    // Verificar por categoria
    if (assetCategories.includes(category)) {
      return 'asset';
    }

    if (liabilityCategories.includes(category)) {
      return 'liability';
    }

    // Verificar por valor (gastos altos podem ser passivos)
    if (amount > monthlyIncome * 0.15) {
      return 'liability';
    }

    return 'neutral';
  }

  // Calcular proporção ativos vs passivos
  static calculateAssetLiabilityRatio(transactions: Transaction[], user: User): {
    assetsTotal: number;
    liabilitiesTotal: number;
    ratio: number;
    recommendation: string;
  } {
    let assetsTotal = 0;
    let liabilitiesTotal = 0;

    transactions.forEach(transaction => {
      const classification = this.classifyTransaction(transaction, user);
      
      if (classification === 'asset') {
        assetsTotal += transaction.amount;
      } else if (classification === 'liability') {
        liabilitiesTotal += transaction.amount;
      }
    });

    const ratio = liabilitiesTotal > 0 ? assetsTotal / liabilitiesTotal : assetsTotal > 0 ? Infinity : 0;

    let recommendation = '';
    if (ratio < 0.5) {
      recommendation = 'Você está comprando muitos passivos! Foque em adquirir ativos que gerem renda.';
    } else if (ratio < 1) {
      recommendation = 'Bom progresso! Tente aumentar a proporção de ativos em relação aos passivos.';
    } else {
      recommendation = 'Excelente! Você está priorizando ativos sobre passivos, como ensina o Pai Rico.';
    }

    return { assetsTotal, liabilitiesTotal, ratio, recommendation };
  }

  // Analisar educação financeira (investimento em conhecimento)
  static analyzeFinancialEducation(transactions: Transaction[]): {
    educationSpending: number;
    percentage: number;
    recommendation: string;
  } {
    const educationCategories = ['education', 'books', 'courses'];
    const educationKeywords = ['curso', 'livro', 'educação', 'treinamento', 'workshop'];

    const educationTransactions = transactions.filter(t => {
      const descriptionLower = t.description.toLowerCase();
      return educationCategories.includes(t.category) || 
             educationKeywords.some(keyword => descriptionLower.includes(keyword));
    });

    const educationSpending = educationTransactions.reduce((total, t) => total + t.amount, 0);
    const totalSpending = transactions.filter(t => t.type === 'expense').reduce((total, t) => total + t.amount, 0);
    const percentage = totalSpending > 0 ? (educationSpending / totalSpending) * 100 : 0;

    let recommendation = '';
    if (percentage < 1) {
      recommendation = 'Invista mais em educação financeira! O Pai Rico diz que é o melhor investimento.';
    } else if (percentage < 3) {
      recommendation = 'Bom investimento em educação! Continue aprendendo para aumentar sua inteligência financeira.';
    } else {
      recommendation = 'Excelente! Você entende que educação é o ativo mais importante.';
    }

    return { educationSpending, percentage, recommendation };
  }
}

// Utilitários baseados em "Psicologia Financeira"
export class PsicologiaFinanceiraAnalysis {
  // Analisar padrões emocionais nos gastos
  static analyzeEmotionalSpending(transactions: Transaction[]): {
    emotionalSpending: number;
    patterns: { [key: string]: number };
    recommendation: string;
  } {
    const emotionalStates = ['stressed', 'sad', 'excited', 'anxious'];
    const emotionalTransactions = transactions.filter(t => 
      emotionalStates.includes(t.emotionalState)
    );

    const emotionalSpending = emotionalTransactions.reduce((total, t) => total + t.amount, 0);
    
    const patterns: { [key: string]: number } = {};
    emotionalTransactions.forEach(t => {
      patterns[t.emotionalState] = (patterns[t.emotionalState] || 0) + t.amount;
    });

    const totalSpending = transactions.filter(t => t.type === 'expense').reduce((total, t) => total + t.amount, 0);
    const emotionalPercentage = totalSpending > 0 ? (emotionalSpending / totalSpending) * 100 : 0;

    let recommendation = '';
    if (emotionalPercentage > 30) {
      recommendation = 'Cuidado! Muitos gastos emocionais. Implemente uma "pausa de 24h" antes de compras.';
    } else if (emotionalPercentage > 15) {
      recommendation = 'Alguns gastos emocionais detectados. Pratique mindfulness antes de comprar.';
    } else {
      recommendation = 'Bom controle emocional nos gastos! Continue assim.';
    }

    return { emotionalSpending, patterns, recommendation };
  }

  // Detectar gastos impulsivos
  static detectImpulsiveBehavior(transactions: Transaction[]): {
    impulsiveCount: number;
    impulsiveAmount: number;
    recommendation: string;
  } {
    // Gastos impulsivos: altos valores em estados emocionais ou sem planejamento
    const impulsiveTransactions = transactions.filter(t => {
      const isEmotional = ['excited', 'stressed', 'anxious'].includes(t.emotionalState);
      const isHighValue = t.amount > 200; // Valor configurável
      const isQuickDecision = t.description.length < 10; // Descrições vagas indicam falta de planejamento
      
      return isEmotional && (isHighValue || isQuickDecision);
    });

    const impulsiveCount = impulsiveTransactions.length;
    const impulsiveAmount = impulsiveTransactions.reduce((total, t) => total + t.amount, 0);

    let recommendation = '';
    if (impulsiveCount > 5) {
      recommendation = 'Padrão impulsivo detectado! Crie uma lista de desejos e espere 24h antes de comprar.';
    } else if (impulsiveCount > 2) {
      recommendation = 'Alguns gastos impulsivos. Questione-se: "Preciso realmente disso?" antes de comprar.';
    } else {
      recommendation = 'Bom controle de impulsos! Você pensa antes de gastar.';
    }

    return { impulsiveCount, impulsiveAmount, recommendation };
  }

  // Analisar consistência nos hábitos
  static analyzeConsistency(transactions: Transaction[]): {
    consistencyScore: number;
    recommendation: string;
  } {
    // Agrupar transações por semana
    const weeklySpending: { [key: string]: number } = {};
    
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const date = new Date(t.date);
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      weeklySpending[weekKey] = (weeklySpending[weekKey] || 0) + t.amount;
    });

    const spendingValues = Object.values(weeklySpending);
    if (spendingValues.length < 2) {
      return { consistencyScore: 100, recommendation: 'Dados insuficientes para análise.' };
    }

    // Calcular desvio padrão
    const mean = spendingValues.reduce((sum, val) => sum + val, 0) / spendingValues.length;
    const variance = spendingValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / spendingValues.length;
    const stdDev = Math.sqrt(variance);
    
    // Score de consistência (menor desvio = maior consistência)
    const consistencyScore = Math.max(0, 100 - (stdDev / mean) * 100);

    let recommendation = '';
    if (consistencyScore > 80) {
      recommendation = 'Excelente consistência nos gastos! Você tem bom controle financeiro.';
    } else if (consistencyScore > 60) {
      recommendation = 'Boa consistência. Tente manter um padrão mais regular de gastos.';
    } else {
      recommendation = 'Gastos muito variáveis. Crie um orçamento mensal e siga-o religiosamente.';
    }

    return { consistencyScore, recommendation };
  }
}

// Utilitários baseados em "O Homem Mais Rico da Babilônia"
export class BabiloniaAnalysis {
  // Verificar regra dos 10% (pagar-se primeiro)
  static checkTenPercentRule(transactions: Transaction[], user: User): {
    savingsAmount: number;
    savingsRate: number;
    isFollowingRule: boolean;
    recommendation: string;
  } {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);

    const savingsAmount = income - expenses;
    const savingsRate = income > 0 ? (savingsAmount / income) * 100 : 0;
    const isFollowingRule = savingsRate >= 10;

    let recommendation = '';
    if (savingsRate < 5) {
      recommendation = 'Urgente! Você não está poupando. Comece guardando pelo menos 5% e aumente gradualmente.';
    } else if (savingsRate < 10) {
      recommendation = 'Você está poupando, mas ainda não chegou aos 10%. Continue aumentando!';
    } else if (savingsRate < 20) {
      recommendation = 'Parabéns! Você segue a regra dos 10%. Considere aumentar para 15-20%.';
    } else {
      recommendation = 'Excelente! Você é um verdadeiro discípulo da Babilônia!';
    }

    return { savingsAmount, savingsRate, isFollowingRule, recommendation };
  }

  // Analisar disciplina financeira
  static analyzeDiscipline(transactions: Transaction[]): {
    disciplineScore: number;
    recommendation: string;
  } {
    let disciplineScore = 100;

    // Penalizar gastos desnecessários
    const unnecessaryCategories = ['luxury', 'entertainment', 'impulse'];
    const unnecessarySpending = transactions
      .filter(t => unnecessaryCategories.includes(t.category))
      .reduce((total, t) => total + t.amount, 0);

    const totalSpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);

    const unnecessaryPercentage = totalSpending > 0 ? (unnecessarySpending / totalSpending) * 100 : 0;
    disciplineScore -= unnecessaryPercentage;

    // Bonificar investimentos e educação
    const investmentCategories = ['investment', 'education', 'business'];
    const investmentSpending = transactions
      .filter(t => investmentCategories.includes(t.category))
      .reduce((total, t) => total + t.amount, 0);

    const investmentPercentage = totalSpending > 0 ? (investmentSpending / totalSpending) * 100 : 0;
    disciplineScore += investmentPercentage * 0.5;

    disciplineScore = Math.max(0, Math.min(100, disciplineScore));

    let recommendation = '';
    if (disciplineScore > 80) {
      recommendation = 'Excelente disciplina! Você tem o autocontrole dos sábios da Babilônia.';
    } else if (disciplineScore > 60) {
      recommendation = 'Boa disciplina. Continue focando no essencial e evitando gastos desnecessários.';
    } else {
      recommendation = 'Trabalhe sua disciplina. Lembre-se: "Uma parte de tudo que ganho é minha para guardar".';
    }

    return { disciplineScore, recommendation };
  }

  // Verificar proteção do patrimônio
  static analyzeWealthProtection(transactions: Transaction[]): {
    riskLevel: 'low' | 'medium' | 'high';
    recommendation: string;
  } {
    // Analisar gastos de alto risco
    const highRiskCategories = ['gambling', 'speculation', 'high_risk_investment'];
    const highRiskKeywords = ['aposta', 'jogo', 'especulação', 'day trade'];

    const riskyTransactions = transactions.filter(t => {
      const descriptionLower = t.description.toLowerCase();
      return highRiskCategories.includes(t.category) ||
             highRiskKeywords.some(keyword => descriptionLower.includes(keyword));
    });

    const riskyAmount = riskyTransactions.reduce((total, t) => total + t.amount, 0);
    const totalSpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);

    const riskPercentage = totalSpending > 0 ? (riskyAmount / totalSpending) * 100 : 0;

    let riskLevel: 'low' | 'medium' | 'high';
    let recommendation = '';

    if (riskPercentage > 10) {
      riskLevel = 'high';
      recommendation = 'Alto risco! Você está especulando demais. Proteja seu patrimônio com investimentos seguros.';
    } else if (riskPercentage > 5) {
      riskLevel = 'medium';
      recommendation = 'Risco moderado. Seja cauteloso e não arrisque mais do que pode perder.';
    } else {
      riskLevel = 'low';
      recommendation = 'Bom! Você protege seu patrimônio como ensinado na Babilônia.';
    }

    return { riskLevel, recommendation };
  }
}

// Classe principal de análise financeira
export class FinancialAnalysisUtils {
  static generateCompleteAnalysis(
    transactions: Transaction[], 
    user: User, 
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
  ): FinancialAnalysis {
    // Filtrar transações por período
    const filteredTransactions = this.filterTransactionsByPeriod(transactions, period);

    // Análises dos três livros
    const paiRicoAnalysis = PaiRicoAnalysis.calculateAssetLiabilityRatio(filteredTransactions, user);
    const psicologiaAnalysis = PsicologiaFinanceiraAnalysis.analyzeEmotionalSpending(filteredTransactions);
    const babiloniaAnalysis = BabiloniaAnalysis.checkTenPercentRule(filteredTransactions, user);

    // Cálculos básicos
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Score comportamental (média das análises)
    const disciplineScore = BabiloniaAnalysis.analyzeDiscipline(filteredTransactions).disciplineScore;
    const consistencyScore = PsicologiaFinanceiraAnalysis.analyzeConsistency(filteredTransactions).consistencyScore;
    const behaviorScore = (disciplineScore + consistencyScore) / 2;

    // Recomendações consolidadas
    const recommendations = [
      paiRicoAnalysis.recommendation,
      psicologiaAnalysis.recommendation,
      babiloniaAnalysis.recommendation
    ];

    // Tendências (comparar com período anterior)
    const trends = this.calculateTrends(transactions, period);

    return {
      userId: user.id,
      period,
      totalIncome,
      totalExpenses,
      savingsRate,
      assetsPurchased: paiRicoAnalysis.assetsTotal,
      liabilitiesPurchased: paiRicoAnalysis.liabilitiesTotal,
      behaviorScore,
      recommendations,
      trends
    };
  }

  private static filterTransactionsByPeriod(
    transactions: Transaction[], 
    period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ): Transaction[] {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  }

  private static calculateTrends(
    transactions: Transaction[], 
    period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  ): any[] {
    // Implementação simplificada - comparar com período anterior
    return [
      {
        category: 'gastos_totais',
        direction: 'stable' as const,
        percentage: 0,
        description: 'Gastos mantidos em relação ao período anterior'
      }
    ];
  }

  // Gerar dicas personalizadas baseadas na análise
  static generatePersonalizedTips(analysis: FinancialAnalysis, user: User): string[] {
    const tips: string[] = [];

    // Dicas baseadas na taxa de poupança
    if (analysis.savingsRate < 10) {
      tips.push('💰 Comece guardando 1% da sua renda e aumente 1% a cada mês até chegar aos 10%.');
    }

    // Dicas baseadas no score comportamental
    if (analysis.behaviorScore < 70) {
      tips.push('🧠 Pratique mindfulness antes de fazer compras. Pergunte-se: "Isso é um ativo ou passivo?"');
    }

    // Dicas baseadas na proporção ativos/passivos
    if (analysis.liabilitiesPurchased > analysis.assetsPurchased) {
      tips.push('📈 Foque em comprar ativos que gerem renda, como cursos, livros ou investimentos.');
    }

    return tips;
  }
}

