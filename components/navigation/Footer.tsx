'use client';

import React from 'react';
import Link from 'next/link';
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
    <footer className="bg-forest text-[#F7F6F0] border-t border-forest-800 relative overflow-hidden">
      {/* Subtle architectural grid pattern */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Manifesto Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Logo variant="light" size="lg" showTagline={true} />
            <p className="text-sm text-[#F7F6F0]/75 leading-relaxed font-sans max-w-md pt-2">
              The premier digital publication, literary archive, and cinematic media platform
              dedicated to preserving the milestones, creativity, and enduring fellowship
              of <span className="text-coral-light font-medium">Alif Friends 12</span>.
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-serif uppercase tracking-widest text-[#F7F6F0]/80 block mb-3 font-semibold">
                Official Channels & Broadcasts
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://www.youtube.com/@AlifCreations12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-forest-800 hover:bg-forest-700 border border-forest-600 text-xs font-medium text-white flex items-center gap-2 transition-all group"
                >
                  <Youtube className="w-4 h-4 text-coral group-hover:scale-110 transition-transform" />
                  <span>@AlifCreations12</span>
                  <ArrowUpRight className="w-3 h-3 text-coral-light opacity-80" />
                </a>

                <a
                  href="https://www.instagram.com/_alif_friends_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-forest-800 hover:bg-forest-700 border border-forest-600 text-xs font-medium text-white flex items-center gap-2 transition-all group"
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
            <h4 className="text-xs uppercase font-serif tracking-widest text-[#F7F6F0] font-bold border-b border-forest-700 pb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-coral"></span>
              Editorial Sections
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#F7F6F0]/80">
              <li>
                <Link href="/magazine" className="hover:text-coral-light transition-colors flex items-center justify-between">
                  <span>Digital Magazine Archive</span>
                  <span className="text-[10px] text-coral-light/80 font-mono">Editions X-XII</span>
                </Link>
              </li>
              <li>
                <Link href="/newspaper" className="hover:text-coral-light transition-colors flex items-center justify-between">
                  <span>The Newsroom & Reports</span>
                  <span className="text-[10px] text-coral-light/80 font-mono">Daily / Weekly</span>
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

          {/* Directory & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase font-serif tracking-widest text-[#F7F6F0] font-bold border-b border-forest-700 pb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-coral"></span>
              Official Inquiries & Desk
            </h4>
            <p className="text-xs text-[#F7F6F0]/70 leading-relaxed font-sans">
              Direct all official publication contributions, press releases, and alumni communications to our editorial desks:
            </p>

            <div className="space-y-2">
              <a
                href="mailto:aliffreinds12@gmail.com"
                className="flex items-center gap-2.5 text-xs text-[#F7F6F0] hover:text-coral-light transition-colors bg-forest-800/80 p-2.5 rounded-lg border border-forest-700 hover:border-forest-600"
              >
                <Mail className="w-3.5 h-3.5 text-coral flex-shrink-0" />
                <span className="font-mono">aliffreinds12@gmail.com</span>
              </a>

              <a
                href="mailto:aliffriends12@gmail.com"
                className="flex items-center gap-2.5 text-xs text-[#F7F6F0] hover:text-coral-light transition-colors bg-forest-800/80 p-2.5 rounded-lg border border-forest-700 hover:border-forest-600"
              >
                <Mail className="w-3.5 h-3.5 text-coral flex-shrink-0" />
                <span className="font-mono">aliffriends12@gmail.com</span>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <Link
                href="/about"
                className="text-coral-light hover:underline font-serif text-[11px] uppercase tracking-wider"
              >
                About Our Class &rarr;
              </Link>
              <Link
                href="/admin/login"
                className="text-[#F7F6F0]/60 hover:text-coral-light flex items-center gap-1 font-mono text-[11px]"
              >
                <ShieldCheck className="w-3 h-3 text-coral" />
                <span>Admin CMS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F7F6F0]/65">
          <div className="flex items-center gap-2 font-serif text-[11px] tracking-wider">
            <span>&copy; {currentYear} ALIF FRIENDS 12.</span>
            <span>All rights reserved.</span>
          </div>

          <div className="italic text-[11px] font-serif text-coral-light text-center">
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
