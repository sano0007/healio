# Healio — Architecture Findings & Implementation Reference

> **Generated:** 2026-04-13 | **Last Updated:** 2026-04-13 (Session 2)
> **Course:** SE3020 – Distributed Systems | Assignment 1
> **Status:** Implementation complete — frontend & infra in progress

---

## 1. Assignment Overview

| Field      | Detail                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------- |
| Title      | Building an AI-Enabled Smart Healthcare Appointment & Telemedicine Platform using Microservices |
| Weight     | 25% of final grade                                                                              |
| Group Size | 3–4 members                                                                                     |
| Duration   | 5 weeks                                                                                         |
| Deadline   | Week 11 of semester                                                                             |

### Required Services

| Service                            | Required?            | Status            |
| ---------------------------------- | -------------------- | ----------------- |
| Patient Management Service         | Mandatory            | ✅ Running        |
| Doctor Management Service          | Mandatory            | ✅ Running        |
| Appointment Service                | Mandatory            | ✅ Running        |
| Telemedicine Service (Video)       | Mandatory            | ✅ Running        |
| Payment Service                    | Mandatory            | ✅ Running        |
| Notification Service (SMS + Email) | Mandatory            | ✅ Running        |
| AI Symptom Checker                 | Optional Enhancement | ⬜ Not scaffolded |

### Tech Constraints

- **Architecture:** Microservices (not monolith)
- **Containerisation:** Docker (mandatory)
- **Orchestration:** Kubernetes (mandatory)
- **Frontend:** Any async JS framework (Next.js 15)
- **Auth:** JWT with three roles — Patient, Doctor, Admin
- **Video:** Jitsi Meet (no API key needed)
- **Payment:** Stripe sandbox
- **Notifications:** Twilio (SMS) + nodemailer SMTP (email)

---

## 2. Current Directory Structure

```
healio/
├── apps/
│   ├── web/                        # Next.js 15 frontend
│   ├── api-gateway/                # HTTP :3001 — JWT edge, routes to all services
│   ├── auth-service/               # TCP :9001 — register, login, JWT
│   ├── patient-service/            # TCP :9002 — patient profiles, medical reports
│   ├── doctor-service/             # TCP :9003 — doctor profiles, availability, prescriptions
│   ├── appointment-service/        # TCP :9004 — booking, status, availability validation
│   ├── telemedicine-service/       # TCP :9005 — Jitsi session management
│   ├── payment-service/            # TCP :9006 — Stripe payment intents
│   └── notification-service/       # TCP :9007 — Twilio SMS + nodemailer email
├── packages/
│   ├── shared-types/               # Enums, interfaces, DTOs, MSG constants
│   └── shared-utils/               # Common response helpers
├── infra/
│   ├── docker/                     # Multi-stage Dockerfiles per service
│   ├── k8s/                        # Kubernetes manifests
│   └── docker-compose.yml
├── docs/
│   ├── DS SE3020 Assignment 1 2026.pdf
│   ├── ARCHITECTURE_FINDINGS.md
│   └── healio.postman_collection.json
├── .env                            # Root env (all service secrets consolidated)
├── .env.example
├── members.txt
├── readme.txt
└── submission.txt
```

---

## 3. Architecture

### 3.1 Communication Flow

```
Browser / Postman
      │
      │ HTTP REST
      ▼
  API Gateway (:3001/api)      ← JWT validation at edge, role guards
      │
      │ NestJS TCP transport
      ├──► auth-service        (:9001)
      ├──► patient-service     (:9002)
      ├──► doctor-service      (:9003)
      ├──► appointment-service (:9004)
      ├──► telemedicine-service(:9005)
      ├──► payment-service     (:9006)
      └──► notification-service(:9007)
                  │
                  └── MongoDB Atlas (per-service database)
```

### 3.2 Service Map

