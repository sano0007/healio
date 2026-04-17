"use client";

import {motion} from "framer-motion";
import {Calendar, Info, UserCheck, UserPlus, XCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useAcceptAppointment, useDoctorAppointments, useRejectAppointment} from "@/hooks/use-doctor-appointments";
import {usePatientsLookup} from "@/hooks/use-patient";
import {useRouter} from "next/navigation";

export function PendingRequests() {
    const router = useRouter();
    const {data: appointments} = useDoctorAppointments();
    const {getPatientById} = usePatientsLookup();
    const acceptMutation = useAcceptAppointment();
    const rejectMutation = useRejectAppointment();

    const pending = appointments?.filter(a => a.status === 'pending') ?? [];

  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-light/10 flex items-center justify-center text-brand-dark">
            <UserPlus className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-brand-black tracking-tight">Pending Requests</h3>
        </div>
        <span className="text-[10px] font-black text-brand-dark bg-brand-light/10 px-3 py-1 rounded-full uppercase tracking-widest">
          {pending.length} New
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {pending.map((request) => {
              const patient = getPatientById(request.patientId);
              const patientName = patient?.name || `Patient ${request.patientId.slice(0, 6)}`;

              return (
              <motion.div
                  key={request._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-50 hover:border-brand-light/20 transition-all group"
              >
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300">
                            <UserPlus className="w-5 h-5" />
                         </div>
                         <div>
                             <h4 className="text-sm font-bold text-brand-black">{patientName}</h4>
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ID: {request.patientId.slice(0, 8)}</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[11px] font-bold text-brand-black/60 italic leading-none">
                         <Info className="w-3.5 h-3.5 text-brand-light" />
                         "{request.notes ?? 'No notes provided'}"
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                         <Calendar className="w-3.5 h-3.5" />
                         {new Date(request.scheduledAt).toLocaleDateString('en-US', {
                             weekday: 'short',
                             month: 'short',
                             day: 'numeric',
                             hour: 'numeric',
                             minute: '2-digit',
                             hour12: true,
                         })}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3 pt-2">
                       <Button
                           variant="outline"
                           className="h-11 rounded-xl text-[9px] font-black uppercase tracking-widest gap-2 bg-white border-transparent hover:border-red-100 hover:text-red-500 hover:bg-red-50 transition-all active:scale-[0.98]"
                           onClick={() => rejectMutation.mutate(request._id)}
                           disabled={rejectMutation.isPending}
                       >
                         <XCircle className="w-4 h-4" />
                         Reject
                      </Button>
                       <Button
                           variant="dark"
                           className="h-11 rounded-xl text-[9px] font-black uppercase tracking-widest gap-2 bg-brand-dark text-white hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-brand-dark/5"
                           onClick={() => acceptMutation.mutate(request._id)}
                           disabled={acceptMutation.isPending}
                       >
                         <UserCheck className="w-4 h-4" />
                         Accept
                      </Button>
                   </div>
                </div>
              </motion.div>
              );
          })}

          {pending.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-20">
             <div className="w-16 h-16 rounded-[2rem] bg-gray-50 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-gray-300" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Inbox Zero</p>
                <p className="text-[11px] font-medium text-gray-500 italic max-w-[140px]">No pending clinical requests.</p>
             </div>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-gray-100 text-center">
          <button onClick={() => router.push('/doctor/appointments?status=pending')} className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-dark transition-colors flex items-center justify-center gap-2 w-full active:scale-[0.98]">
             View All Clinical Requests
          </button>
       </div>
    </div>
  );
}