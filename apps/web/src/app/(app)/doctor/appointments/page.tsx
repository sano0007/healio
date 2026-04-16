"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {Calendar, CheckCircle2, Clock, User, Video, XCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useAcceptAppointment, useDoctorAppointments, useRejectAppointment} from "@/hooks/use-doctor-appointments";
import {Skeleton} from "@/components/ui/skeleton";

type Tab = "today" | "upcoming" | "pending" | "past";

export default function DoctorAppointmentsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("today");
    const [acceptError, setAcceptError] = useState<string | null>(null);
    const [rejectError, setRejectError] = useState<string | null>(null);
    const {data: appointments, isLoading} = useDoctorAppointments();
    const acceptMutation = useAcceptAppointment();
    const rejectMutation = useRejectAppointment();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const filtered = appointments?.filter(a => {
        const d = new Date(a.scheduledAt);
        const aptDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const diff = Math.floor((aptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (activeTab === "today") return diff === 0;
        if (activeTab === "upcoming") return diff > 0 && (a.status === "pending" || a.status === "confirmed");
        if (activeTab === "pending") return a.status === "pending";
        if (activeTab === "past") return diff < 0 || a.status === "completed" || a.status === "cancelled";
        return true;
    }) ?? [];

    const tabCounts = {
        today: appointments?.filter(a => {
            const d = new Date(a.scheduledAt);
            const aptDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            return aptDate.getTime() === today.getTime();
        }).length ?? 0,
        upcoming: appointments?.filter(a => {
            const d = new Date(a.scheduledAt);
            const aptDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const diff = Math.floor((aptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return diff > 0 && (a.status === "pending" || a.status === "confirmed");
        }).length ?? 0,
        pending: appointments?.filter(a => a.status === "pending").length ?? 0,
        past: appointments?.filter(a => {
            const d = new Date(a.scheduledAt);
            const aptDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const diff = Math.floor((aptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return diff < 0 || a.status === "completed" || a.status === "cancelled";
        }).length ?? 0,
    };

    const tabs: { key: Tab; label: string }[] = [
        {key: "today", label: "Today"},
        {key: "upcoming", label: "Upcoming"},
        {key: "pending", label: "Pending"},
        {key: "past", label: "Past"},
    ];

    return (
        <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-brand-black tracking-tight">My Appointments</h1>
                    <p className="text-sm text-gray-400 font-medium">Manage your patient consultations and schedule</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-3xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                            activeTab === tab.key
                                ? "bg-white text-brand-dark shadow-sm"
                                : "text-gray-400 hover:text-brand-dark"
                        )}
                    >
                        {tab.label}
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-bold",
                            activeTab === tab.key ? "bg-brand-light text-brand-dark" : "bg-gray-200 text-gray-500"
                        )}>
              {tabCounts[tab.key]}
            </span>
                    </button>
                ))}
            </div>

            {/* Error Display */}
            {(acceptError || rejectError) && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600 font-medium">
                    {acceptError || rejectError}
                </div>
            )}

            {/* Appointment Cards */}
            {isLoading ? (
                <div className="space-y-6">
                    {Array.from({length: 4}).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-[2rem]"/>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-gray-300"/>
                    </div>
                    <h3 className="text-lg font-bold text-brand-black">No appointments</h3>
                    <p className="text-xs text-gray-400 font-medium mt-2">No appointments found for this category.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filtered.map((apt, i) => (
                        <motion.div
                            key={apt._id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: i * 0.05}}
                            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                {/* Patient Info */}
                                <div className="flex items-center gap-5 min-w-[280px]">
                                    <div
                                        className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100">
                                        <User className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-brand-black">Patient</h3>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">ID: {apt.patientId.slice(0, 8)}</p>
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div className="flex items-center gap-3 text-sm font-bold text-brand-black">
                                    <Calendar className="w-4 h-4 text-brand-light"/>
                                    <span>{new Date(apt.scheduledAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}</span>
                                    <span className="text-gray-300">•</span>
                                    <Clock className="w-4 h-4 text-brand-light"/>
                                    <span>{new Date(apt.scheduledAt).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    })}</span>
                                </div>

                                {/* Status */}
                                <div className="flex-1">
                  <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      apt.status === 'pending' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          apt.status === 'confirmed' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                              apt.status === 'completed' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                  "bg-gray-50 text-gray-400 border border-gray-100"
                  )}>
                    {apt.status}
                  </span>
                                </div>

                                {/* Notes */}
                                {apt.notes && (
                                    <p className="text-xs text-gray-400 italic lg:max-w-xs">"{apt.notes}"</p>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    {apt.status === 'pending' && (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => {
                                                    setRejectError(null);
                                                    rejectMutation.mutate(apt._id, {onError: (e: any) => setRejectError(e?.message || 'Failed to reject')});
                                                }}
                                                disabled={rejectMutation.isPending}
                                            >
                                                <XCircle className="w-4 h-4"/>
                                                Reject
                                            </Button>
                                            <Button
                                                variant="dark"
                                                className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
                                                onClick={() => {
                                                    setAcceptError(null);
                                                    acceptMutation.mutate(apt._id, {onError: (e: any) => setAcceptError(e?.message || 'Failed to accept')});
                                                }}
                                                disabled={acceptMutation.isPending}
                                            >
                                                <CheckCircle2 className="w-4 h-4"/>
                                                Accept
                                            </Button>
                                        </>
                                    )}
                                    {(apt.status === 'confirmed' || apt.status === 'completed') && (
                                        <Button variant="dark"
                                                className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                                            <Video className="w-4 h-4"/>
                                            {apt.status === 'completed' ? 'View Summary' : 'Start Call'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
