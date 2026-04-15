"use client";

import { ShieldCheck } from "lucide-react";

export default function ConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-brand-black text-white overflow-hidden flex flex-col font-sans select-none">
      {/* 1. Secure Layer Branding */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-black/40 backdrop-blur-xl rounded-full border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Secure End-to-End Encryption</span>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <main className="flex-1 relative flex flex-col min-h-0">
        {children}
      </main>
    </div>
  );
}
