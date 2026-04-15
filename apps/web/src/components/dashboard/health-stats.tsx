"use client";

import { Calendar, UserCheck, Clock, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Total Appointments",
    value: "24",
    unit: "this month",
    icon: UserCheck,
    trend: { value: "+12%", type: "positive" as const },
  },
  {
    title: "Upcoming Sessions",
    value: "3",
    unit: "next 7 days",
    icon: Clock,
    trend: { value: "On Track", type: "neutral" as const },
  },
  {
    title: "Last Consultation",
    value: "2d ago",
    unit: "June 22",
    icon: Calendar,
    trend: { value: "Completed", type: "positive" as const },
  },
  {
    title: "Health Progress",
    value: "85%",
    unit: "Recovery",
    icon: CheckCircle2,
    trend: { value: "+5%", type: "positive" as const },
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
