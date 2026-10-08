import React, { useState } from 'react';
import {
  Alert,
  Image,
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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '../../theme/colors';
import Card from '../../components/Card';
import { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../context/AppContext';
import { HospitalDoctor } from '../../types';

// Doctor Practice Options / Designations (Required field for Doctor registration)
const DOCTOR_PRACTICE_OPTIONS = [
  { id: 'specialist', label: 'Specialist Consultant', sub: 'MD / MS / DNB Certified Specialist' },
  { id: 'general', label: 'General Physician', sub: 'MBBS Family & Primary Care Physician' },
  { id: 'surgeon', label: 'Super-Specialist Surgeon', sub: 'MCh / DM / Fellowship Surgeon' },
  { id: 'telehealth', label: 'Visiting & Telehealth Doctor', sub: 'Remote Digital OPD & Home Consultations' },
  { id: 'senior_clinic', label: 'Clinic Senior Practitioner', sub: 'Independent Clinical Practice Lead' },
];

const PRACTICE_MODALITY_OPTIONS = [
  'OPD Clinic & Video Consults',
  'In-Clinic OPD Only',
  'Teleconsultation & Home Visits',
];

const SPECIALIZATIONS = [
  'General Medicine',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Orthopedics',
  'Neurology',
  'Gynecology & Obstetrics',
  'ENT Specialist',
  'Psychiatry',
  'Pulmonology',
  'Gastroenterology',
  'Ophthalmology',
];

const MEDICAL_COUNCILS = [
  'National Medical Commission (NMC)',
  'Karnataka Medical Council (KMC)',
  'Delhi Medical Council (DMC)',
  'Maharashtra Medical Council (MMC)',
  'Tamil Nadu Medical Council',
  'Other State Medical Council',
];

const DOCTOR_AVATAR_PRESETS = [
  {
    label: 'Male Doctor 1',
    uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Female Doctor 1',
    uri: 'https://images.unsplash.com/photo-1594824813587-0b1a0e5b7c6c?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Male Doctor 2',
    uri: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Female Doctor 2',
    uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  },
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const STEPS = [
  { id: 1, title: 'Doctor Option & Profile', icon: 'person' as const },
  { id: 2, title: 'Council & Credentials', icon: 'shield-checkmark' as const },
  { id: 3, title: 'Schedule & Fees', icon: 'cash' as const },
  { id: 4, title: 'Document Upload', icon: 'cloud-upload' as const },
  { id: 5, title: 'Bank & Ethics', icon: 'checkmark-done-circle' as const },
];

type DoctorRegistrationRouteProp = RouteProp<RootStackParamList, 'DoctorRegistration'>;

interface DoctorRegistrationProps {
  embedded?: boolean;
  onComplete?: () => void;
  onSwitchToDashboard?: () => void;
}

export default function DoctorRegistrationScreen({
  embedded = false,
  onComplete,
  onSwitchToDashboard,
}: DoctorRegistrationProps = {}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DoctorRegistrationRouteProp>();
  const { provider, addDoctor, updateDoctor, registerProvider, switchProviderMode, toggleOnlineAvailability } = useApp();

  const existingDoctor = route.params?.doctor;
  const isEditing = Boolean(existingDoctor);

  // Step Tracker state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  // Step 1: Doctor Practice Option / Field & Personal Identity
  const [doctorOption, setDoctorOption] = useState<string>(DOCTOR_PRACTICE_OPTIONS[0].id);
  const [practiceModality, setPracticeModality] = useState<string>(PRACTICE_MODALITY_OPTIONS[0]);
  const [name, setName] = useState(
    existingDoctor?.name || (provider.type === 'doctor' ? provider.name : 'Dr. Rajesh Sharma'),
  );
  const [photo, setPhoto] = useState(
    existingDoctor?.photo || DOCTOR_AVATAR_PRESETS[0].uri,
  );
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(
    existingDoctor?.gender || 'Male',
  );
  const [phone, setPhone] = useState(
    existingDoctor?.phone || (provider.type === 'doctor' ? provider.phone.replace('+91 ', '') : ''),
  );
  const [email, setEmail] = useState(
    existingDoctor?.email || (provider.type === 'doctor' ? provider.email : 'dr.rajesh@onebuddy.health'),
  );
  const [specialization, setSpecialization] = useState(
    existingDoctor?.specialization || 'Cardiology',
  );
  const [qualification, setQualification] = useState(
    existingDoctor?.qualification || 'MBBS, MD (Medicine), DM (Cardiology)',
  );
  const [experience, setExperience] = useState(
    String(existingDoctor?.experience || '12'),
  );

  // Step 2: Medical Credentials & Council
  const [councilRegNumber, setCouncilRegNumber] = useState(
    existingDoctor?.councilRegistrationNumber ||
      (provider.type === 'doctor' ? provider.licenseNumber : 'MCI-2019-84729'),
  );
  const [medicalCouncil, setMedicalCouncil] = useState(MEDICAL_COUNCILS[0]);
  const [councilRegYear, setCouncilRegYear] = useState('2014');
  const [affiliatedHospital, setAffiliatedHospital] = useState('Metro Apex Multi-Specialty Hospital');

  // Step 3: Clinic Details & Fees
  const [clinicName, setClinicName] = useState('Dr. Rajesh Sharma Cardiology Clinic');
  const [clinicAddress, setClinicAddress] = useState('Suite 204, Meditech Plaza, Indiranagar, Bengaluru');
  const [consultationFee, setConsultationFee] = useState(
    String(existingDoctor?.consultationFee || '750'),
  );
  const [onlineFee, setOnlineFee] = useState(
    String(existingDoctor?.onlineConsultationFee || '600'),
  );
  const [homeVisitFee, setHomeVisitFee] = useState('1200');
  const [slotDuration, setSlotDuration] = useState(
    String(existingDoctor?.slotDurationMinutes || '15'),
  );
  const [availableDays, setAvailableDays] = useState<string[]>(
    existingDoctor?.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  );
  const [timeStart, setTimeStart] = useState(existingDoctor?.availableTimeStart || '09:00 AM');
  const [timeEnd, setTimeEnd] = useState(existingDoctor?.availableTimeEnd || '05:00 PM');
  const [offersHomeVisits, setOffersHomeVisits] = useState(true);

  // Step 4: Regulatory Document Uploads
  const [uploadedDoc, setUploadedDoc] = useState('MCI_Council_Registration_Certificate.pdf');
  const [uploadedDegreeDoc, setUploadedDegreeDoc] = useState('Medical_PostGraduate_Degree.pdf');

  // Step 5: Bank Settlement & Medical Ethics
  const [bankName, setBankName] = useState('ICICI Bank');
  const [accountNumber, setAccountNumber] = useState('002105018934');
  const [ifscCode, setIfscCode] = useState('ICIC0000021');
  const [upiId, setUpiId] = useState('dr.rajesh@icici');
  const [isDeclared, setIsDeclared] = useState(true);

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      if (availableDays.length === 1) {
        Alert.alert('Required', 'Doctor must have at least one consulting day.');
        return;
      }
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const trimmedName = name.trim();
      if (!trimmedName || trimmedName === 'Dr.') {
        Alert.alert('Required Field', 'Please enter doctor full name.');
        return;
      }
      if (!doctorOption) {
        Alert.alert('Doctor Option Required', 'Please select a Doctor Option / Designation.');
        return;
      }
      if (!specialization.trim() || !qualification.trim()) {
        Alert.alert('Required Field', 'Please specify medical specialization and qualification.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!councilRegNumber.trim()) {
        Alert.alert('License Required', 'Please enter Medical Council Registration number.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!phone.trim() || phone.trim().length < 10) {
        Alert.alert('Invalid Phone', 'Please enter a valid 10-digit primary mobile number.');
        return;
      }
      if (!clinicAddress.trim()) {
        Alert.alert('Address Required', 'Please enter clinic or consultation chambers address.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!uploadedDoc) {
        Alert.alert('Document Required', 'Please upload Medical Council registration certificate.');
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

  const handleRegisterDoctor = () => {
    const trimmedName = name.trim();
    if (!isDeclared) {
      Alert.alert(
        'Ethics Declaration Required',
        'Please confirm adherence to Telemedicine Practice Guidelines and Medical Council ethics.',
      );
      return;
    }

    const selectedOptionObj = DOCTOR_PRACTICE_OPTIONS.find((o) => o.id === doctorOption);

    const doctorData: Omit<HospitalDoctor, 'id' | 'hospitalId'> = {
      name: trimmedName,
      photo,
      specialization,
      qualification,
      experience: parseInt(experience, 10) || 10,
      consultationFee: parseInt(consultationFee, 10) || 750,
      onlineConsultationFee: parseInt(onlineFee, 10) || 600,
      healthIssues: ['General Consultation', specialization],
      slotDurationMinutes: parseInt(slotDuration, 10) || 15,
      availableDays,
      availableTimeStart: timeStart,
      availableTimeEnd: timeEnd,
      blockedDates: existingDoctor?.blockedDates || [],
      councilRegistrationNumber: councilRegNumber.trim(),
      phone: phone.trim(),
      email: email.trim(),
      gender,
      bio: `${selectedOptionObj?.label || 'Doctor'} practicing ${specialization} with ${experience} years experience.`,
    };

    if (isEditing && existingDoctor) {
      updateDoctor(existingDoctor.id, doctorData);
    } else {
      addDoctor(doctorData);
    }

    // Register into provider context
    registerProvider({
      type: 'doctor',
      name: trimmedName,
      phone: `+91 ${phone.trim()}`,
      email: email.trim(),
      licenseNumber: councilRegNumber.trim(),
      licenseType: medicalCouncil,
      licenseDocName: uploadedDoc,
      consultationFee: parseInt(onlineFee, 10) || 600,
      homeVisitFee: parseInt(homeVisitFee, 10) || 1200,
      specialization,
      qualifications: qualification,
      experienceYears: parseInt(experience, 10) || 10,
      bankDetails: {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        accountName: trimmedName,
        upiId: upiId.trim(),
      },
    });

    switchProviderMode('doctor');
    setIsRegistered(true);
    onComplete?.();

    Alert.alert(
      'Doctor Registration Complete! 🩺',
      `${trimmedName} is successfully registered as "${selectedOptionObj?.label}" with active ${medicalCouncil} verification.`,
      [{ text: 'View Doctor Dashboard' }],
    );
  };

  const ContainerComponent = embedded ? View : SafeAreaView;
  const containerProps = embedded ? { style: styles.safe } : { style: styles.safe, edges: ['top'] as const };

  // If already registered, render the Doctor Service Dashboard right here!
  if (isRegistered) {
    const selectedOptionObj = DOCTOR_PRACTICE_OPTIONS.find((o) => o.id === doctorOption);

    return (
      <ContainerComponent {...(containerProps as any)}>
        {/* Doctor Dashboard Header */}
        <View style={styles.topHeader}>
          <Pressable
            style={styles.backBtn}
            onPress={() => setIsRegistered(false)}
            accessibilityLabel="Edit Doctor Registration"
            hitSlop={8}
          >
            <Ionicons name="settings-outline" size={18} color="#FFFFFF" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="medkit" size={18} color="#60A5FA" />
              <Text style={styles.headerTitle} numberOfLines={1}>{name}</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Registered Doctor Dashboard • {specialization} • Reg: {councilRegNumber}
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
          {/* Active Doctor Hero Card */}
          <Card style={styles.dashboardHeroCard} padding="lg">
            <View style={styles.heroTopRow}>
              <Image source={{ uri: photo }} style={styles.heroDoctorAvatar} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.heroDoctorName} numberOfLines={1}>{name}</Text>
                <View style={styles.doctorOptionTag}>
                  <Text style={styles.doctorOptionTagText}>
                    {selectedOptionObj?.label || 'Specialist Consultant'}
                  </Text>
                </View>
                <Text style={styles.heroSubText}>
                  {specialization} • {qualification} • {experience} yrs exp
                </Text>
                <Text style={styles.heroCouncilText}>{medicalCouncil}</Text>
              </View>
            </View>

            {/* Fully Accessible Online / Offline Toggle Button (Silent: No Notification Alert) */}
            <View style={styles.onlineToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.onlineToggleTitle}>Consultation Availability</Text>
                <Text style={styles.onlineToggleSub}>
                  {provider.isOnline
                    ? 'Online: Accepting video consultations & clinic appointments'
                    : 'Offline: Patient booking requests paused'}
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
                }}
                accessibilityRole="switch"
                accessibilityState={{ checked: provider.isOnline }}
                accessibilityLabel={`Doctor availability is ${provider.isOnline ? 'Online' : 'Offline'}. Tap to toggle.`}
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

          {/* Consultation Fee Metrics */}
          <View style={styles.sectionHeader}>
            <Ionicons name="cash-outline" size={17} color="#2563EB" />
            <Text style={styles.sectionTitle}>Consultation Fees & Practice Modalities</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="videocam" size={20} color="#2563EB" />
              <Text style={styles.statNumber}>₹{onlineFee}</Text>
              <Text style={styles.statLabel}>Video Consult</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="business" size={20} color="#0D9488" />
              <Text style={styles.statNumber}>₹{consultationFee}</Text>
              <Text style={styles.statLabel}>In-Clinic OPD</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="home" size={20} color="#D97706" />
              <Text style={styles.statNumber}>₹{homeVisitFee}</Text>
              <Text style={styles.statLabel}>Home Visit</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="time" size={20} color="#7C3AED" />
              <Text style={styles.statNumber}>{slotDuration}m</Text>
              <Text style={styles.statLabel}>Slot Duration</Text>
            </View>
          </View>

          {/* Doctor Management Actions */}
          <View style={styles.sectionHeader}>
            <Ionicons name="grid-outline" size={17} color="#2563EB" />
            <Text style={styles.sectionTitle}>Doctor Practice Modules</Text>
          </View>

          <View style={styles.actionGrid}>
            <Pressable
              style={styles.actionCard}
              onPress={() => {
                switchProviderMode('doctor');
                navigation.navigate('DoctorConsultations');
              }}
              accessibilityLabel="View Consultations"
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="videocam" size={22} color="#2563EB" />
              </View>
              <Text style={styles.actionCardTitle}>Video Consults</Text>
              <Text style={styles.actionCardSub}>Incoming teleconsultation queue</Text>
              <View style={styles.actionLinkRow}>
                <Text style={styles.actionLinkText}>Open Queue</Text>
                <Ionicons name="arrow-forward" size={12} color="#2563EB" />
              </View>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => {
                switchProviderMode('doctor');
                navigation.navigate('DoctorHomeVisits');
              }}
              accessibilityLabel="Manage Home Visits"
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="car" size={22} color="#D97706" />
              </View>
              <Text style={styles.actionCardTitle}>Home Visits Desk</Text>
              <Text style={styles.actionCardSub}>House-call appointments nearby</Text>
              <View style={styles.actionLinkRow}>
                <Text style={[styles.actionLinkText, { color: '#D97706' }]}>Open Visits</Text>
                <Ionicons name="arrow-forward" size={12} color="#D97706" />
              </View>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => setIsRegistered(false)}
              accessibilityLabel="Edit Doctor Profile"
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="create-outline" size={22} color="#475569" />
              </View>
              <Text style={styles.actionCardTitle}>Edit Credentials</Text>
              <Text style={styles.actionCardSub}>Update fees, schedule & bio</Text>
              <View style={styles.actionLinkRow}>
                <Text style={[styles.actionLinkText, { color: '#475569' }]}>Edit Setup</Text>
                <Ionicons name="arrow-forward" size={12} color="#475569" />
              </View>
            </Pressable>
          </View>

          {/* Practice & Settlement Summary */}
          <Card style={styles.summaryCard} padding="md">
            <Text style={styles.summaryCardHeading}>Practice Chambers & Bank Settlement</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Clinic Name:</Text>
              <Text style={styles.summaryValue}>{clinicName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Clinic Address:</Text>
              <Text style={styles.summaryValue}>{clinicAddress}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Schedule Days:</Text>
              <Text style={styles.summaryValue}>{availableDays.join(', ')} ({timeStart} - {timeEnd})</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Contact Phone:</Text>
              <Text style={styles.summaryValue}>+91 {phone}</Text>
            </View>
            <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>Settlement Bank:</Text>
              <Text style={styles.summaryValue}>{bankName} ••••{accountNumber.slice(-4)} ({ifscCode})</Text>
            </View>
          </Card>
        </ScrollView>
      </ContainerComponent>
    );
  }

  // Active Step Registration Form
  return (
    <ContainerComponent {...(containerProps as any)}>
      {/* Top Header */}
      {!embedded && (
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
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="medkit" size={17} color="#60A5FA" />
              <Text style={styles.headerTitle}>Doctor Registration</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Step {currentStep} of 5: {STEPS[currentStep - 1]?.title}
            </Text>
          </View>

          <View style={styles.stepBadgePill}>
            <Text style={styles.stepBadgeText}>Step {currentStep}/5</Text>
          </View>
        </View>
      )}

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

      {/* Keyboard-aware scrollable registration form */}
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
          {/* STEP 1: DOCTOR OPTION & IDENTITY */}
          {currentStep === 1 && (
            <>
              {/* Doctor Category Hero Banner */}
              <Card style={styles.bannerCard} padding="lg">
                <View style={styles.bannerRow}>
                  <View style={styles.bannerIconBadge}>
                    <Ionicons name="medkit" size={26} color="#2563EB" />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.bannerTitle}>Doctor Practice Onboarding</Text>
                      <View style={styles.doctorTag}>
                        <Text style={styles.doctorTagText}>Category 2</Text>
                      </View>
                    </View>
                    <Text style={styles.bannerSubtitle}>
                      Register as a specialist consultant, family physician, or telemedicine expert with verified council credentials.
                    </Text>
                  </View>
                </View>
              </Card>

              {/* REQUIRED DOCTOR OPTION / DESIGNATION SELECTOR */}
              <View style={styles.sectionHeader}>
                <Ionicons name="ribbon" size={18} color="#2563EB" />
                <Text style={styles.sectionTitle}>1. Doctor Practice Option / Designation *</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.inputLabel}>
                  Select Doctor Option / Practice Category *
                </Text>
                <View style={styles.doctorOptionGrid}>
                  {DOCTOR_PRACTICE_OPTIONS.map((opt) => {
                    const active = doctorOption === opt.id;
                    return (
                      <Pressable
                        key={opt.id}
                        style={[styles.doctorOptionCard, active && styles.doctorOptionCardActive]}
                        onPress={() => setDoctorOption(opt.id)}
                        accessibilityLabel={`Select ${opt.label}`}
                      >
                        <Ionicons
                          name={active ? 'checkmark-circle' : 'ellipse-outline'}
                          size={18}
                          color={active ? '#2563EB' : colors.textMuted}
                        />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text style={[styles.doctorOptionTitle, active && styles.doctorOptionTitleActive]}>
                            {opt.label}
                          </Text>
                          <Text style={styles.doctorOptionSub}>{opt.sub}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>
                  Practice Modality *
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {PRACTICE_MODALITY_OPTIONS.map((mod) => {
                    const active = practiceModality === mod;
                    return (
                      <Pressable
                        key={mod}
                        style={[styles.typeChip, active && styles.typeChipActive]}
                        onPress={() => setPracticeModality(mod)}
                      >
                        <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                          {mod}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </Card>

              {/* Personal & Specialty Profile */}
              <View style={styles.sectionHeader}>
                <Ionicons name="person-circle" size={18} color="#2563EB" />
                <Text style={styles.sectionTitle}>Doctor Profile & Qualifications</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.inputLabel}>Doctor Full Name (with Prefix) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  placeholderTextColor={colors.textMuted}
                />

                <Text style={styles.inputLabel}>Select Doctor Profile Avatar</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarScroll}>
                  {DOCTOR_AVATAR_PRESETS.map((item, idx) => {
                    const isSelected = photo === item.uri;
                    return (
                      <Pressable
                        key={idx}
                        style={[styles.avatarChoice, isSelected && styles.avatarChoiceSelected]}
                        onPress={() => setPhoto(item.uri)}
                      >
                        <Image source={{ uri: item.uri }} style={styles.avatarImg} />
                        {isSelected && (
                          <View style={styles.avatarCheckmarkBadge}>
                            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Text style={styles.inputLabel}>Primary Medical Specialization *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {SPECIALIZATIONS.map((spec) => {
                    const active = specialization === spec;
                    return (
                      <Pressable
                        key={spec}
                        style={[styles.typeChip, active && styles.typeChipActive]}
                        onPress={() => setSpecialization(spec)}
                      >
                        <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                          {spec}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <View style={styles.inputRow}>
                  <View style={{ flex: 1.5, marginRight: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Degrees / Qualifications *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={qualification}
                      onChangeText={setQualification}
                      placeholder="MBBS, MD (Medicine)"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 0.8, marginLeft: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Exp (Years)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={experience}
                      onChangeText={setExperience}
                      keyboardType="number-pad"
                      placeholder="12"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>
              </Card>

              {/* Step 1 Actions */}
              <Pressable
                style={styles.primaryStepBtn}
                onPress={handleNextStep}
                accessibilityLabel="Continue to Step 2 Credentials"
              >
                <Text style={styles.primaryStepBtnText}>Continue to Step 2: Credentials</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </>
          )}

          {/* STEP 2: COUNCIL & REGULATORY CREDENTIALS */}
          {currentStep === 2 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark" size={18} color="#2563EB" />
                <Text style={styles.sectionTitle}>2. Medical Council Registration & Credentials</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.inputLabel}>
                  Medical Council Registration Number *
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={councilRegNumber}
                  onChangeText={setCouncilRegNumber}
                  placeholder="e.g. MCI-2019-84729"
                  placeholderTextColor={colors.textMuted}
                />

                <Text style={styles.inputLabel}>Registering Medical Council *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {MEDICAL_COUNCILS.map((c) => {
                    const active = medicalCouncil === c;
                    return (
                      <Pressable
                        key={c}
                        style={[styles.typeChip, active && styles.typeChipActive]}
                        onPress={() => setMedicalCouncil(c)}
                      >
                        <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                          {c}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <View style={styles.inputRow}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Year of Registration</Text>
                    <TextInput
                      style={styles.textInput}
                      value={councilRegYear}
                      onChangeText={setCouncilRegYear}
                      keyboardType="number-pad"
                      placeholder="2014"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1.5, marginLeft: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Hospital Affiliation</Text>
                    <TextInput
                      style={styles.textInput}
                      value={affiliatedHospital}
                      onChangeText={setAffiliatedHospital}
                      placeholder="Metro Apex Hospital"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                <View style={styles.infoBanner}>
                  <Ionicons name="shield" size={18} color="#2563EB" />
                  <Text style={styles.infoBannerText}>
                    Doctor registration numbers are verified with the NMC National Medical Register to ensure authorized telemedicine & clinical practice.
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
                  accessibilityLabel="Continue to Step 3 Schedule & Fees"
                >
                  <Text style={styles.primaryStepBtnText}>Step 3: Schedule & Fees</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </>
          )}

          {/* STEP 3: PRACTICE SCHEDULE & FEES */}
          {currentStep === 3 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="cash" size={18} color="#2563EB" />
                <Text style={styles.sectionTitle}>3. Consultation Fees & Practice Schedule</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.inputLabel}>Practice Chambers / Clinic Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={clinicName}
                  onChangeText={setClinicName}
                  placeholder="Dr. Rajesh Sharma Cardiology Clinic"
                  placeholderTextColor={colors.textMuted}
                />

                <Text style={styles.inputLabel}>Clinic Address *</Text>
                <TextInput
                  style={styles.textInput}
                  value={clinicAddress}
                  onChangeText={setClinicAddress}
                  placeholder="Suite 204, Meditech Plaza, Indiranagar, Bengaluru"
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.inputRow}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Primary Mobile *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      placeholder="10-digit mobile"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Doctor Email *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="dr.rajesh@health.com"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                {/* Consultation Fees */}
                <View style={styles.inputRow}>
                  <View style={{ flex: 1, marginRight: spacing.xs }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>In-Clinic Fee (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={consultationFee}
                      onChangeText={setConsultationFee}
                      keyboardType="number-pad"
                      placeholder="750"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: spacing.xs }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Video Fee (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={onlineFee}
                      onChangeText={setOnlineFee}
                      keyboardType="number-pad"
                      placeholder="600"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.xs }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Home Visit (₹)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={homeVisitFee}
                      onChangeText={setHomeVisitFee}
                      keyboardType="number-pad"
                      placeholder="1200"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                {/* Consulting Days */}
                <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>
                  Consultation Days (Tap to toggle)
                </Text>
                <View style={styles.daysRow}>
                  {DAYS_OF_WEEK.map((day) => {
                    const active = availableDays.includes(day);
                    return (
                      <Pressable
                        key={day}
                        style={[styles.dayChip, active && styles.dayChipActive]}
                        onPress={() => toggleDay(day)}
                      >
                        <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                          {day}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.inputRow}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Start Time</Text>
                    <TextInput
                      style={styles.textInput}
                      value={timeStart}
                      onChangeText={setTimeStart}
                      placeholder="09:00 AM"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>End Time</Text>
                    <TextInput
                      style={styles.textInput}
                      value={timeEnd}
                      onChangeText={setTimeEnd}
                      placeholder="05:00 PM"
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
                  accessibilityLabel="Continue to Step 4 Document Upload"
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
                  accessibilityLabel="Back to Step 3: Practice & Fees"
                >
                  <Ionicons name="arrow-back" size={18} color="#2563EB" />
                  <Text style={styles.docBackBtnText}>Back to Step 3: Practice & Fees</Text>
                </Pressable>
              </View>

              <View style={styles.sectionHeader}>
                <Ionicons name="cloud-upload" size={18} color="#2563EB" />
                <Text style={styles.sectionTitle}>4. Medical Council Document Verification</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.uploadSectionTitle}>
                  Medical Council Registration Certificate (MCI / State SMC) *
                </Text>
                <View style={styles.docUploadBox}>
                  <View style={styles.docUploadIconCircle}>
                    <Ionicons name="document-attach" size={22} color="#2563EB" />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.docUploadTitle}>Council Certificate PDF</Text>
                    <Text style={styles.docUploadFilename}>{uploadedDoc}</Text>
                    <View style={styles.verifiedDocPill}>
                      <Ionicons name="checkmark-circle" size={11} color="#15803D" />
                      <Text style={styles.verifiedDocPillText}>Ready for Verification</Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.uploadBtn}
                    onPress={() => {
                      Alert.alert('Upload Certificate', 'Select replacement Medical Council document.', [
                        {
                          text: 'Replace PDF',
                          onPress: () =>
                            setUploadedDoc(`Medical_Council_Reg_${Date.now().toString().slice(-4)}.pdf`),
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]);
                    }}
                  >
                    <Text style={styles.uploadBtnText}>Replace</Text>
                  </Pressable>
                </View>

                <Text style={[styles.uploadSectionTitle, { marginTop: spacing.md }]}>
                  Postgraduate Degree / Specialization Certificate
                </Text>
                <View style={styles.docUploadBox}>
                  <View style={[styles.docUploadIconCircle, { backgroundColor: '#EDE9FE' }]}>
                    <Ionicons name="school" size={22} color="#7C3AED" />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.docUploadTitle}>Degree Certificate PDF</Text>
                    <Text style={styles.docUploadFilename}>{uploadedDegreeDoc}</Text>
                    <View style={[styles.verifiedDocPill, { backgroundColor: '#EDE9FE' }]}>
                      <Ionicons name="checkmark-circle" size={11} color="#7C3AED" />
                      <Text style={[styles.verifiedDocPillText, { color: '#6D28D9' }]}>
                        File Attached
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.uploadBtn}
                    onPress={() => {
                      Alert.alert('Upload Degree', 'Select replacement PG degree certificate.', [
                        {
                          text: 'Replace PDF',
                          onPress: () =>
                            setUploadedDegreeDoc(`PG_Degree_${Date.now().toString().slice(-4)}.pdf`),
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
                  accessibilityLabel="Continue to Step 5 Bank & Ethics"
                >
                  <Text style={styles.primaryStepBtnText}>Step 5: Bank & Ethics</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </>
          )}

          {/* STEP 5: BANK SETTLEMENT & MEDICAL ETHICS */}
          {currentStep === 5 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="card" size={18} color="#2563EB" />
                <Text style={styles.sectionTitle}>5. Revenue Disbursal & Code of Ethics</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.inputLabel}>Payout Bank Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="e.g. ICICI Bank, HDFC Bank, SBI"
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
                      placeholder="ICIC0000021"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Direct Doctor UPI ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                  placeholder="dr.rajesh@upi"
                  placeholderTextColor={colors.textMuted}
                />
              </Card>

              {/* Ethics Declaration */}
              <Card style={styles.declarationCard} padding="md">
                <Pressable
                  style={styles.checkboxRow}
                  onPress={() => setIsDeclared(!isDeclared)}
                  accessibilityLabel="Agree to Medical Ethics"
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      isDeclared && {
                        backgroundColor: '#2563EB',
                        borderColor: '#2563EB',
                      },
                    ]}
                  >
                    {isDeclared && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.declarationText}>
                    I confirm adherence to the NMC Telemedicine Practice Guidelines, Indian Medical Council (Professional Conduct, Etiquette & Ethics) Regulations, and affirm that all submitted qualification credentials are accurate.
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
                  style={[styles.primaryStepBtn, { flex: 2, backgroundColor: '#2563EB' }]}
                  onPress={handleRegisterDoctor}
                  accessibilityLabel="Complete Doctor Registration"
                >
                  <Ionicons name="medkit" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryStepBtnText}>Complete & Open Dashboard</Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    minHeight: 56,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
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
    backgroundColor: '#2563EB',
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    backgroundColor: '#E2E8F0',
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
    backgroundColor: '#2563EB',
    borderColor: '#BFDBFE',
  },
  stepCirclePending: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
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
    color: '#2563EB',
    fontWeight: '800',
  },
  stepLabelPending: {
    color: '#64748B',
  },
  scrollContent: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  doctorTag: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  doctorTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#64748B',
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
    color: '#0F172A',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: radius.lg,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorOptionGrid: {
    gap: 8,
    marginTop: 4,
  },
  doctorOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    borderRadius: radius.md,
  },
  doctorOptionCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    borderWidth: 1.5,
  },
  doctorOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  doctorOptionTitleActive: {
    color: '#1D4ED8',
  },
  doctorOptionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  chipScroll: {
    marginVertical: 4,
  },
  typeChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  avatarScroll: {
    marginVertical: 6,
  },
  avatarChoice: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    position: 'relative',
  },
  avatarChoiceSelected: {
    borderColor: '#2563EB',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  avatarCheckmarkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#2563EB',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  dayChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radius.sm,
  },
  dayChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  dayChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    padding: 10,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11,
    color: '#1D4ED8',
    lineHeight: 16,
  },
  docBackHeader: {
    marginBottom: spacing.xs,
  },
  docBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  docBackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  uploadSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  docUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
  },
  docUploadIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docUploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  docUploadFilename: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedDocPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  verifiedDocPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803D',
  },
  uploadBtn: {
    backgroundColor: '#2563EB',
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
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: radius.lg,
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
    color: '#334155',
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
    backgroundColor: '#2563EB',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
  },
  secondaryStepBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  dashboardHeroCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BFDBFE',
    borderWidth: 1.5,
    borderRadius: radius.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroDoctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  heroDoctorName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  doctorOptionTag: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  doctorOptionTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  heroCouncilText: {
    fontSize: 10,
    color: '#2563EB',
    marginTop: 1,
  },
  onlineToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    borderRadius: radius.md,
    marginTop: spacing.md,
    gap: 12,
  },
  onlineToggleTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: radius.lg,
    padding: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
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
    color: '#0F172A',
  },
  actionCardSub: {
    fontSize: 10,
    color: '#64748B',
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
    color: '#2563EB',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  summaryCardHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
    minWidth: 100,
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'right',
  },
});
