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
  Plus,
  Eye,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { Badge, Card, Button } from '@/components/ui';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const [
    magazines,
    articles,
    programs,
    videos,
    albums,
    members,
    messages,
  ] = await Promise.all([
    db.getMagazines(false),
    db.getArticles(false),
    db.getPrograms(false),
    db.getVideos(false),
    db.getAlbums(false),
    db.getMembers(false),
    db.getMessages(),
  ]);

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
    <div className="flex w-full min-h-screen bg-canvas text-ink">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen">
        <AdminHeader
          title="Editorial Control Room"
          subtitle="Real-time administration, content publishing, and media archival management."
          action={
            <Button
              href="/admin/newspaper"
              variant="coral"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              iconPosition="left"
            >
              Draft New Story
            </Button>
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
                  className="bg-white border border-editorial-border hover:border-forest/40 rounded-xl p-5 transition-all duration-300 group hover:-translate-y-1 shadow-card"
                >
                  <div className="flex items-center justify-between text-ink-muted mb-3">
                    <span className="text-[11px] font-serif uppercase tracking-tag font-bold text-forest">
                      {s.label}
                    </span>
                    <Icon className="w-4 h-4 text-coral group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-serif font-black text-forest mb-1 leading-none">
                    {s.count}
                  </div>
                  <div className="text-[11px] font-mono text-ink-muted flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-forest" />
                    <span>
                      {s.published} {s.unit || 'published'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions Bar */}
          <Card className="p-6 sm:p-8 shadow-card">
            <h2 className="font-serif text-xs uppercase tracking-tag text-forest font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-coral" />
              <span>Quick Editorial Actions</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <Link
                href="/admin/newspaper"
                className="p-4 bg-canvas-warm hover:bg-forest-50 border border-editorial-border hover:border-forest/40 rounded-xl text-center transition-all group shadow-subtle"
              >
                <Newspaper className="w-5 h-5 text-forest mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-bold text-forest block uppercase tracking-wider">
                  Write Article
                </span>
              </Link>

              <Link
                href="/admin/magazines"
                className="p-4 bg-canvas-warm hover:bg-forest-50 border border-editorial-border hover:border-forest/40 rounded-xl text-center transition-all group shadow-subtle"
              >
                <BookOpen className="w-5 h-5 text-forest mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-bold text-forest block uppercase tracking-wider">
                  Upload Magazine
                </span>
              </Link>

              <Link
                href="/admin/programs"
                className="p-4 bg-canvas-warm hover:bg-forest-50 border border-editorial-border hover:border-forest/40 rounded-xl text-center transition-all group shadow-subtle"
              >
                <Calendar className="w-5 h-5 text-forest mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-bold text-forest block uppercase tracking-wider">
                  Add Program
                </span>
              </Link>

              <Link
                href="/admin/videos"
                className="p-4 bg-canvas-warm hover:bg-forest-50 border border-editorial-border hover:border-forest/40 rounded-xl text-center transition-all group shadow-subtle"
              >
                <Video className="w-5 h-5 text-forest mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-bold text-forest block uppercase tracking-wider">
                  Publish Video
                </span>
              </Link>

              <Link
                href="/admin/gallery"
                className="p-4 bg-canvas-warm hover:bg-forest-50 border border-editorial-border hover:border-forest/40 rounded-xl text-center transition-all group shadow-subtle"
              >
                <ImageIcon className="w-5 h-5 text-forest mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-serif font-bold text-forest block uppercase tracking-wider">
                  Create Album
                </span>
              </Link>
            </div>
          </Card>

          {/* Two-Column Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Articles */}
            <Card className="p-6 sm:p-8 shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-editorial-border pb-3">
                <h3 className="font-serif text-xs uppercase tracking-tag text-forest font-bold">
                  Recent Newspaper Publications
                </h3>
                <Link
                  href="/admin/newspaper"
                  className="text-xs text-coral hover:underline flex items-center gap-1 font-mono font-bold"
                >
                  <span>View All</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3">
                {articles.slice(0, 4).map((art) => (
                  <div
                    key={art.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-canvas-warm border border-editorial-border hover:border-forest/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="forest" size="sm">{art.category}</Badge>
                        <Badge variant={art.isPublished ? 'success' : 'draft'} size="sm">
                          {art.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                        {art.breakingStatus && (
                          <Badge variant="urgent" size="sm">
                            Breaking
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-xs font-serif font-bold text-forest truncate">
                        {art.title}
                      </h4>
                      <span className="text-[11px] text-ink-muted font-mono">
                        By {art.author} • {art.viewCount || 0} views
                      </span>
                    </div>

                    <Link
                      href={`/newspaper/${art.slug}`}
                      target="_blank"
                      className="p-2 text-ink-muted hover:text-forest hover:bg-white rounded transition-colors"
                      title="Preview Article"
                    >
                      <Eye className="w-4 h-4 text-coral" />
                    </Link>
                  </div>
                ))}
              </div>
            </Card>

            {/* Inquiries & Messages */}
            <Card className="p-6 sm:p-8 shadow-card">
              <div className="flex items-center justify-between mb-4 border-b border-editorial-border pb-3">
                <h3 className="font-serif text-xs uppercase tracking-tag text-forest font-bold">
                  Editorial Desk Inquiries ({messages.length})
                </h3>
                <span className="text-[11px] font-mono text-ink-muted">
                  Direct Transmissions
                </span>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-8 text-ink-muted text-xs font-sans">
                  No pending inquiries. All transmissions up to date.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.slice(0, 4).map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3.5 rounded-xl bg-canvas-warm border border-editorial-border space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-forest">
                          {msg.name}
                        </span>
                        <span className="text-[10px] font-mono text-coral font-semibold">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-forest text-xs font-medium">
                        {msg.subject}
                      </p>
                      <p className="text-ink-muted line-clamp-1 text-[11px] font-sans">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
