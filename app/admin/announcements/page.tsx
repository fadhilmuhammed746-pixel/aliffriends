'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Announcement } from '@/lib/types';
import { Bell, Plus, Trash2, Edit, AlertCircle, X } from 'lucide-react';

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
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Announcements & Dispatches"
          subtitle="Publish class notices, event warnings, deadline reminders, and emergency updates."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-gold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          {loading ? (
            <div className="text-center py-12 text-muted-light font-serif">Loading announcements...</div>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-charcoal border border-gold/20 rounded-2xl p-5 flex items-start justify-between gap-4 shadow-lg hover:border-gold/40 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`p-2 rounded-lg border mt-0.5 ${
                        ann.priority === 'high'
                          ? 'bg-red-950/60 border-red-500/40 text-red-400'
                          : 'bg-gold/10 border-gold/30 text-gold'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy text-gold border border-gold/20">
                          {ann.category}
                        </span>
                        <span className="text-[11px] font-mono text-muted-light">{ann.date}</span>
                        {ann.priority === 'high' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
                            High Priority
                          </span>
                        )}
                        {ann.isFeatured && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold text-navy font-bold">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-base text-ivory mb-1">{ann.title}</h3>
                      <p className="text-xs text-muted-light leading-relaxed font-sans">{ann.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenEdit(ann)}
                      className="p-1.5 text-ivory/70 hover:text-gold hover:bg-navy rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded"
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
          <div className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-charcoal border border-gold/30 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gold/15 pb-4 mb-6">
                <h3 className="font-serif text-lg font-bold text-ivory">
                  {editingId ? 'Edit Announcement' : 'Publish New Notice'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-ivory/60 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory font-serif"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory font-serif"
                    >
                      <option value="Notice">Notice</option>
                      <option value="Event">Event</option>
                      <option value="Urgent">Urgent</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory font-serif"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Announcement Body
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
                    <span>Featured Notice</span>
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
