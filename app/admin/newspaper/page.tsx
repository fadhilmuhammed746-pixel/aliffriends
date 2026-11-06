'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { RichEditor } from '@/components/admin/RichEditor';
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
  const [uploadingCover, setUploadingCover] = useState(false);

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
    setIsPublished(art.isPublished);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'image');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setCoverImage(data.url);
      }
    } catch (err) {
      alert('Upload failed: ' + err);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      slug: slug || undefined,
      subtitle,
      category,
      headlineStatus,
      breakingStatus,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80',
      content,
      author,
      authorRole,
      isPublished,
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
    if (!confirm('Are you sure you want to delete this news article?')) return;
    try {
      await fetch(`/api/newspaper/${id}`, { method: 'DELETE' });
      fetchArticles();
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Digital Newspaper & Editorial Desk"
          subtitle="Publish news dispatches, special reports, and investigative features."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-gold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Draft New Article</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          {loading ? (
            <div className="text-center py-12 text-muted-light font-serif">Loading news articles...</div>
          ) : (
            <div className="space-y-4">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="bg-charcoal border border-gold/20 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-20 h-20 object-cover rounded-xl border border-gold/20 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                          {art.category}
                        </span>
                        {art.headlineStatus && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5" />
                            Headline
                          </span>
                        )}
                        {art.breakingStatus && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5" />
                            Breaking
                          </span>
                        )}
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                            art.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {art.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-ivory truncate">
                        {art.title}
                      </h3>
                      {art.subtitle && (
                        <p className="text-xs text-muted-light line-clamp-1 font-sans">
                          {art.subtitle}
                        </p>
                      )}
                      <div className="text-[11px] font-mono text-muted-light mt-1">
                        By {art.author} • {new Date(art.publishedAt).toLocaleDateString()} • {art.viewCount || 0} reads
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 self-end md:self-center border-t md:border-t-0 border-gold/15 pt-3 md:pt-0 w-full md:w-auto justify-end">
                    <a
                      href={`/newspaper/${art.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-navy hover:bg-navy-light text-gold text-xs font-serif rounded-lg border border-gold/20 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </a>
                    <button
                      onClick={() => handleOpenEdit(art)}
                      className="p-2 text-ivory/70 hover:text-gold hover:bg-navy rounded-lg transition-colors"
                      title="Edit Story"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-colors"
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
          <div className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-charcoal border border-gold/30 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-gold/15 pb-4 mb-6">
                <h3 className="font-serif text-lg font-bold text-ivory">
                  {editingId ? 'Edit Newspaper Article' : 'Draft New Story'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-ivory/60 hover:text-gold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Article Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter commanding headline..."
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-base text-ivory focus:outline-none focus:border-gold font-serif font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-serif"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      URL Slug (Auto-generated if left blank)
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="custom-article-slug"
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Subtitle / Deck
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Brief explanatory secondary headline..."
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Author Desk / Role
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="Investigative Reporter, Class Editor"
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <div className="p-4 rounded-xl bg-navy border border-gold/15 space-y-2">
                  <label className="block text-xs uppercase font-serif tracking-wider text-gold">
                    Lead Photograph URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://... or upload file"
                      className="flex-1 px-3 py-2 bg-charcoal border border-gold/20 rounded-lg text-xs text-ivory font-mono"
                    />
                    <label className="flex items-center gap-1.5 px-3 py-2 bg-charcoal hover:bg-charcoal-soft border border-gold/30 rounded-lg text-xs text-ivory/80 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-gold" />
                      <span>{uploadingCover ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Rich Content Editor */}
                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1.5">
                    Story Content (Rich Formatting)
                  </label>
                  <RichEditor value={content} onChange={setContent} />
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-serif cursor-pointer">
                    <input
                      type="checkbox"
                      checked={headlineStatus}
                      onChange={(e) => setHeadlineStatus(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span>Frontpage Lead Headline</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-serif cursor-pointer">
                    <input
                      type="checkbox"
                      checked={breakingStatus}
                      onChange={(e) => setBreakingStatus(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span>Mark as Breaking Dispatch</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-serif cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span>Publish Immediately</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-gold/15 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-charcoal hover:bg-charcoal-soft text-xs text-ivory rounded-lg border border-gold/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold hover:bg-gold-light text-navy font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-gold"
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
