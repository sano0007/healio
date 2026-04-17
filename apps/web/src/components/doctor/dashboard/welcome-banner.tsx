"use client";

import {motion} from "framer-motion";
import {Activity, Calendar, ChevronRight, Clock, ShieldCheck} from "lucide-react";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {cn} from "@/lib/utils";
import {useAuth} from "@/contexts/auth";
import {useDoctorAppointments} from "@/hooks/use-doctor-appointments";
import {useDoctorProfile} from "@/hooks/use-doctors";
import {api} from "@/lib/api";

export function WelcomeBanner() {
  const router = useRouter();
  const {user} = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const queryClient = useQueryClient();
  const {data: doctor} = useDoctorProfile();
  const {data: appointments} = useDoctorAppointments();
  const statusMutation = useMutation({
    mutationFn: (status: string) => api.doctors.updateStatus(status),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['doctor-profile']});
    },
  });

  const [localStatus, setLocalStatus] = useState<"online" | "busy" | "offline">("online");
  const currentStatus = (doctor?.status as "online" | "busy" | "offline") || localStatus;
  const setStatus = (newStatus: "online" | "busy" | "offline") => {
    setLocalStatus(newStatus);
    statusMutation.mutate(newStatus);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayAppointments = appointments?.filter(a => {
    const d = new Date(a.scheduledAt);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }) ?? [];

  const appointmentCount = todayAppointments.length;
  
  const upcomingAppointments = todayAppointments
    .filter(a => a.status !== 'completed' && new Date(a.scheduledAt) > currentTime)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  
  const firstAppointment = upcomingAppointments[0];
  let minutesUntilFirst = null;
  if (firstAppointment) {
    const diff = new Date(firstAppointment.scheduledAt).getTime() - currentTime.getTime();
    minutesUntilFirst = Math.max(0, Math.floor(diff / 60000));
  }

  const statusColors = {
    online: "text-emerald-500 bg-emerald-50 border-emerald-100",
    busy: "text-orange-500 bg-orange-50 border-orange-100",
    offline: "text-gray-400 bg-gray-50 border-gray-100",
  };

  return (
    <div className="relative overflow-hidden p-10 lg:p-14 bg-brand-dark rounded-[3.5rem] text-white shadow-2xl shadow-brand-dark/20 group">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-light/10 rounded-full blur-[120px] -mr-40 -mt-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-light/5 rounded-full blur-[100px] -ml-20 -mb-20" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div className="space-y-8 max-w-2xl">
          {/* Header Vitals */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <Calendar className="w-4 h-4 text-brand-light" />
              <span className="text-[11px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <Clock className="w-4 h-4 text-brand-light" />
              <span className="text-[11px] font-bold uppercase tracking-widest">
                {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </span>
            </div>
          </motion.div>

          {/* Greeting */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Good Morning, <br />
              <span className="text-brand-light italic">Dr. {user?.name || "Doctor"}</span>
            </h1>
            <p className="text-lg text-brand-light/60 font-medium max-w-lg leading-relaxed">
              You have <span className="text-white font-bold">{appointmentCount} appointment{appointmentCount !== 1 ? 's' : ''}</span> scheduled for today.
              {minutesUntilFirst !== null && minutesUntilFirst > 0 && (
                <> Your first patient is arriving in <span className="text-white font-bold">{minutesUntilFirst} minutes</span>.</>
              )}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-8 pt-4">
            {todayAppointments.length > 0 ? (
              <>
                <div className="flex -space-x-3">
                  {todayAppointments.slice(0, 4).map((apt, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-dark bg-gray-100 overflow-hidden shadow-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-400">P</span>
                    </div>
                  ))}
                  {todayAppointments.length > 4 && (
                    <div className="w-10 h-10 rounded-full border-2 border-brand-dark bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-bold">
                      +{todayAppointments.length - 4}
                    </div>
                  )}
                </div>
                <div className="h-8 w-px bg-white/10" />
              </>
            ) : (
              <div className="h-8 w-px bg-white/10" />
            )}
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-light" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">HIPAA Compliant Session</span>
            </div>
          </div>
        </div>

        {/* Status Control Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-80 p-8 bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 space-y-8 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-light">Status</span>
              <Activity className={cn("w-4 h-4 transition-colors", currentStatus === "online" ? "text-emerald-400" : "text-gray-400")} />
            </div>
            
            <div className="space-y-3">
              {(["online", "busy", "offline"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "w-full px-5 py-4 rounded-2xl border transition-all flex items-center justify-between group/btn",
                    currentStatus === s 
                      ? "bg-white text-brand-dark border-transparent shadow-xl" 
                      : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest">{s}</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    s === "online" ? "bg-emerald-500" : s === "busy" ? "bg-orange-500" : "bg-gray-400",
                    currentStatus === s ? "scale-125" : "scale-100 group-hover/btn:scale-110"
                  )} />
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => router.push('/doctor/settings')}
            className="w-full h-14 bg-brand-light text-brand-dark rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg active:scale-[0.98]"
          >
            Edit Profile
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
