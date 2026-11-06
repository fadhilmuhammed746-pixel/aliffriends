import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  BookOpen,
  Newspaper,
  Calendar,
  Video,
  Image as ImageIcon,
  Users,
  Trophy,
  Bell,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  FolderOpen,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const magazines = db.getMagazines(false);
  const articles = db.getArticles(false);
  const programs = db.getPrograms(false);
  const videos = db.getVideos(false);
  const albums = db.getAlbums(false);
  const members = db.getMembers(false);
  const achievements = db.getAchievements(false);
  const announcements = db.getAnnouncements(false);
  const messages = db.getMessages();

  const totalPhotos = albums.reduce((acc, alb) => acc + (alb.photos?.length || 0), 0);

  const stats = [
    {
      label: 'Magazines',
      count: magazines.length,
      published: magazines.filter((m) => m.isPublished).length,
      href: '/admin/magazines',
      icon: BookOpen,
    },
    {
      label: 'Newspaper Articles',
      count: articles.length,
      published: articles.filter((a) => a.isPublished).length,
      href: '/admin/newspaper',
      icon: Newspaper,
    },
    {
      label: 'Programs & Conclaves',
      count: programs.length,
      published: programs.filter((p) => p.isPublished).length,
      href: '/admin/programs',
      icon: Calendar,
    },
    {
      label: 'Cinematic Videos',
      count: videos.length,
      published: videos.filter((v) => v.isPublished).length,
      href: '/admin/videos',
      icon: Video,
    },
    {
      label: 'Photo Albums',
      count: albums.length,
      published: totalPhotos,
      unit: 'photos',
      href: '/admin/gallery',
      icon: ImageIcon,
    },
    {
      label: 'Class Members',
      count: members.length,
      published: members.filter((m) => m.isPublished).length,
      href: '/admin/members',
      icon: Users,
    },
  ];

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Editorial Control Room"
          subtitle="Real-time administration, content publishing, and media archival management."
          action={
            <Link
              href="/admin/newspaper"
              className="px-3.5 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-gold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Draft New Story</span>
            </Link>
          }
        />

        <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className="bg-charcoal border border-gold/20 hover:border-gold/50 rounded-xl p-4 transition-all duration-300 group hover:-translate-y-0.5 shadow-lg"
                >
                  <div className="flex items-center justify-between text-muted-light mb-3">
                    <span className="text-[11px] font-serif uppercase tracking-wider text-ivory/80">
                      {s.label}
                    </span>
                    <Icon className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-ivory mb-1">
                    {s.count}
                  </div>
                  <div className="text-[11px] font-mono text-gold/80 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-gold" />
                    <span>
                      {s.published} {s.unit || 'published'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-charcoal border border-gold/25 rounded-2xl p-6">
            <h2 className="font-serif text-sm uppercase tracking-widest text-gold font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gold" />
              <span>Quick Editorial Actions</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <Link
                href="/admin/newspaper"
                className="p-3 bg-navy hover:bg-navy-light border border-gold/15 hover:border-gold rounded-xl text-center transition-all group"
              >
                <Newspaper className="w-5 h-5 text-gold mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-medium text-ivory block">
                  Write Article
                </span>
              </Link>

              <Link
                href="/admin/magazines"
                className="p-3 bg-navy hover:bg-navy-light border border-gold/15 hover:border-gold rounded-xl text-center transition-all group"
              >
                <BookOpen className="w-5 h-5 text-gold mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-medium text-ivory block">
                  Upload Magazine
                </span>
              </Link>

              <Link
                href="/admin/programs"
                className="p-3 bg-navy hover:bg-navy-light border border-gold/15 hover:border-gold rounded-xl text-center transition-all group"
              >
                <Calendar className="w-5 h-5 text-gold mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-medium text-ivory block">
                  Add Program
                </span>
              </Link>

              <Link
                href="/admin/videos"
                className="p-3 bg-navy hover:bg-navy-light border border-gold/15 hover:border-gold rounded-xl text-center transition-all group"
              >
                <Video className="w-5 h-5 text-gold mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-medium text-ivory block">
                  Publish Video
                </span>
              </Link>

              <Link
                href="/admin/gallery"
                className="p-3 bg-navy hover:bg-navy-light border border-gold/15 hover:border-gold rounded-xl text-center transition-all group"
              >
                <ImageIcon className="w-5 h-5 text-gold mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-medium text-ivory block">
                  Create Album
                </span>
              </Link>
            </div>
          </div>

          {/* Two-Column Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Articles */}
            <div className="bg-charcoal border border-gold/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 border-b border-gold/15 pb-3">
                <h3 className="font-serif text-sm uppercase tracking-widest text-gold font-bold">
                  Recent Newspaper Publications
                </h3>
                <Link
                  href="/admin/newspaper"
                  className="text-xs text-muted-light hover:text-gold flex items-center gap-1 font-mono"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {articles.slice(0, 4).map((art) => (
                  <div
                    key={art.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-navy/60 border border-gold/10 hover:border-gold/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                          {art.category}
                        </span>
                        {art.breakingStatus && (
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
                            Breaking
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-serif font-semibold text-ivory truncate">
                        {art.title}
                      </h4>
                      <span className="text-[11px] text-muted-light">
                        By {art.author} • {art.viewCount || 0} views
                      </span>
                    </div>

                    <Link
                      href={`/newspaper/${art.slug}`}
                      target="_blank"
                      className="p-2 text-ivory/60 hover:text-gold hover:bg-charcoal rounded transition-colors"
                      title="Preview Article"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiries & Messages */}
            <div className="bg-charcoal border border-gold/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 border-b border-gold/15 pb-3">
                <h3 className="font-serif text-sm uppercase tracking-widest text-gold font-bold">
                  Editorial Desk Inquiries ({messages.length})
                </h3>
                <span className="text-[11px] font-mono text-muted-light">
                  Direct Messages
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-light text-xs font-sans">
                  No pending inquiries. All transmissions up to date.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.slice(0, 4).map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-xl bg-navy/60 border border-gold/10 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-ivory">
                          {msg.name}
                        </span>
                        <span className="text-[10px] font-mono text-gold/70">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gold-light/90 text-xs font-medium">
                        {msg.subject}
                      </p>
                      <p className="text-muted-light line-clamp-1 text-[11px]">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
