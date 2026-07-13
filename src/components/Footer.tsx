import React from 'react';
import { Stethoscope, MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      
      {/* Primary Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Stethoscope className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-white block">
                  Sanjeevani
                </span>
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block -mt-1">
                  Medical Centre
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
              Founded in 2008, Sanjeevani Medical Centre is a premier multi-speciality tertiary care institution accredited by NABH. We serve the community with clinical rigour and compassionate healing.
            </p>

            <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-800 flex items-center gap-2.5 text-xs">
              <Shield className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>Registered CGHS & leading Private Insurance TPA Partner</span>
            </div>
          </div>

          {/* Quick Nav links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Quick Nav
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { id: 'home' as ActiveTab, label: 'Home Page' },
                { id: 'about' as ActiveTab, label: 'About Us' },
                { id: 'departments' as ActiveTab, label: 'Our Specialties' },
                { id: 'doctors' as ActiveTab, label: 'Expert Doctors' },
                { id: 'tracker' as ActiveTab, label: 'Track Appointment' },
                { id: 'booking' as ActiveTab, label: 'Book OPD Slot' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => setActiveTab(link.id)}
                    className="hover:text-brand-400 transition-colors focus:outline-none cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening timings */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Centre Timings
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-200 block font-semibold">Emergency Services</strong>
                  <span className="text-[11px] text-rose-400 font-semibold block mt-0.5">24 Hours / 7 Days Open</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-200 block font-semibold">OPD Consultations</strong>
                  <span className="text-[11px]">Mon - Sat: 8:00 AM - 8:00 PM</span>
                  <span className="text-[10px] block text-gray-500 mt-0.5">(Sundays Closed except Emergency)</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-200 block font-semibold">In-house Pharmacy & Labs</strong>
                  <span className="text-[11px] text-teal-400">24/7 Home Delivery Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact coordinates */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="space-y-4 text-xs text-gray-400">
              {/* Interactive Address Link (opens Google Maps) */}
              <a 
                href="https://maps.google.com/?q=Sanjeevani+Medical+Centre,+45,+Residency+Road,+Shanthala+Nagar,+Bengaluru,+Karnataka+560025" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-start gap-2.5 group hover:text-brand-400 transition-colors cursor-pointer"
                title="View Sanjeevani Medical Centre on Google Maps"
              >
                <MapPin className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed underline decoration-transparent group-hover:decoration-brand-400 transition-all">
                  Sanjeevani Medical Centre, <br />
                  45, Residency Road, Shanthala Nagar, <br />
                  Bengaluru, Karnataka 560025
                </span>
              </a>

              {/* Interactive Phone Link */}
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a 
                    href="tel:+918049128000" 
                    className="block hover:text-brand-400 transition-colors cursor-pointer"
                    title="Call Central Desk"
                  >
                    Central Desk: <strong className="hover:underline">+91 80 4912 8000</strong>
                  </a>
                  <a 
                    href="tel:+918049128999" 
                    className="block text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Call Emergency / Ambulance Dispatch"
                  >
                    Ambulance: <strong className="hover:underline text-rose-500/90 hover:text-rose-400">+91 80 4912 8999</strong>
                  </a>
                </div>
              </div>

              {/* Interactive Email Link (opens Gmail draft directly) */}
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 overflow-hidden">
                  <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=support@sanjeevanimedical.org" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block truncate hover:text-brand-400 transition-colors cursor-pointer hover:underline"
                    title="Compose Support email in Gmail"
                  >
                    support@sanjeevanimedical.org
                  </a>
                  <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@sanjeevanimedical.org" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block truncate text-gray-500 hover:text-brand-400 transition-colors cursor-pointer hover:underline"
                    title="Compose Enquiry email in Gmail"
                  >
                    info@sanjeevanimedical.org
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950 py-6 text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {currentYear} Sanjeevani Medical Centre. All rights reserved.</p>
          <div className="flex gap-4 font-medium">
            <span className="hover:text-gray-300">Privacy Policy</span>
            <span className="w-1 h-1 rounded-full bg-gray-800 self-center" />
            <span className="hover:text-gray-300">Patient Rights Agreement</span>
            <span className="w-1 h-1 rounded-full bg-gray-800 self-center" />
            <span className="hover:text-gray-300">Terms of Use</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
