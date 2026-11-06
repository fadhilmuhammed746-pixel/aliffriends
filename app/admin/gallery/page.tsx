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
  const [photosText, setPhotosText] = useState(''); // JSON or line-separated URLs

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

    // Parse photos from text lines
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
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Class Photo Gallery & Heritage Archive"
          subtitle="Organize photo albums, trip memories, celebrations, and restrict private archives."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-gold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Album</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          {loading ? (
            <div className="text-center py-12 text-muted-light font-serif">Loading gallery albums...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((alb) => (
                <div
                  key={alb.id}
                  className="bg-charcoal border border-gold/20 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-navy-950">
                    <img
                      src={alb.coverImage}
                      alt={alb.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy/90 text-gold border border-gold/30">
                        {alb.category}
                      </span>
                      {alb.isRestricted ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Restricted
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5" />
                          Public
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-navy/90 text-ivory px-2 py-0.5 rounded border border-gold/20">
                      {alb.photos?.length || 0} Photos
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-ivory mb-1">
                        {alb.title}
                      </h3>
                      <p className="text-xs text-muted-light line-clamp-2">{alb.description}</p>
                    </div>

                    <div className="pt-3 border-t border-gold/15 flex items-center justify-between mt-4">
                      <a
                        href={`/gallery/${alb.id}`}
                        target="_blank"
                        className="text-xs text-gold hover:underline flex items-center gap-1 font-serif"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Album</span>
                      </a>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(alb)}
                          className="p-1.5 text-ivory/70 hover:text-gold hover:bg-navy rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(alb.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded"
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
          <div className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-charcoal border border-gold/30 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gold/15 pb-4 mb-6">
                <h3 className="font-serif text-lg font-bold text-ivory">
                  {editingId ? 'Edit Photo Album' : 'Create Photo Album'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-ivory/60 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Album Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory font-serif"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory font-serif"
                    >
                      <option value="Special Moment">Special Moment</option>
                      <option value="Event">Event</option>
                      <option value="Trip">Trip</option>
                      <option value="Celebration">Celebration</option>
                      <option value="Competition">Competition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-xs text-ivory font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Album Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Photos List (One per line: URL | Caption)
                  </label>
                  <textarea
                    rows={6}
                    value={photosText}
                    onChange={(e) => setPhotosText(e.target.value)}
                    placeholder="https://images.unsplash.com/... | Graduation ceremony portrait&#10;https://images.unsplash.com/... | Campfire memories at summit"
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-xs text-ivory font-mono"
                  />
                  <p className="text-[11px] text-muted-light mt-1">
                    Paste image URLs one per line, optionally separated by a vertical bar &quot;|&quot; and a caption.
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-serif cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRestricted}
                      onChange={(e) => setIsRestricted(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span>Restricted Album (Class Members Only)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-serif cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span>Publish Album</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-gold/15 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-charcoal text-xs text-ivory rounded-lg border border-gold/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold text-navy font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-gold"
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
