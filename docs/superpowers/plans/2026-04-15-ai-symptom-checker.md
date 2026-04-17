# AI Symptom Checker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Groq-powered AI symptom checker microservice (ai-service) and wire it end-to-end from the existing frontend UI through the API gateway.

**Architecture:** New NestJS TCP microservice `apps/ai-service` on port 5008 (stateless, no MongoDB). API gateway routes `POST /api/ai/symptom-check` (JWT-protected) via TCP to ai-service. ai-service calls Groq (`llama-3.3-70b-versatile`) using the OpenAI SDK and returns structured JSON. Frontend's `DiagnosticEngine` fires the real API call during its animation and passes results to `TriageResults` which already has the correct render structure.

**Tech Stack:** NestJS 10, `openai` npm package (OpenAI-compatible SDK for Groq), TypeScript, Next.js 15, Tailwind CSS, Framer Motion

---

## File Map

### New files

| File                                                                | Purpose                                           |
| ------------------------------------------------------------------- | ------------------------------------------------- |
| `apps/ai-service/package.json`                                      | NestJS + openai dependencies                      |
| `apps/ai-service/tsconfig.json`                                     | TypeScript config                                 |
| `apps/ai-service/nest-cli.json`                                     | NestJS CLI config                                 |
| `apps/ai-service/src/main.ts`                                       | TCP microservice bootstrap on port 5008           |
| `apps/ai-service/src/app.module.ts`                                 | Root module (ConfigModule + SymptomCheckerModule) |
| `apps/ai-service/src/symptom-checker/symptom-checker.module.ts`     | Feature module                                    |
| `apps/ai-service/src/symptom-checker/symptom-checker.controller.ts` | Handles `MSG.AI_SYMPTOM_CHECK` TCP pattern        |
| `apps/ai-service/src/symptom-checker/symptom-checker.service.ts`    | Groq call + JSON parse + error handling           |
| `apps/api-gateway/src/ai/ai-gateway.module.ts`                      | Gateway feature module                            |
| `apps/api-gateway/src/ai/ai-gateway.controller.ts`                  | `POST /ai/symptom-check` with JWT guard           |
| `infra/docker/ai-service.Dockerfile`                                | Multi-stage Docker build                          |
| `infra/k8s/18-ai-service.yaml`                                      | Kubernetes Deployment + Service                   |

### Modified files

| File                                                            | Change                                                                  |
| --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `packages/shared-types/src/index.ts`                            | Add `SymptomCheckResult` type + `MSG.AI_SYMPTOM_CHECK`                  |
| `apps/api-gateway/src/clients.module.ts`                        | Register `AI_SERVICE` TCP client                                        |
| `apps/api-gateway/src/app.module.ts`                            | Import `AiGatewayModule`                                                |
| `apps/web/src/lib/api.ts`                                       | Add `api.ai.checkSymptoms()`                                            |
| `apps/web/src/app/(app)/symptom-checker/page.tsx`               | Add `results` state, wire `DiagnosticEngine` + `TriageResults`          |
| `apps/web/src/components/symptom-checker/diagnostic-engine.tsx` | Real API call + animation coordination + error state                    |
| `apps/web/src/components/symptom-checker/triage-results.tsx`    | Replace `mockResults` const with `results` prop                         |
| `infra/docker-compose.yml`                                      | Add `ai-service` container                                              |
| `infra/k8s/02-configmap.yaml`                                   | Add `AI_SERVICE_HOST` + `AI_SERVICE_PORT`                               |
| `.env` / `.env.example`                                         | Add `GROQ_API_KEY`, `AI_SERVICE_PORT=5008`, `AI_SERVICE_HOST=localhost` |

---

## Task 1: Add shared types

**Files:**

- Modify: `packages/shared-types/src/index.ts`

- [ ] **Step 1: Add `SymptomCheckResult` types and `AI_SYMPTOM_CHECK` message**

Open `packages/shared-types/src/index.ts` and add the following at the end of the file:

