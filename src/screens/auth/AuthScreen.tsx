import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme/colors';
import Card from '../../components/Card';
import { RootStackParamList } from '../../navigation/types';
import { ProviderType } from '../../types';

export default function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { loginWithPhone, registerProvider, switchProviderMode } = useApp();

  // Step 1: Phone + OTP, Step 2: Role + License + Profile
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'onboard'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('1234');
  const [selectedType, setSelectedType] = useState<ProviderType>('hospital');

  // Onboarding Form
  const [name, setName] = useState('Metro Healthcare Specialty Center');
  const [email, setEmail] = useState('partner@onebuddy.com');
  const [licenseNumber, setLicenseNumber] = useState('MED-REG-2026-9812');
  const [uploadedDoc, setUploadedDoc] = useState('License_Registration_Certificate.pdf');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50100458923412');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');

  const handleSendOtp = () => {
    if (phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setAuthStep('otp');
    Alert.alert('OTP Sent', `4-digit SMS verification code sent to +91 ${phone}`);
  };

  const handleVerifyOtp = () => {
    const ok = loginWithPhone(phone, otp);
    if (!ok) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP.');
      return;
    }
    // Default page that opens when provider logs in: Dashboard
    navigation.navigate('Main', { screen: 'Home' });
  };

  const handleCompleteOnboarding = () => {
    if (!name.trim() || !licenseNumber.trim()) {
      Alert.alert('Required Fields', 'Please complete all required verification fields.');
      return;
    }

    registerProvider({
      type: selectedType,
      name,
      phone: `+91 ${phone}`,
      email,
      licenseNumber,
      licenseDocName: uploadedDoc,
      licenseType:
        selectedType === 'hospital'
          ? 'Hospital Establishment Act License'
          : selectedType === 'doctor'
          ? 'State Medical Council Registration'
          : 'State Drug Retail License (Form 20/21)',
      bankDetails: {
        bankName,
        accountNumber,
        ifscCode,
        accountName: name,
        upiId: `${phone}@upi`,
      },
    });

    switchProviderMode(selectedType);

    Alert.alert(
      'Provider Verified & Approved',
      `Welcome to One Buddy Medical Partner Network! Your portal is ready to receive bookings.`,
      [{ text: 'Enter Dashboard', onPress: () => navigation.navigate('Main', { screen: 'Home' }) }],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Ionicons name="medical" size={32} color={colors.primary} />
          </View>
          <Text style={styles.brandName}>One Buddy Medical</Text>
          <Text style={styles.brandSubtitle}>
            Healthcare Service Provider Portal (Hospital • Doctor • Pharmacy)
          </Text>
        </View>

        {/* STEP 1: Phone Login */}
        {authStep === 'phone' && (
          <Card style={styles.formCard} padding="lg">
            <Text style={styles.formTitle}>Provider Sign In / Sign Up</Text>
            <Text style={styles.formSub}>
              Enter your mobile number to receive or manage customer bookings
            </Text>

            <Text style={styles.inputLabel}>Mobile Phone Number</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholder="10 digit number"
              />
            </View>

            <Pressable style={styles.primaryBtn} onPress={handleSendOtp}>
              <Text style={styles.primaryBtnText}>Send Verification OTP</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>

            {/* Register New Doctor or Any Healthcare Provider */}
            <View style={styles.registerSection}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR SELECT CATEGORY TO REGISTER</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* 1. Hospital Registration */}
              <Pressable
                style={styles.registerOptionCard}
                onPress={() => navigation.navigate('HospitalRegistration')}
                accessibilityLabel="Register Hospital"
              >
                <View style={[styles.registerOptionIconWrap, { backgroundColor: colors.hospitalRedLight }]}>
                  <Ionicons name="business" size={20} color={colors.hospitalRed} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.registerOptionTitle}>1. Hospital Registration</Text>
                  <Text style={styles.registerOptionSubtitle}>
                    Clinical Establishment Act, bed strength & ICU setup
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>

              {/* 2. Doctor Registration */}
              <Pressable
                style={styles.registerOptionCard}
                onPress={() => navigation.navigate('DoctorRegistration')}
                accessibilityLabel="Register Doctor"
              >
                <View style={[styles.registerOptionIconWrap, { backgroundColor: colors.medicalBlueLight }]}>
                  <Ionicons name="medkit" size={20} color={colors.doctorBanner} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.registerOptionTitle}>2. Doctor Registration</Text>
                  <Text style={styles.registerOptionSubtitle}>
                    MCI/SMC council reg, OPD practice & consultation fees
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>

              {/* 3. Pharmacy Registration */}
              <Pressable
                style={styles.registerOptionCard}
                onPress={() => navigation.navigate('PharmacyRegistration')}
                accessibilityLabel="Register Pharmacy"
              >
                <View style={[styles.registerOptionIconWrap, { backgroundColor: colors.pharmacyTealLight }]}>
                  <Ionicons name="flask" size={20} color={colors.pharmacyTeal} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.registerOptionTitle}>3. Pharmacy Registration</Text>
                  <Text style={styles.registerOptionSubtitle}>
                    Drug retail license Form 20/21 & pharmacist in-charge
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          </Card>
        )}

        {/* STEP 2: OTP Verification */}
        {authStep === 'otp' && (
          <Card style={styles.formCard} padding="lg">
            <Text style={styles.formTitle}>Verify Mobile OTP</Text>
            <Text style={styles.formSub}>
              Enter the 4-digit verification code sent to +91 {phone}
            </Text>

            <Text style={styles.inputLabel}>4-Digit Code</Text>
            <TextInput
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={4}
              value={otp}
              onChangeText={setOtp}
              placeholder="••••"
            />

            <Pressable style={styles.primaryBtn} onPress={handleVerifyOtp}>
              <Text style={styles.primaryBtnText}>Verify & Continue</Text>
              <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
            </Pressable>

            <Pressable
              style={styles.resendBtn}
              onPress={() => Alert.alert('OTP Resent', `A new verification code has been sent to +91 ${phone}.`)}
            >
              <Text style={styles.resendBtnText}>Resend OTP Code</Text>
            </Pressable>
          </Card>
        )}

        {/* STEP 3: Provider Type & Verification Setup */}
        {authStep === 'onboard' && (
          <Card style={styles.formCard} padding="lg">
            <Text style={styles.formTitle}>Healthcare Provider Onboarding</Text>
            <Text style={styles.formSub}>
              Select your practice type, license details, and bank account for payouts
            </Text>

            {/* Provider Type Selection */}
            <Text style={styles.inputLabel}>Select Provider Role</Text>
            <View style={styles.roleGrid}>
              {[
                { id: 'hospital', label: 'Hospital', icon: 'business', color: colors.hospitalRed },
                { id: 'doctor', label: 'Doctor', icon: 'medkit', color: colors.medicalBlue },
                { id: 'pharmacy', label: 'Pharmacy', icon: 'flask', color: colors.pharmacyTeal },
              ].map((role) => {
                const active = selectedType === role.id;
                return (
                  <Pressable
                    key={role.id}
                    style={[
                      styles.roleCard,
                      active && { borderColor: role.color, backgroundColor: colors.background },
                    ]}
                    onPress={() => setSelectedType(role.id as ProviderType)}
                  >
                    <Ionicons
                      name={role.icon as any}
                      size={22}
                      color={active ? role.color : colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.roleCardText,
                        active && { color: role.color, fontWeight: '800' },
                      ]}
                    >
                      {role.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Provider Profile Info */}
            <Text style={styles.inputLabel}>
              {selectedType === 'hospital'
                ? 'Hospital Name'
                : selectedType === 'doctor'
                ? 'Doctor Full Name'
                : 'Pharmacy Store Name'}
            </Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.inputLabel}>Registered Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />

            {/* Regulatory License Verification */}
            <Text style={styles.inputLabel}>
              {selectedType === 'hospital'
                ? 'Hospital Establishment Act License No.'
                : selectedType === 'doctor'
                ? 'Medical Council Registration (MCI / SMC) No.'
                : 'Drug Retail License (Form 20/21) No.'}
            </Text>
            <TextInput
              style={styles.input}
              value={licenseNumber}
              onChangeText={setLicenseNumber}
            />

            {/* Simulated Document Upload */}
            <Text style={styles.inputLabel}>Upload Supporting License Document</Text>
            <Pressable
              style={styles.docUploadBox}
              onPress={() => {
                Alert.alert(
                  'Upload Certificate',
                  'Select file from device storage: PDF, JPEG or PNG (Max 10MB)',
                  [
                    { text: 'Cancel' },
                    {
                      text: 'Select PDF',
                      onPress: () => {
                        setUploadedDoc('Govt_Approved_Medical_License.pdf');
                        Alert.alert('File Attached', 'Govt_Approved_Medical_License.pdf uploaded successfully.');
                      },
                    },
                  ],
                );
              }}
            >
              <Ionicons name="cloud-upload" size={24} color={colors.primary} />
              <Text style={styles.docUploadText}>{uploadedDoc}</Text>
              <Text style={styles.docUploadSub}>Tap to replace file (PDF/Image)</Text>
            </Pressable>

            {/* Bank Details for Rolling Disbursals */}
            <Text style={styles.sectionDividerText}>Bank Account for Net Payouts</Text>
            <Text style={styles.inputLabel}>Bank Name</Text>
            <TextInput style={styles.input} value={bankName} onChangeText={setBankName} />

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Account Number</Text>
                <TextInput
                  style={styles.input}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>IFSC Code</Text>
                <TextInput style={styles.input} value={ifscCode} onChangeText={setIfscCode} />
              </View>
            </View>

            <View style={styles.adminStatusPreview}>
              <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
              <Text style={styles.adminStatusPreviewText}>
                Official Provider Credentialing: Verification processed via State Health Authority Registry
              </Text>
            </View>

            <Pressable style={styles.primaryBtn} onPress={handleCompleteOnboarding}>
              <Text style={styles.primaryBtnText}>Submit & Launch Portal</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  formCard: {
    padding: spacing.lg,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  formSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeBox: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  otpInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.text,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resendBtn: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resendBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  roleCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    gap: 4,
  },
  roleCardText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  docUploadBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary + '60',
    borderStyle: 'dashed',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.primaryLight + '50',
    marginTop: 4,
  },
  docUploadText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
    marginTop: 4,
  },
  docUploadSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionDividerText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adminStatusPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.warningLight,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  adminStatusPreviewText: {
    flex: 1,
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  registerSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  registerOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  registerOptionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerOptionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  registerOptionSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});

