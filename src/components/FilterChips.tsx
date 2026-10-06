import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../theme/colors';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Chip<T extends string> {
  id: T;
  label: string;
}

interface Props<T extends string> {
  options?: Option<T>[];
  chips?: Chip<T>[];
  selected: T;
  onChange?: (value: T) => void;
  onSelect?: (value: T) => void;
}

export default function FilterChips<T extends string>({
  options,
  chips,
  selected,
  onChange,
  onSelect,
}: Props<T>) {
  const items: Option<T>[] = chips
    ? chips.map((c) => ({ value: c.id, label: c.label }))
    : options || [];

  const handleSelect = (val: T) => {
    if (onSelect) onSelect(val);
    if (onChange) onChange(val);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((opt) => {
        const active = opt.value === selected;
        return (
          <Pressable
            key={opt.value}
            onPress={() => handleSelect(opt.value)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight || colors.border,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: 13, color: colors.text },
  textActive: { color: '#fff', fontWeight: '600' },
});
