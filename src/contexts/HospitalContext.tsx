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
  collection, 
  query, 
  where,  
  addDoc, 
  updateDoc, 
  doc,
  onSnapshot,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
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
  if (!currentAdmin?.hospitalId) return;

  const hospitalId = currentAdmin.hospitalId;

  const unsubHospital = onSnapshot(doc(db, "hospitals", hospitalId), (docSnap) => {
    setHospital(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Hospital : null);
  });

  const fetchCollection = (colName: string, setter: Function) => {
    const q = query(collection(db, colName), where("hospitalId", "==", hospitalId));
    return onSnapshot(q, (querySnap) => {
      const items = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setter(items);
    });
  };

  const unsubDepartments = fetchCollection("departments", setHospitalDepartments);
  const unsubDoctors = fetchCollection("doctors", setHospitalDoctors);
  const unsubUsers = fetchCollection("users", setHospitalUsers);
  const unsubRecords = fetchCollection("medicalRecords", setHospitalRecords);
  const unsubServices = fetchCollection("services", setHospitalServices);
  const unsubRatings = fetchCollection("ratings", setHospitalRatings);
  const unsubReferrals = fetchCollection("referrals", setHospitalReferrals);
  const unsubNotifications = fetchCollection("notifications", setHospitalNotifications);

  return () => {
    unsubHospital();
    unsubDepartments();
    unsubDoctors();
    unsubUsers();
    unsubRecords();
    unsubServices();
    unsubRatings();
    unsubReferrals();
    unsubNotifications();
  };
}, [currentAdmin]);



  // Department functions
const addDepartment = async (department: Omit<Department, 'id' | 'hospitalId' | 'createdAt'>) => {
  if (!currentAdmin || !hospital) return;

  await addDoc(collection(db, "departments"), {
    ...department,
    hospitalId: hospital.id,
    createdAt: new Date().toISOString()
  });
};


const updateDepartment = async (department: Department) => {
  const { id, ...data } = department;
  await updateDoc(doc(db, "departments", id), { ...data });
};



  // User functions
const addUser = async (user: Omit<User, 'id' | 'hospitalId' | 'createdAt'>) => {
  if (!currentAdmin || !hospital) return;

  const newUser: User = {
    id: `user-${Date.now()}`,
    hospitalId: hospital.id,
    createdAt: new Date().toISOString(),
    ...user
  };

  await setDoc(doc(db, "users", newUser.id), newUser);
};


const updateUser = async (user: User) => {
  const { id, ...data } = user;
  await updateDoc(doc(db, "users", id), data);
};

const toggleUserStatus = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef); // ✅ Correct function

  if (!userSnap.exists()) return;

  const currentStatus = userSnap.data().status;
  await updateDoc(userRef, {
    status: currentStatus === true ? false : true
  });
};

// Add Doctor
const addDoctor = async (doctor: Omit<Doctor, 'id' | 'hospitalId'>) => {
  if (!currentAdmin || !hospital) return;

  const newDoctor: Doctor = {
    id: `doc-${Date.now()}`,
    hospitalId: hospital.id,
    ...doctor
  };

  const doctorRef = doc(db, "doctors", newDoctor.id);
  await setDoc(doctorRef, newDoctor);
  setHospitalDoctors(prev => [...prev, newDoctor]);
};

// Update Doctor
const updateDoctor = async (doctor: Doctor) => {
  const doctorRef = doc(db, "doctors", doctor.id);
  await setDoc(doctorRef, doctor);
  setHospitalDoctors(prev => prev.map(d => d.id === doctor.id ? doctor : d));
};

// Toggle Doctor Status
const toggleDoctorStatus = async (doctorId: string) => {
  const doctorRef = doc(db, "doctors", doctorId);
  const snap = await getDoc(doctorRef);
  if (!snap.exists()) return;

  const currentStatus = snap.data().status;
  await updateDoc(doctorRef, { status: currentStatus === 'active' ? 'inactive' : 'active' });

  setHospitalDoctors(prev => 
    prev.map(d => d.id === doctorId ? { ...d, status: currentStatus === 'active' ? 'inactive' : 'active' } : d)
  );
};


const addService = async (service: Omit<Service, 'id' | 'hospitalId'>) => {
  if (!currentAdmin || !hospital) return;

  const newService: Service = {
    id: `serv-${Date.now()}`,
    hospitalId: hospital.id,
    ...service
  };

  const serviceRef = doc(db, "services", newService.id);
  await setDoc(serviceRef, newService);
  setHospitalServices(prev => [...prev, newService]);
};

const updateService = async (service: Service) => {
  const serviceRef = doc(db, "services", service.id);
  await setDoc(serviceRef, service);
  setHospitalServices(prev => prev.map(s => s.id === service.id ? service : s));
};


  // Medical record functions
const addMedicalRecord = async (
  record: Omit<MedicalRecord, 'id' | 'hospitalId' | 'createdAt' | 'updatedAt'>
) => {
  if (!currentAdmin || !hospital) return;

  const now = new Date().toISOString();
  const newRecord: MedicalRecord = {
    id: `rec-${Date.now()}`,
    hospitalId: hospital.id,
    createdAt: now,
    updatedAt: now,
    ...record
  };

  const recordRef = doc(db, "records", newRecord.id);
  await setDoc(recordRef, newRecord);
  setHospitalRecords(prev => [...prev, newRecord]);
};

const updateMedicalRecord = async (record: MedicalRecord) => {
  const updated = {
    ...record,
    updatedAt: new Date().toISOString()
  };

  const recordRef = doc(db, "records", record.id);
  await setDoc(recordRef, updated);

  setHospitalRecords(prev =>
    prev.map(r => r.id === record.id ? updated : r)
  );
};


const updateReferralStatus = async (
  referralId: string,
  status: 'accepted' | 'declined'
) => {
  const referralRef = doc(db, "referrals", referralId);
  const snap = await getDoc(referralRef);
  if (!snap.exists()) return;

  const updatedData = {
    status,
    treatmentGiven: status === 'declined' ? 'Service declined' : snap.data().treatmentGiven
  };

  await updateDoc(referralRef, updatedData);

  setHospitalReferrals(prev =>
    prev.map(r =>
      r.id === referralId
        ? { ...r, ...updatedData }
        : r
    )
  );
};


const markNotificationAsRead = async (notificationId: string) => {
  const notifRef = doc(db, "notifications", notificationId);
  await updateDoc(notifRef, { read: true });

  setHospitalNotifications(prev =>
    prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
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