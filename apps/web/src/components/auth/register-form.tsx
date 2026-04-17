'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setIsLoading(false);
      return;
    }

    try {
      await register(name, email, password, 'patient', phone || undefined);
      router.push('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-brand-black mb-3 font-serif italic text-[2rem] leading-none">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed font-light">
          Join the community and start your journey to better health today.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Full Name
          </label>
          <Input
            name="name"
            type="text"
            placeholder="John Doe"
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Email Address
          </label>
          <Input
            name="email"
            type="email"
            placeholder="example@healio.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Phone Number (Optional)
          </label>
          <Input
            name="phone"
            type="tel"
            placeholder="+1 234 567 8900"
            autoComplete="tel"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Password
          </label>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1 ml-1 px-1">
            Min. 8 characters with at least one number and special character.
          </p>
        </div>

        <div className="flex items-start gap-2 px-1 mt-6">
          <Checkbox id="terms" required className="mt-0.5" />
          <label
            htmlFor="terms"
            className="text-xs font-medium text-gray-500 cursor-pointer select-none leading-relaxed"
          >
            By creating an account, I agree to the{' '}
            <Link href="/terms" className="text-brand-dark hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-brand-dark hover:underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <Button
          type="submit"
          variant="dark"
          size="lg"
          className="w-full mt-6 rounded-xl h-12 shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create Free Account'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center border-t border-gray-100 pt-8">
        <p className="text-sm text-gray-500">
          Are you a doctor?{' '}
          <Link
            href="/auth/register/doctor"
            className="font-bold text-brand-dark hover:underline"
          >
            Register here
          </Link>
        </p>
        <p className="text-sm text-gray-500 mt-3">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-bold text-brand-dark hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
