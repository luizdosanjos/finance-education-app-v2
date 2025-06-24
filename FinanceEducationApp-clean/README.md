# 💰 Finance Education App

Um aplicativo React Native de educação financeira baseado nos livros "Pai Rico, Pai Pobre", "Psicologia Financeira" e "O Homem Mais Rico da Babilônia", com chat inteligente integrado à OpenAI.

## 📚 Conceitos dos Livros Implementados

### 📈 Pai Rico, Pai Pobre (Robert Kiyosaki)
- **Ativos vs Passivos**: Classificação automática de compras
- **Educação Financeira**: Tracking de investimentos em conhecimento
- **Mentalidade Rica**: Análise de comportamento de investimento
- **Fluxo de Caixa**: Monitoramento de entrada e saída de dinheiro

### 🧠 Psicologia Financeira (Morgan Housel)
- **Comportamento Emocional**: Detecção de gastos por impulso
- **Consistência**: Análise de regularidade nos hábitos financeiros
- **Vieses Cognitivos**: Identificação de padrões de decisão
- **Tempo e Paciência**: Métricas de disciplina financeira

### 🏛️ O Homem Mais Rico da Babilônia (George Clason)
- **Regra dos 10%**: Verificação de poupança mínima
- **Disciplina Financeira**: Score de autocontrole
- **Proteção do Patrimônio**: Análise de riscos
- **Multiplicação da Riqueza**: Estratégias de crescimento

## 🚀 Funcionalidades

### 💬 Chat Inteligente com IA
- Interface estilo WhatsApp
- Integração com OpenAI GPT
- Análise contextual de gastos
- Recomendações personalizadas baseadas nos livros
- Detecção de emoções nas mensagens
- Persistência de sessões de chat

### 📊 Análise Financeira Avançada
- Dashboard inspirado no Nubank
- Widgets financeiros interativos
- Análises específicas por livro
- Sistema de recomendações inteligente
- Métricas comportamentais
- Relatórios por período (mensal/semanal/anual)

### 🎯 Sistema de Metas
- Definição de objetivos financeiros
- Acompanhamento de progresso
- Recomendações de ajuste
- Gamificação do processo

### 📱 Interface Moderna
- Design inspirado no Nubank
- Cores e tipografia profissionais
- Navegação intuitiva por abas
- Componentes reutilizáveis
- Responsividade mobile

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native**: Framework principal
- **TypeScript**: Tipagem estática
- **React Navigation**: Navegação entre telas
- **AsyncStorage**: Persistência local
- **Axios**: Requisições HTTP

### Backend/IA
- **OpenAI API**: Chat inteligente
- **Custom Algorithms**: Análises financeiras
- **Local Storage**: Dados do usuário

### Desenvolvimento
- **ESLint**: Linting de código
- **Prettier**: Formatação
- **Git**: Controle de versão
- **GitHub**: Repositório remoto

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Passos
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/finance-education-app.git

# Entre no diretório
cd finance-education-app

# Instale as dependências
npm install

# Para Android
npm run android

# Para iOS
npm run ios
```

## ⚙️ Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
OPENAI_API_KEY=sua_chave_openai_aqui
OPENAI_MODEL=gpt-3.5-turbo
```

### Configuração da OpenAI
1. Crie uma conta em https://platform.openai.com/
2. Gere uma API key
3. Adicione a chave no arquivo `.env`
4. Configure os limites de uso conforme necessário

## 🏗️ Arquitetura

```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Botões, Cards, Inputs
│   ├── chat/           # Componentes de chat
│   └── financial/      # Widgets financeiros
├── screens/            # Telas do aplicativo
│   ├── dashboard/      # Tela principal
│   ├── chat/           # Chat com IA
│   ├── analysis/       # Análises financeiras
│   ├── education/      # Conteúdo educativo
│   └── settings/       # Configurações
├── services/           # Serviços externos
│   ├── openAIService.ts    # Integração OpenAI
│   └── storageService.ts   # Persistência local
├── utils/              # Utilitários
│   ├── financialAnalysis.ts    # Algoritmos dos livros
│   └── recommendationEngine.ts # Sistema de recomendações
├── hooks/              # Hooks customizados
├── types/              # Tipos TypeScript
├── constants/          # Constantes (cores, espaçamentos)
└── navigation/         # Configuração de navegação
```

