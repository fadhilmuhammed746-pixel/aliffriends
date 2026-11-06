'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('alif12');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
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
      {/* Subtle organic ambient highlights */}
      <div className="absolute w-[500px] h-[500px] bg-forest-100/60 rounded-full blur-[140px] pointer-events-none -top-20 -right-20" />
      <div className="absolute w-[500px] h-[500px] bg-coral-50/80 rounded-full blur-[140px] pointer-events-none -bottom-20 -left-20" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Logo variant="dark" size="lg" showTagline={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-coral" />
            <span>Editorial CMS Portal</span>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted mt-3 font-sans">
            Secure administrative control room for Alif Friends 12 digital publications.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-editorial-border rounded-2xl p-8 shadow-card relative">
          <div className="border-b border-editorial-border pb-4 mb-6">
            <h2 className="font-serif text-xl font-bold text-forest tracking-tight">
              Administrator Authentication
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Configured credentials: <span className="font-mono text-forest font-bold">admin</span> / <span className="font-mono text-coral font-bold">alif12</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-coral-50 border border-coral/30 rounded-lg flex items-center gap-2.5 text-xs text-coral font-medium">
              <AlertCircle className="w-4 h-4 text-coral flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-serif text-forest font-bold mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-forest transition-colors font-mono"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-serif text-forest font-bold mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-forest transition-colors font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-forest hover:bg-forest-800 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-editorial flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In To Control Room</span>
                  <ArrowRight className="w-4 h-4 text-coral" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-editorial-border text-center">
            <Link
              href="/"
              className="text-xs text-ink-muted hover:text-coral transition-colors font-serif font-medium"
            >
              &larr; Return to public publication
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
