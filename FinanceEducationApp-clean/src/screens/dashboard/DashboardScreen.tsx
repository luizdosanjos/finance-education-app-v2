import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import Card, { FinancialWidget } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CustomHeader, FloatingActionButton } from '../../navigation/AppNavigator';

// Mock data - em produção viria do Redux/Context
const mockUserData = {
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
  {
    id: '1',
    description: 'Supermercado',
    amount: -150.00,
    category: 'food',
    date: new Date(),
    type: 'expense' as const,
  },
  {
    id: '2',
    description: 'Salário',
    amount: 5000.00,
    category: 'salary',
    date: new Date(),
    type: 'income' as const,
  },
  {
    id: '3',
    description: 'Curso Online',
    amount: -200.00,
    category: 'education',
    date: new Date(),
    type: 'expense' as const,
  },
];

const DashboardScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [tipOfTheDay, setTipOfTheDay] = useState('');

  useEffect(() => {
    generateTipOfTheDay();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carregamento de dados
    await new Promise(resolve => setTimeout(resolve, 1000));
    generateTipOfTheDay();
    setRefreshing(false);
  };

  const generateTipOfTheDay = () => {
    const tips = [
      'Lembre-se: "Uma parte de tudo que ganho é minha para guardar" - O Homem Mais Rico da Babilônia',
      'Compre ativos, não passivos. Ativos colocam dinheiro no seu bolso - Pai Rico, Pai Pobre',
      'Suas emoções podem ser seu maior inimigo financeiro - Psicologia Financeira',
      'Pague-se primeiro! Guarde 10% antes de qualquer gasto - Babilônia',
      'Educação financeira é o ativo mais importante - Pai Rico, Pai Pobre',
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTipOfTheDay(randomTip);
  };

  const calculateSavingsRate = () => {
    const rate = (mockUserData.currentSavings / mockUserData.savingsGoal) * 100;
    return Math.min(rate, 100);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleAddTransaction = () => {
    // Navegar para tela de adicionar transação
    console.log('Adicionar transação');
  };

  const handleChatPress = () => {
    // Navegar para chat
    console.log('Abrir chat');
  };

  const handleAnalysisPress = () => {
    // Navegar para análise
    console.log('Ver análise');
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={`${getGreeting()}, ${mockUserData.name.split(' ')[0]}!`}
        subtitle="Como estão suas finanças hoje?"
        rightComponent={
          <TouchableOpacity onPress={handleChatPress}>
            <Text style={styles.chatIcon}>💬</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Saldo Principal */}
        <Card variant="purple" style={styles.balanceCard}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Saldo Atual</Text>
            <Text style={styles.balanceValue}>
              R$ {mockUserData.currentBalance.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={styles.balanceSubtitle}>
              Renda mensal: R$ {mockUserData.monthlyIncome.toLocaleString('pt-BR')}
            </Text>
          </View>
        </Card>

        {/* Widgets Financeiros */}
        <View style={styles.widgetsContainer}>
          <View style={styles.widgetRow}>
            <FinancialWidget
              title="Meta de Poupança"
              value={`${calculateSavingsRate().toFixed(0)}%`}
              subtitle={`R$ ${mockUserData.currentSavings} de R$ ${mockUserData.savingsGoal}`}
              trend={calculateSavingsRate() >= 70 ? 'up' : 'stable'}
              trendValue={calculateSavingsRate() >= 70 ? 'No caminho certo!' : 'Continue assim'}
              variant={calculateSavingsRate() >= 70 ? 'success' : 'default'}
              onPress={handleAnalysisPress}
            />
          </View>

          <View style={styles.widgetRow}>
            <FinancialWidget
              title="Ativos vs Passivos"
              value={`R$ ${mockUserData.assetsValue - mockUserData.liabilitiesValue}`}
              subtitle={`Ativos: R$ ${mockUserData.assetsValue} | Passivos: R$ ${mockUserData.liabilitiesValue}`}
              trend={mockUserData.assetsValue > mockUserData.liabilitiesValue ? 'up' : 'down'}
              trendValue={mockUserData.assetsValue > mockUserData.liabilitiesValue ? 'Mais ativos!' : 'Cuidado com passivos'}
              variant={mockUserData.assetsValue > mockUserData.liabilitiesValue ? 'success' : 'warning'}
              onPress={handleAnalysisPress}
            />
          </View>

          <View style={styles.widgetRow}>
            <FinancialWidget
              title="Gastos do Mês"
              value={`R$ ${mockUserData.monthlyExpenses.toLocaleString('pt-BR')}`}
              subtitle={`${((mockUserData.monthlyExpenses / mockUserData.monthlyIncome) * 100).toFixed(0)}% da renda`}
              trend="stable"
              trendValue="Dentro do esperado"
              onPress={handleAnalysisPress}
            />
          </View>
        </View>

        {/* Dica do Dia */}
        <Card title="💡 Dica do Dia" style={styles.tipCard}>
          <Text style={styles.tipText}>{tipOfTheDay}</Text>
          <Button
            title="Ver mais dicas"
            variant="outline"
            size="small"
            onPress={() => console.log('Ver educação')}
            style={styles.tipButton}
          />
        </Card>

        {/* Transações Recentes */}
        <Card title="Transações Recentes" style={styles.transactionsCard}>
          {mockTransactions.slice(0, 3).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionCategory}>
                  {transaction.category}
                </Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'income' ? COLORS.success : COLORS.text }
              ]}>
                {transaction.type === 'income' ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          ))}
          <Button
            title="Ver todas as transações"
            variant="ghost"
            size="small"
            onPress={() => console.log('Ver transações')}
            style={styles.seeAllButton}
          />
        </Card>

        {/* Ações Rápidas */}
        <Card title="Ações Rápidas" style={styles.actionsCard}>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionItem} onPress={handleAddTransaction}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>Adicionar Gasto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={handleChatPress}>
              <Text style={styles.actionIcon}>🤖</Text>
              <Text style={styles.actionText}>Consultor IA</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={handleAnalysisPress}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Relatórios</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={() => console.log('Metas')}>
              <Text style={styles.actionIcon}>🎯</Text>
              <Text style={styles.actionText}>Metas</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Espaço para o FAB */}
        <View style={styles.fabSpace} />
      </ScrollView>

      <FloatingActionButton
        onPress={handleAddTransaction}
        icon="💰"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  chatIcon: {
    fontSize: 24,
  },
  balanceCard: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  balanceValue: {
    ...TYPOGRAPHY.h1,
    color: COLORS.white,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  balanceSubtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.white,
    opacity: 0.7,
  },
  widgetsContainer: {
    marginBottom: SPACING.lg,
  },
  widgetRow: {
    marginBottom: SPACING.sm,
  },
  tipCard: {
    marginBottom: SPACING.lg,
  },
  tipText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
    fontStyle: 'italic',
  },
  tipButton: {
    alignSelf: 'flex-start',
  },
  transactionsCard: {
    marginBottom: SPACING.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '600',
  },
  transactionCategory: {
    ...TYPOGRAPHY.small,
    color: COLORS.gray,
    textTransform: 'capitalize',
  },
  transactionAmount: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
  },
  seeAllButton: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  actionsCard: {
    marginBottom: SPACING.lg,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  actionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  fabSpace: {
    height: 80,
  },
});

export default DashboardScreen;