```typescript
// ─── AI Symptom Checker ───────────────────────────────────────────────────────

export interface SymptomCheckCondition {
  name: string;
  probability: number; // 0–100
  description: string;
  specialist: string; // e.g. "Neurologist", "General Physician"
}

export interface SymptomCheckResult {
  severity: 'Low' | 'Moderate' | 'High' | 'Emergency';
  conditions: SymptomCheckCondition[]; // max 3, ranked by probability desc
  recommendedActions: string[]; // 3–5 immediate action steps
}
```

Also add `AI_SYMPTOM_CHECK` to the `MSG` object (add after the `NOTIFY_SEND` line):

```typescript
  // AI Service
  AI_SYMPTOM_CHECK: 'ai.symptom_check',
```

- [ ] **Step 2: Verify the build still passes**

```bash
cd /Users/stoxmod/WebstormProjects/healio
bun run build --filter=@healio/shared-types
```

Expected: exits 0, no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add packages/shared-types/src/index.ts
git commit -m "feat(shared-types): add SymptomCheckResult types and AI_SYMPTOM_CHECK message"
```

---

## Task 2: Scaffold ai-service

**Files:**

- Create: `apps/ai-service/package.json`
- Create: `apps/ai-service/tsconfig.json`
- Create: `apps/ai-service/nest-cli.json`
- Create: `apps/ai-service/src/main.ts`
- Create: `apps/ai-service/src/app.module.ts`

- [ ] **Step 1: Create `apps/ai-service/package.json`**

```json
{
  "name": "ai-service",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "build": "nest build",
    "dev": "nest start --watch",
    "start": "node dist/main"
  },
  "dependencies": {
    "@healio/shared-types": "workspace:*",
    "@nestjs/common": "^10.4.15",
    "@nestjs/config": "^3.3.0",
    "@nestjs/core": "^10.4.15",
    "@nestjs/microservices": "^10.4.15",
    "openai": "^4.77.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.4.9",
    "@types/node": "^22.10.7",
    "typescript": "^5.7.2"
  }
}
```

- [ ] **Step 2: Create `apps/ai-service/tsconfig.json`**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

- [ ] **Step 3: Create `apps/ai-service/nest-cli.json`**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

- [ ] **Step 4: Create `apps/ai-service/src/main.ts`**

```typescript
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: parseInt(process.env.AI_SERVICE_PORT || '5008'),
      },
    },
  );
  await app.listen();
  console.log(
    `AI-service listening on port ${process.env.AI_SERVICE_PORT || 5008}`,
  );
}
bootstrap();
```

- [ ] **Step 5: Create `apps/ai-service/src/app.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SymptomCheckerModule } from './symptom-checker/symptom-checker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    SymptomCheckerModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 6: Install dependencies**

```bash
cd /Users/stoxmod/WebstormProjects/healio
bun install
```

Expected: `openai` package appears in lockfile, exits 0.

- [ ] **Step 7: Commit**

```bash
git add apps/ai-service/
git commit -m "feat(ai-service): scaffold NestJS TCP microservice"
```

---

## Task 3: Implement SymptomCheckerService

**Files:**

- Create: `apps/ai-service/src/symptom-checker/symptom-checker.service.ts`

- [ ] **Step 1: Create the service**

````typescript
// apps/ai-service/src/symptom-checker/symptom-checker.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import OpenAI from 'openai';
import { SymptomCheckResult } from '@healio/shared-types';

const SYSTEM_PROMPT = `You are HealioMed, a clinical triage assistant embedded in a telemedicine platform.
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
5. Assign a real medical specialist type to each condition. Use one of: "General Physician", "Neurologist", "Cardiologist", "Pulmonologist", "Gastroenterologist", "Dermatologist", "Orthopedist", "ENT Specialist", "Ophthalmologist", "Psychiatrist".
6. recommendedActions must contain 3–5 concise, actionable steps the patient can take immediately.
7. This is a triage tool only — never claim to provide a definitive diagnosis.
8. For "Emergency" severity, always include "Call emergency services (911) immediately" as the first recommended action.`;

