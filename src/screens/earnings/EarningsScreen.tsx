import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme/colors';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import { MedicalTransaction } from '../../types';

export default function EarningsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { provider, earnings, transactions, requestPayout } = useApp();

  const bottomNavHeight = 60 + Math.max(insets.bottom, 8);
  const bottomPadding = bottomNavHeight + 16;

  const [periodTab, setPeriodTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(String(earnings.pendingPayout));

  const filteredTransactions = transactions.filter((t) => {
    if (selectedTypeFilter === 'all') return true;
    return t.type === selectedTypeFilter;
  });

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > earnings.pendingPayout) {
      return;
    }

    const success = requestPayout(amt);
    if (success) {
      setWithdrawModalVisible(false);
    }
  };

  const handleDownloadStatement = () => {
    // Statement processed directly
  };

  const renderTransactionItem = ({ item }: { item: MedicalTransaction }) => {
    const isWithdrawal = item.type === 'bank_withdrawal';

    return (
      <Card style={styles.txnCard}>
        <View style={styles.txnRow}>
          <View
            style={[
              styles.txnIconWrap,
              isWithdrawal
                ? { backgroundColor: colors.purpleLight }
                : item.type === 'op_booking'
                ? { backgroundColor: colors.hospitalRedLight }
                : item.type === 'consultation'
                ? { backgroundColor: colors.medicalBlueLight }
                : { backgroundColor: colors.pharmacyTealLight },
            ]}
          >
            <Ionicons
              name={
                isWithdrawal
                  ? 'business-outline'
                  : item.type === 'op_booking'
                  ? 'people-outline'
                  : item.type === 'consultation'
                  ? 'videocam-outline'
                  : 'receipt-outline'
              }
              size={18}
              color={
                isWithdrawal
                  ? colors.purple
                  : item.type === 'op_booking'
                  ? colors.hospitalRed
                  : item.type === 'consultation'
                  ? colors.medicalBlue
                  : colors.pharmacyTeal
              }
            />
          </View>

          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <View style={styles.titleRow}>
              <Text style={styles.txnTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.txnAmount,
                  isWithdrawal ? { color: colors.textSecondary } : { color: colors.success },
                ]}
              >
                {isWithdrawal ? `-₹${Math.abs(item.netPayout)}` : `+₹${item.netPayout}`}
              </Text>
            </View>

            <Text style={styles.serviceDesc}>{item.serviceDescription}</Text>
            <Text style={styles.patientLine}>Patient: {item.patientName}</Text>

            {/* Flat ₹50 fee breakdown if not withdrawal */}
            {!isWithdrawal && (
              <View style={styles.feeBreakdownRow}>
                <Text style={styles.feeBreakdownText}>
                  Gross: ₹{item.grossAmount} | Platform Fee: <Text style={{ color: colors.danger }}>-₹50</Text> | Net: <Text style={{ color: colors.success, fontWeight: '700' }}>₹{item.netPayout}</Text>
                </Text>
              </View>
            )}

            <View style={styles.metaRow}>
              <Text style={styles.dateText}>{item.date}</Text>
              <View
                style={[
                  styles.statusPill,
                  item.status === 'settled'
                    ? { backgroundColor: colors.successLight }
                    : item.status === 'processing'
                    ? { backgroundColor: colors.purpleLight }
                    : { backgroundColor: colors.warningLight },
                ]}
              >
                <Text
                  style={[
                    styles.statusPillText,
                    item.status === 'settled'
                      ? { color: colors.success }
                      : item.status === 'processing'
                      ? { color: colors.purple }
                      : { color: colors.warning },
                  ]}
                >
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Header */}
      <View style={styles.screenHeader}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              (navigation as any).navigate('Main', { screen: 'Home' });
            }
          }}
          accessibilityLabel="Back to Home"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.screenTitle}>Earnings & Payouts</Text>
          <Text style={styles.screenSubtitle}>Transparent breakdown & automated bank disbursal</Text>
        </View>
        <Pressable style={styles.downloadBtn} onPress={handleDownloadStatement}>
          <Ionicons name="download-outline" size={16} color={colors.primary} />
          <Text style={styles.downloadBtnText}>Statement</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector Tabs: Daily | Weekly | Monthly */}
        <View style={styles.periodTabsRow}>
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => {
            const active = periodTab === tab;
            return (
              <Pressable
                key={tab}
                style={[styles.periodTab, active && styles.periodTabActive]}
                onPress={() => setPeriodTab(tab)}
              >
                <Text style={[styles.periodTabText, active && styles.periodTabTextActive]}>
                  {tab.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Big Earnings Hero Card */}
        <Card style={styles.heroCard} padding="lg">
          <Text style={styles.heroLabel}>
            {periodTab === 'daily'
              ? "Today's Net Payout"
              : periodTab === 'weekly'
              ? 'This Week Net Payout'
              : 'This Month Net Payout'}
          </Text>
          <Text style={styles.heroAmount}>
            ₹
            {periodTab === 'daily'
              ? earnings.todayEarnings.toLocaleString('en-IN')
              : periodTab === 'weekly'
              ? earnings.weeklyEarnings.toLocaleString('en-IN')
              : earnings.monthlyEarnings.toLocaleString('en-IN')}
          </Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroFooter}>
            <View>
              <Text style={styles.pendingLabel}>Eligible for Bank Settlement</Text>
              <Text style={styles.pendingAmount}>
                ₹{earnings.pendingPayout.toLocaleString('en-IN')}
              </Text>
            </View>

            <Pressable
              style={styles.requestPayoutBtn}
              onPress={() => setWithdrawModalVisible(true)}
            >
              <Ionicons name="card-outline" size={15} color="#FFFFFF" />
              <Text style={styles.requestPayoutText}>Withdraw to Bank</Text>
            </Pressable>
          </View>
        </Card>

        {/* Platform Fee Transparent Guarantee Card */}
        <Card style={styles.feeNoticeCard} padding="md">
          <View style={styles.feeNoticeRow}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.feeNoticeTitle}>Flat ₹50 Platform Fee Structure</Text>
              <Text style={styles.feeNoticeText}>
                One Buddy Medical operates on zero percentage commissions. A flat ₹50 fee is deducted per completed booking or order, leaving 100% of your remaining charges as your net payout.
              </Text>
            </View>
          </View>
        </Card>

        {/* Registered Bank Account Summary */}
        <Card style={styles.bankCard} padding="md">
          <View style={styles.bankRow}>
            <View style={styles.bankIconWrap}>
              <Ionicons name="business" size={20} color={colors.textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankTitle}>{provider.bankDetails.bankName}</Text>
              <Text style={styles.bankSub}>
                A/C: ••••{provider.bankDetails.accountNumber.slice(-4)} • IFSC: {provider.bankDetails.ifscCode}
              </Text>
              <Text style={styles.bankHolder}>Beneficiary: {provider.bankDetails.accountName}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={13} color={colors.success} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
        </Card>

        {/* Transaction History Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Transaction & Settlement History</Text>
        </View>

        {/* Filter Chips */}
        <View style={styles.chipsRow}>
          {[
            { id: 'all', label: 'All' },
            { id: 'op_booking', label: 'OP Bookings' },
            { id: 'consultation', label: 'Consults' },
            { id: 'medicine_order', label: 'Medicine Orders' },
            { id: 'bank_withdrawal', label: 'Withdrawals' },
          ].map((c) => {
            const active = selectedTypeFilter === c.id;
            return (
              <Pressable
                key={c.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedTypeFilter(c.id)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Transactions List */}
        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          {filteredTransactions.map((tx) => (
            <View key={tx.id}>{renderTransactionItem({ item: tx })}</View>
          ))}
        </View>
      </ScrollView>

      {/* Bank Withdrawal Modal */}
      <Modal visible={withdrawModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Bank Settlement</Text>
              <Pressable onPress={() => setWithdrawModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Available Eligible Balance: ₹{earnings.pendingPayout.toLocaleString('en-IN')}
            </Text>

            <Text style={styles.inputLabel}>Payout Amount (₹)</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              placeholder="Enter amount"
            />

            <View style={styles.destBankBox}>
              <Text style={styles.destBankLabel}>Destination Bank Account:</Text>
              <Text style={styles.destBankName}>{provider.bankDetails.bankName}</Text>
              <Text style={styles.destBankDetails}>
                Account: {provider.bankDetails.accountNumber} • IFSC: {provider.bankDetails.ifscCode}
              </Text>
            </View>

            <View style={styles.modalBtnRow}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setWithdrawModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitBtn} onPress={handleWithdraw}>
                <Text style={styles.submitBtnText}>Confirm Disbursal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    minHeight: 56,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
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
    marginRight: spacing.sm,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  screenSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  downloadBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 110,
  },
  periodTabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 3,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  periodTabActive: {
    backgroundColor: colors.secondary,
  },
  periodTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  periodTabTextActive: {
    color: '#FFFFFF',
  },
  heroCard: {
    backgroundColor: colors.secondary,
    marginBottom: spacing.md,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: spacing.md,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pendingLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  pendingAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
    marginTop: 2,
  },
  requestPayoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  requestPayoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  feeNoticeCard: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryDark + '30',
    marginBottom: spacing.md,
  },
  feeNoticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  feeNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  feeNoticeText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  bankCard: {
    marginBottom: spacing.md,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bankIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  bankSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  bankHolder: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.success,
  },
  sectionHeaderRow: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.xs,
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
  txnCard: {
    padding: spacing.md,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  txnIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txnTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  serviceDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  patientLine: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  feeBreakdownRow: {
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.xs,
    marginVertical: 4,
  },
  feeBreakdownText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
  },
  destBankBox: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  destBankLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  destBankName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  destBankDetails: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.lg,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
