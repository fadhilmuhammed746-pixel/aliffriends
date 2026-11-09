import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  MapPin,
  ExternalLink,
  ChevronRight,
  Quote,
  Sparkles,
} from 'lucide-react';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { DownloadAppButton } from '@/components/pwa';
import {
  Container,
  SectionHeader,
  Button,
  Badge,
  Card,
} from '@/components/ui';

export const revalidate = 0;

export default async function HomePage() {
  const [
    settings,
    magazines,
    articles,
    programs,
    videos,
    albums,
    achievements,
    announcements,
    members,
  ] = await Promise.all([
    db.getSettings(),
    db.getMagazines(true),
    db.getArticles(true),
    db.getPrograms(true),
    db.getVideos(true),
    db.getAlbums(true),
    db.getAchievements(true),
    db.getAnnouncements(true),
    db.getMembers(true),
  ]);

  const featuredMagazine = magazines.find((m) => m.isFeatured) || magazines[0];
  const leadArticle = articles.find((a) => a.headlineStatus) || articles[0];
  const secondaryArticles = articles.filter((a) => a.id !== leadArticle?.id).slice(0, 4);
  const featuredVideo = videos.find((v) => v.isFeatured) || videos[0];

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 overflow-hidden bg-canvas text-ink">
      {/* 1. CINEMATIC EDITORIAL HERO */}
      <section className="relative w-full border-b border-editorial-border overflow-hidden">
        <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center bg-forest-950">
          {/* Background Cinematic Photo */}
          <div className="absolute inset-0">
            <img
              src={settings.heroImage}
              alt="Alif Friends 12 Class Cohort"
              className="w-full h-full object-cover object-center filter brightness-90 transform scale-100 transition-transform duration-1000 ease-editorial hover:scale-105"
            />
            {/* Multi-layered Forest Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/75 to-forest-950/40" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-forest-950/50 to-forest-950 pointer-events-none" />
          </div>

          <Container className="relative z-10 py-16 sm:py-24 text-center sm:text-left flex flex-col justify-between h-full">
            {/* Top Running Folio Line */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/15 pb-4 mb-8 sm:mb-12 text-xs font-mono text-canvas-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                <span className="font-semibold text-white uppercase tracking-tag">
                  Vol. XII • Issue 2026
                </span>
              </div>
              <div className="hidden sm:block italic font-cormorant text-sm text-canvas-muted">
                The Official Digital Publication & Archival Record
              </div>
              <div className="text-right text-[11px] font-mono text-canvas-muted">
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>

            {/* Main Headline & Call to Action */}
            <div className="max-w-4xl space-y-6 sm:space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-serif uppercase tracking-tag backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-coral-light" />
                <span>Modern Editorial Luxury</span>
              </div>

              <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.95]">
                ALIF <span className="italic font-normal font-cormorant text-coral-light">Friends</span>{' '}
                <span className="text-white font-sans font-black tracking-normal align-middle inline-block text-3xl sm:text-5xl md:text-6xl border border-coral bg-coral/20 px-3 py-0.5 rounded-xl ml-1">
                  12
                </span>
              </h1>

              <div className="space-y-3 max-w-2xl">
                <p className="font-cormorant italic text-xl sm:text-2xl md:text-3xl text-coral-light leading-snug">
                  &ldquo;{settings.tagline}&rdquo;
                </p>
                <p className="font-sans text-sm sm:text-base text-canvas-warm/85 leading-relaxed">
                  {settings.heroSubheading}
                </p>
              </div>

              {/* CTAs: Primary Coral CTA + Ghost Light + Premium Download App Button */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <Button
                  href="/magazine"
                  variant="coral"
                  size="lg"
                  icon={<BookOpen className="w-4 h-4" />}
                >
                  Explore Magazine XII
                </Button>

                <Button
                  href="/newspaper"
                  variant="ghost-light"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4 text-coral-light" />}
                >
                  Read The Newsroom
                </Button>

                <DownloadAppButton variant="hero" />
              </div>

              {/* Micro-Stats Bar */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-10 text-xs font-mono text-canvas-muted">
                <div>
                  <span className="text-white font-bold block text-sm">Class of 12</span>
                  <span>Academic Cohort</span>
                </div>
                <div className="text-forest-700">•</div>
                <div>
                  <span className="text-coral-light font-bold block text-sm">{magazines.length} Editions</span>
                  <span>Print & Digital PDF</span>
                </div>
                <div className="text-forest-700">•</div>
                <div>
                  <span className="text-white font-bold block text-sm">{articles.length} Dispatches</span>
                  <span>Newsroom Features</span>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* 2. THE DIGITAL NEWSROOM & FEATURED LEAD STORY */}
      <Container>
        <SectionHeader
          eyebrow="The Digital Newsroom"
          eyebrowColor="coral"
          title="Latest Dispatches & Headlines"
          subtitle="Investigative journalism, event coverage, and editorial commentary from our student press."
          actionHref="/newspaper"
          actionLabel="Visit Full Newsroom"
        />

        {leadArticle && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Lead Story Card (7 cols) */}
            <Card
              className="lg:col-span-7 p-0 group overflow-hidden border border-editorial-border shadow-card hover:border-forest/40 transition-all"
              hoverEffect={true}
            >
              <Link href={`/newspaper/${leadArticle.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-canvas">
                <img
                  src={leadArticle.coverImage}
                  alt={leadArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="forest">{leadArticle.category}</Badge>
                  {leadArticle.breakingStatus && (
                    <Badge variant="urgent" icon={<Flame className="w-3 h-3" />}>
                      Breaking
                    </Badge>
                  )}
                </div>
              </Link>

              <div className="p-6 sm:p-8 lg:p-10 space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono text-ink-muted">
                  <span>{new Date(leadArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <span>By {leadArticle.author}</span>
                  <span>•</span>
                  <span>4 min read</span>
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
                    className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-coral uppercase tracking-tag hover:text-coral-dark"
                  >
                    <span>Read Full Dispatch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Card>

            {/* Stacked Headlines (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {secondaryArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/newspaper/${art.slug}`}
                  className="flex gap-4 p-4 rounded-xl bg-white border border-editorial-border hover:border-forest/40 transition-all duration-300 group shadow-card hover:-translate-y-0.5"
                >
                  <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-lg overflow-hidden border border-editorial-border flex-shrink-0 bg-canvas">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-tag text-coral font-bold block mb-1">
                        {art.category}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-forest group-hover:text-coral transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-ink-muted mt-2">
                      <span>{new Date(art.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>3 min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* 3. MAGAZINE PRINT-STYLE COVER SHOWCASE */}
      {featuredMagazine && (
        <section className="bg-forest py-20 relative overflow-hidden text-white border-y border-forest-800">
          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* 3:4 Print-Style Cover with realistic soft shadow & tilt */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-2 bg-gradient-to-r from-coral/25 to-coral/5 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity" />
                  <div className="magazine-cover-3-4 relative rounded-xl overflow-hidden bg-forest-950 border border-white/20 p-2 group">
                    <img
                      src={featuredMagazine.coverImage}
                      alt={featuredMagazine.title}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-500 ease-editorial group-hover:scale-[1.03]"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-forest-950/90 backdrop-blur-md p-3 rounded-lg border border-white/15 flex items-center justify-between text-xs text-white">
                      <span className="font-serif font-bold text-coral-light tracking-wide">
                        {featuredMagazine.editionNumber}
                      </span>
                      <span className="font-mono text-[11px] text-canvas-muted">
                        {featuredMagazine.pageCount} Pages • {featuredMagazine.fileSize}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Magazine Editorial Copy */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral/20 border border-coral/30 text-coral-light text-xs font-serif uppercase tracking-tag font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Flagship Archival Publication</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                  {featuredMagazine.title}
                </h2>

                <p className="font-cormorant italic text-canvas-warm/95 text-lg sm:text-xl leading-relaxed">
                  {featuredMagazine.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs">
                  <div>
                    <span className="text-canvas-muted font-mono block text-[10px] uppercase tracking-tag">
                      Editorial Director
                    </span>
                    <span className="font-serif font-bold text-white text-sm">{featuredMagazine.author}</span>
                  </div>
                  <div>
                    <span className="text-canvas-muted font-mono block text-[10px] uppercase tracking-tag">
                      Class Editors
                    </span>
                    <span className="font-serif font-bold text-white text-sm">{featuredMagazine.editor}</span>
                  </div>
                  <div>
                    <span className="text-canvas-muted font-mono block text-[10px] uppercase tracking-tag">
                      Publication Date
                    </span>
                    <span className="font-mono font-bold text-coral-light text-sm">{featuredMagazine.publicationDate}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Button
                    href={`/magazine/${featuredMagazine.id}`}
                    variant="coral"
                    size="md"
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    Launch Interactive Flipbook
                  </Button>

                  <a
                    href={`/api/magazines/${featuredMagazine.id}/download`}
                    download={`${featuredMagazine.title}.pdf`}
                    className="inline-flex items-center justify-center font-serif font-bold uppercase tracking-widest text-xs px-5 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white border border-white/20 transition-all gap-2 shadow-subtle"
                  >
                    <Download className="w-4 h-4 text-coral-light" />
                    <span>Download PDF</span>
                  </a>

                  <Link
                    href="/magazine"
                    className="text-xs font-serif uppercase tracking-tag text-canvas-muted hover:text-coral-light transition-colors font-semibold ml-2"
                  >
                    All Past Editions &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 4. CINEMATIC VIDEO CENTER */}
      {featuredVideo && (
        <section className="bg-forest-950 text-canvas py-20 border-y border-forest-800">
          <Container>
            <SectionHeader
              dark={true}
              eyebrow="Cinematic Video Center"
              eyebrowColor="coral"
              title="Reels, Documentaries & Broadcasts"
              subtitle="Immersive visual retrospectives, high-definition captures, and student cinematic productions."
              actionHref="/videos"
              actionLabel="View All Videos"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* 16:9 Video Player */}
              <div className="lg:col-span-8 rounded-xl overflow-hidden border border-forest-800 shadow-2xl">
                <VideoPlayer
                  videoType={featuredVideo.videoType}
                  youtubeUrl={featuredVideo.youtubeUrl}
                  videoUrl={featuredVideo.videoUrl}
                  thumbnailUrl={featuredVideo.thumbnailUrl}
                  title={featuredVideo.title}
                />
              </div>

              {/* Video Info Card */}
              <Card
                variant="dark"
                className="lg:col-span-4 space-y-4 p-6 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="dark">{featuredVideo.category}</Badge>
                  <span className="font-mono text-xs text-coral-light font-bold">
                    {featuredVideo.duration}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                  {featuredVideo.title}
                </h3>

                <p className="text-xs sm:text-sm text-canvas-muted leading-relaxed font-sans">
                  {featuredVideo.description}
                </p>

                <div className="pt-4 border-t border-forest-800 flex items-center justify-between text-xs">
                  <a
                    href={settings.officialYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-coral-light hover:text-white font-serif uppercase tracking-tag text-[11px] font-bold"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href="/videos"
                    className="text-canvas-muted hover:text-coral-light font-serif uppercase tracking-tag text-[11px] font-bold"
                  >
                    Full Archive &rarr;
                  </Link>
                </div>
              </Card>
            </div>
          </Container>
        </section>
      )}

      {/* 5. PROGRAMS & CONCLAVES */}
      <Container>
        <SectionHeader
          eyebrow="Calendar of Class Conclaves"
          eyebrowColor="forest"
          title="Programs & Expeditions"
          subtitle="Official ceremonies, academic convocations, and collective travels commemorated."
          actionHref="/programs"
          actionLabel="View All Programs"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.slice(0, 3).map((prog) => (
            <Card
              key={prog.id}
              className="p-0 flex flex-col justify-between group"
              hoverEffect={true}
            >
              <Link href={`/programs/${prog.id}`} className="block relative aspect-video overflow-hidden bg-canvas">
                <img
                  src={prog.coverImage}
                  alt={prog.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
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

                  <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed font-sans">
                    {prog.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-editorial-border mt-4">
                  <Link
                    href={`/programs/${prog.id}`}
                    className="text-xs font-serif font-bold text-forest hover:text-coral flex items-center gap-1 uppercase tracking-tag"
                  >
                    <span>Explore Event Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>

      {/* 6. PHOTO MEMORIES (MASONRY ARCHIVE) */}
      <section className="bg-canvas-warm border-y border-editorial-border py-20">
        <Container>
          <SectionHeader
            eyebrow="Photographic Heritage"
            eyebrowColor="coral"
            title="Selected Class Memories"
            subtitle="Curated albums capturing spontaneous fellowship, landmark ceremonies, and shared milestones."
            actionHref="/gallery"
            actionLabel="Open Photo Archive"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.slice(0, 3).map((alb) => (
              <Card
                key={alb.id}
                className="p-0 group relative aspect-[4/3] overflow-hidden"
                hoverEffect={true}
              >
                <Link href={`/gallery/${alb.id}`} className="block w-full h-full">
                  <img
                    src={alb.coverImage}
                    alt={alb.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/25 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <Badge variant="coral" className="mb-2">
                      {alb.category} • {alb.photos?.length || 0} Photos
                    </Badge>
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-coral-light transition-colors drop-shadow">
                      {alb.title}
                    </h3>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. CLASS ACHIEVEMENTS & ANNOUNCEMENTS */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Achievements (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-b border-editorial-border pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-tag text-coral flex items-center gap-1.5 font-bold">
                  <Trophy className="w-4 h-4" />
                  Honours & Accolades
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
                  Class Achievements
                </h3>
              </div>
              <Link href="/achievements" className="text-xs font-serif uppercase tracking-tag text-forest hover:text-coral font-bold">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {achievements.slice(0, 3).map((ach) => (
                <div
                  key={ach.id}
                  className="p-4 rounded-xl bg-white border border-editorial-border flex items-center gap-4 hover:border-forest/40 transition-colors shadow-card"
                >
                  <img
                    src={ach.imageUrl}
                    alt={ach.title}
                    className="w-16 h-16 rounded-lg object-cover border border-editorial-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="forest" size="sm">
                        {ach.badgeTitle || ach.category}
                      </Badge>
                      <span className="text-[10px] font-mono text-ink-muted">{ach.date}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-forest truncate">{ach.title}</h4>
                    <p className="text-xs text-ink-muted line-clamp-1 font-sans">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements with Priority-coded Left Border (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b border-editorial-border pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-tag text-coral flex items-center gap-1.5 font-bold">
                  <Bell className="w-4 h-4" />
                  Official Dispatches
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
                  Latest Notices
                </h3>
              </div>
              <Link href="/announcements" className="text-xs font-serif uppercase tracking-tag text-forest hover:text-coral font-bold">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {announcements.slice(0, 3).map((ann) => {
                // Priority-coded left border: coral = high/urgent, forest = medium/general, grey = low/info
                const priorityBorder =
                  ann.priority === 'high'
                    ? 'border-l-4 border-l-coral'
                    : ann.priority === 'medium'
                    ? 'border-l-4 border-l-forest'
                    : 'border-l-4 border-l-ink-subtle';

                return (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-xl bg-white border border-editorial-border space-y-2 hover:border-forest/40 transition-colors shadow-card ${priorityBorder}`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={ann.priority === 'high' ? 'coral' : 'muted'}
                        size="sm"
                      >
                        {ann.category}
                      </Badge>
                      <span className="text-[10px] font-mono text-ink-muted">{ann.date}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-forest leading-snug">{ann.title}</h4>
                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 font-sans">{ann.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>

      {/* 8. CLASS MEMBERS SECTION (PORTRAIT CARDS + CORMORANT QUOTE) */}
      {settings.membersSectionEnabled && members.length > 0 && (
        <section className="border-t border-editorial-border pt-16">
          <Container>
            <SectionHeader
              centered={true}
              eyebrow="Class Leadership & Fellowship"
              eyebrowColor="coral"
              title="The People of Alif Friends 12"
              subtitle="Dedicated student directors, correspondents, and curators perpetuating our shared legacy."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.slice(0, 4).map((mem) => (
                <Card
                  key={mem.id}
                  className="p-6 text-center hover:border-forest/40 transition-all flex flex-col items-center"
                  hoverEffect={true}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-forest/20 mb-4 shadow-subtle">
                    <img
                      src={mem.photoUrl}
                      alt={mem.name}
                      className="w-full h-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
                    />
                  </div>
                  <h4 className="font-serif font-bold text-base text-forest">{mem.name}</h4>
                  <span className="text-xs text-coral font-medium block mt-0.5 mb-2 font-sans">{mem.position}</span>
                  <p className="text-xs text-ink-muted line-clamp-2 font-sans mb-3">{mem.bio}</p>
                  {mem.quote && (
                    <p className="text-xs font-cormorant italic text-ink-light border-t border-editorial-border pt-3 w-full">
                      &ldquo;{mem.quote}&rdquo;
                    </p>
                  )}
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button href="/members" variant="ghost" size="md">
                Explore Complete Class Directory &rarr;
              </Button>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
