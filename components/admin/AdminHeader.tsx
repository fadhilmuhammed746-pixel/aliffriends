'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Bell, User, KeyRound } from 'lucide-react';

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
    <div className="bg-navy border-b border-gold/15 py-4 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-ivory tracking-wide flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-light mt-0.5 font-sans">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {action}
        <Link
          href="/admin/settings"
          className="p-2 text-gold/80 hover:text-gold hover:bg-charcoal rounded-lg border border-gold/20 transition-colors"
          title="Change Password & Security"
        >
          <KeyRound className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal border border-gold/20 text-xs text-ivory">
          <Shield className="w-3.5 h-3.5 text-gold" />
          <span className="font-mono text-[11px] text-gold">admin</span>
        </div>
      </div>
    </div>
  );
};
