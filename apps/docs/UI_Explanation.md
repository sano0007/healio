# Healio – Complete UI Explanation Document

> A comprehensive breakdown of every page, component, and user flow in the Healio healthcare platform.

---

## 1. Page Inventory Overview

The platform has **26 pages** organized across 4 areas: Public, Patient, Doctor, and Admin.

| #   | Route                                         | Page                          | Role           |
| --- | --------------------------------------------- | ----------------------------- | -------------- |
| 1   | `/`                                           | Landing Page                  | Public         |
| 2   | `/auth/login`                                 | Login                         | Public         |
| 3   | `/auth/register`                              | Register                      | Public         |
| 4   | `/auth/register/doctor`                       | Doctor Registration           | Public         |
| 5   | `/auth/forgot-password`                       | Forgot Password               | Public         |
| 6   | `/dashboard`                                  | Patient Dashboard             | Patient        |
| 7   | `/doctors`                                    | Doctor Search & Listing       | Patient        |
| 8   | `/doctors/[id]`                               | Doctor Profile                | Patient        |
| 9   | `/appointments/book/[doctorId]`               | Appointment Booking           | Patient        |
| 10  | `/appointments`                               | My Appointments               | Patient        |
| 11  | `/appointments/[id]`                          | Appointment Detail            | Patient        |
| 12  | `/consultations/[id]`                         | Video Consultation Room       | Patient/Doctor |
| 13  | `/records`                                    | Medical Records               | Patient        |
| 14  | `/prescriptions`                              | My Prescriptions              | Patient        |
| 15  | `/symptom-checker`                            | AI Symptom Checker            | Patient        |
| 16  | `/payments/checkout/[appointmentId]`          | Payment Checkout              | Patient        |
| 17  | `/notifications`                              | Notification Center           | Patient/Doctor |
| 18  | `/settings`                                   | Profile & Settings            | All            |
| 19  | `/doctor/dashboard`                           | Doctor Dashboard              | Doctor         |
| 20  | `/doctor/appointments`                        | Doctor Appointment Management | Doctor         |
| 21  | `/doctor/availability`                        | Availability Schedule         | Doctor         |
| 22  | `/doctor/prescriptions/issue/[appointmentId]` | Issue Prescription            | Doctor         |
| 23  | `/admin/dashboard`                            | Admin Dashboard               | Admin          |
| 24  | `/admin/users`                                | User Management               | Admin          |
| 25  | `/admin/doctors/verify`                       | Doctor Verification           | Admin          |
| 26  | `/admin/transactions`                         | Transaction Overview          | Admin          |

---

## 2. Public Pages

### 2.1 Landing Page (`/`)

**Purpose:** First impression — convert visitors into registered users.

**Sections:**

1. **Hero Section** — Bold headline ("AI-Powered Healthcare at Your Fingertips"), subtitle, two CTA buttons: "Start Free Consultation" and "View Doctors"
2. **Trust Bar** — Logos or metrics (e.g., "10K+ Consultations", "500+ Doctors", "24/7 Available")
3. **Features Grid** — 3 cards: AI Symptom Analysis, Smart Scheduling, Telemedicine Consultations
4. **How It Works** — 4-step flow: Register → Search Doctor → Book & Pay → Video Consultation
5. **Specialties** — Grid of medical specialties with icons (General Medicine, Cardiology, Neurology, Pediatrics, Dermatology, etc.)
6. **Testimonials** — Patient review cards with star ratings
7. **CTA Banner** — "Ready to Transform Your Healthcare Experience?" with signup button
8. **Footer** — Logo, navigation links, social media, copyright

**Key Interactions:**

- Smooth scroll to sections via navbar links
- Animated counters on trust bar (count-up on scroll into view)
- Hover effects on feature and specialty cards
- Mobile hamburger menu

---

### 2.2 Login Page (`/auth/login`)

**Purpose:** Authenticate existing users with email + password.

**Layout:** Split-screen — left side has a medical-themed illustration/gradient, right side has the form.

