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

const HOSPITAL_TYPES = [
  'Super-Specialty Hospital',
  'Multi-Specialty Hospital',
  'Tertiary Care Center',
  'Nursing Home',
  'Day-Care Surgical Center',
];

const ACCREDITATION_LEVELS = [
  'NABH Full Accreditation',
  'NABH Entry-Level (SHCO)',
  'NABL Accredited Lab',
  'ISO 9001:2015 Certified',
  'State Health Registered',
];

const DEPARTMENTS = [
  'Emergency & Trauma',
  'Cardiology & Cath Lab',
  'Orthopedics & Joint Replacement',
  'Neurology & Neurosurgery',
  'Pediatrics & NICU',
  'Obstetrics & Gynecology',
  'Oncology & Chemotherapy',
  'Nephrology & Dialysis',
  'Gastroenterology',
  'General & Laparoscopic Surgery',
];

export default function HospitalRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { provider, registerProvider, switchProviderMode } = useApp();

  // 1. Hospital Identity
  const [hospitalName, setHospitalName] = useState(
    provider.type === 'hospital' ? provider.name : 'Metro Apex Super-Specialty Hospital',
  );
  const [hospitalType, setHospitalType] = useState(HOSPITAL_TYPES[0]);
  const [totalBeds, setTotalBeds] = useState('180');
  const [icuBeds, setIcuBeds] = useState('24');
  const [operationTheatres, setOperationTheatres] = useState('6');

  // Facilities Toggles
  const [hasEmergency24x7, setHasEmergency24x7] = useState(true);
  const [hasBloodBank, setHasBloodBank] = useState(true);
  const [hasRadiology, setHasRadiology] = useState(true);
  const [hasAmbulanceFleet, setHasAmbulanceFleet] = useState(true);

  // Departments
  const [selectedDepts, setSelectedDepts] = useState<string[]>([
    'Emergency & Trauma',
    'Cardiology & Cath Lab',
    'Orthopedics & Joint Replacement',
    'Neurology & Neurosurgery',
    'Pediatrics & NICU',
  ]);

  // 2. Regulatory & Accreditations
  const [ceaLicenseNumber, setCeaLicenseNumber] = useState(
    provider.type === 'hospital' ? provider.licenseNumber : 'CEA-KA-2024-88412',
  );
  const [accreditation, setAccreditation] = useState(ACCREDITATION_LEVELS[0]);
  const [bmwAuthNumber, setBmwAuthNumber] = useState('KSPCB-BMW-2025-4190');

  // 3. Medical Superintendent & Administration
  const [superintendentName, setSuperintendentName] = useState('Dr. Arvind K. Rao, MD, FRCS');
  const [superintendentRegNo, setSuperintendentRegNo] = useState('KMC-1998-38291');
  const [adminPhone, setAdminPhone] = useState('9876543210');
  const [emergencyHotline, setEmergencyHotline] = useState('080-23456789');
  const [hospitalEmail, setHospitalEmail] = useState('admin@metroapex.onebuddy.health');

  // 4. Premises & Location
  const [campusAddress, setCampusAddress] = useState('Campus 1, Health City Ring Road');
  const [city, setCity] = useState('Bengaluru');
  const [stateName, setStateName] = useState('Karnataka');
  const [pincode, setPincode] = useState('560034');

  // 5. Payout Bank Account
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50100458923412');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('metroapex@upi');

  // Document Uploads
  const [uploadedCeaDoc, setUploadedCeaDoc] = useState('CEA_Registration_Certificate.pdf');
  const [uploadedBmwDoc, setUploadedBmwDoc] = useState('BioMedical_Waste_Clearance.pdf');

  // Legal Declaration
  const [isDeclared, setIsDeclared] = useState(true);

  const toggleDept = (dept: string) => {
    if (selectedDepts.includes(dept)) {
      if (selectedDepts.length === 1) {
        Alert.alert('Required', 'Please select at least one clinical department.');
        return;
      }
      setSelectedDepts(selectedDepts.filter((d) => d !== dept));
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  const handleRegisterHospital = () => {
    if (!hospitalName.trim()) {
      Alert.alert('Required Field', 'Please enter hospital or healthcare center name.');
      return;
    }

    if (!ceaLicenseNumber.trim()) {
      Alert.alert('License Required', 'Please enter Clinical Establishment Act registration number.');
      return;
    }

    if (!adminPhone.trim() || adminPhone.trim().length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit primary administrative mobile number.');
      return;
    }

    if (!isDeclared) {
      Alert.alert('Declaration Required', 'Please verify compliance with the Clinical Establishments Act.');
      return;
    }

    // Save provider details
    registerProvider({
      type: 'hospital',
      name: hospitalName.trim(),
      phone: `+91 ${adminPhone.trim()}`,
      email: hospitalEmail.trim(),
      address: campusAddress.trim(),
      city: city.trim(),
      state: stateName.trim(),
      pincode: pincode.trim(),
      licenseNumber: ceaLicenseNumber.trim(),
      licenseType: 'Hospital Clinical Establishment Act License (CEA)',
      licenseDocName: uploadedCeaDoc,
      bankDetails: {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        accountName: hospitalName.trim(),
        upiId: upiId.trim(),
      },
    });

    switchProviderMode('hospital');

    Alert.alert(
      'Hospital Registration Complete! 🏥',
      `${hospitalName} is successfully registered on OneBuddy Healthcare Network with active Clinical Establishment approval.`,
      [
        {
          text: 'Open Hospital Section',
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
            <Ionicons name="business" size={17} color={colors.hospitalRed} />
            <Text style={styles.headerTitle}>Hospital Registration</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Clinical Establishment Act • Bed Capacity • NABH
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>Category 1</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hospital Hero Banner */}
        <Card style={styles.bannerCard} padding="lg">
          <View style={styles.bannerRow}>
            <View style={styles.bannerIconBadge}>
              <Ionicons name="business" size={26} color={colors.hospitalRed} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.bannerTitle}>Hospital Partner Portal</Text>
                <View style={styles.hospitalTag}>
                  <Text style={styles.hospitalTagText}>Inpatient & OPD</Text>
                </View>
              </View>
              <Text style={styles.bannerSubtitle}>
                Register multi-speciality medical centers, emergency triage, consulting doctor rosters & preventive health packages.
              </Text>
            </View>
          </View>
        </Card>

        {/* 1. HOSPITAL IDENTITY & CLASSIFICATION */}
        <View style={styles.sectionHeader}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.hospitalRed} />
          <Text style={styles.sectionTitle}>1. Hospital Identity & Facility Type</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>Official Hospital / Healthcare Center Name *</Text>
          <TextInput
            style={styles.textInput}
            value={hospitalName}
            onChangeText={setHospitalName}
            placeholder="e.g. Metro Apex Multi-Specialty Hospital"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.inputLabel}>Hospital Classification *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {HOSPITAL_TYPES.map((type) => {
              const active = hospitalType === type;
              return (
                <Pressable
                  key={type}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  onPress={() => setHospitalType(type)}
                >
                  <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Bed & Infrastructure Capacities */}
          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.xs }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Total Beds *</Text>
              <TextInput
                style={styles.textInput}
                value={totalBeds}
                onChangeText={setTotalBeds}
                keyboardType="number-pad"
                placeholder="150"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: spacing.xs }}>
              <Text style={styles.inputLabel} numberOfLines={1}>ICU Beds</Text>
              <TextInput
                style={styles.textInput}
                value={icuBeds}
                onChangeText={setIcuBeds}
                keyboardType="number-pad"
                placeholder="20"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.xs }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Theatres (OT)</Text>
              <TextInput
                style={styles.textInput}
                value={operationTheatres}
                onChangeText={setOperationTheatres}
                keyboardType="number-pad"
                placeholder="4"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* Infrastructure Toggles */}
          <Text style={[styles.inputLabel, { marginTop: spacing.xs }]}>
            Hospital Infrastructure & Emergency Amenities
          </Text>
          <View style={styles.facilityToggleGrid}>
            <View style={styles.facilityToggleItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleItemTitle}>24/7 Emergency & Trauma</Text>
                <Text style={styles.toggleItemSub}>Casualty triage & resuscitation</Text>
              </View>
              <Switch
                value={hasEmergency24x7}
                onValueChange={setHasEmergency24x7}
                trackColor={{ false: colors.border, true: colors.hospitalRedLight }}
                thumbColor={hasEmergency24x7 ? colors.hospitalRed : colors.surface}
              />
            </View>

            <View style={styles.facilityToggleItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleItemTitle}>In-House Blood Bank</Text>
                <Text style={styles.toggleItemSub}>Whole blood & platelet units</Text>
              </View>
              <Switch
                value={hasBloodBank}
                onValueChange={setHasBloodBank}
                trackColor={{ false: colors.border, true: colors.hospitalRedLight }}
                thumbColor={hasBloodBank ? colors.hospitalRed : colors.surface}
              />
            </View>

            <View style={styles.facilityToggleItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleItemTitle}>Radiology & CT/MRI Scan</Text>
                <Text style={styles.toggleItemSub}>Diagnostic imaging on campus</Text>
              </View>
              <Switch
                value={hasRadiology}
                onValueChange={setHasRadiology}
                trackColor={{ false: colors.border, true: colors.hospitalRedLight }}
                thumbColor={hasRadiology ? colors.hospitalRed : colors.surface}
              />
            </View>

            <View style={styles.facilityToggleItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleItemTitle}>Ambulance Fleet Service</Text>
                <Text style={styles.toggleItemSub}>Advanced Life Support (ALS)</Text>
              </View>
              <Switch
                value={hasAmbulanceFleet}
                onValueChange={setHasAmbulanceFleet}
                trackColor={{ false: colors.border, true: colors.hospitalRedLight }}
                thumbColor={hasAmbulanceFleet ? colors.hospitalRed : colors.surface}
              />
            </View>
          </View>

          {/* Clinical Departments Picker */}
          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>
            Active Clinical Departments (Tap to select)
          </Text>
          <View style={styles.chipsWrap}>
            {DEPARTMENTS.map((dept) => {
              const selected = selectedDepts.includes(dept);
              return (
                <Pressable
                  key={dept}
                  style={[styles.deptChip, selected && styles.deptChipSelected]}
                  onPress={() => toggleDept(dept)}
                >
                  <Ionicons
                    name={selected ? 'checkmark-circle' : 'add-circle-outline'}
                    size={14}
                    color={selected ? colors.hospitalRed : colors.textMuted}
                  />
                  <Text style={[styles.deptChipText, selected && styles.deptChipTextSelected]}>
                    {dept}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* 2. REGULATORY LICENSES & ACCREDITATIONS */}
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text-outline" size={18} color={colors.hospitalRed} />
          <Text style={styles.sectionTitle}>2. Regulatory Licenses & Accreditations</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>
            Clinical Establishments Act (CEA) Registration No. *
          </Text>
          <TextInput
            style={styles.textInput}
            value={ceaLicenseNumber}
            onChangeText={setCeaLicenseNumber}
            placeholder="e.g. CEA-KA-2024-88412"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.inputLabel}>Quality Accreditation Level *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {ACCREDITATION_LEVELS.map((acc) => {
              const active = accreditation === acc;
              return (
                <Pressable
                  key={acc}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  onPress={() => setAccreditation(acc)}
                >
                  <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                    {acc}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.inputLabel}>Bio-Medical Waste (BMW) Clearance No.</Text>
          <TextInput
            style={styles.textInput}
            value={bmwAuthNumber}
            onChangeText={setBmwAuthNumber}
            placeholder="e.g. KSPCB-BMW-2025-4190"
            placeholderTextColor={colors.textMuted}
          />

          {/* Upload Verification Document */}
          <View style={styles.docUploadBox}>
            <View style={styles.docUploadIconCircle}>
              <Ionicons name="document-attach" size={20} color={colors.hospitalRed} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.docUploadTitle}>CEA Registration Certificate</Text>
              <Text style={styles.docUploadFilename}>{uploadedCeaDoc}</Text>
            </View>
            <Pressable
              style={styles.uploadBtn}
              onPress={() => {
                Alert.alert('Upload Certificate', 'Select updated CEA registration certificate.', [
                  {
                    text: 'Select PDF File',
                    onPress: () =>
                      setUploadedCeaDoc(`CEA_Approval_${Date.now().toString().slice(-4)}.pdf`),
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
            >
              <Text style={styles.uploadBtnText}>Upload</Text>
            </Pressable>
          </View>
        </Card>

        {/* 3. MEDICAL SUPERINTENDENT & CONTACT */}
        <View style={styles.sectionHeader}>
          <Ionicons name="person-circle-outline" size={18} color={colors.hospitalRed} />
          <Text style={styles.sectionTitle}>3. Medical Superintendent & Emergency Desk</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>Medical Superintendent / Medical Director Name *</Text>
          <TextInput
            style={styles.textInput}
            value={superintendentName}
            onChangeText={setSuperintendentName}
            placeholder="Dr. Full Name"
            placeholderTextColor={colors.textMuted}
          />

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Director Reg #</Text>
              <TextInput
                style={styles.textInput}
                value={superintendentRegNo}
                onChangeText={setSuperintendentRegNo}
                placeholder="KMC-1998-38291"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Admin Mobile *</Text>
              <TextInput
                style={styles.textInput}
                value={adminPhone}
                onChangeText={setAdminPhone}
                keyboardType="phone-pad"
                placeholder="10 digit number"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Casualty Hotline</Text>
              <TextInput
                style={styles.textInput}
                value={emergencyHotline}
                onChangeText={setEmergencyHotline}
                keyboardType="phone-pad"
                placeholder="080-23456789"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Official Email *</Text>
              <TextInput
                style={styles.textInput}
                value={hospitalEmail}
                onChangeText={setHospitalEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="admin@hospital.com"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Campus Address / Street *</Text>
          <TextInput
            style={styles.textInput}
            value={campusAddress}
            onChangeText={setCampusAddress}
            placeholder="Building, Road & Area"
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

        {/* 4. SETTLEMENT BANK ACCOUNT */}
        <View style={styles.sectionHeader}>
          <Ionicons name="card-outline" size={18} color={colors.hospitalRed} />
          <Text style={styles.sectionTitle}>4. Hospital Revenue & Settlement Bank Account</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>Bank Name</Text>
          <TextInput
            style={styles.textInput}
            value={bankName}
            onChangeText={setBankName}
            placeholder="e.g. HDFC Bank, SBI, ICICI"
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

          <Text style={styles.inputLabel}>Direct Hospital UPI ID (Instant OP Settlement)</Text>
          <TextInput
            style={styles.textInput}
            value={upiId}
            onChangeText={setUpiId}
            autoCapitalize="none"
            placeholder="hospital@upi"
            placeholderTextColor={colors.textMuted}
          />
        </Card>

        {/* 5. LEGAL DECLARATION */}
        <Card style={styles.declarationCard} padding="md">
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setIsDeclared(!isDeclared)}
            accessibilityLabel="Agree to Clinical Establishment Terms"
          >
            <View
              style={[
                styles.checkboxBox,
                isDeclared && {
                  backgroundColor: colors.hospitalRed,
                  borderColor: colors.hospitalRed,
                },
              ]}
            >
              {isDeclared && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
            </View>
            <Text style={styles.declarationText}>
              I declare as the authorized representative that all hospital licenses, bed
              strengths, clinical facility credentials, and establishment approvals are authentic
              under the Clinical Establishments Act and State Medical Council regulations.
            </Text>
          </Pressable>
        </Card>

        {/* Primary Action Button */}
        <Pressable
          style={styles.submitBtn}
          onPress={handleRegisterHospital}
          accessibilityLabel="Save Hospital Registration"
        >
          <Ionicons name="business" size={20} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>Register Hospital & Save Profile</Text>
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
    backgroundColor: colors.hospitalRedLight,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.hospitalRed,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  bannerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: `${colors.hospitalRed}30`,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconBadge: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.hospitalRedLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  hospitalTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.hospitalRedLight,
  },
  hospitalTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.hospitalRed,
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
    backgroundColor: colors.hospitalRedLight,
    borderColor: colors.hospitalRed,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeChipTextActive: {
    color: colors.hospitalRed,
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
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  deptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  deptChipSelected: {
    backgroundColor: colors.hospitalRedLight,
    borderColor: colors.hospitalRed,
  },
  deptChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  deptChipTextSelected: {
    color: colors.hospitalRed,
    fontWeight: '700',
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
    backgroundColor: colors.hospitalRedLight,
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
    color: colors.hospitalRed,
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
    backgroundColor: colors.hospitalRed,
    shadowColor: colors.hospitalRed,
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
