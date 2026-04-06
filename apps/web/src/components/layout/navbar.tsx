"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = ["Find Doctors", "Specialties", "Services", "About Us", "Resources"];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="section-container">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-light/40 border border-brand-light flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-brand-dark" />
            </div>
            <span className="text-lg font-semibold text-brand-black tracking-tight">Healio</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                className="text-sm text-gray-600 hover:text-brand-dark transition-colors font-medium"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" className="hidden sm:inline-flex">
              <Phone className="w-4 h-4" />
              Contact Us
            </Button>
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 border-t border-gray-100 pt-4">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                className="block py-3 text-gray-600 hover:text-brand-dark font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <Button variant="primary" size="sm" className="mt-4 sm:hidden w-full">
              <Phone className="w-4 h-4" />
              Contact Us
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
