'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import {
  Youtube,
  Instagram,
  Mail,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-950 text-canvas border-t border-forest-800 relative overflow-hidden">
      {/* Subtle architectural monogram watermark in background */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-5 translate-x-12 translate-y-12">
        <span className="font-serif font-black text-[220px] text-white leading-none select-none">
          AF12
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column with Large Emblem & Monogram (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-14 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logo-emblem.png"
                  alt="Alif Friends 12 Calligraphic Emblem"
                  width={48}
                  height={56}
                  className="object-contain filter drop-shadow"
                />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-white text-2xl tracking-widest leading-none">
                    ALIF FRIENDS
                  </span>
                  <span className="font-serif font-black text-white text-xs bg-coral px-2 py-0.5 rounded leading-none">
                    12
                  </span>
                </div>
                <span className="font-sans text-[10px] uppercase tracking-tag text-canvas-muted font-semibold mt-1">
                  12th Batch, Darul Falah Islamic Academy
                </span>
              </div>
            </div>

            <p className="text-sm text-canvas-muted leading-relaxed font-sans max-w-md pt-2">
              The premier digital publication, literary archive, and cinematic media platform
              dedicated to preserving the milestones, creativity, and enduring fellowship
              of <span className="text-coral-light font-medium">Alif Friends 12</span>.
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-tag text-canvas-muted block mb-3 font-semibold">
                Official Channels & Broadcasts
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://www.youtube.com/@AlifCreations12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-700 text-xs font-serif uppercase tracking-wider font-semibold text-white flex items-center gap-2 transition-all group shadow-subtle"
                >
                  <Youtube className="w-4 h-4 text-coral group-hover:scale-110 transition-transform" />
                  <span>@AlifCreations12</span>
                  <ArrowUpRight className="w-3 h-3 text-coral-light opacity-80" />
                </a>

                <a
                  href="https://www.instagram.com/_alif_friends_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-700 text-xs font-serif uppercase tracking-wider font-semibold text-white flex items-center gap-2 transition-all group shadow-subtle"
                >
                  <Instagram className="w-4 h-4 text-coral group-hover:scale-110 transition-transform" />
                  <span>@_alif_friends_</span>
                  <ArrowUpRight className="w-3 h-3 text-coral-light opacity-80" />
                </a>
              </div>
            </div>
          </div>

          {/* Editorial Sections (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-serif tracking-tag text-white font-bold border-b border-forest-800 pb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-coral"></span>
              Editorial Sections
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-canvas-muted">
              <li>
                <Link href="/magazine" className="hover:text-coral-light transition-colors flex items-center justify-between">
                  <span>Digital Magazine Archive</span>
                  <span className="text-[10px] text-coral-light font-mono">Edition XII</span>
                </Link>
              </li>
              <li>
                <Link href="/newspaper" className="hover:text-coral-light transition-colors flex items-center justify-between">
                  <span>The Newsroom & Reports</span>
                  <span className="text-[10px] text-coral-light font-mono">Dispatches</span>
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-coral-light transition-colors">
                  Programs & Formal Conclaves
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-coral-light transition-colors">
                  Cinematic Video Center
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-coral-light transition-colors">
                  Photographic Heritage Gallery
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-coral-light transition-colors">
                  Honours & Class Accolades
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-coral-light transition-colors">
                  Official Dispatches & Notices
                </Link>
              </li>
            </ul>
          </div>

          {/* Directory & Contact Desk (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase font-serif tracking-tag text-white font-bold border-b border-forest-800 pb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-coral"></span>
              Official Inquiries & Desk
            </h4>
            <p className="text-xs text-canvas-muted leading-relaxed font-sans">
              Direct all official publication contributions, press releases, and alumni communications to our editorial desks:
            </p>

            <div className="space-y-2">
              <a
                href="mailto:aliffreinds12@gmail.com"
                className="flex items-center gap-2.5 text-xs text-white hover:text-coral-light transition-colors bg-forest-900/80 p-2.5 rounded-xl border border-forest-800 hover:border-forest-700"
              >
                <Mail className="w-3.5 h-3.5 text-coral flex-shrink-0" />
                <span className="font-mono">aliffreinds12@gmail.com</span>
              </a>

              <a
                href="mailto:aliffriends12@gmail.com"
                className="flex items-center gap-2.5 text-xs text-white hover:text-coral-light transition-colors bg-forest-900/80 p-2.5 rounded-xl border border-forest-800 hover:border-forest-700"
              >
                <Mail className="w-3.5 h-3.5 text-coral flex-shrink-0" />
                <span className="font-mono">aliffriends12@gmail.com</span>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <Link
                href="/about"
                className="text-coral-light hover:underline font-serif text-[11px] uppercase tracking-wider font-semibold"
              >
                About Our Class &rarr;
              </Link>
              <Link
                href="/admin/login"
                className="text-canvas-muted hover:text-coral-light flex items-center gap-1 font-mono text-[11px]"
              >
                <ShieldCheck className="w-3 h-3 text-coral" />
                <span>Admin CMS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Copyright */}
        <div className="mt-14 pt-6 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-canvas-muted">
          <div className="flex items-center gap-2 font-serif text-[11px] tracking-wider">
            <span>&copy; {currentYear} ALIF FRIENDS 12.</span>
            <span>All rights reserved.</span>
          </div>

          <div className="italic text-xs font-cormorant text-coral-light text-center">
            &ldquo;A Class. A Generation. A Thousand Memories.&rdquo;
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/about" className="hover:text-coral-light transition-colors">
              Editorial Policy
            </Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-coral-light transition-colors">
              Contact Desk
            </Link>
            <span>&bull;</span>
            <Link href="/admin/login" className="hover:text-coral-light transition-colors text-white font-medium">
              CMS Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
