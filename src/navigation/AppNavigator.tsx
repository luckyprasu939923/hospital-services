import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { RootStackParamList } from './types';
import MainTabs from './MainTabs';

// Healthcare Provider Stack Screens
import AuthScreen from '../screens/auth/AuthScreen';
import RegisterProviderScreen from '../screens/auth/RegisterProviderScreen';
import RegistrationPortalScreen from '../screens/registration/RegistrationPortalScreen';
import HospitalRegistrationScreen from '../screens/hospital/HospitalRegistrationScreen';
import DoctorRegistrationScreen from '../screens/doctor/DoctorRegistrationScreen';
import PharmacyRegistrationScreen from '../screens/pharmacy/PharmacyRegistrationScreen';
import HospitalDoctorsScreen from '../screens/hospital/HospitalDoctorsScreen';
import HospitalPackagesScreen from '../screens/hospital/HospitalPackagesScreen';
import LiveMeetingScreen from '../screens/doctor/LiveMeetingScreen';
import PharmacyInventoryScreen from '../screens/pharmacy/PharmacyInventoryScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import SupportChatScreen from '../screens/support/SupportChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      {/* 4-Tab Main Navigation Hub & Immediate Dashboard / Service entry points */}
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Dashboard" component={MainTabs} />
      <Stack.Screen name="Service" component={MainTabs} />
      <Stack.Screen name="Register" component={RegistrationPortalScreen} />

      {/* Provider Account / Profile Screen */}
      <Stack.Screen name="Account" component={ProfileScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

      {/* Auth & Universal Onboarding Flow */}
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="RegisterProvider" component={RegisterProviderScreen} />

      {/* 3 Dedicated Category Registration Pages */}
      <Stack.Screen name="HospitalRegistration" component={HospitalRegistrationScreen} />
      <Stack.Screen name="DoctorRegistration" component={DoctorRegistrationScreen} />
      <Stack.Screen name="PharmacyRegistration" component={PharmacyRegistrationScreen} />

      {/* Doctor Module Screens & Aliases */}
      <Stack.Screen name="RegisterDoctor" component={DoctorRegistrationScreen} />
      <Stack.Screen name="AddEditDoctor" component={DoctorRegistrationScreen} />
      <Stack.Screen
        name="LiveMeeting"
        component={LiveMeetingScreen}
        options={{ animation: 'fade' }}
      />

      {/* Hospital Module Screens */}
      <Stack.Screen name="HospitalDoctors" component={HospitalDoctorsScreen} />
      <Stack.Screen name="HospitalPackages" component={HospitalPackagesScreen} />

      {/* Pharmacy Module Screens */}
      <Stack.Screen name="PharmacyInventory" component={PharmacyInventoryScreen} />

      {/* Common Partner Support & Notifications */}
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="SupportChat" component={SupportChatScreen} />
    </Stack.Navigator>
  );
}

