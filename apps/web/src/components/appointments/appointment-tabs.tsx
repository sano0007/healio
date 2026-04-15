"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "upcoming", label: "Upcoming Appointments" },
  { id: "completed", label: "Completed" },
  { id: "canceled", label: "Canceled" },
];

interface AppointmentTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppointmentTabs({ activeTab, setActiveTab }: AppointmentTabsProps) {
  return (
    <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100 max-w-fit mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 min-w-[120px]",
            activeTab === tab.id ? "text-brand-dark" : "text-gray-400 hover:text-gray-600"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTabBg"
              className="absolute inset-0 bg-white border border-brand-light/10 shadow-sm rounded-xl z-0"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
