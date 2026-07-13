import { Department, Doctor } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: 'Heart',
    description: 'Comprehensive care for cardiac conditions, from preventive screening to advanced interventions.',
    longDescription: 'Our Cardiology department is equipped with state-of-the-art diagnostic and therapeutic facilities. We offer end-to-end care for heart diseases, focusing on early detection, lifestyle management, interventional cardiology, and post-procedural rehabilitation.',
    services: [
      'Electrocardiogram (ECG) & Stress Test',
      'Echocardiography (2D/3D Echo)',
      'Coronary Angiography & Angioplasty',
      'Pacemaker & ICD Implantation',
      'Heart Failure Management Program',
      'Preventive Cardiac Screenings'
    ],
    location: 'Wing A, 2nd Floor',
    phone: '+91 80 4912 8001'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics & Neonatology',
    icon: 'Baby',
    description: 'Expert medical care for infants, children, and adolescents in a warm, welcoming environment.',
    longDescription: 'Sanjeevani Pediatrics provides compassionate, child-centric care from birth through adolescence. Our specialized pediatricians and neonatologists handle general development, immunization, childhood infections, pediatric surgery, and intensive neonatal support.',
    services: [
      'Newborn Care & Lactation Support',
      'Developmental Milestones Monitoring',
      'Comprehensive Immunization Program',
      'Pediatric Emergency Care',
      'Child Nutrition & Growth Counseling',
      'Neonatal Intensive Care Unit (NICU)'
    ],
    location: 'Wing B, Ground Floor',
    phone: '+91 80 4912 8002'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics & Joint Care',
    icon: 'Activity',
    description: 'Advanced solutions for bone, joint, spine, and musculoskeletal disorders and sports injuries.',
    longDescription: 'Our Orthopedics team offers surgical and non-surgical therapies for joint pain, fractures, spine problems, and sports injuries. Using minimally invasive techniques and robust post-surgery physiotherapy, we focus on restoring your pain-free mobility.',
    services: [
      'Total Knee & Hip Replacements',
      'Arthroscopic Sports Injury Treatments',
      'Spine Surgery & Slip Disc Therapy',
      'Fracture & Complex Trauma Management',
      'Osteoarthritis Care Protocols',
      'In-house Physiotherapy & Rehab'
    ],
    location: 'Wing C, 1st Floor',
    phone: '+91 80 4912 8003'
  },
  {
    id: 'neurology',
    name: 'Neurology & Neurosurgery',
    icon: 'Brain',
    description: 'Specialized diagnosis and treatment of brain, spinal cord, and peripheral nervous system disorders.',
    longDescription: 'Sanjeevani Neurology delivers world-class treatment for neurological issues. Our team manages complex headaches, stroke, epilepsy, Parkinson’s disease, neurodegenerative conditions, and performs intricate microscopic neurosurgeries.',
    services: [
      'Stroke Treatment & Stroke Unit',
      'Epilepsy & Seizure Management',
      'Parkinson’s & Movement Disorders',
      'EEG, EMG, and Nerve Conduction Studies',
      'Minimally Invasive Neurosurgery',
      'Chronic Migraine Management'
    ],
    location: 'Wing A, 3rd Floor',
    phone: '+91 80 4912 8004'
  },
  {
    id: 'dermatology',
    name: 'Dermatology & Cosmetology',
    icon: 'Sparkles',
    description: 'Expert skin, hair, and nail treatments, including clinical dermatology and aesthetic therapies.',
    longDescription: 'Our Dermatology department addresses medical skin conditions, allergic diseases, hair-fall disorders, and provides advanced aesthetic treatments led by certified cosmetic experts to help you achieve healthy, glowing skin.',
    services: [
      'Acne & Scar Therapy',
      'Eczema, Psoriasis & Vitiligo Protocols',
      'Advanced Hair Fall & PRP Treatments',
      'Laser Hair Reduction & Skin Resurfacing',
      'Anti-Aging Procedures (Botox/Fillers)',
      'Skin Allergy Patch Testing'
    ],
    location: 'Wing B, 2nd Floor',
    phone: '+91 80 4912 8005'
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    icon: 'Stethoscope',
    description: 'Primary care, chronic disease management, and wellness programs for all-round health.',
    longDescription: 'General Medicine is the cornerstone of our healthcare service. Our experienced physicians manage infectious diseases, metabolic syndromes like diabetes and hypertension, lifestyle health profiles, and serve as coordinate care managers.',
    services: [
      'Chronic Diabetes & Hypertension Care',
      'Infectious Disease Management',
      'Executive Health Wellness Checkups',
      'Geriatric (Elderly) Care Programs',
      'Allergy and Asthma Treatments',
      'Pre-operative Medical Evaluations'
    ],
    location: 'Wing C, Ground Floor',
    phone: '+91 80 4912 8006'
  }
];

