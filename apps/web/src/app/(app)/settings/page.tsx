"use client";

import { useState } from "react";
import { SettingsHeader } from "@/components/settings/settings-header";
import { TabSwitcher, type SettingsTab } from "@/components/settings/tab-switcher";
import { ProfileTab } from "@/components/settings/profile-tab";
import { SecurityTab } from "@/components/settings/security-tab";
import { NotificationsTab } from "@/components/settings/notifications-tab";
import { MedicalInfoTab } from "@/components/settings/medical-info-tab";
import { AnimatePresence, motion } from "framer-motion";
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isDirty, setIsDirty] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(85);

  const handleSave = () => {
    // Simulated success confirmation in clinical log
    console.log("Clinical Settings Update: Success", {
      profileCompletion: 100,
      timestamp: new Date().toISOString()
    });
    setIsDirty(false);
    setCompletionPercentage(100);
  };

  const handleDiscard = () => {
    // Simulated discard notification
    console.log("Clinical Settings Action: Changes Discarded");
    setIsDirty(false);
  };

  // Mock "dirty" state on any interaction within the page for demo purposes
  const handleInteraction = () => {
    if (!isDirty) setIsDirty(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" onClick={handleInteraction}>
      {/* 1. Page Header */}
      <SettingsHeader 
        completionPercentage={completionPercentage} 
        onSave={handleSave} 
        onDiscard={handleDiscard}
        isDirty={isDirty}
      />

      {/* 2. Tab Navigation */}
      <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Dynamic Tab Content */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileTab />
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
               <SecurityTab />
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
               <NotificationsTab />
            </motion.div>
          )}

          {activeTab === "medical" && (
            <motion.div
              key="medical"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
               <MedicalInfoTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Help Section Footer */}
      <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-6">
            <p className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] border-r border-gray-200 pr-6">Healio Security Shield v4.2</p>
            <p className="text-[10px] font-medium text-gray-400 italic">HIPAA Compliant • AES-256 Encrypted • GDPR Ready</p>
         </div>
         <div className="flex items-center gap-4">
            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark transition-colors">Privacy Policy</button>
            <div className="w-1 h-1 bg-gray-200 rounded-full" />
            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark transition-colors">Terms of Transit</button>
            <div className="w-1 h-1 bg-gray-200 rounded-full" />
            <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand-dark transition-colors">Export Account Data</button>
         </div>
      </div>
    </div>
  );
}