| Service                | Port        | Database             | Key Responsibilities                                                |
| ---------------------- | ----------- | -------------------- | ------------------------------------------------------------------- |
| `api-gateway`          | 3001 (HTTP) | —                    | Route requests, validate JWT, file uploads to Cloudinary            |
| `auth-service`         | 9001 (TCP)  | `helio-auth`         | Register/login, bcrypt, JWT issuance                                |
| `patient-service`      | 9002 (TCP)  | `helio-patients`     | Patient profiles, medical reports (Cloudinary URLs)                 |
| `doctor-service`       | 9003 (TCP)  | `helio-doctors`      | Doctor profiles, availability schedule, prescriptions, verification |
| `appointment-service`  | 9004 (TCP)  | `helio-appointments` | Booking with availability validation, status lifecycle              |
| `telemedicine-service` | 9005 (TCP)  | —                    | Jitsi session creation/join/end                                     |
| `payment-service`      | 9006 (TCP)  | `helio-payments`     | Stripe payment intents, confirmation                                |
| `notification-service` | 9007 (TCP)  | —                    | Twilio SMS + SMTP email per notification type                       |

### 3.3 Authentication & Roles

JWT is validated at the API gateway edge using `JwtAuthGuard` + Passport strategy. Role enforcement uses `RolesGuard` + `@Roles()` decorator.

| Role      | Value              | Access                                                                                                                 |
| --------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `patient` | `UserRole.PATIENT` | Own profile, book appointments, join sessions, initiate payments                                                       |
| `doctor`  | `UserRole.DOCTOR`  | Own profile, set availability, manage appointment status, create sessions, issue prescriptions, upload patient reports |
| `admin`   | `UserRole.ADMIN`   | All of the above + list all users, verify/revoke doctors, view system stats                                            |

**Key rule:** `isVerified` on doctor profiles can **only** be set by an admin via `PATCH /admin/doctors/:id/verify`. Doctors cannot set it on themselves — it is silently stripped from `PATCH /doctors/me` updates.

---

## 4. Message Pattern Registry

All patterns defined as constants in `packages/shared-types/src/index.ts` under the `MSG` object.

| Pattern                      | Service              | Direction             | Payload                                                        |
| ---------------------------- | -------------------- | --------------------- | -------------------------------------------------------------- |
| `auth.register`              | auth-service         | gateway → auth        | `{ name, email, password, role }`                              |
| `auth.login`                 | auth-service         | gateway → auth        | `{ email, password }`                                          |
| `auth.validate`              | auth-service         | gateway → auth        | `{ token }`                                                    |
| `patient.create`             | patient-service      | gateway → patient     | `{ userId, name, email }`                                      |
| `patient.get`                | patient-service      | gateway → patient     | `{ userId }`                                                   |
| `patient.get_all`            | patient-service      | gateway → patient     | `{}`                                                           |
| `patient.update`             | patient-service      | gateway → patient     | `{ userId, updates }`                                          |
| `patient.upload_report`      | patient-service      | gateway → patient     | `{ userId, report: { filename, originalName, url } }`          |
| `patient.get_history`        | patient-service      | gateway → patient     | `{ userId }`                                                   |
| `doctor.create`              | doctor-service       | gateway → doctor      | `{ userId, name, email }`                                      |
| `doctor.get`                 | doctor-service       | gateway → doctor      | `{ userId }`                                                   |
| `doctor.get_all`             | doctor-service       | gateway → doctor      | `{}` — returns verified only                                   |
| `doctor.get_all_admin`       | doctor-service       | gateway → doctor      | `{}` — returns all                                             |
| `doctor.update`              | doctor-service       | gateway → doctor      | `{ userId, updates }` — strips `isVerified`                    |
| `doctor.verify`              | doctor-service       | gateway → doctor      | `{ userId, isVerified }` — admin only                          |
| `doctor.set_availability`    | doctor-service       | gateway → doctor      | `{ userId, availability[] }`                                   |
| `doctor.issue_prescription`  | doctor-service       | gateway → doctor      | `{ doctorId, patientId, appointmentId, medications[], notes }` |
| `doctor.get_prescriptions`   | doctor-service       | gateway → doctor      | `{ doctorId }`                                                 |
| `appointment.get_all`        | appointment-service  | gateway → appointment | `{}`                                                           |
| `appointment.book`           | appointment-service  | gateway → appointment | `{ patientId, doctorId, scheduledAt, notes? }`                 |
| `appointment.cancel`         | appointment-service  | gateway → appointment | `{ appointmentId, reason? }`                                   |
| `appointment.update_status`  | appointment-service  | gateway → appointment | `{ appointmentId, status }`                                    |
| `appointment.get`            | appointment-service  | gateway → appointment | `{ appointmentId }`                                            |
| `appointment.get_by_patient` | appointment-service  | gateway → appointment | `{ patientId }`                                                |
| `appointment.get_by_doctor`  | appointment-service  | gateway → appointment | `{ doctorId }`                                                 |
| `tele.create_session`        | telemedicine-service | gateway → tele        | `{ appointmentId }`                                            |
| `tele.join_session`          | telemedicine-service | gateway → tele        | `{ sessionId }`                                                |
| `tele.end_session`           | telemedicine-service | gateway → tele        | `{ sessionId }`                                                |
| `payment.initiate`           | payment-service      | gateway → payment     | `{ appointmentId, patientId, amount, currency }`               |
| `payment.confirm`            | payment-service      | gateway → payment     | `{ stripePaymentIntentId }`                                    |
| `payment.get`                | payment-service      | gateway → payment     | `{ paymentId }`                                                |
| `payment.get_all`            | payment-service      | gateway → payment     | `{}`                                                           |
| `notify.send`                | notification-service | gateway → notify      | `{ type, recipientEmail, recipientPhone?, payload }`           |

