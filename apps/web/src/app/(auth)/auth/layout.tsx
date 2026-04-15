"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Main Container Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1100px] bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[680px]"
      >
        {/* Left Panel: Wavy Liquid Image */}
        <div className="relative w-full md:w-1/2 bg-[#0D0D0D] overflow-hidden p-8 flex flex-col justify-between group">
          <Image
            src="/images/auth-liquid-bg.png"
            alt="Medical Abstract Flow"
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[10s] ease-linear"
            priority
          />
          
          {/* Overlay Quote / Content */}
          <div className="relative z-10">
            <span className="text-[11px] font-medium tracking-[0.2em] text-white/50 uppercase">Healio Wisdom</span>
            <div className="h-[1px] w-12 bg-white/30 my-3" />
          </div>

          <div className="relative z-10 max-w-sm">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-snug">
              Precision Care,<br />
              <em className="font-serif italic font-normal text-brand-light">Simplified For You.</em>
            </h2>
            <p className="text-sm text-white/60 leading-relaxed font-light">
              Experience the future of healthcare where technology meets human expert empathy. Your health journey begins here.
            </p>
          </div>
        </div>

        {/* Right Panel: Auth Form */}
        <div className="w-full md:w-1/2 bg-white p-8 lg:p-12 flex flex-col items-center">
          {/* Brand Logo */}
          <Link href="/" className="mb-12 self-start flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-brand-light/40 border border-brand-light flex items-center justify-center">
              <div className="w-[10px] h-[10px] rounded-full bg-brand-dark" />
            </div>
            <span className="text-lg font-bold text-brand-black tracking-tight">Healio</span>
          </Link>

          {/* Form Content Wrapper */}
          <div className="w-full max-w-[360px] flex-1 flex flex-col justify-center">
            {children}
          </div>

          {/* Bottom Footer Quote / Info */}
          <p className="text-[12px] text-gray-400 mt-8 text-center">
            Secured by Healio Identity Protection
          </p>
        </div>
      </motion.div>
    </div>
  );
}
