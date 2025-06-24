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

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  variant?: 'default' | 'purple' | 'success' | 'warning' | 'danger';
  elevation?: number;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  padding?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  onPress,
  variant = 'default',
  elevation = 2,
  style,
  titleStyle,
  subtitleStyle,
  padding = SPACING.md,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      padding,
      marginVertical: SPACING.xs,
      shadowColor: COLORS.text,
      shadowOffset: {
        width: 0,
        height: elevation,
      },
      shadowOpacity: 0.1,
      shadowRadius: elevation * 2,
      elevation: elevation,
    };

    // Variant styles
    switch (variant) {
      case 'purple':
        baseStyle.backgroundColor = COLORS.primary;
        break;
      case 'success':
        baseStyle.backgroundColor = COLORS.success;
        break;
      case 'warning':
        baseStyle.backgroundColor = COLORS.warning;
        break;
      case 'danger':
        baseStyle.backgroundColor = COLORS.danger;
        break;
      default:
        baseStyle.backgroundColor = COLORS.white;
    }

    return baseStyle;
  };

  const getTitleStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...TYPOGRAPHY.h3,
      marginBottom: subtitle ? SPACING.xs : 0,
    };

    // Adjust color based on variant
    if (['purple', 'success', 'warning', 'danger'].includes(variant)) {
      baseStyle.color = COLORS.white;
    } else {
      baseStyle.color = COLORS.text;
    }

    return baseStyle;
  };

  const getSubtitleStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...TYPOGRAPHY.body,
      opacity: 0.8,
      marginBottom: children ? SPACING.sm : 0,
    };

    // Adjust color based on variant
    if (['purple', 'success', 'warning', 'danger'].includes(variant)) {
      baseStyle.color = COLORS.white;
    } else {
      baseStyle.color = COLORS.gray;
    }

    return baseStyle;
  };

  const CardContent = () => (
    <View style={[getCardStyle(), style]}>
      {title && (
        <Text style={[getTitleStyle(), titleStyle]}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text style={[getSubtitleStyle(), subtitleStyle]}>
          {subtitle}
        </Text>
      )}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

// Componente especializado para widgets financeiros
interface FinancialWidgetProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  onPress?: () => void;
  variant?: 'default' | 'purple' | 'success' | 'warning' | 'danger';
}

export const FinancialWidget: React.FC<FinancialWidgetProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  onPress,
  variant = 'default',
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return COLORS.success;
      case 'down':
        return COLORS.danger;
      default:
        return COLORS.gray;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  return (
    <Card variant={variant} onPress={onPress}>
      <View style={styles.widgetContainer}>
        <Text style={[
          styles.widgetTitle,
          { color: variant === 'purple' ? COLORS.white : COLORS.gray }
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.widgetValue,
          { color: variant === 'purple' ? COLORS.white : COLORS.text }
        ]}>
          {value}
        </Text>
        {subtitle && (
          <Text style={[
            styles.widgetSubtitle,
            { color: variant === 'purple' ? COLORS.white : COLORS.gray }
          ]}>
            {subtitle}
          </Text>
        )}
        {trend && trendValue && (
          <View style={styles.trendContainer}>
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {getTrendIcon()} {trendValue}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    alignItems: 'flex-start',
  },
  widgetTitle: {
    ...TYPOGRAPHY.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  widgetValue: {
    ...TYPOGRAPHY.h2,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  widgetSubtitle: {
    ...TYPOGRAPHY.small,
    marginBottom: SPACING.xs,
  },
  trendContainer: {
    marginTop: SPACING.xs,
  },
  trendText: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
  },
});

export default Card;

