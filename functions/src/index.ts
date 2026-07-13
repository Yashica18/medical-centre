import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

// Define a Firestore cloud trigger on new appointments
// It is securely mounted with access to Secret Manager credentials
export const onAppointmentCreated = onDocumentCreated({
  document: "appointments/{appointmentId}",
  secrets: ["SMTP_USER", "SMTP_PASS"],
}, async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No snapshot data available.");
    return;
  }

  const appointment = snapshot.data();
  if (!appointment) {
    console.log("No appointment data available.");
    return;
  }

  // Only send if email notification was requested
  if (appointment.emailNotificationsEnabled === false) {
    console.log("Email notifications are disabled for this booking.");
    return;
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

  // Retrieve SMTP credentials from environment (injected securely via Google Secret Manager)
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.error("SMTP_USER or SMTP_PASS secrets are not configured in Firebase Secret Manager.");
    return;
  }

  // Standard Gmail SMTP Transporter config
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for SSL port 465
    auth: {
      user,
      pass,
    },
  });

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "yashicajindal1806@gmail.com";

  // HTML template for customer/patient
  const patientHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff; color: #1f2937;">
      <div style="text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 25px;">
        <h2 style="color: #0d9488; margin: 0; font-size: 26px; font-weight: 700;">Sanjeevani Medical Centre</h2>
        <p style="margin: 6px 0 0 0; color: #6b7280; font-size: 14px; text-transform: uppercase;">Your Health, Our Sacred Trust</p>
      </div>
      
      <div style="margin-bottom: 25px;">
        <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin-top: 0; margin-bottom: 12px;">OPD Consultation Confirmed</h3>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">Dear <strong>${patientName}</strong>,</p>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">Your consultation has been successfully recorded in our central clinic system. Below is your official appointment voucher:</p>
      </div>

      <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #0f766e; font-weight: 600; width: 35%;">Booking Code:</td>
            <td style="padding: 8px 0; font-weight: 700; color: #0f766e; font-size: 16px; font-family: monospace;">${appointmentId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #0f766e; font-weight: 600;">Specialist ID:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #111827;">${doctorId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #0f766e; font-weight: 600;">Department:</td>
            <td style="padding: 8px 0; color: #374151;">${departmentId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #0f766e; font-weight: 600;">Date:</td>
            <td style="padding: 8px 0; color: #374151;">${date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #0f766e; font-weight: 600;">Time Slot:</td>
            <td style="padding: 8px 0; color: #374151;">${timeSlot}</td>
          </tr>
          ${notes ? `
          <tr>
            <td style="padding: 8px 0; color: #0f766e; font-weight: 600; vertical-align: top;">Patient Notes:</td>
            <td style="padding: 8px 0; color: #4b5563; font-style: italic;">"${notes}"</td>
          </tr>` : ""}
        </table>
      </div>

      <div style="background-color: #fafafb; border-left: 4px solid #0d9488; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
        <h4 style="margin: 0 0 6px 0; color: #0f766e; font-size: 13px; font-weight: 700; text-transform: uppercase;">Pre-Visit Checklists</h4>
        <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6;">
          Please reach our OPD lobby exactly <strong>15 minutes before your scheduled hour</strong>. Remember to carry prior medical reports or prescription charts.
        </p>
      </div>

      <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 11px; color: #9ca3af;">
        <p style="margin: 0;">Sanjeevani Medical Centre &bull; Bengaluru, Karnataka, India</p>
      </div>
    </div>
  `;

  // HTML template for admin notification
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #fafafa; color: #1f2937;">
      <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 25px;">
        <h2 style="color: #2563eb; margin: 0; font-size: 22px;">Sanjeevani Admin System</h2>
        <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 12px; font-weight: 600; text-transform: uppercase;">New Consultation Document Compiled</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.6;">
        <tr><td style="padding: 6px 0; color: #6b7280; width: 40%;">Booking Reference:</td><td style="padding: 6px 0; font-weight: bold;">${appointmentId}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Patient Full Name:</td><td style="padding: 6px 0; font-weight: bold;">${patientName}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Patient Contact Email:</td><td style="padding: 6px 0; color: #2563eb;">${patientEmail}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Patient Phone Number:</td><td style="padding: 6px 0;">${patientPhone}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Assigned Specialist ID:</td><td style="padding: 6px 0; font-weight: bold;">${doctorId}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Scheduled Date:</td><td style="padding: 6px 0;">${date}</td></tr>
        <tr><td style="padding: 6px 0; color: #6b7280;">Scheduled Time Slot:</td><td style="padding: 6px 0;">${timeSlot}</td></tr>
      </table>
    </div>
  `;

  try {
    // 1. Dispatch Customer email
    await transporter.sendMail({
      from: `"Sanjeevani Medical Centre" <${user}>`,
      to: patientEmail,
      subject: `Confirmed: Consultation Booking [${appointmentId}]`,
      text: `Dear ${patientName}, your appointment is confirmed for ${date} at ${timeSlot}. Code: ${appointmentId}.`,
      html: patientHtml,
    });
    console.log(`Confirmation email sent successfully to patient: ${patientEmail}`);

    // 2. Dispatch Admin alert
    await transporter.sendMail({
      from: `"Sanjeevani Telemetry Core" <${user}>`,
      to: adminEmail,
      subject: `OPD Appointment Alert: ${patientName} [${appointmentId}]`,
      text: `New consultation: ${patientName} with ${doctorId} on ${date} at ${timeSlot}.`,
      html: adminHtml,
    });
    console.log(`Admin email alert sent to: ${adminEmail}`);

  } catch (error) {
    console.error("Nodemailer failed to dispatch emails:", error);
  }
});
