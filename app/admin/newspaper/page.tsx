'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { RichEditor } from '@/components/admin/RichEditor';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { Article, ArticleCategory } from '@/lib/types';
import {
  Newspaper,
  Plus,
  Trash2,
  Edit,
  Eye,
  Upload,
  CheckCircle,
  X,
  Flame,
  Star,
  Sparkles,
} from 'lucide-react';

const categories: ArticleCategory[] = [
  'Class News',
  'Events',
  'Achievements',
  'Education',
  'Editorial',
  'Special Reports',
  'Announcements',
];

export default function AdminNewspaperPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('Class News');
  const [headlineStatus, setHeadlineStatus] = useState(false);
  const [breakingStatus, setBreakingStatus] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Editorial Desk');
  const [authorRole, setAuthorRole] = useState('Class Correspondent');
  const [isPublished, setIsPublished] = useState(true);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/newspaper?all=true');
      const data = await res.json();
      if (data.articles) setArticles(data.articles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setSubtitle('');
    setCategory('Class News');
    setHeadlineStatus(false);
    setBreakingStatus(false);
    setCoverImage('');
    setContent('<p class="lead">Write lead paragraph here...</p>\n<p>Main story body...</p>');
    setAuthor('Editorial Desk');
    setAuthorRole('Class Correspondent');
    setGalleryImages([]);
    setVideoUrl('');
    setPdfUrl('');
    setPdfTitle('');
    setIsPublished(true);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSlug(art.slug);
    setSubtitle(art.subtitle || '');
    setCategory(art.category);
    setHeadlineStatus(art.headlineStatus);
    setBreakingStatus(art.breakingStatus);
    setCoverImage(art.coverImage);
    setContent(art.content);
    setAuthor(art.author);
    setAuthorRole(art.authorRole || '');
    setGalleryImages(art.galleryImages || []);
    setVideoUrl(art.videoUrl || '');
    setPdfUrl(art.pdfUrl || '');
    setPdfTitle(art.pdfTitle || '');
    setIsPublished(art.isPublished);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = slug.trim()
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      title,
      slug: finalSlug,
      subtitle,
      category,
      headlineStatus,
      breakingStatus,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      content,
      author,
      authorRole,
      isPublished,
      publishedAt: new Date().toISOString(),
      galleryImages,
      videoUrl: videoUrl || undefined,
      pdfUrl: pdfUrl || undefined,
      pdfTitle: pdfTitle || undefined,
      relatedArticleIds: [],
    };

    try {
      if (editingId) {
        await fetch(`/api/newspaper/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/newspaper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      fetchArticles();
    } catch (err) {
      alert('Failed to save article: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await fetch(`/api/newspaper/${id}`, { method: 'DELETE' });
      fetchArticles();
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink">
        <AdminHeader
          title="Digital Newspaper & Editorial Desk"
          subtitle="Publish news dispatches, special reports, and investigative features."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all hover:shadow-forest/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Draft New Article</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16 text-muted font-serif italic text-sm">
              Loading news dispatches...
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-white border border-editorial-border rounded-xl p-8">
              <Newspaper className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="font-serif text-lg text-ink font-semibold">No news dispatches published yet</p>
              <p className="text-xs text-muted mt-1 mb-4">Click "Draft New Article" to write the latest news bulletin.</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-forest text-white text-xs uppercase font-sans font-semibold tracking-wider rounded-lg"
              >
                Draft Story
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white border border-editorial-border rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-editorial hover:shadow-editorial-lg transition-all group"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-editorial-border flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-forest/10 text-forest border border-forest/20 font-semibold">
                          {art.category}
                        </span>
                        {art.headlineStatus && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 font-semibold">
                            <Star className="w-3 h-3 text-amber-700 fill-amber-700" />
                            Headline
                          </span>
                        )}
                        {art.breakingStatus && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-coral text-white font-bold flex items-center gap-1 shadow-sm">
                            <Flame className="w-3 h-3 fill-white" />
                            Breaking
                          </span>
                        )}
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-semibold ${
                            art.isPublished
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-stone-100 text-stone-600 border-stone-300'
                          }`}
                        >
                          {art.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base sm:text-lg text-ink truncate group-hover:text-forest transition-colors">
                        {art.title}
                      </h3>
                      {art.subtitle && (
                        <p className="text-xs text-muted line-clamp-1 font-sans mt-0.5">
                          {art.subtitle}
                        </p>
                      )}
                      <div className="text-[11px] font-mono text-muted mt-2">
                        By <span className="text-ink font-semibold">{art.author}</span> • {new Date(art.publishedAt).toLocaleDateString()} • {art.viewCount || 0} views
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0 self-end md:self-center border-t md:border-t-0 border-editorial-border pt-3 md:pt-0 w-full md:w-auto justify-end">
                    <a
                      href={`/newspaper/${art.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-canvas hover:bg-canvas-subtle text-forest text-xs font-sans font-semibold rounded-lg border border-editorial-border flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </a>
                    <button
                      onClick={() => handleOpenEdit(art)}
                      className="p-2 text-muted hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                      title="Edit Story"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-2 text-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                      title="Delete Story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Editor */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-forest/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-editorial-border rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-ink">
              <div className="flex items-center justify-between border-b border-editorial-border pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest">
                    {editingId ? 'Edit Newspaper Article' : 'Draft New Newspaper Story'}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">Compose broadsheet stories, editorial columns, and news bulletins.</p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Article Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter commanding headline..."
                    className="w-full px-4 py-2.5 bg-canvas border border-editorial-border rounded-lg text-base text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest font-serif font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      URL Slug (Auto-generated if left blank)
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="custom-article-slug"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Subtitle / Deck
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Brief explanatory secondary headline..."
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Author Desk / Role
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="Investigative Reporter, Class Editor"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                    />
                  </div>
                </div>

                {/* Lead Photograph */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border">
                  <MediaUpload
                    label="Lead Article Photograph"
                    description="Upload the featured broadsheet headline image (JPG, PNG, WEBP)."
                    type="image"
                    section="newspaper"
                    value={coverImage}
                    onChange={(url) => setCoverImage(url)}
                    required={true}
                  />
                </div>

                {/* Additional Media Attachments */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border space-y-4">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-forest border-b border-editorial-border pb-2">
                    Multimedia Attachments (Gallery, Video & PDF)
                  </h4>

                  {/* Multiple Photographs */}
                  <MediaUpload
                    label="Story Photographic Gallery"
                    description="Upload multiple supporting photographs to display at the bottom of the article."
                    type="image"
                    multiple={true}
                    section="newspaper"
                    value={galleryImages}
                    onChange={(urls) => setGalleryImages(urls)}
                  />

                  {/* Video Attachment */}
                  <MediaUpload
                    label="Optional Video / Broadcast Attachment"
                    description="Upload a video reel or attach YouTube broadcast (MP4, WEBM)."
                    type="video"
                    section="newspaper"
                    value={videoUrl}
                    onChange={(url) => setVideoUrl(url)}
                  />

                  {/* PDF Document Attachment */}
                  <div>
                    <MediaUpload
                      label="Optional PDF Document / Press Release"
                      description="Attach an official document, circular, or press release for readers to download."
                      type="pdf"
                      section="newspaper"
                      value={pdfUrl}
                      onChange={(url) => setPdfUrl(url)}
                    />
                    {pdfUrl && (
                      <input
                        type="text"
                        placeholder="Document display title (e.g. Official Statement 2026.pdf)"
                        value={pdfTitle}
                        onChange={(e) => setPdfTitle(e.target.value)}
                        className="mt-2 w-full px-3 py-2 bg-white border border-editorial-border rounded-lg text-xs text-ink font-sans focus:outline-none focus:border-forest"
                      />
                    )}
                  </div>
                </div>

                {/* Rich Content Editor */}
                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1.5">
                    Story Content (Rich Formatting)
                  </label>
                  <RichEditor value={content} onChange={setContent} />
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-sans font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={headlineStatus}
                      onChange={(e) => setHeadlineStatus(e.target.checked)}
                      className="accent-coral w-4 h-4 rounded"
                    />
                    <span>Frontpage Lead Headline</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-sans font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={breakingStatus}
                      onChange={(e) => setBreakingStatus(e.target.checked)}
                      className="accent-coral w-4 h-4 rounded"
                    />
                    <span>Mark as Breaking Dispatch</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-sans font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="accent-forest w-4 h-4 rounded"
                    />
                    <span>Publish Immediately</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-editorial-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-canvas hover:bg-canvas-subtle text-xs text-muted hover:text-ink rounded-lg border border-editorial-border transition-colors font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-forest hover:bg-forest-light text-white font-sans font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all"
                  >
                    Save & Publish Story
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
