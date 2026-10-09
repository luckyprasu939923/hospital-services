import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '../../theme/colors';
import Card from '../../components/Card';
import { RootStackParamList } from '../../navigation/types';

const REGISTRATION_CATEGORIES = [
  {
    id: 'hospital' as const,
    title: '1. Hospital Registration',
    badge: 'Super Speciality • Inpatient',
    subtitle: 'Clinical Establishment Act (CEA), bed strength, ICU suites, OT & 24x7 emergency setup',
    features: ['180 Total Beds', '24 ICU Beds', '6 OT Surgical Suites'],
    icon: 'business' as const,
    color: '#0094D4',
    lightBg: '#E6F6FC',
    borderColor: '#BAE6F9',
    route: 'HospitalRegistration' as const,
    btnText: 'Register Hospital Facility',
  },
  {
    id: 'doctor' as const,
    title: '2. Doctor Registration',
    badge: 'Specialist Clinic • OPD',
    subtitle: 'MCI / State Medical Council reg, OPD clinic practice, video consults & home visit care',
    features: ['Council Verification', 'OPD Practice', 'Teleconsultations'],
    icon: 'medkit' as const,
    color: '#2563EB',
    lightBg: '#EFF6FF',
    borderColor: '#BFDBFE',
    route: 'DoctorRegistration' as const,
    btnText: 'Register Doctor Practice',
  },
  {
    id: 'pharmacy' as const,
    title: '3. Pharmacy Registration',
    badge: 'Drug Retail • Form 20/21',
    subtitle: 'Drug Retail License Form 20 & 21, cold chain 2-8°C storage & registered pharmacist in-charge',
    features: ['Form 20/21 License', 'Cold Chain Storage', 'Home Delivery'],
    icon: 'flask' as const,
    color: '#0D9488',
    lightBg: '#F0FDFA',
    borderColor: '#99F6E4',
    route: 'PharmacyRegistration' as const,
    btnText: 'Register Pharmacy Store',
  },
];

export default function AuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Executive Header - Themed directly after OneBuddy brand */}
        <View style={styles.brandHeader}>
          <View style={styles.logoHalo}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandOne}>One</Text>
            <Text style={styles.brandBuddy}>Buddy</Text>
            <Text style={styles.brandMedical}> Medical</Text>
          </View>
          <View style={styles.taglineRow}>
            <Text style={styles.taglineMuted}>One App. Many Services. </Text>
            <Text style={styles.taglineHighlight}>One Buddy.</Text>
          </View>
          <Text style={styles.brandSubtitle}>
            Healthcare Service Provider Portal (Hospital • Doctor • Pharmacy)
          </Text>
          <View style={styles.taglinePill}>
            <Ionicons name="shield-checkmark" size={13} color="#16A34A" />
            <Text style={styles.taglineText}>Govt & Clinical Establishment Act Compliant</Text>
          </View>
        </View>

        {/* Category Registration Section Title */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Select Healthcare Category to Register</Text>
            <Text style={styles.sectionSubtitle}>
              Direct step-by-step registration for your medical facility or practice
            </Text>
          </View>
        </View>

        {/* 3 Dedicated Category Registration Cards */}
        <View style={styles.categoryCardsList}>
          {REGISTRATION_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryCard,
                { borderColor: cat.borderColor, shadowColor: cat.color },
              ]}
              onPress={() => navigation.navigate(cat.route as any)}
              accessibilityRole="button"
              accessibilityLabel={`Register ${cat.title}`}
              hitSlop={8}
            >
              <View style={styles.cardHeaderRow}>
                <View style={[styles.cardIconWrap, { backgroundColor: cat.lightBg }]}>
                  <Ionicons name={cat.icon} size={24} color={cat.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{cat.title}</Text>
                    <View style={[styles.badgePill, { backgroundColor: cat.lightBg }]}>
                      <Text style={[styles.badgeText, { color: cat.color }]}>
                        {cat.badge}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardSubtitle}>{cat.subtitle}</Text>
                </View>
              </View>

              {/* Feature Highlights */}
              <View style={styles.featureChipsRow}>
                {cat.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureChip}>
                    <View style={[styles.featureDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.featureChipText}>{feat}</Text>
                  </View>
                ))}
              </View>

              {/* Action Button */}
              <View
                style={[styles.registerActionBtn, { backgroundColor: cat.color }]}
              >
                <Text style={styles.registerActionBtnText}>{cat.btnText}</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Already Registered / Live Operations Access */}
        <Card style={styles.alreadyRegisteredCard} padding="lg">
          <View style={styles.alreadyRegisteredHeader}>
            <View style={styles.alreadyRegisteredIconWrap}>
              <Ionicons name="speedometer" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.alreadyRegisteredTitle}>Already Registered Healthcare Provider?</Text>
              <Text style={styles.alreadyRegisteredSub}>
                Enter the live operations dashboard to manage bookings, emergency beds, patient appointments & payouts.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.enterLiveOpsBtn}
            onPress={() => navigation.navigate('Main', { screen: 'Home' } as any)}
            accessibilityLabel="Enter Live Operations Dashboard"
            hitSlop={8}
          >
            <Ionicons name="pulse" size={16} color="#FFFFFF" />
            <Text style={styles.enterLiveOpsBtnText}>Enter Live Operations Dashboard</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#E2F7C9',
    shadowColor: '#5AB31C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
  logoHalo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
    shadowColor: '#5AB31C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  logoImg: {
    width: 58,
    height: 58,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandOne: {
    fontSize: 27,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.5,
  },
  brandBuddy: {
    fontSize: 27,
    fontWeight: '900',
    color: '#5AB31C',
    letterSpacing: -0.5,
  },
  brandMedical: {
    fontSize: 27,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: -0.5,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  taglineMuted: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  taglineHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5AB31C',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 320,
  },
  taglinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  taglineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  sectionHeaderRow: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  categoryCardsList: {
    gap: 12,
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    padding: spacing.lg,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },
  featureChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
    marginBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    gap: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  featureChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  registerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.md,
    marginTop: 4,
  },
  registerActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  alreadyRegisteredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  alreadyRegisteredHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alreadyRegisteredIconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alreadyRegisteredTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  alreadyRegisteredSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  enterLiveOpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#5AB31C',
    paddingVertical: 13,
    borderRadius: radius.full,
    shadowColor: '#5AB31C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  enterLiveOpsBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
