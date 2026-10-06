import React, { useEffect, useState } from 'react';
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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/types';

type LiveMeetingRouteProp = RouteProp<RootStackParamList, 'LiveMeeting'>;

export default function LiveMeetingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<LiveMeetingRouteProp>();
  const { consultation } = route.params;
  const { uploadPrescription, updateConsultationStatus } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callSeconds, setCallSeconds] = useState(45);
  const [showRxSheet, setShowRxSheet] = useState(false);

  // Digital Prescription form
  const [diagnosis, setDiagnosis] = useState('Acute Upper Respiratory Tract Infection & Mild Pharyngitis');
  const [notes, setNotes] = useState('Patient reported 3 days of sore throat, low-grade fever and dry cough. No respiratory distress. Throat shows mild erythematous congestion.');
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState('76 bpm');
  const [temp, setTemp] = useState('98.8°F');
  const [med1, setMed1] = useState('Augmentin 625 Duo (625mg) - 1-0-1 for 5 days');
  const [med2, setMed2] = useState('Paracetamol 650mg - 1-0-1 as needed');
  const [med3, setMed3] = useState('Levocetirizine 5mg - 0-0-1 at bedtime');

  useEffect(() => {
    const timer = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinishAndPrescribe = () => {
    uploadPrescription(consultation.id, {
      patientName: consultation.patientName,
      doctorName: 'Dr. Vikram Sengupta, MD',
      diagnosis,
      vitals: { bp, pulse, temp },
      medicines: [
        {
          id: 'med-1',
          name: 'Augmentin 625 Duo',
          dosage: '625 mg',
          frequency: '1-0-1',
          timing: 'After food',
          duration: '5 days',
        },
        {
          id: 'med-2',
          name: 'Paracetamol 650mg',
          dosage: '650 mg',
          frequency: '1-0-1 (SOS)',
          timing: 'After food',
          duration: '3 days',
        },
        {
          id: 'med-3',
          name: 'Levocetirizine 5mg',
          dosage: '5 mg',
          frequency: '0-0-1',
          timing: 'Before sleep',
          duration: '5 days',
        },
      ],
      advice: notes,
      followUpDate: '2026-10-07',
    });

    updateConsultationStatus(consultation.id, 'completed', notes);

    Alert.alert(
      'Consultation Completed & Rx Sent!',
      `Digital prescription generated and dispatched to ${consultation.patientName} via One Buddy App, Mail, and WhatsApp. Net payout of ₹${consultation.netPayout} settled.`,
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Video Call Header */}
      <View style={styles.callHeader}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Main');
            }
          }}
          accessibilityLabel="Back"
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </Pressable>

        <View style={styles.secureBadge}>
          <Ionicons name="lock-closed" size={12} color={colors.success} />
          <Text style={styles.secureText}>Encrypted Telehealth</Text>
        </View>

        <View style={styles.timerBadge}>
          <View style={styles.recordingDot} />
          <Text style={styles.timerText}>{formatTimer(callSeconds)}</Text>
        </View>
      </View>

      {/* Main Video View (Simulated Video Consultation) */}
      <View style={styles.videoStage}>
        {/* Remote Patient Video Feed */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.patientVideoFeed}
          resizeMode="cover"
        />

        {/* Patient Name Overlay */}
        <View style={styles.patientOverlay}>
          <Text style={styles.patientOverlayName}>{consultation.patientName}</Text>
          <Text style={styles.patientOverlaySub}>
            {consultation.patientGender}, {consultation.patientAge} yrs • Problem: {consultation.problemDescription}
          </Text>
        </View>

        {/* Doctor Self-View PIP (Picture in Picture) */}
        <View style={styles.pipView}>
          {!isVideoOff ? (
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.pipImage}
            />
          ) : (
            <View style={styles.pipVideoOff}>
              <Ionicons name="videocam-off" size={24} color="#FFFFFF" />
            </View>
          )}
          <View style={styles.pipLabel}>
            <Text style={styles.pipText}>You (Doctor)</Text>
          </View>
        </View>
      </View>

      {/* Floating Bottom Drawer: Digital Prescription Quick Access */}
      {showRxSheet ? (
        <View style={styles.rxSheetContainer}>
          <View style={styles.rxSheetHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="document-text" size={18} color={colors.primary} />
              <Text style={styles.rxSheetTitle}>Live Prescription & Clinical Notes</Text>
            </View>
            <Pressable onPress={() => setShowRxSheet(false)}>
              <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.rxFormScroll} showsVerticalScrollIndicator={false}>
            {/* Vitals row */}
            <View style={styles.vitalsRow}>
              <View style={styles.vitalField}>
                <Text style={styles.fieldLabel}>BP</Text>
                <TextInput style={styles.miniInput} value={bp} onChangeText={setBp} />
              </View>
              <View style={styles.vitalField}>
                <Text style={styles.fieldLabel}>Pulse</Text>
                <TextInput style={styles.miniInput} value={pulse} onChangeText={setPulse} />
              </View>
              <View style={styles.vitalField}>
                <Text style={styles.fieldLabel}>Temp</Text>
                <TextInput style={styles.miniInput} value={temp} onChangeText={setTemp} />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Clinical Diagnosis</Text>
            <TextInput style={styles.inputBox} value={diagnosis} onChangeText={setDiagnosis} />

            <Text style={styles.fieldLabel}>Prescribed Medicines</Text>
            <TextInput style={styles.inputBox} value={med1} onChangeText={setMed1} />
            <TextInput style={styles.inputBox} value={med2} onChangeText={setMed2} />
            <TextInput style={styles.inputBox} value={med3} onChangeText={setMed3} />

            <Text style={styles.fieldLabel}>Doctor Advice & Dietary Guidelines</Text>
            <TextInput
              style={[styles.inputBox, { height: 60, textAlignVertical: 'top' }]}
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <Pressable
              style={styles.finishCallBtn}
              onPress={handleFinishAndPrescribe}
            >
              <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" />
              <Text style={styles.finishCallBtnText}>Complete Consult & Dispatch Rx</Text>
            </Pressable>
          </ScrollView>
        </View>
      ) : null}

      {/* Call Controls Bar */}
      <View style={styles.controlsBar}>
        <Pressable
          style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Ionicons
            name={isMuted ? 'mic-off' : 'mic'}
            size={22}
            color={isMuted ? '#FFFFFF' : colors.text}
          />
          <Text style={[styles.controlLabel, isMuted && { color: '#FFFFFF' }]}>
            {isMuted ? 'Muted' : 'Mute'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.controlBtn, isVideoOff && styles.controlBtnActive]}
          onPress={() => setIsVideoOff(!isVideoOff)}
        >
          <Ionicons
            name={isVideoOff ? 'videocam-off' : 'videocam'}
            size={22}
            color={isVideoOff ? '#FFFFFF' : colors.text}
          />
          <Text style={[styles.controlLabel, isVideoOff && { color: '#FFFFFF' }]}>
            {isVideoOff ? 'Cam Off' : 'Camera'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.controlBtn, showRxSheet && { backgroundColor: colors.primaryLight }]}
          onPress={() => setShowRxSheet(!showRxSheet)}
        >
          <Ionicons
            name="document-text"
            size={22}
            color={showRxSheet ? colors.primaryDark : colors.primary}
          />
          <Text style={[styles.controlLabel, { color: colors.primaryDark }]}>
            Write Rx
          </Text>
        </Pressable>

        <Pressable
          style={styles.endCallBtn}
          onPress={() => {
            Alert.alert(
              'End Video Consultation',
              'Would you like to complete the consult and write the digital prescription now?',
              [
                { text: 'Cancel' },
                {
                  text: 'Write Prescription',
                  onPress: () => setShowRxSheet(true),
                },
                {
                  text: 'End Call Only',
                  style: 'destructive',
                  onPress: () => {
                    updateConsultationStatus(consultation.id, 'completed');
                    navigation.goBack();
                  },
                },
              ],
            );
          }}
        >
          <Ionicons name="call" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  callHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  secureText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  backBtn: {
    padding: 6,
  },
  videoStage: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000000',
  },
  patientVideoFeed: {
    width: '100%',
    height: '100%',
  },
  patientOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
    maxWidth: '65%',
  },
  patientOverlayName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  patientOverlaySub: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 2,
  },
  pipView: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    width: 110,
    height: 155,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  pipImage: {
    width: '100%',
    height: '100%',
  },
  pipVideoOff: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
  },
  pipLabel: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  pipText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rxSheetContainer: {
    position: 'absolute',
    bottom: 90,
    left: 12,
    right: 12,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.md,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  rxSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rxSheetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  rxFormScroll: {
    marginVertical: 4,
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  vitalField: {
    flex: 1,
  },
  miniInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.background,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.background,
    marginVertical: 2,
  },
  finishCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: radius.md,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  finishCallBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E293B',
  },
  controlBtnActive: {
    backgroundColor: colors.danger,
  },
  controlLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2,
  },
  endCallBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});
