import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme/colors';
import Card from '../../components/Card';
import { MedicalNotification } from '../../types';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    return n.type === activeFilter;
  });

  const getIconForType = (type: MedicalNotification['type']) => {
    switch (type) {
      case 'booking':
        return { name: 'calendar', color: colors.hospitalRed, bg: colors.hospitalRedLight };
      case 'consultation':
        return { name: 'videocam', color: colors.medicalBlue, bg: colors.medicalBlueLight };
      case 'visit':
        return { name: 'car', color: colors.primary, bg: colors.primaryLight };
      case 'order':
        return { name: 'receipt', color: colors.pharmacyTeal, bg: colors.pharmacyTealLight };
      case 'payout':
        return { name: 'wallet', color: colors.purple, bg: colors.purpleLight };
      default:
        return { name: 'notifications', color: colors.textSecondary, bg: colors.borderLight };
    }
  };

  const renderNotificationItem = ({ item }: { item: MedicalNotification }) => {
    const iconData = getIconForType(item.type);

    return (
      <Pressable onPress={() => markNotificationRead(item.id)}>
        <Card
          style={[
            styles.notifCard,
            !item.read && { backgroundColor: '#F0FDF4', borderColor: colors.primary + '50' },
          ]}
        >
          <View style={styles.cardRow}>
            <View style={[styles.iconWrap, { backgroundColor: iconData.bg }]}>
              <Ionicons name={iconData.name as any} size={20} color={iconData.color} />
            </View>

            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <View style={styles.titleRow}>
                <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>
                  {item.title}
                </Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>

              <Text style={styles.notifMessage}>{item.message}</Text>
              <Text style={styles.notifTime}>{item.timestamp}</Text>
            </View>
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Header */}
      <View style={styles.headerBar}>
        <Pressable
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              (navigation as any).navigate('Main');
            }
          }}
          style={styles.backBtn}
          accessibilityLabel="Back"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadNotificationsCount} unread booking & payment updates
          </Text>
        </View>
        {unreadNotificationsCount > 0 && (
          <Pressable style={styles.markAllBtn} onPress={markAllNotificationsRead}>
            <Text style={styles.markAllBtnText}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterChipsRow}>
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'booking', label: 'Bookings' },
          { id: 'consultation', label: 'Consults' },
          { id: 'order', label: 'Orders' },
          { id: 'payout', label: 'Payouts' },
        ].map((c) => {
          const active = activeFilter === c.id;
          return (
            <Pressable
              key={c.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveFilter(c.id)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="notifications-off-outline" size={44} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>You are all caught up!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    minHeight: 56,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  markAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
  },
  markAllBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  filterChipsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: 6,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.sm,
  },
  notifCard: {
    padding: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  notifTitleUnread: {
    fontWeight: '800',
    color: colors.primaryDark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 6,
  },
  notifMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  notifTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
