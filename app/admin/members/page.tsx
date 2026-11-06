'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ClassMember } from '@/lib/types';
import { Users, Plus, Trash2, Edit, CheckCircle, X, ShieldAlert } from 'lucide-react';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [quote, setQuote] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [isPublished, setIsPublished] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members?all=true');
      const data = await res.json();
      if (data.members) setMembers(data.members);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const resetForm = () => {
    setName('');
    setPosition('');
    setBio('');
    setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80');
    setQuote('');
    setOrderIndex(members.length + 1);
    setIsPublished(true);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (m: ClassMember) => {
    setEditingId(m.id);
    setName(m.name);
    setPosition(m.position);
    setBio(m.bio);
    setPhotoUrl(m.photoUrl);
    setQuote(m.quote || '');
    setOrderIndex(m.orderIndex);
    setIsPublished(m.isPublished);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      position,
      bio,
      photoUrl,
      quote,
      orderIndex: Number(orderIndex),
      isPublished,
    };

    try {
      if (editingId) {
        await fetch(`/api/members/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchMembers();
    } catch (err) {
      alert('Save failed: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member profile?')) return;
    try {
      await fetch(`/api/members/${id}`, { method: 'DELETE' });
      fetchMembers();
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Class Members & Leadership"
          subtitle="Curate display profiles for class representatives, editors, and students (privacy protected)."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-gold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member Profile</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          <div className="mb-6 p-4 rounded-xl bg-charcoal border border-gold/20 flex items-center gap-3 text-xs text-muted-light">
            <ShieldAlert className="w-4 h-4 text-gold flex-shrink-0" />
            <span>
              <strong>Privacy Standard:</strong> No private phone numbers, home addresses, or confidential records are collected or displayed. Only display names, official duties, and academic biographies are maintained.
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-light font-serif">Loading members...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((mem) => (
                <div
                  key={mem.id}
                  className="bg-charcoal border border-gold/20 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={mem.photoUrl}
                      alt={mem.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gold/40 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gold/80">#{mem.orderIndex}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            mem.isPublished
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {mem.isPublished ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-ivory truncate">{mem.name}</h3>
                      <p className="text-xs text-gold font-medium truncate">{mem.position}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-light line-clamp-2 mb-2 font-sans">{mem.bio}</p>
                    {mem.quote && (
                      <blockquote className="text-[11px] font-serif italic text-ivory/80 border-l border-gold/30 pl-2">
                        &ldquo;{mem.quote}&rdquo;
                      </blockquote>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gold/15 flex items-center justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleOpenEdit(mem)}
                      className="p-1.5 text-ivory/70 hover:text-gold hover:bg-navy rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(mem.id)}
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
                  {editingId ? 'Edit Member Profile' : 'Add Class Member'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-ivory/60 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Role / Class Responsibility
                  </label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Class President, Editor-in-Chief, Athletic Lead"
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Profile Photograph URL
                  </label>
                  <input
                    type="text"
                    required
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-xs text-ivory font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Short Biography
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe their contributions, interests, and aspirations..."
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Personal Motto / Quote
                  </label>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Words to live by..."
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory font-serif italic"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-serif cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span>Visible in Directory</span>
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
                    Save Profile
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
