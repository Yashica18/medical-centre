import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  HelpCircle, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CreditCard,
  UserCheck
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: string;
}

const FAQ_ITEMS: FAQ[] = [
  {
    id: 'clinic-hours',
    category: 'Schedules',
    question: 'What are the clinic hours and doctor consulting timings?',
    icon: <Clock className="w-5 h-5 text-teal-600" />,
    answer: 'Our main outpatient department (OPD) operates from Monday to Saturday, 08:30 AM to 05:00 PM. Individual specialist timings vary (e.g., Dr. Arvind Swamy consultation timings are Monday to Friday, 09:30 AM to 04:00 PM). However, our 24/7 Emergency and Trauma Centre (Wing A) is open round-the-clock, including Sundays and public holidays, with resident surgeons on site.'
  },
  {
    id: 'insurance-tpa',
    category: 'Billing',
    question: 'Does Sanjeevani accept cashless health insurance and TPA cards?',
    icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
    answer: 'Yes! We support cashless hospitalisation and consultations with leading Indian and international insurance providers, including Star Health, HDFC Ergo, ICICI Lombard, Niva Bupa, and various corporate TPA networks. Please present your digital health card and valid ID at our Insurance Helpdesk (Wing B lobby) at least 48 hours prior to planned procedures or during admissions.'
  },
  {
    id: 'parking-valet',
    category: 'Facilities',
    question: 'Is parking available at the medical centre? Are there valet services?',
    icon: <MapPin className="w-5 h-5 text-teal-600" />,
    answer: 'Absolutely. We offer secure, multi-level basement car parking for patients and visitors located off Residency Road. Dedicated bays are provided with visual markers for senior citizens and differently-abled visitors. Complimenting this, free valet parking is available at the Main Entrance Drop-off Point from 08:00 AM to 08:00 PM daily.'
  },
  {
    id: 'booking-reschedule',
    category: 'Bookings',
    question: 'How can I book, track, reschedule, or cancel my appointment online?',
    icon: <Calendar className="w-5 h-5 text-teal-600" />,
    answer: 'Booking is fully digitalized. Click on the "Book Appointment" tab, select your department, pick an available slot with your preferred doctor, and confirm. You will receive an instant unique SMC tracking code (e.g., SMC-XYZ12). Enter this code in the "Track Booking" tab to monitor status, review special pre-appointment checkup protocols, or cancel your booking instantly up to 2 hours prior to the slot.'
  },
  {
    id: 'emergency-trauma',
    category: 'Schedules',
    question: 'Who should I contact for an immediate medical emergency or ambulance?',
    icon: <HelpCircle className="w-5 h-5 text-rose-500" />,
    answer: 'For critical trauma, cardiac arrests, respiratory failures, or any urgent casualty, call our dedicated 24/7 emergency hotline at +91 80 4912 8999 immediately. Our fully equipped ICU ambulance with telemetry support will be dispatched instantly. Walk-in emergency cases are directly triaged into Trauma Care Center, Wing A.'
  },
  {
    id: 'checkup-checklist',
    category: 'Facilities',
    question: 'What documents or records should I bring for my first consultation?',
    icon: <UserCheck className="w-5 h-5 text-teal-600" />,
    answer: 'For your first visit, please bring: 1) Any past clinical prescription summaries or lab reports, 2) A government-issued photo ID (Aadhaar Card, Passport, or DL), 3) Current regular medication list, and 4) Your booking confirmation code (sent via email/SMS). Arrive 15 minutes before your scheduled slot to complete the one-time registration.'
  }
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>('clinic-hours'); // Default first item open

  const categories = ['All', 'Schedules', 'Billing', 'Facilities', 'Bookings'];

  const filteredFaqs = activeCategory === 'All' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(faq => faq.category === activeCategory);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="sanjeevani-faq-section" className="py-20 sm:py-24 bg-white border-t border-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        
        {/* Section Heading with subtle accent */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-widest bg-teal-50 px-3 py-1.5 rounded-full">
            FAQ Helpdesk
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Patient Questions
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Get instant guidance on outpatient schedules, insurance approvals, parking locations, and the booking pipeline at Sanjeevani Medical Centre.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                // Reset active ID or set it to first of filtered list
                const filtered = category === 'All' ? FAQ_ITEMS : FAQ_ITEMS.filter(f => f.category === category);
                if (filtered.length > 0) {
                  setOpenId(filtered[0].id);
                } else {
                  setOpenId(null);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer ${
                activeCategory === category
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/15'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Accordion List Container */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'border-teal-500 bg-teal-50/10 shadow-sm shadow-teal-500/5' 
                      : 'border-gray-100 hover:border-gray-200 bg-white shadow-2xs'
                  }`}
                >
                  {/* Collapsible Header Button */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left px-5 sm:px-6 py-4.5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4.5">
                      <div className={`p-2.5 rounded-xl flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-teal-100/60 text-teal-700' : 'bg-gray-50 text-gray-400'
                      }`}>
                        {faq.icon}
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block mb-0.5">
                          {faq.category}
                        </span>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base tracking-tight">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex-shrink-0 p-1 rounded-lg ${
                        isOpen ? 'text-teal-600 bg-teal-100/40' : 'text-gray-400'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  {/* Expandable Body Panel */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 sm:pl-[74px] border-t border-dashed border-teal-100/50">
                          <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Helpdesk Notice */}
        <div className="mt-12 bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="text-2xl">💡</span>
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-gray-900 text-sm">Still have questions?</h4>
              <p className="text-xs text-gray-400 font-light mt-0.5">Our compassionate medical coordinators are online on the support chat.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const chatBtn = document.getElementById('sanjeevani-ai-chatbot-trigger');
              if (chatBtn) {
                chatBtn.click();
              }
            }}
            className="px-4.5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm"
          >
            Chat with Sanjeevani AI ✨
          </button>
        </div>

      </motion.div>
    </section>
  );
}
