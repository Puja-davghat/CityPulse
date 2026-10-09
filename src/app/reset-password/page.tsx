'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 10) {
      setError('Password must be at least 10 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-w-md w-full p-8 rounded-2xl border border-[#1E3A2F]/15 shadow-md space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#1E3A2F] flex items-center gap-2">
          <Lock className="w-6 h-6 text-[#B4533A]" /> Set New Password
        </h1>
        <p className="text-xs text-[#1E3A2F]/70 mt-1">
          Enter your new secure password below (minimum 10 characters).
        </p>
      </div>

      {success && (
        <div className="p-4 bg-[#DCE4D2] text-[#1E3A2F] rounded-xl text-xs font-medium flex items-center gap-2 border border-[#1E3A2F]/20">
          <CheckCircle className="w-4 h-4 text-[#1E3A2F]" /> Password reset successfully! Redirecting to login...
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#FEE2E2] text-[#991B1B] rounded-xl text-xs font-medium flex items-center gap-2 border border-[#991B1B]/20">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1">
            New Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 10 characters"
            className="w-full px-3 py-2.5 bg-white border border-[#1E3A2F]/20 rounded-lg text-xs text-[#1E3A2F] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A2F] mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className="w-full px-3 py-2.5 bg-white border border-[#1E3A2F]/20 rounded-lg text-xs text-[#1E3A2F] focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3 bg-[#1E3A2F] text-[#F6F0E1] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#1E3A2F]/90 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? 'Updating Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F6F0E1] text-[#1E3A2F] flex items-center justify-center p-4">
      <React.Suspense fallback={<div className="p-8">Loading reset form...</div>}>
        <ResetPasswordForm />
      </React.Suspense>
    </div>
  );
}
