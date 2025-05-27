import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Hospital, 
  Department, 
  Doctor, 
  User, 
  MedicalRecord, 
  Service, 
  Rating, 
  Referral, 
  Notification, 
  Metrics 
} from '../types';
import { 
  hospitals, 
  departments, 
  doctors, 
  users, 
  medicalRecords, 
  services, 
  ratings, 
  referrals, 
  notifications, 
  metrics as mockMetrics 
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface HospitalContextType {
  hospital: Hospital | null;
  departments: Department[];
  doctors: Doctor[];
  users: User[];
  medicalRecords: MedicalRecord[];
  services: Service[];
  ratings: Rating[];
  referrals: Referral[];
  notifications: Notification[];
  metrics: Metrics | null;
  addDepartment: (department: Omit<Department, 'id' | 'hospitalId' | 'createdAt'>) => void;
  updateDepartment: (department: Department) => void;
  addUser: (user: Omit<User, 'id' | 'hospitalId' | 'createdAt'>) => void;
  updateUser: (user: User) => void;
  toggleUserStatus: (userId: string) => void;
  addDoctor: (doctor: Omit<Doctor, 'id' | 'hospitalId'>) => void;
  updateDoctor: (doctor: Doctor) => void;
  toggleDoctorStatus: (doctorId: string) => void;
  addService: (service: Omit<Service, 'id' | 'hospitalId'>) => void;
  updateService: (service: Service) => void;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'hospitalId' | 'createdAt' | 'updatedAt'>) => void;
  updateMedicalRecord: (record: MedicalRecord) => void;
  updateReferralStatus: (referralId: string, status: 'accepted' | 'declined') => void;
  markNotificationAsRead: (notificationId: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentAdmin } = useAuth();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [hospitalDepartments, setHospitalDepartments] = useState<Department[]>([]);
  const [hospitalDoctors, setHospitalDoctors] = useState<Doctor[]>([]);
  const [hospitalUsers, setHospitalUsers] = useState<User[]>([]);
  const [hospitalRecords, setHospitalRecords] = useState<MedicalRecord[]>([]);
  const [hospitalServices, setHospitalServices] = useState<Service[]>([]);
  const [hospitalRatings, setHospitalRatings] = useState<Rating[]>([]);
  const [hospitalReferrals, setHospitalReferrals] = useState<Referral[]>([]);
  const [hospitalNotifications, setHospitalNotifications] = useState<Notification[]>([]);
  const [hospitalMetrics, setHospitalMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    // Load hospital data when admin changes
    if (currentAdmin) {
      const hospitalId = currentAdmin.hospitalId;
      
      // Find hospital
      const currentHospital = hospitals.find(h => h.id === hospitalId) || null;
      setHospital(currentHospital);
      
      // Filter data by hospital ID
      setHospitalDepartments(departments.filter(d => d.hospitalId === hospitalId));
      setHospitalDoctors(doctors.filter(d => d.hospitalId === hospitalId));
      setHospitalUsers(users.filter(u => u.hospitalId === hospitalId));
      setHospitalRecords(medicalRecords.filter(r => r.hospitalId === hospitalId));
      setHospitalServices(services.filter(s => s.hospitalId === hospitalId));
      setHospitalRatings(ratings.filter(r => r.hospitalId === hospitalId));
      setHospitalReferrals(referrals.filter(r => r.hospitalId === hospitalId));
      setHospitalNotifications(notifications.filter(n => n.hospitalId === hospitalId));
      
      // Set metrics
      setHospitalMetrics(mockMetrics[hospitalId] || null);
    } else {
      // Reset all data when logged out
      setHospital(null);
      setHospitalDepartments([]);
      setHospitalDoctors([]);
      setHospitalUsers([]);
      setHospitalRecords([]);
      setHospitalServices([]);
      setHospitalRatings([]);
      setHospitalReferrals([]);
      setHospitalNotifications([]);
      setHospitalMetrics(null);
    }
  }, [currentAdmin]);

  // Department functions
  const addDepartment = (department: Omit<Department, 'id' | 'hospitalId' | 'createdAt'>) => {
    if (!currentAdmin || !hospital) return;
    
    const newDepartment: Department = {
      id: `dept-${Date.now()}`,
      hospitalId: hospital.id,
      createdAt: new Date().toISOString(),
      ...department
    };
    
    setHospitalDepartments(prev => [...prev, newDepartment]);
  };

  const updateDepartment = (department: Department) => {
    setHospitalDepartments(prev => 
      prev.map(d => d.id === department.id ? department : d)
    );
  };

  // User functions
  const addUser = (user: Omit<User, 'id' | 'hospitalId' | 'createdAt'>) => {
    if (!currentAdmin || !hospital) return;
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      hospitalId: hospital.id,
      createdAt: new Date().toISOString(),
      ...user
    };
    
    setHospitalUsers(prev => [...prev, newUser]);
  };

  const updateUser = (user: User) => {
    setHospitalUsers(prev => 
      prev.map(u => u.id === user.id ? user : u)
    );
  };

  const toggleUserStatus = (userId: string) => {
    setHospitalUsers(prev => 
      prev.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            status: u.status === 'active' ? 'inactive' : 'active'
          };
        }
        return u;
      })
    );
  };

  // Doctor functions
  const addDoctor = (doctor: Omit<Doctor, 'id' | 'hospitalId'>) => {
    if (!currentAdmin || !hospital) return;
    
    const newDoctor: Doctor = {
      id: `doc-${Date.now()}`,
      hospitalId: hospital.id,
      ...doctor
    };
    
    setHospitalDoctors(prev => [...prev, newDoctor]);
  };

  const updateDoctor = (doctor: Doctor) => {
    setHospitalDoctors(prev => 
      prev.map(d => d.id === doctor.id ? doctor : d)
    );
  };

  const toggleDoctorStatus = (doctorId: string) => {
    setHospitalDoctors(prev => 
      prev.map(d => {
        if (d.id === doctorId) {
          return {
            ...d,
            status: d.status === 'active' ? 'inactive' : 'active'
          };
        }
        return d;
      })
    );
  };

  // Service functions
  const addService = (service: Omit<Service, 'id' | 'hospitalId'>) => {
    if (!currentAdmin || !hospital) return;
    
    const newService: Service = {
      id: `serv-${Date.now()}`,
      hospitalId: hospital.id,
      ...service
    };
    
    setHospitalServices(prev => [...prev, newService]);
  };

  const updateService = (service: Service) => {
    setHospitalServices(prev => 
      prev.map(s => s.id === service.id ? service : s)
    );
  };

  // Medical record functions
  const addMedicalRecord = (record: Omit<MedicalRecord, 'id' | 'hospitalId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentAdmin || !hospital) return;
    
    const now = new Date().toISOString();
    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      hospitalId: hospital.id,
      createdAt: now,
      updatedAt: now,
      ...record
    };
    
    setHospitalRecords(prev => [...prev, newRecord]);
  };

  const updateMedicalRecord = (record: MedicalRecord) => {
    setHospitalRecords(prev => 
      prev.map(r => {
        if (r.id === record.id) {
          return {
            ...record,
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
  };

  // Referral functions
  const updateReferralStatus = (referralId: string, status: 'accepted' | 'declined') => {
    setHospitalReferrals(prev => 
      prev.map(r => {
        if (r.id === referralId) {
          return {
            ...r,
            status,
            treatmentGiven: status === 'declined' ? 'Service declined' : r.treatmentGiven
          };
        }
        return r;
      })
    );
  };

  // Notification functions
  const markNotificationAsRead = (notificationId: string) => {
    setHospitalNotifications(prev => 
      prev.map(n => {
        if (n.id === notificationId) {
          return {
            ...n,
            read: true
          };
        }
        return n;
      })
    );
  };

  return (
    <HospitalContext.Provider 
      value={{
        hospital,
        departments: hospitalDepartments,
        doctors: hospitalDoctors,
        users: hospitalUsers,
        medicalRecords: hospitalRecords,
        services: hospitalServices,
        ratings: hospitalRatings,
        referrals: hospitalReferrals,
        notifications: hospitalNotifications,
        metrics: hospitalMetrics,
        addDepartment,
        updateDepartment,
        addUser,
        updateUser,
        toggleUserStatus,
        addDoctor,
        updateDoctor,
        toggleDoctorStatus,
        addService,
        updateService,
        addMedicalRecord,
        updateMedicalRecord,
        updateReferralStatus,
        markNotificationAsRead
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = (): HospitalContextType => {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};