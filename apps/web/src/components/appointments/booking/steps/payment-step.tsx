"use client";

import { CreditCard, ShieldCheck, ChevronLeft, Lock, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface PaymentStepProps {
  onComplete: () => void;
  onBack: () => void;
  data: any;
  isLoading?: boolean;
}

export function PaymentStep({ onComplete, onBack, data, isLoading }: PaymentStepProps) {
  const [method, setMethod] = useState<"card" | "insurance">("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBooking = () => {
    setIsProcessing(true);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10"
    >
      {/* 1. Review Info */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-brand-black">Final Review</h2>
        <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-dark shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Patient</div>
                <div className="text-sm font-bold text-brand-black">{data.target === "self" ? "John Doe (You)" : "Family Member"}</div>
              </div>
            </div>
            {data.reason && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-dark shadow-sm shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Reason</div>
                  <div className="text-sm font-medium text-brand-black leading-relaxed line-clamp-2 italic">"{data.reason}"</div>
                </div>
              </div>
            )}
          </div>
          <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100/50 self-start">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verified Booking</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* 2. Payment Method */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-brand-black">Select Payment Method</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMethod("card")}
            className={cn(
              "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group text-left",
              method === "card" ? "bg-white border-brand-dark shadow-lg shadow-brand-dark/10" : "bg-gray-50 border-gray-50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
              method === "card" ? "bg-brand-dark text-white" : "bg-white text-gray-400"
            )}>
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-black">Credit / Debit Card</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Visa, Mastercard</div>
            </div>
          </button>

          <button
            onClick={() => setMethod("insurance")}
            className={cn(
              "flex items-center gap-4 p-5 rounded-2xl border-2 transition-all group text-left",
              method === "insurance" ? "bg-white border-brand-dark shadow-lg shadow-brand-dark/10" : "bg-gray-50 border-gray-50"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
              method === "insurance" ? "bg-brand-dark text-white" : "bg-white text-gray-400"
            )}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-black">Health Insurance</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active policy check</div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Secure Booking CTA */}
      <div className="pt-10 space-y-6">
        <div className="flex items-center gap-2 justify-center text-[11px] text-gray-400 font-bold uppercase tracking-widest px-1 py-1 bg-gray-50 rounded-full mx-auto max-w-fit">
          <Lock className="w-3.5 h-3.5 text-brand-dark opacity-60" />
          Secure 256-bit SSL encrypted payment
        </div>

        <div className="flex items-center justify-between border-t border-gray-50 pt-10">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="h-14 px-8 rounded-2xl text-sm font-bold gap-2 border-brand-light/20"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button 
            variant="dark" 
            onClick={handleBooking}
            className="h-14 px-12 rounded-2xl text-sm font-bold gap-3 shadow-xl shadow-brand-dark/10 flex items-center"
            disabled={isProcessing || isLoading}
          >
            {(isProcessing || isLoading) ? (
              <>
                <motion.div 
                  className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing...
              </>
            ) : (
              <>
                Book & Pay Now
                <CreditCard className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
