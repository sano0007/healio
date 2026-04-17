"use client";

import {motion} from "framer-motion";
import {Phone, User, Video} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useDoctorAppointments} from "@/hooks/use-doctor-appointments";

export function TodaySchedule() {
    const {data: appointments} = useDoctorAppointments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAppointments = appointments?.filter(a => {
        const d = new Date(a.scheduledAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    }) ?? [];

    const leftCount = todayAppointments.filter(a => a.status !== 'completed').length;

  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 p-8 lg:p-12 shadow-sm space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <h2 className="text-2xl font-bold text-brand-black">Today's Schedule</h2>
          </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-5">{leftCount} Patients left
                for the day</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest border-gray-100 italic">
            Full Agenda
          </Button>
          <Button variant="dark" className="h-10 bg-brand-light text-brand-dark hover:bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-dark/5">
            Add Slot
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[39px] top-6 bottom-6 w-px bg-gradient-to-b from-gray-100 via-gray-100 to-transparent dashed" style={{ backgroundImage: 'linear-gradient(to bottom, transparent 50%, #F3F4F6 50%)', backgroundSize: '1px 12px' }} />

        <div className="space-y-12">
            {todayAppointments.length === 0 ? (
                <div className="text-center py-16 opacity-40">
                    <p className="text-sm font-medium text-gray-500 italic">No appointments scheduled for today.</p>
                </div>
            ) : (
                todayAppointments.map((session, index) => (
                    <motion.div
                        key={session._id}
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{delay: index * 0.1}}
                        className="relative flex gap-10 group"
                    >
                        <div className="pt-2">
                            <div className={cn(
                                "w-[80px] h-[34px] rounded-full flex items-center justify-center text-[10px] font-black tracking-widest transition-all shadow-sm border",
                                session.status === 'completed'
                                    ? "bg-emerald-100 text-emerald-600 border-emerald-100"
                                    : session.status === 'confirmed'
                                        ? "bg-white text-gray-400 border-gray-100 group-hover:border-brand-light"
                                        : "bg-brand-dark text-white border-transparent scale-110 shadow-xl shadow-brand-dark/20"
                            )}>
                                {new Date(session.scheduledAt).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </div>
                        </div>

                        <div className={cn(
                            "flex-1 p-6 rounded-[2.5rem] border transition-all duration-500 flex flex-col lg:flex-row lg:items-center gap-8",
                            session.status === 'completed'
                                ? "bg-gray-50 border-gray-50 opacity-60"
                                : session.status === 'confirmed'
                                    ? "bg-white border-gray-50 hover:border-brand-light group-hover:shadow-2xl group-hover:shadow-brand-dark/5"
                                    : "bg-brand-light/10 border-brand-light shadow-lg shadow-brand-light/5"
                        )}>
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div
                                    className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 border-2 border-white shadow-sm">
                                    <User className="w-6 h-6"/>
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-base font-bold text-brand-black">Patient</h4>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {session.patientId.slice(0, 8)}</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                      <span className={cn(
                          "text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full",
                          session.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                              session.status === 'confirmed' ? "bg-gray-100 text-gray-500" :
                                  "bg-amber-100 text-amber-600"
                      )}>
                        {session.status === 'completed' ? 'Completed' : session.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                      </span>
                                </div>
                                <p className="text-sm font-semibold text-brand-black/70 italic leading-relaxed">
                                    "{session.notes ?? 'General consultation'}"
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <Button variant="outline" size="sm"
                                        className="h-10 w-10 p-0 rounded-xl border-gray-100 group-hover:bg-brand-light/5">
                                    <Phone className="w-4 h-4 text-gray-400"/>
                                </Button>
                                <Button
                                    variant={session.status === 'completed' ? "outline" : "dark"}
                                    className={cn(
                                        "h-12 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest gap-3 transition-all",
                                        session.status === 'completed'
                                            ? "border-gray-100"
                                            : "bg-brand-dark text-white shadow-xl shadow-brand-dark/20"
                                    )}
                                >
                                    <Video className="w-4 h-4"/>
                                    {session.status === 'completed' ? 'View Summary' : 'Start Call'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
