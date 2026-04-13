# Healio — Architecture Findings & Restructuring Plan

> **Generated:** 2026-04-13
> **Course:** SE3020 – Distributed Systems | Assignment 1
> **Status:** Pre-restructuring audit

---

## 1. Assignment Overview

| Field | Detail |
|---|---|
| Title | Building an AI-Enabled Smart Healthcare Appointment & Telemedicine Platform using Microservices |
| Weight | 25% of final grade |
| Group Size | 3–4 members |
| Duration | 5 weeks |
| Deadline | Week 11 of semester |

### Required Services (from spec)
| Service | Required? |
|---|---|
| Patient Management Service | Mandatory |
| Doctor Management Service | Mandatory |
| Appointment Service | Mandatory |
| Telemedicine Service (Video) | Mandatory |
| Payment Service | Mandatory |
| Notification Service (SMS + Email) | Mandatory |
| AI Symptom Checker | Optional Enhancement |

### Tech Constraints
- **Architecture:** Microservices (not monolith)
- **Containerisation:** Docker (mandatory)
- **Orchestration:** Kubernetes (mandatory)
- **Frontend:** Any async JS framework (Next.js/React qualifies)
- **Auth:** JWT with three roles — Patient, Doctor, Admin
- **Video:** Agora / Twilio / Jitsi Meet
- **Payment:** Stripe / PayPal (sandbox) or PayHere / Dialog Genie / FriMi
- **Notifications:** Third-party SMS + email services

---

## 2. Current Repository State

### Directory Tree (as audited)
```
healio/
├── apps/
│   ├── server/                  # ❌ Single NestJS monolith — NOT microservices
│   │   └── src/
│   │       ├── app.module.ts    # All modules imported here
│   │       ├── main.ts
│   │       ├── auth/
│   │       ├── users/
│   │       ├── appointments/
│   │       ├── doctors/
│   │       ├── prescriptions/
│   │       └── chatbot/
│   └── web/                     # Next.js 15 frontend (OK)
├── package.json                 # Bun workspaces — references packages/* (dir missing)
├── turbo.json                   # Turborepo pipeline (OK)
└── bun.lock
```

### What Exists
- Turborepo monorepo with Bun as package manager
- NestJS app with JWT auth, Mongoose, Socket.IO already added as deps
- Next.js 15 frontend with Tailwind CSS
- Module stubs for: auth, users, doctors, appointments, prescriptions, chatbot

---

## 3. Critical Issues Found

### 3.1 Architecture Violation (Blocking)
**Current:** All domain logic lives in a single NestJS app (`apps/server`). This is a **monolith**.

**Required:** Each domain must be an **independently deployable NestJS microservice** with its own process, port, and database connection. The assignment explicitly requires microservices + Docker + Kubernetes.

### 3.2 Missing Services (Blocking)
The following required services have zero implementation:

| Service | Status |
|---|---|
| Payment Service | Missing entirely |
| Notification Service | Missing entirely |
| Telemedicine Service | Missing entirely |
| API Gateway | Missing entirely |

### 3.3 No Docker or Kubernetes Configuration (Blocking)
No `Dockerfile`, `docker-compose.yml`, or `k8s/` manifests exist anywhere in the repo. Docker and Kubernetes are mandatory per the assignment spec.

### 3.4 No Shared Packages
`packages/*` is declared in the root workspace but the `packages/` directory does not exist. Shared TypeScript types, DTOs, and enums cannot be shared between services without this.

### 3.5 No Database Initialisation
No Mongoose schemas are defined, no seed scripts exist, and no docker-compose brings up a MongoDB instance for local development.

### 3.6 No Environment Configuration
No `.env`, `.env.example`, or environment variable documentation exists in any service directory.

### 3.7 Missing Submission Deliverables
The assignment requires `submission.txt`, `readme.txt`, and `members.txt` at repo root — none exist.

---

## 4. Required Target Architecture

### 4.1 Service Map

