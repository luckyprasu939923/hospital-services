import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  label?: string;
  status?: string;
  color?: string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export default function StatusBadge({ label, status, color, size = 'sm', style }: Props) {
  let finalColor = color || colors.primary;
  let finalLabel = label || status || '';

  if (status && !color) {
    switch (status.toLowerCase()) {
      // Room statuses
      case 'available':
        finalColor = colors.success;
        finalLabel = label || 'Available';
        break;
      case 'occupied':
        finalColor = colors.danger;
        finalLabel = label || 'Occupied';
        break;
      case 'reserved':
        finalColor = colors.accent;
        finalLabel = label || 'Reserved';
        break;
      case 'maintenance':
        finalColor = colors.warning;
        finalLabel = label || 'Maintenance';
        break;
      case 'cleaning':
        finalColor = colors.teal;
        finalLabel = label || 'Cleaning';
        break;

      // Booking statuses
      case 'new_request':
        finalColor = colors.purple;
        finalLabel = label || 'New Request';
        break;
      case 'confirmed':
        finalColor = colors.info;
        finalLabel = label || 'Confirmed';
        break;
      case 'upcoming':
        finalColor = colors.accent;
        finalLabel = label || 'Upcoming';
        break;
      case 'checked_in':
        finalColor = colors.success;
        finalLabel = label || 'Checked-In';
        break;
      case 'checked_out':
        finalColor = colors.textMuted;
        finalLabel = label || 'Checked-Out';
        break;
      case 'cancelled':
        finalColor = colors.danger;
        finalLabel = label || 'Cancelled';
        break;

      // Payment statuses
      case 'paid':
        finalColor = colors.success;
        finalLabel = label || 'Paid';
        break;
      case 'pending':
        finalColor = colors.warning;
        finalLabel = label || 'Pending';
        break;
      case 'in_progress':
        finalColor = colors.info;
        finalLabel = label || 'In Progress';
        break;
      case 'completed':
        finalColor = colors.success;
        finalLabel = label || 'Completed';
        break;
      case 'refunded':
        finalColor = colors.purple;
        finalLabel = label || 'Refunded';
        break;

      // Priority
      case 'high':
        finalColor = colors.danger;
        finalLabel = label || 'High Priority';
        break;
      case 'medium':
        finalColor = colors.warning;
        finalLabel = label || 'Medium Priority';
        break;
      case 'low':
        finalColor = colors.info;
        finalLabel = label || 'Low Priority';
        break;

      default:
        finalColor = colors.primary;
        finalLabel = label || status;
    }
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${finalColor}18`,
          borderColor: `${finalColor}40`,
          paddingHorizontal: isSmall ? 8 : 12,
          paddingVertical: isSmall ? 3 : 5,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: finalColor }]} />
      <Text style={[styles.text, { color: finalColor, fontSize: isSmall ? 11 : 12 }]}>
        {finalLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
