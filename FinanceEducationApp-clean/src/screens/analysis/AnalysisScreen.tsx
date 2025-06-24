import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import Card, { FinancialWidget } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CustomHeader } from '../../navigation/AppNavigator';
import { FinancialAnalysisUtils, PaiRicoAnalysis, PsicologiaFinanceiraAnalysis, BabiloniaAnalysis } from '../../utils/financialAnalysis';
import { Transaction, User, FinancialAnalysis } from '../../types';
import StorageService from '../../services/storageService';

const { width } = Dimensions.get('window');

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@email.com',
  monthlyIncome: 5000,
  savingsGoal: 500,
  profile: {
    riskTolerance: 'moderate',
    financialKnowledge: 'beginner',
    behaviorPattern: 'analytical',
  },
  preferences: {
    notifications: true,
    chatPersonality: 'friendly',
    language: 'pt-BR',
    currency: 'BRL',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    amount: 150,
    category: 'food',
    type: 'expense',
    classification: 'neutral',
    description: 'Supermercado',
    date: new Date(2024, 5, 20),
    isRecurring: false,
    emotionalState: 'neutral',
  },
  {
    id: '2',
    userId: '1',
    amount: 5000,
    category: 'salary',
    type: 'income',
    classification: 'neutral',
    description: 'Salário',
    date: new Date(2024, 5, 1),
    isRecurring: true,
    emotionalState: 'happy',
  },
  {
    id: '3',
    userId: '1',
    amount: 200,
    category: 'education',
    type: 'expense',
    classification: 'asset',
    description: 'Curso Online de Investimentos',
    date: new Date(2024, 5, 15),
    isRecurring: false,
    emotionalState: 'excited',
  },
  {
    id: '4',
    userId: '1',
    amount: 800,
    category: 'luxury',
    type: 'expense',
    classification: 'liability',
    description: 'Smartphone novo',
    date: new Date(2024, 5, 10),
    isRecurring: false,
    emotionalState: 'excited',
  },
  {
    id: '5',
    userId: '1',
    amount: 300,
    category: 'investment',
    type: 'expense',
    classification: 'asset',
    description: 'Ações da Bolsa',
    date: new Date(2024, 5, 5),
    isRecurring: false,
    emotionalState: 'neutral',
  },
];

