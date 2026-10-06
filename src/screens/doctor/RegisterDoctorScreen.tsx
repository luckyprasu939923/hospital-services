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
  'Gynecology',
  'ENT Specialist',
  'Psychiatry',
  'Pulmonology',
  'Gastroenterology',
  'Ophthalmology',
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

const COMMON_SYMPTOMS = [
  'Fever & Cough',
  'Diabetes',
  'Hypertension',
  'Chest Pain',
  'Joint Pain',
  'Skin Allergies',
  'Asthma',
  'Headache & Migraine',
  'Thyroid',
  'Acidity & GERD',
];

type RegisterDoctorRouteProp = RouteProp<RootStackParamList, 'RegisterDoctor'>;

export default function RegisterDoctorScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RegisterDoctorRouteProp>();
  const { addDoctor, updateDoctor, provider } = useApp();

  const existingDoctor = route.params?.doctor;
  const isEditing = Boolean(existingDoctor);

  // Form State
  const [name, setName] = useState(existingDoctor?.name || 'Dr. ');
  const [photo, setPhoto] = useState(
    existingDoctor?.photo || DOCTOR_AVATAR_PRESETS[0].uri,
  );
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(
    existingDoctor?.gender || 'Male',
  );
  const [phone, setPhone] = useState(existingDoctor?.phone || '9876543210');
  const [email, setEmail] = useState(
    existingDoctor?.email || 'doctor.care@onebuddy.health',
  );

  // Credentials
  const [councilRegNumber, setCouncilRegNumber] = useState(
    existingDoctor?.councilRegistrationNumber || 'MCI-2019-84729',
  );
  const [specialization, setSpecialization] = useState(
    existingDoctor?.specialization || 'Cardiology',
  );
  const [qualification, setQualification] = useState(
    existingDoctor?.qualification || 'MBBS, MD (General Medicine)',
  );
  const [experience, setExperience] = useState(
    String(existingDoctor?.experience || '10'),
  );

  // Practice Timings & Fees
  const [consultationFee, setConsultationFee] = useState(
    String(existingDoctor?.consultationFee || '750'),
  );
  const [onlineFee, setOnlineFee] = useState(
    String(existingDoctor?.onlineConsultationFee || '600'),
  );
  const [slotDuration, setSlotDuration] = useState(
    String(existingDoctor?.slotDurationMinutes || '15'),
  );
  const [availableDays, setAvailableDays] = useState<string[]>(
    existingDoctor?.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  );
  const [timeStart, setTimeStart] = useState(
    existingDoctor?.availableTimeStart || '09:00 AM',
  );
  const [timeEnd, setTimeEnd] = useState(
    existingDoctor?.availableTimeEnd || '05:00 PM',
  );

  // Clinical Issues & Bio
  const [healthIssues, setHealthIssues] = useState(
    existingDoctor?.healthIssues.join(', ') ||
      'Hypertension, Heart Disease, Chest Pain, Arrhythmia',
  );
  const [bio, setBio] = useState(
    existingDoctor?.bio ||
      'Experienced medical specialist dedicated to evidence-based healthcare and patient wellness.',
  );

  // Regulatory Declaration
  const [declared, setDeclared] = useState(true);

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

  const addSymptom = (symptom: string) => {
    const list = healthIssues
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!list.includes(symptom)) {
      list.push(symptom);
      setHealthIssues(list.join(', '));
    }
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === 'Dr.') {
      Alert.alert('Required Field', 'Please enter doctor full name.');
      return;
    }

    if (!councilRegNumber.trim()) {
      Alert.alert(
        'Required Field',
        'Please enter Medical Council Registration number.',
      );
      return;
    }

    if (!qualification.trim()) {
      Alert.alert('Required Field', 'Please enter doctor qualification degrees.');
      return;
    }

    if (!declared) {
      Alert.alert(
        'Regulatory Declaration',
        'Please verify that doctor credentials and registration details are authentic.',
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
      experience: parseInt(experience, 10) || 5,
      consultationFee: parseInt(consultationFee, 10) || 500,
      onlineConsultationFee: parseInt(onlineFee, 10) || 450,
      healthIssues:
        issuesArray.length > 0 ? issuesArray : ['General Consultation'],
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

    if (isEditing && existingDoctor) {
      updateDoctor(existingDoctor.id, doctorData);
      Alert.alert(
        'Doctor Profile Updated',
        `${trimmedName}'s credentials, fees and schedule have been updated.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } else {
      addDoctor(doctorData);
      Alert.alert(
        'Doctor Successfully Registered',
        `${trimmedName} has been registered to the medical provider roster with license verification.`,
        [{ text: 'View Doctor Roster', onPress: () => navigation.goBack() }],
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top Header with Back Navigation */}
      <View style={styles.topHeader}>
        <Pressable
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back to Previous Screen"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Doctor Profile' : 'Register Doctor'}
          </Text>
          <Text style={styles.headerSubtitle}>
            Medical practitioner registration, license & schedule
          </Text>
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
          <Text style={styles.verifiedBadgeText}>MCI VERIFIED</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: Personal & Profile Photo */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="person-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionHeading}>1. Personal & Contact Details</Text>
          </View>

          {/* Avatar Preview & Preset Selection */}
          <View style={styles.avatarRow}>
            <Image source={{ uri: photo }} style={styles.avatarPreview} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.avatarPickerLabel}>Select Doctor Photo Preset:</Text>
              <View style={styles.presetsWrap}>
                {DOCTOR_AVATAR_PRESETS.map((preset, index) => {
                  const active = photo === preset.uri;
                  return (
                    <Pressable
                      key={index}
                      style={[
                        styles.presetChip,
                        active && styles.presetChipActive,
                      ]}
                      onPress={() => setPhoto(preset.uri)}
                    >
                      <Image source={{ uri: preset.uri }} style={styles.presetMiniImg} />
                      <Text
                        style={[
                          styles.presetChipText,
                          active && styles.presetChipTextActive,
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Full Name */}
          <Text style={styles.inputLabel}>Doctor Full Name *</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Dr. Ramesh Gupta"
            placeholderTextColor={colors.textMuted}
          />

          {/* Gender Pills */}
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.pillsRow}>
            {(['Male', 'Female', 'Other'] as const).map((g) => (
              <Pressable
                key={g}
                style={[
                  styles.selectorPill,
                  gender === g && styles.selectorPillActive,
                ]}
                onPress={() => setGender(g)}
              >
                <Text
                  style={[
                    styles.selectorPillText,
                    gender === g && styles.selectorPillTextActive,
                  ]}
                >
                  {g}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Contact Row */}
          <View style={styles.dualInputRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Mobile Phone</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit phone"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Official Email</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholder="dr.name@hospital.com"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        </Card>

        {/* SECTION 2: Medical Credentials & License */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="ribbon-outline" size={18} color={colors.hospitalRed} />
            <Text style={styles.sectionHeading}>
              2. Medical Credentials & Council Registration
            </Text>
          </View>

          {/* Council Reg Number */}
          <Text style={styles.inputLabel}>State Medical Council / MCI Reg No. *</Text>
          <View style={styles.regInputWrap}>
            <Ionicons name="document-text" size={17} color={colors.hospitalRed} />
            <TextInput
              style={styles.regTextInput}
              value={councilRegNumber}
              onChangeText={setCouncilRegNumber}
              placeholder="e.g. MCI-2018-84291 or SMC/DL/5491"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
            />
          </View>

          {/* Specialization Selection */}
          <Text style={styles.inputLabel}>Primary Clinical Specialization *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specScroll}
          >
            {SPECIALIZATIONS.map((spec) => {
              const active = specialization === spec;
              return (
                <Pressable
                  key={spec}
                  style={[
                    styles.specChip,
                    active && styles.specChipActive,
                  ]}
                  onPress={() => setSpecialization(spec)}
                >
                  <Text
                    style={[
                      styles.specChipText,
                      active && styles.specChipTextActive,
                    ]}
                  >
                    {spec}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Qualifications & Experience */}
          <View style={styles.dualInputRow}>
            <View style={{ flex: 2 }}>
              <Text style={styles.inputLabel}>Degree / Qualifications *</Text>
              <TextInput
                style={styles.textInput}
                value={qualification}
                onChangeText={setQualification}
                placeholder="e.g. MBBS, MD (Cardio), DNB"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Experience (Yrs)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={experience}
                onChangeText={setExperience}
                placeholder="e.g. 12"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        </Card>

        {/* SECTION 3: Consultation Pricing & Timings */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="time-outline" size={18} color={colors.medicalBlue} />
            <Text style={styles.sectionHeading}>3. Practice Fees & OPD Hours</Text>
          </View>

          {/* Fees Row */}
          <View style={styles.dualInputRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>In-Person OPD Fee (₹)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={consultationFee}
                onChangeText={setConsultationFee}
                placeholder="e.g. 750"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Online Video Fee (₹)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={onlineFee}
                onChangeText={setOnlineFee}
                placeholder="e.g. 600"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          {/* Slot Duration */}
          <Text style={styles.inputLabel}>Consultation Slot Duration</Text>
          <View style={styles.pillsRow}>
            {['10', '15', '20', '30'].map((mins) => (
              <Pressable
                key={mins}
                style={[
                  styles.selectorPill,
                  slotDuration === mins && styles.selectorPillActive,
                ]}
                onPress={() => setSlotDuration(mins)}
              >
                <Text
                  style={[
                    styles.selectorPillText,
                    slotDuration === mins && styles.selectorPillTextActive,
                  ]}
                >
                  {mins} Mins
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Available Working Days */}
          <Text style={styles.inputLabel}>Available Practice Days</Text>
          <View style={styles.daysRow}>
            {DAYS_OF_WEEK.map((d) => {
              const active = availableDays.includes(d);
              return (
                <Pressable
                  key={d}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                  onPress={() => toggleDay(d)}
                >
                  <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Timings */}
          <View style={styles.dualInputRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>OPD Start Time</Text>
              <TextInput
                style={styles.textInput}
                value={timeStart}
                onChangeText={setTimeStart}
                placeholder="09:00 AM"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>OPD End Time</Text>
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

        {/* SECTION 4: Clinical Symptoms & Doctor Bio */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="medkit-outline" size={18} color={colors.purple} />
            <Text style={styles.sectionHeading}>4. Symptoms & Clinical Expertise</Text>
          </View>

          <Text style={styles.inputLabel}>Quick Add Common Conditions:</Text>
          <View style={styles.symptomsWrap}>
            {COMMON_SYMPTOMS.map((sym, idx) => (
              <Pressable
                key={idx}
                style={styles.symptomAddChip}
                onPress={() => addSymptom(sym)}
              >
                <Ionicons name="add" size={13} color={colors.primary} />
                <Text style={styles.symptomAddText}>{sym}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.inputLabel}>
            Symptoms & Conditions Handled (Comma Separated) *
          </Text>
          <TextInput
            style={[styles.textInput, { minHeight: 60 }]}
            multiline
            numberOfLines={2}
            value={healthIssues}
            onChangeText={setHealthIssues}
            placeholder="e.g. Hypertension, Arrhythmia, Angina, High Cholesterol"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.inputLabel}>Doctor Biography / Profile Summary</Text>
          <TextInput
            style={[styles.textInput, { minHeight: 65 }]}
            multiline
            numberOfLines={3}
            value={bio}
            onChangeText={setBio}
            placeholder="Write short professional bio, medical research, or affiliations..."
            placeholderTextColor={colors.textMuted}
          />
        </Card>

        {/* SECTION 5: Verification & Legal Declaration */}
        <Card style={styles.sectionCard} padding="md">
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionHeading}>5. Document Verification & Declaration</Text>
          </View>

          <View style={styles.docUploadBox}>
            <View style={styles.docUploadLeft}>
              <Ionicons name="document-attach" size={24} color={colors.primary} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.docTitle}>Medical Council Certificate / Degree</Text>
                <Text style={styles.docSub}>PDF/JPG • Document Verified</Text>
              </View>
            </View>
            <View style={styles.uploadedPill}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.uploadedPillText}>VERIFIED</Text>
            </View>
          </View>

          <Pressable
            style={styles.declarationRow}
            onPress={() => setDeclared(!declared)}
          >
            <Switch
              value={declared}
              onValueChange={setDeclared}
              trackColor={{ false: colors.borderLight, true: colors.primaryLight }}
              thumbColor={declared ? colors.primary : colors.textMuted}
            />
            <Text style={styles.declarationText}>
              I certify that this medical practitioner holds an active license with the State
              Medical Council / NMC and is certified to practice healthcare.
            </Text>
          </Pressable>
        </Card>

        {/* Action Submit Button */}
        <Pressable
          style={styles.submitBtn}
          onPress={handleSubmit}
          accessibilityLabel={isEditing ? 'Save Doctor Changes' : 'Register Doctor to Roster'}
        >
          <Ionicons
            name={isEditing ? 'save-outline' : 'person-add'}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.submitBtnText}>
            {isEditing ? 'Save Doctor Changes' : 'Register Doctor to Roster'}
          </Text>
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
    paddingHorizontal: 16,
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  sectionCard: {
    padding: spacing.md,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: colors.text,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatarPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.borderLight,
  },
  avatarPickerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  presetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 4,
  },
  presetChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  presetMiniImg: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  presetChipText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  presetChipTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.text,
    backgroundColor: colors.background,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  selectorPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  selectorPillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  selectorPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  selectorPillTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  dualInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  regInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    gap: 8,
  },
  regTextInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: 8,
  },
  specScroll: {
    gap: 6,
    paddingVertical: 4,
  },
  specChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  specChipActive: {
    backgroundColor: colors.hospitalRedLight,
    borderColor: colors.hospitalRed,
  },
  specChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  specChipTextActive: {
    color: colors.hospitalRed,
    fontWeight: '800',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dayChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dayChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  dayChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  dayChipTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  symptomsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  symptomAddChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  symptomAddText: {
    fontSize: 10.5,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  docUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 10,
    marginBottom: spacing.sm,
  },
  docUploadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  docSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  uploadedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  uploadedPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.success,
  },
  declarationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  declarationText: {
    flex: 1,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: radius.lg,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 6,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
