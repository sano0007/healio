"use client";

import { Activity, Heart, Droplets, Moon } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Heart Rate",
    value: "72",
    unit: "bpm",
    icon: Heart,
    trend: { value: "+2%", type: "negative" as const },
  },
  {
    title: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    icon: Droplets,
    trend: { value: "Normal", type: "neutral" as const },
  },
  {
    title: "Sleep Quality",
    value: "7.5",
    unit: "hrs",
    icon: Moon,
    trend: { value: "+15%", type: "positive" as const },
  },
  {
    title: "Activity",
    value: "8,432",
    unit: "steps",
    icon: Activity,
    trend: { value: "+8%", type: "positive" as const },
  },
];

export function HealthStats() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
        >
          <StatCard {...stat} className="rounded-3xl border-gray-100/50 shadow-sm" />
        </motion.div>
      ))}
    </div>
  );
}
