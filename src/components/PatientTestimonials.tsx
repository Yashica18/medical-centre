import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTIMONIALS } from '../data';
import { Star, Quote, MessageSquarePlus, Sparkles, UserCheck, Heart } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  stars: number;
}

export default function PatientTestimonials() {
  const [list, setList] = useState<Testimonial[]>(TESTIMONIALS);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [stars, setStars] = useState(5);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!quote.trim()) {
      setErrorMsg('Please share a brief story of your experience.');
      return;
    }
    if (!author.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }
    if (!role.trim()) {
      setErrorMsg('Please specify your patient background (e.g., General Patient, Cardiac Patient).');
      return;
    }

    const newTestimonial: Testimonial = {
      quote: quote.trim(),
      author: author.trim(),
      role: role.trim(),
      stars,
    };

    // Prepend the new testimonial to the list for immediate rendering
    setList((prev) => [newTestimonial, ...prev]);

    // Success feedback
    setSuccessMsg('Thank you so much! Your testimonial has been successfully shared and added below.');
    
    // Clear inputs
    setQuote('');
    setAuthor('');
    setRole('');
    setStars(5);

    // Automatically close the form after 3 seconds
    setTimeout(() => {
      setShowForm(false);
      setSuccessMsg('');
    }, 3500);
  };

  return (
    <section id="patient-testimonials-section" className="py-20 sm:py-24 bg-[#fafcfc] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <span className="text-[11px] font-semibold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1.5 rounded-full">
            Patient Stories
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Compassionate Care That Inspires Hope & Healing
          </h2>
          <p className="text-gray-500 text-xs sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Read first-hand accounts of medical recoveries, clinical excellence, and heartfelt gratitude from the people who motivate us to deliver our best every single day.
          </p>
        </div>

        {/* Action Button: Share Testimonial */}
        <div className="flex justify-center mb-12">
          <button
            type="button"
            onClick={() => {
              setShowForm(!showForm);
              setSuccessMsg('');
              setErrorMsg('');
            }}
            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold text-xs rounded-xl border border-gray-200 hover:border-gray-300 shadow-2xs transition-all cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-teal-600 animate-pulse" />
            {showForm ? 'Cancel Sharing' : 'Share Your Success Story'}
          </button>
        </div>

        {/* Expandable Testimonial Form Panel */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden mb-12"
            >
              <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">Share Your Sanjeevani Experience</h3>
                    <p className="text-xs text-gray-400 font-light">Your words will help inspire other patients on their recovery journey.</p>
                  </div>
                </div>

                {successMsg ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-teal-50 border border-teal-200/50 rounded-xl text-center space-y-2"
                  >
                    <span className="text-2xl">🎉</span>
                    <p className="text-teal-800 text-xs sm:text-sm font-medium">{successMsg}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-medium">
                        ⚠️ {errorMsg}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-600">
                        How would you rate your overall care?
                      </label>
                      <div className="flex gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setStars(num)}
                            className="p-1 focus:outline-none cursor-pointer transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-7 h-7 ${
                                num <= stars
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="quote-input" className="block text-xs font-semibold text-gray-600">
                        Your Story / Experience
                      </label>
                      <textarea
                        id="quote-input"
                        rows={3}
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        placeholder="Describe the medical care, kindness of doctors, or the comfort you experienced..."
                        className="w-full text-xs sm:text-sm p-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:border-teal-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400/80"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="author-input" className="block text-xs font-semibold text-gray-600">
                          Your Full Name
                        </label>
                        <input
                          id="author-input"
                          type="text"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          placeholder="e.g., Rajesh Kumar"
                          className="w-full text-xs sm:text-sm p-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:border-teal-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400/80"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="role-input" className="block text-xs font-semibold text-gray-600">
                          Patient Background
                        </label>
                        <input
                          id="role-input"
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g., Cardiac Patient, Caregiver"
                          className="w-full text-xs sm:text-sm p-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:border-teal-500 focus:bg-white focus:outline-none transition-all placeholder:text-gray-400/80"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                    >
                      Publish Testimonial ✨
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Display of Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {list.map((item, index) => (
              <motion.div
                key={item.author + index}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.4) }}
                className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                {/* Quotation Icon Decorator */}
                <div className="absolute top-6 right-6 text-teal-500/10 group-hover:text-teal-500/15 transition-colors">
                  <Quote className="w-8 h-8 rotate-180 fill-current" />
                </div>

                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < item.stars ? 'fill-current text-amber-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote Body */}
                  <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed italic relative z-10">
                    "{item.quote}"
                  </p>
                </div>

                {/* Patient Signature Details */}
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-50/80">
                  <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-sm font-bold">
                    {item.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm tracking-tight">{item.author}</h4>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block mt-0.5">
                      {item.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Call to Action Accent Card */}
        <div className="mt-16 bg-radial from-brand-800 to-brand-950 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-3xl mx-auto text-center space-y-5 relative z-10">
            <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
              Our Clinical Philosophy is Simple: Patient-First. Always.
            </h3>
            <p className="text-teal-100/80 text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed">
              Behind every successful medical outcome is a team of specialists collaborating dynamically. We measure our achievements solely in smiles, renewed strength, and the lifelong bonds of trust built with our patients.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
