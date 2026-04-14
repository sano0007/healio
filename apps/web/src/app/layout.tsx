import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth';

export const metadata: Metadata = {
  title: 'Healio — AI-Enabled Smart Healthcare Platform',
  description: 'AI-Powered Healthcare Appointment & Telemedicine Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
