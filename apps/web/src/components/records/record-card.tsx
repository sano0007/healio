"use client";

import {
  Calendar,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Microscope,
  MoreVertical,
  Pill,
  ShieldCheck,
  User
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {motion} from "framer-motion";

export type RecordType = "lab" | "imaging" | "prescription" | "note";

interface RecordCardProps {
  id: string;
  title: string;
  type: RecordType;
  date: string;
  doctor: string;
  status: "verified" | "pending";
  size: string;
  url?: string;
}

const typeConfig = {
  lab: { icon: <Microscope />, label: "Lab Report", color: "text-blue-600 bg-blue-50 border-blue-100" },
  imaging: { icon: <ImageIcon />, label: "Imaging/Scan", color: "text-purple-600 bg-purple-50 border-purple-100" },
  prescription: { icon: <Pill />, label: "Prescription", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  note: { icon: <FileText />, label: "Clinical Note", color: "text-amber-600 bg-amber-50 border-amber-100" },
};

export function RecordCard({title, type, date, doctor, status, size, url}: RecordCardProps) {
  const config = typeConfig[type];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:border-brand-light/30 h-full flex flex-col"
    >
      {/* 1. Card Header (Type & Actions) */}
      <div className="flex items-start justify-between mb-6">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors group-hover:scale-110", config.color)}>
          {config.icon}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="flex-1 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border", config.color)}>
              {config.label}
            </span>
            {status === "verified" && (
              <div className="flex items-center gap-1 text-emerald-500">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Verified</span>
              </div>
            )}
          </div>
          <h3 className="text-sm font-bold text-brand-black leading-tight group-hover:text-brand-dark transition-colors truncate">
            {title}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Issue Date
            </p>
            <p className="text-xs font-bold text-brand-black">{date}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-3 h-3" />
              Doctor
            </p>
            <p className="text-xs font-bold text-brand-black truncate">{doctor}</p>
          </div>
        </div>
      </div>

      {/* 3. Footer Actions */}
      <div className="pt-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{size}</span>
        <div className="flex items-center gap-2">
          {url ? (
              <>
                <Button variant="outline" size="sm"
                        className="h-8 rounded-xl px-3 text-[10px] font-bold gap-1.5 border-gray-100 hover:bg-gray-50">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5"/>
                    Preview
                  </a>
                </Button>
                <Button variant="dark" size="sm" className="h-8 w-8 rounded-xl p-0 flex items-center justify-center">
                  <a href={url} download={title} className="flex items-center justify-center w-full h-full">
                    <Download className="w-3.5 h-3.5"/>
                  </a>
                </Button>
              </>
          ) : (
              <>
                <Button variant="outline" size="sm" disabled
                        className="h-8 rounded-xl px-3 text-[10px] font-bold gap-1.5 border-gray-100">
                  <Eye className="w-3.5 h-3.5"/>
                  Preview
                </Button>
                <Button variant="dark" size="sm" disabled
                        className="h-8 w-8 rounded-xl p-0 flex items-center justify-center">
                  <Download className="w-3.5 h-3.5"/>
                </Button>
              </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
