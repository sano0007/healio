"use client";

import { motion } from "framer-motion";
import { CreditCard, Lock, ShieldCheck, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CheckoutFormProps {
  onPay: () => void;
  status: "idle" | "processing" | "success" | "error";
  total: number;
}

export function CheckoutForm({ onPay, status, total }: CheckoutFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-2xl bg-brand-dark/10 flex items-center justify-center text-brand-dark border border-brand-light/20">
              <CreditCard className="w-5 h-5" />
           </div>
           <div className="flex flex-col">
              <h2 className="text-xl font-bold text-brand-black tracking-tight">Credit or Debit Card</h2>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none">Enter your highly secure payment information</p>
           </div>
        </div>

        {/* 1. Stripe Elements Simulation */}
        <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm space-y-4 group-hover:border-brand-light/40 transition-all">
           <div className="relative group">
              <Input 
                placeholder="Card Number" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 pr-10 text-xs font-bold focus:bg-white transition-all pl-12"
              />
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <Input 
                placeholder="MM / YY" 
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 text-xs font-bold focus:bg-white transition-all"
              />
              <div className="relative">
                 <Input 
                   placeholder="CVC" 
                   value={cvc}
                   onChange={(e) => setCvc(e.target.value)}
                   className="h-14 rounded-2xl bg-gray-50/50 border-gray-100 text-xs font-bold focus:bg-white transition-all"
                 />
                 <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* State Information */}
        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
           <div className="flex items-center gap-3 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest">Digital Encryption</span>
                 <span className="text-[8px] font-bold opacity-80">SSL Secured (256-bit AES)</span>
              </div>
           </div>
           <p className="text-[10px] font-bold text-emerald-800 italic">Trusted by 10k+ Customers</p>
        </div>

        {/* 2. Action Button */}
        <Button 
          onClick={onPay}
          disabled={status === "processing" || status === "success"}
          variant="dark" 
          className="w-full h-16 rounded-[1.5rem] bg-brand-dark text-white text-xs font-black uppercase tracking-widest gap-3 shadow-2xl shadow-brand-dark/20 group hover:shadow-brand-dark/40 active:scale-[0.98] transition-all"
        >
          {status === "processing" ? (
             <div className="flex items-center gap-3">
                <Spinner />
                <span>Processing Securely...</span>
             </div>
          ) : status === "success" ? (
            <div className="flex items-center gap-3">
               <CheckCircle2 className="w-5 h-5 text-emerald-400" />
               <span>Payment Successful</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full px-4">
               <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-brand-light brightness-150" />
                  <span>Authorize Payment</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-white/50 tracking-tighter opacity-70">${total.toFixed(2)}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </div>
            </div>
          )}
        </Button>

        {/* Alternative Button */}
        <div className="pt-4 border-t border-gray-100 flex flex-col items-center gap-4">
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Alternative Checkout</p>
           <div className="flex gap-4 w-full">
              <button className="flex-1 h-12 rounded-xl border border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
              </button>
              <button className="flex-1 h-12 rounded-xl border border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/1200px-Apple_Pay_logo.svg.png" className="h-5" alt="Apple Pay" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  );
}
