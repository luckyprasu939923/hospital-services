import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, spacing } from '../../theme/colors';
import { RootStackParamList, TabParamList } from '../../navigation/types';
import { ProviderType } from '../../types';
import HospitalRegistrationScreen from '../hospital/HospitalRegistrationScreen';
import DoctorRegistrationScreen from '../doctor/DoctorRegistrationScreen';
import PharmacyRegistrationScreen from '../pharmacy/PharmacyRegistrationScreen';

type RegistrationPortalRouteProp = RouteProp<TabParamList, 'Register'>;

const CATEGORIES: {
  id: ProviderType;
  title: string;
  badge: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  lightBg: string;
  borderColor: string;
  stackRoute: 'HospitalRegistration' | 'DoctorRegistration' | 'PharmacyRegistration';
}[] = [
  {
    id: 'hospital',
    title: 'Hospital',
    badge: 'Super Speciality',
    icon: 'business',
    color: '#0094D4',
    lightBg: '#E6F6FC',
    borderColor: '#BAE6F9',
    stackRoute: 'HospitalRegistration',
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy',
    badge: 'Form 20/21',
    icon: 'flask',
    color: '#0D9488',
    lightBg: '#F0FDFA',
    borderColor: '#99F6E4',
    stackRoute: 'PharmacyRegistration',
  },
  {
    id: 'doctor',
    title: 'Doctor',
    badge: 'Specialist Clinic',
    icon: 'medkit',
    color: '#2563EB',
    lightBg: '#EFF6FF',
    borderColor: '#BFDBFE',
    stackRoute: 'DoctorRegistration',
  },
];

export default function RegistrationPortalScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList> & BottomTabNavigationProp<TabParamList>>();
  const route = useRoute<RegistrationPortalRouteProp>();

  const [activeCategory, setActiveCategory] = useState<ProviderType>(
    route.params?.category || 'hospital',
  );

  const activeCategoryConfig =
    CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* 1. Clinical Executive Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.brandBadge}>
            <Ionicons name="medical" size={18} color="#FFFFFF" />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.headerTitle}>Provider Registration</Text>
              <View style={[styles.categoryBadge, { backgroundColor: activeCategoryConfig.lightBg }]}>
                <Text style={[styles.categoryBadgeText, { color: activeCategoryConfig.color }]}>
                  {activeCategoryConfig.badge}
                </Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>
              Initial Setup • Direct Category Access (No Signout Needed)
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Direct Category Selector Bar */}
      <View style={styles.categorySelectorBar}>
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryTabBtn,
                isSelected && {
                  backgroundColor: cat.lightBg,
                  borderColor: cat.color,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setActiveCategory(cat.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Select ${cat.title} Registration`}
              hitSlop={8}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={isSelected ? cat.color : '#64748B'}
              />
              <Text
                style={[
                  styles.categoryTabBtnText,
                  isSelected && { color: cat.color, fontWeight: '800' },
                ]}
              >
                {cat.title}
              </Text>
              {isSelected && (
                <View style={[styles.selectedDot, { backgroundColor: cat.color }]} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Category Sub Bar with Fullscreen Switcher */}
      <View style={styles.categorySubBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={[styles.categoryIndicatorDot, { backgroundColor: activeCategoryConfig.color }]} />
          <Text style={styles.categorySubBarTitle}>
            {activeCategoryConfig.title} Registration Process (5 Steps)
          </Text>
        </View>
        <Pressable
          style={[styles.fullscreenBtn, { borderColor: activeCategoryConfig.borderColor }]}
          onPress={() => navigation.navigate(activeCategoryConfig.stackRoute as any)}
          accessibilityLabel={`Open ${activeCategoryConfig.title} Registration in Dedicated Fullscreen`}
          hitSlop={8}
        >
          <Text style={[styles.fullscreenBtnText, { color: activeCategoryConfig.color }]}>
            Fullscreen
          </Text>
          <Ionicons name="expand-outline" size={12} color={activeCategoryConfig.color} />
        </Pressable>
      </View>

      {/* 3. Embedded Registration Form */}
      <View style={styles.formContainer}>
        {activeCategory === 'hospital' && (
          <HospitalRegistrationScreen
            embedded={true}
            onSwitchToDashboard={() => navigation.navigate('Home')}
          />
        )}
        {activeCategory === 'pharmacy' && (
          <PharmacyRegistrationScreen
            embedded={true}
            onSwitchToDashboard={() => navigation.navigate('Home')}
          />
        )}
        {activeCategory === 'doctor' && (
          <DoctorRegistrationScreen
            embedded={true}
            onSwitchToDashboard={() => navigation.navigate('Home')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  brandBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  categorySelectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  categoryTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  selectedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  categorySubBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoryIndicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  categorySubBarTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  fullscreenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  fullscreenBtnText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
