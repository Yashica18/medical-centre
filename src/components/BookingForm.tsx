import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, FileText, CheckCircle, ArrowLeft, ArrowRight, ShieldAlert, Clock, AlertTriangle, Bell, BellRing } from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Appointment, ActiveTab, Doctor, Department } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { dbService } from '../dbService';
import { doc, setDoc } from 'firebase/firestore';
import AuthSection from './AuthSection';

interface BookingFormProps {
  preSelectedDeptId: string;
  preSelectedDocId: string;
  setActiveTab: (tab: ActiveTab) => void;
  setSearchCode?: (code: string) => void;
  resetPreSelections: () => void;
  user: any;
}

export default function BookingForm({
  preSelectedDeptId,
  preSelectedDocId,
  setActiveTab,
  setSearchCode,
  resetPreSelections,
  user
}: BookingFormProps) {
  // Step-based state: 1 - Dept & Doc, 2 - Date & Time, 3 - Patient Details, 4 - Success
  const [step, setStep] = useState(1);
  
  // Selected state
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
  // Patient details
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [getEmailNotifications, setGetEmailNotifications] = useState(true);

  // Local validation and helpers
  const [validationError, setValidationError] = useState('');
  const [dateWarning, setDateWarning] = useState('');
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [emailStatus, setEmailStatus] = useState<'sending' | 'success' | 'failed' | null>(null);
  const [emailMessage, setEmailMessage] = useState('');

  // Sync pre-selected data if arriving from other tabs
  useEffect(() => {
    if (preSelectedDeptId) {
      setSelectedDeptId(preSelectedDeptId);
    }
    if (preSelectedDocId) {
      setSelectedDocId(preSelectedDocId);
    }
  }, [preSelectedDeptId, preSelectedDocId]);

  // Reset doc if department changes (unless preselected matches)
  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    setSelectedDocId('');
    setSelectedDate('');
    setSelectedTimeSlot('');
    setValidationError('');
    setDateWarning('');
  };

  const handleDocChange = (docId: string) => {
    setSelectedDocId(docId);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setValidationError('');
    setDateWarning('');
  };

  // Get active lists
  const availableDoctors = selectedDeptId 
    ? DOCTORS.filter(d => d.departmentId === selectedDeptId) 
    : [];

  const selectedDoctor = DOCTORS.find(d => d.id === selectedDocId);
  const selectedDepartment = DEPARTMENTS.find(d => d.id === selectedDeptId);

  // Date picker limit: Today to 30 days in future
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDateString = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // Validate doctor day availability when date changes
  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTimeSlot('');
    setValidationError('');
    setDateWarning('');

    if (!dateStr || !selectedDoctor) return;

    // Days map: 0 = Sun, 1 = Mon ...
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dateObj = new Date(dateStr);
    const dayName = daysMap[dateObj.getDay()];

    const isAvailable = selectedDoctor.availability.includes(dayName);

    if (!isAvailable) {
      setDateWarning(
        `Note: ${selectedDoctor.name} is usually not available on ${dayName}s. Normal availability: ${selectedDoctor.availability.join(', ')}.`
      );
    }
  };

  // Step Navigations
  const goToStep2 = () => {
    if (!selectedDeptId) {
      setValidationError('Please select a medical department.');
      return;
    }
    if (!selectedDocId) {
      setValidationError('Please select a consulting doctor.');
      return;
    }
    setValidationError('');
    setStep(2);
  };

  const goToStep3 = () => {
    if (!selectedDate) {
      setValidationError('Please choose a preferred date.');
      return;
    }
    if (!selectedTimeSlot) {
      setValidationError('Please select an available time slot.');
      return;
    }

    // Double check availability override
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dateObj = new Date(selectedDate);
    const dayName = daysMap[dateObj.getDay()];
    
    if (selectedDoctor && !selectedDoctor.availability.includes(dayName)) {
      // Just flag warning in step 2, but let them schedule if they insist (telemedicine, emergency)
    }

    setValidationError('');
    setStep(3);
  };

  if (!user) {
    return (
      <div className="py-12 sm:py-16 bg-gray-50/50 flex flex-col justify-center items-center min-h-[60vh]">
        <AuthSection onSuccess={() => {}} />
      </div>
    );
  }

  const sendConfirmationEmail = async (appointment: Appointment) => {
    if (!appointment.emailNotificationsEnabled) {
      setEmailStatus(null);
      return;
    }

    setEmailStatus('sending');
    setEmailMessage('');

    try {
      const response = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointment }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailStatus('success');
        setEmailMessage(data.message || 'Confirmation email sent successfully.');
      } else {
        setEmailStatus('failed');
        setEmailMessage(data.error || data.message || 'Failed to send confirmation email.');
      }
    } catch (error) {
      console.error('Error calling send-confirmation API:', error);
      setEmailStatus('failed');
      setEmailMessage('Connection error: could not connect to email confirmation service.');
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!patientName.trim()) {
      setValidationError('Please enter patient full name.');
      return;
    }
    if (!patientEmail.trim()) {
      setValidationError('Please enter a contact email address.');
      return;
    }
    if (!patientPhone.trim()) {
      setValidationError('Please enter patient mobile phone number.');
      return;
    }

    // Generate unique code: SMC-XXXXX (5 capital alphanumeric characters)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randCode = '';
    for (let i = 0; i < 5; i++) {
      randCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const confirmationId = `SMC-${randCode}`;

    const newAppointment: Appointment = {
      id: confirmationId,
      userId: user.uid,
      patientName,
      patientEmail,
      patientPhone,
      departmentId: selectedDeptId,
      doctorId: selectedDocId,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      notes: patientNotes,
      status: 'Confirmed',
      createdAt: new Date().toLocaleString(),
      emailNotificationsEnabled: getEmailNotifications
    };

    // Save to Firestore / Local Storage via dbService
    try {
      await dbService.saveAppointment(newAppointment, user);
    } catch (err: any) {
      console.error('Appointment save failed:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setValidationError(`Database transaction failed (${msg}). Please try again.`);
      return;
    }

    setCreatedAppointment(newAppointment);
    setStep(4);
    resetPreSelections();
    sendConfirmationEmail(newAppointment);
  };

  const handleTrackDirect = () => {
    if (createdAppointment && setSearchCode) {
      setSearchCode(createdAppointment.id);
    }
    setActiveTab('tracker');
  };

  return (
    <div className="py-12 sm:py-16 bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Step Indicator Header (Hide if on Success Screen) */}
        {step < 4 && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
                Quick Portal
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Schedule Your OPD Consultation
              </h2>
              <p className="text-sm text-gray-400 font-light mt-1">
                Complete these 3 simple steps to secure an verified slot at Sanjeevani.
              </p>
            </div>

            {/* Stepper visual progress bar */}
            <div className="flex items-center justify-center gap-2">
              {[
                { s: 1, title: 'Expert' },
                { s: 2, title: 'Schedule' },
                { s: 3, title: 'Patient Info' }
              ].map((item) => (
                <React.Fragment key={item.s}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                      step === item.s 
                        ? 'bg-brand-600 border-brand-600 text-white shadow-xs shadow-brand-600/20' 
                        : step > item.s 
                          ? 'bg-brand-100 border-brand-200 text-brand-700' 
                          : 'bg-white border-gray-200 text-gray-400'
                    }`}>
                      {item.s}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:inline ${
                      step === item.s ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {item.title}
                    </span>
                  </div>
                  {item.s < 3 && (
                    <div className={`h-[1px] w-12 sm:w-20 transition-colors ${
                      step > item.s ? 'bg-brand-400' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}


        {/* Form panel cards */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          
          {/* Validation Alerts */}
          {validationError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-800 rounded-xl flex items-start gap-2.5 text-sm">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 1: Specialty & Doctor */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-display text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">
                Step 1: Choose Your Healthcare Expert
              </h3>

              {/* Department Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Select Medical Department *
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-500 text-sm"
                >
                  <option value="">-- Choose Department --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {/* Doctor Dropdown (Conditional on Department) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Select Consulting Specialist *
                </label>
                <select
                  value={selectedDocId}
                  onChange={(e) => handleDocChange(e.target.value)}
                  disabled={!selectedDeptId}
                  className="w-full p-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-500 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <option value="">
                    {!selectedDeptId ? 'Please select a department first' : '-- Choose Doctor --'}
                  </option>
                  {availableDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.name} ({doc.qualification})</option>
                  ))}
                </select>
              </div>

              {/* Mini Doctor Spotlight Card */}
              {selectedDoctor && (
                <div className="p-4 bg-brand-50/50 border border-brand-100/30 rounded-xl flex items-center gap-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                    <img 
                      src={selectedDoctor.imageUrl} 
                      alt={selectedDoctor.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-brand-900">Consulting Specialist</h5>
                    <h4 className="font-bold text-sm text-gray-900 mt-0.5">{selectedDoctor.name}</h4>
                    <p className="text-[11px] text-brand-700 font-medium">{selectedDoctor.role}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Availability: {selectedDoctor.availability.join(', ')}</p>
                  </div>
                </div>
              )}

              {/* Next Button */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={goToStep2}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Slot */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 focus:outline-none"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-display text-lg font-bold text-gray-900">
                  Step 2: Choose Date & Time
                </h3>
              </div>

              {/* Spotlight Info */}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <span>Doctor: <strong className="text-gray-800">{selectedDoctor?.name}</strong></span>
                <span>Dept: <strong className="text-gray-800">{selectedDepartment?.name}</strong></span>
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Preferred Appointment Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={getTodayDateString()}
                    max={getMaxDateString()}
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-500 text-sm"
                  />
                </div>
              </div>

              {/* Dynamic Doctor Availability Alerts */}
              {dateWarning && (
                <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl flex items-start gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
                  <span>{dateWarning}</span>
                </div>
              )}

              {/* Time Slots Selector */}
              {selectedDate && selectedDoctor && (
                <div className="space-y-3 animate-fade-in">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Select Available Consultation Hour *
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {selectedDoctor.timeSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 rounded-xl border text-center transition-all text-xs font-semibold cursor-pointer ${
                            isSelected
                              ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Clock className="w-3 h-3 inline mr-1 -mt-0.5" />
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goToStep3}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-600/10 hover:shadow-brand-600/20 hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Info */}
          {step === 3 && (
            <form onSubmit={handleBookingSubmit} className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 focus:outline-none"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-display text-lg font-bold text-gray-900">
                  Step 3: Enter Patient Credentials
                </h3>
              </div>

              {/* Summary recap bar */}
              <div className="text-xs text-gray-500 bg-teal-50/50 p-3 rounded-lg border border-teal-100/20 flex flex-wrap gap-4 justify-between items-center">
                <span>Doctor: <strong className="text-teal-900">{selectedDoctor?.name}</strong></span>
                <span>Date: <strong className="text-teal-900">{selectedDate}</strong></span>
                <span>Time: <strong className="text-teal-900">{selectedTimeSlot}</strong></span>
              </div>

              {/* Fields Grid */}
              <div className="grid gap-4">
                {/* Patient Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g., Ramesh Kumar"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-500 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email Address & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Contact Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="e.g., ramesh@gmail.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-500 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Mobile Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="e.g., 9876543210"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-500 text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Patient Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Symptoms or Medical Notes (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      placeholder="e.g., Chronic knee pain since 2 weeks, high fever, headache, etc."
                      value={patientNotes}
                      rows={3}
                      onChange={(e) => setPatientNotes(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-brand-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Email Notifications Toggle Switch */}
              <div className="p-4.5 bg-teal-50/30 border border-teal-100/20 rounded-2xl flex items-center justify-between gap-4 animate-fade-in">
                <div className="flex gap-3.5">
                  <div className={`p-2.5 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    getEmailNotifications ? 'bg-teal-100 text-teal-700 shadow-3xs' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {getEmailNotifications ? (
                      <BellRing className="w-4.5 h-4.5 animate-bounce text-teal-600" />
                    ) : (
                      <Bell className="w-4.5 h-4.5 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-2">
                      Get Email Notifications
                      {getEmailNotifications && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </h4>
                    <p className="text-gray-500 text-xs font-light leading-relaxed max-w-sm sm:max-w-md">
                      Receive an instant booking confirmation code, downloadable pre-consultation guidelines, and check-up reminders 2 hours before your slot.
                    </p>
                  </div>
                </div>

                {/* Styled Toggle switch button */}
                <button
                  type="button"
                  onClick={() => setGetEmailNotifications(!getEmailNotifications)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                    getEmailNotifications ? 'bg-teal-600' : 'bg-gray-200'
                  }`}
                  aria-pressed={getEmailNotifications}
                  title="Toggle Email Notifications"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      getEmailNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Submit / Back */}
              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-brand-600/20 hover:shadow-brand-600/35 hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
                >
                  Confirm Booking Now
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && createdAppointment && (
            <div className="text-center py-6 space-y-6 animate-scale-up">
              
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-extrabold text-gray-900 tracking-tight">
                  OPD Slot Confirmed!
                </h3>
                <p className="text-sm text-gray-500 font-light px-4">
                  Your appointment request is successfully locked in. A detailed confirmation SMS/Email has been dispatched to patient contacts.
                </p>
              </div>

              {/* Confirmation Code Card */}
              <div className="bg-brand-50/50 border border-brand-100/60 rounded-2xl p-5 max-w-md mx-auto text-left space-y-4">
                
                <div className="flex justify-between items-center border-b border-brand-100/30 pb-3">
                  <span className="text-xs font-bold text-brand-800 uppercase tracking-wider">
                    CONFIRMATION CODE
                  </span>
                  <span className="font-mono font-bold text-lg text-brand-950 bg-white px-3 py-1 rounded-lg border border-brand-200 shadow-3xs">
                    {createdAppointment.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">PATIENT NAME</span>
                    <strong className="text-gray-800 block text-sm mt-0.5 truncate">{createdAppointment.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">DOCTOR</span>
                    <strong className="text-gray-800 block text-sm mt-0.5 truncate">{selectedDoctor?.name}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">SCHEDULED DATE</span>
                    <strong className="text-gray-800 block text-sm mt-0.5 truncate">{createdAppointment.date}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">TIMING</span>
                    <strong className="text-gray-800 block text-sm mt-0.5 truncate">{createdAppointment.timeSlot}</strong>
                  </div>
                </div>

                <div className="border-t border-brand-100/30 pt-3 flex items-start gap-2 text-[11px] text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1 flex-shrink-0" />
                  <span>Please arrive 15 minutes before your scheduled hour at <strong>{selectedDepartment?.location}</strong> for vital pre-checks.</span>
                </div>

                {createdAppointment.emailNotificationsEnabled && (
                  <div className="border-t border-brand-100/30 pt-3 space-y-2">
                    {emailStatus === 'sending' && (
                      <div className="flex items-start gap-2.5 text-[11px] text-blue-800 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/20">
                        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mt-0.5 flex-shrink-0" />
                        <span>Sending confirmation email to <strong className="font-semibold text-blue-950">{createdAppointment.patientEmail}</strong>...</span>
                      </div>
                    )}

                    {emailStatus === 'success' && (
                      <div className="flex items-start gap-2.5 text-[11px] text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100/30 animate-fade-in">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="leading-normal">
                          <strong>Confirmation email sent successfully!</strong> <br />
                          <span className="text-emerald-950 text-[10.5px] mt-0.5 block">{emailMessage}</span>
                        </span>
                      </div>
                    )}

                    {emailStatus === 'failed' && (
                      <div className="flex items-start gap-2.5 text-[11px] text-rose-800 bg-rose-50/60 p-2.5 rounded-xl border border-rose-100/30 animate-fade-in">
                        <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0 animate-pulse" />
                        <span className="leading-normal">
                          <strong>Failed to send confirmation email</strong> <br />
                          <span className="text-rose-950 text-[10.5px] mt-0.5 block">{emailMessage}</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto pt-4">
                <button
                  onClick={handleTrackDirect}
                  className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Track / Manage Booking
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedDeptId('');
                    setSelectedDocId('');
                    setSelectedDate('');
                    setSelectedTimeSlot('');
                    setPatientName('');
                    setPatientEmail('');
                    setPatientPhone('');
                    setPatientNotes('');
                  }}
                  className="w-full py-3 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 font-semibold text-xs rounded-xl transition-colors bg-white cursor-pointer"
                >
                  Schedule Another OPD
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
