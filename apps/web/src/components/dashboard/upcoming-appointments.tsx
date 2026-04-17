"use client";

import {motion} from "framer-motion";
import {Calendar, ChevronRight, Clock, Video} from "lucide-react";
import {Avatar} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const appointments = [
  {
    id: "1",
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      image: "/images/doctor-1.png",
    },
    date: "Today, June 24",
    time: "10:30 AM",
    status: "confirmed",
    type: "Video Consultation",
  },
  {
    id: "2",
    doctor: {
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      image: "/images/doctor-2.png",
    },
    date: "Tomorrow, June 25",
    time: "02:15 PM",
    status: "pending",
    type: "In-Person Visit",
  },
];

export function UpcomingAppointments() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-brand-black">Upcoming Appointments</h2>
        <Link href="/appointments" className="text-sm font-semibold text-brand-dark hover:underline flex items-center gap-1 group">
          View all <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-4">
        {appointments.map((appt, idx) => (
          <motion.div
            key={appt.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-white rounded-3xl border border-gray-100 hover:border-brand-dark/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
                <Avatar src={appt.doctor?.image || "/images/doctor-1.png"}
                        className="w-14 h-14 border-2 border-brand-light/20"/>
              <div>
                <h3 className="font-bold text-brand-black group-hover:text-brand-dark transition-colors">{appt.doctor.name}</h3>
                <p className="text-xs text-gray-400 font-medium">{appt.doctor.specialty} • {appt.type}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-brand-dark/60" />
                    {appt.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-brand-dark/60" />
                    {appt.time}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {appt.type === "Video Consultation" && (
                <Button variant="dark" size="sm" className="rounded-xl flex-1 sm:flex-none gap-2 h-10 shadow-lg shadow-brand-dark/10">
                  <Video className="w-4 h-4" />
                  Join Call
                </Button>
              )}
              <Button variant="outline" size="sm" className="rounded-xl flex-1 sm:flex-none h-10 border-gray-100 hover:bg-gray-50">
                Details
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
