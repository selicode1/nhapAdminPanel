export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Admin {
  id: string;
  name: string;
  pin: string;
  hospitalId: string;
  email: string;
  phone: string;
  lastLogin: string;
}

export interface Department {
  id: string;
  name: string;
  hospitalId: string;
  phone: string;
  email: string;
}

export interface Doctor {
  id: string;
  name: string;
  hospitalId: string;
  departmentId: string;
  email: string;
  phone: string;
  title: string;
  experience: number;
  region: string;
  status: 'active' | 'inactive';
  schedule: Schedule;
}

export interface Schedule {
  activeDays: string[];
  offDays: string[];
  shifts: Shift[];
  shiftStartDate: string;
  shiftSwitchTimes: string[];
}

export interface Shift {
  day: string;
  startTime: string;
  endTime: string;
}

export interface User {
  id: string;
  name: string;
  hospitalId: string;
  email: string;
  phone: string;
  role: boolean;
  status: boolean;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientName: string;
  hospitalId: string;
  diagnosis: string;
  treatmentHistory: string[];
  assignedDoctorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  hospitalId: string;
  daysAvailable: string[];
  timeSlots: string;
  forumPost?: ForumPost;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  hospitalId: string;
  rating: number;
  comment: string;
  patientName: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  hospitalId: string;
  patientName: string;
  patientNumber: string;
  reason: string;
  referringDoctor: string;
  referringHospital: string;
  treatmentGiven: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Notification {
  id: string;
  hospitalId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

export interface Settings {
  hospitalId: string;
  workingHours: {
    start: string;
    end: string;
  };
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
    sms: boolean;
  };
  communicationSettings: {
    emailSignature: string;
    autoReply: boolean;
    autoReplyMessage: string;
  };
}

export interface Metrics {
  totalMedicalRecords: number;
  totalDepartments: number;
  totalUsers: number;
  totalDoctors: number;
}