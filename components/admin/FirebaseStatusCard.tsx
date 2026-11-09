'use client';

import React, { useEffect, useState } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import {
  Flame,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Database,
  HardDrive,
  Users,
  BarChart3,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

interface FirebaseStatusResponse {
  success: boolean;
  services: {
    analytics: {
      available: boolean;
      measurementId: string | null;
    };
    auth: {
      clientAvailable: boolean;
      adminAvailable: boolean;
      active: boolean;
      userCount: number;
    };
    firestore: {
      clientAvailable: boolean;
      adminAvailable: boolean;
      connected: boolean;
    };
    storage: {
      bucket: string | null;
      available: boolean;
    };
  };
  projectId: string;
  clientConfigured: boolean;
  adminConfigured: boolean;
}

export const FirebaseStatusCard: React.FC = () => {
  const { user, isAdmin, syncAdminSession } = useFirebaseAuth();
  const [status, setStatus] = useState<FirebaseStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string>('');

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/firebase-status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.warn('Failed to fetch Firebase status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSyncAdmin = async () => {
    setSyncing(true);
    setSyncResult('');
    try {
      const success = await syncAdminSession();
      if (success) {
        setSyncResult('Admin credentials successfully bridged with Firebase.');
      } else {
        setSyncResult('Firebase Admin SDK credentials not yet configured.');
      }
      await fetchStatus();
    } catch (err: any) {
      setSyncResult(`Sync failed: ${err?.message || 'Error'}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8 shadow-card border border-editorial-border bg-white rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-editorial-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
            <Flame className="w-5 h-5 fill-amber-500 text-amber-600" />
          </div>
          <div>
            <h3 className="font-serif text-sm uppercase tracking-wider font-bold text-forest">
              Firebase Services Architecture
            </h3>
            <p className="text-xs text-ink-muted">
              Analytics, Authentication, Cloud Firestore & Cloud Storage integration status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStatus}
            disabled={loading}
            className="text-xs h-8 border border-editorial-border"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <a
            href="https://console.firebase.google.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-canvas-warm border border-editorial-border text-forest hover:bg-forest hover:text-white transition-colors"
          >
            <span>Console</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Grid of 4 Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Firebase Analytics */}
        <div className="p-4 rounded-xl border border-editorial-border bg-canvas-warm/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold text-forest flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-coral" />
              Analytics
            </span>
            {status?.services.analytics.available ? (
              <Badge variant="success" size="sm">Active</Badge>
            ) : (
              <Badge variant="draft" size="sm">Pending Env</Badge>
            )}
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            Tracks public visitors, magazine views, article reads, video plays, and app downloads.
          </p>
          <div className="text-[10px] font-mono text-ink-muted pt-1 border-t border-editorial-border/60">
            ID: {status?.services.analytics.measurementId || 'NEXT_PUBLIC_...'}
          </div>
        </div>

        {/* 2. Firebase Authentication */}
        <div className="p-4 rounded-xl border border-editorial-border bg-canvas-warm/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold text-forest flex items-center gap-1.5">
              <Users className="w-4 h-4 text-forest" />
              Authentication
            </span>
            {user ? (
              <Badge variant="success" size="sm">Signed In</Badge>
            ) : status?.clientConfigured ? (
              <Badge variant="forest" size="sm">Ready</Badge>
            ) : (
              <Badge variant="draft" size="sm">Pending Env</Badge>
            )}
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            Admin JWT session bridge + email/password authentication & password reset.
          </p>
          <div className="text-[10px] font-mono text-ink-muted pt-1 border-t border-editorial-border/60">
            Admin Claim: {isAdmin ? 'Verified (Admin)' : 'Member / Guest'}
          </div>
        </div>

        {/* 3. Cloud Firestore */}
        <div className="p-4 rounded-xl border border-editorial-border bg-canvas-warm/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold text-forest flex items-center gap-1.5">
              <Database className="w-4 h-4 text-amber-600" />
              Cloud Firestore
            </span>
            {status?.services.firestore.connected ? (
              <Badge variant="success" size="sm">Connected</Badge>
            ) : status?.clientConfigured ? (
              <Badge variant="forest" size="sm">Ready</Badge>
            ) : (
              <Badge variant="draft" size="sm">Pending Env</Badge>
            )}
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            Realtime user profiles, reading preferences, and activity logs. (Supabase maintains CMS & finances).
          </p>
          <div className="text-[10px] font-mono text-ink-muted pt-1 border-t border-editorial-border/60">
            Rules: firestore.rules
          </div>
        </div>

        {/* 4. Cloud Storage */}
        <div className="p-4 rounded-xl border border-editorial-border bg-canvas-warm/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold text-forest flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              Cloud Storage
            </span>
            {status?.services.storage.available ? (
              <Badge variant="success" size="sm">Available</Badge>
            ) : (
              <Badge variant="draft" size="sm">Pending Env</Badge>
            )}
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            Direct browser uploads for magazines, photos, and videos with live progress & cancellation.
          </p>
          <div className="text-[10px] font-mono text-ink-muted pt-1 border-t border-editorial-border/60 truncate">
            Bucket: {status?.services.storage.bucket || 'Default bucket'}
          </div>
        </div>
      </div>

      {/* Admin Bridge Action Banner */}
      <div className="p-4 rounded-xl bg-forest/5 border border-forest/20 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold text-forest">
              Administrator Firebase Identity Bridge
            </span>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-mono font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active Session Bridged
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-mono">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Awaiting Bridge Verification
              </span>
            )}
          </div>
          <p className="text-xs text-ink-muted">
            Mint a cryptographically verified custom token from your Next.js admin JWT to authorize Firebase Firestore and Storage operations.
          </p>
          {syncResult && (
            <p className="text-xs font-mono text-forest font-semibold mt-1">
              {syncResult}
            </p>
          )}
        </div>

        <Button
          variant="forest"
          size="sm"
          onClick={handleSyncAdmin}
          disabled={syncing}
          className="text-xs font-mono h-9 px-4"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          Sync Firebase Admin Token
        </Button>
      </div>

      {/* Architecture Integrity Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-serif font-bold">Dual-Cloud Architecture Safeguards:</span>
          <p className="text-[11px] leading-relaxed text-amber-800">
            Supabase PostgreSQL remains the sole source of truth for the 15 class tables and confidential finance transactions (preserving the ₹1,100 balance). Firebase manages analytics, authentication tokens, user preferences, and new media uploads. Private finance receipts remain locked in Supabase private storage.
          </p>
        </div>
      </div>
    </Card>
  );
};
