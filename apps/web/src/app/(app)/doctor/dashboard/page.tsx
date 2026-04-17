"use client";

import { WelcomeBanner } from "@/components/doctor/dashboard/welcome-banner";
import { StatGrid } from "@/components/doctor/dashboard/stat-grid";
import { TodaySchedule } from "@/components/doctor/dashboard/today-schedule";
import { PendingRequests } from "@/components/doctor/dashboard/pending-requests";

export default function DoctorDashboardPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-12">
      {/* 1. Welcome Header Section */}
      <WelcomeBanner />

      {/* 2. Global Clinician Statistics */}
      <StatGrid />

{/* 3. Operational Grid (Schedule + Management) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
         {/* Main Activity Column (2/3) */}
         <div className="xl:col-span-2 space-y-12">
            <TodaySchedule />
         </div>

  {/* Side Control Column (1/3) */}
    <div className="space-y-12">
       <PendingRequests />
    </div>
      </div>
    </div>
  );
}
