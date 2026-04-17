"use client";

import {useMemo, useState} from "react";
import {NotificationListItem, type NotificationType} from "@/components/notifications/notification-list-item";
import {type FilterType, NotificationFilters} from "@/components/notifications/notification-filters";
import {AnimatePresence, motion} from "framer-motion";
import {Bell, CheckCheck, ChevronRight, Home, Info, Search, Settings} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link: string;
  group: "today" | "yesterday" | "older";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "consultation",
    title: "Video Consultation Starting",
    description: "Your session with Dr. Sarah Johnson starts in 5 minutes. Please join the room.",
    timestamp: "5 mins ago",
    isRead: false,
    link: "/consultations/HL-98231-V",
    group: "today"
  },
  {
    id: "2",
    type: "prescription",
    title: "New Prescription Issued",
    description: "Dr. Robert Garcia has issued a new prescription for 'Amlodipine Besylate'.",
    timestamp: "2 hours ago",
    isRead: false,
    link: "/prescriptions",
    group: "today"
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Successfully Processed",
    description: "Your payment of $150.00 for appointment HL-88291-A has been confirmed.",
    timestamp: "Yesterday, 04:30 PM",
    isRead: true,
    link: "/appointments",
    group: "yesterday"
  },
  {
    id: "4",
    type: "appointment",
    title: "Appointment Cancellation",
    description: "Your follow-up with Dr. Linda Taylor has been cancelled by the provider.",
    timestamp: "2 days ago",
    isRead: true,
    link: "/appointments",
    group: "older"
  },
  {
    id: "5",
    type: "verification",
    title: "Identity Verified",
    description: "Your account credentials have been successfully verified for clinical access.",
    timestamp: "3 days ago",
    isRead: true,
    link: "/settings",
    group: "older"
  }
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "appointments") return notifications.filter(n => n.type === "appointment" || n.type === "consultation");
    if (activeFilter === "payments") return notifications.filter(n => n.type === "payment");
    if (activeFilter === "medical") return notifications.filter(n => n.type === "prescription" || n.type === "verification");
    return notifications;
  }, [activeFilter, notifications]);

  const counts: Record<FilterType, number> = {
    all: notifications.filter(n => !n.isRead).length,
    appointments: notifications.filter(n => !n.isRead && (n.type === "appointment" || n.type === "consultation")).length,
    payments: notifications.filter(n => !n.isRead && n.type === "payment").length,
    medical: notifications.filter(n => !n.isRead && (n.type === "prescription" || n.type === "verification")).length,
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* 1. Header & Navigation */}
      <div className="mb-12 flex flex-col md:flex-row justify-between md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
            <Home className="w-3.5 h-3.5 opacity-70" />
            <Link href="/dashboard" className="hover:text-brand-dark transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className="text-brand-dark">Clinical Alerts</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-brand-black tracking-tight">Notification Center</h1>
            <p className="text-sm text-gray-400 font-medium italic">Manage your account alerts, clinical updates, and system notifications.</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
           {counts.all > 0 && (
             <div className="text-right space-y-1">
               <span className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] block pr-1">Pending Updates</span>
               <div className="flex items-center justify-end gap-2 text-emerald-500 font-bold text-3xl tracking-tighter">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  {counts.all}
               </div>
             </div>
           )}

           <div className="flex items-center gap-3">
               <Button
                onClick={markAllAsRead}
                variant="outline"
                className="h-12 rounded-2xl border-gray-100 text-[10px] font-bold uppercase tracking-widest gap-2 px-6 hover:bg-white hover:border-brand-dark/30 transition-all active:scale-[0.98] shadow-sm"
              >
                 <CheckCheck className="w-4 h-4" />
                 Mark all as read
              </Button>
              <button className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-dark transition-colors bg-white shadow-sm hover:shadow-md transition-all">
                 <Settings className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* 2. Categorization Sidebar (Filter Pills) */}
        <div className="lg:col-span-1 space-y-8">
           <div className="space-y-4">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-6">Categorize Alerts</h3>
              <NotificationFilters activeFilter={activeFilter} onChange={setActiveFilter} counts={counts} />
           </div>

           {/* Quick Search placeholder */}
           <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6 relative overflow-hidden group">
              <div className="relative z-10 space-y-2">
                 <Search className="w-5 h-5 text-brand-dark mb-2" />
                 <h4 className="text-sm font-bold text-brand-black">Search Alerts</h4>
                 <p className="text-[10px] font-medium text-gray-400 italic leading-relaxed pr-8">Locate specific updates from the history.</p>
              </div>
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-brand-light/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
           </div>
        </div>

        {/* 3. Chronological Notification Feed */}
        <div className="lg:col-span-3 space-y-12">
           <AnimatePresence mode="popLayout" initial={false}>
              {filteredNotifications.length > 0 ? (
                ["today", "yesterday", "older"].map((group) => {
                  const groupItems = filteredNotifications.filter(n => n.group === group);
                  if (groupItems.length === 0) return null;

                  return (
                      <motion.div
                      key={group}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4 px-4 overflow-hidden">
                         <h3 className="text-[11px] font-black text-brand-dark uppercase tracking-widest shrink-0">{group}</h3>
                         <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />
                      </div>

                          <div className="space-y-4">
                         {groupItems.map((notification) => (
                             <NotificationListItem
                             key={notification.id}
                             {...notification}
                           />
                         ))}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                  <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-32 space-y-6 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200 text-center"
                >
                   <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-gray-300 shadow-sm">
                      <Bell className="w-10 h-10 opacity-40" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-lg font-bold text-brand-black tracking-tight">No Alerts Found</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-10">We couldn't find any notifications matching this filter.</p>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

      {/* 4. Help Section Footer */}
      <div className="pt-12 border-t border-gray-50 flex items-center justify-between opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
         <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">
              You can manage your real-time notification push preferences in **Account Settings & Security**.
            </p>
         </div>
         <p className="text-[9px] font-black text-brand-black uppercase tracking-widest pr-4 border-r border-gray-200">
            Powered by Healio Notification Engine v2.0
         </p>
      </div>
    </div>
  );
}