| Service | Port | Transport | Database | Key Responsibilities |
|---|---|---|---|---|
| `api-gateway` | 3001 | HTTP (external) | — | Route all client requests, validate JWT at edge |
| `auth-service` | 4001 | TCP | MongoDB (users) | Register, login, JWT issuance, role management |
| `patient-service` | 4002 | TCP | MongoDB (patients) | Patient profiles, medical reports, medical history |
| `doctor-service` | 4003 | TCP | MongoDB (doctors) | Doctor profiles, availability, prescriptions |
| `appointment-service` | 4004 | TCP | MongoDB (appointments) | Booking, cancellation, real-time status |
| `telemedicine-service` | 4005 | TCP | — | Video session tokens (Jitsi/Agora/Twilio) |
| `payment-service` | 4006 | TCP | MongoDB (payments) | Stripe/PayHere sandbox integration |
| `notification-service` | 4007 | TCP | — | SMS (Twilio) + Email (SendGrid) |
| `ai-symptom-service` | 4008 | TCP | — | Optional: AI symptom checker |

### 4.2 Target Directory Structure
```
healio/
├── apps/
│   ├── web/                        # Next.js frontend — API calls go to gateway only
│   ├── api-gateway/                # HTTP entry point, TCP client to all services
│   ├── auth-service/               # Patient/Doctor/Admin auth + JWT
│   ├── patient-service/            # Patient profile, reports, history
│   ├── doctor-service/             # Doctor profile, availability, prescriptions
│   ├── appointment-service/        # Booking, status, Socket.IO
│   ├── telemedicine-service/       # Video session management
│   ├── payment-service/            # Payment gateway integration
│   ├── notification-service/       # SMS + email dispatch
│   └── ai-symptom-service/         # (optional) AI symptom checker
├── packages/
│   ├── shared-types/               # Enums, interfaces, DTOs shared across services
│   └── shared-utils/               # Common helpers and response formatters
├── infra/
│   ├── docker/                     # One Dockerfile per service (multi-stage)
│   ├── k8s/                        # Kubernetes manifests (Deployments, Services, PVCs)
│   └── docker-compose.yml          # Full local dev stack inc. MongoDB + Redis
├── scripts/
│   └── seed.ts                     # Database seed data
├── docs/
│   ├── DS SE3020 Assignment 1 2026.pdf
│   └── ARCHITECTURE_FINDINGS.md    # This file
├── .env.example                    # Root env template
├── .gitignore
├── package.json
├── turbo.json
├── members.txt                     # Required deliverable
├── readme.txt                      # Required deliverable
└── submission.txt                  # Required deliverable
```

### 4.3 Inter-Service Communication Pattern
```
Frontend (Next.js :3000)
        │
        │ HTTP REST
        ▼
  API Gateway (:3001)          ← validates JWT, routes requests
        │
        │ TCP (NestJS Microservices transport)
        ├──► auth-service        (:4001)
        ├──► patient-service     (:4002)
        ├──► doctor-service      (:4003)
        ├──► appointment-service (:4004)
        ├──► telemedicine-service(:4005)
        ├──► payment-service     (:4006)
        └──► notification-service(:4007)
                    │
                    ├── MongoDB  (per-service collections)
                    └── Redis    (optional: pub/sub for events)
```

### 4.4 Transport Decision — TCP (NestJS built-in)

**Decision:** Use NestJS TCP transport for all inter-service communication.

**Rationale (vs. gRPC / Message Broker):**
- Assignment requires "RESTful web services" — graders evaluate REST interfaces, not the internal transport layer
- TCP is built into `@nestjs/microservices` with zero extra infrastructure
- gRPC adds proto files + code generation overhead that consumes time better spent on features
- Message brokers (RabbitMQ/Kafka) require additional infra and are unjustified at this scale
- TCP can be swapped to gRPC/NATS in production — architecture remains the same

**Pattern used — Message Patterns:**

