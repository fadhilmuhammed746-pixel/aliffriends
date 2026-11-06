'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Announcement } from '@/lib/types';
import { Bell, Plus, Trash2, Edit, AlertCircle, X, Sparkles } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Notice' | 'Event' | 'Urgent' | 'General'>('Notice');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements?all=true');
      const data = await res.json();
      if (data.announcements) setAnnouncements(data.announcements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory('Notice');
    setDate(new Date().toISOString().split('T')[0]);
    setContent('');
    setPriority('medium');
    setIsFeatured(false);
    setIsPublished(true);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (a: Announcement) => {
    setEditingId(a.id);
    setTitle(a.title);
    setCategory(a.category);
    setDate(a.date);
    setContent(a.content);
    setPriority(a.priority);
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
      content,
      priority,
      isFeatured,
      isPublished,
    };

    try {
      if (editingId) {
        await fetch(`/api/announcements/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      alert('Save failed: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      fetchAnnouncements();
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink">
        <AdminHeader
          title="Announcements & Dispatches"
          subtitle="Publish class notices, event warnings, deadline reminders, and emergency updates."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all hover:shadow-forest/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16 text-muted font-serif italic text-sm">
              Loading dispatches...
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-16 bg-white border border-editorial-border rounded-xl p-8">
              <Bell className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="font-serif text-lg text-ink font-semibold">No announcements broadcast yet</p>
              <p className="text-xs text-muted mt-1 mb-4">Click "Broadcast Notice" to issue the first bulletin to classmates.</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-forest text-white text-xs uppercase font-sans font-semibold tracking-wider rounded-lg"
              >
                Broadcast Notice
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white border border-editorial-border rounded-xl p-5 flex items-start justify-between gap-4 shadow-editorial hover:shadow-editorial-lg transition-all group"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className={`p-2.5 rounded-lg border mt-0.5 flex-shrink-0 ${
                        ann.priority === 'high'
                          ? 'bg-coral/10 border-coral/30 text-coral'
                          : 'bg-forest/10 border-forest/20 text-forest'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-forest/10 text-forest border border-forest/20 font-semibold">
                          {ann.category}
                        </span>
                        <span className="text-[11px] font-mono text-muted">{ann.date}</span>
                        {ann.priority === 'high' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coral text-white font-bold shadow-sm">
                            Urgent Priority
                          </span>
                        )}
                        {ann.isFeatured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forest text-white font-semibold flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3 text-coral" />
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-base sm:text-lg text-ink mb-1 group-hover:text-forest transition-colors">
                        {ann.title}
                      </h3>
                      <p className="text-xs text-muted leading-relaxed font-sans">{ann.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleOpenEdit(ann)}
                      className="p-1.5 text-muted hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                      title="Edit Notice"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1.5 text-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                    {editingId ? 'Edit Announcement' : 'Broadcast New Notice'}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">Post official reminders, schedule notices, and urgent bulletins.</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1 text-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Schedule for Annual Alumni Gathering"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-serif font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                    >
                      <option value="Notice">Notice</option>
                      <option value="Event">Event</option>
                      <option value="Urgent">Urgent</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Announcement Body
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter the full announcement text, instructions, and details..."
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
                    <span>Featured Notice</span>
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
                    Save Notice
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
