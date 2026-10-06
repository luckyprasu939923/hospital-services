import { NavigatorScreenParams } from '@react-navigation/native';
import { HospitalDoctor, OnlineConsultation, PharmacyProduct } from '../types';

export type TabParamList = {
  Home: undefined;
  BookingsOrders: undefined;
  Earnings: undefined;
  Settings: undefined;
  Profile?: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList> | undefined;
  Dashboard: undefined;
  Service: undefined;
  Auth: undefined;
  Account: undefined;
  Profile: undefined;
  RegisterProvider?: { category?: 'hospital' | 'doctor' | 'pharmacy'; initialRole?: 'hospital' | 'doctor' | 'pharmacy' };
  HospitalRegistration: undefined;
  DoctorRegistration?: { doctor?: HospitalDoctor; mode?: 'add' | 'edit' };
  PharmacyRegistration: undefined;
  RegisterDoctor?: { doctor?: HospitalDoctor; mode?: 'add' | 'edit' };
  HospitalDoctors: undefined;
  AddEditDoctor?: { doctor?: HospitalDoctor };
  HospitalPackages: undefined;
  DoctorConsultations: undefined;
  LiveMeeting: { consultation: OnlineConsultation };
  DoctorHomeVisits: undefined;
  PharmacyInventory: undefined;
  PharmacyOrders: undefined;
  Notifications: undefined;
  SupportChat?: { initialTab?: 'faqs' | 'chat' };
  EditProfile: undefined;
};
