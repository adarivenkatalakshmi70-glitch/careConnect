/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profile {
  name: string;
  dob: string;
  emergencyContact: string;
  completed: boolean;
  step: number;
}

export type TabType = 'Dashboard' | 'Meds' | 'Booking' | 'Help' | 'Subsidies';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  timing: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  instructions: string;
  taken: boolean;
  days: number[]; // 1 for Monday, 7 for Sunday
}

export type DoctorSpecialty = 'General Physician' | 'Heart Specialist' | 'Eye Doctor' | 'Dermatologist';

export interface Doctor {
  id: string;
  name: string;
  specialty: DoctorSpecialty;
  experience: number;
  rating: number;
  reviewsCount: number;
  availableToday: boolean;
  nextAvailable: string;
  image: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: DoctorSpecialty;
  dateTime: string;
  timeSlot: string;
  notes: string;
}

export interface Volunteer {
  id: string;
  name: string;
  rating: number;
  quote: string;
  image: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'volunteer';
  text: string;
  timestamp: string;
}

export interface HelpRequest {
  id: string;
  type: string;
  details: string;
  status: 'Pending' | 'Accepted' | 'Completed';
  volunteerName?: string;
}
