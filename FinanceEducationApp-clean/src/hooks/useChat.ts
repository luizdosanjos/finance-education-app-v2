import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { ChatMessage, ChatSession, User } from '../types';
import OpenAIService from '../services/openAIService';
import StorageService from '../services/storageService';
import FirebaseService from '../services/firebaseService';

interface UseChatProps {
  user: User;
  sessionType?: 'general' | 'expense_analysis' | 'education' | 'goal_setting';
}

interface UseChatReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  loadChatHistory: () => Promise<void>;
  analyzeExpense: (amount: number, description: string, category: string) => Promise<void>;
  getEducationalTip: (topic: string) => Promise<void>;
}

export const useChat = ({ user, sessionType = 'general' }: UseChatProps): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  useEffect(() => {
    initializeChat();
  }, [user.id, sessionType]);

  const initializeChat = async () => {
    try {
      await loadChatHistory();
      
      // Se não há mensagens, enviar mensagem de boas-vindas
      if (messages.length === 0) {
        await sendWelcomeMessage();
      }
    } catch (error) {
      console.error('Erro ao inicializar chat:', error);
    }
  };

  const sendWelcomeMessage = async () => {
    const welcomeMessages = {
      general: `Olá, ${user.name}! 👋\n\nSou seu consultor financeiro pessoal, especializado nos ensinamentos dos livros "Pai Rico, Pai Pobre", "Psicologia Financeira" e "O Homem Mais Rico da Babilônia".\n\nComo posso ajudá-lo hoje? Você pode:\n\n💰 Me contar sobre um gasto\n📊 Pedir análise financeira\n📚 Aprender conceitos dos livros\n🎯 Definir metas financeiras`,
      
      expense_analysis: `Vamos analisar seus gastos! 💰\n\nMe conte sobre o gasto que você quer analisar. Inclua:\n- Valor\n- Descrição\n- Como você se sente sobre essa compra\n\nVou analisar baseado nos princípios dos três livros e te dar uma recomendação personalizada.`,
      
      education: `Bem-vindo à sua sessão de educação financeira! 📚\n\nPosso te ensinar sobre:\n\n📖 Pai Rico, Pai Pobre: Ativos vs Passivos\n🧠 Psicologia Financeira: Comportamento e emoções\n🏛️ Babilônia: Regras de ouro da riqueza\n\nSobre qual tópico gostaria de aprender?`,
      
      goal_setting: `Vamos definir suas metas financeiras! 🎯\n\nPara criar metas eficazes, preciso entender:\n- Sua situação atual\n- Seus objetivos\n- Seu prazo\n- Sua motivação\n\nQual meta financeira você gostaria de estabelecer?`
    };

    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      content: welcomeMessages[sessionType],
      timestamp: new Date(),
      context: {
        bookReference: 'geral',
      },
    };

    setMessages([welcomeMessage]);
    
    // Salvar mensagem de boas-vindas no Firebase
    try {
      await FirebaseService.addChatMessage(user.id, {
        text: welcomeMessage.content,
        sender: welcomeMessage.sender,
        timestamp: welcomeMessage.timestamp,
        sessionType,
        context: 'welcome',
      });
    } catch (error) {
      console.error('Erro ao salvar mensagem de boas-vindas no Firebase:', error);
      // Fallback para storage local
      await StorageService.saveChatMessage(welcomeMessage, sessionType);
    }
  };

  const loadChatHistory = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Tentar carregar do Firebase primeiro
      const firebaseMessages = await FirebaseService.getChatMessagesBySession(user.id, sessionType);
      
      if (firebaseMessages.length > 0) {
        // Converter mensagens do Firebase para o formato do app
        const convertedMessages: ChatMessage[] = firebaseMessages.map(msg => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.text,
          timestamp: msg.timestamp,
          context: {
            bookReference: msg.context || 'geral',
          },
        }));
        
        setMessages(convertedMessages);
        setCurrentSessionId(`firebase_${sessionType}_${user.id}`);
      } else {
        // Fallback para storage local
        const sessions = await StorageService.getChatSessions();
        const userSessions = sessions.filter(s => s.userId === user.id && s.sessionType === sessionType);
        
        if (userSessions.length > 0) {
          const latestSession = userSessions.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0];
          
          setMessages(latestSession.messages);
          setCurrentSessionId(latestSession.id);
        } else {
          const newSessionId = `session_${user.id}_${sessionType}_${Date.now()}`;
          setCurrentSessionId(newSessionId);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      // Em caso de erro, tentar carregar do storage local
      try {
        const sessions = await StorageService.getChatSessions();
        const userSessions = sessions.filter(s => s.userId === user.id && s.sessionType === sessionType);
        
        if (userSessions.length > 0) {
          const latestSession = userSessions.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0];
          
          setMessages(latestSession.messages);
          setCurrentSessionId(latestSession.id);
        }
      } catch (localError) {
        console.error('Erro ao carregar do storage local:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = useCallback(async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setIsLoading(true);

    // Salvar mensagem do usuário imediatamente
    await saveMessageToFirebase(userMessage);

    try {
      // Simular delay de digitação
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Detectar contexto da mensagem
      const context = detectMessageContext(text, messages);

      // Buscar dados do usuário do Firebase para personalizar resposta
      const userData = await FirebaseService.getUser(user.id);
      const recentTransactions = await FirebaseService.getTransactions(user.id, 10);
      const monthlyStats = await FirebaseService.getMonthlyStats(
        user.id, 
        new Date().getFullYear(), 
        new Date().getMonth() + 1
      );

      // Gerar resposta da IA com contexto completo
      const aiResponse = await OpenAIService.generateChatResponse(
        text,
        userData || user,
        {
          recentMessages: messages.slice(-5),
          sessionType,
          transactions: recentTransactions,
          monthlyStats,
          ...context,
        }
      );

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        context: {
          userEmotion: detectUserEmotion(text),
          bookReference: detectBookReference(aiResponse),
          recommendation: aiResponse.includes('recomendo') || aiResponse.includes('sugiro') ? 'financial_advice' : undefined,
        },
      };

      const updatedMessages = [...messages, userMessage, aiMessage];
      setMessages(updatedMessages);

      // Salvar resposta da IA
      await saveMessageToFirebase(aiMessage);

      // Salvar sessão local como backup
      await saveChatSession(updatedMessages);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente. 😔',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      await saveMessageToFirebase(errorMessage);
      
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível processar sua mensagem. Verifique sua conexão e tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [messages, user, sessionType]);

  const saveMessageToFirebase = async (message: ChatMessage) => {
    try {
      await FirebaseService.addChatMessage(user.id, {
        text: message.content,
        sender: message.sender,
        timestamp: message.timestamp,
        sessionType,
        context: message.context?.bookReference || 'general',
      });
    } catch (error) {
      console.error('Erro ao salvar mensagem no Firebase:', error);
      // Fallback para storage local
      await StorageService.saveChatMessage(message, sessionType);
    }
  };

  const analyzeExpense = useCallback(async (
    amount: number, 
    description: string, 
    category: string
  ): Promise<void> => {
    // Salvar transação no Firebase
    try {
      await FirebaseService.addTransaction(user.id, {
        type: 'expense',
        amount,
        category,
        description,
        date: new Date(),
        classification: 'liability', // Será reclassificado pela IA
        emotionalState: detectUserEmotion(description),
      });
    } catch (error) {
      console.error('Erro ao salvar transação no Firebase:', error);
    }

    const expenseText = `Quero analisar um gasto:\n\nValor: R$ ${amount.toFixed(2)}\nDescrição: ${description}\nCategoria: ${category}\n\nO que você acha desse gasto?`;
    
    await sendMessage(expenseText);
  }, [sendMessage, user.id]);

  const getEducationalTip = useCallback(async (topic: string): Promise<void> => {
    const tipText = `Me explique sobre: ${topic}`;
    await sendMessage(tipText);
  }, [sendMessage]);

  const clearChat = useCallback(() => {
    Alert.alert(
      'Limpar Chat',
      'Deseja limpar todo o histórico desta conversa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            sendWelcomeMessage();
            // Nota: Não limpar do Firebase para manter histórico
          }
        }
      ]
    );
  }, []);

  const saveChatSession = async (messagesToSave: ChatMessage[]) => {
    try {
      const session: ChatSession = {
        id: currentSessionId || `session_${user.id}_${sessionType}_${Date.now()}`,
        userId: user.id,
        messages: messagesToSave,
        sessionType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await StorageService.saveChatSession(session);
      
      if (!currentSessionId) {
        setCurrentSessionId(session.id);
      }
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  };

  const detectMessageContext = (text: string, previousMessages: ChatMessage[]) => {
    const lowerText = text.toLowerCase();
    
    // Detectar se é sobre gastos
    if (lowerText.includes('gasto') || lowerText.includes('compra') || lowerText.includes('r$')) {
      return { transactionAnalysis: true };
    }
    
    // Detectar se é sobre educação
    if (lowerText.includes('aprend') || lowerText.includes('ensine') || lowerText.includes('explique')) {
      return { educationalRequest: true };
    }
    
    // Detectar se é sobre metas
    if (lowerText.includes('meta') || lowerText.includes('objetivo') || lowerText.includes('planeja')) {
      return { goalSetting: true };
    }
    
    return {};
  };

  const detectUserEmotion = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    const emotions = {
      anxious: ['preocupado', 'ansioso', 'medo', 'nervoso', 'inseguro'],
      happy: ['feliz', 'animado', 'ótimo', 'excelente', 'alegre'],
      sad: ['triste', 'desanimado', 'difícil', 'ruim', 'péssimo'],
      stressed: ['estressado', 'cansado', 'pressão', 'sobrecarregado'],
      excited: ['empolgado', 'ansioso para', 'mal posso esperar', 'super'],
    };

    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotion;
      }
    }
    
    return 'neutral';
  };

  const detectBookReference = (aiResponse: string): string => {
    const lowerResponse = aiResponse.toLowerCase();
    
    if (lowerResponse.includes('pai rico') || lowerResponse.includes('ativo') || lowerResponse.includes('passivo')) {
      return 'pai_rico_pai_pobre';
    }
    
    if (lowerResponse.includes('psicologia') || lowerResponse.includes('comportamento') || lowerResponse.includes('emocional')) {
      return 'psicologia_financeira';
    }
    
    if (lowerResponse.includes('babilônia') || lowerResponse.includes('10%') || lowerResponse.includes('pagar-se primeiro')) {
      return 'homem_mais_rico_babilonia';
    }
    
    return 'geral';
  };

  return {
    messages,
    isTyping,
    isLoading,
    sendMessage,
    clearChat,
    loadChatHistory,
    analyzeExpense,
    getEducationalTip,
  };
};

