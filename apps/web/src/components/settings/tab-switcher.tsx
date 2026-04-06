"use client";

import { motion } from "framer-motion";
import { User, ShieldCheck, BellRing, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsTab = "profile" | "security" | "notifications" | "medical";

interface TabSwitcherProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const tabs: { id: SettingsTab; label: string; icon: any }[] = [
  { id: "profile", label: "Profile Details", icon: User },
  { id: "security", label: "Account Security", icon: ShieldCheck },
  { id: "notifications", label: "Communication", icon: BellRing },
  { id: "medical", label: "Clinical Metadata", icon: Activity },
];

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex items-center p-1.5 bg-gray-50 rounded-2xl border border-gray-100 w-fit mb-12 shadow-sm">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-7 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-300 flex items-center justify-center min-w-[140px] active:scale-[0.98]",
              isActive 
                ? "text-brand-dark" 
                : "text-gray-400 hover:text-gray-500 hover:bg-white/30"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-settings-tab"
                className="absolute inset-0 bg-white rounded-xl shadow-sm border border-brand-light/10"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
