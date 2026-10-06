import React, { useState } from 'react';
import {
  Alert,
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
import { colors, radius, spacing } from '../../theme/colors';
import Card from '../../components/Card';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';

const PHARMACY_TYPES = [
  'Retail Medical Chemist',
  'Hospital-Attached Pharmacy',
  '24x7 Emergency Chemist',
  'Generic Medicine Dispensary',
  'Wellness & Surgical Store',
];

const PHARMACIST_DEGREES = [
  'B.Pharm (Bachelor of Pharmacy)',
  'D.Pharm (Diploma in Pharmacy)',
  'Pharm.D (Doctor of Pharmacy)',
  'M.Pharm (Master of Pharmacy)',
];

export default function PharmacyRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { provider, registerProvider, switchProviderMode } = useApp();

  // 1. Pharmacy Identity
  const [storeName, setStoreName] = useState(
    provider.type === 'pharmacy' ? provider.name : 'Metro Meds 24x7 Pharmacy',
  );
  const [pharmacyType, setPharmacyType] = useState(PHARMACY_TYPES[0]);
  const [storePhone, setStorePhone] = useState('9876543210');
  const [storeEmail, setStoreEmail] = useState('care@metromeds.onebuddy.health');
  const [storeAddress, setStoreAddress] = useState('Shop 4, Ground Floor, Health City Complex');
  const [city, setCity] = useState('Bengaluru');
  const [stateName, setStateName] = useState('Karnataka');
  const [pincode, setPincode] = useState('560034');

  // 2. Drug Licenses & Regulatory
  const [form20License, setForm20License] = useState('KA-BGL-DRUG-20-49182');
  const [form21License, setForm21License] = useState('KA-BGL-DRUG-21-49183');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-12-31');
  const [gstin, setGstin] = useState('29ABCDE1234F1Z5');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');

  // 3. Registered Pharmacist In-Charge
  const [pharmacistName, setPharmacistName] = useState('Pooja Kulkarni');
  const [pharmacistDegree, setPharmacistDegree] = useState(PHARMACIST_DEGREES[0]);
  const [pharmacistRegNo, setPharmacistRegNo] = useState('KSPC-2021-58291');

  // 4. Operations & Facilities
  const [operatingHours, setOperatingHours] = useState('08:00 AM - 11:00 PM');
  const [has24x7Service, setHas24x7Service] = useState(true);
  const [hasHomeDelivery, setHasHomeDelivery] = useState(true);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState('8');
  const [hasColdChain, setHasColdChain] = useState(true);
  const [hasRxVerificationDesk, setHasRxVerificationDesk] = useState(true);

  // 5. Payout Bank Account
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50100458923412');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('metromeds@upi');

  // Document Uploads
  const [uploadedDrugDoc, setUploadedDrugDoc] = useState('Drug_License_Form_20_21.pdf');
  const [uploadedPharmDoc, setUploadedPharmDoc] = useState('Pharmacist_Council_Registration.pdf');

  // Compliance Declaration
  const [isDeclared, setIsDeclared] = useState(true);

  const handleRegisterPharmacy = () => {
    if (!storeName.trim()) {
      Alert.alert('Required Field', 'Please enter pharmacy or chemist store name.');
      return;
    }

    if (!form20License.trim() || !form21License.trim()) {
      Alert.alert('License Required', 'Please enter Drug Retail Licenses Form 20 and Form 21 numbers.');
      return;
    }

    if (!pharmacistName.trim() || !pharmacistRegNo.trim()) {
      Alert.alert('Pharmacist Required', 'Please enter registered pharmacist in-charge details.');
      return;
    }

    if (!storePhone.trim() || storePhone.trim().length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit primary store mobile number.');
      return;
    }

    if (!isDeclared) {
      Alert.alert(
        'Declaration Required',
        'Please confirm adherence to Drugs & Cosmetics Act and Schedule H/H1 dispensing standards.',
      );
      return;
    }

    // Save provider details
    registerProvider({
      type: 'pharmacy',
      name: storeName.trim(),
      phone: `+91 ${storePhone.trim()}`,
      email: storeEmail.trim(),
      address: storeAddress.trim(),
      city: city.trim(),
      state: stateName.trim(),
      pincode: pincode.trim(),
      licenseNumber: `${form20License.trim()} / ${form21License.trim()}`,
      licenseType: 'State Drugs Control Dept (Form 20 & 21)',
      licenseDocName: uploadedDrugDoc,
      serviceRadiusKm: parseInt(deliveryRadiusKm, 10) || 8,
      bankDetails: {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        accountName: storeName.trim(),
        upiId: upiId.trim(),
      },
    });

    switchProviderMode('pharmacy');

    Alert.alert(
      'Pharmacy Registration Complete! 💊',
      `${storeName} is successfully registered on OneBuddy Healthcare Network with verified Form 20/21 Drug Retail approval.`,
      [
        {
          text: 'Open Pharmacy Section',
          onPress: () => {
            navigation.navigate('Main', { screen: 'Home' } as any);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Header with Back Navigation */}
      <View style={styles.topHeader}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Main', { screen: 'Home' } as any);
            }
          }}
          accessibilityLabel="Back to Dashboard"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="flask" size={17} color={colors.pharmacyTeal} />
            <Text style={styles.headerTitle}>Pharmacy Registration</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Form 20/21 Drug License • Pharmacist In-Charge • Delivery
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>Category 3</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Pharmacy Hero Banner */}
        <Card style={styles.bannerCard} padding="lg">
          <View style={styles.bannerRow}>
            <View style={styles.bannerIconBadge}>
              <Ionicons name="flask" size={26} color={colors.pharmacyTeal} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.bannerTitle}>Pharmacy Partner Portal</Text>
                <View style={styles.pharmacyTag}>
                  <Text style={styles.pharmacyTagText}>Retail & Delivery</Text>
                </View>
              </View>
              <Text style={styles.bannerSubtitle}>
                Register your licensed retail chemist, upload Form 20/21 approvals, configure home delivery radius, and verify customer e-prescriptions.
              </Text>
            </View>
          </View>
        </Card>

        {/* 1. STORE PROFILE & IDENTITY */}
        <View style={styles.sectionHeader}>
          <Ionicons name="business-outline" size={18} color={colors.pharmacyTeal} />
          <Text style={styles.sectionTitle}>1. Pharmacy Store Profile & Classification</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>Pharmacy / Retail Chemist Name *</Text>
          <TextInput
            style={styles.textInput}
            value={storeName}
            onChangeText={setStoreName}
            placeholder="e.g. Metro Meds 24x7 Pharmacy"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.inputLabel}>Pharmacy Classification *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {PHARMACY_TYPES.map((type) => {
              const active = pharmacyType === type;
              return (
                <Pressable
                  key={type}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  onPress={() => setPharmacyType(type)}
                >
                  <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Store Contact Mobile *</Text>
              <TextInput
                style={styles.textInput}
                value={storePhone}
                onChangeText={setStorePhone}
                keyboardType="phone-pad"
                placeholder="10 digit number"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Billing Email *</Text>
              <TextInput
                style={styles.textInput}
                value={storeEmail}
                onChangeText={setStoreEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="store@domain.com"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Store Physical Address *</Text>
          <TextInput
            style={styles.textInput}
            value={storeAddress}
            onChangeText={setStoreAddress}
            placeholder="Shop No, Building & Area Landmark"
            placeholderTextColor={colors.textMuted}
          />

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.xs }}>
              <Text style={styles.inputLabel} numberOfLines={1}>City</Text>
              <TextInput
                style={styles.textInput}
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: spacing.xs }}>
              <Text style={styles.inputLabel} numberOfLines={1}>State</Text>
              <TextInput
                style={styles.textInput}
                value={stateName}
                onChangeText={setStateName}
                placeholder="State"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.xs }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Pincode</Text>
              <TextInput
                style={styles.textInput}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="560034"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        </Card>

        {/* 2. DRUG LICENSES & REGULATORY */}
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text-outline" size={18} color={colors.pharmacyTeal} />
          <Text style={styles.sectionTitle}>2. State Drug Retail Licenses (Form 20 & 21)</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Drug License Form 20 *</Text>
              <TextInput
                style={styles.textInput}
                value={form20License}
                onChangeText={setForm20License}
                placeholder="KA-DRUG-20-XXXXX"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Drug License Form 21 *</Text>
              <TextInput
                style={styles.textInput}
                value={form21License}
                onChangeText={setForm21License}
                placeholder="KA-DRUG-21-XXXXX"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>License Valid Until</Text>
              <TextInput
                style={styles.textInput}
                value={licenseExpiry}
                onChangeText={setLicenseExpiry}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>GSTIN Tax Number</Text>
              <TextInput
                style={styles.textInput}
                value={gstin}
                onChangeText={setGstin}
                autoCapitalize="characters"
                placeholder="29ABCDE1234F1Z5"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>PAN Number</Text>
          <TextInput
            style={styles.textInput}
            value={panNumber}
            onChangeText={setPanNumber}
            autoCapitalize="characters"
            placeholder="ABCDE1234F"
            placeholderTextColor={colors.textMuted}
          />

          {/* Upload License Document */}
          <View style={styles.docUploadBox}>
            <View style={styles.docUploadIconCircle}>
              <Ionicons name="document-attach" size={20} color={colors.pharmacyTeal} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.docUploadTitle}>Form 20/21 Drug License Copy</Text>
              <Text style={styles.docUploadFilename}>{uploadedDrugDoc}</Text>
            </View>
            <Pressable
              style={styles.uploadBtn}
              onPress={() => {
                Alert.alert('Upload Document', 'Select scanned Drug License certificate.', [
                  {
                    text: 'Select PDF File',
                    onPress: () =>
                      setUploadedDrugDoc(`Drug_License_${Date.now().toString().slice(-4)}.pdf`),
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
            >
              <Text style={styles.uploadBtnText}>Upload</Text>
            </Pressable>
          </View>
        </Card>

        {/* 3. REGISTERED PHARMACIST IN-CHARGE */}
        <View style={styles.sectionHeader}>
          <Ionicons name="person-circle-outline" size={18} color={colors.pharmacyTeal} />
          <Text style={styles.sectionTitle}>3. Registered Pharmacist In-Charge</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>Qualified Pharmacist Full Name *</Text>
          <TextInput
            style={styles.textInput}
            value={pharmacistName}
            onChangeText={setPharmacistName}
            placeholder="e.g. Pooja Kulkarni"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.inputLabel}>Pharmacist Qualification *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {PHARMACIST_DEGREES.map((deg) => {
              const active = pharmacistDegree === deg;
              return (
                <Pressable
                  key={deg}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  onPress={() => setPharmacistDegree(deg)}
                >
                  <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                    {deg}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.inputLabel}>
            State Pharmacy Council Registration No. *
          </Text>
          <TextInput
            style={styles.textInput}
            value={pharmacistRegNo}
            onChangeText={setPharmacistRegNo}
            placeholder="e.g. KSPC-2021-58291"
            placeholderTextColor={colors.textMuted}
          />

          {/* Upload Pharmacist Certificate */}
          <View style={styles.docUploadBox}>
            <View style={styles.docUploadIconCircle}>
              <Ionicons name="shield-checkmark" size={20} color={colors.pharmacyTeal} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.docUploadTitle}>Pharmacist Council Registration</Text>
              <Text style={styles.docUploadFilename}>{uploadedPharmDoc}</Text>
            </View>
            <Pressable
              style={styles.uploadBtn}
              onPress={() => {
                Alert.alert('Upload Document', 'Select pharmacist registration certificate.', [
                  {
                    text: 'Select PDF File',
                    onPress: () =>
                      setUploadedPharmDoc(`Pharmacist_Reg_${Date.now().toString().slice(-4)}.pdf`),
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
            >
              <Text style={styles.uploadBtnText}>Upload</Text>
            </Pressable>
          </View>
        </Card>

        {/* 4. DISPENSING & DELIVERY AMENITIES */}
        <View style={styles.sectionHeader}>
          <Ionicons name="car-outline" size={18} color={colors.pharmacyTeal} />
          <Text style={styles.sectionTitle}>4. Store Hours & Delivery Facilities</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <View style={styles.inputRow}>
            <View style={{ flex: 2, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Daily Operating Hours</Text>
              <TextInput
                style={styles.textInput}
                value={operatingHours}
                onChangeText={setOperatingHours}
                placeholder="08:00 AM - 11:00 PM"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Delivery Radius</Text>
              <TextInput
                style={styles.textInput}
                value={deliveryRadiusKm}
                onChangeText={setDeliveryRadiusKm}
                keyboardType="number-pad"
                placeholder="8 km"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.facilityToggleGrid}>
            <View style={styles.facilityToggleItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleItemTitle}>24/7 Emergency Dispensing</Text>
                <Text style={styles.toggleItemSub}>Night counter availability</Text>
              </View>
              <Switch
                value={has24x7Service}
                onValueChange={setHas24x7Service}
                trackColor={{ false: colors.border, true: colors.pharmacyTealLight }}
                thumbColor={has24x7Service ? colors.pharmacyTeal : colors.surface}
              />
            </View>

            <View style={styles.facilityToggleItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleItemTitle}>Doorstep Medicine Delivery</Text>
                <Text style={styles.toggleItemSub}>Local rider dispatch within radius</Text>
              </View>
              <Switch
                value={hasHomeDelivery}
                onValueChange={setHasHomeDelivery}
                trackColor={{ false: colors.border, true: colors.pharmacyTealLight }}
                thumbColor={hasHomeDelivery ? colors.pharmacyTeal : colors.surface}
              />
            </View>

            <View style={styles.facilityToggleItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleItemTitle}>Cold Chain Refrigeration (2°C - 8°C)</Text>
                <Text style={styles.toggleItemSub}>Storage for Insulins, Vaccines & Injections</Text>
              </View>
              <Switch
                value={hasColdChain}
                onValueChange={setHasColdChain}
                trackColor={{ false: colors.border, true: colors.pharmacyTealLight }}
                thumbColor={hasColdChain ? colors.pharmacyTeal : colors.surface}
              />
            </View>

            <View style={styles.facilityToggleItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleItemTitle}>Prescription (Rx) Verification Desk</Text>
                <Text style={styles.toggleItemSub}>Approve patient digital e-prescriptions</Text>
              </View>
              <Switch
                value={hasRxVerificationDesk}
                onValueChange={setHasRxVerificationDesk}
                trackColor={{ false: colors.border, true: colors.pharmacyTealLight }}
                thumbColor={hasRxVerificationDesk ? colors.pharmacyTeal : colors.surface}
              />
            </View>
          </View>
        </Card>

        {/* 5. SETTLEMENT BANK ACCOUNT */}
        <View style={styles.sectionHeader}>
          <Ionicons name="card-outline" size={18} color={colors.pharmacyTeal} />
          <Text style={styles.sectionTitle}>5. Pharmacy Sales & Settlement Bank Account</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>Bank Name</Text>
          <TextInput
            style={styles.textInput}
            value={bankName}
            onChangeText={setBankName}
            placeholder="HDFC Bank / SBI / ICICI"
            placeholderTextColor={colors.textMuted}
          />

          <View style={styles.inputRow}>
            <View style={{ flex: 1.4, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Account Number</Text>
              <TextInput
                style={styles.textInput}
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
                placeholder="Account number"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>IFSC Code</Text>
              <TextInput
                style={styles.textInput}
                value={ifscCode}
                onChangeText={setIfscCode}
                autoCapitalize="characters"
                placeholder="HDFC0001234"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Direct Store UPI ID (Instant Medicine Settlement)</Text>
          <TextInput
            style={styles.textInput}
            value={upiId}
            onChangeText={setUpiId}
            autoCapitalize="none"
            placeholder="pharmacy@upi"
            placeholderTextColor={colors.textMuted}
          />
        </Card>

        {/* 6. PHARMACY CODE OF CONDUCT & DRUGS ACT DECLARATION */}
        <Card style={styles.declarationCard} padding="md">
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setIsDeclared(!isDeclared)}
            accessibilityLabel="Agree to Drugs and Cosmetics Act Terms"
          >
            <View
              style={[
                styles.checkboxBox,
                isDeclared && {
                  backgroundColor: colors.pharmacyTeal,
                  borderColor: colors.pharmacyTeal,
                },
              ]}
            >
              {isDeclared && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
            </View>
            <Text style={styles.declarationText}>
              I declare that all retail drug licenses (Form 20/21) and pharmacist registrations are
              valid under the Drugs and Cosmetics Act 1940 and Pharmacy Act 1948. We commit to
              strict Schedule H/H1 prescription dispensing compliance.
            </Text>
          </Pressable>
        </Card>

        {/* Primary Action Button */}
        <Pressable
          style={styles.submitBtn}
          onPress={handleRegisterPharmacy}
          accessibilityLabel="Save Pharmacy Registration"
        >
          <Ionicons name="flask" size={20} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>Register Pharmacy Store & Go Live</Text>
        </Pressable>

        {/* Back Button */}
        <Pressable
          style={styles.cancelBtn}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Main', { screen: 'Home' } as any);
            }
          }}
          accessibilityLabel="Back to Dashboard"
        >
          <Ionicons name="arrow-back" size={16} color={colors.textMuted} />
          <Text style={styles.cancelBtnText}>Back to Dashboard</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  headerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.pharmacyTealLight,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.pharmacyTeal,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  bannerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: `${colors.pharmacyTeal}40`,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconBadge: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.pharmacyTealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  pharmacyTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.pharmacyTealLight,
  },
  pharmacyTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.pharmacyTeal,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 4,
    minHeight: 18,
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.md,
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: colors.pharmacyTealLight,
    borderColor: colors.pharmacyTeal,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeChipTextActive: {
    color: colors.pharmacyTeal,
    fontWeight: '800',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  facilityToggleGrid: {
    gap: 8,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  facilityToggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  toggleItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  toggleItemSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  docUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  docUploadIconCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.pharmacyTealLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docUploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  docUploadFilename: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  uploadBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.pharmacyTeal,
  },
  declarationCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  declarationText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.md,
    backgroundColor: colors.pharmacyTeal,
    shadowColor: colors.pharmacyTeal,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginTop: spacing.xs,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
