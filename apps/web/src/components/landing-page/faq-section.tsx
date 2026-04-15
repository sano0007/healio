"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Q1: How do I know which specialist is right for me?",
    a: "Our matching system considers 3 key factors: Your specific symptoms or health issues, Treatment preferences, accessibility and schedules, Your preferred communication style.",
  },
  {
    q: "Q2: What happens after I book my first appointment?",
    a: "After booking, you'll receive a confirmation email with all the details. Your doctor will review your medical history before the appointment to provide personalized care from the first visit.",
  },
  {
    q: "Q3: How does your AI monitoring improve?",
    a: "Our AI continuously learns from millions of health data points, refining its accuracy and recommendations over time to provide better diagnosis support and treatment suggestions.",
  },
  {
    q: "Q4: Will I know costs before treatment?",
    a: "Yes, we provide full cost transparency before any treatment begins. You'll see a detailed breakdown of all expenses, insurance coverage, and any out-of-pocket costs upfront.",
  },
  {
    q: "Q5: How do you respond in emergency care?",
    a: "Our 24/7 virtual care team is equipped to handle emergencies with immediate triage. For critical situations, we coordinate with local emergency services to ensure rapid response.",
  },
];

export function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28 bg-brand-offwhite">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left – Questions */}
          <div>
            <span className="section-label">(FAQs)</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-black leading-snug mt-2 mb-10">
              Smart Care Starts with<br />
              <em className="font-serif italic font-normal">Good Information</em>
            </h2>

            <div className="space-y-0">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="faq-item cursor-pointer"
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                >
                  <div className="flex justify-between items-center gap-4">
                    <h3 className="font-medium text-brand-black text-sm sm:text-base">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                        openFAQ === i ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFAQ === i ? "max-h-40 mt-3" : "max-h-0"
                    }`}
                  >
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Info Card */}
          <div className="flex items-start justify-center lg:justify-end">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-sm">
              <div className="w-12 h-12 rounded-2xl bg-brand-lightest flex items-center justify-center mb-6">
                <Search className="w-5 h-5 text-brand-dark" />
              </div>
              <h3 className="font-bold text-brand-black text-lg mb-3">
                How do I know which specialist is right for me?
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Our matching system considers 3 key factors:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-500">
                  <ChevronRight className="w-4 h-4 text-brand-dark mt-0.5 flex-shrink-0" />
                  Your specific symptoms or health issues
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-500">
                  <ChevronRight className="w-4 h-4 text-brand-dark mt-0.5 flex-shrink-0" />
                  Treatment preferences, accessibility and schedules
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-500">
                  <ChevronRight className="w-4 h-4 text-brand-dark mt-0.5 flex-shrink-0" />
                  Your preferred communication style
                </li>
              </ul>
              <Button variant="primary" size="md" className="w-full justify-center">
                <Phone className="w-4 h-4" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