---

## 5. API Route Reference

All routes served by `api-gateway` at `http://localhost:3001/api`.

### Auth

| Method | Path             | Auth | Description                                                              |
| ------ | ---------------- | ---- | ------------------------------------------------------------------------ |
| POST   | `/auth/register` | —    | Register patient, doctor, or admin. Creates profile in relevant service. |
| POST   | `/auth/login`    | —    | Returns `{ access_token, user }`                                         |

### Patients

| Method | Path                    | Auth    | Description                                                                        |
| ------ | ----------------------- | ------- | ---------------------------------------------------------------------------------- |
| GET    | `/patients/me`          | patient | Own profile                                                                        |
| PATCH  | `/patients/me`          | patient | Update profile (phone, bloodGroup, address)                                        |
| POST   | `/patients/:id/reports` | doctor  | Upload medical report (multipart/form-data, field: `file`, max 10 MB) → Cloudinary |

### Doctors

| Method | Path                     | Auth   | Description                                                               |
| ------ | ------------------------ | ------ | ------------------------------------------------------------------------- |
| GET    | `/doctors`               | any    | All **verified** doctors                                                  |
| GET    | `/doctors/:id`           | any    | Doctor by userId                                                          |
| PATCH  | `/doctors/me`            | doctor | Update own profile (`isVerified` is ignored)                              |
| POST   | `/doctors/availability`  | doctor | Set availability slots. Accepts `{ day: "Monday" }` or `{ dayOfWeek: 1 }` |
| POST   | `/doctors/prescriptions` | doctor | Issue prescription to patient                                             |

### Appointments

| Method | Path                       | Auth           | Description                                                              |
| ------ | -------------------------- | -------------- | ------------------------------------------------------------------------ |
| POST   | `/appointments`            | patient        | Book appointment — validates doctor availability + checks slot conflicts |
| GET    | `/appointments/my`         | patient/doctor | Own appointments (role-aware)                                            |
| PATCH  | `/appointments/:id/cancel` | patient        | Cancel with optional reason                                              |
| PATCH  | `/appointments/:id/status` | doctor         | Update status: `pending → confirmed → completed`                         |

### Payments

| Method | Path                 | Auth    | Description                                                        |
| ------ | -------------------- | ------- | ------------------------------------------------------------------ |
| POST   | `/payments/initiate` | patient | Create Stripe PaymentIntent, returns `{ paymentId, clientSecret }` |
| GET    | `/payments/:id`      | patient | Get payment by ID                                                  |

### Telemedicine