**Form Fields:**

- Email (input with validation)
- Password (input with show/hide toggle)
- "Remember me" checkbox
- "Forgot password?" link

**Actions:**

- "Sign In" button → calls `POST /api/auth/login` → receives JWT → stores in httpOnly cookie or localStorage → redirects by role:
  - `patient` → `/dashboard`
  - `doctor` → `/doctor/dashboard`
  - `admin` → `/admin/dashboard`
- "Sign up" link → navigates to `/auth/register`
- Social login buttons (Google, optional)

**States:** Default, loading (spinner on button), error (shake animation + red message), success (redirect)

---

### 2.3 Register Page (`/auth/register`)

**Purpose:** Create a new patient account.

**Layout:** Same split-screen as login.

**Form Fields:**

- Full name
- Email
- Phone number
- Password (strength indicator)
- Confirm password
- Role selector (Patient default, with "Register as Doctor" link)
- Terms & conditions checkbox

**Actions:**

- "Create Account" → `POST /api/auth/register` → auto-login → redirect to `/dashboard`
- "Are you a doctor? Register here" → navigates to `/auth/register/doctor`

---

### 2.4 Doctor Registration (`/auth/register/doctor`)

**Purpose:** Multi-step form for doctor onboarding.

**Multi-Step Flow (stepper UI):**

| Step                 | Fields                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| 1. Personal Info     | Full name, email, phone, password                                                                   |
| 2. Professional Info | Medical license number, specialization (dropdown), years of experience, hospital/clinic affiliation |
| 3. Qualifications    | Education details, certifications (file upload), profile photo upload                               |
| 4. Review & Submit   | Summary of all entered data, "Submit for Verification" button                                       |

**Note:** Doctors register with `role: 'doctor'` but are not verified until an admin approves via `/admin/doctors/verify`. Show a "Pending Verification" status post-registration.

---

### 2.5 Forgot Password (`/auth/forgot-password`)

**Purpose:** Password recovery via email.

**Flow:** Enter email → server sends reset link → confirmation message displayed.

---

## 3. Patient Pages

### 3.1 Patient Dashboard (`/dashboard`)

**Purpose:** Central hub showing the patient's health overview at a glance.

**Layout:** Sidebar navigation (left) + main content area

**Sections:**

1. **Welcome Banner** — "Good Morning, {name}" with avatar, today's date
2. **Quick Actions Row** — 4 action cards:
   - 🔍 Find a Doctor
   - 📅 Book Appointment
   - 🤖 AI Symptom Check
   - 📋 View Records
3. **Upcoming Appointments** — Card list (max 3) showing:
   - Doctor name, specialty, photo
   - Date & time
   - Status badge (Confirmed / Pending / In Progress)
   - "Join Call" button (if within 15 min of appointment)
   - "View Details" link
4. **Recent Prescriptions** — Table/card showing last 3 prescriptions with doctor name, date, medication count, "View" link
5. **Health Stats** — Simple cards or mini-charts:
   - Total appointments this month
   - Upcoming appointments count
   - Last consultation date
6. **Recent Notifications** — Latest 5 notifications with type icon, message, timestamp

**API Calls:**

- `GET /api/auth/profile` — User info
- `GET /api/appointments/my` — Upcoming appointments
- `GET /api/prescriptions/patient/:id` — Recent prescriptions
- `GET /api/notifications/user/:id` — Notifications

---

### 3.2 Doctor Search & Listing (`/doctors`)

**Purpose:** Browse and search available doctors.

**Layout:** Filter sidebar (left) + doctor cards grid (right)

**Filters (Sidebar):**

- Search bar (name or keyword)
- Specialty dropdown (multi-select)
- Availability (Today, This Week, Next Week)
- Gender preference
- Sort by: Rating, Experience, Name

**Doctor Card:**

- Profile photo (circular)
- Name, specialization
- Years of experience
- Rating (stars)
- Next available slot
- Consultation fee
- "Book Appointment" button
- "View Profile" link

