import { Heart, Brain, Baby, Bone, ArrowUpRight } from 'lucide-react';

const specialties = [
  {
    name: 'Cardiology',
    icon: Heart,
    desc: 'Preventive cardiology and advanced treatment for cardiovascular conditions.',
    tags: [
      'Heart Diseases',
      'Hypertension',
      'ECG Analysis',
      'Cardiac Disorders',
    ],
  },
  {
    name: 'Neurology',
    icon: Brain,
    desc: 'Comprehensive epileptology and advanced diagnostics for neurological conditions.',
    tags: ['Growth Tracking', 'Migraines', 'Renal Disorders', 'Nerve Care'],
  },
  {
    name: 'Pediatrics',
    icon: Baby,
    desc: 'Comprehensive pediatric care and advanced treatment for child development.',
    tags: [
      'Growth Tracking',
      'Immunizations',
      'Child Development',
      'Adolescents',
    ],
  },
  {
    name: 'Orthopedics',
    icon: Bone,
    desc: 'Expert treatment for musculoskeletal injuries and bone conditions.',
    tags: ['Fracture', 'Joint Replacement', 'Arthroscopy', 'Knee Pain'],
  },
];

export function SpecialtiesSection() {
  return (
    <section
      id="specialties"
      className="py-20 lg:py-28 bg-white border-t border-gray-100"
    >
      <div className="section-container">
        <div className="text-center mb-14">
          <span className="section-label">(Category)</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-black mt-2">
            <em className="font-serif italic font-normal">
              Find Your Specialist
            </em>
            <br />
            Precision Care for Every Need
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {specialties.map((spec) => (
            <div key={spec.name} className="specialty-card group">
              <div className="flex justify-between items-start mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-lightest flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-brand-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
              <h3 className="font-bold text-brand-black text-lg mb-2">
                {spec.name}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {spec.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {spec.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-gray-500 bg-gray-50 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
