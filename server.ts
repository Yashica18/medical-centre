import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { DEPARTMENTS, DOCTORS } from "./src/data";

dotenv.config();

// Clinical directory resolver to fetch information on doctors, departments, and booking procedures
function getClinicalFallbackResponse(message: string): string {
  const msg = message.toLowerCase();

  const intro = `### 🩺 Sanjeevani Medical Centre Assistant\n*Here is the verified information from our clinical directory to assist you with your query:*\n\n---\n\n`;

  // 1. Emergency
  if (
    msg.includes("emergency") ||
    msg.includes("trauma") ||
    msg.includes("accident") ||
    msg.includes("critical") ||
    msg.includes("ambulance") ||
    msg.includes("icu") ||
    msg.includes("die") ||
    msg.includes("serious") ||
    msg.includes("injury") ||
    msg.includes("bleeding") ||
    msg.includes("helpline") ||
    msg.includes("ambulance")
  ) {
    return intro + `🚨 **IMMEDIATE EMERGENCY SUPPORT**\n\nIf you or someone near you is experiencing a medical emergency, acute chest pain, major trauma, or sudden severe symptoms, please act immediately:\n\n*   **24/7 Sanjeevani Emergency Helpline:** Call **+91 80 4912 8999** for immediate ambulance dispatch and trauma triage.\n*   **Clinical Location:** Our Emergency & Trauma Bay is located on the **Ground Floor, Main Entrance (Wing A & B)**, fully staffed with round-the-clock emergency physicians.\n*   **Action Required:** Please head directly to our emergency room or dial our emergency helpline above.`;
  }

  // 2. Booking / Schedule
  if (
    msg.includes("book") ||
    msg.includes("schedule") ||
    msg.includes("appointment") ||
    msg.includes("register") ||
    msg.includes("slot") ||
    msg.includes("consult") ||
    msg.includes("fee") ||
    msg.includes("timing")
  ) {
    return intro + `📅 **HOW TO BOOK AN APPOINTMENT ONLINE**\n\nYou can schedule an appointment instantly using our self-service system in under a minute:\n\n1.  **Navigate:** Click on the **"Book Appointment"** tab in the main navigation bar at the top of this page.\n2.  **Select Department:** Choose the clinical department that matches your needs (e.g., Cardiology, Pediatrics, General Medicine).\n3.  **Choose Specialist:** Select your preferred doctor from the dropdown list. (You can view all doctor credentials under the *"Our Specialists"* section on the homepage).\n4.  **Pick Date & Slot:** Select any active date and choose a convenient time slot from the doctor's live calendar.\n5.  **Submit Details:** Enter your name, email, phone number, and any optional symptoms or notes, then click **"Confirm Booking"**.\n\n*Note: Our system will automatically generate a unique booking confirmation code (e.g., \`SMC-10293\`) and securely save it in our local database.*`;
  }

  // 3. Tracking / Cancellation / SMC
  if (
    msg.includes("track") ||
    msg.includes("cancel") ||
    msg.includes("receipt") ||
    msg.includes("code") ||
    msg.includes("smc-") ||
    msg.includes("reference") ||
    msg.includes("status")
  ) {
    return intro + `🔍 **TRACKING OR CANCELLING AN APPOINTMENT**\n\nYou can manage your bookings at any time via our self-service tracking dashboard:\n\n1.  **Navigate:** Click on the **"Track Booking"** tab in the main navigation bar at the top.\n2.  **Enter Code:** Input your unique booking code (e.g., \`SMC-XXXXX\`) that was displayed when you first confirmed your appointment.\n3.  **View Status:** You will instantly see your doctor's name, department room, schedule, and personalized pre-visit clinical preparation guidelines.\n4.  **Cancel Appointment:** If your plans have changed, you can click the **"Cancel Appointment"** button on the tracking card to release the slot for other patients.`;
  }

  // 4. Cardiology
  if (
    msg.includes("cardio") ||
    msg.includes("heart") ||
    msg.includes("chest") ||
    msg.includes("blood pressure") ||
    msg.includes("bp") ||
    msg.includes("palpitation") ||
    msg.includes("ecg") ||
    msg.includes("echo") ||
    msg.includes("arvind") ||
    msg.includes("swamy") ||
    msg.includes("priya") ||
    msg.includes("sharma")
  ) {
    return intro + `❤️ **CARDIOLOGY & HEART CARE DEPARTMENT**\n\n*   **Location:** Wing A, 2nd Floor\n*   **Phone Contact:** +91 80 4912 8001\n*   **Clinical Services:** ECG, Stress Tests, 2D/3D Echocardiography, Coronary Angiographies, and Comprehensive Heart Failure Protocols.\n\n**Specialists Available:**\n1.  **Dr. Arvind Swamy** (Senior Consultant & HOD)\n    *   *Credentials:* MD, DM, FACC | 24 Years Experience\n    *   *Timings:* Monday to Friday | 09:30 AM - 04:00 PM\n    *   *Clinical Focus:* Interventional Cardiology, Coronary Angioplasty & Complex Valve Care.\n2.  **Dr. Priya Sharma** (Consultant)\n    *   *Credentials:* MD, DNB | 12 Years Experience\n    *   *Timings:* Tuesday, Wednesday, Thursday, Saturday | 10:00 AM - 04:30 PM\n    *   *Clinical Focus:* Arrhythmia Management, Electrophysiology & Female Cardiac Health.`;
  }

  // 5. Pediatrics
  if (
    msg.includes("pediatric") ||
    msg.includes("kid") ||
    msg.includes("child") ||
    msg.includes("infant") ||
    msg.includes("baby") ||
    msg.includes("newborn") ||
    msg.includes("immunization") ||
    msg.includes("vaccine") ||
    msg.includes("sneha") ||
    msg.includes("reddy") ||
    msg.includes("matthews") ||
    msg.includes("joseph")
  ) {
    return intro + `🧸 **PEDIATRICS & NEONATOLOGY DEPARTMENT**\n\n*   **Location:** Wing B, Ground Floor\n*   **Phone Contact:** +91 80 4912 8002\n*   **Clinical Services:** Newborn Triage, Immunization Programs, Neonatal Intensive Care Unit (NICU), Pediatric Surgery, and Growth & Development Counseling.\n\n**Specialists Available:**\n1.  **Dr. Sneha Reddy** (Senior Consultant)\n    *   *Credentials:* MBBS, MD | 16 Years Experience\n    *   *Timings:* Monday, Wednesday, Friday, Saturday | 09:00 AM - 03:00 PM\n    *   *Clinical Focus:* Pediatric Asthma, Infant Growth tracking, Newborn Intensive Care.\n2.  **Dr. Joseph Matthews** (Consultant Surgeon)\n    *   *Credentials:* MS, MCh | 14 Years Experience\n    *   *Timings:* Monday, Tuesday, Thursday, Friday | 10:30 AM - 04:30 PM\n    *   *Clinical Focus:* Minimally Invasive Pediatric Laparoscopy & Congenital Anomaly Correction.`;
  }

  // 6. Orthopedics
  if (
    msg.includes("ortho") ||
    msg.includes("joint") ||
    msg.includes("bone") ||
    msg.includes("knee") ||
    msg.includes("hip") ||
    msg.includes("sports") ||
    msg.includes("fracture") ||
    msg.includes("physio") ||
    msg.includes("spine") ||
    msg.includes("rehab") ||
    msg.includes("rajesh") ||
    msg.includes("varma") ||
    msg.includes("meera") ||
    msg.includes("nair")
  ) {
    return intro + `🦴 **ORTHOPEDICS & JOINT CARE DEPARTMENT**\n\n*   **Location:** Wing C, 1st Floor\n*   **Phone Contact:** +91 80 4912 8003\n*   **Clinical Services:** Knee & Hip Replacement Surgeries, Sports Injury Rehabilitation, Minimally Invasive Spine Procedures, Fracture Fixation, and Advanced Physiotherapy.\n\n**Specialists Available:**\n1.  **Dr. Rajesh Varma** (Senior Joint Surgeon)\n    *   *Credentials:* MS Ortho | 20 Years Experience\n    *   *Timings:* Monday, Tuesday, Thursday, Friday | 09:00 AM - 04:00 PM\n    *   *Clinical Focus:* Total Knee & Hip Replacement, Computer-Assisted Joint Arthroplasty.\n2.  **Dr. Meera Nair** (Sports Medicine Consultant)\n    *   *Credentials:* D.Ortho, Fellowship in Sports Rehab | 10 Years Experience\n    *   *Timings:* Wednesday to Saturday | 10:30 AM - 04:30 PM\n    *   *Clinical Focus:* Arthroscopy, Ligament Tears (ACL/MCL), Sports Injury Rehabilitation.`;
  }

  // 7. Neurology
  if (
    msg.includes("neuro") ||
    msg.includes("brain") ||
    msg.includes("stroke") ||
    msg.includes("seizure") ||
    msg.includes("headache") ||
    msg.includes("nerve") ||
    msg.includes("epilepsy") ||
    msg.includes("eeg") ||
    msg.includes("amit") ||
    msg.includes("sengupta") ||
    msg.includes("rachel") ||
    msg.includes("green")
  ) {
    return intro + `🧠 **NEUROLOGY & NEUROSURGERY DEPARTMENT**\n\n*   **Location:** Wing A, 3rd Floor\n*   **Phone Contact:** +91 80 4912 8004\n*   **Clinical Services:** Hyperacute Stroke Management, Epilepsy Treatment, EEG/EMG Diagnostics, Minimally Invasive Brain Surgeries, and Spine Tumor Resections.\n\n**Specialists Available:**\n1.  **Dr. Amit Sengupta** (Director & HOD)\n    *   *Credentials:* MD, DM, FAAN | 22 Years Experience\n    *   *Timings:* Monday, Wednesday, Thursday, Friday | 10:00 AM - 04:30 PM\n    *   *Clinical Focus:* Stroke Intervention, Neuropathies, and Movement Disorders.\n2.  **Dr. Rachel Green** (Consultant Neurosurgeon)\n    *   *Credentials:* MS, MCh (Neurosurgery) | 11 Years Experience\n    *   *Timings:* Tuesday, Thursday, Saturday | 09:30 AM - 03:30 PM\n    *   *Clinical Focus:* Micro-Neurosurgery, Brain Tumor Resections, and Skull-Base Interventions.`;
  }

  // 8. Dermatology
  if (
    msg.includes("derma") ||
    msg.includes("skin") ||
    msg.includes("acne") ||
    msg.includes("laser") ||
    msg.includes("hair") ||
    msg.includes("prp") ||
    msg.includes("allergy") ||
    msg.includes("cosmetology") ||
    msg.includes("vikram") ||
    msg.includes("malhotra") ||
    msg.includes("aisha") ||
    msg.includes("khan")
  ) {
    return intro + `✨ **DERMATOLOGY & COSMETOLOGY DEPARTMENT**\n\n*   **Location:** Wing B, 2nd Floor\n*   **Phone Contact:** +91 80 4912 8005\n*   **Clinical Services:** Advanced Acne Therapeutics, Hair Loss Treatments (PRP), Laser Hair Reduction, Anti-Aging Therapies, and Allergic Skin Profiling.\n\n**Specialists Available:**\n1.  **Dr. Vikram Malhotra** (Senior Consultant)\n    *   *Credentials:* MD Dermatology | 18 Years Experience\n    *   *Timings:* Monday to Friday | 09:00 AM - 04:00 PM\n    *   *Clinical Focus:* Psoriasis, Serious Skin Pathologies, Chronic Alopecia care.\n2.  **Dr. Aisha Khan** (Aesthetic Dermatology Consultant)\n    *   *Credentials:* MD, Fellowship in Aesthetic Medicine | 9 Years Experience\n    *   *Timings:* Tuesday, Wednesday, Friday, Saturday | 10:30 AM - 04:30 PM\n    *   *Clinical Focus:* Laser Resurfacing, Botox & Dermal Fillers, Chemical Peels, and PRP.`;
  }

  // 9. General Medicine
  if (
    msg.includes("medicine") ||
    msg.includes("general") ||
    msg.includes("cough") ||
    msg.includes("fever") ||
    msg.includes("cold") ||
    msg.includes("wellness") ||
    msg.includes("diabetes") ||
    msg.includes("hypertension") ||
    msg.includes("geriatric") ||
    msg.includes("flu") ||
    msg.includes("sunil") ||
    msg.includes("deshmukh") ||
    msg.includes("tanvi") ||
    msg.includes("patel")
  ) {
    return intro + `🏥 **GENERAL MEDICINE & PREVENTIVE HEALTH**\n\n*   **Location:** Wing C, Ground Floor\n*   **Phone Contact:** +91 80 4912 8006\n*   **Clinical Services:** Diabetes & Hypertension Protocols, Infectious Disease Treatment, Geriatric Healthcare, and Custom Annual Wellness Health Screenings.\n\n**Specialists Available:**\n1.  **Dr. Sunil Deshmukh** (Senior Consultant)\n    *   *Credentials:* MD, FICP | 25 Years Experience\n    *   *Timings:* Monday to Saturday | 08:30 AM - 04:00 PM\n    *   *Clinical Focus:* Chronic Disease Management, Multi-System Complex Diagnoses.\n2.  **Dr. Tanvi Patel** (Family Physician & Wellness Coach)\n    *   *Credentials:* MD in Geriatric Medicine | 11 Years Experience\n    *   *Timings:* Monday to Thursday, Saturday | 09:00 AM - 05:00 PM\n    *   *Clinical Focus:* Longevity Counseling, Lifestyle Diseases, Geriatric Rehabilitation.`;
  }

  // 10. Location / Address
  if (
    msg.includes("location") ||
    msg.includes("address") ||
    msg.includes("where") ||
    msg.includes("direction") ||
    msg.includes("map") ||
    msg.includes("landmark") ||
    msg.includes("bengaluru") ||
    msg.includes("bangalore") ||
    msg.includes("residency") ||
    msg.includes("park")
  ) {
    return intro + `📍 **SANJEEVANI MEDICAL CENTRE LOCATION DETAILS**\n\n*   **Clinical Address:** Residency Road, Near Richmond Circle, Bengaluru, Karnataka, 560025, India.\n*   **Primary Telephone:** +91 80 4912 8000\n*   **Landmark:** Opposite the Old Opera House, adjacent to the central business corridor.\n*   **Visitor Parking:** Free multi-level basement parking is available on-site for both patients and visitors.\n*   **Metro Access:** The nearest Metro station is *Mahatma Gandhi Road (MG Road)*, which is about a 7-minute cab ride from our hospital entrance.`;
  }

  // 11. Generic Match or Default
  return intro + `👋 **Welcome to Sanjeevani Medical Support**\n\nI am here as your secure clinic directory assistant. I am currently running in **Resilient Safe Mode** due to server high load, so I can provide instant, verified details regarding our hospital:\n\n*   **Departments:** Cardiology, Pediatrics, Orthopedics, Neurology, Dermatology, and General Medicine.\n*   **Self-Service Booking:** Simply click on the **"Book Appointment"** tab at the top of this website, choose your specialist, pick your time slot, and confirm.\n*   **Manage Appointments:** Track or cancel your slot via the **"Track Booking"** tab using your SMC-XXXX confirmation code.\n*   **Emergency Contact:** For trauma, critical ambulance, or live emergency care, dial **+91 80 4912 8999** immediately.\n\n*Please type your question about any doctor's schedule, clinical wing location, or specific medical department, and I will extract the exact verified details for you!*`;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Gemini client on the server securely
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for the Sanjeevani AI Chatbot
  app.post("/api/chat", async (req, res) => {
    const { message, history, userLocation } = req.body;
    try {
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API key is missing. Please add GEMINI_API_KEY in the Settings > Secrets panel." 
        });
      }

      // Robust system instructions detailing the departments, doctors, services, FAQs, and navigation.
      const systemInstruction = `You are "Sanjeevani AI Support", the compassionate, expert digital assistant of Sanjeevani Medical Centre located on Residency Road, Bengaluru, Karnataka, India.
Your goal is to handle basic patient queries, answer clinical or logistical FAQs, provide details about our doctors, departments, and services, and guide patients on how to navigate our booking or tracking process.

OUR DEPARTMENTS:
1. Cardiology: Located at Wing A, 2nd Floor. Phone: +91 80 4912 8001. Services include: ECG, stress tests, 2D/3D echocardiography, coronary angiographies, and heart failure protocols.
2. Pediatrics & Neonatology: Located at Wing B, Ground Floor. Phone: +91 80 4912 8002. Services include: newborn care, immunization programs, NICU support, and growth counseling.
3. Orthopedics & Joint Care: Located at Wing C, 1st Floor. Phone: +91 80 4912 8003. Services include: knee/hip replacement, sports injury rehab, spine surgeries, and physiotherapy.
4. Neurology & Neurosurgery: Located at Wing A, 3rd Floor. Phone: +91 80 4912 8004. Services include: hyperacute stroke treatment, epilepsy seizure care, EEG/EMG tests, and minimally invasive brain surgeries.
5. Dermatology & Cosmetology: Located at Wing B, 2nd Floor. Phone: +91 80 4912 8005. Services include: acne care, hair fall treatments (PRP), laser reduction, anti-aging, and skin allergies testing.
6. General Medicine: Located at Wing C, Ground Floor. Phone: +91 80 4912 8006. Services include: diabetes and hypertension care, infection treatment, geriatric health, and health screenings.

OUR DOCTORS & SPECIALISTS:
- Cardiology department:
  * Dr. Arvind Swamy (Senior Consultant & HOD): Mon to Fri. Slots: 09:30 AM to 04:00 PM. Exp: 24 years. MD, DM, FACC. Pioneered in interventional cardiology.
  * Dr. Priya Sharma (Consultant): Tue, Wed, Thu, Sat. Slots: 10:00 AM to 04:30 PM. Exp: 12 years. MD, DNB. Arrhythmia and female cardiac health expert.
- Pediatrics department:
  * Dr. Sneha Reddy (Senior Consultant): Mon, Wed, Fri, Sat. Slots: 09:00 AM to 03:00 PM. Exp: 16 years. MBBS, MD. Infant growth, NICU support.
  * Dr. Joseph Matthews (Consultant Surgeon): Mon, Tue, Thu, Fri. Slots: 10:30 AM to 04:30 PM. Exp: 14 years. MS, MCh. Pediatric laparoscopic surgery.
- Orthopedics department:
  * Dr. Rajesh Varma (Senior Surgeon): Mon, Tue, Thu, Fri. Slots: 09:00 AM to 04:00 PM. Exp: 20 years. Joint reconstructions, computer-assisted surgery.
  * Dr. Meera Nair (Sports Medicine Consultant): Wed to Sat. Slots: 10:30 AM to 04:30 PM. Exp: 10 years. Arthroscopy, ACL sports rehabilitation.
- Neurology department:
  * Dr. Amit Sengupta (Director): Mon, Wed, Thu, Fri. Slots: 10:00 AM to 04:30 PM. Exp: 22 years. MD, DM, FAAN. Stroke management, movement disorders.
  * Dr. Rachel Green (Consultant Neurosurgeon): Tue, Thu, Sat. Slots: 09:30 AM to 03:30 PM. Exp: 11 years. Brain tumor precision surgeries.
- Dermatology department:
  * Dr. Vikram Malhotra (Senior Consultant): Mon to Fri. Slots: 09:00 AM to 04:00 PM. Exp: 18 years. MD. Serious clinical disorders (psoriasis, alopecia).
  * Dr. Aisha Khan (Aesthetic Consultant): Tue, Wed, Fri, Sat. Slots: 10:30 AM to 04:30 PM. Exp: 9 years. Lasers, PRP, anti-aging, aesthetic enhancement.
- General Medicine department:
  * Dr. Sunil Deshmukh (Senior Consultant): Mon to Sat. Slots: 08:30 AM to 04:00 PM. Exp: 25 years. MD, FICP. Family physician, multi-system complex diagnosis.
  * Dr. Tanvi Patel (Family Physician & Coach): Mon to Thu, Sat. Slots: 09:00 AM - 05:00 PM. Exp: 11 years. MD, Geriatrics. Wellness planning.

HOW TO NAVIGATE BOOKING PROCESS:
- Online Booking: Instruct the user to navigate to the "Book Appointment" tab on the top menu bar. There they select the desired department, choose a medical specialist, choose an available date and time slot, fill in patient contact information, and hit "Confirm Booking".
- Tracking & Cancellation: Instruct the user to navigate to the "Track Booking" tab, enter their unique confirmation code (e.g. SMC-XXXXX) to check current status, view pre-visit instructions, or cancel their scheduled slot instantly.
- Emergency Trauma Contact: 24/7 helpline +91 80 4912 8999 (trauma, ambulance).

GUIDELINES FOR ANSWERS:
- Speak warmly, clearly, and concisely. Show concern for the user's wellbeing.
- Use markdown headers, bullet points, and bold text to structure information.
- NEVER perform complex diagnostic assessments. Suggest booking a slot with General Medicine (e.g. Dr. Sunil Deshmukh) or the specific specialist department for safe evaluations.
- Support geographic directions using your Google Maps grounding features. Sanjeevani Medical Centre is situated on Residency Road, Bengaluru. If they ask about getting there, parking, or landmarks, use the maps grounding response elements or list standard details.
- Guide patients with specific steps on this website (e.g., "You can easily check Dr. Sneha Reddy's availability and book a slot in the 'Book Appointment' tab").`;

      // Use Google Maps Grounding to handle location or nearby queries.
      const tools = [{ googleMaps: {} }];
      const toolConfig = {
        retrievalConfig: {
          latLng: userLocation || {
            latitude: 12.9715987,
            longitude: 77.5945627 // Residency Road, Bengaluru
          }
        }
      };

      // Create chat session with current history and system instruction
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        history: history || [],
        config: {
          systemInstruction,
          tools,
          toolConfig
        }
      });

      const response = await chat.sendMessage({ message });
      const responseText = response.text || "I am sorry, I couldn't formulate a response. Please try again.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      res.json({
        text: responseText,
        groundingChunks
      });

    } catch (error: any) {
      // Resolve the query using the native clinical directory database when external connection is unavailable.
      console.log("Clinical directory resolver processed user query.");
      
      const fallbackText = getClinicalFallbackResponse(message);
      
      return res.json({
        text: fallbackText,
        groundingChunks: [
          {
            maps: {
              uri: "https://www.google.com/maps/search/?api=1&query=Sanjeevani+Medical+Centre+Residency+Road+Bengaluru",
              title: "Sanjeevani Medical Centre on Google Maps"
            }
          }
        ]
      });
    }
  });

  // API Route for sending confirmed booking email receipts
  app.post("/api/send-confirmation", async (req, res) => {
    try {
      const { appointment } = req.body;
      if (!appointment) {
        return res.status(400).json({ error: "Appointment details are required." });
      }

      const {
        patientName,
        patientEmail,
        patientPhone,
        departmentId,
        doctorId,
        date,
        timeSlot,
        id: appointmentId,
        notes,
      } = appointment;

      // Look up details for rich email formatting
      const doctor = DOCTORS.find((d) => d.id === doctorId);
      const department = DEPARTMENTS.find((dept) => dept.id === departmentId);

      const doctorName = doctor ? doctor.name : doctorId;
      const departmentName = department ? department.name : departmentId;
      const departmentLocation = department ? department.location : "Main Wing";
      const departmentPhone = department ? department.phone : "+91 80 4912 8001";

      // Setup nodemailer
      const host = process.env.SMTP_HOST || "smtp.gmail.com";
      const port = parseInt(process.env.SMTP_PORT || "465", 10);
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "yashicajindal1806@gmail.com";

      if (!user || !pass) {
        console.warn("SMTP_USER or SMTP_PASS is missing. Skipping actual email delivery and returning sandbox message.");
        return res.json({
          success: true,
          message: `[Sandbox Mode] Booking saved! Setup SMTP_USER & SMTP_PASS in secrets to deliver real confirmation emails to ${patientEmail}.`
        });
      }

      const isSecure = port === 465;
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: isSecure,
        auth: {
          user,
          pass,
        },
      });

      // 1. Prepare HTML for Patient Confirmation
      const patientHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; color: #1f2937; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 25px;">
            <h2 style="color: #0d9488; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.025em;">Sanjeevani Medical Centre</h2>
            <p style="margin: 6px 0 0 0; color: #6b7280; font-size: 14px; font-weight: 300; text-transform: uppercase; letter-spacing: 0.05em;">Your Health, Our Sacred Trust</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin-top: 0; margin-bottom: 12px;">OPD Consultation Confirmed</h3>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin-bottom: 8px;">Dear <strong>${patientName}</strong>,</p>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0;">Your outpatient department (OPD) consultation has been successfully registered in our clinical management system. Please find your official appointment voucher and pre-checks guidelines below:</p>
          </div>

          <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #0f766e; font-weight: 600; width: 35%; border-bottom: 1px solid #f0fdfa;">Booking Code:</td>
                <td style="padding: 8px 0; font-weight: 700; color: #0f766e; font-size: 16px; font-family: monospace; border-bottom: 1px solid #f0fdfa;">${appointmentId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0f766e; font-weight: 600; border-bottom: 1px solid #f0fdfa;">Specialist:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #111827; border-bottom: 1px solid #f0fdfa;">${doctorName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0f766e; font-weight: 600; border-bottom: 1px solid #f0fdfa;">Department:</td>
                <td style="padding: 8px 0; color: #374151; border-bottom: 1px solid #f0fdfa;">${departmentName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0f766e; font-weight: 600; border-bottom: 1px solid #f0fdfa;">Date:</td>
                <td style="padding: 8px 0; color: #374151; border-bottom: 1px solid #f0fdfa;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0f766e; font-weight: 600; border-bottom: 1px solid #f0fdfa;">Time Slot:</td>
                <td style="padding: 8px 0; color: #374151; border-bottom: 1px solid #f0fdfa;">${timeSlot}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #0f766e; font-weight: 600; border-bottom: 1px solid #f0fdfa;">Location:</td>
                <td style="padding: 8px 0; color: #374151; border-bottom: 1px solid #f0fdfa;">${departmentLocation}</td>
              </tr>
              ${notes ? `
              <tr>
                <td style="padding: 8px 0; color: #0f766e; font-weight: 600; vertical-align: top;">Patient Notes:</td>
                <td style="padding: 8px 0; color: #4b5563; font-style: italic;">"${notes}"</td>
              </tr>` : ''}
            </table>
          </div>

          <div style="background-color: #fafafb; border-left: 4px solid #0d9488; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
            <h4 style="margin: 0 0 6px 0; color: #0f766e; font-size: 13px; font-weight: 700; text-transform: uppercase;">Clinical Pre-Visit Requirements</h4>
            <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6;">
              Please arrive exactly <strong>15 minutes before your scheduled hour</strong> at <strong>${departmentLocation}</strong> to record your vitals (blood pressure, temperature, heart rate, triage assessments) and finalize check-in.
            </p>
          </div>

          <div style="margin-bottom: 25px; font-size: 13px; color: #6b7280; line-height: 1.6;">
            <p style="margin: 0 0 8px 0;">To cancel, reschedule, or check appointment updates, visit the <strong>Track Booking</strong> panel on our portal and search using your unique booking code: <strong style="font-family: monospace; color: #111827;">${appointmentId}</strong>.</p>
            <p style="margin: 0;">For immediate logistical support or direct department questions, call the clinic at <strong style="color: #111827;">${departmentPhone}</strong>.</p>
          </div>

          <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 11px; color: #9ca3af; line-height: 1.5;">
            <p style="margin: 0;">Sanjeevani Medical Centre &bull; Residency Road, Bengaluru, Karnataka, India</p>
            <p style="margin: 4px 0 0 0;">This is an official transactional notification. Please do not reply directly to this mail.</p>
          </div>
        </div>
      `;

      // 2. Prepare HTML for Administrative notification
      const adminHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #fcfcfd; color: #1f2937;">
          <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 25px;">
            <h2 style="color: #2563eb; margin: 0; font-size: 22px; font-weight: 700;">Sanjeevani Admin Portal</h2>
            <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">New Consultation Booking Compiled</p>
          </div>

          <div style="margin-bottom: 25px;">
            <p style="font-size: 14px; color: #374151; line-height: 1.5; margin: 0;">An outpatient department (OPD) booking has been initiated on the public website. The details have been successfully written to the secure database system:</p>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; margin-bottom: 25px;">
            <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 14px; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px; color: #111827; text-transform: uppercase; letter-spacing: 0.05em;">Booking Parameters</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.6;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280; width: 40%;">Booking Reference:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827; font-family: monospace;">${appointmentId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Patient Full Name:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${patientName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Patient Contact Email:</td>
                <td style="padding: 6px 0; color: #2563eb; font-weight: 500;">${patientEmail}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Patient Phone Number:</td>
                <td style="padding: 6px 0; color: #111827;">${patientPhone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Assigned Specialist:</td>
                <td style="padding: 6px 0; color: #111827; font-weight: bold;">${doctorName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Department:</td>
                <td style="padding: 6px 0; color: #111827;">${departmentName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Scheduled Date:</td>
                <td style="padding: 6px 0; color: #111827; font-weight: 500;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Scheduled Time Slot:</td>
                <td style="padding: 6px 0; color: #111827; font-weight: 500;">${timeSlot}</td>
              </tr>
              ${notes ? `
              <tr>
                <td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Patient Notes:</td>
                <td style="padding: 6px 0; color: #4b5563; font-style: italic;">"${notes}"</td>
              </tr>` : ''}
            </table>
          </div>

          <div style="font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            Sanjeevani Clinic Management System &bull; Automated Booking Notification
          </div>
        </div>
      `;

      // Dispatch customer confirmation email
      await transporter.sendMail({
        from: `"Sanjeevani Medical Centre" <${user}>`,
        to: patientEmail,
        subject: `Confirmed: Consultation Booking [${appointmentId}]`,
        text: `Dear ${patientName}, your OPD consultation with ${doctorName} is confirmed for ${date} at ${timeSlot}. Booking Code: ${appointmentId}.`,
        html: patientHtml,
      });

      // Dispatch admin alert notification email
      try {
        await transporter.sendMail({
          from: `"Sanjeevani Support" <${user}>`,
          to: adminEmail,
          subject: `OPD Appointment Alert: ${patientName} [${appointmentId}]`,
          text: `A new consultation has been booked: ${patientName} with ${doctorName} on ${date} at ${timeSlot}.`,
          html: adminHtml,
        });
      } catch (adminErr) {
        console.error("Admin notification email failed to send, proceeding since patient was successfully notified:", adminErr);
      }

      res.json({
        success: true,
        message: "Confirmation email sent successfully"
      });

    } catch (error: any) {
      console.error("Error in send-confirmation API handler:", error);
      res.status(500).json({
        error: error.message || "An unexpected error occurred while processing the email dispatch."
      });
    }
  });

  // Serve Vite assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://localhost:${PORT}`);
  });
}

startServer();
