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

export const revalidate = 0; // Dynamic server rendering for instant CMS updates

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
  const secondaryArticles = articles.filter((a) => a.id !== leadArticle?.id).slice(0, 3);
  const featuredVideo = videos.find((v) => v.isFeatured) || videos[0];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. SIGNATURE HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-navy-950">
        {/* Cinematic Backdrop Image with Fine Grain & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroImage}
            alt="Alif Friends 12 Classroom Heritage"
            className="w-full h-full object-cover scale-105 animate-fade-in filter brightness-[0.45] contrast-[1.1] transition-transform duration-[12000ms] hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-navy/30 to-navy-950/90" />
        </div>

        {/* Hero Editorial Composition */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 flex flex-col items-center">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-serif uppercase tracking-widest mb-6 shadow-gold animate-fade-up">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{settings.heroBadge || 'Official Class Digital Publication & Media Platform'}</span>
          </div>

          {/* AF12 Identity Monogram & Large Title */}
          <div className="mb-4">
            <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-widest text-ivory drop-shadow-2xl uppercase">
              ALIF FRIENDS <span className="text-gold border-b-2 border-gold/60 pb-1">12</span>
            </h1>
          </div>

          {/* Official Tagline */}
          <p className="font-serif italic text-lg sm:text-2xl md:text-3xl text-gold-light/95 max-w-3xl mb-6 tracking-wide drop-shadow">
            &ldquo;{settings.tagline}&rdquo;
          </p>

          {/* Subheading Narrative */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-ivory/80 max-w-2xl leading-relaxed mb-10 font-normal">
            {settings.heroSubheading}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <Link
              href="/newspaper"
              className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-light text-navy font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-gold flex items-center justify-center gap-2 group"
            >
              <span>Discover Our Stories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/magazine"
              className="w-full sm:w-auto px-8 py-4 bg-charcoal/80 hover:bg-charcoal border border-gold/40 hover:border-gold text-ivory font-serif font-semibold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-gold" />
              <span>Explore Magazine Archive</span>
            </Link>
          </div>

          {/* Bottom Indicators */}
          <div className="mt-14 pt-8 border-t border-gold/20 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-ivory/70">
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold">12</span>
              <span>Academic Cohort</span>
            </div>
            <div className="text-gold/40">•</div>
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold">{magazines.length}</span>
              <span>Magazine Editions</span>
            </div>
            <div className="text-gold/40">•</div>
            <div className="flex items-center gap-2">
              <span className="text-gold font-bold">{articles.length}</span>
              <span>Dispatches & Reports</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LATEST EDITORIAL STORIES & NEWSPAPER HEADLINES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gold/20 pb-4 mb-10 gap-4">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-gold mb-1 flex items-center gap-2">
              <Flame className="w-4 h-4 text-gold" />
              The Digital Newsroom
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-ivory">
              Latest Editorial Dispatches
            </h2>
          </div>
          <Link
            href="/newspaper"
            className="text-xs uppercase font-serif tracking-widest text-gold hover:text-gold-light flex items-center gap-1.5 transition-colors font-semibold"
          >
            <span>Visit Full Newsroom</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {leadArticle && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Lead Article (7 cols) */}
            <div className="lg:col-span-7 bg-charcoal border border-gold/20 rounded-2xl overflow-hidden shadow-xl group hover:border-gold/40 transition-all">
              <Link href={`/newspaper/${leadArticle.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                <img
                  src={leadArticle.coverImage}
                  alt={leadArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-navy/90 text-gold border border-gold/30">
                    {leadArticle.category}
                  </span>
                  {leadArticle.breakingStatus && (
                    <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-500/40">
                      Breaking Story
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-6 sm:p-8">
                <span className="text-[11px] font-mono text-muted-light block mb-2">
                  Published: {new Date(leadArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • By {leadArticle.author}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory group-hover:text-gold transition-colors mb-3 leading-snug">
                  <Link href={`/newspaper/${leadArticle.slug}`}>
                    {leadArticle.title}
                  </Link>
                </h3>
                {leadArticle.subtitle && (
                  <p className="text-sm text-ivory/70 font-sans leading-relaxed mb-6">
                    {leadArticle.subtitle}
                  </p>
                )}
                <Link
                  href={`/newspaper/${leadArticle.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-serif font-bold text-gold uppercase tracking-wider hover:text-gold-light"
                >
                  <span>Read Complete Dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Secondary Articles List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {secondaryArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/newspaper/${art.slug}`}
                  className="flex gap-4 p-4 rounded-xl bg-charcoal border border-gold/15 hover:border-gold/40 transition-all group"
                >
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-24 sm:w-28 h-24 sm:h-28 object-cover rounded-lg border border-gold/20 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-gold block mb-1">
                        {art.category}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-semibold text-ivory group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-muted-light mt-2">
                      {new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. FEATURED DIGITAL MAGAZINE EDITION */}
      {featuredMagazine && (
        <section className="bg-charcoal border-y border-gold/20 py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Cover Preview (5 cols) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-2 bg-gradient-to-r from-gold/30 to-gold/10 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/50 bg-navy-950">
                    <img
                      src={featuredMagazine.coverImage}
                      alt={featuredMagazine.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-navy/90 backdrop-blur-md p-3 rounded-lg border border-gold/30 flex items-center justify-between text-xs text-ivory">
                      <span className="font-serif font-bold text-gold">
                        {featuredMagazine.editionNumber}
                      </span>
                      <span className="font-mono text-[11px] text-muted-light">
                        {featuredMagazine.pageCount} Pages • {featuredMagazine.fileSize}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Magazine Editorial Info (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gold/15 border border-gold/30 text-gold text-xs font-serif uppercase tracking-widest">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Flagship Archival Publication</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ivory tracking-wide leading-tight">
                  {featuredMagazine.title}
                </h2>

                <p className="font-serif italic text-gold text-base sm:text-lg">
                  {featuredMagazine.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-gold/15 text-xs">
                  <div>
                    <span className="text-muted-light font-mono block text-[10px] uppercase">
                      Editorial Director
                    </span>
                    <span className="font-serif font-bold text-ivory">{featuredMagazine.author}</span>
                  </div>
                  <div>
                    <span className="text-muted-light font-mono block text-[10px] uppercase">
                      Class Editors
                    </span>
                    <span className="font-serif font-bold text-ivory">{featuredMagazine.editor}</span>
                  </div>
                  <div>
                    <span className="text-muted-light font-mono block text-[10px] uppercase">
                      Publication Date
                    </span>
                    <span className="font-mono font-bold text-gold">{featuredMagazine.publicationDate}</span>
                  </div>
                </div>

                <div className="pt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/magazine/${featuredMagazine.id}`}
                    className="px-8 py-3.5 bg-gold hover:bg-gold-light text-navy font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-gold flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-navy" />
                    <span>Launch Online PDF Reader</span>
                  </Link>

                  <a
                    href={featuredMagazine.pdfUrl}
                    download
                    className="px-6 py-3.5 bg-navy hover:bg-navy-light text-ivory border border-gold/30 hover:border-gold font-serif text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-gold" />
                    <span>Download Archival PDF</span>
                  </a>

                  <Link
                    href="/magazine"
                    className="text-xs font-serif uppercase tracking-wider text-muted-light hover:text-gold transition-colors ml-2"
                  >
                    All Past Editions &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. CINEMATIC VIDEO HIGHLIGHTS */}
      {featuredVideo && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gold/20 pb-4 mb-10 gap-4">
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-gold mb-1 flex items-center gap-2">
                <Video className="w-4 h-4 text-gold" />
                Alif Creations 12 Media Center
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-ivory">
                Cinematic Class Reel & Highlights
              </h2>
            </div>
            <a
              href={settings.officialYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase font-serif tracking-widest text-gold hover:text-gold-light flex items-center gap-1.5 transition-colors font-semibold"
            >
              <span>Subscribe on YouTube</span>
              <ExternalLink className="w-4 h-4" />
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

            <div className="lg:col-span-4 space-y-5 bg-charcoal border border-gold/20 rounded-2xl p-6 sm:p-8">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                {featuredVideo.category}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory leading-snug">
                {featuredVideo.title}
              </h3>
              <p className="text-xs text-ivory/70 leading-relaxed font-sans">
                {featuredVideo.description}
              </p>
              <div className="pt-2 border-t border-gold/15 text-xs font-mono text-gold flex items-center justify-between">
                <span>Duration: {featuredVideo.duration}</span>
                <Link href="/videos" className="text-xs text-ivory/80 hover:text-gold font-serif underline">
                  Browse All Videos &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. RECENTLY PUBLISHED PROGRAMS & CONCLAVES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gold/20 pb-4 mb-10 gap-4">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-gold mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              Calendar of Class Conclaves
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-ivory">
              Programs & Expeditions
            </h2>
          </div>
          <Link
            href="/programs"
            className="text-xs uppercase font-serif tracking-widest text-gold hover:text-gold-light flex items-center gap-1.5 transition-colors font-semibold"
          >
            <span>View All Programs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.slice(0, 3).map((prog) => (
            <div
              key={prog.id}
              className="bg-charcoal border border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <Link href={`/programs/${prog.id}`} className="block relative aspect-video overflow-hidden">
                <img
                  src={prog.coverImage}
                  alt={prog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy/90 text-gold border border-gold/30">
                  {prog.category}
                </span>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-gold/90 font-mono mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{prog.date}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-ivory group-hover:text-gold transition-colors mb-2">
                    <Link href={`/programs/${prog.id}`}>{prog.title}</Link>
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-muted-light mb-3">
                    <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="truncate">{prog.location}</span>
                  </div>

                  <p className="text-xs text-ivory/70 line-clamp-2 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gold/15 mt-4">
                  <Link
                    href={`/programs/${prog.id}`}
                    className="text-xs font-serif font-bold text-gold hover:text-gold-light flex items-center gap-1 uppercase tracking-wider"
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

      {/* 6. SELECTED CLASS MEMORIES & PHOTO GALLERY */}
      <section className="bg-charcoal-deep border-y border-gold/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gold/20 pb-4 mb-10 gap-4">
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-gold mb-1 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gold" />
                Photographic Heritage
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-ivory">
                Selected Class Memories
              </h2>
            </div>
            <Link
              href="/gallery"
              className="text-xs uppercase font-serif tracking-widest text-gold hover:text-gold-light flex items-center gap-1.5 transition-colors font-semibold"
            >
              <span>Open Photo Archive</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.slice(0, 3).map((alb) => (
              <Link
                key={alb.id}
                href={`/gallery/${alb.id}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/30 shadow-2xl block"
              >
                <img
                  src={alb.coverImage}
                  alt={alb.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold text-navy font-bold inline-block mb-1">
                    {alb.category} • {alb.photos?.length || 0} Photos
                  </span>
                  <h3 className="font-serif text-lg font-bold text-ivory group-hover:text-gold transition-colors drop-shadow">
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
            <div className="border-b border-gold/20 pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-gold flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  Honors & Accolades
                </span>
                <h3 className="font-serif text-2xl font-bold text-ivory mt-1">
                  Class Achievements
                </h3>
              </div>
              <Link href="/achievements" className="text-xs font-serif uppercase tracking-wider text-gold hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {achievements.slice(0, 3).map((ach) => (
                <div
                  key={ach.id}
                  className="p-4 rounded-xl bg-charcoal border border-gold/15 flex items-center gap-4 hover:border-gold/40 transition-colors"
                >
                  <img
                    src={ach.imageUrl}
                    alt={ach.title}
                    className="w-16 h-16 rounded-lg object-cover border border-gold/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                        {ach.badgeTitle || ach.category}
                      </span>
                      <span className="text-[10px] font-mono text-muted-light">{ach.date}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-ivory truncate">{ach.title}</h4>
                    <p className="text-xs text-muted-light line-clamp-1">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b border-gold/20 pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-gold flex items-center gap-1.5">
                  <Bell className="w-4 h-4" />
                  Official Dispatches
                </span>
                <h3 className="font-serif text-2xl font-bold text-ivory mt-1">
                  Latest Notices
                </h3>
              </div>
              <Link href="/announcements" className="text-xs font-serif uppercase tracking-wider text-gold hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-xl bg-charcoal border border-gold/15 space-y-2 hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy text-gold border border-gold/20">
                      {ann.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted-light">{ann.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-ivory leading-snug">{ann.title}</h4>
                  <p className="text-xs text-muted-light leading-relaxed line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLASS MEMBERS SECTION (IF ENABLED IN SETTINGS) */}
      {settings.membersSectionEnabled && members.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gold/20 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-gold block mb-2">
              Class Leadership & Fellowship
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory">
              The People of Alif Friends 12
            </h2>
            <p className="text-xs text-muted-light mt-2">
              Dedicated student directors, correspondents, and curators perpetuating our shared legacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.slice(0, 4).map((mem) => (
              <div
                key={mem.id}
                className="bg-charcoal border border-gold/20 rounded-2xl p-6 text-center hover:border-gold/50 transition-all flex flex-col items-center"
              >
                <img
                  src={mem.photoUrl}
                  alt={mem.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gold/40 mb-4 shadow-gold"
                />
                <h4 className="font-serif font-bold text-base text-ivory">{mem.name}</h4>
                <span className="text-xs text-gold font-medium block mt-0.5 mb-3">{mem.position}</span>
                <p className="text-xs text-muted-light line-clamp-2 font-sans mb-4">{mem.bio}</p>
                {mem.quote && (
                  <p className="text-[11px] font-serif italic text-ivory/80 border-t border-gold/15 pt-3 w-full">
                    &ldquo;{mem.quote}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-charcoal border border-gold/30 hover:border-gold text-xs font-serif uppercase tracking-wider text-gold hover:text-gold-light transition-colors"
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
