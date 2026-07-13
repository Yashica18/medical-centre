import React, { useState, useEffect } from 'react';
import { Search, Calendar, CheckCircle, XCircle, AlertCircle, Clock, Trash2, MapPin, Phone, RefreshCw, Loader2 } from 'lucide-react';
import { Appointment, ActiveTab } from '../types';
import { DOCTORS, DEPARTMENTS } from '../data';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { dbService } from '../dbService';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import AuthSection from './AuthSection';

interface AppointmentTrackerProps {
  searchCode: string;
  setSearchCode: (code: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  user: any;
}

export default function AppointmentTracker({
  searchCode,
  setSearchCode,
  setActiveTab,
  user
}: AppointmentTrackerProps) {
  const [searchInput, setSearchInput] = useState('');
  const [foundAppointment, setFoundAppointment] = useState<Appointment | null>(null);
  const [recentBookings, setRecentBookings] = useState<Appointment[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Read all bookings for "Recent Bookings" component list via dbService
  const loadRecentBookings = async () => {
    if (!user) return;
    setIsLoadingBookings(true);

    try {
      const bookingsList = await dbService.getAppointments(user);
      // Sort newest first
      bookingsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentBookings(bookingsList);
    } catch (e) {
      console.error('Error fetching bookings:', e);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadRecentBookings();
    }
  }, [user]);

  // Sync state if a search code is pushed from booking success
  useEffect(() => {
    if (searchCode && user) {
      setSearchInput(searchCode);
      handleSearchCode(searchCode);
    }
  }, [searchCode, user]);

  const handleSearchCode = async (code: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!code.trim()) {
      setErrorMsg('Please enter an appointment confirmation code.');
      setFoundAppointment(null);
      return;
    }

    try {
      const appt = await dbService.getAppointmentById(code.trim().toUpperCase(), user);
      
      if (appt) {
        const isAdmin = user.email === 'yashicajindal1806@gmail.com';
        if (appt.userId === user.uid || isAdmin) {
          setFoundAppointment(appt);
        } else {
          setErrorMsg('You do not have permission to view this appointment.');
          setFoundAppointment(null);
        }
      } else {
        setErrorMsg('No appointment found with this code. Double-check your code (e.g., SMC-ABCDE).');
        setFoundAppointment(null);
      }
    } catch (e) {
      setErrorMsg('Error retrieving bookings from database.');
      console.error(e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchCode(searchInput);
  };

  const handleQuickLoad = (code: string) => {
    setSearchInput(code);
    setSearchCode(code);
    handleSearchCode(code);
  };

  // Cancel / Delete appointment in Firestore
  const handleCancelAppointment = async () => {
    if (!foundAppointment) return;

    try {
      await dbService.updateAppointment(foundAppointment.id, { status: 'Cancelled' }, user);
      
      // Update active viewing states
      setFoundAppointment(prev => prev ? { ...prev, status: 'Cancelled' as const } : null);
      setSuccessMsg('Your appointment has been successfully cancelled.');
      
      // Reload recent list
      await loadRecentBookings();
    } catch (e) {
      setErrorMsg('Could not process cancellation request.');
      console.error(e);
    }
  };

  // Helper properties
  const getDoctorName = (docId: string) => {
    return DOCTORS.find(d => d.id === docId)?.name || 'Consulting Doctor';
  };

  const getDeptInfo = (deptId: string) => {
    return DEPARTMENTS.find(d => d.id === deptId);
  };

  if (!user) {
    return (
      <div className="py-12 sm:py-16 bg-gray-50/50 flex flex-col justify-center items-center min-h-[60vh]">
        <AuthSection onSuccess={() => {}} />
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
            Patient Portal
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Your Booking
          </h2>
          <p className="text-sm text-gray-400 font-light mt-1">
            Enter your Sanjeevani confirmation code to review timing, directions, or cancel your booking instantly.
          </p>
        </div>

        {/* Search Panel Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Enter Confirmation Code (e.g., SMC-XXXXX)
            </label>
            <div className="flex gap-2.5">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="SMC-XXXXX"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-500 font-mono font-bold tracking-wider placeholder:font-sans placeholder:font-normal placeholder:tracking-normal text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-brand-600/15 cursor-pointer"
              >
                Track Slot
              </button>
            </div>
          </form>

          {/* Messages */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-xl flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-start gap-2.5 text-xs">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-500 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Found Appointment details display */}
          {foundAppointment && (
            <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-2xs animate-fade-in bg-white">
              
              {/* Header inside tracker card */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4 border-b border-gray-150 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Appointment Status</span>
                  <div className="flex items-center gap-1.5">
                    {foundAppointment.status === 'Confirmed' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        ● Slot Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                        ✕ Cancelled
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">CONFIRMATION</span>
                  <span className="font-mono font-bold text-sm text-gray-800">{foundAppointment.id}</span>
                </div>
              </div>

              {/* Patient Details */}
              <div className="p-6 space-y-6">
                
                {/* Visual Details Grid */}
                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">Patient Details</span>
                      <strong className="text-gray-800 text-base mt-1 block font-display">{foundAppointment.patientName}</strong>
                      <p className="text-xs text-gray-500 mt-1">Mobile: {foundAppointment.patientPhone}</p>
                      <p className="text-xs text-gray-500">Email: {foundAppointment.patientEmail}</p>
                    </div>

                    {foundAppointment.notes && (
                      <div>
                        <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">Patient Notes</span>
                        <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-1 italic font-light">
                          "{foundAppointment.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-6">
                    <div>
                      <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">Medical Officer</span>
                      <strong className="text-gray-800 text-sm mt-1 block">{getDoctorName(foundAppointment.doctorId)}</strong>
                      <span className="text-[11px] text-brand-600 font-medium block mt-0.5">
                        {getDeptInfo(foundAppointment.departmentId)?.name}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">Schedule Time & Location</span>
                      <div className="flex items-center gap-1.5 text-xs text-gray-800 font-semibold mt-1">
                        <Calendar className="w-4 h-4 text-brand-500" />
                        <span>{foundAppointment.date}</span>
                        <Clock className="w-4 h-4 text-brand-500 ml-2" />
                        <span>{foundAppointment.timeSlot}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{getDeptInfo(foundAppointment.departmentId)?.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Advisory */}
                <div className="bg-brand-50/40 p-4 rounded-xl border border-brand-100/25 text-xs text-gray-600 flex items-start gap-2.5">
                  <Clock className="w-4.5 h-4.5 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-brand-900 block font-semibold mb-0.5">Patient Advisory</strong>
                    Please carry past doctor notes, prescription charts, or test records if any. Report to the OPD reception counter at least 15 minutes prior to your slot.
                  </div>
                </div>

                {/* Cancel Trigger */}
                {foundAppointment.status === 'Confirmed' && (
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Cancel Appointment Slot
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Recent device activity */}
        <div className="mt-8 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4">
          <h4 className="font-display font-bold text-sm text-gray-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>📋 Your Appointment History</span>
            </span>
            <button 
              onClick={loadRecentBookings} 
              disabled={isLoadingBookings}
              className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh booking list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBookings ? 'animate-spin' : ''}`} />
            </button>
          </h4>
          
          {isLoadingBookings ? (
            <div className="flex items-center justify-center py-6 gap-2 text-xs text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
              <span>Retrieving from secure database...</span>
            </div>
          ) : recentBookings.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentBookings.slice(0, 5).map((booking) => {
                const isCancelled = booking.status === 'Cancelled';
                return (
                  <div 
                    key={booking.id}
                    className="py-3 flex justify-between items-center gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-gray-800">{booking.patientName}</strong>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                          isCancelled 
                            ? 'bg-red-50 text-red-600' 
                            : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-0.5">
                        {getDoctorName(booking.doctorId)} • {booking.date} at {booking.timeSlot}
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleQuickLoad(booking.id)}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-brand-50 text-gray-600 hover:text-brand-700 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      Load Code: <span className="font-mono">{booking.id}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-gray-400">
              No appointments found for this account yet.
            </div>
          )}
        </div>

      </div>

      {/* Cancel Appointment Confirmation Modal */}
      {showCancelConfirm && foundAppointment && (
        <div className="fixed inset-0 bg-gray-900/65 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6 transform scale-100 transition-all">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-2xl">
                <XCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base uppercase tracking-wider text-gray-900">
                  Cancel Appointment?
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Patient Confirmation</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                Are you sure you want to cancel the appointment <strong className="font-bold text-gray-800">{foundAppointment.id}</strong> scheduled for <strong className="font-bold text-gray-800">{foundAppointment.patientName}</strong>?
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                This will release your chosen clinician slot and mark this booking as Cancelled in the clinic system.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCancelAppointment();
                  setShowCancelConfirm(false);
                }}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
