export interface Doctor {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  experience: number; // in years
  qualification: string;
  languages: string[];
  rating: number;
  reviewsCount: number;
  availability: string[]; // e.g., ["Mon", "Tue", "Wed", "Thu", "Fri"]
  timeSlots: string[]; // e.g., ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
  imageUrl: string;
  bio: string;
}

export interface Department {
  id: string;
  name: string;
  icon: string; // Name of the lucide-react icon
  description: string;
  longDescription: string;
  services: string[];
  location: string;
  phone: string;
}

export interface Appointment {
  id: string; // Confirmation Code: SMC-XXXXX
  userId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  departmentId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
  emailNotificationsEnabled?: boolean;
}

export type ActiveTab = 'home' | 'about' | 'departments' | 'doctors' | 'booking' | 'tracker' | 'admin';