**Features:**

- Infinite scroll or pagination
- Skeleton loading cards while fetching
- Empty state: "No doctors found" with illustration
- Responsive: 3 columns (desktop) → 2 (tablet) → 1 (mobile)

**API:** `GET /api/appointments/doctors/search?specialty=X&name=Y`

---

### 3.3 Doctor Profile (`/doctors/[id]`)

**Purpose:** Detailed view of a specific doctor before booking.

**Sections:**

1. **Profile Header** — Large photo, name, specialization, rating, verification badge
2. **About** — Bio text, hospital/clinic, languages spoken
3. **Qualifications** — Education, certifications list
4. **Available Slots** — Calendar component (week view) showing open time slots. Click a slot → navigates to booking page
5. **Reviews** — Patient reviews with star ratings (from other patients)
6. **Consultation Fee** — Prominent display of fee amount

**Actions:**

- "Book Appointment" (prominent CTA) → `/appointments/book/[doctorId]`
- "Back to Doctors" → `/doctors`

---

### 3.4 Appointment Booking (`/appointments/book/[doctorId]`)

**Purpose:** Select date, time, and reason to book with a specific doctor.

**Multi-Step Flow:**

| Step                    | Content                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| 1. Select Date          | Calendar date picker (only future dates, disabled past dates)                                          |
| 2. Select Time Slot     | Grid of available time slots for selected date (fetched via `GET /api/appointments/doctors/:id/slots`) |
| 3. Consultation Details | Reason for visit (textarea), symptoms (tags input), upload previous reports (optional)                 |
| 4. Review & Confirm     | Summary: Doctor info, date/time, reason, consultation fee. "Proceed to Payment" button                 |

**After Confirm:** Redirect to `/payments/checkout/[appointmentId]`

**API:** `POST /api/appointments` → creates appointment with status `pending_payment`

---

### 3.5 My Appointments (`/appointments`)

**Purpose:** View all appointments (upcoming, past, cancelled).

**Layout:** Tab bar (Upcoming | Past | Cancelled) + appointment card list

**Appointment Card:**

- Doctor photo, name, specialty
- Date & time
- Status badge:
  - 🟡 Pending (waiting for doctor to accept)
  - 🟢 Confirmed
  - 🔵 In Progress (during video call)
  - ✅ Completed
  - 🔴 Cancelled
  - 🟠 Pending Payment
- Action buttons based on status:
  - Pending: Cancel
  - Confirmed: "Join Call" (enabled 15 min before), Cancel, Reschedule
  - Completed: "View Prescription", "Leave Review"
  - Cancelled: "Rebook"

**API:** `GET /api/appointments/my`

---

### 3.6 Appointment Detail (`/appointments/[id]`)

**Purpose:** Full detail view of a single appointment.

**Sections:**

- Appointment info (date, time, status, booking reference)
- Doctor info card
- Consultation notes (if completed)
- Prescription (if issued, link to view)
- Payment info (status, amount, transaction ID)
- Action buttons (Join Call / Cancel / Reschedule)

---

### 3.7 Video Consultation Room (`/consultations/[id]`)

**Purpose:** Live video call between patient and doctor via Jitsi Meet.

**Layout:** Full-screen video with overlay controls.

**Components:**

1. **Jitsi Meet iframe** — Takes up most of the screen, loaded via Jitsi Meet External API
2. **Sidebar Panel (collapsible):**
   - Patient info (for doctors) / Doctor info (for patients)
   - Appointment details
   - Chat messages
   - Prescription button (Doctor only) → Opens prescription form modal
3. **Controls Bar (bottom):**
   - Mute/Unmute microphone
   - Camera on/off
   - Share screen
   - End call button
   - Toggle sidebar

**Flow:**

- Page loads → fetches session via `GET /api/sessions/:appointmentId`
- If no session exists → Doctor creates one via `POST /api/sessions`
- Jitsi room link is used to initialize the iframe
- On "End Call" → `PATCH /api/sessions/:id/end` → update appointment status

