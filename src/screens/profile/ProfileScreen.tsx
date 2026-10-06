import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme/colors';
import Card from '../../components/Card';
import { RootStackParamList } from '../../navigation/types';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const bottomNavHeight = 60 + Math.max(insets.bottom, 8);
  const bottomPadding = bottomNavHeight + 16;
  const {
    provider,
    providerType,
    updateProviderProfile,
    updateBankDetails,
    logout,
  } = useApp();

  // Notification Preferences State
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyAppPush, setNotifyAppPush] = useState(true);

  // Edit Profile Modal
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [editName, setEditName] = useState(provider.name);
  const [editPhone, setEditPhone] = useState(provider.phone);
  const [editEmail, setEditEmail] = useState(provider.email);
  const [editAddress, setEditAddress] = useState(provider.address);
  const [editCity, setEditCity] = useState(provider.city);
  const [editPincode, setEditPincode] = useState(provider.pincode);

  // Edit Bank Modal
  const [editBankModal, setEditBankModal] = useState(false);
  const [bankName, setBankName] = useState(provider.bankDetails.bankName);
  const [accNumber, setAccNumber] = useState(provider.bankDetails.accountNumber);
  const [ifsc, setIfsc] = useState(provider.bankDetails.ifscCode);
  const [accHolder, setAccHolder] = useState(provider.bankDetails.accountName);
  const [upi, setUpi] = useState(provider.bankDetails.upiId || '');

  // Working Hours Modal
  const [hoursModal, setHoursModal] = useState(false);
  const [consultFee, setConsultFee] = useState(String(provider.consultationFee || 700));
  const [homeVisitFee, setHomeVisitFee] = useState(String(provider.homeVisitFee || 1200));
  const [radiusKm, setRadiusKm] = useState(String(provider.serviceRadiusKm || 10));

  const handleSaveProfile = () => {
    updateProviderProfile({
      name: editName,
      phone: editPhone,
      email: editEmail,
      address: editAddress,
      city: editCity,
      pincode: editPincode,
    });
    setEditProfileModal(false);
    Alert.alert('Profile Saved', 'Your provider profile details have been updated.');
  };

  const handleSaveBank = () => {
    updateBankDetails({
      bankName,
      accountNumber: accNumber,
      ifscCode: ifsc,
      accountName: accHolder,
      upiId: upi,
    });
    setEditBankModal(false);
    Alert.alert('Bank Details Saved', 'Bank account for payouts has been updated.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Provider Profile & Settings</Text>
        <Text style={styles.headerSubtitle}>
          {providerType === 'hospital'
            ? 'Hospital Partner'
            : providerType === 'doctor'
            ? 'Practicing Physician'
            : 'Pharmacy Partner'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Card style={styles.profileHeroCard} padding="lg">
          <View style={styles.profileRow}>
            <Image source={{ uri: provider.avatar }} style={styles.avatarImage} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <View style={styles.nameRow}>
                <Text style={styles.providerName} numberOfLines={1}>
                  {provider.name}
                </Text>
                {provider.approvalStatus === 'approved' && (
                  <Ionicons name="checkmark-circle" size={17} color={colors.primary} />
                )}
              </View>
              <Text style={styles.roleSub}>
                {providerType.toUpperCase()} PARTNER • {provider.city}, {provider.state}
              </Text>
              <Text style={styles.contactLine}>📞 {provider.phone}</Text>
              <Text style={styles.contactLine}>✉️ {provider.email}</Text>
            </View>
            <Pressable
              style={styles.editProfileBtn}
              onPress={() => setEditProfileModal(true)}
            >
              <Ionicons name="create-outline" size={18} color={colors.primary} />
            </Pressable>
          </View>
        </Card>

        {/* Verification & License Details */}
        <Card style={styles.licenseCard} padding="md">
          <View style={styles.licenseHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
              <Text style={styles.licenseTitle}>Medical Council & Legal License</Text>
            </View>
            <View
              style={[
                styles.approvalStatusPill,
                provider.approvalStatus === 'approved'
                  ? { backgroundColor: colors.successLight }
                  : provider.approvalStatus === 'pending'
                  ? { backgroundColor: colors.warningLight }
                  : { backgroundColor: colors.dangerLight },
              ]}
            >
              <Text
                style={[
                  styles.approvalStatusText,
                  provider.approvalStatus === 'approved'
                    ? { color: colors.success }
                    : provider.approvalStatus === 'pending'
                    ? { color: colors.warning }
                    : { color: colors.danger },
                ]}
              >
                {provider.approvalStatus.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.licenseDataRow}>
            <Text style={styles.licenseFieldLabel}>License Authority:</Text>
            <Text style={styles.licenseFieldValue}>{provider.licenseType}</Text>
          </View>

          <View style={styles.licenseDataRow}>
            <Text style={styles.licenseFieldLabel}>Registration Number:</Text>
            <Text style={styles.licenseFieldValue}>{provider.licenseNumber}</Text>
          </View>

          <View style={styles.licenseDataRow}>
            <Text style={styles.licenseFieldLabel}>Document Uploaded:</Text>
            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
              onPress={() => {
                Alert.alert(
                  'Verified Regulatory Document',
                  `Document File: ${provider.licenseDocName}\nStatus: Verified by One Buddy Compliance Team.`,
                );
              }}
            >
              <Ionicons name="document-attach" size={13} color={colors.primary} />
              <Text style={styles.docLinkText}>{provider.licenseDocName}</Text>
            </Pressable>
          </View>
        </Card>

        {/* Bank Details Card */}
        <Card style={styles.cardSection} padding="md">
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="card-outline" size={18} color={colors.text} />
              <Text style={styles.sectionHeading}>Payout Bank Details</Text>
            </View>
            <Pressable onPress={() => setEditBankModal(true)}>
              <Text style={styles.editActionLink}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.bankDataRow}>
            <Text style={styles.dataLabel}>Bank Name:</Text>
            <Text style={styles.dataValue}>{provider.bankDetails.bankName}</Text>
          </View>
          <View style={styles.bankDataRow}>
            <Text style={styles.dataLabel}>Account Number:</Text>
            <Text style={styles.dataValue}>
              ••••••••{provider.bankDetails.accountNumber.slice(-4)}
            </Text>
          </View>
          <View style={styles.bankDataRow}>
            <Text style={styles.dataLabel}>IFSC Code:</Text>
            <Text style={styles.dataValue}>{provider.bankDetails.ifscCode}</Text>
          </View>
          <View style={styles.bankDataRow}>
            <Text style={styles.dataLabel}>Account Holder:</Text>
            <Text style={styles.dataValue}>{provider.bankDetails.accountName}</Text>
          </View>
        </Card>

        {/* Operating Hours & Fees (For Doctors & Clinics) */}
        {providerType === 'doctor' && (
          <Card style={styles.cardSection} padding="md">
            <View style={styles.sectionHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="time-outline" size={18} color={colors.text} />
                <Text style={styles.sectionHeading}>Consultation & Radius Settings</Text>
              </View>
              <Pressable onPress={() => setHoursModal(true)}>
                <Text style={styles.editActionLink}>Edit</Text>
              </Pressable>
            </View>

            <View style={styles.bankDataRow}>
              <Text style={styles.dataLabel}>Online Consult Fee:</Text>
              <Text style={styles.dataValue}>₹{provider.consultationFee}</Text>
            </View>
            <View style={styles.bankDataRow}>
              <Text style={styles.dataLabel}>Home Visit Fee:</Text>
              <Text style={styles.dataValue}>₹{provider.homeVisitFee}</Text>
            </View>
            <View style={styles.bankDataRow}>
              <Text style={styles.dataLabel}>Service Radius:</Text>
              <Text style={styles.dataValue}>{provider.serviceRadiusKm} km</Text>
            </View>
          </Card>
        )}

        {/* Ratings & Customer Reviews Showcase */}
        <Card style={styles.cardSection} padding="md">
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="star" size={18} color={colors.accentGold} />
              <Text style={styles.sectionHeading}>Ratings & Reviews ({provider.totalReviews})</Text>
            </View>
            <Text style={styles.overallRatingText}>★ {provider.rating} / 5.0</Text>
          </View>

          <View style={styles.reviewItem}>
            <View style={styles.reviewItemHeader}>
              <Text style={styles.reviewerName}>Ananya Sharma</Text>
              <Text style={styles.reviewStars}>★★★★★</Text>
            </View>
            <Text style={styles.reviewText}>
              "Prompt response, very polite staff and excellent diagnosis on One Buddy!"
            </Text>
          </View>

          <View style={styles.reviewItem}>
            <View style={styles.reviewItemHeader}>
              <Text style={styles.reviewerName}>Karthik Subramanian</Text>
              <Text style={styles.reviewStars}>★★★★★</Text>
            </View>
            <Text style={styles.reviewText}>
              "Timely consultation and medicine instructions were clear on WhatsApp."
            </Text>
          </View>
        </Card>

        {/* Real-Time Push & Sync Notification Channels */}
        <Card style={styles.cardSection} padding="md">
          <Text style={styles.sectionHeading}>Notification Preferences</Text>
          <Text style={styles.notifSub}>
            Customer bookings, reschedules, and cancellations trigger automatic alerts:
          </Text>

          <View style={styles.switchRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
              <Text style={styles.switchLabel}>WhatsApp Instant Alerts</Text>
            </View>
            <Switch
              value={notifyWhatsApp}
              onValueChange={setNotifyWhatsApp}
              trackColor={{ false: colors.borderLight, true: colors.primaryLight }}
              thumbColor={notifyWhatsApp ? colors.primary : colors.textMuted}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="mail" size={18} color={colors.info} />
              <Text style={styles.switchLabel}>Email Summaries & Invoices</Text>
            </View>
            <Switch
              value={notifyEmail}
              onValueChange={setNotifyEmail}
              trackColor={{ false: colors.borderLight, true: colors.primaryLight }}
              thumbColor={notifyEmail ? colors.primary : colors.textMuted}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="phone-portrait-outline" size={18} color={colors.secondary} />
              <Text style={styles.switchLabel}>App Push Notifications</Text>
            </View>
            <Switch
              value={notifyAppPush}
              onValueChange={setNotifyAppPush}
              trackColor={{ false: colors.borderLight, true: colors.primaryLight }}
              thumbColor={notifyAppPush ? colors.primary : colors.textMuted}
            />
          </View>
        </Card>

        {/* Help, Support & FAQs Button */}
        <Pressable
          style={styles.helpSupportBtn}
          onPress={() => navigation.navigate('SupportChat')}
        >
          <Ionicons name="help-buoy-outline" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.helpSupportTitle}>Help, Support & FAQs</Text>
            <Text style={styles.helpSupportSub}>Read FAQs or chat with One Buddy healthcare team</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>

        {/* Logout Button */}
        <Pressable
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out of One Buddy Medical Provider Portal?',
              [
                { text: 'Cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: () => {
                    logout();
                    navigation.navigate('Auth');
                  },
                },
              ],
            );
          }}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </Pressable>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editProfileModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile Information</Text>
              <Pressable onPress={() => setEditProfileModal(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Provider / Organization Name</Text>
              <TextInput style={styles.modalInput} value={editName} onChangeText={setEditName} />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput style={styles.modalInput} value={editPhone} onChangeText={setEditPhone} />

              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput style={styles.modalInput} value={editEmail} onChangeText={setEditEmail} />

              <Text style={styles.inputLabel}>Street Address</Text>
              <TextInput style={styles.modalInput} value={editAddress} onChangeText={setEditAddress} />

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput style={styles.modalInput} value={editCity} onChangeText={setEditCity} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Pincode</Text>
                  <TextInput style={styles.modalInput} value={editPincode} onChangeText={setEditPincode} />
                </View>
              </View>

              <View style={styles.modalBtnRow}>
                <Pressable style={styles.cancelBtn} onPress={() => setEditProfileModal(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.submitBtn} onPress={handleSaveProfile}>
                  <Text style={styles.submitBtnText}>Save Profile</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Bank Modal */}
      <Modal visible={editBankModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Payout Bank Details</Text>
              <Pressable onPress={() => setEditBankModal(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Bank Name</Text>
            <TextInput style={styles.modalInput} value={bankName} onChangeText={setBankName} />

            <Text style={styles.inputLabel}>Account Number</Text>
            <TextInput style={styles.modalInput} value={accNumber} onChangeText={setAccNumber} />

            <Text style={styles.inputLabel}>IFSC Code</Text>
            <TextInput style={styles.modalInput} value={ifsc} onChangeText={setIfsc} />

            <Text style={styles.inputLabel}>Account Holder Name</Text>
            <TextInput style={styles.modalInput} value={accHolder} onChangeText={setAccHolder} />

            <Text style={styles.inputLabel}>UPI ID (Optional)</Text>
            <TextInput style={styles.modalInput} value={upi} onChangeText={setUpi} placeholder="e.g. name@okhdfcbank" />

            <View style={styles.modalBtnRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setEditBankModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitBtn} onPress={handleSaveBank}>
                <Text style={styles.submitBtnText}>Save Account</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Working Hours & Fee Modal */}
      <Modal visible={hoursModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Fees & Service Area</Text>
              <Pressable onPress={() => setHoursModal(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Online Consultation Fee (₹)</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={consultFee}
              onChangeText={setConsultFee}
            />

            <Text style={styles.inputLabel}>Home Visit Fee (₹)</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={homeVisitFee}
              onChangeText={setHomeVisitFee}
            />

            <Text style={styles.inputLabel}>Home Visit Radius (km)</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={radiusKm}
              onChangeText={setRadiusKm}
            />

            <View style={styles.modalBtnRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setHoursModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.submitBtn}
                onPress={() => {
                  updateProviderProfile({
                    consultationFee: parseInt(consultFee, 10) || 700,
                    homeVisitFee: parseInt(homeVisitFee, 10) || 1200,
                    serviceRadiusKm: parseInt(radiusKm, 10) || 10,
                  });
                  setHoursModal(false);
                  Alert.alert('Settings Updated', 'Consultation fees and visit radius updated.');
                }}
              >
                <Text style={styles.submitBtnText}>Update</Text>
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
  topHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 110,
    gap: spacing.md,
  },
  profileHeroCard: {
    backgroundColor: colors.card,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.borderLight,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  roleSub: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 2,
  },
  contactLine: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editProfileBtn: {
    padding: 8,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
  },
  licenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  licenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  licenseTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  approvalStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  approvalStatusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  licenseDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  licenseFieldLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
  licenseFieldValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  docLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  cardSection: {
    padding: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  editActionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  bankDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dataLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dataValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  overallRatingText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.accentGold,
  },
  reviewItem: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: 6,
  },
  reviewItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  reviewStars: {
    fontSize: 11,
    color: colors.accentGold,
  },
  reviewText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 15,
  },
  notifSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  switchLabel: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  helpSupportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.sm,
  },
  helpSupportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  helpSupportSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.danger + '40',
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.danger,
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
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.text,
    backgroundColor: colors.background,
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
