# AI Symptom Checker Service — Design Spec

**Date:** 2026-04-15
**Status:** Approved

## Overview

Add a Groq-powered AI symptom checker to Healio. Patients describe their symptoms in natural language and receive a structured preliminary health assessment including potential conditions, probabilities, recommended specialist types, and immediate action steps. The frontend UI already exists; this spec covers the new backend microservice, API gateway wiring, and frontend data binding.

---

## Architecture

```
Frontend (Next.js)
  POST /api/ai/symptom-check  { symptoms: string }
        ↓  JWT auth guard (patient must be logged in)
API Gateway (port 3001)
  AiGatewayController → MSG.AI_SYMPTOM_CHECK
        ↓  TCP transport
AI Service (port 5008)
  SymptomCheckerController → SymptomCheckerService
        ↓  OpenAI SDK (Groq base URL + GROQ_API_KEY)
  Groq API — llama-3.3-70b-versatile
        ↑  structured JSON response
  SymptomCheckerService parses & validates
        ↑  returns SymptomCheckResult to gateway
API Gateway returns HTTP 200 JSON to frontend
        ↑
Frontend renders real results in TriageResults
```

---

## New Files

### Backend

| Path | Purpose |
|------|---------|
| `apps/ai-service/src/main.ts` | TCP microservice bootstrap on port 5008 |
| `apps/ai-service/src/app.module.ts` | Root module (ConfigModule + SymptomCheckerModule) |
| `apps/ai-service/src/symptom-checker/symptom-checker.module.ts` | Feature module |
| `apps/ai-service/src/symptom-checker/symptom-checker.controller.ts` | Handles `MSG.AI_SYMPTOM_CHECK` message pattern |
| `apps/ai-service/src/symptom-checker/symptom-checker.service.ts` | Calls Groq, parses response |
| `apps/ai-service/package.json` | NestJS + openai SDK dependencies |
| `apps/ai-service/tsconfig.json` | TypeScript config |

### Gateway

| Path | Purpose |
|------|---------|
| `apps/api-gateway/src/ai/ai-gateway.module.ts` | Gateway feature module |
| `apps/api-gateway/src/ai/ai-gateway.controller.ts` | `POST /ai/symptom-check` with `JwtAuthGuard` |

### Shared Types

| Path | Change |
|------|--------|
| `packages/shared-types/src/messages.ts` | Add `AI_SYMPTOM_CHECK = 'ai.symptom_check'` to `MSG` enum |
| `packages/shared-types/src/index.ts` | Export `SymptomCheckResult` type |

### Infrastructure

| Path | Change |
|------|--------|
| `apps/api-gateway/src/clients.module.ts` | Add `AI_SERVICE` TCP client (port 5008) |
| `apps/api-gateway/src/app.module.ts` | Import `AiGatewayModule` |
| `.env` | Add `GROQ_API_KEY`, `AI_SERVICE_PORT=5008`, `AI_SERVICE_HOST=localhost` |
| `docker-compose.yml` | Add `ai-service` container |
| `infra/k8s/` | Add AI service deployment + service manifests |

### Frontend

| Path | Change |
|------|--------|
| `apps/web/src/app/(app)/symptom-checker/page.tsx` | Add `results` state, pass `symptoms` to `DiagnosticEngine`, pass `results` to `TriageResults` |
| `apps/web/src/components/symptom-checker/diagnostic-engine.tsx` | Fire real API call alongside animation; call `onComplete(data)` when both finish |
| `apps/web/src/components/symptom-checker/triage-results.tsx` | Replace `mockResults` const with `results` prop of type `SymptomCheckResult` |

---

## Data Contracts

### Shared Type

```ts
// packages/shared-types/src/index.ts

export interface SymptomCheckCondition {
  name: string;
  probability: number;        // 0–100
  description: string;
  specialist: string;         // e.g. "Neurologist", "General Physician"
}

export interface SymptomCheckResult {
  severity: 'Low' | 'Moderate' | 'High' | 'Emergency';
  conditions: SymptomCheckCondition[];   // max 3, ranked by probability desc
  recommendedActions: string[];          // 3–5 immediate action steps
}
```

### TCP Message

