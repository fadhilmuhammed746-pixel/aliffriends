'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
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
  Lock,
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
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
    <aside className="w-64 bg-navy-950 border-r border-gold/15 flex flex-col justify-between h-screen sticky top-0 text-ivory">
      <div>
        {/* Admin Header / Logo */}
        <div className="p-6 border-b border-gold/15">
          <Link href="/admin" className="block">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-serif font-black text-sm">
                AF
              </div>
              <div>
                <span className="font-serif font-bold text-sm tracking-widest text-ivory block">
                  AF12 EDITORIAL
                </span>
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider">
                  CMS Administration
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-serif tracking-wider transition-colors ${
                  isActive
                    ? 'bg-gold text-navy font-bold shadow-gold'
                    : 'text-ivory/70 hover:text-ivory hover:bg-charcoal/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-navy' : 'text-gold'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gold/15 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs text-ivory/70 hover:text-gold hover:bg-charcoal/40 rounded transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
            <span>View Public Site</span>
          </span>
          <span className="text-[10px] font-mono text-gold/60">Live</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Secure Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
