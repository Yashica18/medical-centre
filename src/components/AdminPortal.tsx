import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, CheckCircle, XCircle, AlertCircle, Clock, Trash2, 
  MapPin, Phone, RefreshCw, Loader2, Plus, Filter, Mail, Edit2, 
  X, User, Shield, ArrowRight, Activity, Users, FileText, Database 
} from 'lucide-react';
import { Appointment, ActiveTab, Doctor, Department } from '../types';
import { DOCTORS, DEPARTMENTS } from '../data';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { dbService } from '../dbService';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import AuthSection from './AuthSection';
import firebaseConfig from '../../firebase-applet-config.json';

interface AdminPortalProps {
  user: any;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function AdminPortal({ user, setActiveTab }: AdminPortalProps) {
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Cancelled'>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  // Add Booking Form Mode
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newDeptId, setNewDeptId] = useState('');
  const [newDocId, setNewDocId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Editing Mode
  const [editingBooking, setEditingBooking] = useState<Appointment | null>(null);
  const [editDocId, setEditDocId] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editStatus, setEditStatus] = useState<'Confirmed' | 'Cancelled'>('Confirmed');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Load all bookings
  const loadAllBookings = async () => {
    if (!user || user.email !== 'yashicajindal1806@gmail.com') return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      const bookingsList = await dbService.getAppointments(user);
      // Sort newest first
      bookingsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(bookingsList);
    } catch (e: any) {
      console.error('Error fetching all bookings:', e);
      setErrorMsg(`Failed to retrieve bookings: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.email === 'yashicajindal1806@gmail.com') {
      loadAllBookings();
    }
  }, [user]);

  const handleSeedAppointments = async () => {
    if (!user) return;
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const sampleBookings: Appointment[] = [
      {
        id: 'SMC-8B9A1',
        userId: user.uid,
        patientName: 'Ramesh Kumar',
        patientEmail: 'ramesh.kumar@example.com',
        patientPhone: '+91 98765 43210',
        departmentId: 'cardiology',
        doctorId: 'doc-1',
        date: '2026-07-15',
        timeSlot: '09:00 AM - 09:30 AM',
        notes: 'Routine cardiovascular follow-up. Patient reports occasional mild palpitations.',
        status: 'Confirmed',
        createdAt: new Date().toLocaleString()
      },
      {
        id: 'SMC-3F7C2',
        userId: user.uid,
        patientName: 'Priya Sharma',
        patientEmail: 'priya.sharma@example.com',
        patientPhone: '+91 91234 56789',
        departmentId: 'neurology',
        doctorId: 'doc-3',
        date: '2026-07-16',
        timeSlot: '11:30 AM - 12:00 PM',
        notes: 'Follow-up consultation for migraine therapy management and lifestyle counseling.',
        status: 'Confirmed',
        createdAt: new Date().toLocaleString()
      },
      {
        id: 'SMC-4D9E3',
        userId: user.uid,
        patientName: 'Aarav Mehta',
        patientEmail: 'aarav.mehta@example.com',
        patientPhone: '+91 99887 76655',
        departmentId: 'orthopedics',
        doctorId: 'doc-2',
        date: '2026-07-17',
        timeSlot: '02:00 PM - 02:30 PM',
        notes: 'Post-operative orthopedic knee assessment following physiotherapy course.',
        status: 'Confirmed',
        createdAt: new Date().toLocaleString()
      },
      {
        id: 'SMC-9A1B4',
        userId: user.uid,
        patientName: 'Sneha Patel',
        patientEmail: 'sneha.patel@example.com',
        patientPhone: '+91 98989 89898',
        departmentId: 'pediatrics',
        doctorId: 'doc-4',
        date: '2026-07-18',
        timeSlot: '04:30 PM - 05:00 PM',
        notes: 'Annual pediatric health checkup, growth chart assessment, and vaccinations.',
        status: 'Confirmed',
        createdAt: new Date().toLocaleString()
      },
      {
        id: 'SMC-5C8D2',
        userId: user.uid,
        patientName: 'Vikram Singh',
        patientEmail: 'vikram.singh@example.com',
        patientPhone: '+91 95432 10987',
        departmentId: 'cardiology',
        doctorId: 'doc-1',
        date: '2026-07-19',
        timeSlot: '10:00 AM - 10:30 AM',
        notes: 'Primary screening consultation and clinical ECG review.',
        status: 'Cancelled',
        createdAt: new Date().toLocaleString()
      }
    ];

    try {
      console.log('Seeding 5 realistic medical appointments...');
      for (const booking of sampleBookings) {
        await dbService.saveAppointment(booking, user);
      }
      setSuccessMsg('Successfully seeded 5 realistic medical appointments into your database/sandbox!');
      setBookings(sampleBookings);
    } catch (e: any) {
      console.error('Error seeding appointments:', e);
      setErrorMsg(`Failed to seed appointments: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Cancel Appointment
  const handleToggleStatus = async (booking: Appointment) => {
    const nextStatus = booking.status === 'Confirmed' ? 'Cancelled' : 'Confirmed';
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await dbService.updateAppointment(booking.id, { status: nextStatus }, user);
      setSuccessMsg(`Successfully marked booking ${booking.id} as ${nextStatus}!`);
      
      // Update local state
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: nextStatus } : b));
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e: any) {
      console.error('Error updating status:', e);
      setErrorMsg(`Error updating booking status: ${e.message}`);
    }
  };

  // Handle Delete Appointment
  const handleDeleteBooking = (id: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    setDeleteConfirmId(id);
  };

  const executeDeleteBooking = async (id: string) => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await dbService.deleteAppointment(id, user);
      setSuccessMsg(`Successfully deleted booking ${id} permanently!`);
      
      // Update local state
      setBookings(prev => prev.filter(b => b.id !== id));
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e: any) {
      console.error('Error deleting booking:', e);
      setErrorMsg(`Error deleting booking: ${e.message}`);
    }
  };

  // Handle Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const updates = {
      doctorId: editDocId,
      date: editDate,
      timeSlot: editTimeSlot,
      status: editStatus
    };

    try {
      await dbService.updateAppointment(editingBooking.id, updates, user);
      setSuccessMsg(`Successfully updated booking ${editingBooking.id}!`);
      
      // Update local state
      setBookings(prev => prev.map(b => b.id === editingBooking.id ? { ...b, ...updates } : b));
      setEditingBooking(null);
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e: any) {
      console.error('Error saving edits:', e);
      setErrorMsg(`Failed to save edits: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Add Booking Submit
  const handleAddBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newPatientName.trim() || !newPatientEmail.trim() || !newPatientPhone.trim()) {
      setErrorMsg('Please fill in all basic patient fields.');
      return;
    }
    if (!newDeptId || !newDocId || !newDate || !newTimeSlot) {
      setErrorMsg('Please select Department, Doctor, Date, and Time Slot.');
      return;
    }

    setIsSaving(true);

    // Generate unique code: SMC-XXXXX (5 capital alphanumeric characters)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randCode = '';
    for (let i = 0; i < 5; i++) {
      randCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const confirmationId = `SMC-${randCode}`;

    const newAppointment: Appointment = {
      id: confirmationId,
      userId: user.uid, // Created by the logged-in Admin uid
      patientName: newPatientName.trim(),
      patientEmail: newPatientEmail.trim(),
      patientPhone: newPatientPhone.trim(),
      departmentId: newDeptId,
      doctorId: newDocId,
      date: newDate,
      timeSlot: newTimeSlot,
      notes: newNotes.trim() || '',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    try {
      await dbService.saveAppointment(newAppointment, user);
      setSuccessMsg(`New booking created successfully! Code: ${confirmationId}`);
      
      // Update local state
      setBookings(prev => [newAppointment, ...prev]);
      
      // Reset Form fields
      setNewPatientName('');
      setNewPatientEmail('');
      setNewPatientPhone('');
      setNewDeptId('');
      setNewDocId('');
      setNewDate('');
      setNewTimeSlot('');
      setNewNotes('');
      setShowAddForm(false);
      
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (e: any) {
      console.error('Firestore admin write failed:', e);
      setErrorMsg(`Failed to create booking: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Setup Edit states when opening edit panel
  const startEdit = (booking: Appointment) => {
    setEditingBooking(booking);
    setEditDocId(booking.doctorId);
    setEditDate(booking.date);
    setEditTimeSlot(booking.timeSlot);
    setEditStatus(booking.status);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Helper getters
  const getDoctorName = (docId: string) => {
    return DOCTORS.find(d => d.id === docId)?.name || docId;
  };

  const getDeptName = (deptId: string) => {
    return DEPARTMENTS.find(d => d.id === deptId)?.name || deptId;
  };

  // Filtered list
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.patientPhone.includes(searchTerm) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesDept = deptFilter === 'All' || b.departmentId === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Calculate high-level stats
  const totalCount = bookings.length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;
  const distinctPatients = new Set(bookings.map(b => b.patientEmail.toLowerCase())).size;

  // Filter doctors based on currently selected dept in Add form
  const availableDoctors = DOCTORS.filter(d => d.departmentId === newDeptId);

  // Available slots (for simulation/selection)
  const simulatedTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  // Auth Protection Guard
  if (!user) {
    return (
      <div className="py-16 bg-gray-50/50 flex flex-col justify-center items-center min-h-[70vh] px-4">
        <div className="max-w-md w-full bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-center mb-6">
          <Shield className="w-12 h-12 text-brand-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-gray-900">Administrator Access Needed</h3>
          <p className="text-xs text-gray-500 mt-1 mb-2">
            Please sign in with your verified administrative credentials to view clinical dashboards.
          </p>
        </div>
        <AuthSection onSuccess={() => {}} />
      </div>
    );
  }

  // Not Admin guard
  if (user.email !== 'yashicajindal1806@gmail.com') {
    return (
      <div className="py-20 bg-gray-50/50 flex flex-col justify-center items-center min-h-[70vh] px-4">
        <div className="max-w-md w-full bg-white border border-gray-150 p-8 rounded-3xl shadow-sm text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-gray-900">Clinical Authorization Required</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Your current account (<span className="font-mono text-xs font-semibold text-gray-700">{user.email}</span>) does not have system administrator privileges.
          </p>
          <div className="mt-6 p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-left text-xs space-y-1">
            <span className="font-bold text-gray-700 block">Authorized Admin:</span>
            <span className="font-mono block">yashicajindal1806@gmail.com</span>
          </div>
          <button
            onClick={() => setActiveTab('home')}
            className="mt-6 w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50/50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-150 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200/50 text-[10px] font-bold uppercase rounded-md tracking-wider">
                System Superuser
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-semibold text-gray-400">
                Database Connection: SECURE LIVE FIRESTORE
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Clinical Control Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Authorized personnel console for managing Sanjeevani patient appointments, calendars, and clinical rosters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllBookings}
              disabled={isLoading}
              className="p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold"
              title="Refresh database collections"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Sync DB
            </button>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingBooking(null);
              }}
              className="px-4 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Patient Booking
            </button>
          </div>
        </div>

        {/* Global Success / Error Messages */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-150 text-emerald-900 text-xs sm:text-sm rounded-xl flex items-center gap-3 shadow-inner animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-150 text-red-900 text-xs sm:text-sm rounded-xl flex items-start gap-3 shadow-inner animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Execution Incident Detected</span>
              <p className="font-light leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Clinical Statistics Overview Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Clinician Bookings</span>
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-gray-900 block font-mono">
                {isLoading ? '...' : totalCount}
              </span>
              <span className="text-[10px] text-gray-400">cumulative transactions</span>
            </div>
          </div>

          <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Confirmed</span>
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 block font-mono">
                {isLoading ? '...' : confirmedCount}
              </span>
              <span className="text-[10px] text-emerald-600">scheduled consultations</span>
            </div>
          </div>

          <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cancelled / Released</span>
              <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-red-500 block font-mono">
                {isLoading ? '...' : cancelledCount}
              </span>
              <span className="text-[10px] text-red-400">released slots</span>
            </div>
          </div>

          <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Distinct Patients</span>
              <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-gray-800 block font-mono">
                {isLoading ? '...' : distinctPatients}
              </span>
              <span className="text-[10px] text-gray-400">individual clinical profiles</span>
            </div>
          </div>
        </div>

        {/* Add New Booking Form */}
        {showAddForm && (
          <div className="mb-8 bg-white border border-teal-500/30 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-150 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-teal-50 text-teal-700 rounded-lg">🆕</span>
                <h3 className="font-display font-extrabold text-base text-gray-900 uppercase tracking-wider">
                  Create Clinical Booking (Admin Override)
                </h3>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Anshul Sharma"
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 rounded-xl text-xs sm:text-sm font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="anshul@gmail.com"
                      value={newPatientEmail}
                      onChange={(e) => setNewPatientEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 rounded-xl text-xs sm:text-sm font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Mobile Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 rounded-xl text-xs sm:text-sm font-sans"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Department</label>
                  <select
                    value={newDeptId}
                    onChange={(e) => {
                      setNewDeptId(e.target.value);
                      setNewDocId(''); // Clear selected doctor as dept changed
                    }}
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:border-brand-500 font-sans"
                    required
                  >
                    <option value="">-- Choose Department --</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Doctor Assignment</label>
                  <select
                    value={newDocId}
                    onChange={(e) => setNewDocId(e.target.value)}
                    disabled={!newDeptId}
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:border-brand-500 font-sans disabled:bg-gray-100 disabled:opacity-75"
                    required
                  >
                    <option value="">-- Select Doctor --</option>
                    {availableDoctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} ({doc.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Appointment Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:border-brand-500 font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Clinical Time Slot</label>
                  <select
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs sm:text-sm bg-white focus:border-brand-500 font-sans"
                    required
                  >
                    <option value="">-- Select Slot --</option>
                    {simulatedTimeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Clinical Symptoms / Comments</label>
                <textarea
                  rows={2}
                  placeholder="Patient complaining of chronic chest irritation, referred by Dr. Mehta..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-3 border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 rounded-xl text-xs sm:text-sm font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/10 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Administrative Booking
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Active Booking Panel */}
        {editingBooking && (
          <div className="mb-8 bg-amber-50/50 border border-amber-300 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-amber-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">⚙️</span>
                <h3 className="font-display font-extrabold text-base text-amber-900 uppercase tracking-wider">
                  Modify Appointment ({editingBooking.id})
                </h3>
              </div>
              <button
                onClick={() => setEditingBooking(null)}
                className="p-1.5 hover:bg-amber-100 rounded-xl text-amber-500 hover:text-amber-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white/70 rounded-xl border border-amber-200 text-xs space-y-1.5">
              <p><span className="font-bold text-gray-500">Patient Profile:</span> <span className="font-bold text-gray-800">{editingBooking.patientName}</span> ({editingBooking.patientEmail})</p>
              <p><span className="font-bold text-gray-500">Department:</span> {getDeptName(editingBooking.departmentId)}</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">Clinician Assigned</label>
                  <select
                    value={editDocId}
                    onChange={(e) => setEditDocId(e.target.value)}
                    className="w-full p-3 border border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm bg-white font-sans"
                    required
                  >
                    {DOCTORS.filter(d => d.departmentId === editingBooking.departmentId).map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">Appointment Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full p-3 border border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm bg-white font-sans"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">Scheduled Slot</label>
                  <select
                    value={editTimeSlot}
                    onChange={(e) => setEditTimeSlot(e.target.value)}
                    className="w-full p-3 border border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm bg-white font-sans"
                    required
                  >
                    {simulatedTimeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">Clinical Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full p-3 border border-amber-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 rounded-xl text-xs sm:text-sm bg-white font-sans font-bold text-gray-800"
                    required
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/10 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Apply Database Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Database Search, Filters & Table Control Container */}
        <div className="bg-white border border-gray-150 rounded-3xl shadow-xs overflow-hidden">
          
          {/* Action Bar / Filters bar */}
          <div className="p-5 sm:p-6 bg-gray-50/50 border-b border-gray-150 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Patient name, email, phone or confirmation ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-brand-500 rounded-2xl text-xs sm:text-sm bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-1.5">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="text-xs bg-transparent border-none focus:ring-0 py-0 pl-0 pr-6 font-semibold text-gray-700 cursor-pointer font-sans"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-1.5">Dept:</span>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="text-xs bg-transparent border-none focus:ring-0 py-0 pl-0 pr-6 font-semibold text-gray-700 cursor-pointer font-sans"
                >
                  <option value="All">All Departments</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Database Content Table */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Querying Secure Database Collections...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-150 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-4.5 px-6">ID & Date</th>
                    <th className="py-4.5 px-6">Patient Profile</th>
                    <th className="py-4.5 px-6">Assigned Clinician / Specialty</th>
                    <th className="py-4.5 px-6">Schedule</th>
                    <th className="py-4.5 px-6 text-center">Status</th>
                    <th className="py-4.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {filteredBookings.map((booking) => {
                    const isCancelled = booking.status === 'Cancelled';
                    return (
                      <tr 
                        key={booking.id} 
                        className={`hover:bg-gray-50/50 transition-colors ${isCancelled ? 'bg-red-50/10' : ''}`}
                      >
                        <td className="py-4 px-6 font-medium">
                          <span className="font-mono text-xs font-bold text-gray-900 block">{booking.id}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Booked: {booking.createdAt}</span>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="space-y-0.5">
                            <span className="font-bold text-gray-800 block text-sm">{booking.patientName}</span>
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                              <Mail className="w-3 h-3 text-gray-300" />
                              {booking.patientEmail}
                            </span>
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-gray-300" />
                              {booking.patientPhone}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-gray-800 block">{getDoctorName(booking.doctorId)}</span>
                            <span className="text-[10px] bg-brand-50 text-brand-700 border border-brand-100 px-2 py-0.5 rounded-md inline-block uppercase tracking-wider font-bold">
                              {getDeptName(booking.departmentId)}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-medium">
                          <div className="space-y-0.5">
                            <span className="text-gray-800 block">{booking.date}</span>
                            <span className="text-gray-400 text-[11px] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-300" />
                              {booking.timeSlot}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isCancelled 
                              ? 'bg-red-50 text-red-700 border border-red-200/50' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isCancelled ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                            {booking.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => startEdit(booking)}
                              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-amber-600 transition-colors"
                              title="Modify booking schedule"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(booking)}
                              className={`p-2 hover:bg-gray-100 rounded-xl transition-colors ${
                                isCancelled 
                                  ? 'text-gray-400 hover:text-emerald-600' 
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                              title={isCancelled ? "Re-confirm booking" : "Release / Cancel booking"}
                            >
                              {isCancelled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete booking permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-gray-50/20 rounded-2xl">
              {bookings.length === 0 ? (
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                    <Database className="w-8 h-8 animate-pulse text-brand-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-gray-800 text-sm uppercase tracking-wider">Live Firestore is Empty</h3>
                    <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                      Your database in project <code className="bg-gray-150 px-1 py-0.5 rounded text-[10px] font-semibold">{firebaseConfig.projectId || 'sanjeevani-medical-centre'}</code> is currently empty. Seed 5 realistic appointments instantly!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSeedAppointments}
                    className="inline-flex items-center gap-1.5 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    🚀 Seed 5 Sample Bookings
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-gray-800 text-sm">No Records Found</h3>
                  <p className="text-xs text-gray-400 font-light">
                    We couldn't find any appointments matching your active search filters.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Database Footer Status */}
          <div className="p-4 bg-gray-50 border-t border-gray-150 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <span>Displaying {filteredBookings.length} of {bookings.length} database logs</span>
            <span>Security context: AES-256</span>
          </div>

        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-gray-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 transform scale-100 transition-all">
              <div className="flex items-center gap-3 text-red-600">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-2xl">
                  <Trash2 className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base uppercase tracking-wider text-gray-900">
                    Delete Appointment?
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Database Action Required</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Are you sure you want to <span className="font-bold text-red-600">permanently delete</span> appointment <code className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">{deleteConfirmId}</code>?
                </p>
                <p className="text-[11px] text-gray-400">
                  This action cannot be undone and will permanently remove this record from our clinic database.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    executeDeleteBooking(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
