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

const STEPS = [
  { id: 1, title: 'Store Profile', icon: 'storefront' as const },
  { id: 2, title: 'Drug Licenses', icon: 'shield-checkmark' as const },
  { id: 3, title: 'Premises & Contact', icon: 'location' as const },
  { id: 4, title: 'Document Upload', icon: 'cloud-upload' as const },
  { id: 5, title: 'Bank & Legal', icon: 'checkmark-done-circle' as const },
];

export default function PharmacyRegistrationScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { provider, registerProvider, switchProviderMode, toggleOnlineAvailability } = useApp();

  // Step Tracker state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  // Step 1: Pharmacy Store Profile & Classification
  const [storeName, setStoreName] = useState(
    provider.type === 'pharmacy' ? provider.name : 'Metro Meds 24x7 Pharmacy',
  );
  const [pharmacyType, setPharmacyType] = useState(PHARMACY_TYPES[0]);
  const [operatingHours, setOperatingHours] = useState('08:00 AM - 11:00 PM');
  const [has24x7Service, setHas24x7Service] = useState(true);
  const [hasHomeDelivery, setHasHomeDelivery] = useState(true);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState('8');
  const [hasColdChain, setHasColdChain] = useState(true);
  const [hasRxVerificationDesk, setHasRxVerificationDesk] = useState(true);

  // Step 2: Drug Licenses & Registered Pharmacist
  const [form20License, setForm20License] = useState('KA-BGL-DRUG-20-49182');
  const [form21License, setForm21License] = useState('KA-BGL-DRUG-21-49183');
  const [licenseExpiry, setLicenseExpiry] = useState('2028-12-31');
  const [gstin, setGstin] = useState('29ABCDE1234F1Z5');
  const [pharmacistName, setPharmacistName] = useState('Pooja Kulkarni');
  const [pharmacistDegree, setPharmacistDegree] = useState(PHARMACIST_DEGREES[0]);
  const [pharmacistRegNo, setPharmacistRegNo] = useState('KSPC-2021-58291');

  // Step 3: Premises & Contact
  const [storePhone, setStorePhone] = useState(
    provider.type === 'pharmacy' ? provider.phone.replace('+91 ', '') : '9876543210',
  );
  const [storeEmail, setStoreEmail] = useState(
    provider.type === 'pharmacy' ? provider.email : 'care@metromeds.onebuddy.health',
  );
  const [storeAddress, setStoreAddress] = useState('Shop 4, Ground Floor, Health City Complex');
  const [city, setCity] = useState('Bengaluru');
  const [stateName, setStateName] = useState('Karnataka');
  const [pincode, setPincode] = useState('560034');

  // Step 4: Regulatory Document Uploads
  const [uploadedDrugDoc, setUploadedDrugDoc] = useState('Drug_License_Form_20_21.pdf');
  const [uploadedPharmDoc, setUploadedPharmDoc] = useState('Pharmacist_Council_Registration.pdf');

  // Step 5: Bank Settlement & Legal Declaration
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('50100458923412');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [upiId, setUpiId] = useState('metromeds@upi');
  const [isDeclared, setIsDeclared] = useState(true);

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!storeName.trim()) {
        Alert.alert('Required Field', 'Please enter pharmacy or chemist store name.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!form20License.trim() || !form21License.trim()) {
        Alert.alert('License Required', 'Please enter Form 20 and Form 21 Drug Retail License numbers.');
        return;
      }
      if (!pharmacistName.trim() || !pharmacistRegNo.trim()) {
        Alert.alert('Pharmacist Required', 'Please enter registered pharmacist in-charge credentials.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!storePhone.trim() || storePhone.trim().length < 10) {
        Alert.alert('Invalid Phone', 'Please enter a valid 10-digit primary store mobile number.');
        return;
      }
      if (!storeAddress.trim() || !city.trim()) {
        Alert.alert('Address Required', 'Please enter physical store address and city.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!uploadedDrugDoc) {
        Alert.alert('Document Required', 'Please upload Drug License Form 20/21 PDF certificate.');
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

  const handleRegisterPharmacy = () => {
    if (!isDeclared) {
      Alert.alert(
        'Declaration Required',
        'Please confirm adherence to Drugs & Cosmetics Act and Schedule H/H1 dispensing standards.',
      );
      return;
    }

    // Save provider into context
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
    setIsRegistered(true);

    Alert.alert(
      'Pharmacy Registration Complete! 💊',
      `${storeName} is successfully registered on OneBuddy Healthcare Network with verified Form 20/21 Drug Retail approval.`,
      [{ text: 'View Pharmacy Dashboard' }],
    );
  };

  // If already registered, render the Pharmacy Service Dashboard right here!
  if (isRegistered) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Pharmacy Dashboard Header */}
        <View style={styles.topHeader}>
          <Pressable
            style={styles.backBtn}
            onPress={() => setIsRegistered(false)}
            accessibilityLabel="Edit Pharmacy Registration"
            hitSlop={8}
          >
            <Ionicons name="settings-outline" size={18} color={colors.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="flask" size={18} color="#0D9488" />
              <Text style={styles.headerTitle} numberOfLines={1}>{storeName}</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Registered Pharmacy Dashboard • Form 20/21: {form20License}
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
          {/* Active Pharmacy Hero Card */}
          <Card style={styles.dashboardHeroCard} padding="lg">
            <View style={styles.heroTopRow}>
              <View style={styles.heroIconBadge}>
                <Ionicons name="flask" size={28} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.heroStoreName} numberOfLines={1}>{storeName}</Text>
                <View style={styles.pharmacyTag}>
                  <Text style={styles.pharmacyTagText}>{pharmacyType}</Text>
                </View>
                <Text style={styles.heroSubText}>
                  Pharmacist: {pharmacistName} ({pharmacistRegNo})
                </Text>
                <Text style={styles.heroLicenseText}>Licensed Drug Retailer (Form 20/21)</Text>
              </View>
            </View>

            {/* Fully Accessible Online / Offline Toggle Button */}
            <View style={styles.onlineToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.onlineToggleTitle}>Prescription Delivery Status</Text>
                <Text style={styles.onlineToggleSub}>
                  {provider.isOnline
                    ? 'Online: Accepting customer medicine orders & e-prescriptions'
                    : 'Offline: Order dispatch temporarily paused'}
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
                    'Pharmacy Status Updated',
                    `Store is now ${!provider.isOnline ? 'ONLINE' : 'OFFLINE'}.`,
                    [{ text: 'OK' }],
                  );
                }}
                accessibilityRole="switch"
                accessibilityState={{ checked: provider.isOnline }}
                accessibilityLabel={`Pharmacy is ${provider.isOnline ? 'Online' : 'Offline'}. Tap to toggle.`}
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

          {/* Operational Metrics */}
          <View style={styles.sectionHeader}>
            <Ionicons name="bicycle-outline" size={17} color="#0D9488" />
            <Text style={styles.sectionTitle}>Delivery Operations & Compliance</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="map" size={20} color="#0D9488" />
              <Text style={styles.statNumber}>{deliveryRadiusKm} km</Text>
              <Text style={styles.statLabel}>Delivery Radius</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="snow" size={20} color="#0284C7" />
              <Text style={styles.statNumber}>{hasColdChain ? 'Yes' : 'No'}</Text>
              <Text style={styles.statLabel}>Cold Chain 2-8°C</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="time" size={20} color="#D97706" />
              <Text style={styles.statNumber}>{has24x7Service ? '24/7' : 'Standard'}</Text>
              <Text style={styles.statLabel}>Store Hours</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="document-text" size={20} color="#16A34A" />
              <Text style={styles.statNumber}>Form 20/21</Text>
              <Text style={styles.statLabel}>Drug License</Text>
            </View>
          </View>

          {/* Pharmacy Management Actions */}
          <View style={styles.sectionHeader}>
            <Ionicons name="grid-outline" size={17} color="#0D9488" />
            <Text style={styles.sectionTitle}>Pharmacy Operations Modules</Text>
          </View>

          <View style={styles.actionGrid}>
            <Pressable
              style={styles.actionCard}
              onPress={() => navigation.navigate('PharmacyInventory')}
              accessibilityLabel="Manage Pharmacy Inventory"
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#CCFBF1' }]}>
                <Ionicons name="medkit" size={22} color="#0D9488" />
              </View>
              <Text style={styles.actionCardTitle}>Inventory Stock</Text>
              <Text style={styles.actionCardSub}>Manage medicines, prices & batches</Text>
              <View style={styles.actionLinkRow}>
                <Text style={styles.actionLinkText}>Open Catalog</Text>
                <Ionicons name="arrow-forward" size={12} color="#0D9488" />
              </View>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => navigation.navigate('Main', { screen: 'BookingsOrders' } as any)}
              accessibilityLabel="View Customer Orders"
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="receipt" size={22} color="#0284C7" />
              </View>
              <Text style={styles.actionCardTitle}>Customer Orders</Text>
              <Text style={styles.actionCardSub}>Incoming prescription orders</Text>
              <View style={styles.actionLinkRow}>
                <Text style={[styles.actionLinkText, { color: '#0284C7' }]}>Open Orders</Text>
                <Ionicons name="arrow-forward" size={12} color="#0284C7" />
              </View>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => setIsRegistered(false)}
              accessibilityLabel="Edit Store Setup"
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="create-outline" size={22} color="#475569" />
              </View>
              <Text style={styles.actionCardTitle}>Edit Store Info</Text>
              <Text style={styles.actionCardSub}>Update licenses, pharmacist & address</Text>
              <View style={styles.actionLinkRow}>
                <Text style={[styles.actionLinkText, { color: '#475569' }]}>Edit Setup</Text>
                <Ionicons name="arrow-forward" size={12} color="#475569" />
              </View>
            </Pressable>
          </View>

          {/* Store & Settlement Summary */}
          <Card style={styles.summaryCard} padding="md">
            <Text style={styles.summaryCardHeading}>Store Location & Bank Settlement</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Store Address:</Text>
              <Text style={styles.summaryValue}>{storeAddress}, {city}, {stateName} - {pincode}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Store Mobile:</Text>
              <Text style={styles.summaryValue}>+91 {storePhone}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GSTIN / PAN:</Text>
              <Text style={styles.summaryValue}>{gstin}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pharmacist:</Text>
              <Text style={styles.summaryValue}>{pharmacistName} ({pharmacistDegree})</Text>
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
      {/* Top Header */}
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
            <Ionicons name="flask" size={17} color="#0D9488" />
            <Text style={styles.headerTitle}>Pharmacy Registration</Text>
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
          {/* STEP 1: PHARMACY STORE PROFILE */}
          {currentStep === 1 && (
            <>
              {/* Pharmacy Hero Banner */}
              <Card style={styles.bannerCard} padding="lg">
                <View style={styles.bannerRow}>
                  <View style={styles.bannerIconBadge}>
                    <Ionicons name="flask" size={26} color="#0D9488" />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.bannerTitle}>Pharmacy Retail Portal</Text>
                      <View style={styles.pharmacyTag}>
                        <Text style={styles.pharmacyTagText}>Category 3</Text>
                      </View>
                    </View>
                    <Text style={styles.bannerSubtitle}>
                      Register your licensed retail chemist, upload Form 20/21 approvals, and configure home delivery dispatch.
                    </Text>
                  </View>
                </View>
              </Card>

              <View style={styles.sectionHeader}>
                <Ionicons name="storefront" size={18} color="#0D9488" />
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
                  <View style={{ flex: 1.5, marginRight: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Operating Hours *</Text>
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

                {/* Facilities Toggles */}
                <Text style={[styles.inputLabel, { marginTop: spacing.sm }]}>
                  Storage & Delivery Facilities
                </Text>
                <View style={styles.facilityToggleGrid}>
                  <View style={styles.facilityToggleItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.toggleItemTitle}>24x7 Emergency Service</Text>
                      <Text style={styles.toggleItemSub}>Night dispensary window active</Text>
                    </View>
                    <Switch
                      value={has24x7Service}
                      onValueChange={setHas24x7Service}
                      trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                      thumbColor={has24x7Service ? '#0D9488' : '#FFFFFF'}
                    />
                  </View>

                  <View style={styles.facilityToggleItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.toggleItemTitle}>Home Delivery Service</Text>
                      <Text style={styles.toggleItemSub}>Fast doorstep courier delivery</Text>
                    </View>
                    <Switch
                      value={hasHomeDelivery}
                      onValueChange={setHasHomeDelivery}
                      trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                      thumbColor={hasHomeDelivery ? '#0D9488' : '#FFFFFF'}
                    />
                  </View>

                  <View style={styles.facilityToggleItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.toggleItemTitle}>Cold Chain Refrigerator (2°C - 8°C)</Text>
                      <Text style={styles.toggleItemSub}>For Insulin, Vaccines & Biologics</Text>
                    </View>
                    <Switch
                      value={hasColdChain}
                      onValueChange={setHasColdChain}
                      trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
                      thumbColor={hasColdChain ? '#0D9488' : '#FFFFFF'}
                    />
                  </View>
                </View>
              </Card>

              {/* Step 1 Actions */}
              <Pressable
                style={styles.primaryStepBtn}
                onPress={handleNextStep}
                accessibilityLabel="Continue to Drug Licenses"
              >
                <Text style={styles.primaryStepBtnText}>Continue to Step 2: Drug Licenses</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </>
          )}

          {/* STEP 2: DRUG LICENSES & PHARMACIST */}
          {currentStep === 2 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark" size={18} color="#0D9488" />
                <Text style={styles.sectionTitle}>2. Drug Licenses & Registered Pharmacist</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.inputLabel}>
                  Drug License Form 20 (General Retail) No. *
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={form20License}
                  onChangeText={setForm20License}
                  placeholder="KA-BGL-DRUG-20-49182"
                  placeholderTextColor={colors.textMuted}
                />

                <Text style={styles.inputLabel}>
                  Drug License Form 21 (Biologicals & Specified) No. *
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={form21License}
                  onChangeText={setForm21License}
                  placeholder="KA-BGL-DRUG-21-49183"
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.inputRow}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>License Expiry Date</Text>
                    <TextInput
                      style={styles.textInput}
                      value={licenseExpiry}
                      onChangeText={setLicenseExpiry}
                      placeholder="2028-12-31"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>GSTIN Number</Text>
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

                {/* Pharmacist in-charge details */}
                <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>
                  Registered Pharmacist In-Charge Name *
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={pharmacistName}
                  onChangeText={setPharmacistName}
                  placeholder="Pooja Kulkarni"
                  placeholderTextColor={colors.textMuted}
                />

                <Text style={styles.inputLabel}>Pharmacist Qualification Degree *</Text>
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

                <Text style={styles.inputLabel}>State Pharmacy Council Registration No. *</Text>
                <TextInput
                  style={styles.textInput}
                  value={pharmacistRegNo}
                  onChangeText={setPharmacistRegNo}
                  placeholder="KSPC-2021-58291"
                  placeholderTextColor={colors.textMuted}
                />
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
                  accessibilityLabel="Continue to Step 3 Premises"
                >
                  <Text style={styles.primaryStepBtnText}>Step 3: Premises & Contact</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
            </>
          )}

          {/* STEP 3: PREMISES & CONTACT */}
          {currentStep === 3 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="location" size={18} color="#0D9488" />
                <Text style={styles.sectionTitle}>3. Physical Premises & Store Contacts</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <View style={styles.inputRow}>
                  <View style={{ flex: 1, marginRight: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Store Contact Mobile *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={storePhone}
                      onChangeText={setStorePhone}
                      keyboardType="phone-pad"
                      placeholder="10-digit mobile"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.inputLabel} numberOfLines={1}>Official Store Email *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={storeEmail}
                      onChangeText={setStoreEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="care@pharmacy.com"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Physical Store Address *</Text>
                <TextInput
                  style={styles.textInput}
                  value={storeAddress}
                  onChangeText={setStoreAddress}
                  placeholder="Shop No, Building, Road & Cross"
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
                  accessibilityLabel="Back to Step 3: Premises & Contact"
                >
                  <Ionicons name="arrow-back" size={18} color="#0D9488" />
                  <Text style={styles.docBackBtnText}>Back to Step 3: Premises & Contact</Text>
                </Pressable>
              </View>

              <View style={styles.sectionHeader}>
                <Ionicons name="cloud-upload" size={18} color="#0D9488" />
                <Text style={styles.sectionTitle}>4. Regulatory Drug License Verification</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.uploadSectionTitle}>
                  Form 20 & 21 Drug Retail License Certificate *
                </Text>
                <View style={styles.docUploadBox}>
                  <View style={styles.docUploadIconCircle}>
                    <Ionicons name="document-attach" size={22} color="#0D9488" />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.docUploadTitle}>Form 20/21 License PDF</Text>
                    <Text style={styles.docUploadFilename}>{uploadedDrugDoc}</Text>
                    <View style={styles.verifiedDocPill}>
                      <Ionicons name="checkmark-circle" size={11} color="#15803D" />
                      <Text style={styles.verifiedDocPillText}>Ready for Verification</Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.uploadBtn}
                    onPress={() => {
                      Alert.alert('Upload Document', 'Select replacement Form 20/21 license file.', [
                        {
                          text: 'Replace PDF',
                          onPress: () =>
                            setUploadedDrugDoc(`Drug_License_${Date.now().toString().slice(-4)}.pdf`),
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]);
                    }}
                  >
                    <Text style={styles.uploadBtnText}>Replace</Text>
                  </Pressable>
                </View>

                <Text style={[styles.uploadSectionTitle, { marginTop: spacing.md }]}>
                  Registered Pharmacist Certificate
                </Text>
                <View style={styles.docUploadBox}>
                  <View style={[styles.docUploadIconCircle, { backgroundColor: '#CCFBF1' }]}>
                    <Ionicons name="ribbon" size={22} color="#0D9488" />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text style={styles.docUploadTitle}>Pharmacist Reg PDF</Text>
                    <Text style={styles.docUploadFilename}>{uploadedPharmDoc}</Text>
                    <View style={[styles.verifiedDocPill, { backgroundColor: '#CCFBF1' }]}>
                      <Ionicons name="checkmark-circle" size={11} color="#0F766E" />
                      <Text style={[styles.verifiedDocPillText, { color: '#0F766E' }]}>
                        File Attached
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={styles.uploadBtn}
                    onPress={() => {
                      Alert.alert('Upload Document', 'Select replacement Pharmacist certificate file.', [
                        {
                          text: 'Replace PDF',
                          onPress: () =>
                            setUploadedPharmDoc(`Pharmacist_Reg_${Date.now().toString().slice(-4)}.pdf`),
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
                  accessibilityLabel="Continue to Step 5 Bank & Declaration"
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
                <Ionicons name="card" size={18} color="#0D9488" />
                <Text style={styles.sectionTitle}>5. Revenue Disbursal & Compliance Declaration</Text>
              </View>

              <Card style={styles.formCard} padding="lg">
                <Text style={styles.inputLabel}>Payout Bank Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="e.g. HDFC Bank, ICICI Bank, SBI"
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

                <Text style={styles.inputLabel}>Direct Pharmacy UPI ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                  placeholder="metromeds@upi"
                  placeholderTextColor={colors.textMuted}
                />
              </Card>

              {/* Compliance Declaration */}
              <Card style={styles.declarationCard} padding="md">
                <Pressable
                  style={styles.checkboxRow}
                  onPress={() => setIsDeclared(!isDeclared)}
                  accessibilityLabel="Agree to Drugs & Cosmetics Act"
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      isDeclared && {
                        backgroundColor: '#0D9488',
                        borderColor: '#0D9488',
                      },
                    ]}
                  >
                    {isDeclared && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.declarationText}>
                    I declare that all drug licenses (Form 20/21) and pharmacist registrations submitted are authentic under the Drugs and Cosmetics Act, 1940 and Pharmacy Practice Regulations.
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
                  style={[styles.primaryStepBtn, { flex: 2, backgroundColor: '#0D9488' }]}
                  onPress={handleRegisterPharmacy}
                  accessibilityLabel="Complete Pharmacy Registration"
                >
                  <Ionicons name="flask" size={18} color="#FFFFFF" />
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
    backgroundColor: '#0D9488',
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
    backgroundColor: '#0D9488',
    borderColor: '#2DD4BF',
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
  bannerCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  pharmacyTag: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  pharmacyTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
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
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
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
  docBackHeader: {
    marginBottom: spacing.xs,
  },
  docBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    borderColor: '#0D9488',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  docBackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5EEAD4',
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
    backgroundColor: '#134E4A',
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
    backgroundColor: '#0D9488',
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
    backgroundColor: '#0D9488',
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
    borderColor: '#0D9488',
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
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStoreName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  heroSubText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  heroLicenseText: {
    fontSize: 10,
    color: '#5EEAD4',
    marginTop: 1,
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
    color: '#0D9488',
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
