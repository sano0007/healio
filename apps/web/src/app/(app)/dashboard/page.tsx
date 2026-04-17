"use client";

import {useAuth} from "@/contexts/auth";
import {WelcomeBanner} from "@/components/dashboard/welcome-banner";
import {UpcomingAppointments} from "@/components/dashboard/upcoming-appointments";
import {HealthStats} from "@/components/dashboard/health-stats";
import {RecentPrescriptions} from "@/components/dashboard/recent-prescriptions";
import {motion} from "framer-motion";

export default function DashboardPage() {
  const {user} = useAuth();

  return (
    <div className="space-y-10">
      {/* 1. Welcome Section */}
      <WelcomeBanner name={user?.name || "Guest"}/>

      {/* 2. Health Overview (Platform Metrics - Section 3.1.5) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-brand-black px-2">Health Overview</h2>
        </div>
        <HealthStats />
      </section>

      {/* 3. Main Content: Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column (2/3 width) - Activity & Appointments */}
        <div className="lg:col-span-2 space-y-12">

          {/* Upcoming Appointments (Section 3.1.3) */}
          <section>
            <UpcomingAppointments />
          </section>

          {/* Recent Prescriptions (Section 3.1.4) */}
          <section>
            <RecentPrescriptions />
          </section>
        </div>

        {/* Right Column (1/3 width) - Activity Feed */}
        <div className="space-y-8">

        {/* Static Help Card / AI Recommendation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-8 bg-brand-light/30 rounded-[2rem] border border-brand-light/20 shadow-sm"
          >
            <h4 className="font-bold text-brand-dark mb-2">AI Symptom Checker</h4>
            <p className="text-xs text-brand-dark/70 leading-relaxed mb-6">
              Our AI can recommend the best specialty based on your current symptoms and health history.
            </p>
            <button className="w-full py-3 bg-brand-dark text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-dark/10 hover:bg-brand-black transition-all">
              Check Symptoms Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
