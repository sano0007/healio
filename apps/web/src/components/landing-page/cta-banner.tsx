import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  return (
    <section className="py-20 lg:py-24 bg-brand-dark">
      <div className="section-container text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-snug">
          Ready to Transform Your<br />
          <em className="font-serif italic font-normal text-brand-light">Healthcare Experience?</em>
        </h2>
        <p className="text-brand-light/60 mb-10 max-w-lg mx-auto">
          Join thousands of patients who trust Healio for their healthcare needs. Start your journey today.
        </p>
        <Button variant="light" size="lg" className="inline-flex items-center gap-2">
          Get Started for Free
          <ArrowUpRight className="w-5 h-5" />
        </Button>
      </div>
    </section>
  );
}
