'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

const leftNavLinks = [
  { name: 'Home', href: '/' },
  { name: 'Magazine', href: '/magazine' },
  { name: 'Newspaper', href: '/newspaper' },
  { name: 'Videos', href: '/videos' },
  { name: 'Gallery', href: '/gallery' },
];

const rightNavLinks = [
  { name: 'Programs', href: '/programs' },
  { name: 'Members', href: '/members' },
  { name: 'Achievements', href: '/achievements' },
  { name: 'Announcements', href: '/announcements' },
  { name: 'Contact', href: '/contact' },
];

const allMenuItems = [
  { index: '01', name: 'Home', href: '/', description: 'Signature Frontpage' },
  { index: '02', name: 'Magazine', href: '/magazine', badge: 'Edition XII', description: 'Digital Editions & Flipbook Archive' },
  { index: '03', name: 'Newspaper', href: '/newspaper', description: 'Broadsheet Dispatches & News' },
  { index: '04', name: 'Programs', href: '/programs', description: 'Conclaves & Official Events' },
  { index: '05', name: 'Videos', href: '/videos', description: 'Cinematic Archive & Documentaries' },
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-canvas/95 backdrop-blur-md border-b border-editorial-border ${
          scrolled ? 'py-2.5 shadow-subtle' : 'py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Nav Links (Desktop) */}
            <nav className="hidden xl:flex items-center gap-6">
              {leftNavLinks.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-[11px] uppercase tracking-tag font-serif font-bold transition-colors py-1 select-none ${
                      active ? 'text-forest' : 'text-ink-muted hover:text-forest'
                    }`}
                  >
                    <span>{link.name}</span>
                    {active && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-coral rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile / Tablet Left Logo */}
            <div className="xl:hidden flex items-center">
              <Logo variant="dark" size="sm" showTagline={!scrolled} />
            </div>

            {/* Centered AF12 Monogram / Logo (Desktop) */}
            <div className="hidden xl:flex items-center justify-center flex-shrink-0 px-4">
              <Link
                href="/"
                className="group flex items-center gap-3 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded-lg p-1"
                aria-label="Alif Friends 12 - Homepage"
              >
                <div className="relative w-8 h-10 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/logo-emblem.png"
                    alt="Alif Friends 12 Calligraphic Emblem"
                    width={32}
                    height={40}
                    className="object-contain drop-shadow-sm filter"
                    priority
                  />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-black text-forest text-lg tracking-wider leading-none">
                      ALIF FRIENDS
                    </span>
                    <span className="font-serif font-black text-white text-[10px] bg-coral px-1.5 py-0.5 rounded leading-none">
                      12
                    </span>
                  </div>
                  <span className="font-sans text-[9px] uppercase tracking-widest text-ink-muted font-semibold mt-0.5">
                    Darul Falah Islamic Academy
                  </span>
                </div>
              </Link>
            </div>

            {/* Right Nav Links (Desktop) */}
            <div className="hidden xl:flex items-center gap-6">
              <nav className="flex items-center gap-6">
                {rightNavLinks.map((link) => {
                  const active = isLinkActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative text-[11px] uppercase tracking-tag font-serif font-bold transition-colors py-1 select-none ${
                        active ? 'text-forest' : 'text-ink-muted hover:text-forest'
                      }`}
                    >
                      <span>{link.name}</span>
                      {active && (
                        <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-coral rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`relative group flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                  menuOpen
                    ? 'bg-forest text-white border-forest'
                    : 'bg-white hover:bg-canvas-warm text-forest border-editorial-border hover:border-forest/40'
                }`}
                aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={menuOpen}
              >
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                  {menuOpen ? 'Close' : 'Menu'}
                </span>
                <div className="w-4 h-3 flex flex-col justify-between items-center" aria-hidden="true">
                  <span
                    className={`block h-[2px] w-4 rounded-full transition-all duration-300 ${
                      menuOpen ? 'bg-white translate-y-[5px] rotate-45' : 'bg-forest group-hover:bg-coral'
                    }`}
                  />
                  <span
                    className={`block h-[2px] w-4 rounded-full transition-all duration-200 ${
                      menuOpen ? 'opacity-0 scale-x-0' : 'bg-forest group-hover:bg-coral'
                    }`}
                  />
                  <span
                    className={`block h-[2px] w-4 rounded-full transition-all duration-300 ${
                      menuOpen ? 'bg-white -translate-y-[5px] -rotate-45' : 'bg-forest group-hover:bg-coral'
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Tablet & Mobile Right Controls */}
            <div className="xl:hidden flex items-center gap-3">
              <Link
                href="/magazine"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif"
                title="View Latest Digital Magazine Edition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
                <span className="font-semibold tracking-wide">Edition XII</span>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`relative group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                  menuOpen
                    ? 'bg-forest text-white border-forest'
                    : 'bg-white hover:bg-canvas-warm text-forest border-editorial-border hover:border-forest/40 shadow-sm'
                }`}
                aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={menuOpen}
              >
                <span className="text-[11px] font-sans font-bold tracking-wider uppercase hidden xs:inline-block">
                  {menuOpen ? 'Close' : 'Menu'}
                </span>
                <div className="w-5 h-4 flex flex-col justify-between items-center" aria-hidden="true">
                  <span
                    className={`block h-[2px] w-5 rounded-full transition-all duration-300 ${
                      menuOpen ? 'bg-white translate-y-[7px] rotate-45' : 'bg-forest group-hover:bg-coral'
                    }`}
                  />
                  <span
                    className={`block h-[2px] w-5 rounded-full transition-all duration-200 ${
                      menuOpen ? 'opacity-0 scale-x-0' : 'bg-forest group-hover:bg-coral'
                    }`}
                  />
                  <span
                    className={`block h-[2px] w-5 rounded-full transition-all duration-300 ${
                      menuOpen ? 'bg-white -translate-y-[7px] -rotate-45' : 'bg-forest group-hover:bg-coral'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-In Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" id="editorial-navigation-drawer">
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-forest-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 w-full sm:max-w-[440px] md:max-w-[450px] bg-canvas border-l border-editorial-border shadow-2xl flex flex-col justify-between overflow-y-auto z-50 animate-slideInRight">
            {/* Panel Header */}
            <div className="p-6 border-b border-editorial-border flex items-start justify-between bg-white/70">
              <Logo variant="dark" size="sm" showTagline={true} taglineText="12TH BATCH, DARUL FALAH ISLAMIC ACADEMY" clickable={false} />

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 -mr-2 -mt-1 text-ink-muted hover:text-coral hover:bg-canvas rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-coral"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="p-6 flex-1 space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-widest text-ink-muted mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                <span>Editorial Directory</span>
              </div>

              {allMenuItems.map((item, idx) => {
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
                        ? 'bg-white shadow-card border-editorial-border text-forest'
                        : 'hover:bg-white/70 hover:translate-x-1 text-ink'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`font-mono text-xs transition-colors ${
                            isActive
                              ? 'text-coral font-bold'
                              : 'text-ink-muted group-hover:text-coral'
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
                          <ArrowUpRight className="w-4 h-4 text-ink-muted/60 opacity-0 group-hover:opacity-100 group-hover:text-forest group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] font-sans text-ink-muted pl-8 mt-0.5 line-clamp-1 group-hover:text-ink/80 transition-colors">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </nav>

            {/* Menu Footer */}
            <div className="p-6 border-t border-editorial-border bg-white/70 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-ink-muted font-semibold">
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
                    className="p-2 rounded-lg bg-canvas hover:bg-forest hover:text-white text-ink-muted hover:text-white transition-colors shadow-sm"
                    title="Editorial Directorate Login"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="text-[11px] font-mono text-ink-muted space-y-1 bg-canvas p-3 rounded-xl border border-editorial-border">
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

              <div className="pt-1 text-[10px] font-mono text-ink-muted flex items-center justify-between">
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
