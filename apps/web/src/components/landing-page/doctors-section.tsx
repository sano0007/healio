import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const doctors = [
  {
    name: 'Dr. Michael Siemens',
    specialty: 'Cardiology Specialist',
    image: '/images/doctor-1.png',
  },
  {
    name: 'Dr. Sarah Williams',
    specialty: 'Pediatric Specialist',
    image: '/images/doctor-2.png',
  },
  {
    name: 'Dr. Samuel Chen',
    specialty: 'Orthopedic Surgeon',
    image: '/images/doctor-3.png',
  },
];

export function DoctorsSection() {
  return (
    <section id="find-doctors" className="py-20 lg:py-28 bg-brand-dark">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <span className="text-sm text-brand-light/70 mb-3 block">
              (Our Specialists)
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug mb-4">
              Meet our{' '}
              <em className="font-serif italic font-normal text-brand-light">
                expert doctors
              </em>
            </h2>
            <p className="text-brand-light/60 leading-relaxed mb-8 max-w-md">
              Highly experienced doctors and specialists committed to your
              unique health journey.
            </p>
            <Button variant="light" size="md">
              <ArrowUpRight className="w-4 h-4" />
              See All Specialists
            </Button>
          </div>

          {/* Right – Doctor Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <div key={doc.name} className="doctor-card">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-brand-black text-sm">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {doc.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