---

### 3.8 Medical Records (`/records`)

**Purpose:** Upload, view, and manage medical documents.

**Layout:** Upload area at top + document list below

**Upload Section:**

- Drag-and-drop zone + file browse button
- Accepted formats: PDF, JPG, PNG, DICOM
- File metadata form: Report type (dropdown: Blood Test, X-Ray, MRI, Prescription, Other), date, notes
- Upload progress indicator

**Records List:**

- Card grid with:
  - File type icon
  - Report name
  - Date uploaded
  - Report type badge
  - Preview/Download/Delete actions
- Filter by report type
- Sort by date

**API:**

- `POST /api/records/upload` (multipart form data → Cloudinary)
- `GET /api/records/patient/:id`
- `GET /api/records/:id/download`
- `DELETE /api/records/:id`

---

### 3.9 My Prescriptions (`/prescriptions`)

**Purpose:** View all prescriptions issued by doctors.

**Layout:** List of prescription cards.

**Prescription Card:**

- Doctor name & specialty
- Issue date
- Diagnosis summary
- Medication list (name, dosage, frequency, duration)
- "View Full Prescription" → opens detailed view/modal
- "Download as PDF" button

**API:** `GET /api/prescriptions/patient/:id`

---

### 3.10 AI Symptom Checker (`/symptom-checker`)

**Purpose:** AI-powered preliminary health assessment.

**Layout:** Chat-style interface.

**Flow:**

1. **Input Phase:**
   - Text input: "Describe your symptoms..."
   - Optional quick-select symptom tags (Headache, Fever, Cough, Fatigue, etc.)
   - "Check Symptoms" button
2. **AI Response:**
   - Loading state with animated indicator ("Analyzing your symptoms...")
   - Result card showing:
     - Possible conditions (ranked by likelihood)
     - Severity indicator (Low / Medium / High)
     - Recommended specialty to consult
     - "Book Appointment with {Specialty} Doctor" CTA button
   - Disclaimer: "This is not a medical diagnosis. Please consult a doctor."
3. **History Tab:**
   - Past symptom check results with dates

**API:**

- `POST /api/ai/check-symptoms` → sends `{ symptoms: string }`
- `GET /api/ai/history`

---

### 3.11 Payment Checkout (`/payments/checkout/[appointmentId]`)

**Purpose:** Secure payment for consultation fee.

**Layout:** Two-column: Order summary (right) + Payment form (left)

**Order Summary:**

- Doctor name, specialty
- Appointment date/time
- Consultation fee
- Platform fee (if any)
- Total amount

**Payment Form:**

- Stripe Elements (card number, expiry, CVC)
- Or PayHere redirect button
- Promo code input (optional)
- "Pay Now" button

**Flow:**

- `POST /api/payments/initiate` → gets payment session/link
- On success → callback to `POST /api/payments/callback`
- Redirect to success page → then to `/appointments`

**States:** Default, processing (loading overlay), success (checkmark animation), failed (error message + retry)

---

### 3.12 Notification Center (`/notifications`)

**Purpose:** View all notifications.

**Layout:** Notification list with type grouping.

**Notification Types & Icons:**

- 📅 Appointment booked/confirmed/cancelled
- 💳 Payment confirmed/failed
- 📹 Video session starting
- 💊 Prescription issued
- ✅ Doctor verified (for doctors)

**Features:**

- Mark as read / Mark all as read
- Filter by type
- Click notification → navigate to relevant page
- Real-time badge count in navbar

**API:** `GET /api/notifications/user/:id`

---

### 3.13 Profile & Settings (`/settings`)

**Purpose:** Manage account information and preferences.

**Tabs:**

1. **Profile** — Edit name, email, phone, date of birth, profile photo
2. **Security** — Change password, two-factor authentication toggle
3. **Notifications** — Email/SMS notification preferences (toggles)
4. **Medical Info** (Patient only) — Blood type, allergies, chronic conditions

---

