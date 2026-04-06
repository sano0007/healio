import Image from "next/image";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export function AboutSection() {
  return (
    <section id="about-us" className="py-20 lg:py-28 bg-white">
      <div className="section-container">
        <span className="section-label">(About us)</span>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mt-2">
          {/* Left */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-brand-black leading-snug mb-10">
              Our dedicated medical team highly experienced doctors and specialists committed to
              your unique health journey. Experience healthcare made effortless with our patient
              first approach.
            </h2>

            <div className="mt-10">
              <p className="text-sm font-semibold text-brand-black mb-3">Join the Healio Community</p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["/images/doctor-1.png", "/images/doctor-2.png", "/images/doctor-3.png"].map((src, i) => (
                    <Avatar key={i} src={src} className="w-9 h-9" />
                  ))}
                  <div className="w-9 h-9 rounded-full bg-brand-light border-2 border-white flex items-center justify-center text-xs font-bold text-brand-dark">
                    +
                  </div>
                </div>
                <Button variant="primary" size="sm">
                  <Users className="w-4 h-4" />
                  Join Membership
                </Button>
              </div>
            </div>
          </div>

          {/* Right – Stats Bento Grid */}
          <div className="grid grid-cols-5 grid-rows-2 gap-3.5">
            {/* 5k+ — top-left */}
            <div className="col-span-3 rounded-2xl bg-brand-lightest p-6 flex flex-col justify-between min-h-[160px]">
              <span className="text-5xl sm:text-6xl font-bold text-brand-dark tracking-tight leading-none">5k+</span>
              <p className="text-sm text-gray-500 mt-4">Expert Medical Professionals</p>
            </div>

            {/* Image — top-right */}
            <div className="col-span-2 rounded-2xl overflow-hidden min-h-[160px]">
              <Image
                src="/images/consultation.png"
                alt="Doctor Consultation"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 100% — bottom-left (dark teal) */}
            <div className="col-span-3 rounded-2xl bg-brand-dark p-6 flex flex-col justify-between min-h-[140px]">
              <span className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-none">100%</span>
              <p className="text-sm text-white/60 mt-4">Quality Commitment</p>
            </div>

            {/* 12+ — bottom-right (near-black) */}
            <div className="col-span-2 rounded-2xl bg-brand-black p-6 flex flex-col justify-between min-h-[140px]">
              <span className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-none">12+</span>
              <p className="text-sm text-white/50 mt-4">Years of Trust</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
