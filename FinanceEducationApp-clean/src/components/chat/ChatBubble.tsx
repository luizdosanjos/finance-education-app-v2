import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { ChatMessage } from '../../types';

interface ChatBubbleProps {
  message: ChatMessage;
  onPress?: () => void;
  onLongPress?: () => void;
  showTimestamp?: boolean;
  style?: ViewStyle;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onPress,
  onLongPress,
  showTimestamp = true,
  style,
}) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  const getBubbleContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    marginVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    justifyContent: isUser ? 'flex-end' : 'flex-start',
  });

  const getBubbleStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      maxWidth: '80%',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 18,
      shadowColor: COLORS.text,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    };

    if (isUser) {
      baseStyle.backgroundColor = COLORS.primary;
      baseStyle.borderBottomRightRadius = 4;
    } else {
      baseStyle.backgroundColor = COLORS.white;
      baseStyle.borderBottomLeftRadius = 4;
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = COLORS.lightGray;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => ({
    ...TYPOGRAPHY.body,
    color: isUser ? COLORS.white : COLORS.text,
    lineHeight: 20,
  });

  const getTimestampStyle = (): TextStyle => ({
    ...TYPOGRAPHY.small,
    color: COLORS.gray,
    marginTop: SPACING.xs,
    textAlign: isUser ? 'right' : 'left',
  });

  const getAvatarStyle = (): ViewStyle => ({
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isUser ? COLORS.primary : COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isUser ? 0 : SPACING.sm,
    marginLeft: isUser ? SPACING.sm : 0,
  });

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Agora';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h`;
    } else {
      return messageDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getContextIndicator = () => {
    if (!message.context) return null;

    let indicator = '';
    let color = COLORS.gray;

    if (message.context.transactionId) {
      indicator = '💰';
      color = COLORS.warning;
    } else if (message.context.bookReference) {
      indicator = '📚';
      color = COLORS.success;
    } else if (message.context.recommendation) {
      indicator = '💡';
      color = COLORS.primary;
    }

    if (!indicator) return null;

    return (
      <View style={[styles.contextIndicator, { backgroundColor: color }]}>
        <Text style={styles.contextEmoji}>{indicator}</Text>
      </View>
    );
  };

  const BubbleContent = () => (
    <View style={getBubbleContainerStyle()}>
      {!isUser && (
        <View style={getAvatarStyle()}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>
      )}
      
      <View style={{ flex: 1, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <View style={[getBubbleStyle(), style]}>
          {getContextIndicator()}
          <Text style={getTextStyle()}>
            {message.content}
          </Text>
        </View>
        
        {showTimestamp && (
          <Text style={getTimestampStyle()}>
            {formatTimestamp(message.timestamp)}
          </Text>
        )}
      </View>
      
      {isUser && (
        <View style={getAvatarStyle()}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
      )}
    </View>
  );

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}
      >
        <BubbleContent />
      </TouchableOpacity>
    );
  }

  return <BubbleContent />;
};

// Componente para mensagens de sistema/status
interface SystemMessageProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  style?: ViewStyle;
}

export const SystemMessage: React.FC<SystemMessageProps> = ({
  message,
  type = 'info',
  style,
}) => {
  const getSystemStyle = (): ViewStyle => {
    let backgroundColor = COLORS.lightGray;
    
    switch (type) {
      case 'success':
        backgroundColor = COLORS.success;
        break;
      case 'warning':
        backgroundColor = COLORS.warning;
        break;
      case 'error':
        backgroundColor = COLORS.danger;
        break;
    }

    return {
      backgroundColor,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: 12,
      marginVertical: SPACING.xs,
      marginHorizontal: SPACING.lg,
      alignSelf: 'center',
    };
  };

  const getSystemTextStyle = (): TextStyle => ({
    ...TYPOGRAPHY.small,
    color: type === 'info' ? COLORS.gray : COLORS.white,
    textAlign: 'center',
    fontWeight: '500',
  });

  return (
    <View style={[getSystemStyle(), style]}>
      <Text style={getSystemTextStyle()}>
        {message}
      </Text>
    </View>
  );
};

// Componente para indicador de digitação
export const TypingIndicator: React.FC = () => {
  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingAvatar}>
        <Text style={styles.avatarText}>🤖</Text>
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarText: {
    fontSize: 16,
  },
  contextIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  contextEmoji: {
    fontSize: 10,
  },
  typingContainer: {
    flexDirection: 'row',
    marginVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    justifyContent: 'flex-start',
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  typingBubble: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gray,
    marginHorizontal: 2,
  },
  dot1: {
    // Animation would be added here in a real implementation
  },
  dot2: {
    // Animation would be added here in a real implementation
  },
  dot3: {
    // Animation would be added here in a real implementation
  },
});

export default ChatBubble;

