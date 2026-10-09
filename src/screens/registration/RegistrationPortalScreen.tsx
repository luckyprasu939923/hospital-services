import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../../navigation/types';
import { ProviderType } from '../../types';
import { useApp } from '../../context/AppContext';
import HospitalRegistrationScreen from '../hospital/HospitalRegistrationScreen';
import DoctorRegistrationScreen from '../doctor/DoctorRegistrationScreen';
import PharmacyRegistrationScreen from '../pharmacy/PharmacyRegistrationScreen';

type RegistrationPortalRouteProp = RouteProp<TabParamList, 'Register'>;

export default function RegistrationPortalScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList> & BottomTabNavigationProp<TabParamList>>();
  const route = useRoute<RegistrationPortalRouteProp>();
  const { providerType } = useApp();

  const activeCategory = (route.params?.category || providerType || 'hospital') as ProviderType;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
  formContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