Each microservice exposes handlers via `@MessagePattern`:
```typescript
// apps/auth-service/src/auth/auth.controller.ts
@Controller()
export class AuthController {
  @MessagePattern({ cmd: 'auth_login' })
  async login(@Payload() dto: LoginDto) { ... }

  @MessagePattern({ cmd: 'auth_register' })
  async register(@Payload() dto: RegisterDto) { ... }

  @MessagePattern({ cmd: 'auth_validate_token' })
  async validateToken(@Payload() token: string) { ... }
}
```

API Gateway sends requests to services via `ClientsModule`:
```typescript
// apps/api-gateway/src/app.module.ts
ClientsModule.register([
  { name: 'AUTH_SERVICE',        transport: Transport.TCP, options: { host: 'auth-service',        port: 4001 } },
  { name: 'PATIENT_SERVICE',     transport: Transport.TCP, options: { host: 'patient-service',     port: 4002 } },
  { name: 'DOCTOR_SERVICE',      transport: Transport.TCP, options: { host: 'doctor-service',      port: 4003 } },
  { name: 'APPOINTMENT_SERVICE', transport: Transport.TCP, options: { host: 'appointment-service', port: 4004 } },
  { name: 'TELEMEDICINE_SERVICE',transport: Transport.TCP, options: { host: 'telemedicine-service',port: 4005 } },
  { name: 'PAYMENT_SERVICE',     transport: Transport.TCP, options: { host: 'payment-service',     port: 4006 } },
  { name: 'NOTIFICATION_SERVICE',transport: Transport.TCP, options: { host: 'notification-service',port: 4007 } },
])
```

Each microservice `main.ts`:
```typescript
// apps/auth-service/src/main.ts
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 4001 },
  });
  await app.listen();
}
```

### 4.5 Message Pattern Registry

All `cmd` strings used across services — must be unique and kept in sync via `@healio/shared-types`.

| Service | cmd | Direction | Payload |
|---|---|---|---|
| auth-service | `auth_register` | gateway → auth | `RegisterDto` |
| auth-service | `auth_login` | gateway → auth | `LoginDto` |
| auth-service | `auth_validate_token` | gateway → auth | `string` (JWT) |
| patient-service | `patient_get_profile` | gateway → patient | `{ userId }` |
| patient-service | `patient_update_profile` | gateway → patient | `UpdatePatientDto` |
| patient-service | `patient_upload_report` | gateway → patient | `UploadReportDto` |
| doctor-service | `doctor_get_profile` | gateway → doctor | `{ doctorId }` |
| doctor-service | `doctor_set_availability` | gateway → doctor | `AvailabilityDto` |
| doctor-service | `doctor_issue_prescription` | gateway → doctor | `PrescriptionDto` |
| appointment-service | `appointment_book` | gateway → appointment | `BookAppointmentDto` |
| appointment-service | `appointment_cancel` | gateway → appointment | `{ appointmentId }` |
| appointment-service | `appointment_get_status` | gateway → appointment | `{ appointmentId }` |
| telemedicine-service | `telemedicine_create_session` | gateway → telemedicine | `{ appointmentId }` |
| payment-service | `payment_create_intent` | gateway → payment | `{ appointmentId, amount }` |
| payment-service | `payment_confirm` | gateway → payment | `{ paymentIntentId }` |
| notification-service | `notification_send_sms` | appointment/payment → notification | `SmsDto` |
| notification-service | `notification_send_email` | appointment/payment → notification | `EmailDto` |

---

## 5. Migration Map — Existing Code

The existing module code is salvageable. It just needs to move into the correct service container:

| Existing Path | Destination Service |
|---|---|
| `apps/server/src/auth/` | `apps/auth-service/src/auth/` |
| `apps/server/src/users/` | `apps/auth-service/src/users/` (identity) + `apps/patient-service/src/` (profile) |
| `apps/server/src/doctors/` | `apps/doctor-service/src/doctors/` |
| `apps/server/src/appointments/` | `apps/appointment-service/src/appointments/` |
| `apps/server/src/prescriptions/` | `apps/doctor-service/src/prescriptions/` |
| `apps/server/src/chatbot/` | `apps/ai-symptom-service/src/` |
| `apps/web/` | Keep as-is — only update API base URL to gateway |

