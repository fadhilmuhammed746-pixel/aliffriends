import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy flex text-ivory">
      {/* Sidebar is rendered inside the layout; pages can hide it if login */}
      <div className="flex w-full">
        {children}
      </div>
    </div>
  );
}
