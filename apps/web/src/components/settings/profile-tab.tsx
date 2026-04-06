"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Camera, MapPin, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileTab() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-12"
    >
      {/* Avatar Section */}
      <div className="lg:col-span-1 space-y-8">
        <div className="p-10 bg-brand-light/5 rounded-[3rem] border border-brand-light/10 text-center space-y-6 relative overflow-hidden group">
          <div className="relative inline-block">
             <div className="w-40 h-40 rounded-[3rem] bg-white border-2 border-brand-light/20 p-2 shadow-xl shadow-brand-dark/5 transition-transform group-hover:scale-[1.02] duration-500 overflow-hidden">
                <img 
                  src="/images/doctor-1.png" 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-[2.5rem]"
                />
             </div>
             <button className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-brand-dark text-white shadow-xl shadow-brand-dark/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group-hover:rotate-6">
                <Camera className="w-5 h-5" />
             </button>
          </div>
          
          <div className="space-y-1">
             <h3 className="text-xl font-bold text-brand-black">John Doe</h3>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none underline decoration-brand-light underline-offset-4 decoration-2">Premium Member</p>
          </div>
          
          <p className="text-xs text-gray-400 font-medium leading-relaxed px-4">
            Upload a professional photo for better identification within our clinical network.
          </p>

          <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-brand-light/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        </div>

        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6">
           <h4 className="text-[11px] font-black text-brand-black uppercase tracking-[0.2em] px-2">Account Vitals</h4>
           <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100/50 shadow-sm">
                 <div className="w-10 h-10 rounded-xl bg-brand-light/10 flex items-center justify-center text-brand-dark">
                    <Calendar className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Joined Since</p>
                    <p className="text-sm font-bold text-brand-black">December 2025</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100/50 shadow-sm text-emerald-600">
                 <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <User className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Identity Status</p>
                    <p className="text-sm font-bold">Verified</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:col-span-2 space-y-12 pb-20">
         <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
               <h3 className="text-lg font-bold text-brand-black">Personal Information</h3>
               <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Identity Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40" />
                    <Input defaultValue="John Doe" className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light transition-all font-semibold" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40" />
                    <Input defaultValue="john.doe@example.com" className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light transition-all font-semibold" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Primary Mobile No.</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40" />
                    <Input defaultValue="+94 77 123 4567" className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light transition-all font-semibold" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40" />
                    <Input defaultValue="1992-05-15" type="date" className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light transition-all font-semibold" />
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
               <h3 className="text-lg font-bold text-brand-black">Localization & Logistics</h3>
               <div className="h-px flex-1 bg-gradient-to-r from-gray-100 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Living Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40" />
                    <Input defaultValue="No 12, Main Street, Colombo 03" className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light transition-all font-semibold" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Preferred Language</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark opacity-40" />
                    <Input defaultValue="English (US)" className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-brand-light transition-all font-semibold" />
                  </div>
               </div>
            </div>
         </div>
         
         <div className="p-8 bg-brand-light/5 rounded-[2.5rem] border border-dashed border-brand-light/30 flex items-center justify-between">
            <div className="space-y-1">
               <h4 className="text-sm font-bold text-brand-black">Identity Verification Documents</h4>
               <p className="text-[10px] font-medium text-gray-500 italic">Your documents are securely encrypted and only visible to authorized providers.</p>
            </div>
            <Button variant="outline" className="h-11 rounded-xl border-brand-light text-[10px] font-bold uppercase tracking-widest gap-2 bg-white">
               View Documents
            </Button>
         </div>
      </div>
    </motion.div>
  );
}
