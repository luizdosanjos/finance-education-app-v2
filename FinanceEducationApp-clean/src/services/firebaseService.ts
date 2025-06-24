import firestore from '@react-native-firebase/firestore';
import { User, Transaction, ChatMessage, FinancialGoal, MonthlyStats } from '../types';

class FirebaseService {
  private db = firestore();

  // Configuração personalizada para Luiz Henrique
  private readonly PROJECT_ID = 'alcancar-931eb';
  private readonly USER_ID = 'luiz_henrique_finance_app';

  // ===== USUÁRIOS =====
  async getUser(userId: string = this.USER_ID): Promise<User | null> {
    try {
      const userDoc = await this.db.collection('users').doc(userId).get();
      
      if (userDoc.exists()) {
        return { id: userId, ...userDoc.data() } as User;
      }
      
      // Criar perfil personalizado do Luiz Henrique se não existir
      const newUser: User = {
        id: userId,
        name: 'Luiz Henrique dos Anjos da Silva',
        email: 'luiz.henrique@financeeducation.app',
        monthlyIncome: 12000,
        savingsGoal: 30000,
        currentDebt: 30000,
        debtPaid: 0,
        financialProfile: 'debt_recovery', // Perfil específico para quem tem dívidas
        riskTolerance: 'conservative', // Conservador devido às dívidas
        educationLevel: 'intermediate',
        emotionalState: 'motivated', // Motivado para sair das dívidas
        personalityType: 'disciplined_achiever', // Baseado no perfil de alta renda
        primaryGoal: 'debt_elimination', // Foco principal: eliminar dívidas
        secondaryGoal: 'wealth_building', // Objetivo secundário: construir riqueza
        preferredLearningStyle: 'practical', // Aprendizado prático
        motivationalTriggers: ['progress_tracking', 'milestone_celebration', 'debt_freedom'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await this.db.collection('users').doc(userId).set(newUser);
      return newUser;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      await this.db.collection('users').doc(userId).update({
        ...userData,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // ===== TRANSAÇÕES =====
  async addTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
    try {
      const transactionData = {
        ...transaction,
        userId,
        createdAt: new Date(),
      };

      const docRef = await this.db.collection('transactions').add(transactionData);
      
      // Atualizar estatísticas mensais
      await this.updateMonthlyStats(userId, transaction);
      
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
  }

  async getTransactions(userId: string = this.USER_ID, limit: number = 50): Promise<Transaction[]> {
    try {
      const snapshot = await this.db
        .collection('transactions')
        .where('userId', '==', userId)
        .orderBy('date', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
  }

  // ===== CHAT MESSAGES =====
  async addChatMessage(userId: string, message: {
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    sessionType: string;
    context: string;
  }): Promise<string> {
    try {
      const messageData = {
        ...message,
        userId,
        createdAt: new Date(),
      };

      const docRef = await this.db.collection('chatMessages').add(messageData);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar mensagem:', error);
      throw error;
    }
  }

  async getChatMessages(userId: string = this.USER_ID, limit: number = 100): Promise<ChatMessage[]> {
    try {
      const snapshot = await this.db
        .collection('chatMessages')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        content: doc.data().text, // Mapear text para content
        sender: doc.data().sender,
        timestamp: doc.data().timestamp.toDate(),
        context: doc.data().context,
      })) as ChatMessage[];
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
  }

  async getChatMessagesBySession(userId: string, sessionType: string): Promise<ChatMessage[]> {
    try {
      const snapshot = await this.db
        .collection('chatMessages')
        .where('userId', '==', userId)
        .where('sessionType', '==', sessionType)
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        content: doc.data().text, // Mapear text para content
        sender: doc.data().sender,
        timestamp: doc.data().timestamp.toDate(),
        context: doc.data().context,
      })) as ChatMessage[];
    } catch (error) {
      console.error('Erro ao buscar mensagens por sessão:', error);
      return [];
    }
  }

  // ===== ESTATÍSTICAS MENSAIS =====
  async getMonthlyStats(userId: string = this.USER_ID, year: number, month: number): Promise<MonthlyStats | null> {
    try {
      const statId = `${userId}_${year}_${month}`;
      const statDoc = await this.db.collection('monthlyStats').doc(statId).get();
      
      if (statDoc.exists()) {
        return { id: statId, ...statDoc.data() } as MonthlyStats;
      }
      
      // Calcular estatísticas se não existir
      return await this.calculateMonthlyStats(userId, year, month);
    } catch (error) {
      console.error('Erro ao buscar estatísticas mensais:', error);
      return null;
    }
  }

  private async calculateMonthlyStats(userId: string, year: number, month: number): Promise<MonthlyStats> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const snapshot = await this.db
        .collection('transactions')
        .where('userId', '==', userId)
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .get();

      let income = 0;
      let expenses = 0;
      let assets = 0;
      let liabilities = 0;
      let debtPayments = 0;

      snapshot.docs.forEach(doc => {
        const transaction = doc.data() as Transaction;
        
        if (transaction.type === 'income') {
          income += transaction.amount;
        } else {
          expenses += transaction.amount;
          
          // Tracking específico para pagamento de dívidas
          if (transaction.category === 'Pagamento de Dívida') {
            debtPayments += transaction.amount;
          }
          
          if (transaction.classification === 'asset') {
            assets += transaction.amount;
          } else {
            liabilities += transaction.amount;
          }
        }
      });

      const savings = income - expenses;
      const savingsRate = income > 0 ? (savings / income) * 100 : 0;
      const debtPaymentRate = income > 0 ? (debtPayments / income) * 100 : 0;

      const stats: MonthlyStats = {
        id: `${userId}_${year}_${month}`,
        userId,
        year,
        month,
        income,
        expenses,
        savings,
        savingsRate,
        assets,
        liabilities,
        debtPayments,
        debtPaymentRate,
        updatedAt: new Date(),
      };

      // Salvar no Firebase
      await this.db.collection('monthlyStats').doc(stats.id).set(stats);
      
      return stats;
    } catch (error) {
      console.error('Erro ao calcular estatísticas mensais:', error);
      throw error;
    }
  }

  private async updateMonthlyStats(userId: string, transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<void> {
    try {
      const date = new Date(transaction.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      await this.calculateMonthlyStats(userId, year, month);
    } catch (error) {
      console.error('Erro ao atualizar estatísticas mensais:', error);
    }
  }

  // ===== METAS FINANCEIRAS =====
  async addFinancialGoal(userId: string, goal: Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const goalData = {
        ...goal,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await this.db.collection('financialGoals').add(goalData);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar meta financeira:', error);
      throw error;
    }
  }

  async getFinancialGoals(userId: string = this.USER_ID): Promise<FinancialGoal[]> {
    try {
      const snapshot = await this.db
        .collection('financialGoals')
        .where('userId', '==', userId)
        .where('status', '==', 'active')
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FinancialGoal[];
    } catch (error) {
      console.error('Erro ao buscar metas financeiras:', error);
      return [];
    }
  }

  // ===== ANÁLISE DE PROGRESSO DE DÍVIDAS =====
  async getDebtProgress(userId: string = this.USER_ID): Promise<{
    totalDebt: number;
    paidAmount: number;
    remainingDebt: number;
    progressPercentage: number;
    monthlyPaymentAverage: number;
    estimatedPayoffDate: Date;
  }> {
    try {
      const user = await this.getUser(userId);
      if (!user) throw new Error('Usuário não encontrado');

      // Buscar todos os pagamentos de dívida
      const snapshot = await this.db
        .collection('transactions')
        .where('userId', '==', userId)
        .where('category', '==', 'Pagamento de Dívida')
        .orderBy('date', 'asc')
        .get();

      let totalPaid = 0;
      const payments: number[] = [];

      snapshot.docs.forEach(doc => {
        const transaction = doc.data() as Transaction;
        totalPaid += transaction.amount;
        payments.push(transaction.amount);
      });

      const totalDebt = user.currentDebt || 30000;
      const remainingDebt = Math.max(0, totalDebt - totalPaid);
      const progressPercentage = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;
      
      // Calcular média mensal de pagamentos
      const monthlyPaymentAverage = payments.length > 0 
        ? payments.reduce((sum, payment) => sum + payment, 0) / payments.length 
        : 0;

      // Estimar data de quitação
      const monthsToPayoff = monthlyPaymentAverage > 0 
        ? Math.ceil(remainingDebt / monthlyPaymentAverage) 
        : 0;
      
      const estimatedPayoffDate = new Date();
      estimatedPayoffDate.setMonth(estimatedPayoffDate.getMonth() + monthsToPayoff);

      return {
        totalDebt,
        paidAmount: totalPaid,
        remainingDebt,
        progressPercentage,
        monthlyPaymentAverage,
        estimatedPayoffDate,
      };
    } catch (error) {
      console.error('Erro ao calcular progresso de dívidas:', error);
      throw error;
    }
  }

  // ===== INICIALIZAÇÃO DE DADOS PERSONALIZADOS =====
  async initializeLuizHenriqueData(userId: string = this.USER_ID): Promise<void> {
    try {
      // Criar usuário personalizado
      await this.getUser(userId);
      
      // Adicionar transações específicas para o perfil do Luiz Henrique
      const personalizedTransactions = [
        {
          userId,
          type: 'income' as const,
          amount: 12000,
          category: 'Salário',
          description: 'Salário mensal - Luiz Henrique',
          date: new Date(),
          classification: 'asset' as const,
          emotionalState: 'neutral' as const,
          isRecurring: true,
        },
        {
          userId,
          type: 'expense' as const,
          amount: 2500,
          category: 'Pagamento de Dívida',
          description: 'Pagamento mensal das dívidas',
          date: new Date(),
          classification: 'liability' as const,
          emotionalState: 'motivated' as const,
          isRecurring: true,
        },
        {
          userId,
          type: 'expense' as const,
          amount: 2000,
          category: 'Moradia',
          description: 'Aluguel e condomínio',
          date: new Date(),
          classification: 'liability' as const,
          emotionalState: 'neutral' as const,
          isRecurring: true,
        },
        {
          userId,
          type: 'expense' as const,
          amount: 800,
          category: 'Alimentação',
          description: 'Supermercado e refeições',
          date: new Date(),
          classification: 'liability' as const,
          emotionalState: 'neutral' as const,
          isRecurring: false,
        },
        {
          userId,
          type: 'expense' as const,
          amount: 600,
          category: 'Educação',
          description: 'Curso de educação financeira e livros',
          date: new Date(),
          classification: 'asset' as const,
          emotionalState: 'excited' as const,
          isRecurring: false,
        },
        {
          userId,
          type: 'expense' as const,
          amount: 1200,
          category: 'Poupança',
          description: 'Reserva de emergência',
          date: new Date(),
          classification: 'asset' as const,
          emotionalState: 'satisfied' as const,
          isRecurring: true,
        },
      ];

      for (const transaction of personalizedTransactions) {
        await this.addTransaction(userId, transaction);
      }

      // Adicionar metas específicas para o Luiz Henrique
      const personalizedGoals = [
        {
          userId,
          title: 'Quitar Todas as Dívidas',
          targetAmount: 30000,
          currentAmount: 0,
          deadline: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000), // 12 meses
          category: 'debt_payoff' as const,
          status: 'active' as const,
          priority: 'high' as const,
          description: 'Meta principal: eliminar todas as dívidas em 12 meses',
        },
        {
          userId,
          title: 'Reserva de Emergência',
          targetAmount: 36000, // 3x a renda mensal
          currentAmount: 1200,
          deadline: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000), // 18 meses
          category: 'emergency_fund' as const,
          status: 'active' as const,
          priority: 'medium' as const,
          description: 'Construir reserva equivalente a 3 meses de renda',
        },
        {
          userId,
          title: 'Investimentos Mensais',
          targetAmount: 2000, // Meta mensal
          currentAmount: 0,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 mês
          category: 'investment' as const,
          status: 'active' as const,
          priority: 'medium' as const,
          description: 'Investir R$ 2.000 mensalmente após quitar dívidas',
        },
      ];

      for (const goal of personalizedGoals) {
        await this.addFinancialGoal(userId, goal);
      }

      // Adicionar mensagem de boas-vindas personalizada
      await this.addChatMessage(userId, {
        text: `Olá, Luiz Henrique! 👋\n\nSou seu consultor financeiro pessoal especializado em quitação de dívidas e construção de riqueza.\n\nAnalisei seu perfil:\n💰 Renda: R$ 12.000/mês\n🎯 Meta: Quitar R$ 30.000 em dívidas\n📊 Estratégia: Foco em disciplina e consistência\n\nBaseado nos livros "Pai Rico, Pai Pobre", "Psicologia Financeira" e "O Homem Mais Rico da Babilônia", vou te ajudar a:\n\n1️⃣ Quitar suas dívidas de forma estratégica\n2️⃣ Construir uma reserva de emergência\n3️⃣ Desenvolver mentalidade de investidor\n4️⃣ Alcançar liberdade financeira\n\nComo posso ajudá-lo hoje?`,
        sender: 'ai',
        timestamp: new Date(),
        sessionType: 'welcome',
        context: 'personalized_welcome',
      });

      console.log('Dados personalizados do Luiz Henrique inicializados com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar dados do Luiz Henrique:', error);
      throw error;
    }
  }
}

export default new FirebaseService();

