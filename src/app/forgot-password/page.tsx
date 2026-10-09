'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process password reset request.');
      }

      setMessage(
        data.message ||
          'If an account exists for this email, password reset instructions have been sent.'
      );
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F0E1] text-[#1E3A2F] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-[#1E3A2F]/15 shadow-md space-y-6">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#B4533A] hover:underline mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
          <h1 className="text-2xl font-serif font-bold text-[#1E3A2F] flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-[#B4533A]" /> Password Recovery
          </h1>
          <p className="text-xs text-[#1E3A2F]/70 mt-1">
            Enter your registered email address below. We will send you a password reset link.
          </p>
        </div>

        {message && (
          <div className="p-4 bg-[#DCE4D2] text-[#1E3A2F] rounded-xl text-xs font-medium flex items-start gap-2 border border-[#1E3A2F]/20">
            <CheckCircle className="w-4 h-4 text-[#1E3A2F] shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-[#FEE2E2] text-[#991B1B] rounded-xl text-xs font-medium border border-[#991B1B]/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1">
              Account Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E3A2F]/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#1E3A2F]/20 rounded-lg text-xs text-[#1E3A2F] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1E3A2F] text-[#F6F0E1] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1E3A2F]/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
