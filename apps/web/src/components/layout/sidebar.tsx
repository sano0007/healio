"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {
  Bell,
  Calendar,
  CalendarCheck,
  ClipboardList,
  Clock,
  LayoutDashboard,
  LogOut,
  Pill,
  Search,
  Settings,
  Stethoscope
} from "lucide-react";
import {cn} from "@/lib/utils";
import {useAuth} from "@/contexts/auth";

const patientNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Find Doctors", href: "/doctors", icon: Search },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Medical Records", href: "/records", icon: ClipboardList },
  { name: "Prescriptions", href: "/prescriptions", icon: Pill },
  { name: "AI Symptom Checker", href: "/symptom-checker", icon: Stethoscope },
];

const doctorNavigation = [
  {name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard},
  {name: "My Appointments", href: "/doctor/appointments", icon: CalendarCheck},
  {name: "Availability", href: "/doctor/availability", icon: Clock},
  {name: "Issue Prescriptions", href: "/doctor/prescriptions", icon: Pill},
];

const secondaryNavigation = [
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {user, logout} = useAuth();

  const isDoctor = user?.role === "doctor";
  const navigation = isDoctor ? doctorNavigation : patientNavigation;

  async function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-64 lg:w-72">
      {/* Brand */}
      <div className="flex items-center gap-2.5 h-[72px] px-6 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-brand-light/40 border border-brand-light flex items-center justify-center">
          <div className="w-[10px] h-[10px] rounded-full bg-brand-dark" />
        </div>
        <span className="text-lg font-bold text-brand-black tracking-tight">Healio</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2">Main Menu</div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                      ? "bg-brand-dark text-white shadow-md shadow-brand-dark/10"
                  : "text-gray-500 hover:bg-gray-50 hover:text-brand-dark"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-white" : "text-gray-400 group-hover:text-brand-dark"
              )} />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-6">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2">Other</div>
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    isActive
                        ? "bg-brand-dark text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50 hover:text-brand-dark"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-brand-dark"
                )} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all group"
        >
          <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );
}
