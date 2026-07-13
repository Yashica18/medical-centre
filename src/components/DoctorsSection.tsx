import React, { useState, useMemo } from 'react';
import { Search, Star, GraduationCap, Languages, Calendar, Award, ChevronRight, Stethoscope } from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data';
import { ActiveTab } from '../types';

interface DoctorsSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedPreDept?: (deptId: string) => void;
  setSelectedPreDoc?: (docId: string) => void;
}

export default function DoctorsSection({ 
  setActiveTab, 
  setSelectedPreDept, 
  setSelectedPreDoc 
}: DoctorsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  // Compute filtered list
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doc.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;
      
      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDeptFilter]);

  const handleBookDoctor = (deptId: string, docId: string) => {
    if (setSelectedPreDept) setSelectedPreDept(deptId);
    if (setSelectedPreDoc) setSelectedPreDoc(docId);
    setActiveTab('booking');
  };

  const getDeptName = (deptId: string) => {
    return DEPARTMENTS.find(d => d.id === deptId)?.name || 'General';
  };

  return (
    <div className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Directory Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
            Medical Experts
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Meet Our Senior Specialists
          </h2>
          <p className="text-gray-500 font-light text-sm sm:text-base">
            Sanjeevani is home to highly respected, board-certified healthcare professionals with international credentials and decades of clinical success.
          </p>
        </div>

        {/* Filter and Search Controls */}
        <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl shadow-xs mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white text-sm"
            />
          </div>

          {/* Department Filter Chips */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-auto">
            <button
              onClick={() => setSelectedDeptFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                selectedDeptFilter === 'all'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-150 hover:border-gray-300'
              }`}
            >
              All Doctors
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptFilter(dept.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedDeptFilter === dept.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-150 hover:border-gray-300'
                }`}
              >
                {dept.name.split(' & ')[0]}
              </button>
            ))}
          </div>

        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-gray-200 transition-all group flex flex-col justify-between"
              >
                {/* Doctor Visual Header */}
                <div className="relative h-64 bg-gray-50 overflow-hidden">
                  <img 
                    src={doc.imageUrl} 
                    alt={doc.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Department Tag Overlay */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-brand-800 shadow-xs flex items-center gap-1.5 border border-brand-50">
                    <Stethoscope className="w-3 h-3 text-brand-500" />
                    {getDeptName(doc.departmentId)}
                  </div>
                  
                  {/* Experience Tag Overlay */}
                  <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-white shadow-xs flex items-center gap-1">
                    <Award className="w-3 h-3 text-brand-400" />
                    {doc.experience}+ Yrs Exp
                  </div>
                </div>

                {/* Doctor Info Section */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-display font-bold text-lg text-gray-900 leading-tight">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-brand-600 font-semibold mt-0.5">{doc.role}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-xs text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-3">
                      {doc.bio}
                    </p>
                  </div>

                  {/* Certifications and Languages */}
                  <div className="space-y-2 border-t border-gray-50 pt-4 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-gray-800 leading-tight">{doc.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <span>Speaks: {doc.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Availability:</span>{' '}
                        <span className="text-brand-700 font-semibold">{doc.availability.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Appointment CTA */}
                  <div className="pt-4 border-t border-gray-50">
                    <button
                      onClick={() => handleBookDoctor(doc.departmentId, doc.id)}
                      className="w-full py-2.5 bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 group/btn cursor-pointer"
                    >
                      Schedule Appointment
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl max-w-md mx-auto">
            <p className="text-gray-400 font-medium mb-2">No matching specialists found</p>
            <p className="text-xs text-gray-400 font-light px-4">
              Try modifying your search text or select a different department filter to see other available doctors.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDeptFilter('all'); }}
              className="mt-4 px-4 py-2 bg-brand-50 text-brand-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
