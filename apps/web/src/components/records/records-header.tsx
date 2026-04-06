"use client";

import { Plus, ShieldCheck, Download, Inbox, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RecordsHeader({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-gray-100">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-brand-black tracking-tight">Medical Records Vault</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-100">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Secure Cloud Storage</span>
          </div>
          <p className="text-xs text-gray-400 font-medium italic">
            Last updated: <span className="text-brand-dark font-bold">2 hours ago</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Quick Stats Overlay (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-6 pr-8 border-r border-gray-100">
          <Stat icon={<Inbox className="text-brand-dark" />} label="Total Files" value="24" />
          <Stat icon={<Activity className="text-blue-500" />} label="Avg. Response" value="1.2s" />
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl h-12 px-6 text-xs font-bold gap-2 border-gray-100 hover:bg-gray-50">
             <Download className="w-4 h-4" />
             Export All
           </Button>
           <Button 
            variant="dark" 
            onClick={onUploadClick}
            className="rounded-2xl h-12 px-8 text-xs font-bold gap-2 shadow-xl shadow-brand-dark/10"
           >
             <Plus className="w-4 h-4" />
             Upload New Record
           </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-brand-black">{value}</p>
      </div>
    </div>
  );
}
