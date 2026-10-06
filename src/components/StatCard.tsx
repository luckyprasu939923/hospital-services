import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';

interface Props {
  label: string;
  value: number | string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  changeText?: string;
  isPositiveChange?: boolean;
  onPress?: () => void;
}

export default function StatCard({
  label,
  value,
  icon,
  color = colors.primary,
  changeText,
  isPositiveChange = true,
  onPress,
}: Props) {
  const content = (
    <View style={styles.cardInner}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        {changeText && (
          <View
            style={[
              styles.changeBadge,
              { backgroundColor: isPositiveChange ? colors.successLight : colors.dangerLight },
            ]}
          >
            <Ionicons
              name={isPositiveChange ? 'trending-up' : 'trending-down'}
              size={11}
              color={isPositiveChange ? colors.success : colors.danger}
            />
            <Text
              style={[
                styles.changeText,
                { color: isPositiveChange ? colors.success : colors.danger },
              ]}
              numberOfLines={1}
            >
              {changeText}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.bottomBlock}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-between',
  },
  cardInner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 38,
    marginBottom: spacing.sm,
    gap: 6,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 3,
    flexShrink: 1,
    maxWidth: '72%',
  },
  changeText: {
    fontSize: 9.5,
    fontWeight: '700',
    flexShrink: 1,
  },
  bottomBlock: {
    marginTop: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
