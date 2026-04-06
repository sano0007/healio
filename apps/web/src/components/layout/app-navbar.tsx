"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export function AppNavbar() {
  return (
    <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8">
      {/* Mobile Menu Toggle (Placeholder) */}
      <button className="lg:hidden p-2 text-gray-500 hover:text-brand-dark transition-colors">
        <Menu className="w-6 h-6" />
      </button>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2 w-full max-w-sm group focus-within:ring-2 focus-within:ring-brand-dark/10 transition-all">
        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-brand-dark" />
        <input 
          type="text" 
          placeholder="Search for doctors, appointments, or medical records..." 
          className="bg-transparent border-none focus:outline-none text-sm text-gray-600 placeholder:text-gray-400 w-full"
        />
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-4 lg:gap-6">
        <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-brand-dark transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-brand-black group-hover:text-brand-dark transition-colors">John Doe</p>
            <p className="text-[11px] text-gray-400">Patient • Premium Member</p>
          </div>
          <Avatar src="/images/doctor-1.png" className="w-10 h-10 border-2 border-brand-light/30 transition-transform group-hover:scale-105" />
        </div>
      </div>
    </header>
  );
}
