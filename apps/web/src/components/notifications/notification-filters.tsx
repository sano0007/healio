"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type FilterType = "all" | "appointments" | "payments" | "medical";

interface NotificationFiltersProps {
  activeFilter: FilterType;
  onChange: (filter: FilterType) => void;
  counts: Record<FilterType, number>;
}

const filters: { id: FilterType; label: string }[] = [
  { id: "all", label: "All Alerts" },
  { id: "appointments", label: "Appointments" },
  { id: "payments", label: "Payments" },
  { id: "medical", label: "Medical" },
];

export function NotificationFilters({ activeFilter, onChange, counts }: NotificationFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={cn(
            "relative px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all overflow-hidden border",
            activeFilter === filter.id 
              ? "bg-brand-dark text-white border-brand-dark shadow-xl shadow-brand-dark/20" 
              : "bg-white text-gray-400 border-gray-100 hover:border-brand-light/30 hover:text-brand-dark"
          )}
        >
          <span className="relative z-10 flex items-center gap-2">
            {filter.label}
            {counts[filter.id] > 0 && (
              <span className={cn(
                "px-1.5 py-0.5 rounded-md text-[9px] font-black",
                activeFilter === filter.id ? "bg-white/20 text-white" : "bg-brand-dark/5 text-brand-dark"
              )}>
                {counts[filter.id]}
              </span>
            )}
          </span>
          {activeFilter === filter.id && (
            <motion.div 
               layoutId="activeFilter"
               className="absolute inset-0 bg-brand-dark -z-10"
               transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
