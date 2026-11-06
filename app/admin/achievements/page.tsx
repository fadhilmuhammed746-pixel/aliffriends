'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Achievement } from '@/lib/types';
import { Trophy, Plus, Trash2, Edit, Award, Star, X, Sparkles } from 'lucide-react';

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Award' | 'Competition' | 'Academic' | 'Special Recognition'>('Award');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [awardedBy, setAwardedBy] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badgeTitle, setBadgeTitle] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements?all=true');
      const data = await res.json();
      if (data.achievements) setAchievements(data.achievements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory('Award');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setAwardedBy('');
    setImageUrl('https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=1000&q=80');
    setBadgeTitle('First Place Honors');
    setIsFeatured(false);
    setIsPublished(true);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (a: Achievement) => {
    setEditingId(a.id);
    setTitle(a.title);
    setCategory(a.category);
    setDate(a.date);
    setDescription(a.description);
    setAwardedBy(a.awardedBy || '');
    setImageUrl(a.imageUrl);
    setBadgeTitle(a.badgeTitle || '');
    setIsFeatured(a.isFeatured);
    setIsPublished(a.isPublished);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      category,
      date,
      description,
      awardedBy,
      imageUrl,
      badgeTitle,
      isFeatured,
      isPublished,
    };

    try {
      if (editingId) {
        await fetch(`/api/achievements/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchAchievements();
    } catch (err) {
      alert('Save failed: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement record?')) return;
    try {
      await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
      fetchAchievements();
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink">
        <AdminHeader
          title="Class Honors & Achievements"
          subtitle="Document debate victories, sports championships, and academic distinctions."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all hover:shadow-forest/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Achievement</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16 text-muted font-serif italic text-sm">
              Loading achievements roll...
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-16 bg-white border border-editorial-border rounded-xl p-8">
              <Trophy className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="font-serif text-lg text-ink font-semibold">No achievement laurels recorded</p>
              <p className="text-xs text-muted mt-1 mb-4">Click "Record Achievement" to chronicle your cohort's proudest honors.</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-forest text-white text-xs uppercase font-sans font-semibold tracking-wider rounded-lg"
              >
                Record Honor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-editorial hover:shadow-editorial-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video bg-canvas-subtle border-b border-editorial-border overflow-hidden">
                    <img
                      src={ach.imageUrl}
                      alt={ach.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-forest/90 backdrop-blur text-canvas font-semibold shadow-sm">
                        {ach.category}
                      </span>
                      {ach.isFeatured && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-coral text-white font-bold shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                    {ach.badgeTitle && (
                      <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono px-2.5 py-0.5 rounded bg-forest text-white font-semibold shadow-sm border border-forest-light/40">
                        {ach.badgeTitle}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-muted">{ach.date}</span>
                      <h3 className="font-serif font-bold text-lg text-ink mb-1 mt-0.5 group-hover:text-forest transition-colors">
                        {ach.title}
                      </h3>
                      {ach.awardedBy && (
                        <p className="text-xs text-coral font-medium mb-2 font-sans">
                          Conferred by: {ach.awardedBy}
                        </p>
                      )}
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">{ach.description}</p>
                    </div>

                    <div className="pt-3 border-t border-editorial-border flex items-center justify-end gap-1.5 mt-4">
                      <button
                        onClick={() => handleOpenEdit(ach)}
                        className="p-1.5 text-muted hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                        title="Edit Achievement"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ach.id)}
                        className="p-1.5 text-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                        title="Delete Achievement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            <div className="bg-white border border-editorial-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-ink">
              <div className="flex items-center justify-between border-b border-editorial-border pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest">
                    {editingId ? 'Edit Achievement Record' : 'Record New Achievement'}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">Chronicle awards, certificates, tournaments, and laureate citations.</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1 text-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Honor / Award Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. National Champions in Inter-Collegiate Debate"
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
                      <option value="Award">Award</option>
                      <option value="Competition">Competition</option>
                      <option value="Academic">Academic</option>
                      <option value="Special Recognition">Special Recognition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Date Conferred
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
                    Awarding Body / Organization
                  </label>
                  <input
                    type="text"
                    value={awardedBy}
                    onChange={(e) => setAwardedBy(e.target.value)}
                    placeholder="e.g. State Youth Council, Collegiate Media Federation"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Badge Title / Honor
                  </label>
                  <input
                    type="text"
                    value={badgeTitle}
                    onChange={(e) => setBadgeTitle(e.target.value)}
                    placeholder="e.g. First Place Gold Trophy"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Photograph URL
                  </label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-xs text-ink font-mono focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Description & Highlights
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details on the achievement and recognition..."
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
                    Save Achievement
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
