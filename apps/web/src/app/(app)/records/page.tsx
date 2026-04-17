"use client";

import {useState} from "react";
import {RecordsHeader} from "@/components/records/records-header";
import {RecordCard} from "@/components/records/record-card";
import {UploadModal} from "@/components/records/upload-modal";
import {Skeleton} from "@/components/ui/skeleton";
import {AnimatePresence, motion} from "framer-motion";
import {LayoutGrid} from "lucide-react";
import {useRecords} from "@/hooks/use-records";

export default function MedicalRecordsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

    const {data: records, isLoading} = useRecords();

    const filteredRecords = (records ?? []).filter(record => {
    const matchesCategory = activeCategory === "all" || record.type === activeCategory;
        const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 lg:py-12 px-4 space-y-10">
      {/* 1. Header & Quick Actions */}
      <RecordsHeader onUploadClick={() => setIsUploadModalOpen(true)} />

      {/* 2. Interactive Filtering Bar */}
        {/*  <RecordsFilter*/}
        {/*  activeCategory={activeCategory}*/}
        {/*  onCategoryChange={setActiveCategory}*/}
        {/*  searchQuery={searchQuery}*/}
        {/*  onSearchChange={setSearchQuery}*/}
        {/*/>*/}

      {/* 3. Record Grid or Empty State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-50 rounded-[2.5rem] p-6 space-y-4 animate-pulse">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Skeleton className="h-3 w-1/4 rounded-lg" />
                  <Skeleton className="h-8 w-1/3 rounded-xl" />
                </div>
              </div>
            ))
          ) : filteredRecords.length > 0 ? (
            filteredRecords.map((record, i) => (
              <motion.div
                key={record.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <RecordCard {...record} />
              </motion.div>
            ))
          ) : (
              <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                <LayoutGrid className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-black">No records found</h3>
                  <p className="text-xs text-gray-400 font-medium">Try adjusting your filters or upload your first
                      medical record.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Help & Support Overlay */}
      {!isLoading && (
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between border-t border-gray-50 gap-6">
          <p className="text-sm text-gray-400 font-medium text-center md:text-left">
            Can't find a record? Contact your <span className="text-brand-dark font-bold underline cursor-pointer hover:text-brand-light transition-colors">Healthcare Provider</span> or our support team.
          </p>
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-brand-dark transition-all">Verified Clinical Vault</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20" />
          </div>
        </div>
      )}

      {/* 5. Upload Modal */}
        <UploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
