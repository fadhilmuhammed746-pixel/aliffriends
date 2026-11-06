'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  IndianRupee,
  BookOpen,
  Newspaper,
  Calendar,
  Video,
  Image as ImageIcon,
  Users,
  Trophy,
  Bell,
  Settings,
  FolderOpen,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Class Finance', href: '/admin/finance', icon: IndianRupee, badge: '₹1,100' },
  { name: 'Magazines', href: '/admin/magazines', icon: BookOpen },
  { name: 'Newspaper', href: '/admin/newspaper', icon: Newspaper },
  { name: 'Programs & Events', href: '/admin/programs', icon: Calendar },
  { name: 'Videos', href: '/admin/videos', icon: Video },
  { name: 'Photo Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Class Members', href: '/admin/members', icon: Users },
  { name: 'Achievements', href: '/admin/achievements', icon: Trophy },
  { name: 'Announcements', href: '/admin/announcements', icon: Bell },
  { name: 'Media Library', href: '/admin/media', icon: FolderOpen },
  { name: 'Settings & Security', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside className="w-64 bg-forest border-r border-forest-800 flex flex-col justify-between h-screen sticky top-0 text-white flex-shrink-0 z-30">
      <div className="overflow-y-auto">
        {/* Admin Header / Logo */}
        <div className="p-6 border-b border-forest-800">
          <Link href="/admin" className="block">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-forest-800 border border-forest-700 flex items-center justify-center text-white font-serif font-black text-sm shadow-subtle">
                <span className="text-coral">A</span>F
              </div>
              <div>
                <span className="font-serif font-bold text-sm tracking-widest text-white block">
                  AF12 CONTROL
                </span>
                <span className="text-[10px] font-mono text-coral-light uppercase tracking-wider font-semibold">
                  Editorial CMS
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Links Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-serif tracking-wider transition-colors ${
                  isActive
                    ? 'bg-coral text-white font-bold shadow-coral'
                    : 'text-white/80 hover:text-white hover:bg-forest-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-coral-light'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-forest-800 text-coral-light border border-forest-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-forest-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs text-white/80 hover:text-white hover:bg-forest-800 rounded transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-coral-light" />
            <span>View Public Site</span>
          </span>
          <span className="text-[10px] font-mono text-coral-light">Live</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-coral-light hover:text-white hover:bg-forest-800 rounded transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Secure Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
