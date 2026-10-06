import {
  ConsultationStatus,
  HomeVisitStatus,
  OPBookingStatus,
  PharmacyOrderStatus,
} from '../types';
import { colors } from '../theme/colors';

export const timeAgo = (iso: string): string => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} d ago`;
};

export const formatDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatCurrency = (amt: number): string =>
  `₹${amt.toLocaleString('en-IN')}`;

export const opStatusLabel: Record<OPBookingStatus, string> = {
  pending: 'Pending Acceptance',
  accepted: 'Accepted / Scheduled',
  checked_in: 'Patient Checked In',
  completed: 'Completed',
  no_show: 'No Show',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
};

export const opStatusColor: Record<OPBookingStatus, string> = {
  pending: colors.warning,
  accepted: colors.primary,
  checked_in: colors.info,
  completed: colors.success,
  no_show: colors.danger,
  cancelled: colors.textMuted,
  rescheduled: colors.purple,
};

export const pharmacyStatusLabel: Record<PharmacyOrderStatus, string> = {
  pending: 'Pending Rx / Review',
  accepted: 'Order Accepted',
  packed: 'Packed & Invoiced',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered Successfully',
  cancelled: 'Order Cancelled',
};

export const pharmacyStatusColor: Record<PharmacyOrderStatus, string> = {
  pending: colors.warning,
  accepted: colors.pharmacyTeal,
  packed: colors.purple,
  out_for_delivery: colors.info,
  delivered: colors.success,
  cancelled: colors.danger,
};

export const consultationStatusLabel: Record<ConsultationStatus, string> = {
  upcoming: 'Upcoming Video Consult',
  in_call: 'Live Consultation',
  completed: 'Completed & Rx Issued',
  no_show: 'Patient No Show',
  cancelled: 'Cancelled',
};

export const consultationStatusColor: Record<ConsultationStatus, string> = {
  upcoming: colors.medicalBlue,
  in_call: colors.info,
  completed: colors.success,
  no_show: colors.warning,
  cancelled: colors.danger,
};

export const homeVisitStatusLabel: Record<HomeVisitStatus, string> = {
  pending: 'Visit Requested',
  accepted: 'Visit Accepted',
  on_the_way: 'Doctor On The Way',
  reached: 'Doctor Reached Doorstep',
  completed: 'Visit Completed',
  declined: 'Declined',
};

export const homeVisitStatusColor: Record<HomeVisitStatus, string> = {
  pending: colors.warning,
  accepted: colors.primary,
  on_the_way: colors.purple,
  reached: colors.info,
  completed: colors.success,
  declined: colors.danger,
};
