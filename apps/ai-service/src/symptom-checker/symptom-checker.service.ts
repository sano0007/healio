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
      throw new RpcException('AI service is temporarily unavailable. Please try again.');
    }

    // Strip any accidental markdown code fences
    const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

    let result: SymptomCheckResult;
    try {
      result = JSON.parse(cleaned);
    } catch {
      this.logger.error('Groq returned malformed JSON', { raw });
      throw new RpcException('AI service returned an unexpected response. Please try again.');
    }

    // Basic shape validation
    if (!result.severity || !Array.isArray(result.conditions) || !Array.isArray(result.recommendedActions)) {
      throw new RpcException('AI service returned incomplete data. Please try again.');
    }

    return result;
  }
}
