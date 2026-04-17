'use client';

import { Home, ChevronRight, Save, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface SettingsHeaderProps {
  completionPercentage: number;
  onSave: () => void;
  onDiscard: () => void;
  isDirty: boolean;
}

export function SettingsHeader({
  completionPercentage,
  onSave,
  onDiscard,
  isDirty,
}: SettingsHeaderProps) {
  return (
    <div className="mb-12 flex flex-col md:flex-row justify-between md:items-end gap-8">
      <div className="space-y-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
          <Home className="w-3.5 h-3.5 opacity-70" />
          <Link
            href="/dashboard"
            className="hover:text-brand-dark transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 opacity-50" />
          <span className="text-brand-dark">Account Settings</span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-brand-black tracking-tight">
            Profile & Preferences
          </h1>
          <p className="text-sm text-gray-400 font-medium italic">
            Manage your digital identity, security protocols, and clinical
            metadata.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-10">
        {/* Profile Completion Badge */}
        <div className="text-right space-y-1">
          <span className="text-[10px] font-black text-brand-black uppercase tracking-[0.2em] block pr-1">
            Completion
          </span>
          <div className="flex items-center justify-end gap-2 text-brand-dark font-bold text-3xl tracking-tighter">
            <div className="w-2.5 h-2.5 bg-brand-light rounded-full" />
            {completionPercentage}%
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onDiscard}
            variant="outline"
            disabled={!isDirty}
            className="h-12 rounded-2xl border-gray-100 text-[10px] font-bold uppercase tracking-widest gap-2 px-6 hover:bg-white hover:border-red-200 hover:text-red-500 disabled:opacity-30 transition-all active:scale-[0.98] shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Discard
          </Button>
          <Button
            onClick={onSave}
            variant="dark"
            disabled={!isDirty}
            className="h-12 rounded-2xl text-[10px] font-bold uppercase tracking-widest gap-2 px-8 shadow-xl shadow-brand-dark/10 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