---

## 6. Task Breakdown

### Phase 1 — Foundation (Blocking, do first)

| # | Task | Status | Notes |
|---|---|---|---|
| 1 | Remove `apps/server` monolith | ✅ Done | Deleted in session 1 |
| 2 | Create `packages/shared-types` | ✅ Done | Domain models, DTOs, enums |
| 3 | Create `packages/shared-utils` | ✅ Done | Response formatters, helpers |
| 4 | Update root `package.json` + `turbo.json` | ✅ Done | Bun workspaces wired |

### Phase 2 — Microservice Scaffolds

Each service needs: `main.ts`, `app.module.ts`, `package.json`, `tsconfig.json`, `.env.example`

| # | Service | Status | TCP Port | Key `@MessagePattern` cmds |
|---|---|---|---|---|
| 5 | `api-gateway` | ✅ Done | 3001 (HTTP) | HTTP controllers only — JWT strategy + ClientsModule wired to all 7 services |
| 6 | `auth-service` | ✅ Done | 4001 | `auth.register`, `auth.login`, `auth.validate` |
| 7 | `patient-service` | ✅ Done | 4002 | `patient.get`, `patient.update`, `patient.upload_report`, `patient.get_history` |
| 8 | `doctor-service` | ✅ Done | 4003 | `doctor.get`, `doctor.update`, `doctor.set_availability`, `doctor.get_all` |
| 9 | `appointment-service` | ✅ Done | 4004 | `appointment.book`, `appointment.cancel`, `appointment.update_status`, `appointment.get_by_patient`, `appointment.get_by_doctor` |
| 10 | `telemedicine-service` | ✅ Done | 4005 | `tele.create_session`, `tele.join_session`, `tele.end_session` |
| 11 | `payment-service` | ✅ Done | 4006 | `payment.initiate`, `payment.confirm`, `payment.get` |
| 12 | `notification-service` | ✅ Done | 4007 | `notify.send` (routes to Twilio SMS + nodemailer email) |

### Phase 3 — Business Logic (Per Service)

| # | Task | Status | Service | Notes |
|---|---|---|---|---|
| 13 | JWT issuance + validation | ✅ Done | auth-service | bcrypt + `jwtService.sign/verify`, `RpcException` on bad creds |
| 14 | JWT Passport strategy + role guards | ✅ Done | api-gateway | `JwtStrategy`, `JwtAuthGuard`, `RolesGuard`, `@Roles()` decorator |
| 15 | Patient profile CRUD + report upload | ✅ Done | patient-service | MongoDB `$push` for reports array; `createProfile` on register |
| 16 | Doctor profile + availability schedule | ✅ Done | doctor-service | `setAvailability` stores array; `getAll` filters `isVerified: true` |
| 17 | Appointment booking + status tracking | ✅ Done | appointment-service | Full CRUD; `paymentStatus` + `sessionId` fields on schema |
| 18 | Digital prescription issuance | ✅ Done | doctor-service | `prescriptions/` module with schema + controller + service |
| 19 | Jitsi Meet session management | ✅ Done | telemedicine-service | In-memory session map; Jitsi URL generated from `appointmentId` |
| 20 | Stripe sandbox payment | ✅ Done | payment-service | `stripe.paymentIntents.create()` → stores `clientSecret` in MongoDB |
| 21 | Twilio SMS notifications | ✅ Done | notification-service | `twilio` SDK; per-`NotificationType` message templates |
| 22 | nodemailer email notifications | ✅ Done | notification-service | SMTP transport; per-`NotificationType` HTML email templates |
| 23 | AI symptom checker (optional) | ⬜ Todo | ai-symptom-service | Not yet scaffolded — Claude API or OpenAI |

