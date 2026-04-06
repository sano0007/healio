"use client";

import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";
import { HealthStats } from "@/components/dashboard/health-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { motion } from "framer-motion";

export default function DashboardPage() {
  // Static mock name for now
  const userName = "John Doe";

  return (
    <div className="space-y-10">
      {/* 1. Welcome Section */}
      <WelcomeBanner name={userName} />

      {/* 2. Health Overview (Floating Stats) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-brand-black px-2">Health Overview</h2>
        </div>
        <HealthStats />
      </section>

      {/* 3. Main Content: Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Quick Actions (Cards) */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-black px-2">How can we help today?</h2>
            </div>
            <QuickActions />
          </section>

          {/* Upcoming Appointments */}
          <section>
            <UpcomingAppointments />
          </section>
        </div>

        {/* Right Column (1/3 width) - Activity Feed */}
        <div className="space-y-6">
          <RecentActivity />
          
          {/* Static Promotion/Small Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-8 bg-brand-light/30 rounded-[2rem] border border-brand-light/20"
          >
            <h4 className="font-bold text-brand-dark mb-2">Need a Specialist?</h4>
            <p className="text-xs text-brand-dark/70 leading-relaxed mb-4">
              Our AI can recommend the best specialty based on your current symptoms.
            </p>
            <button className="text-xs font-bold text-brand-dark hover:underline flex items-center gap-1">
              Start Comparison →
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
