'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, KeyRound } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="bg-white border-b border-editorial-border py-4 px-6 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-forest tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-ink-muted mt-0.5 font-sans">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {action}
        <Link
          href="/admin/settings"
          className="p-2 text-ink-muted hover:text-forest hover:bg-forest-50 rounded-lg border border-editorial-border transition-colors"
          title="Change Password & Security"
        >
          <KeyRound className="w-4 h-4 text-coral" />
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-canvas border border-editorial-border text-xs text-forest">
          <Shield className="w-3.5 h-3.5 text-coral" />
          <span className="font-mono text-[11px] font-bold">admin</span>
        </div>
      </div>
    </div>
  );
};
