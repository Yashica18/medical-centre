import React, { useState } from 'react';
import { Award, Users, ShieldCheck, Check, Heart, HelpCircle, Star } from 'lucide-react';
import { TESTIMONIALS, FAQS } from '../data';

export default function AboutSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const values = [
    {
      title: 'Our Patient-First Mission',
      description: 'To deliver exceptionally safe, evidence-based medical treatment with empathy, creating a healthier future for our community.',
      icon: Heart,
      bg: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Global Clinical Standards',
      description: 'Strict adherence to NABH, WHO guidelines, and sanitisation protocols. Our operation theatres and diagnostic facilities are state-of-the-art.',
      icon: ShieldCheck,
      bg: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Empathetic Patient Care',
      description: 'Medical care is not just clinical expertise; it is the warmth, transparency, and personal touch that accelerates healing.',
      icon: Users,
      bg: 'bg-teal-50 text-teal-600'
    }
  ];

  const highlights = [
    'Over 18 years of healthcare leadership',
    'State-of-the-art 120-bed tertiary care facility',
    'Round-the-clock intensive care specialists on site',
    'Advanced modular OT suites with laminar airflow',
    'Liaison with 20+ national insurance providers',
    'Pristine hygiene and WHO sanitation ratings'
  ];

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-white">
      
      {/* Hospital Identity & Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" /> About Sanjeevani
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Healing the Community with <span className="text-brand-600">Integrity & Excellence</span> Since 2008.
            </h2>
            
            <p className="text-gray-600 leading-relaxed font-light">
              Sanjeevani Medical Centre has grown from a local diagnostic clinic into a landmark 120-bed multi-speciality hospital. Our focus is on bringing together renowned super-specialist doctors and advanced medical diagnostic equipment under one pristine roof.
            </p>
            
            <p className="text-gray-600 leading-relaxed font-light">
              We understand that visiting a hospital can be stressful. Hence, our entire infrastructure is designed to look warm and spacious, and our staff is trained extensively to guide you through registration, billing, diagnostics, and doctor consultations with complete empathy.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((text, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 mt-0.5 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Values Cards */}
          <div className="lg:col-span-6 space-y-6 bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100">
            <h3 className="font-display text-xl font-bold text-gray-900">
              Our Foundational Pillars
            </h3>
            <p className="text-xs text-gray-400 -mt-2">
              The core principles that govern our healthcare practices daily.
            </p>
            
            <div className="space-y-4">
              {values.map((v, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${v.bg}`}>
                    <v.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base text-gray-900">{v.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed font-light">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Patient Testimonials Section */}
      <section className="bg-radial from-teal-50/30 to-white py-12 sm:py-16 mt-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
              Patient Voices
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Stories of Recovery & Comfort
            </h2>
            <p className="text-sm text-gray-500 font-light">
              We are honored to have been a part of their wellness journeys. Here is what our patients say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xs relative flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic text-sm leading-relaxed font-light mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-sm text-gray-900">{t.author}</h5>
                    <p className="text-[11px] text-gray-400 mt-0.5">{t.role}</p>
                  </div>
                  <span className="text-2xl text-teal-100 font-serif leading-none">”</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Common Patient Inquiries
          </h2>
          <p className="text-sm text-gray-500 font-light max-w-lg mx-auto">
            Find immediate answers regarding consultations, files to bring, emergency policies, and appointment tracking.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-gray-100 rounded-xl overflow-hidden bg-white hover:border-gray-200 transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 hover:bg-gray-50/50 focus:outline-none focus:bg-gray-50/50 cursor-pointer"
              >
                <span className="font-semibold text-sm sm:text-base text-gray-800">
                  {faq.q}
                </span>
                <span className="flex-shrink-0 text-gray-400 transition-transform duration-200">
                  {openFaqIndex === idx ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed font-light border-t border-gray-50 animate-slide-down">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
