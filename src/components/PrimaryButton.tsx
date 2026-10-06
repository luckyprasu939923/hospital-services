import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
}: Props) {
  let bg = colors.primary;
  let fg = '#FFFFFF';
  let border = 'transparent';

  switch (variant) {
    case 'primary':
      bg = colors.primary;
      fg = '#FFFFFF';
      break;
    case 'secondary':
      bg = colors.primaryLight;
      fg = colors.primary;
      break;
    case 'outline':
      bg = 'transparent';
      fg = colors.primary;
      border = colors.primary;
      break;
    case 'danger':
      bg = colors.danger;
      fg = '#FFFFFF';
      break;
    case 'success':
      bg = colors.success;
      fg = '#FFFFFF';
      break;
    case 'ghost':
      bg = 'transparent';
      fg = colors.textSecondary;
      break;
  }

  const verticalPadding = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;
  const horizontalPadding = size === 'sm' ? 12 : size === 'lg' ? 24 : 16;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 14;
  const iconSize = size === 'sm' ? 15 : size === 'lg' ? 20 : 17;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: border !== 'transparent' ? 1.5 : 0,
          paddingVertical: verticalPadding,
          paddingHorizontal: horizontalPadding,
        },
        (pressed || disabled) && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={iconSize} color={fg} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { color: fg, fontSize }]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={iconSize} color={fg} style={styles.iconRight} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
});
