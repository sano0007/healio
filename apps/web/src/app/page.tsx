import Link from 'next/link';
import { Activity, Brain, Calendar, Heart, Shield, Video } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold">Healio</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-6">
          <Brain className="h-4 w-4" />
          AI-Enabled Healthcare Platform
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Your health, managed <br />
          <span className="text-teal-600">intelligently</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Book appointments, consult doctors via video, and manage your
          healthcare journey - all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register?role=patient"
            className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors text-lg"
          >
            Book as Patient
          </Link>
          <Link
            href="/register?role=doctor"
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-teal-600 hover:text-teal-600 transition-colors text-lg"
          >
            Join as Doctor
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Smart Appointments',
                desc: 'Book appointments with verified doctors in seconds, with real-time availability.',
              },
              {
                icon: Video,
                title: 'Video Consultations',
                desc: 'Consult your doctor from home via secure HD video sessions powered by Jitsi.',
              },
              {
                icon: Heart,
                title: 'Health Records',
                desc: 'Access prescriptions, appointment history, and health data in one secure place.',
              },
              {
                icon: Brain,
                title: 'AI Symptom Check',
                desc: 'Describe your symptoms and get intelligent guidance on which specialist to see.',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                desc: 'JWT-based authentication and encrypted communications keep your data safe.',
              },
              {
                icon: Activity,
                title: 'Microservices Architecture',
                desc: 'Built on distributed services for high availability and fault tolerance.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-teal-500" />
            <span>Healio - SE3020 Distributed Systems</span>
          </div>
          <span>SLIIT · 2026</span>
        </div>
      </footer>
    </div>
  );
}