```ts
// Request payload sent from gateway to ai-service
{ symptoms: string; patientId: string }

// Response
SymptomCheckResult
```

### HTTP Endpoint

```
POST /api/ai/symptom-check
Authorization: Bearer <jwt>
Content-Type: application/json

{ "symptoms": "I have a sharp headache behind my eyes for 2 days..." }

200 OK
{
  "severity": "Moderate",
  "conditions": [...],
  "recommendedActions": [...]
}
```

---

## AI Service Internals

### Groq Configuration

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
```

### System Prompt

```
You are HealioMed, a clinical triage assistant embedded in a telemedicine platform.
Your role is to analyze patient-reported symptoms and provide a preliminary health assessment.

IMPORTANT RULES:
1. Always respond with ONLY valid JSON — no markdown, no explanation, no extra text.
2. The JSON must match this exact schema:
   {
     "severity": "Low" | "Moderate" | "High" | "Emergency",
     "conditions": [
       { "name": string, "probability": number (0-100), "description": string, "specialist": string }
     ],
     "recommendedActions": string[]
   }
3. List up to 3 most probable conditions, ranked by probability (highest first).
4. severity must reflect the most urgent condition identified.
5. Assign a real medical specialist type to each condition (e.g. "General Physician", "Neurologist", "Cardiologist", "Pulmonologist", "Gastroenterologist", "Dermatologist", "Orthopedist", "ENT Specialist", "Ophthalmologist", "Psychiatrist").
6. recommendedActions must contain 3–5 concise, actionable steps the patient can take immediately.
7. This is a triage tool only — never claim to provide a definitive diagnosis.
8. For "Emergency" severity, always include "Call emergency services (911) immediately" as the first recommended action.
```

### Parsing & Error Handling

- Call `JSON.parse()` on the Groq response text.
- If parsing fails, throw `RpcException` with message `'AI service returned malformed response'`.
- The gateway catches this and returns HTTP 500 with a user-friendly message.
- Frontend shows an inline error state in `DiagnosticEngine` if the fetch fails.

---

## Frontend Integration Details

### `page.tsx` state shape

```ts
const [state, setState] = useState<'input' | 'analyzing' | 'results'>('input');
const [userSymptoms, setUserSymptoms] = useState('');
const [results, setResults] = useState<SymptomCheckResult | null>(null);

const handleAnalyze = (symptoms: string) => {
  setUserSymptoms(symptoms);
  setState('analyzing');
};

const handleAnalysisComplete = (data: SymptomCheckResult) => {
  setResults(data);
  setState('results');
};
```

### `DiagnosticEngine` props

```ts
interface DiagnosticEngineProps {
  symptoms: string;
  onComplete: (result: SymptomCheckResult) => void;
  onReset: () => void;   // needed for error state "Try Again" button
}
```

- Fires `POST /api/ai/symptom-check` immediately on mount.
- Runs the existing 5-step animation (9s total).
- Waits for **both** animation completion and API response before calling `onComplete(data)`.
- If API errors, renders an error card with a "Try Again" button that calls `onReset`.

### Gateway controller — extracting `patientId`

The `AiGatewayController` extracts `patientId` from the JWT payload (`req.user.userId`) and includes it in the TCP payload sent to the AI service. The AI service receives it but does not persist it (stateless).

### `TriageResults` props

```ts
interface TriageResultsProps {
  results: SymptomCheckResult;
  onReset: () => void;
}
```

- Remove `const mockResults = {...}`.
- Replace all `mockResults.*` references with `results.*`.
- No other changes to the component structure.

---

## Environment Variables

```env
# New additions to .env
GROQ_API_KEY=your_groq_api_key_here
AI_SERVICE_PORT=5008
AI_SERVICE_HOST=localhost
```

---

## Service Port Map (updated)

| Service | Port |
|---------|------|
| auth-service | 5001 |
| patient-service | 5002 |
| doctor-service | 5003 |
| appointment-service | 5004 |
| telemedicine-service | 5005 |
| payment-service | 5006 |
| notification-service | 5007 |
| **ai-service** | **5008** |

---

## Out of Scope

- Saving symptom check history to MongoDB (stateless by design)
- Streaming responses
- Multi-turn conversation / follow-up questions
- Rate limiting per patient (can be added later)
