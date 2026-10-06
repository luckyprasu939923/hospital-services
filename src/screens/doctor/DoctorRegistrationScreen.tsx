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
import { HospitalDoctor } from '../../types';

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
  'Karnataka Medical Council (KMC)',
  'Delhi Medical Council (DMC)',
  'Maharashtra Medical Council (MMC)',
  'Tamil Nadu Medical Council',
  'National Medical Commission (NMC)',
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

const COMMON_CONDITIONS = [
  'Hypertension',
  'Diabetes Mellitus',
  'Fever & Viral Cough',
  'Chest Pain & Angina',
  'Joint Pain & Arthritis',
  'Asthma & Allergies',
  'Headache & Migraine',
  'Thyroid Disorders',
  'Acid Reflux & GERD',
  'Skin Rash & Eczema',
];

type DoctorRegistrationRouteProp = RouteProp<RootStackParamList, 'DoctorRegistration'>;

export default function DoctorRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DoctorRegistrationRouteProp>();
  const { provider, addDoctor, updateDoctor, registerProvider, switchProviderMode } = useApp();

  const existingDoctor = route.params?.doctor;
  const isEditing = Boolean(existingDoctor);

  // 1. Personal & Identity
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
    existingDoctor?.phone || (provider.type === 'doctor' ? provider.phone.replace('+91 ', '') : '9876543210'),
  );
  const [email, setEmail] = useState(
    existingDoctor?.email || (provider.type === 'doctor' ? provider.email : 'dr.rajesh@onebuddy.health'),
  );

  // 2. Medical Credentials & Council
  const [councilRegNumber, setCouncilRegNumber] = useState(
    existingDoctor?.councilRegistrationNumber ||
      (provider.type === 'doctor' ? provider.licenseNumber : 'MCI-2019-84729'),
  );
  const [medicalCouncil, setMedicalCouncil] = useState(MEDICAL_COUNCILS[0]);
  const [specialization, setSpecialization] = useState(
    existingDoctor?.specialization || 'Cardiology',
  );
  const [qualification, setQualification] = useState(
    existingDoctor?.qualification || 'MBBS, MD (Medicine), DM (Cardiology)',
  );
  const [experience, setExperience] = useState(
    String(existingDoctor?.experience || '12'),
  );

  // 3. Clinic Details & Fees
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

  // 4. OPD Schedule
  const [availableDays, setAvailableDays] = useState<string[]>(
    existingDoctor?.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  );
  const [timeStart, setTimeStart] = useState(
    existingDoctor?.availableTimeStart || '09:00 AM',
  );
  const [timeEnd, setTimeEnd] = useState(
    existingDoctor?.availableTimeEnd || '05:30 PM',
  );

  // 5. Conditions & Bio
  const [healthIssues, setHealthIssues] = useState(
    existingDoctor?.healthIssues.join(', ') ||
      'Hypertension, Diabetes Mellitus, Chest Pain & Angina',
  );
  const [bio, setBio] = useState(
    existingDoctor?.bio ||
      'Senior consulting cardiologist with extensive experience in non-invasive cardiology, preventive cardiac checkups, and tele-consultation.',
  );

  // 6. Settlement Bank Details
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50100458923412');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('dr.rajesh@upi');

  // Document Upload & Ethics Declaration
  const [uploadedDoc, setUploadedDoc] = useState('MCI_Council_Registration_Certificate.pdf');
  const [isDeclared, setIsDeclared] = useState(true);

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      if (availableDays.length === 1) {
        Alert.alert('Required', 'Doctor must have at least one working day.');
        return;
      }
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const addCondition = (condition: string) => {
    const list = healthIssues
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!list.includes(condition)) {
      list.push(condition);
      setHealthIssues(list.join(', '));
    }
  };

  const handleRegisterDoctor = () => {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === 'Dr.') {
      Alert.alert('Required Field', 'Please enter doctor full name.');
      return;
    }

    if (!councilRegNumber.trim()) {
      Alert.alert('License Required', 'Please enter Medical Council Registration number.');
      return;
    }

    if (!qualification.trim()) {
      Alert.alert('Required Field', 'Please enter doctor medical qualification degrees.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit primary mobile number.');
      return;
    }

    if (!isDeclared) {
      Alert.alert(
        'Regulatory Declaration',
        'Please confirm adherence to Telemedicine Practice Guidelines and Medical Council ethics.',
      );
      return;
    }

    const issuesArray = healthIssues
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const doctorData: Omit<HospitalDoctor, 'id' | 'hospitalId'> = {
      name: trimmedName,
      photo,
      specialization,
      qualification,
      experience: parseInt(experience, 10) || 10,
      consultationFee: parseInt(consultationFee, 10) || 750,
      onlineConsultationFee: parseInt(onlineFee, 10) || 600,
      healthIssues: issuesArray.length > 0 ? issuesArray : ['General Medical Consultation'],
      slotDurationMinutes: parseInt(slotDuration, 10) || 15,
      availableDays,
      availableTimeStart: timeStart,
      availableTimeEnd: timeEnd,
      blockedDates: existingDoctor?.blockedDates || [],
      councilRegistrationNumber: councilRegNumber.trim(),
      phone: phone.trim(),
      email: email.trim(),
      gender,
      bio: bio.trim(),
    };

    // Save doctor into roster state
    if (isEditing && existingDoctor) {
      updateDoctor(existingDoctor.id, doctorData);
    } else {
      addDoctor(doctorData);
    }

    // Also update provider profile for doctor mode
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

    Alert.alert(
      'Doctor Registration Complete! 🩺',
      `${trimmedName} is successfully registered on OneBuddy Healthcare Network with verified ${medicalCouncil} credentials.`,
      [
        {
          text: 'Open Doctor Section',
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
            <Ionicons name="medkit" size={17} color={colors.doctorBanner} />
            <Text style={styles.headerTitle}>Doctor Registration</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            MCI / SMC Registration • OPD Clinic & Practice Setup
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>Category 2</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Doctor Hero Banner */}
        <Card style={styles.bannerCard} padding="lg">
          <View style={styles.bannerRow}>
            <View style={styles.bannerIconBadge}>
              <Ionicons name="medkit" size={26} color={colors.doctorBanner} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.bannerTitle}>Doctor Practice Portal</Text>
                <View style={styles.doctorTag}>
                  <Text style={styles.doctorTagText}>Clinic & Tele-health</Text>
                </View>
              </View>
              <Text style={styles.bannerSubtitle}>
                Register your specialist clinic, set OPD consultation fees, live video room, home visit radius & digital prescriptions.
              </Text>
            </View>
          </View>
        </Card>

        {/* 1. DOCTOR IDENTITY & AVATAR */}
        <View style={styles.sectionHeader}>
          <Ionicons name="person-circle-outline" size={18} color={colors.doctorBanner} />
          <Text style={styles.sectionTitle}>1. Doctor Identity & Photo</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          {/* Avatar Presets */}
          <Text style={styles.inputLabel}>Doctor Profile Avatar</Text>
          <View style={styles.avatarRow}>
            {DOCTOR_AVATAR_PRESETS.map((preset, idx) => {
              const selected = photo === preset.uri;
              return (
                <Pressable
                  key={idx}
                  style={[styles.avatarChoice, selected && styles.avatarChoiceSelected]}
                  onPress={() => setPhoto(preset.uri)}
                >
                  <Image source={{ uri: preset.uri }} style={styles.avatarImg} />
                  {selected && (
                    <View style={styles.avatarCheckmark}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.doctorBanner} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.inputLabel}>Doctor Full Name *</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Dr. Full Name"
            placeholderTextColor={colors.textMuted}
          />

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Gender</Text>
              <View style={styles.genderRow}>
                {(['Male', 'Female', 'Other'] as const).map((g) => {
                  const active = gender === g;
                  return (
                    <Pressable
                      key={g}
                      style={[styles.genderBtn, active && styles.genderBtnActive]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={[styles.genderBtnText, active && styles.genderBtnTextActive]}>
                        {g}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Primary Mobile *</Text>
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

          <Text style={styles.inputLabel}>Official Practice Email *</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="doctor@onebuddy.health"
            placeholderTextColor={colors.textMuted}
          />
        </Card>

        {/* 2. MEDICAL COUNCIL CREDENTIALS */}
        <View style={styles.sectionHeader}>
          <Ionicons name="ribbon-outline" size={18} color={colors.doctorBanner} />
          <Text style={styles.sectionTitle}>2. Medical Council Credentials & Degrees</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>
            State Medical Council / MCI / NMC Registration Number *
          </Text>
          <TextInput
            style={styles.textInput}
            value={councilRegNumber}
            onChangeText={setCouncilRegNumber}
            placeholder="e.g. MCI-2019-84729"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.inputLabel}>Registration Medical Council *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {MEDICAL_COUNCILS.map((council) => {
              const active = medicalCouncil === council;
              return (
                <Pressable
                  key={council}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  onPress={() => setMedicalCouncil(council)}
                >
                  <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                    {council}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.inputLabel}>Medical Specialization *</Text>
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
            <View style={{ flex: 2, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Qualifications / Degrees *</Text>
              <TextInput
                style={styles.textInput}
                value={qualification}
                onChangeText={setQualification}
                placeholder="MBBS, MD, MS, DM"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>Experience (Yrs)</Text>
              <TextInput
                style={styles.textInput}
                value={experience}
                onChangeText={setExperience}
                keyboardType="number-pad"
                placeholder="10"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* Upload Council Certificate */}
          <View style={styles.docUploadBox}>
            <View style={styles.docUploadIconCircle}>
              <Ionicons name="document-attach" size={20} color={colors.doctorBanner} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.docUploadTitle}>MCI / Council Certificate</Text>
              <Text style={styles.docUploadFilename}>{uploadedDoc}</Text>
            </View>
            <Pressable
              style={styles.uploadBtn}
              onPress={() => {
                Alert.alert(
                  'Upload Registration Proof',
                  'Select registration certificate file from device.',
                  [
                    {
                      text: 'Select PDF File',
                      onPress: () =>
                        setUploadedDoc(`Medical_Council_Reg_${Date.now().toString().slice(-4)}.pdf`),
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

        {/* 3. CLINIC & CONSULTATION FEES */}
        <View style={styles.sectionHeader}>
          <Ionicons name="cash-outline" size={18} color={colors.doctorBanner} />
          <Text style={styles.sectionTitle}>3. Clinic Practice & Consultation Fees</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>Clinic / Chamber Name</Text>
          <TextInput
            style={styles.textInput}
            value={clinicName}
            onChangeText={setClinicName}
            placeholder="Clinic / Chamber Name"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.inputLabel}>Clinic Address</Text>
          <TextInput
            style={styles.textInput}
            value={clinicAddress}
            onChangeText={setClinicAddress}
            placeholder="Clinic address & area"
            placeholderTextColor={colors.textMuted}
          />

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.xs }}>
              <Text style={styles.inputLabel} numberOfLines={1}>OPD Fee (₹)</Text>
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

          {/* Slot Duration */}
          <Text style={styles.inputLabel}>Patient Consultation Slot Duration</Text>
          <View style={styles.slotRow}>
            {['15', '20', '30'].map((mins) => {
              const active = slotDuration === mins;
              return (
                <Pressable
                  key={mins}
                  style={[styles.slotBtn, active && styles.slotBtnActive]}
                  onPress={() => setSlotDuration(mins)}
                >
                  <Text style={[styles.slotBtnText, active && styles.slotBtnTextActive]}>
                    {mins} Minutes
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* 4. OPD SCHEDULE & WORKING DAYS */}
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar-outline" size={18} color={colors.doctorBanner} />
          <Text style={styles.sectionTitle}>4. Weekly OPD Schedule & Practice Hours</Text>
        </View>

        <Card style={styles.formCard} padding="lg">
          <Text style={styles.inputLabel}>Weekly Practice Days (Tap to toggle)</Text>
          <View style={styles.daysRow}>
            {DAYS_OF_WEEK.map((day) => {
              const active = availableDays.includes(day);
              return (
                <Pressable
                  key={day}
                  style={[styles.dayCircle, active && styles.dayCircleActive]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[styles.dayCircleText, active && styles.dayCircleTextActive]}>
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.inputRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>OPD Starts</Text>
              <TextInput
                style={styles.textInput}
                value={timeStart}
                onChangeText={setTimeStart}
                placeholder="09:00 AM"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.inputLabel} numberOfLines={1}>OPD Ends</Text>
              <TextInput
                style={styles.textInput}
                value={timeEnd}
                onChangeText={setTimeEnd}
                placeholder="05:30 PM"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* Conditions Treated */}
          <Text style={[styles.inputLabel, { marginTop: spacing.xs }]}>
            Symptoms & Conditions Treated (Quick chips)
          </Text>
          <View style={styles.conditionsWrap}>
            {COMMON_CONDITIONS.map((cond) => {
              const added = healthIssues.includes(cond);
              return (
                <Pressable
                  key={cond}
                  style={[styles.conditionChip, added && styles.conditionChipAdded]}
                  onPress={() => addCondition(cond)}
                >
                  <Ionicons
                    name={added ? 'checkmark' : 'add'}
                    size={13}
                    color={added ? colors.doctorBanner : colors.textMuted}
                  />
                  <Text style={[styles.conditionChipText, added && styles.conditionChipTextAdded]}>
                    {cond}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>Doctor Bio & Clinical Summary</Text>
          <TextInput
            style={[styles.textInput, { height: 75, textAlignVertical: 'top' }]}
            value={bio}
            onChangeText={setBio}
            multiline
            placeholder="Summary of experience, research, clinical achievements..."
            placeholderTextColor={colors.textMuted}
          />
        </Card>

        {/* 5. SETTLEMENT BANK ACCOUNT */}
        <View style={styles.sectionHeader}>
          <Ionicons name="card-outline" size={18} color={colors.doctorBanner} />
          <Text style={styles.sectionTitle}>5. Doctor Consultation Payouts Account</Text>
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

          <Text style={styles.inputLabel}>Direct UPI ID (Instant Patient Fee Settlement)</Text>
          <TextInput
            style={styles.textInput}
            value={upiId}
            onChangeText={setUpiId}
            autoCapitalize="none"
            placeholder="doctor@upi"
            placeholderTextColor={colors.textMuted}
          />
        </Card>

        {/* 6. TELEMEDICINE & MEDICAL ETHICS DECLARATION */}
        <Card style={styles.declarationCard} padding="md">
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setIsDeclared(!isDeclared)}
            accessibilityLabel="Agree to Telemedicine Guidelines"
          >
            <View
              style={[
                styles.checkboxBox,
                isDeclared && {
                  backgroundColor: colors.doctorBanner,
                  borderColor: colors.doctorBanner,
                },
              ]}
            >
              {isDeclared && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
            </View>
            <Text style={styles.declarationText}>
              I declare that I am a Registered Medical Practitioner (RMP) under the National
              Medical Commission Act / State Medical Council. I agree to abide by the Indian
              Telemedicine Practice Guidelines 2020 and OneBuddy digital prescription standards.
            </Text>
          </Pressable>
        </Card>

        {/* Primary Action Button */}
        <Pressable
          style={styles.submitBtn}
          onPress={handleRegisterDoctor}
          accessibilityLabel="Save Doctor Registration"
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>
            {isEditing ? 'Update Doctor Registration' : 'Register Doctor & Activate Practice'}
          </Text>
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
    backgroundColor: colors.medicalBlueLight,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.doctorBanner,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  bannerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: `${colors.doctorBanner}40`,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconBadge: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.medicalBlueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  doctorTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.medicalBlueLight,
  },
  doctorTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.doctorBanner,
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
  avatarRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.md,
  },
  avatarChoice: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarChoiceSelected: {
    borderColor: colors.doctorBanner,
    borderWidth: 3,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: radius.full,
  },
  avatarCheckmark: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.full,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 6,
    height: 44,
    marginBottom: spacing.md,
  },
  genderBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderBtnActive: {
    backgroundColor: colors.medicalBlueLight,
    borderColor: colors.doctorBanner,
  },
  genderBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  genderBtnTextActive: {
    color: colors.doctorBanner,
    fontWeight: '800',
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
    backgroundColor: colors.medicalBlueLight,
    borderColor: colors.doctorBanner,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeChipTextActive: {
    color: colors.doctorBanner,
    fontWeight: '800',
  },
  slotRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.sm,
  },
  slotBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  slotBtnActive: {
    backgroundColor: colors.medicalBlueLight,
    borderColor: colors.doctorBanner,
  },
  slotBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  slotBtnTextActive: {
    color: colors.doctorBanner,
    fontWeight: '800',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleActive: {
    backgroundColor: colors.doctorBanner,
    borderColor: colors.doctorBanner,
  },
  dayCircleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  dayCircleTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  conditionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
    marginBottom: spacing.xs,
  },
  conditionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  conditionChipAdded: {
    backgroundColor: colors.medicalBlueLight,
    borderColor: colors.doctorBanner,
  },
  conditionChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  conditionChipTextAdded: {
    color: colors.doctorBanner,
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
    backgroundColor: colors.medicalBlueLight,
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
    color: colors.doctorBanner,
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
    backgroundColor: colors.doctorBanner,
    shadowColor: colors.doctorBanner,
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
