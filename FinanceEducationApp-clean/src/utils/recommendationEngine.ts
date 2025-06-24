import { Transaction, User, FinancialGoal } from '../types';
import { FinancialAnalysisUtils, PaiRicoAnalysis, PsicologiaFinanceiraAnalysis, BabiloniaAnalysis } from './financialAnalysis';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'spending' | 'saving' | 'investing' | 'education' | 'behavior';
  bookReference: 'pai_rico_pai_pobre' | 'psicologia_financeira' | 'homem_mais_rico_babilonia';
  actionSteps: string[];
  expectedImpact: string;
  timeframe: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PersonalizedRecommendations {
  urgent: Recommendation[];
  important: Recommendation[];
  suggested: Recommendation[];
  educational: Recommendation[];
}

export class RecommendationEngine {
  
  static generatePersonalizedRecommendations(
    transactions: Transaction[],
    user: User,
    goals?: FinancialGoal[]
  ): PersonalizedRecommendations {
    
    const recommendations: Recommendation[] = [];
    
    // Análises dos três livros
    const paiRicoData = PaiRicoAnalysis.calculateAssetLiabilityRatio(transactions, user);
    const emotionalData = PsicologiaFinanceiraAnalysis.analyzeEmotionalSpending(transactions);
    const tenPercentData = BabiloniaAnalysis.checkTenPercentRule(transactions, user);
    const disciplineData = BabiloniaAnalysis.analyzeDiscipline(transactions);
    
    // Recomendações baseadas em Pai Rico, Pai Pobre
    recommendations.push(...this.generatePaiRicoRecommendations(paiRicoData, transactions, user));
    
    // Recomendações baseadas em Psicologia Financeira
    recommendations.push(...this.generatePsicologiaRecommendations(emotionalData, transactions, user));
    
    // Recomendações baseadas em O Homem Mais Rico da Babilônia
    recommendations.push(...this.generateBabiloniaRecommendations(tenPercentData, disciplineData, user));
    
    // Recomendações baseadas em metas
    if (goals && goals.length > 0) {
      recommendations.push(...this.generateGoalBasedRecommendations(goals, transactions, user));
    }
    
    // Categorizar por prioridade
    return this.categorizeRecommendations(recommendations);
  }
  
