import React, { useState } from 'react';
import {
  Alert,
  Image,
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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '../../theme/colors';
import Card from '../../components/Card';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import { ProviderType } from '../../types';

type RegisterProviderRouteProp = RouteProp<RootStackParamList, 'RegisterProvider'>;

const PROVIDER_ROLES: {
  id: ProviderType;
  title: string;
  badge: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  lightBg: string;
  description: string;
}[] = [
  {
    id: 'hospital',
    title: 'Hospital',
    badge: 'Super Speciality',
    icon: 'business',
    color: colors.hospitalRed,
    lightBg: colors.hospitalRedLight,
    description: 'Multi-speciality hospitals, nursing homes, day-care clinics & surgical centers.',
  },
  {
    id: 'doctor',
    title: 'Doctor',
    badge: 'Specialist Clinic',
    icon: 'medkit',
    color: colors.doctorBanner,
    lightBg: colors.medicalBlueLight,
    description: 'Independent medical practitioners, consulting clinics, OPD chambers & telemedicine specialists.',
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy',
    badge: 'Retail & Clinical',
    icon: 'flask',
    color: colors.pharmacyTeal,
    lightBg: colors.pharmacyTealLight,
    description: 'Licensed retail chemists, diagnostic pharmacies, hospital dispensaries & medical delivery centers.',
  },
];

export default function RegisterProviderScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RegisterProviderRouteProp>();
  const { registerProvider, switchProviderMode } = useApp();

  const initialRole = route.params?.category || route.params?.initialRole || 'hospital';
  const [selectedRole, setSelectedRole] = useState<ProviderType>(initialRole);

  // Common Facility / Profile Info
  const [facilityName, setFacilityName] = useState(
    initialRole === 'hospital'
      ? 'Metro Apex Multi-Specialty Hospital'
      : initialRole === 'doctor'
      ? 'Dr. Rajesh Sharma Cardiology Clinic'
      : 'Metro Meds 24x7 Pharmacy',
  );
  const [contactPerson, setContactPerson] = useState('Dr. Rajesh Sharma');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('contact@metrohealth.onebuddy.in');
  const [address, setAddress] = useState('Plot 42, Health City, Ring Road');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560034');

  // Role-Specific Info
  // Hospital specific
  const [hospitalLicense, setHospitalLicense] = useState('CEA-KA-2024-88412');
  const [totalBeds, setTotalBeds] = useState('120');
  const [emergency24x7, setEmergency24x7] = useState(true);

  // Doctor specific
  const [doctorCouncilNumber, setDoctorCouncilNumber] = useState('MCI-KA-2018-99214');
  const [doctorSpecialization, setDoctorSpecialization] = useState('Cardiology & General Medicine');
  const [doctorDegree, setDoctorDegree] = useState('MBBS, MD (Medicine), DM (Cardiology)');
  const [consultationFee, setConsultationFee] = useState('750');

  // Pharmacy specific
  const [drugLicenseNumber, setDrugLicenseNumber] = useState('KA-DRUG-20/21-65481');
  const [gstin, setGstin] = useState('29ABCDE1234F1Z5');
  const [pharmacistName, setPharmacistName] = useState('Pooja Kulkarni, B.Pharm (Reg #34910)');

  // Banking Details for Payouts
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50100458923412');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('metrohealth@upi');

  // Verification Documents & Declaration
  const [uploadedDoc, setUploadedDoc] = useState('Regulatory_License_Certificate.pdf');
  const [isAgreed, setIsAgreed] = useState(true);

  const activeRoleConfig =
    PROVIDER_ROLES.find((r) => r.id === selectedRole) || PROVIDER_ROLES[0];

  const handleRoleSelect = (role: ProviderType) => {
    setSelectedRole(role);
    if (role === 'hospital') {
      setFacilityName('Metro Apex Multi-Specialty Hospital');
    } else if (role === 'doctor') {
      setFacilityName('Dr. Rajesh Sharma Cardiology Clinic');
    } else {
      setFacilityName('Metro Meds 24x7 Pharmacy');
    }
  };

  const handleRegister = () => {
    if (!facilityName.trim()) {
      Alert.alert('Required Field', 'Please enter your organization / facility name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit primary mobile number.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid official email address.');
      return;
    }

    // Role-specific license validation
    let finalLicense = '';
    let finalLicenseType = '';

    if (selectedRole === 'hospital') {
      if (!hospitalLicense.trim()) {
        Alert.alert('License Required', 'Please enter Clinical Establishment Act registration number.');
        return;
      }
      finalLicense = hospitalLicense.trim();
      finalLicenseType = 'Clinical Establishment Act License (CEA)';
    } else if (selectedRole === 'doctor') {
      if (!doctorCouncilNumber.trim()) {
        Alert.alert('License Required', 'Please enter Medical Council (MCI / SMC) registration number.');
        return;
      }
      finalLicense = doctorCouncilNumber.trim();
      finalLicenseType = 'State Medical Council / National Medical Commission (NMC)';
    } else {
      if (!drugLicenseNumber.trim()) {
        Alert.alert('License Required', 'Please enter State Drug Retail License number (Form 20/21).');
        return;
      }
      finalLicense = drugLicenseNumber.trim();
      finalLicenseType = 'State Drugs Control Department (Form 20 & 21)';
    }

    if (!isAgreed) {
      Alert.alert('Terms Agreement', 'Please confirm adherence to OneBuddy healthcare quality standards.');
      return;
    }

    // Save provider into context
    registerProvider({
      type: selectedRole,
      name: facilityName.trim(),
      phone: `+91 ${phone.trim()}`,
      email: email.trim(),
      licenseNumber: finalLicense,
      licenseDocName: uploadedDoc,
      licenseType: finalLicenseType,
      bankDetails: {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        accountName: facilityName.trim(),
        upiId: upiId.trim(),
      },
    });

    switchProviderMode(selectedRole);

    Alert.alert(
      'Registration Successful! 🎉',
      `Welcome ${facilityName}! Your provider account under "${activeRoleConfig.title}" is now verified and active.`,
      [
        {
          text: 'Go to Dashboard',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Header with prominent Back Navigation */}
      <View style={styles.topHeader}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Main');
            }
          }}
          accessibilityLabel="Back to Previous Screen"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Healthcare Provider Registration</Text>
          <Text style={styles.headerSubtitle}>
            Hospital • Doctor Practice • Clinical Pharmacy
          </Text>
        </View>
        <Pressable
          style={styles.doctorDirectBtn}
          onPress={() => navigation.navigate('RegisterDoctor', { mode: 'add' })}
          accessibilityLabel="Register Doctor"
        >
          <Ionicons name="person-add" size={14} color={colors.primary} />
          <Text style={styles.doctorDirectText}>Doctor</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Card */}
        <Card style={styles.bannerCard} padding="lg">
          <View style={styles.bannerRow}>
            <View
              style={[
                styles.bannerIconBadge,
                { backgroundColor: activeRoleConfig.lightBg },
              ]}
            >
              <Ionicons
                name={activeRoleConfig.icon}
                size={26}
                color={activeRoleConfig.color}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.bannerTitle}>Join OneBuddy Medical</Text>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: activeRoleConfig.lightBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleBadgeText,
                      { color: activeRoleConfig.color },
                    ]}
                  >
                    {activeRoleConfig.badge}
                  </Text>
                </View>
              </View>
              <Text style={styles.bannerSubtitle}>{activeRoleConfig.description}</Text>
            </View>
          </View>
        </Card>

        {/* 1. SELECT PROVIDER CATEGORY */}
        <View style={styles.sectionHeader}>
          <Ionicons name="grid-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>1. Choose Category to Register</Text>
        </View>

        <View style={styles.rolesRow}>
          {PROVIDER_ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <Pressable
                key={role.id}
                style={[
                  styles.roleSelectorCard,
                  isSelected && {
                    borderColor: role.color,
                    backgroundColor: colors.surface,
                    shadowColor: role.color,
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 3,
                  },
                ]}
                onPress={() => handleRoleSelect(role.id)}
                accessibilityLabel={`Select ${role.title} Role`}
              >
                <View
                  style={[
                    styles.roleSelectorIconWrap,
                    {
                      backgroundColor: isSelected ? role.lightBg : `${colors.borderLight}`,
                    },
                  ]}
                >
                  <Ionicons
                    name={role.icon}
                    size={22}
                    color={isSelected ? role.color : colors.textMuted}
                  />
                </View>
                <Text
                  style={[
                    styles.roleSelectorTitle,
                    isSelected && { color: role.color, fontWeight: '800' },
                  ]}
                >
                  {role.title}
                </Text>
                {isSelected && (
                  <View style={[styles.activeDot, { backgroundColor: role.color }]} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* 2. FACILITY & CONTACT DETAILS */}
        <View style={styles.sectionHeader}>
          <Ionicons name="business-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>
            2. {activeRoleConfig.title} Information & Contact
          </Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>
            {selectedRole === 'hospital'
              ? 'Hospital / Healthcare Center Name *'
              : selectedRole === 'doctor'
              ? 'Clinic / Consultation Chamber Name *'
              : 'Pharmacy / Drugstore Name *'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={facilityName}
            onChangeText={setFacilityName}
            placeholder="Official Facility Name"
            placeholderTextColor={colors.textMuted}
          />

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel}>Contact Person / Head *</Text>
              <TextInput
                style={styles.textInput}
                value={contactPerson}
                onChangeText={setContactPerson}
                placeholder="Name"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel}>Mobile Phone *</Text>
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="10 digit number"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Official Email Address *</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="contact@domain.com"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.inputLabel}>Street Address / Landmark</Text>
          <TextInput
            style={styles.textInput}
            value={address}
            onChangeText={setAddress}
            placeholder="Premises / Street / Area"
            placeholderTextColor={colors.textMuted}
          />

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.textInput}
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel}>Pincode</Text>
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

        {/* 3. REGULATORY LICENSES & COMPLIANCE */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ribbon-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>
            3. Regulatory Licenses & Accreditations
          </Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          {selectedRole === 'hospital' && (
            <>
              <Text style={styles.inputLabel}>
                Clinical Establishment Act Registration (CEA) No. *
              </Text>
              <TextInput
                style={styles.textInput}
                value={hospitalLicense}
                onChangeText={setHospitalLicense}
                placeholder="e.g. CEA-KA-2024-88412"
                placeholderTextColor={colors.textMuted}
              />

              <View style={styles.inputRow}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={styles.inputLabel}>Total Inpatient Beds</Text>
                  <TextInput
                    style={styles.textInput}
                    value={totalBeds}
                    onChangeText={setTotalBeds}
                    keyboardType="number-pad"
                    placeholder="e.g. 50"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm, justifyContent: 'center' }}>
                  <Text style={styles.inputLabel}>24/7 Emergency Care</Text>
                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>
                      {emergency24x7 ? 'Available' : 'Day OPD Only'}
                    </Text>
                    <Switch
                      value={emergency24x7}
                      onValueChange={setEmergency24x7}
                      trackColor={{ false: colors.border, true: colors.hospitalRedLight }}
                      thumbColor={emergency24x7 ? colors.hospitalRed : colors.surface}
                    />
                  </View>
                </View>
              </View>
            </>
          )}

          {selectedRole === 'doctor' && (
            <>
              <Text style={styles.inputLabel}>
                Medical Council Registration No. (MCI / State Council) *
              </Text>
              <TextInput
                style={styles.textInput}
                value={doctorCouncilNumber}
                onChangeText={setDoctorCouncilNumber}
                placeholder="e.g. MCI-KA-2018-99214"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>Medical Qualifications / Degrees *</Text>
              <TextInput
                style={styles.textInput}
                value={doctorDegree}
                onChangeText={setDoctorDegree}
                placeholder="e.g. MBBS, MD, MS, DM"
                placeholderTextColor={colors.textMuted}
              />

              <View style={styles.inputRow}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={styles.inputLabel}>Primary Specialization</Text>
                  <TextInput
                    style={styles.textInput}
                    value={doctorSpecialization}
                    onChangeText={setDoctorSpecialization}
                    placeholder="e.g. Cardiology"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={styles.inputLabel}>Consultation Fee (₹)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={consultationFee}
                    onChangeText={setConsultationFee}
                    keyboardType="number-pad"
                    placeholder="750"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>
            </>
          )}

          {selectedRole === 'pharmacy' && (
            <>
              <Text style={styles.inputLabel}>
                Drug Retail License Number (Form 20 & 21) *
              </Text>
              <TextInput
                style={styles.textInput}
                value={drugLicenseNumber}
                onChangeText={setDrugLicenseNumber}
                placeholder="e.g. KA-DRUG-20/21-65481"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>Registered Pharmacist Name & Reg No. *</Text>
              <TextInput
                style={styles.textInput}
                value={pharmacistName}
                onChangeText={setPharmacistName}
                placeholder="Pharmacist Name (Reg #)"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>GSTIN / Tax Identification</Text>
              <TextInput
                style={styles.textInput}
                value={gstin}
                onChangeText={setGstin}
                placeholder="29ABCDE1234F1Z5"
                placeholderTextColor={colors.textMuted}
              />
            </>
          )}

          {/* Document Verification Box */}
          <View style={styles.docUploadBox}>
            <View style={styles.docUploadIconCircle}>
              <Ionicons name="document-attach" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.docUploadTitle}>Regulatory License Proof</Text>
              <Text style={styles.docUploadFilename}>{uploadedDoc}</Text>
            </View>
            <Pressable
              style={styles.uploadBtn}
              onPress={() => {
                Alert.alert(
                  'Upload License Document',
                  'Select registration certificate file from device.',
                  [
                    {
                      text: 'Select PDF File',
                      onPress: () =>
                        setUploadedDoc(
                          `${activeRoleConfig.title}_Certificate_${Date.now().toString().slice(-4)}.pdf`,
                        ),
                    },
                    { text: 'Cancel', style: 'cancel' },
                  ],
                );
              }}
            >
              <Text style={styles.uploadBtnText}>Upload</Text>
            </Pressable>
          </View>
        </Card>

        {/* 4. SETTLEMENT BANK ACCOUNT */}
        <View style={styles.sectionHeader}>
          <Ionicons name="card-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>4. Banking & Daily Payout Details</Text>
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
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel}>Account Number</Text>
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
              <Text style={styles.inputLabel}>IFSC Code</Text>
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

          <Text style={styles.inputLabel}>Direct UPI ID (Instant Payouts)</Text>
          <TextInput
            style={styles.textInput}
            value={upiId}
            onChangeText={setUpiId}
            autoCapitalize="none"
            placeholder="name@upi"
            placeholderTextColor={colors.textMuted}
          />
        </Card>

        {/* 5. LEGAL DECLARATION & CODE OF CONDUCT */}
        <Card style={styles.declarationCard} padding="md">
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setIsAgreed(!isAgreed)}
            accessibilityLabel="Agree to OneBuddy Provider Terms"
          >
            <View
              style={[
                styles.checkboxBox,
                isAgreed && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              {isAgreed && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
            </View>
            <Text style={styles.declarationText}>
              I declare that all credentials, state licenses, and practice registrations
              provided are legitimate. I agree to uphold the Indian Medical Standards and
              OneBuddy quality SLA for patient care.
            </Text>
          </Pressable>
        </Card>

        {/* Action Buttons */}
        <Pressable
          style={[styles.submitBtn, { backgroundColor: activeRoleConfig.color }]}
          onPress={handleRegister}
          accessibilityLabel="Complete Registration"
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>
            Complete {activeRoleConfig.title} Registration
          </Text>
        </Pressable>

        <Pressable
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Cancel and Go Back"
        >
          <Text style={styles.cancelBtnText}>Back to Previous Page</Text>
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
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  doctorDirectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  doctorDirectText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  bannerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconBadge: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
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
  rolesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleSelectorCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    position: 'relative',
  },
  roleSelectorIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  roleSelectorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    position: 'absolute',
    top: 6,
    right: 6,
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
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginBottom: spacing.md,
  },
  switchLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
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
    backgroundColor: colors.primaryLight,
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
    color: colors.primary,
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
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    marginTop: spacing.sm,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
