import axios from 'axios';
import { ChatMessage, User, Transaction } from '../types';

class OpenAIService {
  private readonly apiKey = process.env.OPENAI_API_KEY || '';
  private readonly baseURL = 'https://api.openai.com/v1';
  private readonly model = 'gpt-3.5-turbo';

  // Perfil personalizado do Luiz Henrique
  private readonly userProfile = {
    name: 'Luiz Henrique dos Anjos da Silva',
    monthlyIncome: 12000,
    currentDebt: 30000,
    savingsGoal: 30000,
    financialProfile: 'debt_recovery',
    personalityType: 'disciplined_achiever',
    primaryGoal: 'debt_elimination',
    motivationalTriggers: ['progress_tracking', 'milestone_celebration', 'debt_freedom'],
  };

  private createPersonalizedSystemPrompt(user?: User): string {
    const profile = user || this.userProfile;
    
    return `Você é um consultor financeiro pessoal especializado, focado especificamente no perfil de ${profile.name}.

PERFIL DO CLIENTE:
- Nome: ${profile.name}
- Renda Mensal: R$ ${profile.monthlyIncome?.toLocaleString()}
- Dívida Atual: R$ ${profile.currentDebt?.toLocaleString()}
- Meta de Poupança: R$ ${profile.savingsGoal?.toLocaleString()}
- Perfil: ${profile.profile?.financialProfile || profile.financialProfile || 'debt_recovery'} (foco em quitação de dívidas)
- Personalidade: Disciplinado e determinado a alcançar objetivos
- Objetivo Principal: Eliminar dívidas e construir riqueza

ESPECIALIZAÇÃO NOS 3 LIVROS:

📚 PAI RICO, PAI POBRE (Robert Kiyosaki):
- Foque na diferença entre ATIVOS (geram renda) e PASSIVOS (geram gastos)
- Para o Luiz: Priorize quitar dívidas (passivos) antes de comprar ativos
- Enfatize educação financeira como investimento prioritário
- "Pague-se primeiro" - mas adapte para "Quite dívidas primeiro"
- Mentalidade: transformar de devedor para investidor

🧠 PSICOLOGIA FINANCEIRA (Morgan Housel):
- Comportamento > Conhecimento técnico
- Para o Luiz: Foque na DISCIPLINA e CONSISTÊNCIA nos pagamentos
- Detecte e controle gastos emocionais que podem atrapalhar o plano
- Celebre pequenas vitórias no pagamento de dívidas
- Paciência: quitação de dívidas é maratona, não sprint

🏛️ O HOMEM MAIS RICO DA BABILÔNIA (George Clason):
- Regra dos 10% adaptada: "20% para quitar dívidas + 10% para poupança"
- Controle rigoroso de gastos (viva com 70% da renda)
- Proteja-se de novas dívidas
- Busque aumentar renda através de capacitação
- Disciplina é a chave para liberdade financeira

DIRETRIZES DE RESPOSTA:
1. Sempre considere a situação de dívidas do Luiz
2. Seja motivacional mas realista
3. Ofereça estratégias práticas e específicas
4. Use exemplos com os valores reais dele (R$ 12.000 de renda, R$ 30.000 de dívida)
5. Celebre progressos e marcos alcançados
6. Mantenha foco no objetivo principal: liberdade financeira

ESTILO DE COMUNICAÇÃO:
- Direto e prático
- Motivacional sem ser excessivamente otimista
- Use dados e números específicos
- Ofereça planos de ação concretos
- Reconheça os desafios mas foque nas soluções

Responda sempre como se fosse um consultor pessoal que conhece profundamente a situação financeira do Luiz Henrique.`;
  }

