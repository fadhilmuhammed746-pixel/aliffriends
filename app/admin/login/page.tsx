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
    <div className="min-h-screen w-full flex items-center justify-center bg-navy px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none -top-20 -right-20" />
      <div className="absolute w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none -bottom-20 -left-20" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Logo variant="light" size="lg" showTagline={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-serif uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Editorial CMS Portal</span>
          </div>
          <p className="text-xs text-muted-light mt-3 font-sans">
            Secure administrative control room for Alif Friends 12 digital publications.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-charcoal border border-gold/25 rounded-2xl p-8 shadow-2xl relative">
          <div className="border-b border-gold/15 pb-4 mb-6">
            <h2 className="font-serif text-lg font-bold text-ivory tracking-wider">
              Administrator Authentication
            </h2>
            <p className="text-xs text-muted-light mt-1">
              Initial credentials configured: <span className="font-mono text-gold">admin</span> / <span className="font-mono text-gold">alif12</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-500/40 rounded-lg flex items-center gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory placeholder-muted focus:outline-none focus:border-gold transition-colors font-mono"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory placeholder-muted focus:outline-none focus:border-gold transition-colors font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gold hover:bg-gold-light text-navy font-serif font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-gold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In To Control Room</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gold/10 text-center">
            <Link
              href="/"
              className="text-xs text-muted-light hover:text-gold transition-colors font-serif"
            >
              &larr; Return to public publication
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
