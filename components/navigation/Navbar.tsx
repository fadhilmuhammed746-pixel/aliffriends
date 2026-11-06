'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import {
  X,
  BookOpen,
  ShieldCheck,
  Youtube,
  Instagram,
  Mail,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

const menuItems = [
  { index: '01', name: 'Home', href: '/', description: 'Signature Frontpage' },
  { index: '02', name: 'Magazine', href: '/magazine', badge: 'Edition XII', description: 'Digital Editions & PDF Archive' },
  { index: '03', name: 'Newspaper', href: '/newspaper', description: 'Broadsheet Dispatches & News' },
  { index: '04', name: 'Programs', href: '/programs', description: 'Conclaves & Official Events' },
  { index: '05', name: 'Videos', href: '/videos', description: 'Cinematic Archive & YouTube' },
  { index: '06', name: 'Gallery', href: '/gallery', description: 'Photographic Heritage & Memories' },
  { index: '07', name: 'Members', href: '/members', description: 'Class Directory & Leadership' },
  { index: '08', name: 'Achievements', href: '/achievements', description: 'Honors, Laurels & Distinctions' },
  { index: '09', name: 'Announcements', href: '/announcements', description: 'Official Bulletins & Notices' },
  { index: '10', name: 'About Us', href: '/about', description: 'Mission, History & Retrospective' },
  { index: '11', name: 'Contact Us', href: '/contact', description: 'Inquiries, Letters & Directorate' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection for header backdrop
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is opened
  useEffect(() => {
    if (menuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [menuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Don't render public navbar in admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Clean Minimalist Editorial Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F7F6F0]/95 backdrop-blur-md shadow-editorial border-b border-editorial-border py-3.5'
            : 'bg-canvas border-b border-editorial-border py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* ALIF FRIENDS 12 Brand Logo (Left) */}
            <div className="flex items-center">
              <Logo variant="dark" size="md" showTagline={!scrolled} />
            </div>

            {/* Right Side: Editorial Edition Indicator & Three-Line Hamburger Button */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Optional Small Editorial Edition Indicator */}
              <Link
                href="/magazine"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest/10 hover:bg-forest/15 border border-forest/20 text-forest text-xs font-serif transition-colors"
                title="View Latest Digital Magazine Edition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
                <span className="font-semibold tracking-wide">Edition XII</span>
                <span className="text-muted text-[10px] font-mono">2026</span>
              </Link>

              {/* Sophisticated Three-Line Animated Hamburger Button */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`relative group flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                  menuOpen
                    ? 'bg-forest text-white border-forest shadow-sm'
                    : 'bg-white hover:bg-canvas-subtle text-forest border-editorial-border hover:border-forest/40 shadow-sm'
                }`}
                aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={menuOpen}
                aria-controls="editorial-navigation-drawer"
              >
                <span className="text-[11px] font-sans font-bold tracking-wider uppercase hidden xs:inline-block">
                  {menuOpen ? 'Close' : 'Menu'}
                </span>

                {/* Animated Three-Line Hamburger Icon */}
                <div className="relative w-5 h-4 flex flex-col justify-between items-center" aria-hidden="true">
                  {/* Top Line */}
                  <span
                    className={`block h-[2px] w-5 rounded-full transition-all duration-300 origin-center ${
                      menuOpen
                        ? 'bg-white translate-y-[7px] rotate-45'
                        : 'bg-forest group-hover:bg-coral'
                    }`}
                  />
                  {/* Middle Line */}
                  <span
                    className={`block h-[2px] w-5 rounded-full transition-all duration-200 ${
                      menuOpen ? 'opacity-0 scale-x-0' : 'bg-forest group-hover:bg-coral'
                    }`}
                  />
                  {/* Bottom Line */}
                  <span
                    className={`block h-[2px] w-5 rounded-full transition-all duration-300 origin-center ${
                      menuOpen
                        ? 'bg-white -translate-y-[7px] -rotate-45'
                        : 'bg-forest group-hover:bg-coral'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Slide-In Hamburger Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" id="editorial-navigation-drawer">
          {/* Subtle Dimming Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-forest/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            aria-hidden="true"
          />

          {/* Slide-In Navigation Panel: 400-450px wide on desktop, nearly full-screen on mobile */}
          <div className="fixed inset-y-0 right-0 w-full sm:max-w-[440px] md:max-w-[450px] bg-[#F7F6F0] border-l border-editorial-border shadow-2xl flex flex-col justify-between overflow-y-auto z-50 animate-slideInRight">
            {/* Panel Header */}
            <div className="p-6 sm:p-7 border-b border-editorial-border flex items-start justify-between bg-white/70">
              <div>
                <Logo variant="dark" size="sm" showTagline={false} clickable={false} />
                <p className="font-serif italic text-xs text-muted mt-1.5 tracking-wide">
                  A Class. A Generation. A Thousand Memories.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 -mr-2 -mt-1 text-muted hover:text-coral hover:bg-canvas rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation List with Staggered Entrance */}
            <nav className="p-6 sm:p-7 flex-1 space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-widest text-muted mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                <span>Editorial Directory</span>
              </div>

              {menuItems.map((item, idx) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`group block py-2.5 px-3 rounded-xl transition-all duration-200 border-b border-editorial-border/60 ${
                      isActive
                        ? 'bg-white shadow-editorial border-editorial-border text-forest'
                        : 'hover:bg-white/70 hover:translate-x-1 text-ink'
                    }`}
                    style={{
                      animationDelay: `${idx * 25}ms`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`font-mono text-xs transition-colors ${
                            isActive
                              ? 'text-coral font-bold'
                              : 'text-muted group-hover:text-coral'
                          }`}
                        >
                          {item.index}
                        </span>
                        <span
                          className={`font-serif text-xl sm:text-2xl transition-colors font-bold ${
                            isActive
                              ? 'text-forest'
                              : 'text-ink group-hover:text-forest'
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coral text-white font-semibold shadow-sm">
                            {item.badge}
                          </span>
                        )}
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-muted/60 opacity-0 group-hover:opacity-100 group-hover:text-forest group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] font-sans text-muted pl-8 mt-0.5 line-clamp-1 group-hover:text-ink/80 transition-colors">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </nav>

            {/* Menu Footer */}
            <div className="p-6 sm:p-7 border-t border-editorial-border bg-white/70 space-y-4">
              {/* Official Social Links & Channel */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted font-semibold">
                  Official Channels
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.youtube.com/@AlifCreations12"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-canvas hover:bg-forest hover:text-white text-forest transition-colors shadow-sm"
                    title="Alif Creations 12 on YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.instagram.com/_alif_friends_/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-canvas hover:bg-forest hover:text-white text-forest transition-colors shadow-sm"
                    title="_alif_friends_ on Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <Link
                    href="/admin/login"
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg bg-canvas hover:bg-forest hover:text-white text-muted hover:text-white transition-colors shadow-sm"
                    title="Editorial Directorate Login"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Verified Official Email Addresses */}
              <div className="text-[11px] font-mono text-muted space-y-1 bg-canvas p-3 rounded-xl border border-editorial-border">
                <div className="flex items-center gap-2 text-ink font-sans font-semibold text-xs mb-1">
                  <Mail className="w-3.5 h-3.5 text-coral" />
                  <span>Directorate Correspondence:</span>
                </div>
                <a
                  href="mailto:aliffreinds12@gmail.com"
                  className="block hover:text-forest transition-colors truncate"
                >
                  aliffreinds12@gmail.com
                </a>
                <a
                  href="mailto:aliffriends12@gmail.com"
                  className="block hover:text-forest transition-colors truncate"
                >
                  aliffriends12@gmail.com
                </a>
              </div>

              {/* Copyright Notice */}
              <div className="pt-2 text-[10px] font-mono text-muted flex items-center justify-between">
                <span>© 2026 ALIF FRIENDS 12</span>
                <span className="text-forest font-semibold">All Rights Reserved</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
