import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import DepartmentsSection from './components/DepartmentsSection';
import DoctorsSection from './components/DoctorsSection';
import BookingForm from './components/BookingForm';
import AppointmentTracker from './components/AppointmentTracker';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import FAQSection from './components/FAQSection';
import PatientTestimonials from './components/PatientTestimonials';
import BackToTop from './components/BackToTop';
import { motion } from 'motion/react';
import { Heart, Activity, Brain, ShieldAlert, Phone, Users, Stethoscope } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Appointment } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('sanjeevani_theme');
      return (stored === 'dark' || stored === 'light') ? stored : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('sanjeevani_theme', theme);
    } catch (err) {
      console.warn('Failed to save theme setting:', err);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const [user, setUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('sanjeevani_demo_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  // States for cross-routing selections (booking pre-sets)
  const [preSelectedDeptId, setPreSelectedDeptId] = useState('');
  const [preSelectedDocId, setPreSelectedDocId] = useState('');
  const [trackerSearchCode, setTrackerSearchCode] = useState('');

  // Setup firebase auth listener and local sandbox auth listener
  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const stored = localStorage.getItem('sanjeevani_demo_user');
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(auth.currentUser);
        }
      } catch (err) {
        console.error('Error synchronizing local sandbox user:', err);
      }
    };

    window.addEventListener('sanjeevani_auth_changed', handleAuthChange);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.removeItem('sanjeevani_demo_user');
      } else {
        const stored = localStorage.getItem('sanjeevani_demo_user');
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener('sanjeevani_auth_changed', handleAuthChange);
    };
  }, []);

  // Auto-sync any existing localStorage appointments to Firestore once signed in (only for live/real users)
  useEffect(() => {
    if (!user || user.isDemo) return;

    const autoSyncLocalBookings = async () => {
      try {
        const localData = localStorage.getItem('sanjeevani_appointments');
        if (!localData) return;

        const localList: Appointment[] = JSON.parse(localData);
        if (Array.isArray(localList) && localList.length > 0) {
          console.log(`Auto-syncing ${localList.length} offline/local appointments to Firestore...`);
          for (const appt of localList) {
            // Re-assign to current logged-in user's live UID to satisfy security rules
            const adjustedAppt: Appointment = {
              ...appt,
              userId: user.uid
            };
            await setDoc(doc(db, 'appointments', appt.id), adjustedAppt);
          }
          // Clear local storage once successfully synced
          localStorage.removeItem('sanjeevani_appointments');
          console.log('Successfully migrated offline/local appointments to Firestore!');
        }
      } catch (err) {
        console.error('Error during automatic offline bookings migration:', err);
      }
    };

    autoSyncLocalBookings();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('sanjeevani_demo_user');
      setUser(null);
      setTrackerSearchCode('');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleSignInClick = () => {
    setActiveTab('booking');
  };

  const setSelectedPreDept = (deptId: string) => {
    setPreSelectedDeptId(deptId);
  };

  const setSelectedPreDoc = (docId: string) => {
    setPreSelectedDocId(docId);
  };

  const resetPreSelections = () => {
    setPreSelectedDeptId('');
    setPreSelectedDocId('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfd] text-gray-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* Dynamic Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onSignOut={handleSignOut} 
        onSignInClick={handleSignInClick} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Page Render Pipeline */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-0">
            {/* Hero Banner Section */}
            <Hero setActiveTab={setActiveTab} />

            {/* Quick Informative Highlight grid */}
            <section className="py-16 bg-white border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                  
                  {/* Item 1 */}
                  <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <Stethoscope className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="font-display font-bold text-base text-gray-900">Preventative Screenings</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-light">
                      Gain early warning parameters regarding hypertension, metabolic symptoms, or coronary blockages with our premium full-body profiles.
                    </p>
                    <button 
                      onClick={() => { setActiveTab('departments'); }}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 mt-2 flex items-center gap-1 cursor-pointer"
                    >
                      Read Services →
                    </button>
                  </div>

                  {/* Item 2 */}
                  <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <Heart className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="font-display font-bold text-base text-gray-900">Advanced Cardiac ICU</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-light">
                      Equipped with high-frequency ventilators, real-time arterial gas sensors, and round-the-clock intervention specialists for maximum security.
                    </p>
                    <button 
                      onClick={() => { setActiveTab('departments'); }}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 mt-2 flex items-center gap-1 cursor-pointer"
                    >
                      Explore Cardiology →
                    </button>
                  </div>

                  {/* Item 3 */}
                  <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Activity className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="font-display font-bold text-base text-gray-900">Super-Specialist Surgeons</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-light">
                      Home to internationally trained orthopedic joint replacement surgeons and pediatric correctors with high procedural success records.
                    </p>
                    <button 
                      onClick={() => { setActiveTab('doctors'); }}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 mt-2 flex items-center gap-1 cursor-pointer"
                    >
                      Meet Surgeons →
                    </button>
                  </div>

                </div>
              </div>
            </section>

            {/* Quick Feature Focus - Department Teaser */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="py-16 sm:py-20 bg-[#fafcfc]"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-5 space-y-5">
                    <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
                      Seamless Operations
                    </span>
                    <h2 className="font-display text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                      Empowering Patients with Modern Technology
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
                      At Sanjeevani Medical Centre, we believe that clinical outcomes are significantly enhanced by convenient patient tools. You don't have to wait in hours-long queues anymore.
                    </p>

                    <div className="space-y-3.5">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-teal-50 text-brand-600 flex items-center justify-center mt-1 flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <strong className="text-sm font-semibold text-gray-900">Direct Doctor Matching:</strong>
                          <p className="text-xs text-gray-500 mt-0.5">Explore departments, review credentials, check ratings, and lock slots with exact specialist of choice.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-teal-50 text-brand-600 flex items-center justify-center mt-1 flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <strong className="text-sm font-semibold text-gray-900">Dynamic Schedule Checks:</strong>
                          <p className="text-xs text-gray-500 mt-0.5">Get immediate feedback if a consulting doctor is out of town or on emergency duty, avoiding cancellation stress.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-teal-50 text-brand-600 flex items-center justify-center mt-1 flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <strong className="text-sm font-semibold text-gray-900">Central Confirmation Tracker:</strong>
                          <p className="text-xs text-gray-500 mt-0.5">Check status, read pre-op diagnostics guidelines, or cancel slot cleanly with your secure confirmation code.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => { setActiveTab('booking'); }}
                        className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                      >
                        Try Scheduling System →
                      </button>
                    </div>
                  </div>

                  {/* Right side teaser gallery */}
                  <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-2 shadow-2xs">
                        <span className="text-3xl">🫁</span>
                        <h4 className="font-bold text-sm text-gray-900">Respiratory Labs</h4>
                        <p className="text-xs text-gray-400 font-light">Fully functional spirometry tests and bronchial dilation evaluations.</p>
                      </div>
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-2 shadow-2xs">
                        <span className="text-3xl">🧬</span>
                        <h4 className="font-bold text-sm text-gray-900">Biochemistry Labs</h4>
                        <p className="text-xs text-gray-400 font-light">Precision automated chemical profiling and hormonal assaying panels.</p>
                      </div>
                    </div>
                    <div className="space-y-4 pt-8">
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-2 shadow-2xs">
                        <span className="text-3xl">🦴</span>
                        <h4 className="font-bold text-sm text-gray-900">Joint Clinics</h4>
                        <p className="text-xs text-gray-400 font-light">Rehabilitation, computer navigation prosthetics, and ligament surgery.</p>
                      </div>
                      <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-2 shadow-2xs">
                        <span className="text-3xl">🩹</span>
                        <h4 className="font-bold text-sm text-gray-900">Dermato-surgery</h4>
                        <p className="text-xs text-gray-400 font-light">Advanced laser skin scar corrections and clinical allergen tests.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.section>

            {/* Patient Success Stories & Testimonials Section */}
            <PatientTestimonials />

            {/* FAQ Accordion Section */}
            <FAQSection />

            {/* Helpline Emergency block banner */}
            <section className="bg-radial from-brand-800 to-brand-950 text-white py-12 px-6 text-center border-t border-brand-950 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="max-w-4xl mx-auto space-y-5 relative z-10">
                <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Phone className="w-6 h-6 animate-bounce" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Facing a Medical Emergency? We are Ready 24/7.
                </h2>
                <p className="text-teal-100/80 text-sm max-w-2xl mx-auto font-light">
                  Our emergency responses are managed by certified critical-care specialists on site. Rapid ambulance dispatch, critical-care beds, and level-3 ICU panels are kept standby.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-semibold pt-2">
                  <span className="bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 text-white text-sm">
                    🚑 Emergency Ambulance Line: <span className="text-teal-300 font-bold">+91 80 4912 8999</span>
                  </span>
                  <span className="bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 text-white text-sm">
                    🏨 Trauma Care Center Wing A, Residency Road
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <AboutSection />
        )}

        {activeTab === 'departments' && (
          <DepartmentsSection 
            setActiveTab={setActiveTab}
            setSelectedPreDept={setSelectedPreDept}
            setSelectedPreDoc={setSelectedPreDoc}
          />
        )}

        {activeTab === 'doctors' && (
          <DoctorsSection 
            setActiveTab={setActiveTab}
            setSelectedPreDept={setSelectedPreDept}
            setSelectedPreDoc={setSelectedPreDoc}
          />
        )}

        {activeTab === 'booking' && (
          <BookingForm 
            preSelectedDeptId={preSelectedDeptId}
            preSelectedDocId={preSelectedDocId}
            setActiveTab={setActiveTab}
            setSearchCode={setTrackerSearchCode}
            resetPreSelections={resetPreSelections}
            user={user}
          />
        )}

        {activeTab === 'tracker' && (
          <AppointmentTracker 
            searchCode={trackerSearchCode}
            setSearchCode={setTrackerSearchCode}
            setActiveTab={setActiveTab}
            user={user}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPortal 
            user={user}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Persistent Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* AI Chatbot Assistant */}
      <AIChatbot />

      {/* Floating Back to Top Button */}
      <BackToTop />

    </div>
  );
}