| Method | Path             | Auth    | Description                             |
| ------ | ---------------- | ------- | --------------------------------------- |
| POST   | `/sessions`      | doctor  | Create Jitsi session for an appointment |
| POST   | `/sessions/join` | patient | Join session by sessionId               |

### Admin _(admin role required)_

| Method | Path                        | Description                                                           |
| ------ | --------------------------- | --------------------------------------------------------------------- |
| GET    | `/admin/stats`              | Aggregated counts: patients, doctors, appointments by status, revenue |
| GET    | `/admin/patients`           | All patients                                                          |
| GET    | `/admin/doctors`            | All doctors including unverified                                      |
| GET    | `/admin/appointments`       | All appointments                                                      |
| GET    | `/admin/payments`           | All payments                                                          |
| PATCH  | `/admin/doctors/:id/verify` | Set `{ isVerified: true/false }`                                      |

---

## 6. Key Business Logic

### 6.1 Registration Flow

1. `POST /auth/register` → auth-service creates user + issues JWT
2. Gateway fans out: `patient.create` or `doctor.create` → creates profile in respective service
3. Returns `{ access_token, user }` — client is immediately logged in

### 6.2 Appointment Booking with Availability Validation

Validation is done in the **gateway** before forwarding to appointment-service:

1. Fetch doctor profile from doctor-service
2. If doctor has availability set, check requested `scheduledAt` falls within a `dayOfWeek + startTime/endTime` window
3. Fetch existing doctor appointments and check for 30-minute slot conflicts
4. If invalid → `400 Bad Request` with descriptive message
5. If valid → forward `appointment.book` to appointment-service

### 6.3 Doctor Availability Format

```json
{
  "availability": [
    { "day": "Monday", "startTime": "09:00", "endTime": "17:00" },
    { "day": "Wednesday", "startTime": "09:00", "endTime": "13:00" }
  ]
}
```

Gateway normalises `day` string → `dayOfWeek` number (0=Sunday … 6=Saturday) before storing. The stored schema is `{ dayOfWeek: number, startTime: string, endTime: string }` with no `_id` on subdocuments.

### 6.4 Medical Report Upload (Cloudinary)

1. Doctor calls `POST /patients/:patientId/reports` with `multipart/form-data`
2. Gateway streams file buffer to Cloudinary under `healio/medical-reports/`
3. Cloudinary returns `secure_url`
4. Gateway sends `patient.upload_report` to patient-service
5. Patient-service `$push`es `{ filename, originalName, url, uploadedAt }` to `medicalReports[]`

### 6.5 Doctor Verification

- Doctors register with `isVerified: false` by default
- `GET /doctors` returns only verified doctors (for patient booking)
- `GET /admin/doctors` returns all doctors including unverified
- Only admin can call `PATCH /admin/doctors/:id/verify`
- `PATCH /doctors/me` silently strips `isVerified` — doctors cannot self-verify

---

## 7. Environment Variables

All variables consolidated in root `.env`. Services load it via `ConfigModule.forRoot({ envFilePath: ['../../.env', '.env'] })`.

| Variable                                     | Used By                                                   |
| -------------------------------------------- | --------------------------------------------------------- |
| `JWT_SECRET`                                 | auth-service, api-gateway                                 |
| `MONGO_*_URI`                                | per-service (AUTH, PATIENT, DOCTOR, APPOINTMENT, PAYMENT) |
| `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`   | api-gateway                                               |
| `STRIPE_SECRET_KEY`                          | payment-service                                           |
| `TWILIO_ACCOUNT_SID/AUTH_TOKEN/PHONE_NUMBER` | notification-service                                      |
| `SMTP_HOST/PORT/USER/PASS/FROM`              | notification-service                                      |
| `JITSI_BASE_URL`                             | telemedicine-service                                      |
| `*_SERVICE_PORT`                             | each service `main.ts`                                    |
| `*_SERVICE_HOST`                             | api-gateway `clients.module.ts`                           |
| `FRONTEND_URL`                               | api-gateway CORS                                          |
| `NEXT_PUBLIC_API_URL`                        | web app                                                   |

