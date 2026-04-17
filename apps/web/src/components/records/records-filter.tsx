'use client';

import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', label: 'All Records' },
  { id: 'lab', label: 'Lab Reports' },
  { id: 'imaging', label: 'Imaging' },
  { id: 'prescription', label: 'Prescriptions' },
  { id: 'note', label: 'Clinical Notes' },
];

interface RecordsFilterProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function RecordsFilter({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: RecordsFilterProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* 1. Category Tabs */}
        <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 relative overflow-hidden">
          <AnimatePresence>
            <motion.div
              layoutId="category-background"
              className="absolute inset-y-1.5 bg-white rounded-xl shadow-sm z-0"
              initial={false}
              animate={{
                x:
                  categories.findIndex((c) => c.id === activeCategory) * 100 +
                  '%',
                width: 100 / categories.length + '%',
              }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          </AnimatePresence>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'relative z-10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors',
                activeCategory === category.id
                  ? 'text-brand-dark'
                  : 'text-gray-400 hover:text-gray-600',
              )}
              style={{ width: 100 / categories.length + '%' }}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* 2. Search & View Actions */}
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-dark transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search records, doctors, or hospitals..."
              className="w-full h-12 bg-white rounded-2xl border border-gray-100 pl-11 pr-4 text-xs font-medium focus:outline-none focus:border-brand-light/30 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center bg-white rounded-2xl border border-gray-100 p-1 shadow-sm">
            <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-dark transition-colors">
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal AnimatePresence helper if not imported
import { AnimatePresence } from 'framer-motion';
