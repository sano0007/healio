import { HeroSection } from "@/components/landing-page/hero-section";
import { FeatureBar } from "@/components/landing-page/feature-bar";
import { AboutSection } from "@/components/landing-page/about-section";
import { SpecialtiesSection } from "@/components/landing-page/specialties-section";
import { DoctorsSection } from "@/components/landing-page/doctors-section";
import { WhyChooseUsSection } from "@/components/landing-page/why-choose-us-section";
import { FAQSection } from "@/components/landing-page/faq-section";
import { TestimonialsSection } from "@/components/landing-page/testimonials-section";
import { CTABanner } from "@/components/landing-page/cta-banner";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureBar />
      <AboutSection />
      <SpecialtiesSection />
      <DoctorsSection />
      <WhyChooseUsSection />
      <FAQSection />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
}
