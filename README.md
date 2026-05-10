# ExamShield 🛡️

> **AI-Powered Online Proctoring & Examination Platform**
> A full-stack web application for delivering secure, monitored, and analytics-rich online exams.

---

## 🎯 Project Highlights

ExamShield is a complete examination portal built to demonstrate how modern web technologies can deliver high-stakes assessments with academic integrity at scale. The system handles the entire exam lifecycle — from creation and scheduling to live proctoring and instant grading.

### Key Capabilities

| Capability | Description |
|---|---|
| 🛡️ **AI Proctoring** | Real-time webcam feed, face detection, tab-switch monitoring |
| 📝 **Smart Exam Engine** | Multi-question navigation, flagging, auto-save, timed sessions |
| 📊 **Live Analytics** | Grade distribution, pass rates, per-question insight |
| 👥 **Role-Based Access** | Separate portals for Students and Educators |
| ⚡ **Instant Grading** | Auto-calculated scores delivered immediately upon submission |
| 🎨 **Modern UI/UX** | Slate/Blue design system, fully responsive, accessible |

---

## 🚀 Live Demo Flow (for Evaluators)

### 1. Landing Page → `/`
Marketing site with hero, feature grid, "How It Works", testimonials, and CTA.

### 2. Sign In → `/login`
**Demo credentials are pre-filled — just click "Use Demo →":**

| Role | Email | Password |
|---|---|---|
| 🎓 Student | `sneha.singh@university.edu` | `demo1234` |
| 🛡️ Admin | `admin@university.edu` | `admin1234` |

### 3. Student Flow
- Dashboard → stats, upcoming exams, activity feed
- Available Exams → click **"Start Exam →"** on any exam
- **Live Exam Interface** (`/exam/1`) — the centerpiece:
  - Real webcam capture (browser will request camera permission)
  - Live countdown timer (30 min)
  - Tab-switch detection (try switching tabs!)
  - Simulated face-detection alerts
  - Question palette with answered/flagged states
  - Submit confirmation with summary
- My Results → past performance with grade bars
- Profile → editable info + system check page

### 4. Admin Flow
- Overview → KPIs, recent exams, live proctor alerts
- Manage Exams → CRUD table with create/edit modal
- Manage Students → bulk import + CRUD
- Results → grade distribution chart + integrity flags
- Proctor Logs → live anomaly timeline, resolve/reopen
- Settings → tabbed (General / Proctoring / Security / Integrations)

---

## 🛠️ Tech Stack

**Frontend**
- ⚛️ React 18 + Vite (lightning-fast dev experience)
- 🎨 Tailwind CSS v4 (CSS-first `@theme` configuration)
- 🧭 React Router 7 (modern routing)
- 📡 Axios (ready for backend integration)

**Backend** (in `/backend`)
- 🟢 Node.js + Express
- 🍃 MongoDB + Mongoose
- 🔐 JWT auth, bcrypt, role-based middleware
- ⏱ Rate limiting + input validation

**Design System**
- Slate/Blue palette: Primary `#1e40af`, Accent `#3b82f6`
- Inter font family
- Custom utilities: `gradient-text`, `gradient-primary`, `glass`, animations

---

## 📂 Architecture

Feature-based folder structure for clean scaling:

```
frontend/src/
├── components/
│   ├── common/        → Button (reusable atoms)
│   └── layout/        → Navbar, Footer, Sidebar, AdminSidebar,
│                         DashboardLayout, AdminLayout
├── pages/
│   ├── auth/          → Login, Register
│   ├── student/       → StudentDashboard, ExamList,
│   │                     ExamInterface, Results, Profile
│   ├── admin/         → AdminDashboard, ManageExams,
│   │                     ManageStudents, AdminResults,
│   │                     ProctorLogs, AdminSettings
│   ├── LandingPage.jsx
│   └── NotFound.jsx
├── App.jsx            → Centralized routing
├── index.css          → Tailwind v4 @theme tokens
└── main.jsx
```

---

## ▶️ Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dev server runs on **http://localhost:5173** by default.

---

## 🌟 Highlights to Showcase in Presentation

1. **Real webcam integration** — `navigator.mediaDevices.getUserMedia` in `ExamInterface.jsx`
2. **Tab-switch detection** — Page Visibility API integration
3. **Stateful timer with auto-submit** — `setInterval` cleanup, edge-case handling
4. **Question palette** with answered/flagged/current states
5. **Glass-morphism navbar** that responds to scroll
6. **Consistent design language** — every component shares the same border-radius, shadows, color tokens
7. **Fully accessible** — focus rings, semantic HTML, ARIA labels
8. **Responsive grids** — works on phone, tablet, projector

---

## 📸 Demo Talking Points

- *"Tailwind v4 lets us define design tokens directly in CSS using `@theme` — no config file."*
- *"The exam interface implements real proctoring primitives: camera access, page-visibility tracking, and timed sessions, all built on standard browser APIs."*
- *"The grade-distribution chart is computed reactively from the filtered result set, so as the user changes filters the visualization updates instantly."*
- *"The admin sidebar uses a dark slate-900 theme to clearly distinguish admin context from the student-facing portal."*

---

## 👤 Author

Built as a major final-year project to demonstrate modern full-stack development, secure authentication, and real-time browser APIs.
