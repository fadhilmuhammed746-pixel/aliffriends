import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  BookOpen,
  Newspaper,
  Calendar,
  Video,
  Image as ImageIcon,
  Trophy,
  Bell,
  ArrowRight,
  Flame,
  Play,
  Download,
  Eye,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Quote,
} from 'lucide-react';
import { VideoPlayer } from '@/components/video/VideoPlayer';

export const revalidate = 0;

export default function HomePage() {
  const settings = db.getSettings();
  const magazines = db.getMagazines(true);
  const articles = db.getArticles(true);
  const programs = db.getPrograms(true);
  const videos = db.getVideos(true);
  const albums = db.getAlbums(true);
  const achievements = db.getAchievements(true);
  const announcements = db.getAnnouncements(true);
  const members = db.getMembers(true);

  const featuredMagazine = magazines.find((m) => m.isFeatured) || magazines[0];
  const leadArticle = articles.find((a) => a.headlineStatus) || articles[0];
  const secondaryArticles = articles.filter((a) => a.id !== leadArticle?.id).slice(0, 4);
  const featuredVideo = videos.find((v) => v.isFeatured) || videos[0];

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 overflow-hidden bg-canvas text-ink">
      {/* 1. SIGNATURE ASYMMETRICAL EDITORIAL HERO */}
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-editorial-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Running Editorial Header Line */}
          <div className="flex flex-wrap items-center justify-between border-b border-editorial-border pb-3 mb-8 sm:mb-12 text-xs font-mono text-ink-muted">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-coral"></span>
              <span className="font-semibold text-forest uppercase tracking-widest">
                Vol. XII • Issue 2026
              </span>
            </div>
            <div className="hidden md:block italic font-serif text-ink-muted">
              Official Digital Publication & Archival Record
            </div>
            <div className="text-right">
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* Asymmetrical Grid: Massive Typographic Headline + Image Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Typographic Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-coral" />
                <span>Modern Editorial Luxury</span>
              </div>

              {/* Massive Title */}
              <h1 className="font-serif font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-forest leading-[0.92]">
                ALIF <br />
                <span className="italic font-normal font-editorial text-forest-700">Friends</span>{' '}
                <span className="text-coral font-sans font-black tracking-normal align-middle inline-block text-4xl sm:text-6xl md:text-7xl lg:text-8xl border-2 border-coral px-3 py-1 rounded-xl">
                  12
                </span>
              </h1>

              {/* Tagline & Subheading */}
              <div className="space-y-3 max-w-xl">
                <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-coral leading-snug">
                  &ldquo;{settings.tagline}&rdquo;
                </p>
                <p className="font-sans text-sm sm:text-base text-ink-light leading-relaxed">
                  {settings.heroSubheading}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/newspaper"
                  className="px-8 py-4 bg-forest hover:bg-forest-800 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-editorial flex items-center gap-2 group"
                >
                  <span>Discover Our Stories</span>
                  <ArrowRight className="w-4 h-4 text-coral group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/magazine"
                  className="px-8 py-4 bg-white hover:bg-forest-50 border border-editorial-border hover:border-forest text-forest font-serif font-semibold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-subtle"
                >
                  <BookOpen className="w-4 h-4 text-coral" />
                  <span>Explore Magazine XII</span>
                </Link>
              </div>

              {/* Metadata Micro-Stats */}
              <div className="pt-6 border-t border-editorial-border flex flex-wrap items-center gap-8 text-xs font-mono text-ink-muted">
                <div>
                  <span className="text-forest font-bold block text-sm">Class of 12</span>
                  <span>Academic Cohort</span>
                </div>
                <div className="text-editorial-border-dark">•</div>
                <div>
                  <span className="text-coral font-bold block text-sm">{magazines.length} Editions</span>
                  <span>Print & Digital PDF</span>
                </div>
                <div className="text-editorial-border-dark">•</div>
                <div>
                  <span className="text-forest font-bold block text-sm">{articles.length} Dispatches</span>
                  <span>Newsroom Features</span>
                </div>
              </div>
            </div>

            {/* Right Asymmetrical Image Composition (5 cols) */}
            <div className="lg:col-span-5 relative">
              {/* Decorative accent card backdrop */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-forest-100 to-coral-50 rounded-3xl transform rotate-1 pointer-events-none" />

              <div className="relative rounded-2xl overflow-hidden border border-editorial-border shadow-lift bg-white p-2">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                  <img
                    src={settings.heroImage}
                    alt="Alif Friends 12 Class Cohort"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-full bg-coral text-white font-bold inline-block mb-2">
                      Historic Archival Record
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug drop-shadow">
                      {settings.heroHeading}
                    </h3>
                  </div>
                </div>

                {/* Floating caption box */}
                <div className="p-4 bg-white rounded-b-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-forest"></span>
                    <span className="font-serif font-bold text-forest">The Cohort Archive</span>
                  </div>
                  <Link
                    href="/about"
                    className="text-coral hover:underline font-serif text-[11px] uppercase tracking-wider"
                  >
                    Read Manifesto &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE DIGITAL NEWSROOM & FEATURED LEAD STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-editorial-border pb-4 mb-10 gap-4">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-coral mb-1 flex items-center gap-2 font-bold">
              <Flame className="w-4 h-4 text-coral" />
              The Digital Newsroom
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
              Latest Dispatches & Headlines
            </h2>
          </div>
          <Link
            href="/newspaper"
            className="text-xs uppercase font-serif tracking-widest text-forest hover:text-coral flex items-center gap-1.5 transition-colors font-bold"
          >
            <span>Visit Full Newsroom</span>
            <ChevronRight className="w-4 h-4 text-coral" />
          </Link>
        </div>

        {leadArticle && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Asymmetrical Lead Feature (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-editorial-border rounded-2xl overflow-hidden shadow-card group hover:border-forest/40 transition-all">
              <Link href={`/newspaper/${leadArticle.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-canvas">
                <img
                  src={leadArticle.coverImage}
                  alt={leadArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[10px] uppercase font-mono px-3 py-1 rounded bg-forest text-white font-bold">
                    {leadArticle.category}
                  </span>
                  {leadArticle.breakingStatus && (
                    <span className="text-[10px] uppercase font-mono px-3 py-1 rounded bg-coral text-white font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Breaking
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-6 sm:p-10 space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono text-ink-muted">
                  <span>{new Date(leadArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>By {leadArticle.author}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest group-hover:text-coral transition-colors leading-tight">
                  <Link href={`/newspaper/${leadArticle.slug}`}>
                    {leadArticle.title}
                  </Link>
                </h3>

                {leadArticle.subtitle && (
                  <p className="text-sm text-ink-light font-sans leading-relaxed">
                    {leadArticle.subtitle}
                  </p>
                )}

                <div className="pt-4 border-t border-editorial-border flex items-center justify-between">
                  <span className="text-xs font-mono text-ink-muted">
                    {leadArticle.viewCount || 0} Reader Views
                  </span>
                  <Link
                    href={`/newspaper/${leadArticle.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-serif font-bold text-coral uppercase tracking-wider hover:text-coral-dark"
                  >
                    <span>Read Full Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Secondary Stories Stack (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {secondaryArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/newspaper/${art.slug}`}
                  className="flex gap-4 p-4 rounded-xl bg-white border border-editorial-border hover:border-forest/40 transition-all group shadow-subtle"
                >
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-24 sm:w-28 h-24 sm:h-28 object-cover rounded-lg border border-editorial-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-coral font-bold block mb-1">
                        {art.category}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-forest group-hover:text-coral transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-ink-muted mt-2">
                      {new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. MAGAZINE COVER SHOWCASE (MODERN PRINTED LUXURY) */}
      {featuredMagazine && (
        <section className="bg-forest text-white py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Asymmetrical Cover Presentation (5 cols) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-2 bg-gradient-to-r from-coral/30 to-coral/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-forest-950 p-2">
                    <img
                      src={featuredMagazine.coverImage}
                      alt={featuredMagazine.title}
                      className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-5 left-5 right-5 bg-forest/90 backdrop-blur-md p-3 rounded-lg border border-white/15 flex items-center justify-between text-xs text-white">
                      <span className="font-serif font-bold text-coral-light">
                        {featuredMagazine.editionNumber}
                      </span>
                      <span className="font-mono text-[11px] text-white/80">
                        {featuredMagazine.pageCount} Pages • {featuredMagazine.fileSize}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Magazine Editorial Copy (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-coral text-white text-xs font-serif uppercase tracking-widest font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Flagship Archival Publication</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                  {featuredMagazine.title}
                </h2>

                <p className="font-editorial italic text-white/90 text-lg sm:text-xl leading-relaxed">
                  {featuredMagazine.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs">
                  <div>
                    <span className="text-white/60 font-mono block text-[10px] uppercase">
                      Editorial Director
                    </span>
                    <span className="font-serif font-bold text-white">{featuredMagazine.author}</span>
                  </div>
                  <div>
                    <span className="text-white/60 font-mono block text-[10px] uppercase">
                      Class Editors
                    </span>
                    <span className="font-serif font-bold text-white">{featuredMagazine.editor}</span>
                  </div>
                  <div>
                    <span className="text-white/60 font-mono block text-[10px] uppercase">
                      Publication Date
                    </span>
                    <span className="font-mono font-bold text-coral-light">{featuredMagazine.publicationDate}</span>
                  </div>
                </div>

                <div className="pt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/magazine/${featuredMagazine.id}`}
                    className="px-8 py-3.5 bg-coral hover:bg-coral-dark text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-coral flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-white" />
                    <span>Launch Online PDF Reader</span>
                  </Link>

                  <a
                    href={featuredMagazine.pdfUrl}
                    download
                    className="px-6 py-3.5 bg-forest-800 hover:bg-forest-700 text-white border border-white/20 font-serif text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-coral-light" />
                    <span>Download Archival PDF</span>
                  </a>

                  <Link
                    href="/magazine"
                    className="text-xs font-serif uppercase tracking-wider text-white/80 hover:text-coral-light transition-colors ml-2 font-medium"
                  >
                    All Past Editions &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. CINEMATIC VIDEO CENTER */}
      {featuredVideo && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-editorial-border pb-4 mb-10 gap-4">
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-coral mb-1 flex items-center gap-2 font-bold">
                <Video className="w-4 h-4 text-coral" />
                Alif Creations 12 Media Center
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
                Cinematic Reels & Documentaries
              </h2>
            </div>
            <a
              href={settings.officialYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase font-serif tracking-widest text-forest hover:text-coral flex items-center gap-1.5 transition-colors font-bold"
            >
              <span>Subscribe on YouTube</span>
              <ExternalLink className="w-4 h-4 text-coral" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <VideoPlayer
                videoType={featuredVideo.videoType}
                youtubeUrl={featuredVideo.youtubeUrl}
                videoUrl={featuredVideo.videoUrl}
                thumbnailUrl={featuredVideo.thumbnailUrl}
                title={featuredVideo.title}
              />
            </div>

            <div className="lg:col-span-4 space-y-5 bg-white border border-editorial-border rounded-2xl p-6 sm:p-8 shadow-card">
              <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-forest-50 text-forest border border-forest-100 font-bold">
                {featuredVideo.category}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest leading-snug">
                {featuredVideo.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink-light leading-relaxed font-sans">
                {featuredVideo.description}
              </p>
              <div className="pt-4 border-t border-editorial-border text-xs font-mono text-ink-muted flex items-center justify-between">
                <span>Duration: {featuredVideo.duration}</span>
                <Link href="/videos" className="text-xs text-forest hover:text-coral font-serif font-bold uppercase tracking-wider">
                  Browse All Videos &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. CINEMATIC PROGRAMS & EXPEDITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-editorial-border pb-4 mb-10 gap-4">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-coral mb-1 flex items-center gap-2 font-bold">
              <Calendar className="w-4 h-4 text-coral" />
              Calendar of Class Conclaves
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
              Programs & Expeditions
            </h2>
          </div>
          <Link
            href="/programs"
            className="text-xs uppercase font-serif tracking-widest text-forest hover:text-coral flex items-center gap-1.5 transition-colors font-bold"
          >
            <span>View All Programs</span>
            <ChevronRight className="w-4 h-4 text-coral" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.slice(0, 3).map((prog) => (
            <div
              key={prog.id}
              className="bg-white border border-editorial-border hover:border-forest/40 rounded-2xl overflow-hidden shadow-card transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <Link href={`/programs/${prog.id}`} className="block relative aspect-video overflow-hidden bg-canvas">
                <img
                  src={prog.coverImage}
                  alt={prog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-forest text-white font-bold">
                  {prog.category}
                </span>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-coral font-mono mb-2 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{prog.date}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-forest group-hover:text-coral transition-colors mb-2">
                    <Link href={`/programs/${prog.id}`}>{prog.title}</Link>
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-ink-muted mb-3">
                    <MapPin className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                    <span className="truncate">{prog.location}</span>
                  </div>

                  <p className="text-xs text-ink-light line-clamp-2 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-editorial-border mt-4">
                  <Link
                    href={`/programs/${prog.id}`}
                    className="text-xs font-serif font-bold text-forest hover:text-coral flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>Explore Event Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PHOTO MEMORIES (ASYMMETRICAL VISUAL ARCHIVE) */}
      <section className="bg-white border-y border-editorial-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-editorial-border pb-4 mb-10 gap-4">
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-coral mb-1 flex items-center gap-2 font-bold">
                <ImageIcon className="w-4 h-4 text-coral" />
                Photographic Heritage
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
                Selected Class Memories
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs uppercase font-serif tracking-widest text-forest hover:text-coral flex items-center gap-1.5 transition-colors font-bold"
            >
              <span>Open Photo Archive</span>
              <ChevronRight className="w-4 h-4 text-coral" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.slice(0, 3).map((alb) => (
              <Link
                key={alb.id}
                href={`/gallery/${alb.id}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-editorial-border shadow-card block bg-canvas"
              >
                <img
                  src={alb.coverImage}
                  alt={alb.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-coral text-white font-bold inline-block mb-1">
                    {alb.category} • {alb.photos?.length || 0} Photos
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-coral-light transition-colors drop-shadow">
                    {alb.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CLASS ACHIEVEMENTS & ANNOUNCEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Achievements (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-b border-editorial-border pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-coral flex items-center gap-1.5 font-bold">
                  <Trophy className="w-4 h-4" />
                  Honours & Accolades
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
                  Class Achievements
                </h3>
              </div>
              <Link href="/achievements" className="text-xs font-serif uppercase tracking-wider text-forest hover:text-coral font-bold">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {achievements.slice(0, 3).map((ach) => (
                <div
                  key={ach.id}
                  className="p-4 rounded-xl bg-white border border-editorial-border flex items-center gap-4 hover:border-forest/40 transition-colors shadow-subtle"
                >
                  <img
                    src={ach.imageUrl}
                    alt={ach.title}
                    className="w-16 h-16 rounded-lg object-cover border border-editorial-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-forest-50 text-forest font-bold">
                        {ach.badgeTitle || ach.category}
                      </span>
                      <span className="text-[10px] font-mono text-ink-muted">{ach.date}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-forest truncate">{ach.title}</h4>
                    <p className="text-xs text-ink-muted line-clamp-1">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b border-editorial-border pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-coral flex items-center gap-1.5 font-bold">
                  <Bell className="w-4 h-4" />
                  Official Dispatches
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
                  Latest Notices
                </h3>
              </div>
              <Link href="/announcements" className="text-xs font-serif uppercase tracking-wider text-forest hover:text-coral font-bold">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-xl bg-white border border-editorial-border space-y-2 hover:border-forest/40 transition-colors shadow-subtle"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-canvas text-forest font-bold">
                      {ann.category}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted">{ann.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-forest leading-snug">{ann.title}</h4>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLASS MEMBERS SECTION (IF ENABLED IN SETTINGS) */}
      {settings.membersSectionEnabled && members.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-editorial-border pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-coral font-bold block mb-2">
              Class Leadership & Fellowship
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest">
              The People of Alif Friends 12
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-2">
              Dedicated student directors, correspondents, and curators perpetuating our shared legacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.slice(0, 4).map((mem) => (
              <div
                key={mem.id}
                className="bg-white border border-editorial-border rounded-2xl p-6 text-center hover:border-forest/40 transition-all flex flex-col items-center shadow-card"
              >
                <img
                  src={mem.photoUrl}
                  alt={mem.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-forest/30 mb-4 shadow-subtle"
                />
                <h4 className="font-serif font-bold text-base text-forest">{mem.name}</h4>
                <span className="text-xs text-coral font-medium block mt-0.5 mb-3">{mem.position}</span>
                <p className="text-xs text-ink-muted line-clamp-2 font-sans mb-4">{mem.bio}</p>
                {mem.quote && (
                  <p className="text-[11px] font-serif italic text-ink-light border-t border-editorial-border pt-3 w-full">
                    &ldquo;{mem.quote}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-editorial-border hover:border-forest text-xs font-serif uppercase tracking-wider text-forest hover:text-coral transition-colors font-bold shadow-subtle"
            >
              <span>Explore Complete Class Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