---

## 8. Task Breakdown

### Phase 1 — Foundation

| #   | Task                                                     | Status  |
| --- | -------------------------------------------------------- | ------- |
| 1   | Remove monolith, scaffold microservice directories       | ✅ Done |
| 2   | `packages/shared-types` with enums, DTOs, MSG constants  | ✅ Done |
| 3   | `packages/shared-utils` with response helpers            | ✅ Done |
| 4   | Root `package.json` + `turbo.json` with correct pipeline | ✅ Done |

### Phase 2 — Service Scaffolds

| #   | Service                | Status  | Notes                                                     |
| --- | ---------------------- | ------- | --------------------------------------------------------- |
| 5   | `api-gateway`          | ✅ Done | HTTP, JWT strategy, global ClientsProxyModule             |
| 6   | `auth-service`         | ✅ Done | AuthModule imported in AppModule (was missing, now fixed) |
| 7   | `patient-service`      | ✅ Done | createProfile handler added                               |
| 8   | `doctor-service`       | ✅ Done | createProfile handler + verify handler added              |
| 9   | `appointment-service`  | ✅ Done |                                                           |
| 10  | `telemedicine-service` | ✅ Done |                                                           |
| 11  | `payment-service`      | ✅ Done |                                                           |
| 12  | `notification-service` | ✅ Done |                                                           |

### Phase 3 — Business Logic

| #   | Task                                             | Status  | Notes                                                     |
| --- | ------------------------------------------------ | ------- | --------------------------------------------------------- |
| 13  | JWT issuance + validation                        | ✅ Done | bcrypt, `jwtService.sign/verify`                          |
| 14  | JWT Passport strategy + role guards              | ✅ Done | `JwtStrategy`, `JwtAuthGuard`, `RolesGuard`, `@Roles()`   |
| 15  | Patient profile CRUD + Cloudinary report upload  | ✅ Done | `$push` for reports; `createProfile` on register          |
| 16  | Doctor profile + availability schedule           | ✅ Done | day-name → dayOfWeek normalisation; `_id: false` on slots |
| 17  | Appointment booking with availability validation | ✅ Done | Gateway-level day/time + conflict check                   |
| 18  | Digital prescription issuance                    | ✅ Done | Doctor-only, stores in prescriptions collection           |
| 19  | Jitsi Meet session management                    | ✅ Done | In-memory session map + Jitsi URL from appointmentId      |
| 20  | Stripe sandbox payment                           | ✅ Done | `paymentIntents.create()`, stores clientSecret            |
| 21  | Twilio SMS notifications                         | ✅ Done | Per-NotificationType templates                            |
| 22  | nodemailer email notifications                   | ✅ Done | SMTP transport, HTML templates                            |
| 23  | Doctor verification (admin-only)                 | ✅ Done | Separated from doctor self-update; admin endpoint added   |
| 24  | Admin module (stats + management)                | ✅ Done | Aggregates from all services; list/verify endpoints       |
| 25  | AI symptom checker                               | ⬜ Todo | Optional — not scaffolded                                 |

### Phase 4 — Infrastructure

| #   | Task                                     | Status  | Notes                            |
| --- | ---------------------------------------- | ------- | -------------------------------- |
| 26  | Multi-stage `Dockerfile` per service     | ✅ Done | `infra/docker/`                  |
| 27  | `infra/docker-compose.yml`               | ✅ Done | Full local dev stack             |
| 28  | `infra/k8s/` — Deployments + Services    | ✅ Done | All 8 apps                       |
| 29  | `infra/k8s/` — MongoDB StatefulSet + PVC | ✅ Done |                                  |
| 30  | `infra/k8s/` — ConfigMaps + Secrets      | ✅ Done |                                  |
| 31  | `infra/k8s/` — Ingress for api-gateway   | ⬜ Todo | External routing not yet created |

### Phase 5 — Frontend

