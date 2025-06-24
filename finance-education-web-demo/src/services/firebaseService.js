import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

// Configuração do Firebase (substitua pelos seus dados)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "finance-education-app.firebaseapp.com",
  projectId: "finance-education-app",
  storageBucket: "finance-education-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Tipos para TypeScript
interface User {
  id: string;
  name: string;
  email: string;
  monthlyIncome: number;
  savingsGoal: number;
  emotionalState: string;
  createdAt?: any;
  updatedAt?: any;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  classification: 'asset' | 'liability';
  emotionalState?: string;
  createdAt?: any;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sessionType: string;
  context?: string;
  createdAt?: any;
}

interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: string;
  priority: 'high' | 'medium' | 'low';
  createdAt?: any;
  updatedAt?: any;
}

// Serviço Firebase para Web
class FirebaseWebService {
  // ==================== USUÁRIOS ====================
  
  async createUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // ==================== TRANSAÇÕES ====================
  
  async addTransaction(userId: string, transaction: Omit<Transaction, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'users', userId, 'transactions'), {
        ...transaction,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
  }

  async getTransactions(userId: string, limitCount: number = 50): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, 'users', userId, 'transactions'),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as Transaction[];
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  }

  async getTransactionsByPeriod(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, 'users', userId, 'transactions'),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as Transaction[];
    } catch (error) {
      console.error('Erro ao buscar transações por período:', error);
      throw error;
    }
  }

  async updateTransaction(
    userId: string, 
    transactionId: string, 
    updates: Partial<Transaction>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'transactions', transactionId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  }

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'transactions', transactionId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  }

  // ==================== METAS FINANCEIRAS ====================
  
  async addGoal(userId: string, goal: Omit<FinancialGoal, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'users', userId, 'goals'), {
        ...goal,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      throw error;
    }
  }

  async getGoals(userId: string): Promise<FinancialGoal[]> {
    try {
      const q = query(
        collection(db, 'users', userId, 'goals'),
        orderBy('deadline', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        deadline: doc.data().deadline?.toDate() || new Date(),
      })) as FinancialGoal[];
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      throw error;
    }
  }

  async updateGoal(
    userId: string, 
    goalId: string, 
    updates: Partial<FinancialGoal>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'goals', goalId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      throw error;
    }
  }

  // ==================== CHAT MESSAGES ====================
  
  async addChatMessage(userId: string, message: Omit<ChatMessage, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'users', userId, 'chatMessages'), {
        ...message,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar mensagem do chat:', error);
      throw error;
    }
  }

  async getChatMessages(userId: string, limitCount: number = 100): Promise<ChatMessage[]> {
    try {
      const q = query(
        collection(db, 'users', userId, 'chatMessages'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as ChatMessage[];
    } catch (error) {
      console.error('Erro ao buscar mensagens do chat:', error);
      throw error;
    }
  }

  async getChatMessagesBySession(
    userId: string, 
    sessionType: string
  ): Promise<ChatMessage[]> {
    try {
      const q = query(
        collection(db, 'users', userId, 'chatMessages'),
        where('sessionType', '==', sessionType),
        orderBy('timestamp', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as ChatMessage[];
    } catch (error) {
      console.error('Erro ao buscar mensagens por sessão:', error);
      throw error;
    }
  }

  // ==================== ANÁLISES FINANCEIRAS ====================
  
  async saveFinancialAnalysis(
    userId: string, 
    analysis: {
      period: string;
      paiRicoScore: number;
      psicologiaScore: number;
      babiloniaScore: number;
      overallScore: number;
      recommendations: string[];
      insights: string[];
    }
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'users', userId, 'analyses'), {
        ...analysis,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar análise financeira:', error);
      throw error;
    }
  }

  async getLatestAnalysis(userId: string) {
    try {
      const q = query(
        collection(db, 'users', userId, 'analyses'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar última análise:', error);
      throw error;
    }
  }

  // ==================== CONFIGURAÇÕES DO USUÁRIO ====================
  
  async updateUserSettings(
    userId: string, 
    settings: {
      notifications?: boolean;
      currency?: string;
      language?: string;
      theme?: string;
      monthlyIncome?: number;
      savingsGoal?: number;
    }
  ): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'settings', 'preferences');
      await updateDoc(docRef, {
        ...settings,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  }

  async getUserSettings(userId: string) {
    try {
      const docRef = doc(db, 'users', userId, 'settings', 'preferences');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      throw error;
    }
  }

  // ==================== ESTATÍSTICAS ====================
  
  async getMonthlyStats(userId: string, year: number, month: number) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const transactions = await this.getTransactionsByPeriod(userId, startDate, endDate);
      
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const assets = transactions
        .filter(t => t.classification === 'asset')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const liabilities = transactions
        .filter(t => t.classification === 'liability')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        income,
        expenses,
        savings: income - expenses,
        savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
        assets,
        liabilities,
        assetLiabilityRatio: liabilities > 0 ? assets / liabilities : assets > 0 ? 100 : 0,
        transactionCount: transactions.length,
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas mensais:', error);
      throw error;
    }
  }

  // ==================== DADOS DEMO ====================
  
  async initializeDemoData(userId: string): Promise<void> {
    try {
      // Criar usuário demo
      await this.createUser(userId, {
        name: 'João Silva',
        email: 'joao@demo.com',
        monthlyIncome: 5000,
        savingsGoal: 500,
        emotionalState: 'neutral',
      });

      // Adicionar transações demo
      const demoTransactions = [
        {
          type: 'income' as const,
          amount: 5000,
          category: 'salary',
          description: 'Salário mensal',
          date: new Date(),
          classification: 'asset' as const,
        },
        {
          type: 'expense' as const,
          amount: 1200,
          category: 'investment',
          description: 'Ações da Petrobras',
          date: new Date(),
          classification: 'asset' as const,
        },
        {
          type: 'expense' as const,
          amount: 800,
          category: 'housing',
          description: 'Financiamento casa',
          date: new Date(),
          classification: 'liability' as const,
        },
        {
          type: 'expense' as const,
          amount: 300,
          category: 'food',
          description: 'Gastos emocionais - hambúrguer',
          date: new Date(),
          classification: 'liability' as const,
          emotionalState: 'stressed',
        },
      ];

      for (const transaction of demoTransactions) {
        await this.addTransaction(userId, transaction);
      }

      // Adicionar meta demo
      await this.addGoal(userId, {
        title: 'Reserva de Emergência',
        targetAmount: 30000,
        currentAmount: 10500,
        deadline: new Date(2025, 11, 31),
        category: 'emergency',
        priority: 'high',
      });

      console.log('Dados demo inicializados com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar dados demo:', error);
      throw error;
    }
  }
}

export default new FirebaseWebService();
export { db, app };

