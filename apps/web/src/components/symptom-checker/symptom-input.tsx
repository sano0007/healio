'use client';

import {
  Sparkles,
  History,
  Info,
  ChevronRight,
  Activity,
  Thermometer,
  Brain,
  HeartPulse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const commonSymptoms = [
  {
    id: 'headache',
    label: 'Severe Headache',
    icon: <Brain className="w-3.5 h-3.5" />,
    preset:
      "I've been having a severe headache for the past two days. The pain is sharp and concentrated behind my eyes, and it gets worse when I look at bright lights or screens. I also feel slightly nauseous.",
  },
  {
    id: 'fever',
    label: 'High Fever',
    icon: <Thermometer className="w-3.5 h-3.5" />,
    preset:
      "I've had a high fever since yesterday evening, my temperature is around 39°C (102°F). I feel hot and sweaty, have chills, and my body aches all over. I've been feeling very weak.",
  },
  {
    id: 'fatigue',
    label: 'Extreme Fatigue',
    icon: <Activity className="w-3.5 h-3.5" />,
    preset:
      "I've been experiencing extreme fatigue for the past week. Even after a full night's sleep I wake up exhausted. I have no energy to do daily tasks, and I feel mentally foggy most of the time.",
  },
  {
    id: 'chest_pain',
    label: 'Chest Pain',
    icon: <HeartPulse className="w-3.5 h-3.5" />,
    preset:
      "I'm having a tightness and dull aching pain in the center of my chest. It started a few hours ago and comes and goes. I also feel a little short of breath when I walk up stairs or move quickly.",
  },
];

interface SymptomInputProps {
  onAnalyze: (symptoms: string) => void;
}

export function SymptomInput({ onAnalyze }: SymptomInputProps) {
  const [text, setText] = useState('');

  const handleQuickSelect = (preset: string) => {
    setText(preset);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-dark/10 flex items-center justify-center text-brand-dark border border-brand-light/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brand-black tracking-tight">
              AI Clinical Triage
            </h2>
            <p className="text-xs font-medium text-gray-400">
              Describe your symptoms in your own words for a preliminary digital
              analysis.
            </p>
          </div>
        </div>

        {/* 1. Natural Language Input */}
        <div className="relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="E.g., I've been having a sharp headache behind my eyes for 2 days, and I feel slightly nauseous..."
            className="w-full min-h-[220px] bg-white rounded-[3rem] border border-gray-100 p-10 text-lg font-medium text-brand-black placeholder:text-gray-300 focus:outline-none focus:border-brand-light/30 transition-all shadow-sm group-hover:shadow-xl resize-none"
          />
          <div className="absolute right-8 bottom-8 flex items-center gap-3">
            <Button
              onClick={() => onAnalyze(text)}
              disabled={!text.trim()}
              variant="dark"
              className="h-14 rounded-2xl px-8 text-xs font-black gap-2 shadow-xl shadow-brand-dark/10 group/btn disabled:opacity-50 disabled:shadow-none"
            >
              Begin Diagnostic Analysis
              <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Common Symptoms Quick Select */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
          Common Indicators
        </p>
        <div className="flex flex-wrap gap-3">
          {commonSymptoms.map((symptom) => (
            <button
              key={symptom.id}
              onClick={() => handleQuickSelect(symptom.preset)}
              className="px-6 py-3 bg-white rounded-2xl border border-gray-100 text-[11px] font-bold text-brand-black flex items-center gap-2 hover:border-brand-light/30 hover:bg-gray-50/50 hover:shadow-lg transition-all active:scale-95"
            >
              <span className="text-brand-dark">{symptom.icon}</span>
              {symptom.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Safety Disclosure */}
      <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-blue-800">
            Clinical Accuracy Notice
          </p>
          <p className="text-[10px] font-medium text-blue-600/80 leading-relaxed">
            Healio AI provides a preliminary triage based on probability models.
            It is NOT a medical diagnosis. If you are experiencing server chest
            pain, difficulty breathing, or severe bleeding, please call{' '}
            <span className="font-bold underline">Emergency Services</span>{' '}
            immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
