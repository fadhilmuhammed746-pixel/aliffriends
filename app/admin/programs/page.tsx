'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Program } from '@/lib/types';
import { Calendar, Plus, Trash2, Edit, Eye, MapPin, Youtube, Upload, X } from 'lucide-react';

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
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Programs & Events Archive"
          subtitle="Document conclaves, class expeditions, assemblies, and official celebrations."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-gold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Program</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          {loading ? (
            <div className="text-center py-12 text-muted-light font-serif">Loading programs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((p) => (
                <div
                  key={p.id}
                  className="bg-charcoal border border-gold/20 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-navy-950">
                    <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy/90 text-gold border border-gold/30">
                      {p.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gold/80 font-mono mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{p.date}</span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-ivory mb-1">{p.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-light mb-3">
                        <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </div>
                      <p className="text-xs text-muted-light line-clamp-2">{p.description}</p>
                    </div>

                    <div className="pt-3 border-t border-gold/15 flex items-center justify-between mt-4">
                      <a
                        href={`/programs/${p.id}`}
                        target="_blank"
                        className="text-xs text-gold hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Page</span>
                      </a>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-ivory/70 hover:text-gold hover:bg-navy rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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
                  {editingId ? 'Edit Program' : 'Create Program Event'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-ivory/60 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Program Title
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
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Gala, Expedition, Outreach"
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Royal Grand Auditorium, Central Campus"
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-xs text-ivory font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    YouTube Video URL / Live Broadcast
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/@AlifCreations12"
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-xs text-ivory font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Program Narrative & Details
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-serif cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span>Featured on Homepage</span>
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
                    className="px-4 py-2 bg-charcoal text-xs text-ivory rounded-lg border border-gold/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold text-navy font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-gold"
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