@Injectable()
export class SymptomCheckerService {
  private readonly logger = new Logger(SymptomCheckerService.name);
  private readonly client: OpenAI;

  constructor(private config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('GROQ_API_KEY'),
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async checkSymptoms(symptoms: string): Promise<SymptomCheckResult> {
    this.logger.log(`Analyzing symptoms (${symptoms.length} chars)`);

    let raw: string;
    try {
      const completion = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Patient symptoms: ${symptoms}` },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      });
      raw = completion.choices[0]?.message?.content ?? '';
    } catch (err) {
      this.logger.error('Groq API call failed', err);
      throw new RpcException(
        'AI service is temporarily unavailable. Please try again.',
      );
    }

    // Strip any accidental markdown code fences
    const cleaned = raw
      .replace(/^```(?:json)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    let result: SymptomCheckResult;
    try {
      result = JSON.parse(cleaned);
    } catch {
      this.logger.error('Groq returned malformed JSON', { raw });
      throw new RpcException(
        'AI service returned an unexpected response. Please try again.',
      );
    }

    // Basic shape validation
    if (
      !result.severity ||
      !Array.isArray(result.conditions) ||
      !Array.isArray(result.recommendedActions)
    ) {
      throw new RpcException(
        'AI service returned incomplete data. Please try again.',
      );
    }

    return result;
  }
}
````

- [ ] **Step 2: Commit**

```bash
git add apps/ai-service/src/symptom-checker/symptom-checker.service.ts
git commit -m "feat(ai-service): implement SymptomCheckerService with Groq integration"
```

---

## Task 4: Implement SymptomCheckerController and Module

**Files:**

- Create: `apps/ai-service/src/symptom-checker/symptom-checker.controller.ts`
- Create: `apps/ai-service/src/symptom-checker/symptom-checker.module.ts`

- [ ] **Step 1: Create `apps/ai-service/src/symptom-checker/symptom-checker.controller.ts`**

```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MSG } from '@healio/shared-types';
import { SymptomCheckerService } from './symptom-checker.service';

@Controller()
export class SymptomCheckerController {
  constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

  @MessagePattern(MSG.AI_SYMPTOM_CHECK)
  checkSymptoms(@Payload() payload: { symptoms: string; patientId: string }) {
    return this.symptomCheckerService.checkSymptoms(payload.symptoms);
  }
}
```

- [ ] **Step 2: Create `apps/ai-service/src/symptom-checker/symptom-checker.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { SymptomCheckerController } from './symptom-checker.controller';
import { SymptomCheckerService } from './symptom-checker.service';

@Module({
  controllers: [SymptomCheckerController],
  providers: [SymptomCheckerService],
})
export class SymptomCheckerModule {}
```

- [ ] **Step 3: Verify the service builds**

```bash
cd /Users/stoxmod/WebstormProjects/healio
bun run build --filter=ai-service
```

Expected: `dist/main.js` created inside `apps/ai-service/`, exits 0.

- [ ] **Step 4: Commit**

```bash
git add apps/ai-service/src/symptom-checker/
git commit -m "feat(ai-service): add SymptomCheckerController and Module"
```

---

## Task 5: Wire AI_SERVICE into the API Gateway

**Files:**

- Modify: `apps/api-gateway/src/clients.module.ts`
- Modify: `apps/api-gateway/src/app.module.ts`
- Create: `apps/api-gateway/src/ai/ai-gateway.module.ts`
- Create: `apps/api-gateway/src/ai/ai-gateway.controller.ts`

- [ ] **Step 1: Register AI_SERVICE TCP client in `apps/api-gateway/src/clients.module.ts`**

Add the following entry inside the `ClientsModule.registerAsync([...])` array, after the `NOTIFICATION_SERVICE` entry:

```typescript
{ name: 'AI_SERVICE', imports: [ConfigModule], inject: [ConfigService], useFactory: (c: ConfigService) => ({ transport: Transport.TCP, options: { host: c.get('AI_SERVICE_HOST', 'localhost'), port: c.get<number>('AI_SERVICE_PORT', 5008) } }) },
```

The full array will end like:

```typescript
      { name: 'NOTIFICATION_SERVICE', imports: [ConfigModule], inject: [ConfigService], useFactory: (c: ConfigService) => ({ transport: Transport.TCP, options: { host: c.get('NOTIFICATION_SERVICE_HOST', 'localhost'), port: c.get<number>('NOTIFICATION_SERVICE_PORT', 5007) } }) },
      { name: 'AI_SERVICE',           imports: [ConfigModule], inject: [ConfigService], useFactory: (c: ConfigService) => ({ transport: Transport.TCP, options: { host: c.get('AI_SERVICE_HOST', 'localhost'),           port: c.get<number>('AI_SERVICE_PORT', 5008) } }) },
```

- [ ] **Step 2: Create `apps/api-gateway/src/ai/ai-gateway.controller.ts`**

```typescript
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MSG } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('ai')
export class AiGatewayController {
  constructor(@Inject('AI_SERVICE') private aiClient: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post('symptom-check')
  async checkSymptoms(
    @Request() req: { user: { userId: string } },
    @Body() dto: { symptoms: string },
  ) {
    return firstValueFrom(
      this.aiClient.send(MSG.AI_SYMPTOM_CHECK, {
        symptoms: dto.symptoms,
        patientId: req.user.userId,
      }),
    );
  }
}
```

- [ ] **Step 3: Create `apps/api-gateway/src/ai/ai-gateway.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { AiGatewayController } from './ai-gateway.controller';

@Module({
  controllers: [AiGatewayController],
})
export class AiGatewayModule {}
```

- [ ] **Step 4: Import `AiGatewayModule` in `apps/api-gateway/src/app.module.ts`**

Add the import at the top:

```typescript
import { AiGatewayModule } from './ai/ai-gateway.module';
```

Add `AiGatewayModule` to the `imports` array:

```typescript
imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    ClientsProxyModule,
    AuthModule,
    UsersGatewayModule,
    DoctorsGatewayModule,
    AppointmentsGatewayModule,
    TelemedicineGatewayModule,
    PaymentGatewayModule,
    AdminGatewayModule,
    AiGatewayModule,   // <-- add this
  ],
```

- [ ] **Step 5: Build the gateway to verify**

```bash
cd /Users/stoxmod/WebstormProjects/healio
bun run build --filter=api-gateway
```

Expected: exits 0, no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add apps/api-gateway/src/
git commit -m "feat(api-gateway): wire AI_SERVICE client and AiGatewayController"
```

---

## Task 6: Add environment variables

**Files:**

- Modify: `.env` (root)
- Modify: `.env.example` (if it exists at root)

- [ ] **Step 1: Add vars to `.env`**

Check if `.env` exists at the repo root:

```bash
ls /Users/stoxmod/WebstormProjects/healio/.env
```

Append these lines:

```env
# AI Service (Groq)
GROQ_API_KEY=your_groq_api_key_here
AI_SERVICE_PORT=5008
AI_SERVICE_HOST=localhost
```

Get a Groq API key from https://console.groq.com — replace `your_groq_api_key_here` with the real key.

- [ ] **Step 2: Update `.env.example` if it exists**

```bash
ls /Users/stoxmod/WebstormProjects/healio/.env.example 2>/dev/null && echo "exists"
```

If it exists, append the same block with a blank key value:

```env
# AI Service (Groq)
GROQ_API_KEY=
AI_SERVICE_PORT=5008
AI_SERVICE_HOST=localhost
```

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "chore: add AI service env vars to .env.example"
```

(Do NOT commit `.env` — it contains the real API key and is gitignored.)

---

## Task 7: Smoke test the backend end-to-end

Before touching the frontend, verify the full backend chain works.

- [ ] **Step 1: Start MongoDB and both services**

In one terminal:

```bash
cd /Users/stoxmod/WebstormProjects/healio
bun run dev --filter=ai-service
```

Expected output: `AI-service listening on port 5008`

In another terminal:

```bash
bun run dev --filter=api-gateway
```

Expected output: `Nest application successfully started`

- [ ] **Step 2: Get a JWT token**

```bash
curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your_patient_email","password":"your_password"}' | jq .access_token
```

Copy the token value.

- [ ] **Step 3: Call the symptom check endpoint**

```bash
curl -s -X POST http://localhost:3001/api/ai/symptom-check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_from_step_2>" \
  -d '{"symptoms":"I have had a persistent headache for 2 days, slight nausea, and sensitivity to light."}' | jq .
```

Expected: JSON response with `severity`, `conditions` array, and `recommendedActions` array. Example:

```json
{
  "severity": "Moderate",
  "conditions": [
    { "name": "Migraine", "probability": 78, "description": "...", "specialist": "Neurologist" },
    ...
  ],
  "recommendedActions": ["Rest in a dark room", ...]
}
```

---

## Task 8: Add `api.ai` to the frontend API client

**Files:**

- Modify: `apps/web/src/lib/api.ts`

- [ ] **Step 1: Add the `SymptomCheckResult` import and `ai` namespace**

At the top of `apps/web/src/lib/api.ts`, after the existing interfaces, add:

```typescript
export interface SymptomCheckCondition {
  name: string;
  probability: number;
  description: string;
  specialist: string;
}

export interface SymptomCheckResult {
  severity: 'Low' | 'Moderate' | 'High' | 'Emergency';
  conditions: SymptomCheckCondition[];
  recommendedActions: string[];
}
```

Inside the `api` object, add an `ai` property after the `sessions` block:

```typescript
  ai: {
    checkSymptoms: (symptoms: string) =>
      request<SymptomCheckResult>('/ai/symptom-check', {
        method: 'POST',
        body: JSON.stringify({ symptoms }),
      }),
  },
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/api.ts
git commit -m "feat(web): add api.ai.checkSymptoms to API client"
```

---

## Task 9: Update `TriageResults` to accept real data

**Files:**

- Modify: `apps/web/src/components/symptom-checker/triage-results.tsx`

- [ ] **Step 1: Replace `mockResults` with a `results` prop**

The current file has `const mockResults = { severity: "Moderate", conditions: [...], recommendedActions: [...] }` hardcoded at the top and the component signature is `({ onReset }: { onReset: () => void })`.

Make these changes:

1. Remove the entire `const mockResults = { ... }` block (lines 9–21).

2. Add an import for `SymptomCheckResult` from the API lib. At the top of the file, add:

```typescript
import type { SymptomCheckResult } from '@/lib/api';
```

3. Change the component signature from:

```typescript
export function TriageResults({ onReset }: { onReset: () => void }) {
```

to:

```typescript
export function TriageResults({ results, onReset }: { results: SymptomCheckResult; onReset: () => void }) {
```

4. Replace every occurrence of `mockResults` with `results` (there are 3: `mockResults.severity`, `mockResults.conditions`, `mockResults.recommendedActions`).

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/symptom-checker/triage-results.tsx
git commit -m "feat(web): wire TriageResults to accept real SymptomCheckResult prop"
```

---

## Task 10: Update `DiagnosticEngine` to call the real API

**Files:**

- Modify: `apps/web/src/components/symptom-checker/diagnostic-engine.tsx`

- [ ] **Step 1: Rewrite `DiagnosticEngine` with real API call**

Replace the entire file content with:

```typescript
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Activity, ShieldCheck, Database, Search, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { SymptomCheckResult } from "@/lib/api";
import { Button } from "@/components/ui/button";

const diagnosticSteps = [
  { icon: <Database />, label: "Accessing Global Clinical Databases..." },
  { icon: <Search />, label: "Identifying Symptomatic Correlations..." },
  { icon: <BrainCircuit />, label: "Applying Neural Diagnostic Models..." },
  { icon: <Activity />, label: "Calculating Condition Probability..." },
  { icon: <FileText />, label: "Finalizing Clinical Triage Summary..." },
];

interface DiagnosticEngineProps {
  symptoms: string;
  onComplete: (result: SymptomCheckResult) => void;
  onReset: () => void;
}

export function DiagnosticEngine({ symptoms, onComplete, onReset }: DiagnosticEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Hold resolved API result and animation-done flag separately
  const apiResultRef = useRef<SymptomCheckResult | null>(null);
  const animationDoneRef = useRef(false);

  // Trigger onComplete only when BOTH animation and API have finished
  const tryComplete = () => {
    if (animationDoneRef.current && apiResultRef.current) {
      onComplete(apiResultRef.current);
    }
  };

  // Animation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= diagnosticSteps.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            animationDoneRef.current = true;
            tryComplete();
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // API call
  useEffect(() => {
    api.ai.checkSymptoms(symptoms)
      .then((result) => {
        apiResultRef.current = result;
        tryComplete();
      })
      .catch((err) => {
        const message = err?.message || 'Analysis failed. Please try again.';
        setError(message);
      });
  }, [symptoms]);  // eslint-disable-line react-hooks/exhaustive-deps

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 py-20">
        <div className="w-20 h-20 rounded-[2rem] bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-brand-black">Analysis Unavailable</h3>
          <p className="text-sm text-gray-400 font-medium max-w-sm">{error}</p>
        </div>
        <Button onClick={onReset} variant="outline" className="h-12 rounded-2xl px-8 text-xs font-black uppercase tracking-widest border-gray-200 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-16 py-20">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-brand-light/20 rounded-full blur-3xl -z-10 scale-[1.5]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute inset-0 bg-brand-dark/10 rounded-full blur-2xl -z-10 scale-[1.2]"
        />
        <div className="w-40 h-40 rounded-[3.5rem] bg-brand-dark flex items-center justify-center shadow-2xl shadow-brand-dark/30 border border-brand-light/30 relative overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-10"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-brand-light to-transparent" />
          </motion.div>
          <BrainCircuit className="w-20 h-20 text-white" strokeWidth={1} />
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 text-center px-6">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-brand-black tracking-tight">Clinical Diagnosis Engine</h3>
          <p className="text-sm font-medium text-gray-400 italic">Processing natural language inputs with HealioMed-7B Model...</p>
        </div>

        <div className="space-y-6">
          <div className="w-full h-2.5 bg-gray-50 rounded-full border border-gray-100 overflow-hidden relative shadow-inner">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / diagnosticSteps.length) * 100}%` }}
              className="absolute inset-y-0 left-0 bg-brand-dark rounded-full shadow-lg shadow-brand-dark/20"
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <div className="h-10 relative overflow-hidden flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2.5 text-[11px] font-black text-brand-dark uppercase tracking-[0.15em]"
              >
                <div className="p-1 bg-brand-dark/5 rounded-md text-brand-dark">
                  {diagnosticSteps[currentStep].icon}
                </div>
                {diagnosticSteps[currentStep].label}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="pt-10 flex items-center gap-6">
        <TriageStat label="Data Points" value="1.2M+" />
        <TriageStat label="Confidence" value="98.2%" />
        <TriageStat label="Model" value="H-Med v4" />
      </div>
    </div>
  );
}

function TriageStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center px-6 border-r last:border-none border-gray-100">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-brand-black">{value}</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/symptom-checker/diagnostic-engine.tsx
git commit -m "feat(web): wire DiagnosticEngine to real Groq API call"
```

---

## Task 11: Update `page.tsx` to wire state between components

**Files:**

- Modify: `apps/web/src/app/(app)/symptom-checker/page.tsx`

- [ ] **Step 1: Add `results` state and update handler signatures**

Open `apps/web/src/app/(app)/symptom-checker/page.tsx`.

Add the import for `SymptomCheckResult` at the top:

```typescript
import type { SymptomCheckResult } from '@/lib/api';
```

Change the state declarations from:

```typescript
const [state, setState] = useState<CheckerState>('input');
const [userSymptoms, setUserSymptoms] = useState('');
```

to:

```typescript
const [state, setState] = useState<CheckerState>('input');
const [userSymptoms, setUserSymptoms] = useState('');
const [results, setResults] = useState<SymptomCheckResult | null>(null);
```

Change `handleAnalysisComplete` from:

```typescript
const handleAnalysisComplete = () => {
  setState('results');
};
```

to:

```typescript
const handleAnalysisComplete = (data: SymptomCheckResult) => {
  setResults(data);
  setState('results');
};
```

Update `handleReset` to also clear results:

```typescript
const handleReset = () => {
  setState('input');
  setUserSymptoms('');
  setResults(null);
};
```

- [ ] **Step 2: Pass new props to `DiagnosticEngine` and `TriageResults`**

Change the `DiagnosticEngine` usage from:

```typescript
<DiagnosticEngine onComplete={handleAnalysisComplete} />
```

to:

```typescript
<DiagnosticEngine symptoms={userSymptoms} onComplete={handleAnalysisComplete} onReset={handleReset} />
```

Change the `TriageResults` usage from:

```typescript
<TriageResults onReset={handleReset} />
```

to:

```typescript
{results && <TriageResults results={results} onReset={handleReset} />}
```

- [ ] **Step 3: Commit**

```bash
git add "apps/web/src/app/(app)/symptom-checker/page.tsx"
git commit -m "feat(web): wire symptom checker page to real AI results"
```

---

## Task 12: Add Docker support for ai-service

**Files:**

- Create: `infra/docker/ai-service.Dockerfile`
- Modify: `infra/docker-compose.yml`

- [ ] **Step 1: Create `infra/docker/ai-service.Dockerfile`**

```dockerfile
FROM oven/bun:1.1.38-alpine AS builder
WORKDIR /app

COPY package.json turbo.json ./
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY apps/api-gateway/package.json ./apps/api-gateway/package.json
COPY apps/auth-service/package.json ./apps/auth-service/package.json
COPY apps/patient-service/package.json ./apps/patient-service/package.json
COPY apps/doctor-service/package.json ./apps/doctor-service/package.json
COPY apps/appointment-service/package.json ./apps/appointment-service/package.json
COPY apps/telemedicine-service/package.json ./apps/telemedicine-service/package.json
COPY apps/payment-service/package.json ./apps/payment-service/package.json
COPY apps/notification-service/package.json ./apps/notification-service/package.json
COPY apps/ai-service/package.json ./apps/ai-service/package.json

RUN bun install

RUN touch .env .env.example

COPY packages/shared-types ./packages/shared-types
COPY apps/ai-service ./apps/ai-service

RUN bun run build --filter=ai-service

FROM oven/bun:1.1.38-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/ai-service/dist ./dist
COPY --from=builder /app/apps/ai-service/package.json .

EXPOSE 5008
CMD ["node", "dist/main.js"]
```

- [ ] **Step 2: Add `ai-service` to `infra/docker-compose.yml`**

Add this service block after the `notification-service` block (before the `networks:` section):

```yaml
# ─── AI Service ──────────────────────────────────────────────────────────────
ai-service:
  build:
    context: /Users/stoxmod/WebstormProjects/healio
    dockerfile: infra/docker/ai-service.Dockerfile
  image: healio/ai-service:latest
  container_name: healio-ai-service
  restart: unless-stopped
  ports:
    - '5008:5008'
  environment:
    - PORT=5008
    - GROQ_API_KEY=${GROQ_API_KEY:-}
  networks:
    - healio-net
```

Also add `ai-service` to the `api-gateway` `depends_on` block:

```yaml
ai-service:
  condition: service_started
```

- [ ] **Step 3: Update api-gateway environment in docker-compose to include AI service**

Inside the `api-gateway` `environment:` list, add:

```yaml
- AI_SERVICE_HOST=ai-service
- AI_SERVICE_PORT=5008
```

- [ ] **Step 4: Commit**

```bash
git add infra/docker/ai-service.Dockerfile infra/docker-compose.yml
git commit -m "feat(infra): add ai-service Docker support"
```

---

## Task 13: Add Kubernetes manifests for ai-service

**Files:**

- Create: `infra/k8s/18-ai-service.yaml`
- Modify: `infra/k8s/02-configmap.yaml`

- [ ] **Step 1: Create `infra/k8s/18-ai-service.yaml`**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service
  namespace: healio
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ai-service
  template:
    metadata:
      labels:
        app: ai-service
    spec:
      containers:
        - name: ai-service
          image: healio/ai-service:latest
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 5008
          env:
            - name: PORT
              value: '5008'
            - name: GROQ_API_KEY
              valueFrom:
                secretKeyRef:
                  name: healio-secrets
                  key: GROQ_API_KEY
---
apiVersion: v1
kind: Service
metadata:
  name: ai-service
  namespace: healio
spec:
  selector:
    app: ai-service
  ports:
    - port: 5008
      targetPort: 5008
  clusterIP: None
```

- [ ] **Step 2: Add AI service discovery to `infra/k8s/02-configmap.yaml`**

At the end of the `data:` section, add:

```yaml
AI_SERVICE_HOST: 'ai-service'
AI_SERVICE_PORT: '5008'
```

- [ ] **Step 3: Add `GROQ_API_KEY` to K8s secrets script**

Open `infra/k8s/01-secrets.yaml` (or the gen-secrets script at the repo root — check `package.json` for `k8s:gen-secrets`). Make sure `GROQ_API_KEY` is included when regenerating secrets from `.env`.

Find the gen-secrets script:

```bash
grep -r "gen-secrets" /Users/stoxmod/WebstormProjects/healio/package.json
```

If it's a shell script that reads from `.env` and generates the manifest, `GROQ_API_KEY` will be picked up automatically since you added it to `.env`. If it has an explicit list, add `GROQ_API_KEY` to it.

- [ ] **Step 4: Add `AI_SERVICE_HOST` and `AI_SERVICE_PORT` to api-gateway K8s manifest**

Open `infra/k8s/10-api-gateway.yaml`. In the `env:` section, add:

```yaml
- name: AI_SERVICE_HOST
  valueFrom:
    configMapKeyRef:
      name: healio-configmap
      key: AI_SERVICE_HOST
- name: AI_SERVICE_PORT
  valueFrom:
    configMapKeyRef:
      name: healio-configmap
      key: AI_SERVICE_PORT
```

- [ ] **Step 5: Commit**

```bash
git add infra/k8s/
git commit -m "feat(k8s): add ai-service deployment and service manifests"
```

---

## Task 14: End-to-end browser test

- [ ] **Step 1: Start the dev stack**

```bash
cd /Users/stoxmod/WebstormProjects/healio
# Terminal 1 — AI service
bun run dev --filter=ai-service

# Terminal 2 — API gateway
bun run dev --filter=api-gateway

# Terminal 3 — Frontend
bun run dev --filter=web
```

- [ ] **Step 2: Navigate to the symptom checker**

Open `http://localhost:3000`. Log in as a patient. Navigate to the Symptom Checker page.

- [ ] **Step 3: Test the happy path**

1. Type: `"I have had a sharp headache behind my eyes for 2 days, I feel nauseous and light makes it worse"`
2. Click **Begin Diagnostic Analysis**
3. Watch the 5-step animation play through (~9 seconds)
4. Verify the real results appear in `TriageResults` — severity banner, condition cards with probabilities and specialist names, action steps sidebar
5. Click **Find Specialists** on a condition card — verify it navigates to `/doctors?specialty=<specialist>`
6. Click **Reset Analysis** — verify it returns to the input screen

- [ ] **Step 4: Test the error state**

Temporarily set `GROQ_API_KEY=invalid_key` in `.env` and restart ai-service. Submit symptoms. Verify the error card appears with "Analysis Unavailable" and a "Try Again" button. Restore the real key.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: AI symptom checker service — full stack integration complete"
```
