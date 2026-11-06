'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { GalleryAlbum, GalleryPhoto } from '@/lib/types';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit,
  Eye,
  Lock,
  Globe,
  Upload,
  X,
  Sparkles,
  Calendar,
  Video,
  FileText,
} from 'lucide-react';

const CATEGORIES = [
  'Special Moments',
  'Events',
  'Trips',
  'Celebrations',
  'Competitions',
  'Other',
];

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('Special Moments');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  const fetchAlbums = async () => {
    try {
      setLoading(true);
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
    setCategory('Special Moments');
    setDescription('');
    setCoverImage('');
    setEventDate(new Date().toISOString().split('T')[0]);
    setIsFeatured(false);
    setIsRestricted(false);
    setIsPublished(true);
    setPhotos([]);
    setVideos([]);
    setPdfUrl('');
    setPdfTitle('');
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
    setEventDate(a.eventDate || a.createdAt.split('T')[0]);
    setIsFeatured(Boolean(a.isFeatured));
    setIsRestricted(a.isRestricted);
    setIsPublished(a.isPublished);
    setPhotos(a.photos ? a.photos.map((p) => (typeof p === 'string' ? p : p.url)) : []);
    setVideos(a.videos || []);
    setPdfUrl(a.pdfUrl || '');
    setPdfTitle(a.pdfTitle || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedPhotos: GalleryPhoto[] = photos.map((url, idx) => ({
      id: `ph_${Date.now()}_${idx}`,
      url,
      caption: '',
      alt: title,
    }));

    const payload = {
      title,
      category,
      description,
      coverImage: coverImage || formattedPhotos[0]?.url || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      eventDate,
      isFeatured,
      isRestricted,
      isPublished,
      photos: formattedPhotos,
      videos,
      pdfUrl: pdfUrl || undefined,
      pdfTitle: pdfTitle || undefined,
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
    if (!confirm('Are you sure you want to remove this photo album?')) return;
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
          title="Photographic Heritage & Gallery"
          subtitle="Curate thematic class albums, bulk upload memories with drag-and-drop, attach videos, and organize photo collections."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Album</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16 text-ink-muted font-serif italic text-sm">
              Loading photographic archives...
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-16 bg-white border border-editorial-border rounded-xl p-8 shadow-subtle">
              <ImageIcon className="w-10 h-10 text-ink-muted mx-auto mb-3" />
              <p className="font-serif text-lg text-ink font-semibold">No photographic albums created yet</p>
              <p className="text-xs text-ink-muted mt-1 mb-4">Click &quot;Create New Album&quot; to curate the first memory collection.</p>
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
                  className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/3] bg-canvas border-b border-editorial-border overflow-hidden">
                    <img
                      src={alb.coverImage}
                      alt={alb.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-forest/90 backdrop-blur text-white font-semibold shadow-xs">
                        {alb.category}
                      </span>
                      {alb.isFeatured && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-coral text-white font-bold shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      {alb.isRestricted ? (
                        <span className="p-1.5 rounded-full bg-forest/90 text-coral-light shadow-xs" title="Restricted Album">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-full bg-forest/90 text-white/90 shadow-xs" title="Public Album">
                          <Globe className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono bg-forest/90 text-white px-2 py-0.5 rounded shadow-xs">
                      {alb.photos?.length || 0} Photographs
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-ink mb-1 group-hover:text-forest transition-colors">
                        {alb.title}
                      </h3>
                      <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">{alb.description}</p>
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
                          className="p-1.5 text-ink-muted hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                          title="Edit Album"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(alb.id)}
                          className="p-1.5 text-ink-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
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

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-forest/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-editorial-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-ink">
              <div className="flex items-center justify-between border-b border-editorial-border pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest">
                    {editingId ? 'Edit Photographic Album' : 'Create New Photo Album'}
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Organize class photography, batch uploads, video reels, and commemorative brochures.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-ink-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-forest mb-1">
                    Album Title *
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
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-forest mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-forest mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-xs text-ink font-mono focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-forest mb-1">
                    Album Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief background on the occasion, participants, and memories captured..."
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans leading-relaxed"
                  />
                </div>

                {/* Album Cover Upload */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border">
                  <MediaUpload
                    label="Album Cover Artwork"
                    description="Upload a high-resolution cover image for this album (JPG, PNG, WEBP)."
                    type="image"
                    section="gallery"
                    value={coverImage}
                    onChange={(url) => setCoverImage(url)}
                    required={true}
                  />
                </div>

                {/* Bulk Photo Upload */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border space-y-3">
                  <MediaUpload
                    label="Album Photographs (Drag & Drop Bulk Upload)"
                    description="Upload multiple photographs at once. Use arrow buttons to reorder how they appear in the gallery."
                    type="image"
                    multiple={true}
                    section="gallery"
                    value={photos}
                    onChange={(urls) => setPhotos(urls)}
                  />
                </div>

                {/* Video & PDF Attachments */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border space-y-4">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-forest border-b border-editorial-border pb-2">
                    Optional Album Video & PDF Attachments
                  </h4>

                  <MediaUpload
                    label="Album Video Reels (MP4 / WEBM)"
                    description="Upload supporting video highlights for this album."
                    type="video"
                    multiple={true}
                    section="gallery"
                    value={videos}
                    onChange={(urls) => setVideos(urls)}
                  />

                  <div>
                    <MediaUpload
                      label="Event Brochure / Souvenir PDF"
                      description="Attach an itinerary or commemorative booklet in PDF format."
                      type="pdf"
                      section="gallery"
                      value={pdfUrl}
                      onChange={(url) => setPdfUrl(url)}
                    />
                    {pdfUrl && (
                      <input
                        type="text"
                        placeholder="Document display title (e.g. Convocation Itinerary.pdf)"
                        value={pdfTitle}
                        onChange={(e) => setPdfTitle(e.target.value)}
                        className="mt-2 w-full px-3 py-2 bg-white border border-editorial-border rounded-lg text-xs text-ink font-sans focus:outline-none focus:border-forest"
                      />
                    )}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-sans font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-coral w-4 h-4 rounded"
                    />
                    <span>Set as Featured Album</span>
                  </label>

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
                    <span>Publish Album Immediately</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-editorial-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-editorial-border rounded-lg text-xs font-sans font-semibold text-ink-muted hover:bg-canvas transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-forest hover:bg-forest-light text-white rounded-lg text-xs font-sans font-semibold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    {editingId ? 'Save Album Changes' : 'Publish Album'}
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
