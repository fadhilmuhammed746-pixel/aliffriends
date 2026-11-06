'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUser, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid administrator credentials.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-canvas px-4 py-12 relative overflow-hidden text-ink">
      {/* Subtle organic ambient highlights matching modern editorial luxury */}
      <div className="absolute w-[500px] h-[500px] bg-forest-100/60 rounded-full blur-[140px] pointer-events-none -top-20 -right-20" />
      <div className="absolute w-[500px] h-[500px] bg-coral-50/80 rounded-full blur-[140px] pointer-events-none -bottom-20 -left-20" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Masthead */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Logo variant="dark" size="lg" showTagline={true} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-coral" />
            <span>Editorial Control Portal</span>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted mt-2 font-sans">
            Authorized administrative gateway for Alif Friends 12 digital publications.
          </p>
        </div>

        {/* Secure Login Card */}
        <div className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-8 shadow-card relative">
          <div className="border-b border-editorial-border pb-4 mb-6">
            <h2 className="font-serif text-xl font-bold text-forest tracking-tight">
              Administrator Authentication
            </h2>
            <p className="text-xs text-ink-muted mt-1 font-sans">
              Enter your authorized credentials to access the editorial control room.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-coral-50 border border-coral/30 rounded-xl flex items-center gap-2.5 text-xs text-coral font-medium animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-coral flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-serif text-forest font-bold mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-editorial-border rounded-xl text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Input with Visibility Toggle */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-serif text-forest font-bold mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-11 py-2.5 bg-canvas border border-editorial-border rounded-xl text-sm text-ink placeholder:text-ink-muted/60 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-forest transition-colors rounded"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 bg-forest hover:bg-forest-light active:scale-[0.99] text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-subtle flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-coral-light" />
                  <span>AUTHENTICATING...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>SIGN IN TO CONTROL ROOM</span>
                  <ArrowRight className="w-4 h-4 text-coral-light" />
                </span>
              )}
            </button>
          </form>

          {/* Return link */}
          <div className="mt-6 pt-4 border-t border-editorial-border text-center">
            <Link
              href="/"
              className="text-xs text-ink-muted hover:text-coral transition-colors font-serif font-medium inline-flex items-center gap-1"
            >
              <span>&larr; Return to public publication</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
