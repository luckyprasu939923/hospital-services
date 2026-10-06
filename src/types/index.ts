// ==========================================
// One Buddy Medical - Service Provider Types
// ==========================================

export type ProviderType = 'hospital' | 'doctor' | 'pharmacy';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  upiId?: string;
}

export interface MedicalProvider {
  id: string;
  type: ProviderType;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  locationCoordinates: string;
  licenseNumber: string;
  licenseDocName: string;
  licenseType: string; // e.g. "State Medical Council", "Hospital Establishment Act", "Drug Retail License"
  approvalStatus: ApprovalStatus;
  isOnline: boolean;
  rating: number;
  totalReviews: number;
  bankDetails: BankDetails;

  // Specific Provider Fields
  consultationFee?: number;
  homeVisitFee?: number;
  serviceRadiusKm?: number;
  specialization?: string;
  qualifications?: string;
  experienceYears?: number;
  healthIssuesTreated?: string[];
}

// ----------------------------------------------------
// 1. Hospital Module - Doctors, OP Bookings, Packages
// ----------------------------------------------------

export interface HospitalDoctor {
  id: string;
  hospitalId: string;
  name: string;
  photo: string;
  specialization: string;
  qualification: string;
  experience: number; // in years
  consultationFee: number;
  healthIssues: string[];
  slotDurationMinutes: number; // e.g. 15, 20, 30
  availableDays: string[]; // e.g. ["Mon", "Tue", "Wed", "Thu", "Fri"]
  availableTimeStart: string; // e.g. "09:00 AM"
  availableTimeEnd: string; // e.g. "05:00 PM"
  blockedDates: string[]; // e.g. ["2026-10-05"]
  councilRegistrationNumber?: string;
  phone?: string;
  email?: string;
  gender?: 'Male' | 'Female' | 'Other';
  bio?: string;
  onlineConsultationFee?: number;
}

export type OPBookingStatus =
  | 'pending'
  | 'accepted'
  | 'checked_in'
  | 'completed'
  | 'no_show'
  | 'cancelled'
  | 'rescheduled';

export interface OPBooking {
  id: string;
  hospitalId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  problemDescription: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  status: OPBookingStatus;
  fee: number;
  platformFee: number; // Fixed ₹50
  netPayout: number;
  createdAt: string;
  rescheduledTo?: string;
}

export interface HealthPackage {
  id: string;
  hospitalId: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  testsIncluded: string[];
  image: string;
  validity: string;
  approvalStatus: ApprovalStatus;
}

// ----------------------------------------------------
// 2. Doctor Module - Online Consultations & Home Visits
// ----------------------------------------------------

export interface PrescriptionMedicine {
  id: string;
  name: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "1-0-1"
  timing: string; // "After food" | "Before food"
  duration: string; // e.g. "5 days"
}

export interface DigitalPrescription {
  id: string;
  consultationId: string;
  patientName: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  vitals?: {
    bp?: string;
    pulse?: string;
    temp?: string;
    weight?: string;
  };
  medicines: PrescriptionMedicine[];
  advice: string;
  followUpDate?: string;
}

export type ConsultationStatus =
  | 'upcoming'
  | 'in_call'
  | 'completed'
  | 'no_show'
  | 'cancelled';

export interface OnlineConsultation {
  id: string;
  doctorId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  problemDescription: string;
  date: string;
  timeSlot: string;
  meetingLink: string;
  status: ConsultationStatus;
  fee: number;
  platformFee: number; // Fixed ₹50
  netPayout: number;
  prescriptionUploaded: boolean;
  prescription?: DigitalPrescription;
  clinicalNotes?: string;
}

export type HomeVisitStatus =
  | 'pending'
  | 'accepted'
  | 'on_the_way'
  | 'reached'
  | 'completed'
  | 'declined';

export interface HomeVisitRequest {
  id: string;
  doctorId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  problemDescription: string;
  address: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  date: string;
  timeSlot: string;
  fee: number;
  platformFee: number; // Fixed ₹50
  netPayout: number;
  status: HomeVisitStatus;
  prescriptionUploaded: boolean;
  prescriptionNotes?: string;
}

// ----------------------------------------------------
// 3. Pharmacy Module - Medicines, Inventory, Delivery
// ----------------------------------------------------

export type ProductCategory =
  | 'tablets'
  | 'syrup'
  | 'injection'
  | 'needle'
  | 'sanitary'
  | 'pen'
  | 'equipment'
  | 'other';

export interface PharmacyProduct {
  id: string;
  pharmacyId: string;
  name: string;
  brand: string;
  formula: string; // active chemical formula / composition
  category: ProductCategory;
  price: number;
  stockQuantity: number;
  lowStockAlert: number;
  prescriptionRequired: boolean;
  image: string;
  expiryDate: string;
}

export type PharmacyOrderStatus =
  | 'pending'
  | 'accepted'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  formula: string;
  quantity: number;
  price: number;
  isAvailable: boolean;
  suggestedSubstitution?: string;
}

export interface PharmacyOrder {
  id: string;
  pharmacyId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  platformFee: number; // Fixed ₹50
  netPayout: number;
  prescriptionUrl?: string;
  prescriptionStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  etaMinutes?: number;
  status: PharmacyOrderStatus;
}

// ----------------------------------------------------
// 4. Financials, Notifications, Support
// ----------------------------------------------------

export interface MedicalTransaction {
  id: string;
  bookingId: string;
  type: 'op_booking' | 'consultation' | 'home_visit' | 'medicine_order' | 'bank_withdrawal';
  title: string;
  grossAmount: number;
  platformFee: number; // ₹50
  netPayout: number;
  status: 'settled' | 'pending' | 'processing';
  date: string;
  patientName: string;
  serviceDescription: string;
}

export interface MedicalEarningsSummary {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  pendingPayout: number;
  completedPayouts: number;
  platformFeePerOrder: number; // 50
  transactions: MedicalTransaction[];
}

export interface MedicalNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'consultation' | 'visit' | 'order' | 'payout' | 'system';
  timestamp: string;
  read: boolean;
  relatedId?: string;
}

export interface SupportFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
}
