"use client";

import Link from "next/link";
import {ArrowRight, CalendarCheck, Pill} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function DoctorPrescriptionsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-brand-black tracking-tight">Prescriptions</h1>
                <p className="text-sm text-gray-400 font-medium">Issue digital prescriptions to your patients</p>
            </div>

            <div
                className="bg-white rounded-[3rem] border border-gray-100 p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-20 h-20 rounded-full bg-brand-light/10 flex items-center justify-center">
                    <Pill className="w-10 h-10 text-brand-dark"/>
                </div>
                <div className="space-y-3">
                    <h2 className="text-xl font-bold text-brand-black">Issue a New Prescription</h2>
                    <p className="text-sm text-gray-400 font-medium max-w-md leading-relaxed">
                        To issue a prescription, select a confirmed or completed appointment from your appointments
                        list, then create a prescription for that patient.
                    </p>
                </div>
                <Link href="/doctor/appointments">
                    <Button variant="dark"
                            className="h-14 rounded-2xl px-10 text-[11px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-brand-dark/10">
                        <CalendarCheck className="w-4 h-4"/>
                        Go to Appointments
                        <ArrowRight className="w-4 h-4"/>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
