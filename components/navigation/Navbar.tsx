'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import {
  Menu,
  X,
  BookOpen,
  Newspaper,
  Calendar,
  Video,
  Image as ImageIcon,
  Users,
  Trophy,
  Bell,
  Info,
  Mail,
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
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
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
    // Admin has its own dedicated admin layout
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy/95 backdrop-blur-md shadow-editorial border-b border-gold/15 py-3'
          : 'bg-navy border-b border-gold/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Logo variant="light" size="md" showTagline={!scrolled} />

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
                  className={`relative px-3 py-2 text-xs uppercase tracking-wider font-medium transition-colors duration-200 rounded-md ${
                    isActive
                      ? 'text-gold font-semibold'
                      : 'text-ivory/80 hover:text-ivory hover:bg-charcoal/40'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.name}
                    {item.badge && (
                      <span className="text-[9px] bg-gold/20 text-gold px-1 rounded border border-gold/30">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/magazine"
              className="px-4 py-2 text-xs uppercase tracking-widest font-serif font-bold text-navy bg-gold hover:bg-gold-light rounded transition-colors shadow-gold flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-navy" />
              <span>Read Edition XII</span>
            </Link>

            <Link
              href="/admin/login"
              title="Editorial CMS Login"
              className="p-2 text-gold/70 hover:text-gold hover:bg-gold/10 rounded transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex xl:hidden items-center gap-2">
            <Link
              href="/magazine"
              className="px-3 py-1.5 text-[11px] font-serif uppercase tracking-wider font-semibold text-navy bg-gold hover:bg-gold-light rounded transition-colors"
            >
              Edition XII
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ivory/90 hover:text-gold hover:bg-charcoal/50 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[65px] bottom-0 bg-navy/98 backdrop-blur-xl border-t border-gold/20 z-50 overflow-y-auto px-6 py-6 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-ultra text-gold/70 font-serif mb-4 border-b border-gold/20 pb-2">
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
                      ? 'bg-gold/15 text-gold font-bold border-l-2 border-gold'
                      : 'text-ivory/80 hover:text-ivory hover:bg-charcoal/40'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {item.name}
                    {item.badge && (
                      <span className="text-[10px] bg-gold text-navy px-1.5 py-0.5 rounded font-sans font-bold">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gold/40" />
                </Link>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-gold/20 space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-light font-sans">
              <span>Alif Friends 12 Digital Publication</span>
              <Link href="/admin/login" className="text-gold hover:underline flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin CMS
              </Link>
            </div>
            <div className="flex gap-2">
              <a
                href="https://www.youtube.com/@AlifCreations12"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 text-center text-xs bg-charcoal text-ivory rounded border border-gold/20 hover:border-gold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3 text-gold" />
              </a>
              <a
                href="https://www.instagram.com/_alif_friends_/"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 text-center text-xs bg-charcoal text-ivory rounded border border-gold/20 hover:border-gold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Instagram</span>
                <ExternalLink className="w-3 h-3 text-gold" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
