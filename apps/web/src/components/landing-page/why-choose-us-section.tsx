import { TrendingUp, Target, Wifi } from "lucide-react";

const whyChooseFeatures = [
  {
    icon: TrendingUp,
    title: "Your Evolving Care Plan",
    desc: "Dynamic treatment roadmaps that adapt with your progress. Your care plan isn't static—it evolves based on real-time feedback.",
  },
  {
    icon: Target,
    title: "AI-Optimized Accuracy",
    desc: "Our algorithm cross-references data from 50M+ health records to surface the right match. Smart data to surface insights not visible to doctors alone.",
  },
  {
    icon: Wifi,
    title: "Always-On Monitoring",
    desc: "24/7 passive tracking with intelligent alerts for proactive health management. Real-time monitoring that keeps you safe.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-white">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <span className="section-label">(Why Choose Us)</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-black leading-snug mt-2">
              The{" "}
              <em className="font-serif italic font-normal">Right Specialist</em>
              <br />
              Makes All the Difference
            </h2>
          </div>

          {/* Right – Features */}
          <div className="space-y-0 divide-y divide-gray-100">
            {whyChooseFeatures.map((feat, i) => (
              <div key={i} className="py-6 first:pt-0 last:pb-0">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-lightest flex items-center justify-center flex-shrink-0 mt-0.5">
                    <feat.icon className="w-5 h-5 text-brand-dark" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black mb-1.5">{feat.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
