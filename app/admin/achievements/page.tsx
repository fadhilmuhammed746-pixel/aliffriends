'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Achievement } from '@/lib/types';
import { Trophy, Plus, Trash2, Edit, Award, Star, X } from 'lucide-react';

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
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Class Honors & Achievements"
          subtitle="Document debate victories, sports championships, and academic distinctions."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-gold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Achievement</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          {loading ? (
            <div className="text-center py-12 text-muted-light font-serif">Loading achievements...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-charcoal border border-gold/20 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-navy-950">
                    <img src={ach.imageUrl} alt={ach.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy/90 text-gold border border-gold/30">
                      {ach.category}
                    </span>
                    {ach.badgeTitle && (
                      <span className="absolute bottom-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-gold text-navy font-bold">
                        {ach.badgeTitle}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-muted-light">{ach.date}</span>
                      <h3 className="font-serif font-bold text-base text-ivory mb-1 mt-0.5">
                        {ach.title}
                      </h3>
                      {ach.awardedBy && (
                        <p className="text-xs text-gold/90 font-medium mb-2">Conferred by: {ach.awardedBy}</p>
                      )}
                      <p className="text-xs text-muted-light line-clamp-2">{ach.description}</p>
                    </div>

                    <div className="pt-3 border-t border-gold/15 flex items-center justify-end gap-2 mt-4">
                      <button
                        onClick={() => handleOpenEdit(ach)}
                        className="p-1.5 text-ivory/70 hover:text-gold hover:bg-navy rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ach.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded"
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
          <div className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-charcoal border border-gold/30 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gold/15 pb-4 mb-6">
                <h3 className="font-serif text-lg font-bold text-ivory">
                  {editingId ? 'Edit Achievement Record' : 'Record New Achievement'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-ivory/60 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Honor / Award Title
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
                      <option value="Award">Award</option>
                      <option value="Competition">Competition</option>
                      <option value="Academic">Academic</option>
                      <option value="Special Recognition">Special Recognition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Date Conferred
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
                    Awarding Body / Organization
                  </label>
                  <input
                    type="text"
                    value={awardedBy}
                    onChange={(e) => setAwardedBy(e.target.value)}
                    placeholder="e.g. State Youth Council, Collegiate Media Federation"
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Badge Title / Honor
                  </label>
                  <input
                    type="text"
                    value={badgeTitle}
                    onChange={(e) => setBadgeTitle(e.target.value)}
                    placeholder="e.g. First Place Gold Trophy"
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Photograph URL
                  </label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-xs text-ivory font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Description & Highlights
                  </label>
                  <textarea
                    rows={3}
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
