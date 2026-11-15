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
  ScrollReveal,
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
            {/* Multi-layered Forest Gradient Overlay & Ambient Auroras */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/75 to-forest-950/40" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-forest-950/50 to-forest-950 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-coral/20 blur-[120px] pointer-events-none animate-aurora" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-forest-600/30 blur-[100px] pointer-events-none animate-float-slow" />
          </div>

          <Container className="relative z-10 py-16 sm:py-24 text-center sm:text-left flex flex-col justify-between h-full">
            {/* Top Running Folio Line */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/15 pb-4 mb-8 sm:mb-12 text-xs font-mono text-canvas-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                <span className="font-semibold text-white uppercase tracking-tag">
                  THE 12TH BATCH · DARUL FALAH ISLAMIC ACADEMY
                </span>
              </div>
              <div className="hidden sm:block font-serif tracking-widest text-xs uppercase text-coral-light">
                Taliparamba · Kannur · Kerala
              </div>
              <div className="text-right text-[11px] font-mono text-canvas-muted">
                Official Digital Archive
              </div>
            </div>

            {/* Main Headline & Call to Action */}
            <div className="max-w-4xl space-y-6 sm:space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-serif uppercase tracking-tag backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-coral-light" />
                <span>The 12th Batch of Darul Falah Islamic Academy</span>
              </div>

              <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[0.95]">
                ALIF <span className="italic font-normal font-cormorant text-coral-light">Friends</span>{' '}
                <span className="text-white font-sans font-black tracking-normal align-middle inline-block text-3xl sm:text-5xl md:text-6xl border border-coral bg-coral/20 px-3 py-0.5 rounded-xl ml-1 shadow-coral animate-glow-pulse">
                  12
                </span>
              </h1>

              <div className="space-y-3 max-w-2xl">
                <p className="font-cormorant italic text-xl sm:text-2xl md:text-3xl text-coral-light leading-snug">
                  &ldquo;A Class. A Generation. A Thousand Memories.&rdquo;
                </p>
                <p className="font-sans text-sm sm:text-base text-canvas-warm/90 leading-relaxed">
                  ALIF FRIENDS 12 is the digital home of the 12th batch of Darul Falah Islamic Academy, located in Taliparamba, Kannur, Kerala. It is a digital archive created to preserve the friendship, learning experiences, publications, achievements, creative activities, competitions, events and unforgettable memories of our batch.
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
        <ScrollReveal animation="fade-up">
          <SectionHeader
            eyebrow="The Digital Newsroom"
            eyebrowColor="coral"
            title="Latest Dispatches & Headlines"
            subtitle="Discover stories, updates, articles and highlights from our class community."
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
        </ScrollReveal>
      </Container>

      {/* 3. MAGAZINE PRINT-STYLE COVER SHOWCASE */}
      {featuredMagazine && (
        <section className="bg-forest py-20 relative overflow-hidden text-white border-y border-forest-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-coral/10 rounded-full blur-[100px] pointer-events-none animate-float-slow" />
          <Container className="relative z-10">
            <ScrollReveal animation="fade-up">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* 3:4 Print-Style Cover with realistic soft shadow & tilt */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative group max-w-sm w-full">
                    <div className="absolute -inset-4 bg-gradient-to-r from-coral/30 to-amber-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
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
                    <span>Digital Magazine Collection</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                    {featuredMagazine.title}
                  </h2>

                  <p className="font-sans text-sm sm:text-base text-canvas-warm/90 leading-relaxed">
                    Explore the creative thoughts, literary contributions and publications of ALIF FRIENDS 12 through our digital magazine collection. Read each edition in an immersive page-flip experience.
                  </p>

                  <p className="font-cormorant italic text-coral-light text-lg sm:text-xl leading-relaxed">
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
                      className="inline-flex items-center justify-center font-serif font-bold uppercase tracking-widest text-xs px-5 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white border border-white/20 transition-all gap-2 shadow-subtle btn-shine hover:-translate-y-0.5"
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
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* 4. CINEMATIC VIDEO CENTER */}
      {featuredVideo && (
        <section className="bg-forest-950 text-canvas py-20 border-y border-forest-800 relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-forest-700/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
          <Container className="relative z-10">
            <ScrollReveal animation="fade-up">
              <SectionHeader
                dark={true}
                eyebrow="Alif Creations 12 Channel"
                eyebrowColor="coral"
                title="Cinematic Video Center"
                subtitle="Watch the videos, creative productions and memorable moments of ALIF FRIENDS 12."
                actionHref="/videos"
                actionLabel="View All Videos"
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* 16:9 Video Player */}
                <div className="lg:col-span-8 rounded-xl overflow-hidden border border-forest-800 shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
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
                  className="lg:col-span-4 space-y-4 p-6 sm:p-8 card-interactive"
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
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* 5. PROGRAMS & CONCLAVES */}
      <Container>
        <ScrollReveal animation="fade-up">
          <SectionHeader
            eyebrow="Educational & Cultural Programmes"
            eyebrowColor="forest"
            title="Programs & Conclaves"
            subtitle="Relive the educational, cultural, literary and social programmes that brought our batch together."
            actionHref="/programs"
            actionLabel="View All Programs"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.slice(0, 3).map((prog, index) => (
              <ScrollReveal key={prog.id} animation="fade-up" delay={index * 120}>
                <Card
                  className="p-0 flex flex-col justify-between group h-full"
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
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </Container>

      {/* 6. PHOTO MEMORIES (MASONRY ARCHIVE) */}
      <section className="bg-canvas-warm border-y border-editorial-border py-20 relative overflow-hidden">
        <Container>
          <ScrollReveal animation="fade-up">
            <SectionHeader
              eyebrow="Photographic Heritage & Memories"
              eyebrowColor="coral"
              title="Class Photo Gallery"
              subtitle="A collection of photographs preserving our friendships, campus life, celebrations, journeys and unforgettable experiences."
              actionHref="/gallery"
              actionLabel="Open Photo Archive"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.slice(0, 3).map((alb, index) => (
                <ScrollReveal key={alb.id} animation="fade-up" delay={index * 120}>
                  <Card
                    className="p-0 group relative aspect-[4/3] overflow-hidden"
                    hoverEffect={true}
                  >
                    <Link href={`/gallery/${alb.id}`} className="block w-full h-full">
                      <img
                        src={alb.coverImage}
                        alt={alb.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.05]"
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
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* 7. CLASS ACHIEVEMENTS & ANNOUNCEMENTS */}
      <Container>
        <ScrollReveal animation="fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Achievements (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border-b border-editorial-border pb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-mono tracking-tag text-coral flex items-center gap-1.5 font-bold">
                    <Trophy className="w-4 h-4 animate-float" />
                    Sports & Accolades
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
                    Class Achievements
                  </h3>
                </div>
                <Link href="/achievements" className="text-xs font-serif uppercase tracking-tag text-forest hover:text-coral font-bold">
                  View All &rarr;
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                Our journey in the SAAF Super League reflects the spirit of teamwork, determination, healthy competition and sportsmanship. Across two appearances, our batch secured the Runner-up position once and the Second Runner-up position once.
              </p>

              {/* SAAF Super League Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-950 text-white border border-forest-800 shadow-card space-y-3 relative overflow-hidden group card-interactive">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-coral-light font-bold">
                      One-time achievement
                    </span>
                    <Trophy className="w-4 h-4 text-coral animate-bounce-subtle" />
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-canvas-muted">
                      SAAF SUPER LEAGUE
                    </h4>
                    <p className="font-serif text-xl font-black text-white tracking-wide mt-0.5">
                      RUNNER-UP
                    </p>
                  </div>
                  <p className="text-[11px] text-canvas-muted/90 font-sans leading-relaxed">
                    Secured through outstanding team coordination, competitive grit, and sportsmanship.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-forest-900 to-forest-950 text-white border border-forest-800 shadow-card space-y-3 relative overflow-hidden group card-interactive">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-coral-light font-bold">
                      One-time achievement
                    </span>
                    <Trophy className="w-4 h-4 text-coral animate-bounce-subtle" />
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-canvas-muted">
                      SAAF SUPER LEAGUE
                    </h4>
                    <p className="font-serif text-xl font-black text-white tracking-wide mt-0.5">
                      SECOND RUNNER-UP
                    </p>
                  </div>
                  <p className="text-[11px] text-canvas-muted/90 font-sans leading-relaxed">
                    Achieved through spirited athletic effort, determination, and class unity.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {achievements.slice(0, 2).map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 rounded-xl bg-white border border-editorial-border flex items-center gap-4 hover:border-forest/40 transition-all shadow-card card-interactive"
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
                    <Bell className="w-4 h-4 animate-float" />
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
                  const priorityBorder =
                    ann.priority === 'high'
                      ? 'border-l-4 border-l-coral'
                      : ann.priority === 'medium'
                      ? 'border-l-4 border-l-forest'
                      : 'border-l-4 border-l-ink-subtle';

                  return (
                    <div
                      key={ann.id}
                      className={`p-4 rounded-xl bg-white border border-editorial-border space-y-2 hover:border-forest/40 transition-all shadow-card card-interactive ${priorityBorder}`}
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
        </ScrollReveal>
      </Container>

      {/* 8. CLASS MEMBERS SECTION (PORTRAIT CARDS + CORMORANT QUOTE) */}
      {settings.membersSectionEnabled && members.length > 0 && (
        <section className="border-t border-editorial-border pt-16">
          <Container>
            <ScrollReveal animation="fade-up">
              <SectionHeader
                centered={true}
                eyebrow="Class Leadership & Fellowship"
                eyebrowColor="coral"
                title="The People of Alif Friends 12"
                subtitle="Dedicated student directors, correspondents, and curators perpetuating our shared legacy."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.slice(0, 4).map((mem, index) => (
                  <ScrollReveal key={mem.id} animation="fade-up" delay={index * 100}>
                    <Card
                      className="p-6 text-center hover:border-forest/40 transition-all flex flex-col items-center h-full"
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
                  </ScrollReveal>
                ))}
              </div>

              <div className="text-center mt-10">
                <Button href="/members" variant="ghost" size="md">
                  Explore Complete Class Directory &rarr;
                </Button>
              </div>
            </ScrollReveal>
          </Container>
        </section>
      )}
    </div>
  );
}
