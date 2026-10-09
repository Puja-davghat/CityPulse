'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password, remember);
    setSubmitting(false);

    if (result.ok) {
      router.push(returnTo);
    } else {
      setError(result.error || 'Email or password is incorrect.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Form column */}
        <div className="flex-1 w-full max-w-md">
          <h1 className="text-3xl font-serif mb-2">Log in to CityPulse</h1>
          <p className="text-sm opacity-70 mb-8">
            Access your saved places, trips, and reports.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6 text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-forest border-opacity-20 rounded-md bg-white text-forest focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-opacity-40 focus:border-terracotta"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-forest border-opacity-20 rounded-md bg-white text-forest focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-opacity-40 focus:border-terracotta pr-20"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-forest opacity-60 hover:opacity-100"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 border-forest border-opacity-30 rounded accent-terracotta"
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-terracotta hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-terracotta text-white py-2.5 rounded-md font-medium hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {submitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center opacity-70">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-terracotta font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>

        {/* Welcome column (desktop) */}
        <div className="hidden md:block flex-1">
          <div className="bg-sage bg-opacity-30 p-10 rounded-xl border border-forest border-opacity-10">
            <h2 className="text-2xl font-serif mb-4">Welcome back to CityPulse</h2>
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              Your saved places, trip plans, and local reports are waiting for you.
              Log in to pick up where you left off — or create a new account to start exploring Jaipur.
            </p>
            <div className="bg-sage rounded-lg aspect-video flex items-center justify-center">
              <p className="text-forest opacity-40 font-serif italic text-sm">City illustration</p>
            </div>
            <p className="text-xs opacity-50 mt-4">
              CityPulse is a community-powered guide. Your data stays private — read our{' '}
              <Link href="/privacy" className="underline">Privacy page</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
