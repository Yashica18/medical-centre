# Sanjeevani Medical Centre

A comprehensive, full-stack clinic management system and patient healthcare portal designed to streamline outpatient department (OPD) bookings, department navigations, patient administration, and customer assistance.

---

## 🚀 Key Features

*   **Smart Patient Portal**: Secure authentication enabling personalized patient dashboards to view and track dynamic medical appointments in real time.
*   **Intuitive OPD Scheduler**: Simplified appointment scheduler allowing patients to choose clinical departments, preferred specialists, and convenient slots.
*   **Sanjeevani Assistant**: An interactive clinical virtual assistant designed to handle patient inquiries. Equipped with an offline directory resolver to guarantee instant triage responses.
*   **Admin Dashboard**: A secure, comprehensive control panel for clinic managers to audit bookings, update slot availability, and handle patients.
*   **Dual Theme Environment**: A fully responsive, modern design system featuring a high-contrast dark mode toggle alongside a polished light aesthetic.
*   **E-mail Notifications**: Direct integration with secure SMTP mail services for automated consultation confirmations and administration alerts.

---

## 🛠️ Technology Stack

*   **Frontend**: React (v18+), Vite, Tailwind CSS, Motion, Lucide React icons, Recharts
*   **Backend**: Node.js, Express, TypeScript (transpiled & optimized with Esbuild)
*   **Database & Auth**: Firebase Firestore (durable cloud state), Firebase Authentication
*   **Notifications**: Nodemailer (SMTP mailer)

---

## 📁 Directory Structure

```text
├── src/
│   ├── components/       # UI Elements (Hero, Header, BookingForm, Tracker, etc.)
│   │   ├── AIChatbot.tsx          # Support Chatbot Widget
│   │   ├── AdminPortal.tsx        # Clinic Management Dashboard
│   │   ├── AppointmentTracker.tsx # Patient booking logs & statuses
│   │   └── Header.tsx             # Universal Navbar with theme controller
│   ├── App.tsx           # Primary application root & router pipeline
│   ├── index.css         # Tailwind directives & dark mode overrides
│   └── types.ts          # Consolidated clinical type interfaces
├── server.ts             # Express core server, directory resolver, and mail handlers
├── package.json          # Dependency manifest & scripts
└── tsconfig.json         # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Yashica18/sanjeevani-medical-centre.git
```

Navigate to the project folder:

```bash
cd sanjeevani-medical-centre
```

Install dependencies:

```bash
npm install
```

## 🔑 Environment Variables

Create a `.env.local` file in the project root and add your required environment variables.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

If your project uses Firebase, configure the required Firebase environment variables as needed.

## ▶️ Run the Development Server

```bash
npm run dev
```

The application will start locally. Open the URL shown in your terminal (typically `http://localhost:5173`).

## 📦 Build for Production

```bash
npm run build
```

## 📄 License

This project is available under the MIT License.
