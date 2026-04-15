import Image from "next/image";
import { Search, ArrowUpRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="hero-gradient pt-12 pb-0 lg:pt-16 relative overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-8 items-end">
          {/* Left Content */}
          <div className="pb-12 lg:pb-20">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold leading-[1.1] text-brand-black mb-5">
              Your Health<br />
              Deserves the{" "}
              <em className="font-serif italic font-normal text-brand-dark">
                right<br className="hidden sm:block" />specialist
              </em>
            </h1>
            <p className="text-gray-500 text-base lg:text-lg mb-8 max-w-md leading-relaxed">
              Connect with top rated doctors who listen and prioritize your health journey
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">
                <Search className="w-4 h-4" />
                Find a Doctor
              </Button>
              <Button variant="outline">
                <ArrowUpRight className="w-4 h-4" />
                How it Works
              </Button>
            </div>
          </div>

          {/* Right – Hero Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <Image
                src="/images/Hero Doctor.png"
                alt="Professional Doctor"
                width={600}
                height={700}
                className="object-contain object-bottom w-full h-auto drop-shadow-2xl"
                priority
              />

              {/* Floating Card – Medical History */}
              <div className="floating-card absolute top-8 -right-4 lg:right-0 xl:-right-8 max-w-[220px] animate-float hidden sm:flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-gray-600 leading-snug">
                  <span className="font-semibold text-brand-black">Your full medical history</span> available to every clinician
                </p>
              </div>

              {/* Floating Card – Join Millions */}
              <div className="floating-card absolute top-1/2 -translate-y-1/2 -left-6 lg:-left-16 max-w-[260px] animate-float-delayed hidden md:block">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-brand-light border-2 border-white overflow-hidden">
                      <Image src="/images/doctor-1.png" alt="" width={28} height={28} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-brand-lighter border-2 border-white overflow-hidden">
                      <Image src="/images/doctor-2.png" alt="" width={28} height={28} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-brand-dark text-white px-2 py-0.5 rounded-full">30M+</span>
                </div>
                <p className="text-xs text-gray-600 leading-snug">
                  Join millions who found the right doctor for their unique health needs.
                </p>
              </div>

              {/* Floating Card – 24/7 Care */}
              <div className="floating-card absolute bottom-16 -right-4 lg:right-0 xl:-right-6 max-w-[240px] animate-float-slow hidden sm:flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src="/images/consultation.png" alt="" width={48} height={48} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-black">24/7 Virtual Care Team at Your Service</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Board certified doctors available anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Bar Placeholder */}
        {/* We'll keep the bar in its own component but it's part of the Hero background container usually */}
      </div>
    </section>
  );
}
