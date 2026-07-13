import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { Appointment } from './types';

// Storage keys
const LOCAL_STORAGE_KEY = 'sanjeevani_appointments_v1';

// Helper to get local appointments
export function getLocalAppointments(): Appointment[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading local appointments:', err);
    return [];
  }
}

// Helper to save local appointments
export function saveLocalAppointments(appts: Appointment[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appts));
  } catch (err) {
    console.error('Error saving local appointments:', err);
  }
}

// Unified Database Service
export const dbService = {
  // 1. Fetch appointments
  getAppointments: async (user: any): Promise<Appointment[]> => {
    if (!user) return [];

    if (user.isDemo) {
      const allLocal = getLocalAppointments();
      if (user.email === 'yashicajindal1806@gmail.com') {
        // Admin gets all
        return allLocal;
      } else {
        // Patient gets their own
        return allLocal.filter(a => a.userId === user.uid);
      }
    }

    try {
      if (user.email === 'yashicajindal1806@gmail.com') {
        // Admin query all
        const querySnapshot = await getDocs(collection(db, 'appointments'));
        const list: Appointment[] = [];
        querySnapshot.forEach(docSnap => {
          list.push(docSnap.data() as Appointment);
        });
        return list;
      } else {
        // Patient query specific
        const q = query(
          collection(db, 'appointments'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const list: Appointment[] = [];
        querySnapshot.forEach(docSnap => {
          list.push(docSnap.data() as Appointment);
        });
        return list;
      }
    } catch (err) {
      console.error('Firestore getAppointments failed, falling back to localStorage:', err);
      const allLocal = getLocalAppointments();
      if (user.email === 'yashicajindal1806@gmail.com') {
        return allLocal;
      } else {
        return allLocal.filter(a => a.userId === user.uid);
      }
    }
  },

  // 2. Get single appointment by ID
  getAppointmentById: async (id: string, user: any): Promise<Appointment | null> => {
    if (user?.isDemo) {
      const allLocal = getLocalAppointments();
      return allLocal.find(a => a.id === id) || null;
    }

    try {
      const docRef = doc(db, 'appointments', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Appointment;
      }
      return null;
    } catch (err) {
      console.error('Firestore getAppointmentById failed, falling back to localStorage:', err);
      const allLocal = getLocalAppointments();
      return allLocal.find(a => a.id === id) || null;
    }
  },

  // 3. Create or save appointment
  saveAppointment: async (appointment: Appointment, user: any): Promise<void> => {
    // Always save to localStorage as a redundant local backup
    const allLocal = getLocalAppointments();
    const index = allLocal.findIndex(a => a.id === appointment.id);
    if (index >= 0) {
      allLocal[index] = appointment;
    } else {
      allLocal.push(appointment);
    }
    saveLocalAppointments(allLocal);

    if (user?.isDemo) {
      return;
    }

    try {
      await setDoc(doc(db, 'appointments', appointment.id), appointment);
    } catch (err) {
      console.error('Firestore saveAppointment failed, saved to localStorage only:', err);
    }
  },

  // 4. Update appointment
  updateAppointment: async (id: string, updates: Partial<Appointment>, user: any): Promise<void> => {
    // Update local storage backup
    const allLocal = getLocalAppointments();
    const index = allLocal.findIndex(a => a.id === id);
    if (index >= 0) {
      allLocal[index] = { ...allLocal[index], ...updates };
      saveLocalAppointments(allLocal);
    }

    if (user?.isDemo) {
      return;
    }

    try {
      const docRef = doc(db, 'appointments', id);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.error('Firestore updateAppointment failed:', err);
    }
  },

  // 5. Delete appointment
  deleteAppointment: async (id: string, user: any): Promise<void> => {
    // Delete from local storage backup
    const allLocal = getLocalAppointments();
    const filtered = allLocal.filter(a => a.id !== id);
    saveLocalAppointments(filtered);

    if (user?.isDemo) {
      return;
    }

    try {
      const docRef = doc(db, 'appointments', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Firestore deleteAppointment failed:', err);
    }
  }
};
