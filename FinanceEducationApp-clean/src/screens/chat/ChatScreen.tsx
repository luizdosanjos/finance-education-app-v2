import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { ChatMessage, User } from '../../types';
import { ChatBubble, TypingIndicator } from '../../components/chat';
import { CustomHeader } from '../../navigation/AppNavigator';
import { useChat } from '../../hooks/useChat';

// Mock user data - em produção viria do Redux/Context
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

interface ChatScreenProps {
  navigation?: any;
  route?: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    isTyping,
    isLoading,
    sendMessage,
    clearChat,
    analyzeExpense,
    getEducationalTip,
  } = useChat({ 
    user: mockUser,
    sessionType: route?.params?.sessionType || 'general'
  });

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const messageText = inputText.trim();
    setInputText('');
    
    await sendMessage(messageText);
  };

  const handleQuickReply = async (reply: string) => {
    await sendMessage(reply);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <ChatBubble
      message={item}
      onPress={() => {
        // Ação ao pressionar mensagem (copiar, etc.)
      }}
    />
  );

  const renderQuickReplies = () => {
    const quickReplies = [
      '💰 Quero analisar um gasto',
      '📊 Como estão minhas finanças?',
      '📚 Me ensine sobre investimentos',
      '🎯 Ajude-me com uma meta',
      '❓ Tenho uma dúvida',
    ];

    return (
      <View style={styles.quickRepliesContainer}>
        <Text style={styles.quickRepliesTitle}>Sugestões:</Text>
        <View style={styles.quickRepliesRow}>
          {quickReplies.map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReplyButton}
              onPress={() => handleQuickReply(reply)}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderInputArea = () => (
    <View style={styles.inputContainer}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={COLORS.gray}
          multiline
          maxLength={500}
          editable={!isLoading}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() ? COLORS.primary : COLORS.lightGray }
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={[
            styles.sendButtonText,
            { color: inputText.trim() ? COLORS.white : COLORS.gray }
          ]}>
            ➤
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Consultor Financeiro IA"
        subtitle="Baseado nos 3 livros de educação financeira"
        onBackPress={() => navigation?.goBack()}
        rightComponent={
          <TouchableOpacity onPress={clearChat}>
            <Text style={styles.clearIcon}>🗑️</Text>
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>💬 Chat Financeiro</Text>
            <Text style={styles.emptySubtitle}>
              Converse com seu consultor IA especializado em educação financeira
            </Text>
            {renderQuickReplies()}
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            onLayout={() => flatListRef.current?.scrollToEnd()}
            showsVerticalScrollIndicator={false}
          />
        )}

        {isTyping && <TypingIndicator />}

        {renderInputArea()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  clearIcon: {
    fontSize: 20,
  },
  messagesList: {
    flex: 1,
    paddingVertical: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  quickRepliesContainer: {
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  quickRepliesTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  quickRepliesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  quickReplyButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: SPACING.sm,
  },
  quickReplyText: {
    ...TYPOGRAPHY.small,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    maxHeight: 100,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
});

export default ChatScreen;

