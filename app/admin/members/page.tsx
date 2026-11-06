'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { ClassMember } from '@/lib/types';
import { Users, Plus, Trash2, Edit, CheckCircle, X, ShieldCheck, Shield, Lock } from 'lucide-react';

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
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink">
        <AdminHeader
          title="Class Members & Leadership"
          subtitle="Curate display profiles for class representatives, editors, and students (privacy protected)."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all hover:shadow-forest/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member Profile</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          <div className="mb-6 p-4 rounded-xl bg-white border border-editorial-border flex items-center gap-3 text-xs text-muted shadow-editorial">
            <ShieldCheck className="w-4 h-4 text-forest flex-shrink-0" />
            <span>
              <strong className="text-ink">Privacy Standard:</strong> No private phone numbers, personal home addresses, or confidential records are collected or displayed. Only public directory names, leadership appointments, and academic quotes are maintained.
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16 text-muted font-serif italic text-sm">
              Loading class roll and directory...
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-16 bg-white border border-editorial-border rounded-xl p-8">
              <Users className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="font-serif text-lg text-ink font-semibold">No member profiles registered</p>
              <p className="text-xs text-muted mt-1 mb-4">Click "Add Member Profile" to inaugurate the class registry.</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-forest text-white text-xs uppercase font-sans font-semibold tracking-wider rounded-lg"
              >
                Add Member
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((mem) => (
                <div
                  key={mem.id}
                  className="bg-white border border-editorial-border rounded-xl p-5 shadow-editorial hover:shadow-editorial-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={mem.photoUrl}
                        alt={mem.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-editorial-border flex-shrink-0 group-hover:border-forest transition-colors shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-mono text-muted">#{mem.orderIndex}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                              mem.isPublished
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-stone-100 text-stone-600 border-stone-300'
                            }`}
                          >
                            {mem.isPublished ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-ink truncate group-hover:text-forest transition-colors">
                          {mem.name}
                        </h3>
                        <p className="text-xs text-coral font-medium truncate font-sans">{mem.position}</p>
                      </div>
                    </div>

                    <p className="text-xs text-muted line-clamp-2 mb-3 font-sans leading-relaxed">{mem.bio}</p>
                    {mem.quote && (
                      <blockquote className="text-[11px] font-serif italic text-ink/80 border-l-2 border-forest/30 pl-2.5 py-0.5 bg-canvas/60 rounded-r">
                        &ldquo;{mem.quote}&rdquo;
                      </blockquote>
                    )}
                  </div>

                  <div className="pt-3 border-t border-editorial-border flex items-center justify-end gap-1.5 mt-4">
                    <button
                      onClick={() => handleOpenEdit(mem)}
                      className="p-1.5 text-muted hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                      title="Edit Profile"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(mem.id)}
                      className="p-1.5 text-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                      title="Delete Profile"
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
                    {editingId ? 'Edit Member Profile' : 'Add Class Member Profile'}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">Directory profile information for student leadership and contributors.</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1 text-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-serif font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Role / Class Responsibility
                  </label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Class President, Editor-in-Chief, Athletic Lead"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                  />
                </div>

                {/* Profile Photo Upload */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border">
                  <MediaUpload
                    label="Class Member Portrait Photo"
                    description="Upload an official yearbook or profile portrait (JPG, PNG, WEBP)."
                    type="image"
                    section="member"
                    value={photoUrl}
                    onChange={(url) => setPhotoUrl(url)}
                    required={true}
                  />
                </div>

                {/* Privacy Assurance Notice */}
                <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-100 flex items-start gap-2.5 text-xs text-forest">
                  <ShieldCheck className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <span className="font-bold">Student Privacy Protection:</span> Private contact details, phone numbers, and addresses are strictly omitted from public view. Only published profiles will appear on the public Members roster.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Short Biography
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe their contributions, interests, and aspirations..."
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Personal Motto / Quote
                  </label>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Words to live by..."
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-serif italic"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-sans font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="accent-forest w-4 h-4 rounded"
                    />
                    <span>Visible in Directory</span>
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
