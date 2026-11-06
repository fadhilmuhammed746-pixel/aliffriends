'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import {
  Menu,
  X,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Magazine', href: '/magazine', badge: 'XII' },
  { name: 'Newspaper', href: '/newspaper' },
  { name: 'Programs', href: '/programs' },
  { name: 'Videos', href: '/videos' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Members', href: '/members' },
  { name: 'Achievements', href: '/achievements' },
  { name: 'Announcements', href: '/announcements' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F7F6F0]/95 backdrop-blur-md shadow-subtle border-b border-editorial-border py-3'
          : 'bg-canvas border-b border-editorial-border py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo in Modern Editorial Palette */}
          <Logo variant="dark" size="md" showTagline={!scrolled} />

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 text-xs uppercase tracking-wider font-sans transition-colors duration-200 rounded-md ${
                    isActive
                      ? 'text-forest font-bold'
                      : 'text-ink/80 hover:text-forest hover:bg-forest-50/70 font-medium'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.name}
                    {item.badge && (
                      <span className="text-[9px] bg-coral/15 text-coral px-1.5 py-0.2 rounded font-mono font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-coral rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/magazine"
              className="px-4 py-2 text-xs uppercase tracking-widest font-serif font-bold text-white bg-forest hover:bg-forest-800 rounded-md transition-colors shadow-subtle flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
              <span>Edition XII</span>
            </Link>

            <Link
              href="/admin/login"
              title="Editorial CMS Login"
              className="p-2 text-ink-muted hover:text-forest hover:bg-forest-50 rounded-md transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              href="/magazine"
              className="px-3 py-1.5 text-[11px] font-serif uppercase tracking-wider font-semibold text-white bg-forest hover:bg-forest-800 rounded transition-colors"
            >
              Edition XII
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink hover:text-forest hover:bg-editorial-border/40 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[65px] bottom-0 bg-canvas/98 backdrop-blur-xl border-t border-editorial-border z-50 overflow-y-auto px-6 py-6 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-ultra text-ink-muted font-serif mb-4 border-b border-editorial-border pb-2">
              Publication Directory
            </div>
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm tracking-wider font-serif transition-colors ${
                    isActive
                      ? 'bg-forest-50 text-forest font-bold border-l-2 border-forest'
                      : 'text-ink/80 hover:text-forest hover:bg-forest-50/50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {item.name}
                    {item.badge && (
                      <span className="text-[10px] bg-coral text-white px-1.5 py-0.5 rounded font-sans font-bold">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-forest/40" />
                </Link>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-editorial-border space-y-4">
            <div className="flex items-center justify-between text-xs text-ink-muted font-sans">
              <span>Alif Friends 12 Digital Publication</span>
              <Link href="/admin/login" className="text-forest hover:text-coral transition-colors flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin CMS
              </Link>
            </div>
            <div className="flex gap-2">
              <a
                href="https://www.youtube.com/@AlifCreations12"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 text-center text-xs bg-white text-forest rounded border border-editorial-border hover:border-forest transition-colors flex items-center justify-center gap-1.5 font-medium"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3 text-coral" />
              </a>
              <a
                href="https://www.instagram.com/_alif_friends_/"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 text-center text-xs bg-white text-forest rounded border border-editorial-border hover:border-forest transition-colors flex items-center justify-center gap-1.5 font-medium"
              >
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 text-coral" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