interface AnalysisScreenProps {
  navigation?: any;
  route?: any;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ navigation, route }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAnalysis();
  }, [selectedPeriod]);

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      // Em produção, carregaria dados reais do storage
      const transactions = mockTransactions;
      
      const financialAnalysis = FinancialAnalysisUtils.generateCompleteAnalysis(
        transactions,
        mockUser,
        selectedPeriod
      );

      setAnalysis(financialAnalysis);
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {(['monthly', 'weekly', 'yearly'] as const).map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.periodButtonActive
          ]}
          onPress={() => setSelectedPeriod(period)}
        >
          <Text style={[
            styles.periodButtonText,
            selectedPeriod === period && styles.periodButtonTextActive
          ]}>
            {period === 'monthly' ? 'Mensal' : period === 'weekly' ? 'Semanal' : 'Anual'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPaiRicoAnalysis = () => {
    const paiRicoData = PaiRicoAnalysis.calculateAssetLiabilityRatio(mockTransactions, mockUser);
    const educationData = PaiRicoAnalysis.analyzeFinancialEducation(mockTransactions);

    return (
      <Card title="📈 Análise Pai Rico, Pai Pobre" style={styles.analysisCard}>
        <View style={styles.analysisContent}>
          <View style={styles.metricRow}>
            <FinancialWidget
              title="Ativos Comprados"
              value={`R$ ${paiRicoData.assetsTotal.toFixed(0)}`}
              variant="success"
              trend="up"
              trendValue="Bom investimento!"
            />
          </View>
          
          <View style={styles.metricRow}>
            <FinancialWidget
              title="Passivos Comprados"
              value={`R$ ${paiRicoData.liabilitiesTotal.toFixed(0)}`}
              variant={paiRicoData.liabilitiesTotal > paiRicoData.assetsTotal ? "danger" : "default"}
              trend={paiRicoData.liabilitiesTotal > paiRicoData.assetsTotal ? "down" : "stable"}
              trendValue={paiRicoData.liabilitiesTotal > paiRicoData.assetsTotal ? "Cuidado!" : "Controlado"}
            />
          </View>

          <View style={styles.metricRow}>
            <FinancialWidget
              title="Educação Financeira"
              value={`${educationData.percentage.toFixed(1)}%`}
              subtitle={`R$ ${educationData.educationSpending.toFixed(0)} investidos`}
              variant={educationData.percentage >= 3 ? "success" : "warning"}
              trend={educationData.percentage >= 3 ? "up" : "stable"}
              trendValue={educationData.percentage >= 3 ? "Excelente!" : "Pode melhorar"}
            />
          </View>

          <Text style={styles.recommendationText}>
            💡 {paiRicoData.recommendation}
          </Text>
        </View>
      </Card>
    );
  };

  const renderPsicologiaAnalysis = () => {
    const emotionalData = PsicologiaFinanceiraAnalysis.analyzeEmotionalSpending(mockTransactions);
    const impulsiveData = PsicologiaFinanceiraAnalysis.detectImpulsiveBehavior(mockTransactions);
    const consistencyData = PsicologiaFinanceiraAnalysis.analyzeConsistency(mockTransactions);

    return (
      <Card title="🧠 Análise Psicologia Financeira" style={styles.analysisCard}>
        <View style={styles.analysisContent}>
          <View style={styles.metricRow}>
            <FinancialWidget
              title="Gastos Emocionais"
              value={`R$ ${emotionalData.emotionalSpending.toFixed(0)}`}
              subtitle="% dos gastos totais"
              variant={emotionalData.emotionalSpending > 500 ? "warning" : "default"}
              trend={emotionalData.emotionalSpending > 500 ? "down" : "stable"}
              trendValue={emotionalData.emotionalSpending > 500 ? "Atenção!" : "Controlado"}
            />
          </View>

          <View style={styles.metricRow}>
            <FinancialWidget
              title="Compras Impulsivas"
              value={`${impulsiveData.impulsiveCount}`}
              subtitle={`R$ ${impulsiveData.impulsiveAmount.toFixed(0)} gastos`}
              variant={impulsiveData.impulsiveCount > 3 ? "danger" : "success"}
              trend={impulsiveData.impulsiveCount > 3 ? "down" : "up"}
              trendValue={impulsiveData.impulsiveCount > 3 ? "Muitas!" : "Poucas"}
            />
          </View>

          <View style={styles.metricRow}>
            <FinancialWidget
              title="Consistência"
              value={`${consistencyData.consistencyScore.toFixed(0)}%`}
              subtitle="Regularidade nos gastos"
              variant={consistencyData.consistencyScore >= 80 ? "success" : "warning"}
              trend={consistencyData.consistencyScore >= 80 ? "up" : "stable"}
              trendValue={consistencyData.consistencyScore >= 80 ? "Ótima!" : "Melhorando"}
            />
          </View>

          <Text style={styles.recommendationText}>
            💡 {emotionalData.recommendation}
          </Text>
        </View>
      </Card>
    );
  };

  const renderBabiloniaAnalysis = () => {
    const tenPercentData = BabiloniaAnalysis.checkTenPercentRule(mockTransactions, mockUser);
    const disciplineData = BabiloniaAnalysis.analyzeDiscipline(mockTransactions);
    const protectionData = BabiloniaAnalysis.analyzeWealthProtection(mockTransactions);

    return (
      <Card title="🏛️ Análise O Homem Mais Rico da Babilônia" style={styles.analysisCard}>
        <View style={styles.analysisContent}>
          <View style={styles.metricRow}>
            <FinancialWidget
              title="Regra dos 10%"
              value={`${tenPercentData.savingsRate.toFixed(1)}%`}
              subtitle={`R$ ${tenPercentData.savingsAmount.toFixed(0)} poupados`}
              variant={tenPercentData.isFollowingRule ? "success" : "warning"}
              trend={tenPercentData.isFollowingRule ? "up" : "down"}
              trendValue={tenPercentData.isFollowingRule ? "Seguindo!" : "Precisa melhorar"}
            />
          </View>

          <View style={styles.metricRow}>
            <FinancialWidget
              title="Disciplina Financeira"
              value={`${disciplineData.disciplineScore.toFixed(0)}%`}
              subtitle="Autocontrole nos gastos"
              variant={disciplineData.disciplineScore >= 80 ? "success" : "warning"}
              trend={disciplineData.disciplineScore >= 80 ? "up" : "stable"}
              trendValue={disciplineData.disciplineScore >= 80 ? "Excelente!" : "Pode melhorar"}
            />
          </View>

          <View style={styles.metricRow}>
            <FinancialWidget
              title="Proteção do Patrimônio"
              value={protectionData.riskLevel === 'low' ? 'Baixo' : protectionData.riskLevel === 'medium' ? 'Médio' : 'Alto'}
              subtitle="Nível de risco"
              variant={protectionData.riskLevel === 'low' ? "success" : protectionData.riskLevel === 'medium' ? "warning" : "danger"}
              trend={protectionData.riskLevel === 'low' ? "up" : "down"}
              trendValue={protectionData.riskLevel === 'low' ? "Seguro!" : "Cuidado!"}
            />
          </View>

          <Text style={styles.recommendationText}>
            💡 {tenPercentData.recommendation}
          </Text>
        </View>
      </Card>
    );
  };

  const renderSummaryCard = () => {
    if (!analysis) return null;

    return (
      <Card title="📊 Resumo Geral" variant="purple" style={styles.summaryCard}>
        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Renda do Período</Text>
            <Text style={styles.summaryValue}>
              R$ {analysis.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Gastos do Período</Text>
            <Text style={styles.summaryValue}>
              R$ {analysis.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de Poupança</Text>
            <Text style={[
              styles.summaryValue,
              { color: analysis.savingsRate >= 10 ? COLORS.success : COLORS.warning }
            ]}>
              {analysis.savingsRate.toFixed(1)}%
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Score Comportamental</Text>
            <Text style={[
              styles.summaryValue,
              { color: analysis.behaviorScore >= 80 ? COLORS.success : COLORS.warning }
            ]}>
              {analysis.behaviorScore.toFixed(0)}/100
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <Button
        title="💬 Conversar sobre Análise"
        onPress={() => navigation?.navigate('Chat', { 
          sessionType: 'expense_analysis',
          initialMessage: 'Quero discutir minha análise financeira'
        })}
        variant="primary"
        style={styles.actionButton}
      />
      
      <Button
        title="📚 Aprender Mais"
        onPress={() => navigation?.navigate('Education')}
        variant="outline"
        style={styles.actionButton}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader
          title="Análise Financeira"
          subtitle="Carregando dados..."
          onBackPress={() => navigation?.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Analisando suas finanças...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Análise Financeira"
        subtitle="Baseada nos 3 livros de educação financeira"
        onBackPress={() => navigation?.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderPeriodSelector()}
        {renderSummaryCard()}
        {renderPaiRicoAnalysis()}
        {renderPsicologiaAnalysis()}
        {renderBabiloniaAnalysis()}
        {renderActionButtons()}
        
        <View style={styles.bottomSpace} />
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.xs,
    marginVertical: SPACING.md,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    ...TYPOGRAPHY.small,
    color: COLORS.gray,
    fontWeight: '600' as const,
  },
  periodButtonTextActive: {
    color: COLORS.white,
  },
  summaryCard: {
    marginBottom: SPACING.lg,
  },
  summaryContent: {
    gap: SPACING.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    opacity: 0.9,
  },
  summaryValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: 'bold' as const,
  },
  analysisCard: {
    marginBottom: SPACING.lg,
  },
  analysisContent: {
    gap: SPACING.md,
  },
  metricRow: {
    marginBottom: SPACING.sm,
  },
  recommendationText: {
    ...TYPOGRAPHY.small,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 18,
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  actionButtons: {
    gap: SPACING.md,
    marginVertical: SPACING.lg,
  },
  actionButton: {
    width: '100%',
  },
  bottomSpace: {
    height: SPACING.xl,
  },
});

export default AnalysisScreen;

