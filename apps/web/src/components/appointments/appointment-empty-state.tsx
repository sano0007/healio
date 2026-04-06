"use client";

import { CalendarPlus, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function AppointmentEmptyState({ type }: { type: string }) {
  const content = {
    upcoming: {
      title: "No Upcoming Appointments",
      description: "You don't have any scheduled consultations. Need medical advice? Browse our top-rated specialists.",
      action: "Find a Doctor",
      link: "/doctors"
    },
    completed: {
      title: "No Completed Visits",
      description: "Your past appointment history will appear here once you finish a consultation.",
      action: "Book Your First Session",
      link: "/doctors"
    },
    canceled: {
      title: "No Canceled Requests",
      description: "Any canceled or rescheduled appointments will be tracked here for your reference.",
      action: "Go to Dashboard",
      link: "/dashboard"
    }
  }[type] || content.upcoming;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm"
    >
      <div className="w-24 h-24 bg-brand-light/10 rounded-[2.5rem] flex items-center justify-center text-brand-dark mb-8 shadow-inner">
        <CalendarPlus className="w-10 h-10" />
      </div>
      
      <h3 className="text-xl font-bold text-brand-black mb-3">{content.title}</h3>
      <p className="text-gray-400 max-w-sm mx-auto mb-10 text-sm font-medium leading-relaxed">
        {content.description}
      </p>

      <Link href={content.link}>
        <Button variant="dark" className="h-14 px-10 rounded-2xl text-sm font-bold gap-3 shadow-xl shadow-brand-dark/10 hover:scale-[1.02] active:scale-95 transition-all">
          {content.action}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </motion.div>
  );
}
