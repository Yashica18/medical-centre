import React from 'react';
import { Calendar, ArrowRight, ShieldCheck, Award, Heart, Users } from 'lucide-react';
import { ActiveTab } from '../types';
import { motion } from 'motion/react';

interface HeroProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Hero({ setActiveTab }: HeroProps) {
  const stats = [
    { value: '25+', label: 'Specialised Departments', icon: Heart, color: 'text-rose-500 bg-rose-50' },
    { value: '45+', label: 'Senior Consultants', icon: Users, color: 'text-teal-500 bg-teal-50' },
    { value: '20k+', label: 'Successful Procedures', icon: Award, color: 'text-amber-500 bg-amber-50' },
    { value: '100%', label: 'Commitment to Care', icon: ShieldCheck, color: 'text-blue-500 bg-blue-50' },
  ];

  return (
    <div className="relative overflow-hidden bg-radial from-teal-50/40 via-white to-white py-12 lg:py-20">
      {/* Abstract background decorative elements */}
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-100/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-50/30 blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-800 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              <span>🏥 YOUR TRUSTED HEALTHCARE PARTNER</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-none">
              Compassionate Care, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-800">
                World-Class Healing.
              </span>
            </h1>
            
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Welcome to Sanjeevani Medical Centre. We blend advanced medical technology, leading diagnostic precision, and deeply empathetic care to restore your health and vitality.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActiveTab('booking')}
                className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment Online
              </button>
              <button
                onClick={() => setActiveTab('departments')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Explore Specialties
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Core assurances checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 pt-6 text-left max-w-lg mx-auto lg:mx-0">
              {[
                '24/7 Emergency ICU',
                'Advanced Lab Diagnostics',
                'Fully Digital Health Records',
                'Zero-Contact Check-In',
                'Multi-lingual Staff',
                'Post-discharge Support'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[420px] lg:max-w-none">
              
              {/* Main Decorative Card */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-2xl p-6 space-y-6">
                
                {/* Header inside mockup */}
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-brand-600">
                      <Heart className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">Hospital Live Metrics</h4>
                      <p className="text-[10px] text-gray-400">Real-time status monitor</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-ping" />
                    Emergency Open
                  </span>
                </div>

                {/* Simulated Hospital Experience Card */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">Average OPD Wait Time</span>
                      <span className="text-emerald-600 font-bold">12 Mins</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium">In-patient Care Rating</span>
                      <span className="text-brand-600 font-bold">4.9 / 5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>
                </div>

                {/* Fast Booking teaser widget */}
                <div className="border-t border-gray-100 pt-4 text-center">
                  <p className="text-xs text-gray-500 mb-3">Want to avoid the wait entirely?</p>
                  <button
                    onClick={() => setActiveTab('booking')}
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                  >
                    Instantly Register Appointment →
                  </button>
                </div>
              </div>

              {/* Float badge - Doctor availability */}
              <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-xs border border-gray-100 p-4 rounded-xl shadow-lg flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Safe & Sanitised</p>
                  <p className="font-semibold text-sm text-gray-800">100% Vaccinated Staff</p>
                </div>
              </div>

              {/* Float badge 2 - Emergency assistance */}
              <div className="absolute -bottom-6 -right-6 bg-white border border-gray-100 p-4 rounded-xl shadow-lg flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Fast Emergency Response</p>
                  <p className="font-semibold text-sm text-gray-800">&lt; 15 Mins Dispatch</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Stats Grid Underneath */}
        <div className="mt-16 border-t border-gray-100 pt-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-4 rounded-xl hover:bg-gray-50/50 transition-colors">
                <div className={`p-3 rounded-xl ${stat.color} flex-shrink-0`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-500 mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