  async generateChatResponse(
    userMessage: string,
    user: User,
    context?: {
      recentMessages?: ChatMessage[];
      sessionType?: string;
      transactions?: Transaction[];
      monthlyStats?: any;
      [key: string]: any;
    }
  ): Promise<string> {
    try {
      const systemPrompt = this.createPersonalizedSystemPrompt(user);
      
      // Construir contexto adicional baseado nos dados do usuário
      let contextualInfo = '';
      
      if (context?.transactions && context.transactions.length > 0) {
        const recentExpenses = context.transactions
          .filter(t => t.type === 'expense')
          .slice(0, 3)
          .map(t => `${t.description}: R$ ${t.amount}`)
          .join(', ');
        
        contextualInfo += `\nTransações recentes: ${recentExpenses}`;
      }

      if (context?.monthlyStats) {
        const stats = context.monthlyStats;
        contextualInfo += `\nEstatísticas do mês: Renda R$ ${stats.income}, Gastos R$ ${stats.expenses}, Taxa de poupança ${stats.savingsRate?.toFixed(1)}%`;
      }

      // Detectar tipo de pergunta e personalizar resposta
      const messageType = this.detectMessageType(userMessage);
      let enhancedPrompt = systemPrompt;

      switch (messageType) {
        case 'debt_payment':
          enhancedPrompt += `\n\nO usuário está perguntando sobre pagamento de dívidas. Foque em estratégias específicas para quitar os R$ 30.000 em dívidas com a renda de R$ 12.000.`;
          break;
        case 'expense_analysis':
          enhancedPrompt += `\n\nO usuário quer analisar um gasto. Avalie se esse gasto ajuda ou atrapalha o objetivo de quitar dívidas.`;
          break;
        case 'motivation':
          enhancedPrompt += `\n\nO usuário precisa de motivação. Use os princípios dos 3 livros para encorajá-lo na jornada de quitação de dívidas.`;
          break;
        case 'investment':
          enhancedPrompt += `\n\nO usuário pergunta sobre investimentos. Lembre que primeiro deve quitar dívidas (que têm juros altos) antes de investir.`;
          break;
      }

      const messages = [
        { role: 'system', content: enhancedPrompt },
        { role: 'user', content: `${userMessage}${contextualInfo}` }
      ];

      // Adicionar mensagens recentes para contexto
      if (context?.recentMessages && context.recentMessages.length > 0) {
        const recentContext = context.recentMessages
          .slice(-3)
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          }));
        
