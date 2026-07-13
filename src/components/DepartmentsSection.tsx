import React, { useState } from 'react';
import { Heart, Baby, Activity, Brain, Sparkles, Stethoscope, Phone, MapPin, ArrowRight, Star, GraduationCap, Languages } from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Department, Doctor, ActiveTab } from '../types';

interface DepartmentsSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedPreDept?: (deptId: string) => void;
  setSelectedPreDoc?: (docId: string) => void;
}

export default function DepartmentsSection({ 
  setActiveTab, 
  setSelectedPreDept, 
  setSelectedPreDoc 
}: DepartmentsSectionProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(DEPARTMENTS[0].id);

  const activeDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];
  const activeDoctors = DOCTORS.filter(doc => doc.departmentId === selectedDeptId);

  // Map icon strings to actual Lucide component instances
  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className={className} />;
      case 'Baby': return <Baby className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Stethoscope': return <Stethoscope className={className} />;
      default: return <Stethoscope className={className} />;
    }
  };

  const handleQuickBook = (deptId: string, docId: string) => {
    if (setSelectedPreDept) setSelectedPreDept(deptId);
    if (setSelectedPreDoc) setSelectedPreDoc(docId);
    setActiveTab('booking');
  };

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
            Medical Specialities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Our Specialized Departments
          </h2>
          <p className="text-gray-500 font-light text-sm sm:text-base">
            Click on any department below to explore detailed medical offerings, wing locations, direct contacts, and our team of senior consultants.
          </p>
        </div>

        {/* Outer Split Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Department List Selectors */}
          <div className="lg:col-span-4 space-y-3">
            {DEPARTMENTS.map((dept) => {
              const isActive = dept.id === selectedDeptId;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`w-full text-left p-4.5 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-600/10'
                      : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-lg transition-colors ${
                      isActive ? 'bg-white/10 text-white' : 'bg-brand-50 text-brand-600'
                    }`}>
                      {renderIcon(dept.icon, 'w-5 h-5')}
                    </div>
                    <div>
                      <span className="font-semibold text-sm sm:text-base block">
                        {dept.name}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${
                    isActive ? 'translate-x-1 text-white' : 'text-gray-400 group-hover:translate-x-1 group-hover:text-brand-500'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Department view */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Department Info Panel */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    {renderIcon(activeDept.icon, 'w-6 h-6')}
                  </div>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900">
                      {activeDept.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium tracking-wide flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-500" /> {activeDept.location}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-brand-500" /> {activeDept.phone}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Descriptions & Services */}
              <div className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed font-light">
                  {activeDept.longDescription}
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-brand-700">
                    Key Procedures & Treatments
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {activeDept.services.map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Department Doctors Panel */}
            <div className="space-y-4">
              <h4 className="font-display text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>👩‍⚕️ Consultants in {activeDept.name}</span>
                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {activeDoctors.length} Doctors
                </span>
              </h4>

              <div className="grid sm:grid-cols-2 gap-6">
                {activeDoctors.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all group"
                  >
                    <div className="space-y-4">
                      {/* Doctor meta */}
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 relative flex-shrink-0">
                          <img 
                            src={doc.imageUrl} 
                            alt={doc.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm sm:text-base text-gray-900 leading-tight group-hover:text-brand-600 transition-colors">
                            {doc.name}
                          </h5>
                          <p className="text-xs text-brand-600 font-medium mt-0.5">{doc.role}</p>
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{doc.rating}</span>
                            <span className="text-gray-400 font-normal">({doc.reviewsCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-light">
                        {doc.bio}
                      </p>

                      <div className="space-y-1.5 border-t border-gray-50 pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <GraduationCap className="w-3.5 h-3.5 text-brand-500" />
                          <span className="truncate">{doc.qualification}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Languages className="w-3.5 h-3.5 text-brand-500" />
                          <span>Speaks: {doc.languages.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick schedule CTA */}
                    <div className="pt-4 mt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        💼 Exp: {doc.experience} Years
                      </span>
                      <button
                        onClick={() => handleQuickBook(activeDept.id, doc.id)}
                        className="py-1.5 px-3 bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
