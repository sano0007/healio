import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-brand-black py-16">
      <div className="section-container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-brand-light/20 border border-brand-light/30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-brand-light" />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight">
                Healio
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              AI-Powered healthcare platform connecting you with the right
              specialists for your unique needs.
            </p>
          </div>

          {/* Links: Platform */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Platform</h4>
            <ul className="space-y-2.5">
              {[
                'Find Doctors',
                'Specialties',
                'AI Matching',
                'Virtual Care',
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-brand-light transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Blog', 'Contact'].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-brand-light transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Legal</h4>
            <ul className="space-y-2.5">
              {[
                'Privacy Policy',
                'Terms of Service',
                'Cookie Policy',
                'HIPAA Compliance',
              ].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-brand-light transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2026 Healio. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Twitter', 'LinkedIn', 'Instagram'].map((s) => (
              <a
                key={s}
                href="#"
                className="text-sm text-gray-600 hover:text-brand-light transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
