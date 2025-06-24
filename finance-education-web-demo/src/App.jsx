import React, { useState } from 'react';
import './App.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Progress } from './components/ui/progress';
import { 
  MessageCircle, 
  TrendingUp, 
  BookOpen, 
  Target, 
  Settings,
  DollarSign,
  PiggyBank,
  Brain,
  Building,
  Send,
  User,
  Bot
} from 'lucide-react';

const FinanceEducationApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'ai',
      message: 'Olá! 👋 Sou seu consultor financeiro pessoal baseado nos livros "Pai Rico, Pai Pobre", "Psicologia Financeira" e "O Homem Mais Rico da Babilônia". Como posso ajudá-lo hoje?',
      timestamp: new Date()
    }
  ]);

  // Mock data
  const userData = {
    name: 'João Silva',
    monthlyIncome: 5000,
    currentBalance: 2350.50,
    savingsGoal: 500,
    currentSavings: 350,
    monthlyExpenses: 3200,
    assetsValue: 1200,
    liabilitiesValue: 800,
  };

  const mockTransactions = [
    { id: 1, description: 'Supermercado', amount: -150, category: 'food', type: 'expense' },
    { id: 2, description: 'Salário', amount: 5000, category: 'salary', type: 'income' },
    { id: 3, description: 'Curso Online', amount: -200, category: 'education', type: 'expense' },
    { id: 4, description: 'Smartphone', amount: -800, category: 'luxury', type: 'expense' },
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      id: chatHistory.length + 1,
      sender: 'user',
      message: chatMessage,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(chatMessage);
      const aiMessage = {
        id: chatHistory.length + 2,
        sender: 'ai',
        message: aiResponse,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiMessage]);
    }, 1000);

    setChatMessage('');
  };

  const generateAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('gasto') || lowerMessage.includes('compra')) {
      return 'Baseado na Psicologia Financeira, é importante analisar se esse gasto é emocional ou racional. Segundo o Pai Rico, pergunte-se: "Isso é um ativo ou passivo?" Se for um passivo, considere se realmente precisa dele agora. 💰';
    }
    
    if (lowerMessage.includes('investir') || lowerMessage.includes('investimento')) {
      return 'Excelente pergunta! O Pai Rico ensina que devemos comprar ativos primeiro, luxos depois. O Homem Mais Rico da Babilônia recomenda guardar 10% da renda primeiro. Comece com educação financeira - seu ativo mais importante! 📚';
    }
    
    if (lowerMessage.includes('poupar') || lowerMessage.includes('poupança')) {
      return 'A regra de ouro da Babilônia: "Uma parte de tudo que ganho é minha para guardar". Comece com 10% da sua renda. A Psicologia Financeira nos ensina que pequenos hábitos consistentes criam grandes resultados! 🏛️';
    }
    
    return 'Interessante! Baseado nos ensinamentos dos três livros, lembre-se: foque em ativos (Pai Rico), controle suas emoções financeiras (Psicologia) e pague-se primeiro (Babilônia). Quer que eu analise algo específico? 🤔';
  };

  const calculateSavingsRate = () => {
    return Math.min((userData.currentSavings / userData.savingsGoal) * 100, 100);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {userData.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-purple-100">Como estão suas finanças hoje?</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-0">
        <CardContent className="p-6 text-center">
          <p className="text-purple-200 text-sm uppercase tracking-wide mb-2">Saldo Atual</p>
          <p className="text-3xl font-bold mb-2">
            R$ {userData.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-purple-200 text-sm">
            Renda mensal: R$ {userData.monthlyIncome.toLocaleString('pt-BR')}
          </p>
        </CardContent>
      </Card>

      {/* Financial Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Meta de Poupança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {calculateSavingsRate().toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              R$ {userData.currentSavings} de R$ {userData.savingsGoal}
            </p>
            <Progress value={calculateSavingsRate()} className="mt-2" />
            <Badge variant={calculateSavingsRate() >= 70 ? "default" : "secondary"} className="mt-2">
              {calculateSavingsRate() >= 70 ? 'No caminho certo!' : 'Continue assim'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Ativos vs Passivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {userData.assetsValue - userData.liabilitiesValue}
            </div>
            <p className="text-xs text-muted-foreground">
              Ativos: R$ {userData.assetsValue} | Passivos: R$ {userData.liabilitiesValue}
            </p>
            <Badge variant={userData.assetsValue > userData.liabilitiesValue ? "default" : "destructive"} className="mt-2">
              {userData.assetsValue > userData.liabilitiesValue ? 'Mais ativos!' : 'Cuidado com passivos'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              Gastos do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              R$ {userData.monthlyExpenses.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              {((userData.monthlyExpenses / userData.monthlyIncome) * 100).toFixed(0)}% da renda
            </p>
            <Badge variant="secondary" className="mt-2">
              Dentro do esperado
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tip of the Day */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Dica do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic mb-4">
            "Lembre-se: Uma parte de tudo que ganho é minha para guardar" - O Homem Mais Rico da Babilônia
          </p>
          <Button variant="outline" size="sm">
            Ver mais dicas
          </Button>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTransactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground capitalize">{transaction.category}</p>
                </div>
                <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                  {transaction.type === 'income' ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-4">
            Ver todas as transações
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const ChatContent = () => (
    <div className="h-[600px] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Consultor Financeiro IA
          </CardTitle>
          <CardDescription className="text-purple-100">
            Baseado nos 3 livros de educação financeira
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {chatHistory.map((chat) => (
              <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  chat.sender === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {chat.sender === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs opacity-75">
                      {chat.sender === 'user' ? 'Você' : 'IA Financeira'}
                    </span>
                  </div>
                  <p className="text-sm">{chat.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              '💰 Quero analisar um gasto',
              '📊 Como estão minhas finanças?',
              '📚 Me ensine sobre investimentos',
              '🎯 Ajude-me com uma meta'
            ].map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setChatMessage(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  const AnalysisContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Pai Rico, Pai Pobre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Ativos Comprados</p>
              <p className="text-2xl font-bold text-green-600">R$ 1.200</p>
              <Badge variant="default">Bom investimento!</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Passivos Comprados</p>
              <p className="text-2xl font-bold text-red-600">R$ 800</p>
              <Badge variant="secondary">Controlado</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Educação Financeira</p>
              <p className="text-2xl font-bold text-blue-600">4.0%</p>
              <Badge variant="default">Excelente!</Badge>
            </div>
            <p className="text-xs italic bg-blue-50 p-2 rounded">
              💡 Continue focando em ativos que geram renda passiva!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-purple-600" />
              Psicologia Financeira
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Gastos Emocionais</p>
              <p className="text-2xl font-bold text-orange-600">R$ 300</p>
              <Badge variant="secondary">Controlado</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Compras Impulsivas</p>
              <p className="text-2xl font-bold text-red-600">2</p>
              <Badge variant="default">Poucas</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consistência</p>
              <p className="text-2xl font-bold text-green-600">85%</p>
              <Badge variant="default">Ótima!</Badge>
            </div>
            <p className="text-xs italic bg-purple-50 p-2 rounded">
              💡 Suas emoções estão bem controladas. Continue assim!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="h-5 w-5 text-yellow-600" />
              Babilônia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Regra dos 10%</p>
              <p className="text-2xl font-bold text-green-600">7.0%</p>
              <Badge variant="secondary">Precisa melhorar</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disciplina Financeira</p>
              <p className="text-2xl font-bold text-blue-600">82%</p>
              <Badge variant="default">Excelente!</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Proteção do Patrimônio</p>
              <p className="text-2xl font-bold text-green-600">Baixo</p>
              <Badge variant="default">Seguro!</Badge>
            </div>
            <p className="text-xs italic bg-yellow-50 p-2 rounded">
              💡 Tente aumentar sua poupança para 10% da renda!
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>📊 Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Renda do Mês</p>
              <p className="text-xl font-bold text-green-600">R$ 5.000</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gastos do Mês</p>
              <p className="text-xl font-bold text-red-600">R$ 3.200</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Poupança</p>
              <p className="text-xl font-bold text-blue-600">7.0%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Score Comportamental</p>
              <p className="text-xl font-bold text-purple-600">82/100</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const EducationContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Pai Rico, Pai Pobre
            </CardTitle>
            <CardDescription>Robert Kiyosaki</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-sm">Conceito Principal</h4>
                <p className="text-xs">Ativos vs Passivos - Compre coisas que colocam dinheiro no seu bolso</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Lições Implementadas:</h4>
                <ul className="text-xs space-y-1">
                  <li>• Classificação automática de gastos</li>
                  <li>• Análise de educação financeira</li>
                  <li>• Foco em geração de renda passiva</li>
                  <li>• Mentalidade de investidor</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Psicologia Financeira
            </CardTitle>
            <CardDescription>Morgan Housel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded">
                <h4 className="font-semibold text-sm">Conceito Principal</h4>
                <p className="text-xs">Comportamento importa mais que conhecimento técnico</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Lições Implementadas:</h4>
                <ul className="text-xs space-y-1">
                  <li>• Detecção de gastos emocionais</li>
                  <li>• Análise de consistência</li>
                  <li>• Controle de impulsos</li>
                  <li>• Paciência e disciplina</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-yellow-600" />
              O Homem Mais Rico da Babilônia
            </CardTitle>
            <CardDescription>George Clason</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded">
                <h4 className="font-semibold text-sm">Conceito Principal</h4>
                <p className="text-xs">Regras atemporais de construção de riqueza</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Lições Implementadas:</h4>
                <ul className="text-xs space-y-1">
                  <li>• Regra dos 10% (pagar-se primeiro)</li>
                  <li>• Controle de gastos</li>
                  <li>• Proteção do patrimônio</li>
                  <li>• Multiplicação da riqueza</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🎯 Recomendações Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-semibold text-sm text-red-800">🚨 Urgente</h4>
              <p className="text-sm text-red-700">Aumente sua poupança para 10% da renda (Regra da Babilônia)</p>
            </div>
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <h4 className="font-semibold text-sm text-yellow-800">⚠️ Importante</h4>
              <p className="text-sm text-yellow-700">Invista mais em educação financeira (Pai Rico)</p>
            </div>
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-semibold text-sm text-blue-800">💡 Sugestão</h4>
              <p className="text-sm text-blue-700">Continue mantendo a consistência nos hábitos (Psicologia)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Finance Education App</h1>
                <p className="text-xs text-gray-500">Demo Web - Baseado em 3 livros de educação financeira</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Demo Version
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              <span className="hidden sm:inline">Análise</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Chat IA</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Educação</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="analysis">
            <AnalysisContent />
          </TabsContent>

          <TabsContent value="chat">
            <ChatContent />
          </TabsContent>

          <TabsContent value="education">
            <EducationContent />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Configurações</CardTitle>
                <CardDescription>
                  Esta é uma versão demonstrativa do Finance Education App
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">📱 Versão Mobile (React Native)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      O aplicativo completo está disponível como React Native com:
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Integração real com OpenAI</li>
                      <li>• Persistência local de dados</li>
                      <li>• Notificações push</li>
                      <li>• Geração de APK para Android</li>
                      <li>• Interface nativa otimizada</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">🔧 Tecnologias Utilizadas</h3>
                    <div className="flex flex-wrap gap-2">
                      {['React Native', 'TypeScript', 'OpenAI API', 'AsyncStorage', 'React Navigation'].map((tech) => (
                        <Badge key={tech} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">📚 Livros Base</h3>
                    <div className="space-y-2">
                      <Badge className="bg-blue-100 text-blue-800">Pai Rico, Pai Pobre</Badge>
                      <Badge className="bg-purple-100 text-purple-800 ml-2">Psicologia Financeira</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800 ml-2">O Homem Mais Rico da Babilônia</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>💰 Finance Education App - Transforme sua relação com o dinheiro através da educação financeira</p>
            <p className="mt-1">Baseado nos livros: Pai Rico Pai Pobre • Psicologia Financeira • O Homem Mais Rico da Babilônia</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinanceEducationApp;

