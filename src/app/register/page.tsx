'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const passwordStrength = () => {
    if (password.length < 10) return 'Too short';
    if (password.toLowerCase().includes('password')) return 'Too common';
    return 'Good';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const result = await register({ name, email, password, acceptPrivacy });
    setSubmitting(false);

    if (result.ok) {
      router.push('/');
    } else {
      setError(result.error || 'Registration failed.');
      if (result.fields) setFieldErrors(result.fields);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Form */}
        <div className="flex-1 w-full max-w-md">
          <h1 className="text-3xl font-serif mb-2">Create your CityPulse account</h1>
          <p className="text-sm opacity-70 mb-8">
            Join the community to save places, plan trips and share reports.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6 text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-forest border-opacity-20 rounded-md bg-white text-forest focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-opacity-40 focus:border-terracotta"
                required
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-forest border-opacity-20 rounded-md bg-white text-forest focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-opacity-40 focus:border-terracotta"
                required
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-forest border-opacity-20 rounded-md bg-white text-forest focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-opacity-40 focus:border-terracotta pr-20"
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
              <p className="text-xs opacity-70 mt-1">
                Minimum 10 characters, not a common password.
              </p>
              <p className="mt-1 text-xs">
                Strength: <span className="font-medium">{passwordStrength()}</span>
              </p>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 mt-1">{fieldErrors.password[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-forest border-opacity-20 rounded-md bg-white text-forest focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-opacity-40 focus:border-terracotta"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="privacy"
                type="checkbox"
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                className="w-4 h-4 border-forest border-opacity-30 rounded accent-terracotta mr-2"
                required
              />
              <label htmlFor="privacy" className="text-sm">
                I agree to the{' '}
                <Link href="/privacy" className="text-terracotta hover:underline">
                  Privacy notice
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-terracotta text-white py-2.5 rounded-md font-medium hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center opacity-70">
            Already have an account?{' '}
            <Link href="/login" className="text-terracotta font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>

        {/* Illustration column */}
        <div className="hidden md:block flex-1">
          <div className="bg-sage bg-opacity-30 p-10 rounded-xl border border-forest border-opacity-10">
            <h2 className="text-2xl font-serif mb-4">Welcome to Jaipur</h2>
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              Discover hidden gems, taste the best street food, and keep your travel plans safe.
            </p>
            <div className="bg-sage rounded-lg aspect-video flex items-center justify-center">
              <p className="text-forest opacity-40 font-serif italic text-sm">City illustration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
