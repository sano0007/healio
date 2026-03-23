'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth';
import { Activity, LogOut, User, Calendar, Stethoscope, Video } from 'lucide-react';

export function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold text-gray-900">Healio</span>
          </Link>

          <div className="flex items-center gap-6">
            {user?.role === 'patient' && (
              <>
                <Link href="/doctors" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 transition-colors">
                  <Stethoscope className="h-4 w-4" />
                  Doctors
                </Link>
                <Link href="/appointments" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 transition-colors">
                  <Calendar className="h-4 w-4" />
                  Appointments
                </Link>
                <Link href="/sessions" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 transition-colors">
                  <Video className="h-4 w-4" />
                  Sessions
                </Link>
              </>
            )}
            {user?.role === 'doctor' && (
              <>
                <Link href="/appointments" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 transition-colors">
                  <Calendar className="h-4 w-4" />
                  Appointments
                </Link>
                <Link href="/sessions" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 transition-colors">
                  <Video className="h-4 w-4" />
                  Sessions
                </Link>
              </>
            )}
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 transition-colors">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
