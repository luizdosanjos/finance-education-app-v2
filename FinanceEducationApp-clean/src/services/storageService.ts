import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Transaction, ChatSession, FinancialGoal } from '../types';

class StorageService {
  // Chaves para armazenamento
  private static readonly KEYS = {
    USER: '@FinanceApp:user',
    TRANSACTIONS: '@FinanceApp:transactions',
    CHAT_SESSIONS: '@FinanceApp:chatSessions',
    GOALS: '@FinanceApp:goals',
    SETTINGS: '@FinanceApp:settings',
    ONBOARDING: '@FinanceApp:onboarding'
  };

  // Métodos para usuário
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(StorageService.KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      return null;
    }
  }

  async updateUser(updates: Partial<User>): Promise<void> {
    try {
      const currentUser = await this.getUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates, updatedAt: new Date() };
        await this.saveUser(updatedUser);
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Métodos para transações
  async saveTransaction(transaction: Transaction): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const updatedTransactions = [...transactions, transaction];
      await AsyncStorage.setItem(
        StorageService.KEYS.TRANSACTIONS, 
        JSON.stringify(updatedTransactions)
      );
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      throw error;
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    try {
      const transactionsData = await AsyncStorage.getItem(StorageService.KEYS.TRANSACTIONS);
      return transactionsData ? JSON.parse(transactionsData) : [];
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      return [];
    }
  }

  async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const updatedTransactions = transactions.map(t => 
        t.id === transactionId ? { ...t, ...updates } : t
      );
      await AsyncStorage.setItem(
        StorageService.KEYS.TRANSACTIONS, 
        JSON.stringify(updatedTransactions)
      );
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const filteredTransactions = transactions.filter(t => t.id !== transactionId);
      await AsyncStorage.setItem(
        StorageService.KEYS.TRANSACTIONS, 
        JSON.stringify(filteredTransactions)
      );
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  }

  // Métodos para sessões de chat
  async saveChatSession(session: ChatSession): Promise<void> {
    try {
      const sessions = await this.getChatSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      await AsyncStorage.setItem(
        StorageService.KEYS.CHAT_SESSIONS, 
        JSON.stringify(sessions)
      );
    } catch (error) {
      console.error('Erro ao salvar sessão de chat:', error);
      throw error;
    }
  }

  async getChatSessions(): Promise<ChatSession[]> {
    try {
      const sessionsData = await AsyncStorage.getItem(StorageService.KEYS.CHAT_SESSIONS);
      return sessionsData ? JSON.parse(sessionsData) : [];
    } catch (error) {
      console.error('Erro ao carregar sessões de chat:', error);
      return [];
    }
  }

  async deleteChatSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getChatSessions();
      const filteredSessions = sessions.filter(s => s.id !== sessionId);
      await AsyncStorage.setItem(
        StorageService.KEYS.CHAT_SESSIONS, 
        JSON.stringify(filteredSessions)
      );
    } catch (error) {
      console.error('Erro ao deletar sessão de chat:', error);
      throw error;
    }
  }

  // Métodos para metas financeiras
  async saveGoal(goal: FinancialGoal): Promise<void> {
    try {
      const goals = await this.getGoals();
      const existingIndex = goals.findIndex(g => g.id === goal.id);
      
      if (existingIndex >= 0) {
        goals[existingIndex] = goal;
      } else {
        goals.push(goal);
      }
      
      await AsyncStorage.setItem(StorageService.KEYS.GOALS, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      throw error;
    }
  }

  async getGoals(): Promise<FinancialGoal[]> {
    try {
      const goalsData = await AsyncStorage.getItem(StorageService.KEYS.GOALS);
      return goalsData ? JSON.parse(goalsData) : [];
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      return [];
    }
  }

  async deleteGoal(goalId: string): Promise<void> {
    try {
      const goals = await this.getGoals();
      const filteredGoals = goals.filter(g => g.id !== goalId);
      await AsyncStorage.setItem(StorageService.KEYS.GOALS, JSON.stringify(filteredGoals));
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      throw error;
    }
  }

  // Métodos para configurações
  async saveSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw error;
    }
  }

  async getSettings(): Promise<any> {
    try {
      const settingsData = await AsyncStorage.getItem(StorageService.KEYS.SETTINGS);
      return settingsData ? JSON.parse(settingsData) : {};
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return {};
    }
  }

  // Métodos para onboarding
  async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.ONBOARDING, 'true');
    } catch (error) {
      console.error('Erro ao marcar onboarding como completo:', error);
      throw error;
    }
  }

  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const completed = await AsyncStorage.getItem(StorageService.KEYS.ONBOARDING);
      return completed === 'true';
    } catch (error) {
      console.error('Erro ao verificar onboarding:', error);
      return false;
    }
  }

  // Métodos utilitários
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(StorageService.KEYS));
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw error;
    }
  }

  async exportData(): Promise<string> {
    try {
      const user = await this.getUser();
      const transactions = await this.getTransactions();
      const goals = await this.getGoals();
      const settings = await this.getSettings();

      const exportData = {
        user,
        transactions,
        goals,
        settings,
        exportDate: new Date().toISOString()
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.user) await this.saveUser(data.user);
      if (data.transactions) {
        await AsyncStorage.setItem(
          StorageService.KEYS.TRANSACTIONS, 
          JSON.stringify(data.transactions)
        );
      }
      if (data.goals) {
        await AsyncStorage.setItem(StorageService.KEYS.GOALS, JSON.stringify(data.goals));
      }
      if (data.settings) await this.saveSettings(data.settings);
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw error;
    }
  }

  // Métodos para análise de dados
  async getTransactionsByPeriod(startDate: Date, endDate: Date): Promise<Transaction[]> {
    try {
      const transactions = await this.getTransactions();
      return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    } catch (error) {
      console.error('Erro ao filtrar transações por período:', error);
      return [];
    }
  }

  async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    try {
      const transactions = await this.getTransactions();
      return transactions.filter(t => t.category === category);
    } catch (error) {
      console.error('Erro ao filtrar transações por categoria:', error);
      return [];
    }
  }

  async getMonthlyExpenses(year: number, month: number): Promise<number> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      const transactions = await this.getTransactionsByPeriod(startDate, endDate);
      
      return transactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + t.amount, 0);
    } catch (error) {
      console.error('Erro ao calcular gastos mensais:', error);
      return 0;
    }
  }

  async getSavingsRate(year: number, month: number): Promise<number> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      const transactions = await this.getTransactionsByPeriod(startDate, endDate);
      
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((total, t) => total + t.amount, 0);
        
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + t.amount, 0);
      
      return income > 0 ? ((income - expenses) / income) * 100 : 0;
    } catch (error) {
      console.error('Erro ao calcular taxa de poupança:', error);
      return 0;
    }
  }
}

export default new StorageService();

