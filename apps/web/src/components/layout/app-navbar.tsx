'use client';

import { Menu, Search } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth';

export function AppNavbar() {
  const { user } = useAuth();

  const roleLabel =
    user?.role === 'doctor'
      ? 'Doctor'
      : user?.role === 'admin'
        ? 'Administrator'
        : 'Patient';

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
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-brand-black group-hover:text-brand-dark transition-colors">
              {user?.name || 'Guest'}
            </p>
            <p className="text-[11px] text-gray-400">{roleLabel}</p>
          </div>
          <Avatar
            src="/images/doctor-1.png"
            className="w-10 h-10 border-2 border-brand-light/30 transition-transform group-hover:scale-105"
          />
        </div>
      </div>
    </header>
  );
}
