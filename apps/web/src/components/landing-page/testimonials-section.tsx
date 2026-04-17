'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Sarah M.',
    text: "Healio That Saved My Mother's Life",
    desc: "The AI matching connected us with the perfect cardiologist. My mother's condition was diagnosed early, and the care plan was exceptional.",
    rating: 5,
    avatar: 'S',
  },
  {
    name: 'David Lu',
    text: 'They Found What 6 Doctors Missed',
    desc: "After six consultations elsewhere, Healio's specialist identified my condition in the first visit. The AI-driven analysis made all the difference.",
    rating: 5,
    avatar: 'D',
  },
  {
    name: 'Angela R.',
    text: 'My A1C Dropped 3 Points in 90 Days',
    desc: 'The evolving care plan and continuous monitoring helped me manage my diabetes better than ever. I feel like a new person.',
    rating: 5,
    avatar: 'A',
  },
];

export function TestimonialsSection() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="section-label">(Testimonials)</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-black leading-snug mt-2">
              Why 30,000+ Patients
              <br />
              <em className="font-serif italic font-normal">
                choose us every year
              </em>
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setTestimonialIndex(Math.max(0, testimonialIndex - 1))
              }
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-brand-lightest transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() =>
                setTestimonialIndex(
                  Math.min(testimonials.length - 1, testimonialIndex + 1),
                )
              }
              className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center hover:bg-brand-dark/90 transition-colors"
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((test, i) => (
            <div key={i} className="testimonial-card">
              <div className="flex items-center gap-3 mb-4">
                <Avatar fallback={test.avatar} className="w-10 h-10" />
                <div>
                  <p className="font-semibold text-brand-black text-sm">
                    {test.name}
                  </p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: test.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-3 h-3 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-brand-black mb-2">{test.text}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                {test.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