## 4. Doctor Pages

### 4.1 Doctor Dashboard (`/doctor/dashboard`)

**Purpose:** Overview of the doctor's practice.

**Sections:**

1. **Welcome Banner** — "Good Morning, Dr. {name}" with avatar
2. **Stats Cards (4):**
   - Today's Appointments (count)
   - Pending Requests (need accept/reject)
   - Completed Consultations (this month)
   - Total Earnings (this month)
3. **Today's Schedule** — Timeline/agenda view of today's appointments with:
   - Patient name, reason, time
   - Status badge
   - "Join Call" / "Accept" / "Reject" actions
4. **Pending Appointment Requests** — Cards requiring action (Accept/Reject)
5. **Recent Patients** — List of recently consulted patients with quick access to records
6. **Earnings Chart** — Bar or line chart of weekly/monthly earnings

---

### 4.2 Doctor Appointment Management (`/doctor/appointments`)

**Purpose:** Full view of all appointments for the doctor.

**Layout:** Tab bar (Today | Upcoming | Pending | Past) + appointment list

**Appointment Card (Doctor View):**

- Patient photo, name, age
- Appointment date/time
- Reason for visit
- Status badge
- Actions:
  - Pending: Accept ✅ / Reject ❌ buttons
  - Confirmed: "Start Consultation" (creates video session)
  - Completed: "View Record", "Issue Prescription"

**API:**

