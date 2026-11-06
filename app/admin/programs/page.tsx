'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { Program } from '@/lib/types';
import { Calendar, Plus, Trash2, Edit, Eye, MapPin, Youtube, Upload, X, Sparkles } from 'lucide-react';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Gala & Conclave');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const fetchPrograms = async () => {
    try {
      const res = await fetch('/api/programs?all=true');
      const data = await res.json();
      if (data.programs) setPrograms(data.programs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory('Gala & Conclave');
    setDate(new Date().toISOString().split('T')[0]);
    setLocation('');
    setDescription('');
    setCoverImage('');
    setYoutubeUrl('https://www.youtube.com/@AlifCreations12');
    setPhotos([]);
    setVideoUrl('');
    setPdfUrl('');
    setPdfTitle('');
    setIsFeatured(false);
    setIsPublished(true);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Program) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category);
    setDate(p.date);
    setLocation(p.location);
    setDescription(p.description);
    setCoverImage(p.coverImage);
    setYoutubeUrl(p.youtubeUrl || '');
    setPhotos(p.photos || []);
    setVideoUrl(p.videoUrl || '');
    setPdfUrl(p.pdfUrl || '');
    setPdfTitle(p.pdfTitle || '');
    setIsFeatured(p.isFeatured);
    setIsPublished(p.isPublished);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      category,
      date,
      location,
      description,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
      youtubeUrl,
      photos,
      videoUrl: videoUrl || undefined,
      pdfUrl: pdfUrl || undefined,
      pdfTitle: pdfTitle || undefined,
      isFeatured,
      isPublished,
    };

    try {
      if (editingId) {
        await fetch(`/api/programs/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchPrograms();
    } catch (err) {
      alert('Save failed: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    try {
      await fetch(`/api/programs/${id}`, { method: 'DELETE' });
      fetchPrograms();
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink">
        <AdminHeader
          title="Programs & Events Archive"
          subtitle="Document conclaves, class expeditions, assemblies, and official celebrations."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all hover:shadow-forest/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Program</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16 text-muted font-serif italic text-sm">
              Loading programs archive...
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-16 bg-white border border-editorial-border rounded-xl p-8">
              <Calendar className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="font-serif text-lg text-ink font-semibold">No programs archived yet</p>
              <p className="text-xs text-muted mt-1 mb-4">Click "Add New Program" to document your first milestone gathering.</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-forest text-white text-xs uppercase font-sans font-semibold tracking-wider rounded-lg"
              >
                Create Program
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-editorial hover:shadow-editorial-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video bg-canvas-subtle border-b border-editorial-border overflow-hidden">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-forest/90 backdrop-blur text-canvas border border-forest-light/40 font-semibold shadow-sm">
                        {p.category}
                      </span>
                      {p.isFeatured && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-coral text-white font-bold shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                    {p.youtubeUrl && (
                      <span className="absolute bottom-3 right-3 p-1.5 rounded-full bg-forest/80 backdrop-blur text-white shadow-sm">
                        <Youtube className="w-4 h-4 text-coral" />
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-forest font-mono mb-1.5 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-coral" />
                        <span>{p.date}</span>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-ink mb-1 group-hover:text-forest transition-colors">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted mb-3">
                        <MapPin className="w-3.5 h-3.5 text-coral flex-shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </div>
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="pt-3 border-t border-editorial-border flex items-center justify-between mt-4">
                      <a
                        href={`/programs/${p.id}`}
                        target="_blank"
                        className="text-xs text-forest hover:text-coral flex items-center gap-1.5 font-sans font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Page</span>
                      </a>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-muted hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                          title="Edit Program"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                          title="Delete Program"
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
                    {editingId ? 'Edit Program' : 'Document New Program'}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">Record gathering milestones, dates, locations, and multimedia links.</p>
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
                    Program Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Grand Reunion & Convocation"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-serif font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Gala, Expedition, Outreach"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Royal Grand Auditorium, Central Campus"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                  />
                </div>

                {/* Program Cover Image */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border">
                  <MediaUpload
                    label="Program Cover Artwork"
                    description="Upload a high-resolution banner for this event (JPG, PNG, WEBP)."
                    type="image"
                    section="program"
                    value={coverImage}
                    onChange={(url) => setCoverImage(url)}
                    required={true}
                  />
                </div>

                {/* Event Photo Gallery */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border">
                  <MediaUpload
                    label="Event Photo Gallery (Bulk Upload)"
                    description="Upload multiple archival photos from this program."
                    type="image"
                    multiple={true}
                    section="program"
                    value={photos}
                    onChange={(urls) => setPhotos(urls)}
                  />
                </div>

                {/* Video & PDF Documents */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border space-y-4">
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-forest border-b border-editorial-border pb-2">
                    Event Broadcast & Schedule Documentation
                  </h4>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-forest mb-1">
                      YouTube Video URL / Live Broadcast
                    </label>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/@AlifCreations12"
                      className="w-full px-3.5 py-2.5 bg-white border border-editorial-border rounded-lg text-xs text-ink font-mono focus:outline-none focus:border-forest"
                    />
                  </div>

                  <MediaUpload
                    label="Direct Program Video (MP4 / WEBM)"
                    description="Upload a direct highlight reel or documentary file."
                    type="video"
                    section="program"
                    value={videoUrl}
                    onChange={(url) => setVideoUrl(url)}
                  />

                  <div>
                    <MediaUpload
                      label="Program Itinerary / Guide (PDF)"
                      description="Attach an official brochure or event schedule."
                      type="pdf"
                      section="program"
                      value={pdfUrl}
                      onChange={(url) => setPdfUrl(url)}
                    />
                    {pdfUrl && (
                      <input
                        type="text"
                        placeholder="Document display title (e.g. Conclave Program Schedule.pdf)"
                        value={pdfTitle}
                        onChange={(e) => setPdfTitle(e.target.value)}
                        className="mt-2 w-full px-3 py-2 bg-white border border-editorial-border rounded-lg text-xs text-ink font-sans focus:outline-none focus:border-forest"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Program Narrative & Details
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the chronicle of the event..."
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-sans font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-coral w-4 h-4 rounded"
                    />
                    <span>Featured on Homepage</span>
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
                    Save Program
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