  private static generatePaiRicoRecommendations(
    analysis: any,
    transactions: Transaction[],
    user: User
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Se está comprando mais passivos que ativos
    if (analysis.liabilitiesTotal > analysis.assetsTotal) {
      recommendations.push({
        id: 'pai_rico_assets_vs_liabilities',
        title: 'Foque em Ativos, não Passivos',
        description: 'Você está gastando mais em passivos (coisas que tiram dinheiro do seu bolso) do que em ativos (coisas que colocam dinheiro no seu bolso).',
        priority: 'high',
        category: 'investing',
        bookReference: 'pai_rico_pai_pobre',
        actionSteps: [
          'Antes de cada compra, pergunte: "Isso vai colocar ou tirar dinheiro do meu bolso?"',
          'Reduza gastos com eletrônicos, carros caros e itens de luxo',
          'Invista em cursos, ações, fundos imobiliários ou negócios',
          'Estabeleça uma meta: 70% dos gastos extras em ativos'
        ],
        expectedImpact: 'Aumento da renda passiva e redução de gastos desnecessários',
        timeframe: '3-6 meses',
        difficulty: 'medium'
      });
    }
    
    // Se não está investindo em educação financeira
    const educationSpending = transactions
      .filter(t => t.category === 'education' && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (educationSpending < user.monthlyIncome * 0.03) { // Menos de 3% da renda
      recommendations.push({
        id: 'pai_rico_financial_education',
        title: 'Invista em Educação Financeira',
        description: 'Seu ativo mais importante é sua mente. Você está investindo pouco em educação financeira.',
        priority: 'high',
        category: 'education',
        bookReference: 'pai_rico_pai_pobre',
        actionSteps: [
          'Destine pelo menos 3% da renda para educação',
          'Leia livros sobre investimentos e finanças',
          'Faça cursos online sobre mercado financeiro',
          'Participe de grupos de investidores',
          'Acompanhe canais especializados em finanças'
        ],
        expectedImpact: 'Melhores decisões financeiras e aumento da renda',
        timeframe: '1-3 meses',
        difficulty: 'easy'
      });
    }
    
    return recommendations;
  }
  
  private static generatePsicologiaRecommendations(
    analysis: any,
    transactions: Transaction[],
    user: User
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Se há muitos gastos emocionais
    if (analysis.emotionalSpending > user.monthlyIncome * 0.2) { // Mais de 20% da renda
      recommendations.push({
        id: 'psicologia_emotional_spending',
        title: 'Controle os Gastos Emocionais',
        description: 'Você está gastando muito por impulso emocional. Isso pode prejudicar seus objetivos financeiros.',
        priority: 'high',
        category: 'behavior',
        bookReference: 'psicologia_financeira',
        actionSteps: [
          'Implemente a regra das 24 horas: espere um dia antes de compras não essenciais',
          'Identifique seus gatilhos emocionais (estresse, tristeza, ansiedade)',
          'Crie alternativas saudáveis para lidar com emoções',
          'Use uma lista de compras e siga rigorosamente',
          'Pratique mindfulness antes de decisões financeiras'
        ],
        expectedImpact: 'Redução de 30-50% nos gastos impulsivos',
        timeframe: '2-4 semanas',
        difficulty: 'medium'
      });
    }
    
    // Se há inconsistência nos gastos
    const consistency = PsicologiaFinanceiraAnalysis.analyzeConsistency(transactions);
    if (consistency.consistencyScore < 70) {
      recommendations.push({
        id: 'psicologia_consistency',
        title: 'Desenvolva Consistência Financeira',
        description: 'Seus hábitos financeiros são inconsistentes. A consistência é fundamental para o sucesso financeiro.',
        priority: 'medium',
        category: 'behavior',
        bookReference: 'psicologia_financeira',
        actionSteps: [
          'Crie um orçamento mensal e siga-o religiosamente',
          'Automatize poupanças e investimentos',
          'Revise seus gastos semanalmente',
          'Estabeleça rotinas financeiras fixas',
          'Use aplicativos para acompanhar gastos diariamente'
        ],
        expectedImpact: 'Maior previsibilidade e controle financeiro',
        timeframe: '1-2 meses',
        difficulty: 'medium'
      });
    }
    
    return recommendations;
  }
  
  private static generateBabiloniaRecommendations(
    tenPercentData: any,
    disciplineData: any,
    user: User
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Se não está seguindo a regra dos 10%
    if (!tenPercentData.isFollowingRule) {
      recommendations.push({
        id: 'babilonia_ten_percent_rule',
        title: 'Implemente a Regra dos 10%',
        description: 'Você não está guardando pelo menos 10% da sua renda. Esta é a base fundamental da riqueza.',
        priority: 'high',
        category: 'saving',
        bookReference: 'homem_mais_rico_babilonia',
        actionSteps: [
          'Pague-se primeiro: separe 10% assim que receber',
          'Abra uma conta poupança separada para este valor',
          'Automatize a transferência no dia do pagamento',
          'Trate essa poupança como uma conta intocável',
          'Aumente gradualmente para 15% ou 20%'
        ],
        expectedImpact: 'Criação de reserva de emergência e base para investimentos',
        timeframe: '1 mês',
        difficulty: 'easy'
      });
    }
    
    // Se a disciplina está baixa
    if (disciplineData.disciplineScore < 80) {
      recommendations.push({
        id: 'babilonia_discipline',
        title: 'Fortaleça sua Disciplina Financeira',
        description: 'Sua disciplina financeira precisa melhorar. A disciplina é o que separa os ricos dos pobres.',
        priority: 'medium',
        category: 'behavior',
        bookReference: 'homem_mais_rico_babilonia',
        actionSteps: [
          'Defina regras claras para seus gastos',
          'Crie consequências para quando quebrar as regras',
          'Celebre pequenas vitórias de disciplina',
          'Encontre um parceiro de accountability',
          'Pratique o autocontrole em pequenas decisões diárias'
        ],
        expectedImpact: 'Maior controle sobre impulsos e decisões mais racionais',
        timeframe: '2-3 meses',
        difficulty: 'hard'
      });
    }
    
    return recommendations;
  }
  
  private static generateGoalBasedRecommendations(
    goals: FinancialGoal[],
    transactions: Transaction[],
    user: User
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    goals.forEach(goal => {
      if (goal.status === 'active') {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const monthsLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));
        const monthlyNeeded = (goal.targetAmount - goal.currentAmount) / monthsLeft;
        
        if (monthlyNeeded > user.monthlyIncome * 0.3) { // Mais de 30% da renda
          recommendations.push({
            id: `goal_adjustment_${goal.id}`,
            title: `Ajuste a Meta: ${goal.title}`,
            description: `Para atingir sua meta "${goal.title}", você precisaria poupar ${((monthlyNeeded / user.monthlyIncome) * 100).toFixed(1)}% da sua renda mensal, o que pode ser insustentável.`,
            priority: 'medium',
            category: 'saving',
            bookReference: 'psicologia_financeira',
            actionSteps: [
              'Revise o prazo da meta para algo mais realista',
              'Considere reduzir o valor alvo',
              'Busque fontes de renda extra',
              'Otimize seus gastos para liberar mais dinheiro',
              'Divida a meta em marcos menores'
            ],
            expectedImpact: 'Meta mais alcançável e menos estresse financeiro',
            timeframe: '1 semana',
            difficulty: 'easy'
          });
        }
      }
    });
    