- `GET /api/appointments/my` (filtered by doctor's JWT)
- `PATCH /api/appointments/:id/accept` (with `status: 'confirmed' | 'rejected'`)

---

### 4.3 Availability Schedule (`/doctor/availability`)

**Purpose:** Manage available time slots for patient bookings.

**Layout:** Weekly calendar grid.

**Features:**

- Toggle slots on/off by clicking calendar cells
- Set recurring weekly schedule (e.g., Mon-Fri 9am-5pm)
- Set specific date overrides (holiday, leave)
- Slot duration setting (15min / 30min / 60min)
- Max patients per slot
- Save schedule button

**Visual:**

- Green = Available
- Gray = Unavailable
- Blue = Booked (can't modify)

---

### 4.4 Issue Prescription (`/doctor/prescriptions/issue/[appointmentId]`)

**Purpose:** Create a digital prescription after/during consultation.

**Form Fields:**

- Patient info (auto-filled from appointment)
- Diagnosis (text input)
- Medications list (dynamic — add/remove rows):
  - Medication name
  - Dosage
  - Frequency (dropdown: Once daily, Twice daily, etc.)
  - Duration (e.g., 7 days, 14 days)
  - Instructions (text)
- Additional notes (textarea)
- Follow-up recommendation (date picker, optional)

**Actions:**

- "Issue Prescription" → `POST /api/prescriptions` → publishes `prescription.issued` event
- Preview before issuing (modal with formatted prescription)

---

## 5. Admin Pages

### 5.1 Admin Dashboard (`/admin/dashboard`)

**Purpose:** Platform-wide analytics and oversight.

**Sections:**

1. **Stats Cards (6):**
   - Total Users (Patients + Doctors)
   - Active Doctors
   - Pending Doctor Verifications
   - Total Appointments (this month)
   - Revenue (this month)
   - Active Video Sessions
2. **User Growth Chart** — Line chart (patients vs doctors over time)
3. **Revenue Chart** — Bar chart (daily/weekly/monthly)
4. **Recent Activities** — Log of recent platform events (registrations, appointments, payments)
5. **Quick Actions:**
   - "Verify Doctors" → `/admin/doctors/verify`
   - "Manage Users" → `/admin/users`
   - "View Transactions" → `/admin/transactions`

---

### 5.2 User Management (`/admin/users`)

**Purpose:** View, search, and manage all platform users.

**Layout:** Search bar + filters + data table

**Table Columns:**

- Avatar + Name
- Email
- Role (Patient / Doctor / Admin badge)
- Joined date
- Status (Active / Suspended / Pending)
- Actions (View Profile, Suspend, Delete)

**Features:**

- Search by name or email
- Filter by role
- Pagination
- Bulk actions (Suspend selected, Export CSV)

---

### 5.3 Doctor Verification (`/admin/doctors/verify`)

**Purpose:** Review and approve/reject doctor registrations.

**Layout:** Pending verifications list

**Verification Card:**

- Doctor photo, name
- Submitted license number
- Specialization
- Uploaded certificates (clickable to view/download)
- Hospital/clinic affiliation
- Registration date
- Actions: "Approve" ✅ / "Reject" ❌ buttons with confirmation modal

**API:** `PATCH /api/auth/doctors/:id/verify`

---

### 5.4 Transaction Overview (`/admin/transactions`)

**Purpose:** Financial oversight of all platform payments.

**Layout:** Summary cards + transaction table

**Summary Cards:**

- Total Revenue
- Pending Payouts
- Refunds Issued
- Average Transaction Value

**Table Columns:**

- Transaction ID
- Patient name
- Doctor name
- Amount
- Status (Completed / Pending / Refunded / Failed)
- Date
- Actions (View Details, Issue Refund)

**API:** `GET /api/payments/history`

---

## 6. Shared Components

### 6.1 Sidebar Navigation

**Varies by role:**

| Patient            | Doctor          | Admin               |
| ------------------ | --------------- | ------------------- |
| Dashboard          | Dashboard       | Dashboard           |
| Find Doctors       | My Appointments | User Management     |
| My Appointments    | Availability    | Doctor Verification |
| Medical Records    | Prescriptions   | Transactions        |
| Prescriptions      | –               | –                   |
| AI Symptom Checker | –               | –                   |
| Notifications      | Notifications   | –                   |
| Settings           | Settings        | Settings            |

### 6.2 Top Navbar

- Healio logo (links to dashboard)
- Search bar (global search — doctors, appointments)
- Notification bell with badge count
- User avatar dropdown: Profile, Settings, Logout

### 6.3 Reusable Components

| Component    | Usage                                               |
| ------------ | --------------------------------------------------- |
| `Button`     | Primary, secondary, danger, ghost, loading variants |
| `Input`      | Text, email, password (with toggle), phone, search  |
| `Card`       | Base card with header, body, footer slots           |
| `Badge`      | Status indicators (color-coded)                     |
| `Modal`      | Confirmation, form, preview modals                  |
| `Table`      | Sortable, paginated data tables                     |
| `Calendar`   | Date picker and availability calendar               |
| `Avatar`     | User/doctor profile images with fallback initials   |
| `Tabs`       | Tab navigation component                            |
| `Stepper`    | Multi-step form progress indicator                  |
| `Toast`      | Success, error, info notification toasts            |
| `Skeleton`   | Loading placeholder components                      |
| `EmptyState` | Illustration + message for empty lists              |
| `FileUpload` | Drag-and-drop file upload zone                      |
| `SearchBar`  | Input with search icon and debounced search         |
| `StatCard`   | Metric card with icon, value, label, trend          |
| `Chart`      | Line, bar, and pie charts for dashboards            |

---

## 7. User Flows

### Flow 1: Patient Books Appointment

```
Landing → Register → Dashboard → Find Doctors → Doctor Profile
→ Select Date/Time → Enter Details → Review → Payment Checkout
→ Confirmation → My Appointments
```

### Flow 2: Doctor Conducts Consultation

```
Doctor Dashboard → Accept Appointment Request → Start Consultation
→ Video Room → Issue Prescription → End Call → Dashboard
```

### Flow 3: Admin Verifies Doctor

```
Admin Dashboard → Doctor Verification → Review Credentials
→ Approve/Reject → Doctor notified via Notification Service
```

### Flow 4: AI Symptom Check → Booking

```
Dashboard → AI Symptom Checker → Enter Symptoms → View AI Results
→ Click "Book {Specialty} Doctor" → Doctor Listing (filtered) → Booking Flow
```