| #   | Task                                       | Status  | Notes                                                                    |
| --- | ------------------------------------------ | ------- | ------------------------------------------------------------------------ |
| 32  | `lib/api.ts` — full typed API client       | ✅ Done | All endpoints, admin methods, typed responses                            |
| 33  | `lib/auth.ts` — localStorage token helpers | ✅ Done |                                                                          |
| 34  | `AuthContext` + `AuthProvider`             | ✅ Done | React context wrapping app                                               |
| 35  | Landing page                               | ✅ Done | Feature highlights, patient/doctor CTAs                                  |
| 36  | Login page                                 | ✅ Done |                                                                          |
| 37  | Register page                              | ✅ Done | Role toggle (patient/doctor), pre-filled from query param                |
| 38  | Dashboard layout + `Nav`                   | ✅ Done | Role-aware navigation                                                    |
| 39  | Admin dashboard (overview + tables)        | ✅ Done | Stats, doctors list with verify toggle, patients, appointments, payments |
| 40  | Patient dashboard                          | ⬜ Todo | Appointments list, profile                                               |
| 41  | Doctor dashboard                           | ⬜ Todo | Availability setup, appointment queue, prescriptions                     |
| 42  | Appointment booking UI                     | ⬜ Todo | Browse doctors → pick slot → book                                        |
| 43  | Telemedicine session UI                    | ⬜ Todo | Jitsi iframe embed                                                       |
| 44  | Payment flow UI                            | ⬜ Todo | Stripe Elements form using `clientSecret`                                |

### Phase 6 — Submission Deliverables

| #   | Task             | Status  | Notes                                                                         |
| --- | ---------------- | ------- | ----------------------------------------------------------------------------- |
| 45  | `members.txt`    | ✅ Done |                                                                               |
| 46  | `readme.txt`     | ✅ Done |                                                                               |
| 47  | `submission.txt` | ⬜ Todo | Fill after recording demo video                                               |
| 48  | `report.pdf`     | ⬜ Todo | Architecture diagram, service interfaces, auth flow, individual contributions |

---

## 9. Technology Decisions

| Concern           | Choice            | Reason                                                                  |
| ----------------- | ----------------- | ----------------------------------------------------------------------- |
| Service transport | NestJS TCP        | Built-in, zero extra infra — no RabbitMQ/Kafka needed at this scale     |
| Video             | Jitsi Meet        | Free, no API key, embeds as iframe                                      |
| Payment           | Stripe sandbox    | Well-documented, globally accessible, free sandbox                      |
| SMS               | Twilio            | Industry standard, free trial                                           |
| Email             | nodemailer + SMTP | Works with any SMTP provider (Gmail, SendGrid)                          |
| File storage      | Cloudinary        | Free tier, SDK streams buffers directly, returns CDN URLs               |
| Database          | MongoDB Atlas M0  | Free tier, single cluster, 5 databases, per-service isolation           |
| Auth              | JWT HS256         | Stateless, works across microservices, no shared session store needed   |
| Package manager   | Bun               | Fast, native workspace support, compatible with Node ecosystem          |
| Monorepo          | Turborepo         | `dependsOn: ["^build"]` ensures shared packages compile before services |

---

## 10. Submission Checklist

- [ ] All services run via `bun run dev` (Turborepo)
- [ ] All services build via `docker compose up`
- [ ] All services deployable to Kubernetes via `kubectl apply -f infra/k8s/`
- [ ] JWT auth enforced with Patient / Doctor / Admin roles
- [ ] Registration creates profile in correct service (patient or doctor)
- [ ] Doctor availability validation works on appointment booking
- [ ] Doctor verification flow works (register → admin verifies → appears in GET /doctors)
- [ ] Medical report upload to Cloudinary works
- [ ] Appointment flow works end-to-end (book → confirm → session → payment)
- [ ] Admin dashboard shows live stats from all services
- [ ] `submission.txt` has GitHub URL + YouTube demo link
- [ ] `readme.txt` has complete deployment steps
- [ ] `members.txt` has all group member details
- [ ] `report.pdf` includes architecture diagram, service interfaces, auth flow, individual contributions
- [ ] Turnitin similarity below 20%
- [ ] ZIP named `GroupID_DS-Assignment.zip`