    return recommendations;
  }
  
  private static categorizeRecommendations(recommendations: Recommendation[]): PersonalizedRecommendations {
    return {
      urgent: recommendations.filter(r => r.priority === 'high' && (r.category === 'saving' || r.category === 'behavior')),
      important: recommendations.filter(r => r.priority === 'high' && r.category !== 'saving' && r.category !== 'behavior'),
      suggested: recommendations.filter(r => r.priority === 'medium'),
      educational: recommendations.filter(r => r.priority === 'low' || r.category === 'education')
    };
  }
  
  // Método para gerar recomendação específica baseada em uma transação
  static generateTransactionRecommendation(
    transaction: Transaction,
    user: User,
    recentTransactions: Transaction[]
  ): Recommendation | null {
    
    // Análise de gasto alto
    if (transaction.type === 'expense' && transaction.amount > user.monthlyIncome * 0.1) {
      
      // Se é um passivo caro
      if (transaction.classification === 'liability') {
        return {
          id: `transaction_${transaction.id}_liability`,
          title: 'Cuidado com este Passivo',
          description: `Você gastou R$ ${transaction.amount.toFixed(2)} em "${transaction.description}". Segundo o Pai Rico, isso é um passivo que tira dinheiro do seu bolso.`,
          priority: 'high',
          category: 'spending',
          bookReference: 'pai_rico_pai_pobre',
          actionSteps: [
            'Avalie se essa compra era realmente necessária',
            'Considere vender o item se não agregar valor',
            'Na próxima vez, pense: "Isso vai me enriquecer ou empobrecer?"',
            'Use esse valor para comprar ativos no futuro'
          ],
          expectedImpact: 'Redução de gastos em passivos e foco em ativos',
          timeframe: 'Imediato',
          difficulty: 'easy'
        };
      }
      
      // Se é um gasto emocional
      if (transaction.emotionalState && ['excited', 'stressed', 'sad'].includes(transaction.emotionalState)) {
        return {
          id: `transaction_${transaction.id}_emotional`,
          title: 'Gasto Emocional Detectado',
          description: `Você fez uma compra de R$ ${transaction.amount.toFixed(2)} em estado emocional. A Psicologia Financeira nos ensina que emoções podem prejudicar decisões financeiras.`,
          priority: 'medium',
          category: 'behavior',
          bookReference: 'psicologia_financeira',
          actionSteps: [
            'Reflita sobre o que estava sentindo na hora da compra',
            'Identifique padrões emocionais nos seus gastos',
            'Crie estratégias para lidar com essas emoções',
            'Implemente a regra das 24 horas para compras futuras'
          ],
          expectedImpact: 'Maior consciência emocional nas decisões financeiras',
          timeframe: '1 semana',
          difficulty: 'medium'
        };
      }
    }
    
    return null;
  }
  
  // Método para gerar dicas diárias baseadas no perfil
  static generateDailyTip(user: User, transactions: Transaction[]): string {
    const tips = {
      pai_rico: [
        'Antes de comprar algo hoje, pergunte: "Isso é um ativo ou passivo?"',
        'Lembre-se: os ricos compram ativos primeiro, luxos depois.',
        'Sua casa não é um ativo se você mora nela - ela é um passivo.',
        'Invista em sua educação financeira hoje, mesmo que seja só 15 minutos.',
        'Pense como um empresário: como posso gerar renda com isso?'
      ],
      psicologia: [
        'Suas emoções podem ser seu maior inimigo financeiro hoje.',
        'Antes de gastar, respire fundo e conte até 10.',
        'O dinheiro é mais sobre comportamento do que sobre matemática.',
        'Pequenas decisões consistentes criam grandes resultados.',
        'Não compare seus gastos com os dos outros - cada um tem sua jornada.'
      ],
      babilonia: [
        'Pague-se primeiro hoje - guarde pelo menos 10% do que ganhar.',
        'Uma parte de tudo que você ganha é sua para guardar.',
        'Controle seus gastos e não deixe que eles controlem você.',
        'Busque conselhos daqueles que são bem-sucedidos com dinheiro.',
        'Proteja seu dinheiro de perdas - não invista no que não conhece.'
      ]
    };
    
    const categories = Object.keys(tips) as Array<keyof typeof tips>;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryTips = tips[randomCategory];
    const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];
    
    return randomTip;
  }
}