## 🔒 Segurança

### Boas Práticas Implementadas
- **Validação de entrada**: Sanitização de dados do usuário
- **Armazenamento seguro**: Dados sensíveis criptografados
- **API Keys**: Variáveis de ambiente protegidas
- **Validação de tipos**: TypeScript para prevenir erros
- **Tratamento de erros**: Handling robusto de exceções

### OWASP Compliance
- Proteção contra injeção de código
- Validação de dados de entrada
- Gerenciamento seguro de sessões
- Logging de segurança
- Controle de acesso adequado

## 📊 Algoritmos Financeiros

### Pai Rico, Pai Pobre
```typescript
// Classificação Ativo vs Passivo
const classifyTransaction = (transaction: Transaction): 'asset' | 'liability' => {
  // Lógica baseada no livro
  if (transaction.category === 'investment' || 
      transaction.category === 'education') {
    return 'asset';
  }
  return 'liability';
};
```

### Psicologia Financeira
```typescript
// Detecção de Gastos Emocionais
const detectEmotionalSpending = (transactions: Transaction[]): Analysis => {
  // Análise de padrões comportamentais
  const emotionalTransactions = transactions.filter(t => 
    ['excited', 'stressed', 'sad'].includes(t.emotionalState)
  );
  return calculateEmotionalImpact(emotionalTransactions);
};
```

### Babilônia
```typescript
// Regra dos 10%
const checkTenPercentRule = (income: number, savings: number): boolean => {
  return (savings / income) >= 0.10;
};
```

## 🎨 Design System

### Cores (Inspirado no Nubank)
```typescript
const COLORS = {
  primary: '#8A05BE',      // Roxo principal
  secondary: '#6C2E9C',    // Roxo secundário
  success: '#00D09C',      // Verde sucesso
  warning: '#FFB800',      // Amarelo aviso
  danger: '#E74C3C',       // Vermelho perigo
  // ...
};
```

### Componentes
- **Button**: Variantes (primary, secondary, outline, ghost)
- **Card**: Containers com sombras e bordas arredondadas
- **Input**: Campos com validação e formatação
- **ChatBubble**: Bolhas de conversa personalizadas

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Testes E2E
npm run test:e2e
```

## 📱 Build e Deploy

### Android APK
```bash
# Debug APK
cd android && ./gradlew assembleDebug

# Release APK
cd android && ./gradlew assembleRelease
```

### Deploy Web (Expo)
```bash
# Build para web
expo build:web

# Deploy no Netlify/Vercel
npm run deploy
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Perfil](https://linkedin.com/in/seu-perfil)
- Email: seu.email@exemplo.com

## 🙏 Agradecimentos

- Robert Kiyosaki - "Pai Rico, Pai Pobre"
- Morgan Housel - "Psicologia Financeira"
- George Clason - "O Homem Mais Rico da Babilônia"
- OpenAI - Tecnologia de IA
- Nubank - Inspiração de design
- Comunidade React Native

## 📈 Roadmap

### Versão 2.0
- [ ] Integração com bancos (Open Banking)
- [ ] Sincronização em nuvem
- [ ] Modo offline completo
- [ ] Notificações push inteligentes
- [ ] Relatórios em PDF
- [ ] Compartilhamento social

### Versão 3.0
- [ ] Marketplace de cursos
- [ ] Comunidade de usuários
- [ ] Gamificação avançada
- [ ] IA ainda mais inteligente
- [ ] Suporte a múltiplas moedas
- [ ] Versão web completa

---

**💡 Transforme sua relação com o dinheiro através da educação financeira!**

