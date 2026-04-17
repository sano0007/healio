"use client";

import {Archive, Download, FileText, HeartPulse, Send, Share2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {motion} from "framer-motion";
import type {Prescription} from "@/lib/api";
import {Skeleton} from "@/components/ui/skeleton";

interface PrescriptionHistoryProps {
    prescriptions: Prescription[];
    isLoading?: boolean;
}

export function PrescriptionHistory({prescriptions, isLoading}: PrescriptionHistoryProps) {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-brand-black tracking-tight">Prescription Archive</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Viewing
                            records for the last 12 months</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {Array.from({length: 3}).map((_, i) => (
                        <Skeleton key={i} className="h-20 rounded-[2rem]"/>
                    ))}
                </div>
            </div>
        );
    }

    const rows = prescriptions.map((rx) => ({
        id: `RX-${rx._id.slice(-4).toUpperCase()}`,
        name: rx.medications.map((m) => m.name).join(", "),
        doctor: rx.doctorName,
        date: new Date(rx.issuedAt).toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"}),
        status: "Active",
        pharmacy: "Digital Script",
        diagnosis: rx.diagnosis ?? "",
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
         <div className="space-y-1">
           <h2 className="text-xl font-bold text-brand-black tracking-tight">Prescription Archive</h2>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Viewing records for the last 12 months</p>
         </div>
         <Button variant="outline" className="h-10 rounded-2xl px-4 text-[10px] font-bold gap-2 border-gray-100 bg-white">
           <Archive className="w-4 h-4" />
           Download Full History
         </Button>
      </div>

        {rows.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm font-medium italic">
                No prescription history found.
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">
                        <th className="pb-2 pl-4">Record ID</th>
                        <th className="pb-2">Medication</th>
                        <th className="pb-2">Prescribing Physician</th>
                        <th className="pb-2">Pharmacy Sync</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2 pr-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="space-y-4">
                    {rows.map((item, i) => (
                        <motion.tr
                            key={item.id}
                            initial={{opacity: 0, x: -10}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.3, delay: i * 0.05}}
                            className="group bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:bg-gray-50/50 hover:shadow-lg hover:border-brand-light/30 overflow-hidden"
                        >
                            <td className="py-5 pl-8 rounded-l-[2rem]">
                                <span
                                    className="text-[10px] font-black text-brand-dark px-2 py-1 bg-brand-light/10 rounded-lg border border-brand-light/20">{item.id}</span>
                            </td>
                            <td className="py-5">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-brand-dark group-hover:bg-white border border-gray-100 transition-colors">
                                        <FileText className="w-4 h-4"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-brand-black tracking-tight">{item.name}</p>
                                        {item.diagnosis && (
                                            <p className="text-[9px] font-medium text-gray-400 italic line-clamp-1">Dx: {item.diagnosis}</p>
                                        )}
                                        <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">{item.date}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-5">
                                <p className="text-xs font-bold text-brand-black">{item.doctor}</p>
                                {item.doctor && (
                                    <p className="text-[9px] font-medium text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                        <HeartPulse className="w-3 h-3"/>
                                        Verified Provider
                                    </p>
                                )}
                            </td>
                            <td className="py-5">
                                <p className="text-[10px] font-bold text-gray-500 leading-none mb-1 uppercase tracking-tight">{item.pharmacy}</p>
                                <span
                                    className="text-[9px] font-medium text-blue-500 uppercase tracking-widest flex items-center gap-1 group-hover:underline cursor-pointer">
                       <Share2 className="w-3 h-3"/>
                       Sync Details
                    </span>
                            </td>
                            <td className="py-5">
                    <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        item.status === "Active" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-gray-400 bg-gray-50 border-gray-100"
                    )}>
                      {item.status}
                    </span>
                            </td>
                            <td className="py-5 pr-8 rounded-r-[2rem] text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline" size="sm"
                                            className="h-8 w-8 rounded-lg p-0 hover:bg-white border border-transparent hover:border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                        <Download className="w-4 h-4 text-gray-400"/>
                                    </Button>
                                    <Button variant="dark" size="sm"
                                            className="h-10 px-4 rounded-xl text-[9px] font-black gap-2 uppercase tracking-widest shadow-lg shadow-brand-dark/10 group-hover:scale-105 transition-all">
                                        Refill
                                        <Send className="w-3.5 h-3.5"/>
                                    </Button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
}
