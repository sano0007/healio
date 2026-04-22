"use client";

import {motion} from "framer-motion";
import {Pill, Calendar, Clock, FileText, User, CalendarCheck} from "lucide-react";
import {usePrescriptions} from "@/hooks/use-prescriptions";
import {Skeleton} from "@/components/ui/skeleton";

export default function DoctorPrescriptionsPage() {
    const {data: prescriptions, isLoading, error} = usePrescriptions();

    console.log('Prescriptions page:', { prescriptions, isLoading, error });

    return (
        <div className="max-w-[1600px] mx-auto px-6 py-10 space-y-10">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-brand-black tracking-tight">Prescriptions</h1>
                <p className="text-sm text-gray-400 font-medium">View and manage prescriptions issued to your patients</p>
            </div>

            {/* Prescription List */}
            {isLoading ? (
                <div className="space-y-6">
                    {Array.from({length: 4}).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-[2rem]"/>
                    ))}
                </div>
            ) : error ? (
                <div className="py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                        <Pill className="w-10 h-10 text-red-300"/>
                    </div>
                    <h3 className="text-lg font-bold text-red-600">Error loading prescriptions</h3>
                    <p className="text-xs text-red-400 font-medium mt-2">
                        {String(error)}
                    </p>
                </div>
            ) : !prescriptions || !Array.isArray(prescriptions) || prescriptions.length === 0 ? (
                <div className="py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                        <Pill className="w-10 h-10 text-gray-300"/>
                    </div>
                    <h3 className="text-lg font-bold text-brand-black">No prescriptions</h3>
                    <p className="text-xs text-gray-400 font-medium mt-2">
                        You haven't issued any prescriptions yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {prescriptions.filter(p => p?._id).map((prescription, i) => (
                        <motion.div
                            key={prescription._id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: i * 0.05}}
                            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                {/* Patient Info */}
                                <div className="flex items-center gap-5 min-w-[280px]">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100">
                                        <User className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-brand-black">Patient</h3>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                            ID: {prescription.patientId.slice(0, 8)}
                                        </p>
                                    </div>
                                </div>

                                {/* Appointment Reference */}
                                <div className="flex items-center gap-3 text-sm font-bold text-brand-black">
                                    <CalendarCheck className="w-4 h-4 text-brand-light"/>
                                    <span>Appointment</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-xs font-medium text-gray-400">
                                        {prescription.appointmentId?.slice(0, 8) || 'N/A'}
                                    </span>
                                </div>

                                {/* Date Issued */}
                                <div className="flex items-center gap-3 text-sm font-bold text-brand-black">
                                    <Calendar className="w-4 h-4 text-brand-light"/>
                                    <span>{new Date(prescription.issuedAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}</span>
                                    <span className="text-gray-300">•</span>
                                    <Clock className="w-4 h-4 text-brand-light"/>
                                    <span>{new Date(prescription.issuedAt).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    })}</span>
                                </div>

                                {/* Medication Count */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-brand-light/10 rounded-full w-fit">
                                        <Pill className="w-4 h-4 text-brand-dark"/>
                                        <span className="text-xs font-bold text-brand-dark">
                                            {prescription.medications?.length || 0} medications
                                        </span>
                                    </div>
                                </div>

                                {/* Notes Preview */}
                                {prescription.notes && (
                                    <div className="flex items-center gap-2 lg:max-w-xs">
                                        <FileText className="w-4 h-4 text-gray-300 flex-shrink-0"/>
                                        <p className="text-xs text-gray-400 truncate">{prescription.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Medications Details */}
                            {prescription.medications && prescription.medications.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        Medications
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {prescription.medications.map((med, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-2xl">
                                                <h4 className="text-sm font-bold text-brand-black">{med.name}</h4>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {med.dosage} • {med.frequency} • {med.duration}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}