'use client';

import { GraduationCap, Briefcase, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
}

export interface DoctorDetailsProps {
  bio: string;
  specialties: string[];
  education: TimelineItem[];
  experience: TimelineItem[];
}

export function DoctorDetails({
  bio,
  specialties,
  education,
  experience,
}: DoctorDetailsProps) {
  return (
    <div className="space-y-12 bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
      {/* 1. About Me */}
      <section>
        <h2 className="text-xl font-bold text-brand-black mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-dark" />
          About Me
        </h2>
        <p className="text-gray-500 leading-relaxed font-medium">{bio}</p>
      </section>

      {/* 2. Specialties */}
      <section>
        <h2 className="text-xl font-bold text-brand-black mb-4">
          Specialties & Expertise
        </h2>
        <div className="flex flex-wrap gap-2">
          {specialties.map((spec) => (
            <div
              key={spec}
              className="px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-500 border border-transparent hover:border-brand-light/20 hover:text-brand-dark transition-all"
            >
              {spec}
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        {/* 3. Education Timeline */}
        <section>
          <h2 className="text-xl font-bold text-brand-black mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-dark" />
            Education
          </h2>
          <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {education.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="pl-8 relative"
              >
                <div className="absolute left-0 top-1.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-brand-light flex items-center justify-center p-0.5">
                  <div className="w-full h-full rounded-full bg-brand-light" />
                </div>
                <div className="text-[11px] font-bold text-brand-dark uppercase tracking-widest mb-1">
                  {item.year}
                </div>
                <h4 className="text-sm font-bold text-brand-black mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  {item.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Experience Timeline */}
        <section>
          <h2 className="text-xl font-bold text-brand-black mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-dark" />
            Work experience
          </h2>
          <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {experience.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="pl-8 relative"
              >
                <div className="absolute left-0 top-1.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center p-0.5">
                  <div className="w-full h-full rounded-full bg-emerald-500" />
                </div>
                <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                  {item.year}
                </div>
                <h4 className="text-sm font-bold text-brand-black mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  {item.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
