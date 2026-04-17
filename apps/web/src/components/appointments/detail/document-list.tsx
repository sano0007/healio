'use client';

import {
  FileBox,
  Download,
  X,
  Eye,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Document {
  name: string;
  size: string;
  type: 'pdf' | 'jpg' | 'png';
}

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-dark">
          <FileBox className="w-5 h-5" />
        </div>
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Consultation Documents
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, i) => (
          <div
            key={i}
            className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-brand-light/30 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-dark shrink-0 group-hover:bg-brand-light/10 transition-colors">
                {doc.type === 'pdf' ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-[12px] font-bold text-brand-black truncate">
                  {doc.name}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                  {doc.size}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-brand-dark hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-brand-dark hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <button className="p-4 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/10 flex items-center justify-center gap-2 text-gray-400 hover:border-brand-light/20 hover:bg-brand-light/5 transition-all group">
          <span className="text-[11px] font-bold uppercase tracking-widest group-hover:text-brand-dark">
            Upload More
          </span>
        </button>
      </div>
    </div>
  );
}
