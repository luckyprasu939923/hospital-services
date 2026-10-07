import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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

// Phone line options for manual selection (no default preselection)
const PHONE_LINE_OPTIONS = [
  { id: 'mobile', label: 'Direct Mobile', prefix: '+91', placeholder: '10-digit mobile number' },
  { id: 'landline', label: 'Hospital Landline (STD)', prefix: '080', placeholder: 'STD code & phone number' },
  { id: 'tollfree', label: 'Toll-Free Helpline', prefix: '1800', placeholder: 'Toll-free 1800 number' },
  { id: 'casualty', label: 'Emergency Casualty Desk', prefix: '+91', placeholder: '24x7 desk number' },
];

const STEPS = [
  { id: 1, title: 'Identity & Beds', icon: 'business' as const },
  { id: 2, title: 'Accreditations', icon: 'shield-checkmark' as const },
  { id: 3, title: 'Premises & Admin', icon: 'call' as const },
  { id: 4, title: 'Document Upload', icon: 'cloud-upload' as const },
  { id: 5, title: 'Bank & Legal', icon: 'checkmark-done-circle' as const },
];

export default function HospitalRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { provider, registerProvider, switchProviderMode, toggleOnlineAvailability } = useApp();

  // Registration step state: 1 to 5
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  // Step 1: Hospital Identity & Beds
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

  // Step 2: Regulatory & Accreditations
  const [ceaLicenseNumber, setCeaLicenseNumber] = useState(
    provider.type === 'hospital' ? provider.licenseNumber : 'CEA-KA-2024-88412',
  );
  const [accreditation, setAccreditation] = useState(ACCREDITATION_LEVELS[0]);
  const [bmwAuthNumber, setBmwAuthNumber] = useState('KSPCB-BMW-2025-4190');

  // Step 3: Administration & Premises
  const [superintendentName, setSuperintendentName] = useState('Dr. Arvind K. Rao, MD, FRCS');
  const [superintendentRegNo, setSuperintendentRegNo] = useState('KMC-1998-38291');

  // Phone number: DISABLED DEFAULT SELECTION - user selects manually
  const [selectedPhoneOption, setSelectedPhoneOption] = useState<string | null>(null);
  const [adminPhone, setAdminPhone] = useState('');
  const [emergencyHotline, setEmergencyHotline] = useState('080-23456789');
  const [hospitalEmail, setHospitalEmail] = useState('admin@metroapex.onebuddy.health');

  // Premises & Location
  const [campusAddress, setCampusAddress] = useState('Campus 1, Health City Ring Road');
  const [city, setCity] = useState('Bengaluru');
  const [stateName, setStateName] = useState('Karnataka');
  const [pincode, setPincode] = useState('560034');

  // Step 4: Regulatory Document Uploads
  const [uploadedCeaDoc, setUploadedCeaDoc] = useState('CEA_Registration_Certificate.pdf');
  const [uploadedBmwDoc, setUploadedBmwDoc] = useState('BioMedical_Waste_Clearance.pdf');

  // Step 5: Bank Settlement & Legal Declaration
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50100458923412');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('metroapex@upi');
  const [isDeclared, setIsDeclared] = useState(true);

  const toggleDept = (dept: string) => {
    if (selectedDepts.includes(dept)) {
      if (selectedDepts.length === 1) {
        Alert.alert('Required', 'Please keep at least one active clinical department selected.');
        return;
      }
      setSelectedDepts(selectedDepts.filter((d) => d !== dept));
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  // Step Validation & Forward Navigation
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!hospitalName.trim()) {
        Alert.alert('Required Field', 'Please enter official hospital or healthcare center name.');
        return;
      }
      if (!totalBeds.trim()) {
        Alert.alert('Required Field', 'Please specify total bed capacity.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!ceaLicenseNumber.trim()) {
        Alert.alert('License Required', 'Please enter Clinical Establishment Act registration number.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedPhoneOption) {
        Alert.alert('Phone Selection Required', 'Please choose a phone line option manually (Direct Mobile, Landline, or Toll-Free).');
        return;
      }
      if (!adminPhone.trim() || adminPhone.trim().length < 8) {
        Alert.alert('Invalid Phone', 'Please enter a valid administrative contact number.');
        return;
      }
      if (!campusAddress.trim() || !city.trim()) {
        Alert.alert('Address Required', 'Please enter hospital campus address and city.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!uploadedCeaDoc) {
        Alert.alert('Document Required', 'Please upload or attach your CEA Registration Certificate.');
        return;
      }
      setCurrentStep(5);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegisterHospital = () => {
    if (!isDeclared) {
      Alert.alert('Declaration Required', 'Please verify compliance with the Clinical Establishments Act.');
      return;
    }

    const phonePrefix = selectedPhoneOption
      ? PHONE_LINE_OPTIONS.find((o) => o.id === selectedPhoneOption)?.prefix || '+91'
      : '+91';

    // Register provider details into global app context
    registerProvider({
      type: 'hospital',
      name: hospitalName.trim(),
      phone: `${phonePrefix} ${adminPhone.trim()}`,
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

    // Keep the user within the appropriate registered service/provider dashboard without redirecting to Home!
    setIsRegistered(true);

    Alert.alert(
      'Hospital Registered Successfully! 🏥',
      `${hospitalName} is verified and active on the OneBuddy Healthcare Network. You are now inside the Hospital Provider Dashboard.`,
      [{ text: 'View Hospital Dashboard' }],
    );
  };

  // If already registered, render the Hospital Provider Dashboard right here!
  if (isRegistered) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Hospital Dashboard Header */}
        <View style={styles.topHeader}>
          <Pressable
            style={styles.backBtn}
            onPress={() => setIsRegistered(false)}
            accessibilityLabel="Edit Registration"
            hitSlop={8}
          >
            <Ionicons name="settings-outline" size={18} color={colors.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="business" size={18} color="#DC2626" />
              <Text style={styles.headerTitle} numberOfLines={1}>{hospitalName}</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Registered Hospital Dashboard • CEA: {ceaLicenseNumber}
            </Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" />
            <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Active Status Hero Card */}
          <Card style={styles.dashboardHeroCard} padding="lg">
            <View style={styles.heroTopRow}>
              <View style={styles.heroIconBadge}>
                <Ionicons name="business" size={28} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.heroHospitalName} numberOfLines={1}>{hospitalName}</Text>
                </View>
                <Text style={styles.heroHospitalType}>{hospitalType}</Text>
                <Text style={styles.heroAccreditationText}>{accreditation} • CEA Approved</Text>
              </View>
            </View>

            {/* Fully Accessible Online / Offline Toggle Button */}
            <View style={styles.onlineToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.onlineToggleTitle}>Emergency & OP Status</Text>
                <Text style={styles.onlineToggleSub}>
                  {provider.isOnline
                    ? 'Online: Accepting in-person OP bookings & emergency triage'
                    : 'Offline: New admissions & appointments paused'}
                </Text>
              </View>

              <Pressable
                style={[
                  styles.onlineToggleBtn,
                  {
                    backgroundColor: provider.isOnline ? '#DCFCE7' : '#F1F5F9',
                    borderColor: provider.isOnline ? '#86EFAC' : '#CBD5E1',
                  },
                ]}
                onPress={() => {
                  toggleOnlineAvailability();
                  Alert.alert(
                    'Hospital Status Updated',
                    `Hospital is now ${!provider.isOnline ? 'ONLINE' : 'OFFLINE'}.`,
                    [{ text: 'OK' }],
                  );
                }}
                accessibilityRole="switch"
                accessibilityState={{ checked: provider.isOnline }}
                accessibilityLabel={`Hospital status is ${provider.isOnline ? 'Online' : 'Offline'}. Tap to toggle.`}
                hitSlop={8}
              >
                <View
                  style={[
                    styles.onlineDot,
                    { backgroundColor: provider.isOnline ? '#16A34A' : '#64748B' },
                  ]}
                />
                <Text
                  style={[
                    styles.onlineToggleBtnText,
                    { color: provider.isOnline ? '#15803D' : '#475569' },
                  ]}
                >
                  {provider.isOnline ? 'ONLINE' : 'OFFLINE'}
                </Text>
              </Pressable>
            </View>
          </Card>

          {/* Infrastructure Metrics Overview */}
          <View style={styles.sectionHeader}>
            <Ionicons name="stats-chart" size={17} color="#DC2626" />
            <Text style={styles.sectionTitle}>Hospital Infrastructure & Bed Capacity</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="bed" size={20} color="#DC2626" />
              <Text style={styles.statNumber}>{totalBeds}</Text>
              <Text style={styles.statLabel}>Total Beds</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="pulse" size={20} color="#0284C7" />
              <Text style={styles.statNumber}>{icuBeds}</Text>
              <Text style={styles.statLabel}>ICU Beds</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="medkit" size={20} color="#16A34A" />
              <Text style={styles.statNumber}>{operationTheatres}</Text>
              <Text style={styles.statLabel}>Surgical OTs</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="flash" size={20} color="#D97706" />
              <Text style={styles.statNumber}>{hasEmergency24x7 ? '24/7' : 'Day'}</Text>
              <Text style={styles.statLabel}>Casualty Desk</Text>
            </View>
          </View>

          {/* Hospital Management Actions */}
          <View style={styles.sectionHeader}>
            <Ionicons name="grid-outline" size={17} color="#DC2626" />
            <Text style={styles.sectionTitle}>Hospital Service Modules</Text>
          </View>

          <View style={styles.actionGrid}>
            <Pressable
              style={styles.actionCard}
              onPress={() => navigation.navigate('HospitalDoctors')}
              accessibilityLabel="Manage Doctor Rosters"
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="people" size={22} color="#DC2626" />
              </View>
              <Text style={styles.actionCardTitle}>Doctor Rosters</Text>
              <Text style={styles.actionCardSub}>Manage OPD consulting specialists</Text>
              <View style={styles.actionLinkRow}>
                <Text style={styles.actionLinkText}>Open Rosters</Text>
                <Ionicons name="arrow-forward" size={12} color="#DC2626" />
              </View>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => navigation.navigate('HospitalPackages')}
              accessibilityLabel="Manage Health Packages"
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="cube" size={22} color="#0284C7" />
              </View>
              <Text style={styles.actionCardTitle}>Health Packages</Text>
              <Text style={styles.actionCardSub}>Preventive health checkup plans</Text>
              <View style={styles.actionLinkRow}>
                <Text style={[styles.actionLinkText, { color: '#0284C7' }]}>Open Packages</Text>
                <Ionicons name="arrow-forward" size={12} color="#0284C7" />
              </View>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => navigation.navigate('Main', { screen: 'BookingsOrders' } as any)}
              accessibilityLabel="OP Consultation Bookings"
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="calendar" size={22} color="#16A34A" />
              </View>
              <Text style={styles.actionCardTitle}>OP Bookings Desk</Text>
              <Text style={styles.actionCardSub}>Incoming patient appointments</Text>
              <View style={styles.actionLinkRow}>
                <Text style={[styles.actionLinkText, { color: '#16A34A' }]}>View Bookings</Text>
                <Ionicons name="arrow-forward" size={12} color="#16A34A" />
              </View>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => setIsRegistered(false)}
              accessibilityLabel="Edit Hospital Facility"
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="create-outline" size={22} color="#D97706" />
              </View>
              <Text style={styles.actionCardTitle}>Edit Facility Info</Text>
              <Text style={styles.actionCardSub}>Update licenses, beds & phone</Text>
              <View style={styles.actionLinkRow}>
                <Text style={[styles.actionLinkText, { color: '#D97706' }]}>Edit Setup</Text>
                <Ionicons name="arrow-forward" size={12} color="#D97706" />
              </View>
            </Pressable>
          </View>

          {/* Hospital Administration Info */}
          <Card style={styles.summaryCard} padding="md">
            <Text style={styles.summaryCardHeading}>Administration & Registered Premises</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Superintendent:</Text>
              <Text style={styles.summaryValue}>{superintendentName} ({superintendentRegNo})</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Admin Contact:</Text>
              <Text style={styles.summaryValue}>
                {selectedPhoneOption
                  ? `${PHONE_LINE_OPTIONS.find((o) => o.id === selectedPhoneOption)?.prefix} ${adminPhone}`
                  : adminPhone || 'Not specified'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Emergency Desk:</Text>
              <Text style={styles.summaryValue}>{emergencyHotline}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Campus Address:</Text>
              <Text style={styles.summaryValue}>{campusAddress}, {city}, {stateName} - {pincode}</Text>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>Settlement Bank:</Text>
              <Text style={styles.summaryValue}>{bankName} ••••{accountNumber.slice(-4)} ({ifscCode})</Text>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Active Step Registration Form
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Clinical Header */}
      <View style={styles.topHeader}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (currentStep > 1) {
              handlePrevStep();
            } else if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Main', { screen: 'Home' } as any);
            }
          }}
          accessibilityLabel={currentStep > 1 ? `Back to Step ${currentStep - 1}` : 'Back'}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="business" size={17} color="#DC2626" />
            <Text style={styles.headerTitle}>Hospital Registration</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Step {currentStep} of 5: {STEPS[currentStep - 1]?.title}
          </Text>
        </View>

        <View style={styles.stepBadgePill}>
          <Text style={styles.stepBadgeText}>Step {currentStep}/5</Text>
        </View>
      </View>

      {/* Step Progress Tracker with Ticks / Checkmarks */}
      <View style={styles.progressTrackerContainer}>
        <View style={styles.trackerRow}>
          {STEPS.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isPending = step.id > currentStep;

            return (
              <React.Fragment key={step.id}>
                {index > 0 && (
                  <View
                    style={[
                      styles.trackerLine,
                      isCompleted ? styles.trackerLineCompleted : styles.trackerLinePending,
                    ]}
                  />
                )}
                <View style={styles.stepItemWrap}>
                  <View
                    style={[
                      styles.stepCircle,
                      isCompleted && styles.stepCircleCompleted,
                      isCurrent && styles.stepCircleCurrent,
                      isPending && styles.stepCirclePending,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text
                        style={[
                          styles.stepNumberText,
                          isCurrent && styles.stepNumberTextCurrent,
                          isPending && styles.stepNumberTextPending,
                        ]}
                      >
                        {step.id}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCompleted && styles.stepLabelCompleted,
                      isCurrent && styles.stepLabelCurrent,
                      isPending && styles.stepLabelPending,
                    ]}
                    numberOfLines={1}
                  >
                    {step.title}
                  </Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* Keyboard-aware scrollable form */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 160 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
        >
          {/* STEP 1: IDENTITY & BEDS */}
          {currentStep === 1 && (
            <>
              {/* Clinical Theme Hospital Banner */}
              <Card style={styles.themeBannerCard} padding="lg">
                <View style={styles.bannerRow}>
                  <View style={styles.themeBannerIconBadge}>
                    <Ionicons name="business" size={26} color="#DC2626" />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.themeBannerTitle}>Hospital Clinical Portal</Text>
                      <View style={styles.clinicalTag}>
                        <Text style={styles.clinicalTagText}>Category 1</Text>
                      </View>
                    </View>
                    <Text style={styles.themeBannerSubtitle}>
                      Register inpatient facilities, emergency triage, ICU infrastructure & clinical departments.
                    </Text>
                  </View>
                </View>
              </Card>

              <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark" size={18} color="#DC2626" />
                <Text style={styles.sectionTitle}>1. Hospital Identity & Bed Capacity</Text>
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

                {/* Bed Capacities */}
                <View style={styles.inputRow}>
                  <View style={{ flex: 1, marginRight: spacing.xs }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Total Beds *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={totalBeds}
                      onChangeText={setTotalBeds}
                      keyboardType="number-pad"
                      placeholder="180"
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
                      placeholder="24"
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
                      placeholder="6"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                {/* Emergency & Facilities Toggles */}
                <Text style={[styles.inputLabel, { marginTop: spacing.sm }]}>
                  Hospital Amenities & Emergency Desk
                </Text>
                <View style={styles.facilityToggleGrid}>
                  <View style={styles.facilityToggleItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.toggleItemTitle}>24/7 Emergency & Casualty</Text>
                      <Text style={styles.toggleItemSub}>Resuscitation & trauma triage</Text>
                    </View>
                    <Switch
                      value={hasEmergency24x7}
                      onValueChange={setHasEmergency24x7}
                      trackColor={{ false: '#CBD5E1', true: '#FECACA' }}
                      thumbColor={hasEmergency24x7 ? '#DC2626' : '#FFFFFF'}
                    />
                  </View>

                  <View style={styles.facilityToggleItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.toggleItemTitle}>In-House Blood Bank</Text>
                      <Text style={styles.toggleItemSub}>Whole blood & PRBC storage</Text>
                    </View>
                    <Switch
                      value={hasBloodBank}
                      onValueChange={setHasBloodBank}
                      trackColor={{ false: '#CBD5E1', true: '#FECACA' }}
                      thumbColor={hasBloodBank ? '#DC2626' : '#FFFFFF'}
                    />
                  </View>

                  <View style={styles.facilityToggleItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.toggleItemTitle}>Radiology & CT/MRI</Text>
                      <Text style={styles.toggleItemSub}>In-campus imaging diagnostics</Text>
                    </View>
                    <Switch
                      value={hasRadiology}
                      onValueChange={setHasRadiology}
                      trackColor={{ false: '#CBD5E1', true: '#FECACA' }}
                      thumbColor={hasRadiology ? '#DC2626' : '#FFFFFF'}
                    />
                  </View>

                  <View style={styles.facilityToggleItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.toggleItemTitle}>Ambulance Life Support</Text>
                      <Text style={styles.toggleItemSub}>ALS mobile ambulance fleet</Text>
                    </View>
                    <Switch
                      value={hasAmbulanceFleet}
                      onValueChange={setHasAmbulanceFleet}
                      trackColor={{ false: '#CBD5E1', true: '#FECACA' }}
                      thumbColor={hasAmbulanceFleet ? '#DC2626' : '#FFFFFF'}
                    />
                  </View>
                </View>

                {/* Clinical Departments Selection */}
                <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>
                  Enrolled Clinical Departments ({selectedDepts.length} Selected)
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
                          color={selected ? '#DC2626' : colors.textMuted}
                        />
                        <Text style={[styles.deptChipText, selected && styles.deptChipTextSelected]}>
                          {dept}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Card>

              {/* Step 1 Actions */}
              <Pressable
                style={styles.primaryStepBtn}
                onPress={handleNextStep}
                accessibilityLabel="Proceed to Accreditations"
              >
                <Text style={styles.primaryStepBtnText}>Continue to Step 2: Accreditations</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </>
          )}

          {/* STEP 2: REGULATORY LICENSES & ACCREDITATIONS */}
          {currentStep === 2 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text" size={18} color="#DC2626" />
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

                <Text style={styles.inputLabel}>Bio-Medical Waste (BMW) Authorization No.</Text>
                <TextInput
                  style={styles.textInput}
                  value={bmwAuthNumber}
                  onChangeText={setBmwAuthNumber}
                  placeholder="e.g. KSPCB-BMW-2025-4190"
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.infoBanner}>
                  <Ionicons name="information-circle" size={18} color="#0284C7" />
                  <Text style={styles.infoBannerText}>
                    CEA License numbers are cross-verified with state directorates of medical health before full patient discovery activation.
                  </Text>
                </View>
              </Card>

              {/* Step 2 Actions */}
              <View style={styles.stepBtnRow}>
                <Pressable
                  style={styles.secondaryStepBtn}
                  onPress={handlePrevStep}
                  accessibilityLabel="Back to Step 1"
                >
                  <Ionicons name="arrow-back" size={16} color={colors.text} />
                  <Text style={styles.secondaryStepBtnText}>Back</Text>
                </Pressable>

                <Pressable
                  style={[styles.primaryStepBtn, { flex: 2 }]}
                  onPress={handleNextStep}
                  accessibilityLabel="Proceed to Premises & Admin"
                >
                  <Text style={styles.primaryStepBtnText}>Step 3: Premises & Admin</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </>
          )}

          {/* STEP 3: PREMISES & ADMINISTRATION */}
          {currentStep === 3 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="call" size={18} color="#DC2626" />
                <Text style={styles.sectionTitle}>3. Administrative Phone & Premises</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.inputLabel}>Medical Superintendent / Director Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={superintendentName}
                  onChangeText={setSuperintendentName}
                  placeholder="Dr. Arvind K. Rao, MD, FRCS"
                  placeholderTextColor={colors.textMuted}
                />

                <Text style={styles.inputLabel}>Superintendent Council Reg No.</Text>
                <TextInput
                  style={styles.textInput}
                  value={superintendentRegNo}
                  onChangeText={setSuperintendentRegNo}
                  placeholder="KMC-1998-38291"
                  placeholderTextColor={colors.textMuted}
                />

                {/* Phone Selection Requirement: NO DEFAULT PRESELECTION - user selects manually */}
                <Text style={[styles.inputLabel, { marginTop: spacing.sm }]}>
                  Administrative Contact Option (Select One Manually) *
                </Text>
                <View style={styles.phoneOptionGrid}>
                  {PHONE_LINE_OPTIONS.map((opt) => {
                    const isSelected = selectedPhoneOption === opt.id;
                    return (
                      <Pressable
                        key={opt.id}
                        style={[
                          styles.phoneOptionChip,
                          isSelected && styles.phoneOptionChipSelected,
                        ]}
                        onPress={() => setSelectedPhoneOption(opt.id)}
                        accessibilityLabel={`Select ${opt.label}`}
                      >
                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={15}
                          color={isSelected ? '#DC2626' : colors.textMuted}
                        />
                        <View style={{ flex: 1, marginLeft: 6 }}>
                          <Text
                            style={[
                              styles.phoneOptionLabel,
                              isSelected && styles.phoneOptionLabelSelected,
                            ]}
                          >
                            {opt.label}
                          </Text>
                          <Text style={styles.phoneOptionPrefix}>Prefix: {opt.prefix}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Phone input with active selected prefix */}
                <Text style={styles.inputLabel}>
                  {selectedPhoneOption
                    ? `Enter ${PHONE_LINE_OPTIONS.find((o) => o.id === selectedPhoneOption)?.label} *`
                    : 'Select Phone Option Above First *'}
                </Text>
                <View style={styles.phoneInputWrap}>
                  <View style={styles.prefixBox}>
                    <Text style={styles.prefixText}>
                      {selectedPhoneOption
                        ? PHONE_LINE_OPTIONS.find((o) => o.id === selectedPhoneOption)?.prefix
                        : '--'}
                    </Text>
                  </View>
                  <TextInput
                    style={[styles.textInput, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                    value={adminPhone}
                    onChangeText={setAdminPhone}
                    keyboardType="phone-pad"
                    placeholder={
                      selectedPhoneOption
                        ? PHONE_LINE_OPTIONS.find((o) => o.id === selectedPhoneOption)?.placeholder
                        : 'Tap a phone option above first'
                    }
                    placeholderTextColor={colors.textMuted}
                    editable={Boolean(selectedPhoneOption)}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Emergency Hotline</Text>
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
                  placeholder="Campus 1, Health City Ring Road"
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.inputRow}>
                  <View style={{ flex: 1, marginRight: spacing.xs }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>City</Text>
                    <TextInput
                      style={styles.textInput}
                      value={city}
                      onChangeText={setCity}
                      placeholder="Bengaluru"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: spacing.xs }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>State</Text>
                    <TextInput
                      style={styles.textInput}
                      value={stateName}
                      onChangeText={setStateName}
                      placeholder="Karnataka"
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

              {/* Step 3 Actions */}
              <View style={styles.stepBtnRow}>
                <Pressable
                  style={styles.secondaryStepBtn}
                  onPress={handlePrevStep}
                  accessibilityLabel="Back to Step 2"
                >
                  <Ionicons name="arrow-back" size={16} color={colors.text} />
                  <Text style={styles.secondaryStepBtnText}>Back</Text>
                </Pressable>

                <Pressable
                  style={[styles.primaryStepBtn, { flex: 2 }]}
                  onPress={handleNextStep}
                  accessibilityLabel="Proceed to Document Upload"
                >
                  <Text style={styles.primaryStepBtnText}>Step 4: Upload Documents</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </>
          )}

          {/* STEP 4: REGULATORY DOCUMENT UPLOADS */}
          {currentStep === 4 && (
            <>
              {/* Back Button Returning to Previous Registration Step without losing info */}
              <View style={styles.docBackHeader}>
                <Pressable
                  style={styles.docBackBtn}
                  onPress={handlePrevStep}
                  accessibilityLabel="Back to Step 3: Premises & Admin"
                >
                  <Ionicons name="arrow-back" size={18} color="#DC2626" />
                  <Text style={styles.docBackBtnText}>Back to Step 3: Premises & Admin</Text>
                </Pressable>
              </View>

              <View style={styles.sectionHeader}>
                <Ionicons name="cloud-upload" size={18} color="#DC2626" />
                <Text style={styles.sectionTitle}>4. Regulatory Document Verification</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.uploadSectionTitle}>
                  Clinical Establishment Act (CEA) License Certificate *
                </Text>
                <View style={styles.docUploadBox}>
                  <View style={styles.docUploadIconCircle}>
                    <Ionicons name="document-attach" size={22} color="#DC2626" />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.docUploadTitle}>CEA Registration PDF</Text>
                    <Text style={styles.docUploadFilename}>{uploadedCeaDoc}</Text>
                    <View style={styles.verifiedDocPill}>
                      <Ionicons name="checkmark-circle" size={11} color="#15803D" />
                      <Text style={styles.verifiedDocPillText}>Ready for Submission</Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.uploadBtn}
                    onPress={() => {
                      Alert.alert('Upload Document', 'Select replacement CEA certificate file.', [
                        {
                          text: 'Replace PDF',
                          onPress: () =>
                            setUploadedCeaDoc(`CEA_Approval_${Date.now().toString().slice(-4)}.pdf`),
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]);
                    }}
                  >
                    <Text style={styles.uploadBtnText}>Replace</Text>
                  </Pressable>
                </View>

                <Text style={[styles.uploadSectionTitle, { marginTop: spacing.md }]}>
                  Bio-Medical Waste Authorization Document
                </Text>
                <View style={styles.docUploadBox}>
                  <View style={[styles.docUploadIconCircle, { backgroundColor: '#E0F2FE' }]}>
                    <Ionicons name="shield-checkmark" size={22} color="#0284C7" />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.docUploadTitle}>BMW Clearance PDF</Text>
                    <Text style={styles.docUploadFilename}>{uploadedBmwDoc}</Text>
                    <View style={[styles.verifiedDocPill, { backgroundColor: '#E0F2FE' }]}>
                      <Ionicons name="checkmark-circle" size={11} color="#0284C7" />
                      <Text style={[styles.verifiedDocPillText, { color: '#0369A1' }]}>
                        File Attached
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.uploadBtn}
                    onPress={() => {
                      Alert.alert('Upload Document', 'Select replacement BMW certificate file.', [
                        {
                          text: 'Replace PDF',
                          onPress: () =>
                            setUploadedBmwDoc(`BMW_Clearance_${Date.now().toString().slice(-4)}.pdf`),
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]);
                    }}
                  >
                    <Text style={styles.uploadBtnText}>Replace</Text>
                  </Pressable>
                </View>
              </Card>

              {/* Step 4 Navigation with Dedicated Back Button */}
              <View style={styles.stepBtnRow}>
                <Pressable
                  style={styles.secondaryStepBtn}
                  onPress={handlePrevStep}
                  accessibilityLabel="Back to Step 3"
                >
                  <Ionicons name="arrow-back" size={16} color={colors.text} />
                  <Text style={styles.secondaryStepBtnText}>Back to Step 3</Text>
                </Pressable>

                <Pressable
                  style={[styles.primaryStepBtn, { flex: 2 }]}
                  onPress={handleNextStep}
                  accessibilityLabel="Proceed to Bank & Legal Declaration"
                >
                  <Text style={styles.primaryStepBtnText}>Step 5: Bank & Legal</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </>
          )}

          {/* STEP 5: BANK SETTLEMENT & LEGAL DECLARATION */}
          {currentStep === 5 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="card" size={18} color="#DC2626" />
                <Text style={styles.sectionTitle}>5. Revenue Payout & Legal Compliance</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.inputLabel}>Designated Bank Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="e.g. HDFC Bank, SBI, ICICI"
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.inputRow}>
                  <View style={{ flex: 1.4, marginRight: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Account Number *</Text>
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
                    <Text style={styles.inputLabel} numberOfLines={1}>IFSC Code *</Text>
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

                <Text style={styles.inputLabel}>Direct Hospital UPI ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                  placeholder="metroapex@upi"
                  placeholderTextColor={colors.textMuted}
                />
              </Card>

              {/* Legal Declaration */}
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
                        backgroundColor: '#DC2626',
                        borderColor: '#DC2626',
                      },
                    ]}
                  >
                    {isDeclared && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.declarationText}>
                    I declare that all clinical licenses, bed strengths, ICU configurations, and establishment approvals submitted are authentic under the Clinical Establishments Act and State Health regulations.
                  </Text>
                </Pressable>
              </Card>

              {/* Final Step Actions */}
              <View style={styles.stepBtnRow}>
                <Pressable
                  style={styles.secondaryStepBtn}
                  onPress={handlePrevStep}
                  accessibilityLabel="Back to Step 4 Documents"
                >
                  <Ionicons name="arrow-back" size={16} color={colors.text} />
                  <Text style={styles.secondaryStepBtnText}>Back to Step 4</Text>
                </Pressable>

                <Pressable
                  style={[styles.primaryStepBtn, { flex: 2, backgroundColor: '#DC2626' }]}
                  onPress={handleRegisterHospital}
                  accessibilityLabel="Complete Hospital Registration"
                >
                  <Ionicons name="business" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryStepBtnText}>Complete & Open Dashboard</Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    minHeight: 56,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  stepBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: '#DC2626',
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressTrackerContainer: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackerLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  trackerLineCompleted: {
    backgroundColor: '#16A34A',
  },
  trackerLinePending: {
    backgroundColor: '#334155',
  },
  stepItemWrap: {
    alignItems: 'center',
    width: 58,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  stepCircleCompleted: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  stepCircleCurrent: {
    backgroundColor: '#DC2626',
    borderColor: '#EF4444',
  },
  stepCirclePending: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
  },
  stepNumberTextCurrent: {
    color: '#FFFFFF',
  },
  stepNumberTextPending: {
    color: '#64748B',
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  stepLabelCompleted: {
    color: '#16A34A',
    fontWeight: '700',
  },
  stepLabelCurrent: {
    color: '#F8FAFC',
    fontWeight: '800',
  },
  stepLabelPending: {
    color: '#64748B',
  },
  scrollContent: {
    backgroundColor: '#0B1120',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  themeBannerCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeBannerIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  clinicalTag: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  clinicalTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  themeBannerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
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
    color: '#F8FAFC',
  },
  formCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#F8FAFC',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipScroll: {
    marginVertical: 4,
  },
  typeChip: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  facilityToggleGrid: {
    gap: 8,
    marginTop: 4,
  },
  facilityToggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#334155',
  },
  toggleItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  toggleItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  deptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  deptChipSelected: {
    backgroundColor: '#3B0707',
    borderColor: '#DC2626',
  },
  deptChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  deptChipTextSelected: {
    color: '#FCA5A5',
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#082F49',
    borderColor: '#0284C7',
    borderWidth: 1,
    padding: 10,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11,
    color: '#BAE6FD',
    lineHeight: 16,
  },
  phoneOptionGrid: {
    gap: 6,
    marginBottom: 6,
  },
  phoneOptionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 9,
    borderRadius: radius.md,
  },
  phoneOptionChipSelected: {
    backgroundColor: '#3B0707',
    borderColor: '#DC2626',
  },
  phoneOptionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  phoneOptionLabelSelected: {
    color: '#FCA5A5',
  },
  phoneOptionPrefix: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixBox: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#334155',
    borderTopLeftRadius: radius.md,
    borderBottomLeftRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  prefixText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  docBackHeader: {
    marginBottom: spacing.xs,
  },
  docBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    borderColor: '#DC2626',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  docBackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FCA5A5',
  },
  uploadSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  docUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
  },
  docUploadIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B0707',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docUploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  docUploadFilename: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  verifiedDocPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#052E16',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  verifiedDocPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#86EFAC',
  },
  uploadBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  uploadBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  declarationCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  declarationText: {
    flex: 1,
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17,
  },
  stepBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.sm,
  },
  primaryStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  primaryStepBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
  },
  secondaryStepBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  dashboardHeroCard: {
    backgroundColor: '#1E293B',
    borderColor: '#DC2626',
    borderWidth: 1.5,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHospitalName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  heroHospitalType: {
    fontSize: 12,
    color: '#FCA5A5',
    fontWeight: '700',
    marginTop: 2,
  },
  heroAccreditationText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  onlineToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    borderRadius: radius.md,
    marginTop: spacing.md,
    gap: 12,
  },
  onlineToggleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  onlineToggleSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  onlineToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  onlineToggleBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: radius.lg,
    padding: 12,
  },
  actionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  actionCardSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 14,
  },
  actionLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  actionLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  summaryCardHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94A3B8',
    minWidth: 100,
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1,
    textAlign: 'right',
  },
});