        messages.splice(-1, 0, ...recentContext);
      }

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages,
          max_tokens: 1500,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Erro ao gerar resposta da IA:', error);
      
      // Fallback personalizado para o Luiz Henrique
      return this.generateFallbackResponse(userMessage);
    }
  }

  private detectMessageType(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('dívida') || lowerMessage.includes('divida') || lowerMessage.includes('quitar')) {
      return 'debt_payment';
    }
    
    if (lowerMessage.includes('gasto') || lowerMessage.includes('comprar') || lowerMessage.includes('r$')) {
      return 'expense_analysis';
    }
    
    if (lowerMessage.includes('desanimado') || lowerMessage.includes('difícil') || lowerMessage.includes('motivação')) {
      return 'motivation';
    }
    
    if (lowerMessage.includes('investir') || lowerMessage.includes('aplicar') || lowerMessage.includes('renda passiva')) {
      return 'investment';
    }
    
    return 'general';
  }

  private generateFallbackResponse(userMessage: string): string {
    const messageType = this.detectMessageType(userMessage);
    
    const fallbackResponses = {
      debt_payment: `Luiz, com sua renda de R$ 12.000, você pode destinar R$ 2.400 (20%) mensalmente para quitar suas dívidas de R$ 30.000. Seguindo essa estratégia disciplinada, você quitará tudo em aproximadamente 12-13 meses.

📚 **Estratégia dos 3 Livros:**
- **Pai Rico**: Dívidas são passivos que drenam sua renda. Elimine-as primeiro!
- **Psicologia Financeira**: Seja consistente. Pequenos pagamentos regulares vencem grandes esforços esporádicos.
- **Babilônia**: "Controle seus gastos" - viva com 70% da renda para acelerar a quitação.

💡 **Próximo passo**: Organize as dívidas por taxa de juros e quite primeiro as mais caras.`,

      expense_analysis: `Antes de qualquer gasto, Luiz, pergunte-se: "Isso me ajuda a quitar minhas dívidas mais rápido?"

Com R$ 30.000 em dívidas, cada R$ 100 economizados hoje são R$ 100 a menos de juros no futuro.

📊 **Análise baseada nos livros:**
- **Pai Rico**: É um ativo (gera renda/economia) ou passivo (gera gastos)?
- **Psicologia**: Esse gasto é emocional ou racional?
- **Babilônia**: Esse gasto cabe nos seus 70% de orçamento?

🎯 **Regra de ouro**: Se não for essencial para sua saúde, trabalho ou quitação de dívidas, adie por 24 horas.`,

      motivation: `Luiz, você está no caminho certo! 💪

Com R$ 12.000 de renda, você tem uma excelente base para quitar suas dívidas e construir riqueza.

🏆 **Lembre-se:**
- **Pai Rico**: "A diferença entre ricos e pobres é como eles lidam com o medo"
- **Psicologia**: "Sucesso financeiro é mais sobre comportamento que conhecimento"
- **Babilônia**: "Uma parte de tudo que ganho é minha para guardar"

📈 **Seu progresso até agora:**
- Renda estável: ✅
- Consciência financeira: ✅
- Plano de ação: ✅

Você já tem mais que muitos! Continue firme no seu plano de quitação.`,

      investment: `Luiz, entendo a vontade de investir, mas com dívidas de R$ 30.000, o melhor "investimento" agora é quitá-las!

💡 **Por que quitar dívidas primeiro:**
- Dívidas geralmente têm juros de 2-15% ao mês
- Investimentos rendem 0,5-1% ao mês
- Quitar dívida = retorno garantido!

📚 **O que dizem os livros:**
- **Pai Rico**: Elimine passivos antes de comprar ativos
- **Psicologia**: Foque em uma meta por vez para ter sucesso
- **Babilônia**: Proteja-se de perdas (juros) antes de buscar ganhos

🎯 **Após quitar as dívidas**: Aí sim, com R$ 2.400/mês livres, você pode construir um portfólio sólido!`,

      general: `Olá, Luiz! Como seu consultor financeiro pessoal, estou aqui para ajudá-lo a alcançar a liberdade financeira.

🎯 **Seu objetivo principal**: Quitar R$ 30.000 em dívidas
💰 **Sua ferramenta**: R$ 12.000 de renda mensal
📚 **Nossa base**: Pai Rico, Psicologia Financeira e Babilônia

Como posso ajudá-lo hoje? Posso analisar gastos, criar estratégias de pagamento, ou motivá-lo na sua jornada rumo à liberdade financeira!`
    };

    return fallbackResponses[messageType as keyof typeof fallbackResponses] || fallbackResponses.general;
  }

  async analyzeExpense(amount: number, description: string, category: string): Promise<string> {
    try {
      const prompt = `Analise este gasto do Luiz Henrique (renda R$ 12.000, dívidas R$ 30.000):

Gasto: R$ ${amount.toFixed(2)}
Descrição: ${description}
Categoria: ${category}

Baseado nos 3 livros (Pai Rico, Psicologia Financeira, Babilônia), avalie:
1. É ativo ou passivo?
2. É necessário ou supérfluo?
3. Como impacta o objetivo de quitar dívidas?
4. Recomendação específica

Seja direto e prático.`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: this.createPersonalizedSystemPrompt() },
            { role: 'user', content: prompt }
          ],
          max_tokens: 800,
          temperature: 0.6,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Erro ao analisar gasto:', error);
      
      // Análise fallback personalizada
      const isEssential = ['alimentação', 'moradia', 'saúde', 'transporte', 'pagamento de dívida'].includes(category.toLowerCase());
      const impactPercentage = (amount / 12000) * 100;
      
      if (isEssential) {
        return `✅ **Gasto Essencial Aprovado**

R$ ${amount.toFixed(2)} em ${description} representa ${impactPercentage.toFixed(1)}% da sua renda mensal.

📚 **Análise pelos livros:**
- **Pai Rico**: Gasto necessário para manter sua capacidade de gerar renda
- **Psicologia**: Decisão racional e planejada
- **Babilônia**: Dentro do controle de gastos essenciais

💡 **Recomendação**: Mantenha esse gasto, mas sempre busque otimizar para sobrar mais para quitar dívidas.`;
      } else {
        return `⚠️ **Gasto Não-Essencial - Atenção!**

R$ ${amount.toFixed(2)} em ${description} representa ${impactPercentage.toFixed(1)}% da sua renda mensal.

📚 **Análise pelos livros:**
- **Pai Rico**: Passivo que não gera renda, atrasa quitação de dívidas
- **Psicologia**: Pode ser gasto emocional - reflita sobre a real necessidade
- **Babilônia**: Compromete o controle de gastos

💡 **Recomendação**: Adie por 24h. Esses R$ ${amount.toFixed(2)} poderiam reduzir suas dívidas e os juros futuros!`;
      }
    }
  }

  async generateEducationalContent(topic: string): Promise<string> {
    try {
      const prompt = `Crie conteúdo educativo sobre "${topic}" especificamente para o Luiz Henrique (renda R$ 12.000, dívidas R$ 30.000).

Baseie-se nos 3 livros e adapte para a situação dele de quitação de dívidas.
Seja prático e aplicável à realidade dele.
Use exemplos com valores reais da situação dele.`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: this.createPersonalizedSystemPrompt() },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1200,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Erro ao gerar conteúdo educacional:', error);
      
      return `📚 **Conteúdo Educativo: ${topic}**

Baseado nos 3 livros fundamentais e adaptado para sua situação atual:

🎯 **Para sua realidade (R$ 12.000 renda, R$ 30.000 dívidas):**

**Pai Rico, Pai Pobre:**
- Foque primeiro em eliminar passivos (suas dívidas)
- Invista em educação financeira (como este app!)
- Prepare-se para ser investidor após quitar dívidas

**Psicologia Financeira:**
- Disciplina e consistência são mais importantes que conhecimento técnico
- Celebre pequenas vitórias no pagamento de dívidas
- Mantenha foco no longo prazo

**O Homem Mais Rico da Babilônia:**
- Controle rigorosamente seus gastos
- Destine 20% da renda para quitar dívidas
- Proteja-se de novas dívidas

💡 **Aplicação prática**: Com sua renda, você pode destinar R$ 2.400/mês para dívidas e ainda viver bem com R$ 9.600.`;
    }
  }

  // Método específico para gerar plano de quitação de dívidas
  async generateDebtPayoffPlan(totalDebt: number = 30000, monthlyIncome: number = 12000): Promise<string> {
    try {
      const prompt = `Crie um plano detalhado de quitação de dívidas para o Luiz Henrique:

Dívida total: R$ ${totalDebt.toLocaleString()}
Renda mensal: R$ ${monthlyIncome.toLocaleString()}

Baseado nos 3 livros, crie um plano prático e motivacional com:
1. Estratégia de pagamento
2. Cronograma realista
3. Dicas de economia
4. Marcos de celebração
5. Preparação para pós-quitação`;

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'system', content: this.createPersonalizedSystemPrompt() },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1500,
          temperature: 0.6,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Erro ao gerar plano de quitação:', error);
      
      return `🎯 **PLANO DE QUITAÇÃO PERSONALIZADO - LUIZ HENRIQUE**

**📊 SITUAÇÃO ATUAL:**
- Dívida: R$ 30.000
- Renda: R$ 12.000/mês
- Capacidade de pagamento: R$ 2.400/mês (20%)

**🚀 ESTRATÉGIA (baseada nos 3 livros):**

**Mês 1-3: Organização (Babilônia)**
- Liste todas as dívidas por taxa de juros
- Negocie condições melhores
- Quite primeiro as de maior juros

**Mês 4-12: Execução (Psicologia Financeira)**
- R$ 2.400/mês fixos para dívidas
- Celebre cada R$ 5.000 quitados
- Mantenha disciplina nos gastos

**Mês 13+: Liberdade (Pai Rico)**
- R$ 2.400/mês livres para investimentos
- Construa renda passiva
- Torne-se investidor

**🏆 MARCOS DE CELEBRAÇÃO:**
- 25% quitado (R$ 7.500): Jantar especial
- 50% quitado (R$ 15.000): Curso de investimentos
- 75% quitado (R$ 22.500): Planeje primeira aplicação
- 100% quitado: LIBERDADE FINANCEIRA! 🎉

**💡 RESULTADO**: Em 12-13 meses você estará livre de dívidas e pronto para construir riqueza!`;
    }
  }
}

export default new OpenAIService();