export const DOCTORS: Doctor[] = [
  // Cardiology
  {
    id: 'dr-arvind-swamy',
    name: 'Dr. Arvind Swamy',
    role: 'Senior Consultant & HOD - Cardiology',
    departmentId: 'cardiology',
    experience: 24,
    qualification: 'MD (Gen Medicine), DM (Cardiology), FACC',
    languages: ['English', 'Hindi', 'Tamil'],
    rating: 4.9,
    reviewsCount: 312,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop',
    bio: 'Dr. Arvind Swamy is a pioneer in interventional cardiology with over two decades of clinical experience. He has performed over 8,000 successful angioplasties and is a key speaker at national heart forums.'
  },
  {
    id: 'dr-priya-sharma',
    name: 'Dr. Priya Sharma',
    role: 'Consultant Interventional Cardiologist',
    departmentId: 'cardiology',
    experience: 12,
    qualification: 'MD, DNB (Cardiology), Fellow in Electrophysiology',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.8,
    reviewsCount: 184,
    availability: ['Tue', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:30 PM', '04:30 PM'],
    imageUrl: '/female_doctor_portrait_1783768977567.jpg',
    bio: 'Dr. Priya Sharma specializes in female cardiac health, preventive cardiovascular therapies, and cardiac arrhythmia management. She is dedicated to patient-first treatment.'
  },
  // Pediatrics
  {
    id: 'dr-sneha-reddy',
    name: 'Dr. Sneha Reddy',
    role: 'Senior Consultant - Pediatrics & Neonatology',
    departmentId: 'pediatrics',
    experience: 16,
    qualification: 'MBBS, MD (Pediatrics), Fellowship in Neonatology (UK)',
    languages: ['English', 'Telugu', 'Hindi'],
    rating: 4.9,
    reviewsCount: 410,
    availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop',
    bio: 'Dr. Sneha Reddy is known for her gentle demeanor and highly accurate pediatric diagnoses. She specializes in intensive care for premature babies and infant nutritional development.'
  },
  {
    id: 'dr-joseph-matthews',
    name: 'Dr. Joseph Matthews',
    role: 'Consultant Pediatric Surgeon',
    departmentId: 'pediatrics',
    experience: 14,
    qualification: 'MS (General Surgery), MCh (Pediatric Surgery)',
    languages: ['English', 'Malayalam', 'Hindi'],
    rating: 4.7,
    reviewsCount: 156,
    availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    timeSlots: ['10:30 AM', '11:30 AM', '02:30 PM', '03:30 PM', '04:30 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600&auto=format&fit=crop',
    bio: 'Dr. Joseph Matthews specializes in pediatric laparoscopic surgeries and correction of congenital anomalies. He brings global standards of safety to child surgery.'
  },
  // Orthopedics
  {
    id: 'dr-rajesh-varma',
    name: 'Dr. Rajesh Varma',
    role: 'Senior Orthopedic & Joint Replacement Surgeon',
    departmentId: 'orthopedics',
    experience: 20,
    qualification: 'MS (Orthopedics), MCh (Ortho - UK), Fellowship in Joint Reconstruction',
    languages: ['English', 'Hindi', 'Gujarati'],
    rating: 4.9,
    reviewsCount: 295,
    availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop',
    bio: 'Dr. Rajesh Varma is a master of knee, hip, and shoulder arthroplasties. He has trained internationally and is an expert in computer-assisted navigation joint replacement surgeries.'
  },
  {
    id: 'dr-meera-nair',
    name: 'Dr. Meera Nair',
    role: 'Consultant Orthopedic & Sports Medicine Specialist',
    departmentId: 'orthopedics',
    experience: 10,
    qualification: 'MBBS, DNB (Orthopedics), Fellowship in Arthroscopy & Sports Surgery',
    languages: ['English', 'Malayalam', 'Tamil', 'Hindi'],
    rating: 4.8,
    reviewsCount: 142,
    availability: ['Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['10:30 AM', '11:30 AM', '12:30 PM', '03:30 PM', '04:30 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=600&auto=format&fit=crop',
    bio: 'Dr. Meera Nair works closely with athletes to recover from ACL tears, meniscus injuries, and joint pain. Her holistic approach combines minimal keyhole procedures with target rehab plans.'
  },
  // Neurology
  {
    id: 'dr-amit-sengupta',
    name: 'Dr. Amit Sengupta',
    role: 'Director - Neurology & Stroke Services',
    departmentId: 'neurology',
    experience: 22,
    qualification: 'MD, DM (Neurology), Fellow of American Academy of Neurology (FAAN)',
    languages: ['English', 'Bengali', 'Hindi'],
    rating: 4.9,
    reviewsCount: 260,
    availability: ['Mon', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '02:30 PM', '03:30 PM', '04:30 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600&auto=format&fit=crop',
    bio: 'Dr. Amit Sengupta is a nationally recognized stroke expert. His specialized interest lies in neuro-rehabilitation, hyperacute stroke care, management of epilepsy, and neuropathies.'
  },
  {
    id: 'dr-rachel-green',
    name: 'Dr. Rachel Green',
    role: 'Consultant Neurosurgeon',
    departmentId: 'neurology',
    experience: 11,
    qualification: 'MS (General Surgery), MCh (Neurosurgery)',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.8,
    reviewsCount: 98,
    availability: ['Tue', 'Thu', 'Sat'],
    timeSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=600&auto=format&fit=crop',
    bio: 'Dr. Rachel Green specializes in pediatric neurosurgery, complex spinal cord trauma, and micro-neurosurgical procedures for brain tumors. She is dedicated to microscopic precision.'
  },
  // Dermatology
  {
    id: 'dr-vikram-malhotra',
    name: 'Dr. Vikram Malhotra',
    role: 'Senior Consultant - Dermatology & Cosmetology',
    departmentId: 'dermatology',
    experience: 18,
    qualification: 'MD (Dermatology, Venereology & Leprosy)',
    languages: ['English', 'Hindi', 'Urdu'],
    rating: 4.9,
    reviewsCount: 385,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600&auto=format&fit=crop',
    bio: 'Dr. Vikram Malhotra excels in therapeutic skin disease managements, including critical cases of psoriasis, blistering disorders, and difficult hair diseases.'
  },
  {
    id: 'dr-aisha-khan',
    name: 'Dr. Aisha Khan',
    role: 'Consultant Aesthetic Dermatologist',
    departmentId: 'dermatology',
    experience: 9,
    qualification: 'MBBS, DDVL, Fellowship in Dermato-surgery & Aesthetic Medicine',
    languages: ['English', 'Hindi', 'Kannada'],
    rating: 4.8,
    reviewsCount: 220,
    availability: ['Tue', 'Wed', 'Fri', 'Sat'],
    timeSlots: ['10:30 AM', '11:30 AM', '01:30 PM', '03:30 PM', '04:30 PM'],
    imageUrl: '/src/assets/images/dr_aisha_khan_1783854477559.jpg',
    bio: 'Dr. Aisha Khan is highly sought after for state-of-the-art chemical peels, laser resurfacing, and liquid facelifts. She aims to achieve highly natural aesthetic enhancements.'
  },
  // General Medicine
  {
    id: 'dr-sunil-deshmukh',
    name: 'Dr. Sunil Deshmukh',
    role: 'Senior Consultant - Internal Medicine',
    departmentId: 'general-medicine',
    experience: 25,
    qualification: 'MD (Internal Medicine), FICP (Fellow of Indian College of Physicians)',
    languages: ['English', 'Marathi', 'Hindi'],
    rating: 4.9,
    reviewsCount: 520,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop',
    bio: 'Dr. Sunil Deshmukh has served as primary physician to thousands of families. He is exceptionally skilled in diagnosing multi-system complex conditions and managing chronic diabetes/renal balances.'
  },
  {
    id: 'dr-tanvi-patel',
    name: 'Dr. Tanvi Patel',
    role: 'Consultant Family Physician & Wellness Coach',
    departmentId: 'general-medicine',
    experience: 11,
    qualification: 'MD (Family Medicine), Post Graduate Diploma in Geriatrics',
    languages: ['English', 'Gujarati', 'Hindi'],
    rating: 4.8,
    reviewsCount: 275,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '05:00 PM'],
    imageUrl: '/src/assets/images/dr_tanvi_patel_1783854490815.jpg',
    bio: 'Dr. Tanvi Patel emphasizes preventative wellness, dietary balancing, and elder-care treatments. She believes in active partnership with patients to build healthier lifestyles.'
  }
];

export const FAQS = [
  {
    q: 'How can I schedule an appointment?',
    a: 'You can easily schedule an appointment online using our direct "Book Appointment" feature on this website, or call our central support desk at +91 80 4912 8000. Your confirmation code will be visible immediately, which you can use to check details or cancel later.'
  },
  {
    q: 'Are telemedicine consultations available?',
    a: 'Yes, we provide safe video/audio telemedicine consultations for follow-ups and general advice. You can inquire when our coordinator contacts you to confirm your online booked appointment.'
  },
  {
    q: 'What should I bring on my first physical visit?',
    a: 'Please bring your valid government-issued ID card, any existing health insurance papers, and past medical records/reports or active prescription charts so your doctor can have a complete overview.'
  },
  {
    q: 'Do you offer emergency trauma care?',
    a: 'Absolutely. Sanjeevani Medical Centre has a fully functional, round-the-clock (24/7) Emergency & Trauma Care Unit with on-call critical care consultants and dedicated ambulance support.'
  },
  {
    q: 'How do I cancel or reschedule my booked appointment?',
    a: 'Navigate to the "Track Booking" tab on our header menu. Enter your appointment confirmation code (e.g., SMC-XXXXX) to instantly check the status, review instructions, or cancel your booking with a single click.'
  }
];

export const TESTIMONIALS = [
  {
    quote: 'The care and personal attention I received at Sanjeevani during my cardiac bypass recovery was extraordinary. Dr. Arvind Swamy and his team are true lifesavers.',
    author: 'Mohan Lal, Bengaluru',
    role: 'Cardiac Patient',
    stars: 5
  },
  {
    quote: 'Finding a pediatrician who makes your children feel completely safe and happy is a treasure. Dr. Sneha Reddy is exactly that. High-quality clinical care with absolute warmth.',
    author: 'Kavitha Ramachandran, Bengaluru',
    role: 'Mother of two children',
    stars: 5
  },
  {
    quote: 'Highly efficient appointment management and extremely clean corridors. Walked in for an orthopedic knee checkup with Dr. Rajesh Varma and was amazed by the seamless process.',
    author: 'John DSouza, Bengaluru',
    role: 'Retired Educator',
    stars: 5
  }
];
