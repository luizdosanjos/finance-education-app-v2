import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  variant?: 'default' | 'currency' | 'percentage';
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  labelStyle,
  variant = 'default',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const formatValue = (text: string) => {
    switch (variant) {
      case 'currency':
        // Remove non-numeric characters except comma and dot
        const numericValue = text.replace(/[^0-9.,]/g, '');
        return numericValue;
      case 'percentage':
        // Limit to 100 and add % symbol
        const percentValue = text.replace(/[^0-9.,]/g, '');
        const numValue = parseFloat(percentValue);
        if (numValue > 100) return '100';
        return percentValue;
      default:
        return text;
    }
  };

  const handleChangeText = (text: string) => {
    const formattedText = formatValue(text);
    onChangeText(formattedText);
  };

  const getContainerStyle = (): ViewStyle => ({
    marginVertical: SPACING.xs,
  });

  const getInputContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: error ? COLORS.danger : isFocused ? COLORS.primary : COLORS.lightGray,
    borderRadius: 8,
    backgroundColor: disabled ? COLORS.lightGray : COLORS.white,
    paddingHorizontal: SPACING.sm,
    minHeight: multiline ? 80 : 48,
  });

  const getInputStyle = (): TextStyle => ({
    flex: 1,
    ...TYPOGRAPHY.body,
    color: disabled ? COLORS.gray : COLORS.text,
    paddingVertical: SPACING.sm,
    textAlignVertical: multiline ? 'top' : 'center',
  });

  const getLabelStyle = (): TextStyle => ({
    ...TYPOGRAPHY.caption,
    color: error ? COLORS.danger : COLORS.gray,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  });

  const getErrorStyle = (): TextStyle => ({
    ...TYPOGRAPHY.small,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  });

  const displayValue = () => {
    if (variant === 'currency' && value) {
      return `R$ ${value}`;
    }
    if (variant === 'percentage' && value) {
      return `${value}%`;
    }
    return value;
  };

  const getPlaceholder = () => {
    if (variant === 'currency') {
      return placeholder || 'R$ 0,00';
    }
    if (variant === 'percentage') {
      return placeholder || '0%';
    }
    return placeholder;
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          value={variant === 'default' ? value : displayValue()}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={getPlaceholder()}
          placeholderTextColor={COLORS.gray}
          editable={!disabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={variant === 'currency' || variant === 'percentage' ? 'numeric' : keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconContainer}
          >
            <Text style={styles.eyeIcon}>
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={getErrorStyle()}>
          {error}
        </Text>
      )}
    </View>
  );
};

// Componente especializado para entrada de valores monetários
interface CurrencyInputProps {
  label?: string;
  value: number;
  onChangeValue: (value: number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChangeValue,
  placeholder = 'R$ 0,00',
  error,
  disabled,
  style,
}) => {
  const [displayValue, setDisplayValue] = useState(
    value > 0 ? value.toFixed(2).replace('.', ',') : ''
  );

  const handleChangeText = (text: string) => {
    // Remove tudo exceto números e vírgula
    const cleanText = text.replace(/[^0-9,]/g, '');
    setDisplayValue(cleanText);
    
    // Converter para número
    const numericValue = parseFloat(cleanText.replace(',', '.')) || 0;
    onChangeValue(numericValue);
  };

  return (
    <Input
      label={label}
      value={displayValue}
      onChangeText={handleChangeText}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      keyboardType="numeric"
      variant="currency"
      style={style}
      leftIcon={
        <Text style={styles.currencySymbol}>R$</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 16,
  },
  currencySymbol: {
    ...TYPOGRAPHY.body,
    color: COLORS.gray,
    fontWeight: '600',
  },
});

export default Input;

