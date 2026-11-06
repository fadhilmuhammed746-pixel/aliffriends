import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas flex text-ink">
      <div className="flex w-full">
        {children}
      </div>
    </div>
  );
}
