'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { GalleryAlbum, GalleryPhoto } from '@/lib/types';
import { Image as ImageIcon, Plus, Trash2, Edit, Eye, Lock, Globe, Upload, X } from 'lucide-react';

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Event' | 'Trip' | 'Celebration' | 'Competition' | 'Special Moment'>('Special Moment');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isRestricted, setIsRestricted] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [photosText, setPhotosText] = useState('');

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/gallery?all=true');
      const data = await res.json();
      if (data.albums) setAlbums(data.albums);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory('Special Moment');
    setDescription('');
    setCoverImage('');
    setIsRestricted(false);
    setIsPublished(true);
    setPhotosText('');
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (a: GalleryAlbum) => {
    setEditingId(a.id);
    setTitle(a.title);
    setCategory(a.category);
    setDescription(a.description);
    setCoverImage(a.coverImage);
    setIsRestricted(a.isRestricted);
    setIsPublished(a.isPublished);
    setPhotosText(
      a.photos.map((p) => `${p.url} | ${p.caption || ''}`).join('\n')
    );
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPhotos: GalleryPhoto[] = photosText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const [url, caption] = line.split('|').map((s) => s.trim());
        return {
          id: `ph_${Date.now()}_${idx}`,
          url,
          caption: caption || '',
          alt: caption || title,
        };
      });

    const payload = {
      title,
      category,
      description,
      coverImage: coverImage || (parsedPhotos[0]?.url ?? 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'),
      isRestricted,
      isPublished,
      photos: parsedPhotos,
    };

    try {
      if (editingId) {
        await fetch(`/api/gallery/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchAlbums();
    } catch (err) {
      alert('Save failed: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo album?')) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      fetchAlbums();
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink">
        <AdminHeader
          title="Class Photo Gallery & Heritage Archive"
          subtitle="Organize photo albums, trip memories, celebrations, and restrict private archives."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all hover:shadow-forest/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Album</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16 text-muted font-serif italic text-sm">
              Loading photographic albums...
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-16 bg-white border border-editorial-border rounded-xl p-8">
              <ImageIcon className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="font-serif text-lg text-ink font-semibold">No photo albums created yet</p>
              <p className="text-xs text-muted mt-1 mb-4">Click "Create New Album" to curate the inaugural collection.</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-forest text-white text-xs uppercase font-sans font-semibold tracking-wider rounded-lg"
              >
                Create Album
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((alb) => (
                <div
                  key={alb.id}
                  className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-editorial hover:shadow-editorial-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video bg-canvas-subtle border-b border-editorial-border overflow-hidden">
                    <img
                      src={alb.coverImage}
                      alt={alb.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-forest/90 backdrop-blur text-canvas font-semibold shadow-sm">
                        {alb.category}
                      </span>
                      {alb.isRestricted ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 font-semibold">
                          <Lock className="w-3 h-3 text-amber-700" />
                          Restricted
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 font-semibold">
                          <Globe className="w-3 h-3 text-emerald-700" />
                          Public
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono bg-forest/90 text-canvas px-2 py-0.5 rounded shadow-sm">
                      {alb.photos?.length || 0} Photos
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-ink mb-1 group-hover:text-forest transition-colors">
                        {alb.title}
                      </h3>
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">{alb.description}</p>
                    </div>

                    <div className="pt-3 border-t border-editorial-border flex items-center justify-between mt-4">
                      <a
                        href={`/gallery/${alb.id}`}
                        target="_blank"
                        className="text-xs text-forest hover:text-coral flex items-center gap-1.5 font-sans font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Album</span>
                      </a>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(alb)}
                          className="p-1.5 text-muted hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                          title="Edit Album"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(alb.id)}
                          className="p-1.5 text-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                          title="Delete Album"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-forest/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-editorial-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-ink">
              <div className="flex items-center justify-between border-b border-editorial-border pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest">
                    {editingId ? 'Edit Photo Album' : 'Create New Photo Album'}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">Organize event photography, member archives, and private reels.</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1 text-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Album Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Class Convocation 2024"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-serif font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                    >
                      <option value="Special Moment">Special Moment</option>
                      <option value="Event">Event</option>
                      <option value="Trip">Trip</option>
                      <option value="Celebration">Celebration</option>
                      <option value="Competition">Competition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-xs text-ink font-mono focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Album Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief background on the photographed occasion..."
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Photos List (One per line: URL | Caption)
                  </label>
                  <textarea
                    rows={6}
                    value={photosText}
                    onChange={(e) => setPhotosText(e.target.value)}
                    placeholder="https://images.unsplash.com/... | Graduation ceremony portrait&#10;https://images.unsplash.com/... | Campfire memories at summit"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-xs text-ink font-mono focus:outline-none focus:border-forest leading-relaxed"
                  />
                  <p className="text-[11px] text-muted mt-1 font-sans">
                    Paste image URLs one per line, optionally separated by a vertical bar &quot;|&quot; and a caption.
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-sans font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRestricted}
                      onChange={(e) => setIsRestricted(e.target.checked)}
                      className="accent-coral w-4 h-4 rounded"
                    />
                    <span>Restricted Album (Class Members Only)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-sans font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="accent-forest w-4 h-4 rounded"
                    />
                    <span>Publish Album</span>
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
                    Save Album
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
