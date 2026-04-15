"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-brand-black mb-3 font-serif italic text-[2rem] leading-none">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed font-light">
          Join the community and start your journey to better health today.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
          <Input 
            type="text" 
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
          <Input 
            type="email" 
            placeholder="example@healio.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 ml-1 px-1">
            Min. 8 characters with at least one number and special character.
          </p>
        </div>

        <div className="flex items-start gap-2 px-1 mt-6">
          <Checkbox id="terms" className="mt-0.5" />
          <label htmlFor="terms" className="text-xs font-medium text-gray-500 cursor-pointer select-none leading-relaxed">
            By creating an account, I agree to the{" "}
            <Link href="/terms" className="text-brand-dark hover:underline">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="text-brand-dark hover:underline">Privacy Policy</Link>.
          </label>
        </div>

        <Button variant="dark" size="lg" className="w-full mt-6 rounded-xl h-12 shadow-md">
          Create Free Account
        </Button>
      </form>

      <div className="mt-8 text-center border-t border-gray-100 pt-8">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-brand-dark hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