### Phase 4 — Infrastructure

| # | Task | Status | Notes |
|---|---|---|---|
| 24 | Multi-stage `Dockerfile` per service | ✅ Done | `infra/docker/` — one per service |
| 25 | `infra/docker-compose.yml` | ✅ Done | Full local dev stack |
| 26 | `infra/k8s/` — Deployment + Service per app | ✅ Done | `10-` through `17-` manifests |
| 27 | `infra/k8s/` — MongoDB StatefulSet + PVC | ✅ Done | `03-mongodb-statefulset.yaml` + `04-mongodb-service.yaml` |
| 28 | `infra/k8s/` — ConfigMaps + Secrets | ✅ Done | `01-secrets.yaml` + `02-configmap.yaml` |
| 29 | `infra/k8s/` — Ingress for api-gateway | ⬜ Todo | Single external entry point — not yet created |

### Phase 5 — Frontend Wiring

| # | Task | Status | Notes |
|---|---|---|---|
| 30 | API base URL → api-gateway + `api.ts` client | ✅ Done | `NEXT_PUBLIC_API_URL=http://localhost:3001/api`; fetch wrapper with JWT header |
| 31 | `api.ts` — auth, doctors, appointments, patients, sessions, payments | ✅ Done | All API call functions defined |
| 32 | Auth pages (register / login) | ⬜ Todo | Only `layout.tsx` + `page.tsx` exist — no pages yet |
| 33 | Appointment booking UI | ⬜ Todo | Browse doctors → pick slot → pay → confirm |
| 34 | Video consultation UI | ⬜ Todo | Embed Jitsi iframe with `jitsiUrl` from session |
| 35 | Patient dashboard (appointments, reports, prescriptions) | ⬜ Todo | Fetch via `appointments.getMine()`, `patients.getProfile()` |
| 36 | Doctor dashboard (schedule, accept/reject, prescriptions) | ⬜ Todo | Fetch via `appointments.getMine()` with doctor role |

### Phase 6 — Submission Deliverables

| # | Task | Status | Notes |
|---|---|---|---|
| 37 | `members.txt` | ✅ Done | Group member details at repo root |
| 38 | `readme.txt` with deployment steps | ✅ Done | At repo root |
| 39 | `submission.txt` with GitHub + YouTube links | ⬜ Todo | Fill after video recorded |
| 40 | `report.pdf` — architecture diagram + service interfaces | ⬜ Todo | Use this doc as source |

---

## 7. Technology Decisions

| Concern | Choice | Reason |
|---|---|---|
| Service transport | NestJS TCP | No extra infra (no RabbitMQ/Kafka needed for this scale) |
| Video API | Jitsi Meet | Free, self-hostable, no API key required for basic use |
| Payment | Stripe (sandbox) | Well-documented, works globally, sandbox is free |
| SMS | Twilio | Industry standard, free trial tier |
| Email | SendGrid | Free tier (100 emails/day), simple REST API |
| Database | MongoDB (per service) | Already set up as dep, flexible for healthcare schemas |
| Auth | JWT (RS256 or HS256) | Stateless, works across microservices |

---

## 8. Submission Checklist

- [ ] All services independently runnable via `docker compose up`
- [ ] All services deployable to Kubernetes via `kubectl apply -f infra/k8s/`
- [ ] JWT auth enforced with Patient / Doctor / Admin roles
- [ ] Appointment booking flow works end-to-end (book → notify → video session → payment)
- [ ] `submission.txt` contains GitHub repo URL + YouTube demo link
- [ ] `readme.txt` has complete deployment steps
- [ ] `members.txt` has all group member details
- [ ] `report.pdf` includes: architecture diagram, service interfaces, workflows, auth details, individual contributions, code appendix
- [ ] Turnitin similarity below 20% for report
- [ ] ZIP named `GroupID_DS-Assignment.zip`