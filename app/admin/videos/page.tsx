'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { VideoItem } from '@/lib/types';
import { Video, Plus, Trash2, Edit, Eye, Play, X } from 'lucide-react';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Documentary');
  const [videoType, setVideoType] = useState<'youtube' | 'direct'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('10:00');
  const [collectionName, setCollectionName] = useState('Cinematic Archive');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos?all=true');
      const data = await res.json();
      if (data.videos) setVideos(data.videos);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Documentary');
    setVideoType('youtube');
    setYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setVideoUrl('');
    setThumbnailUrl('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80');
    setDuration('12:30');
    setCollectionName('Cinematic Archive');
    setIsFeatured(false);
    setIsPublished(true);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (v: VideoItem) => {
    setEditingId(v.id);
    setTitle(v.title);
    setDescription(v.description);
    setCategory(v.category);
    setVideoType(v.videoType);
    setYoutubeUrl(v.youtubeUrl || '');
    setVideoUrl(v.videoUrl || '');
    setThumbnailUrl(v.thumbnailUrl);
    setDuration(v.duration || '0:00');
    setCollectionName(v.collectionName || '');
    setIsFeatured(v.isFeatured);
    setIsPublished(v.isPublished);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      category,
      videoType,
      youtubeUrl,
      videoUrl,
      thumbnailUrl,
      duration,
      collectionName,
      isFeatured,
      isPublished,
    };

    try {
      if (editingId) {
        await fetch(`/api/videos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setModalOpen(false);
      fetchVideos();
    } catch (err) {
      alert('Save failed: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video entry?')) return;
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      fetchVideos();
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Cinematic Video Center"
          subtitle="Manage YouTube channel broadcasts, cinematic reels, and video archives."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-gold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Video</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          {loading ? (
            <div className="text-center py-12 text-muted-light font-serif">Loading videos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-charcoal border border-gold/20 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-navy-950">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-navy/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gold/90 text-navy flex items-center justify-center">
                        <Play className="w-4 h-4 fill-navy ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-navy/90 text-ivory px-1.5 py-0.5 rounded border border-gold/20">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20 inline-block mb-2">
                        {vid.category}
                      </span>
                      <h3 className="font-serif font-bold text-base text-ivory mb-1">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-muted-light line-clamp-2">{vid.description}</p>
                    </div>

                    <div className="pt-3 border-t border-gold/15 flex items-center justify-between mt-4">
                      <a
                        href={`/videos/${vid.id}`}
                        target="_blank"
                        className="text-xs text-gold hover:underline flex items-center gap-1 font-serif"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Watch</span>
                      </a>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(vid)}
                          className="p-1.5 text-ivory/70 hover:text-gold hover:bg-navy rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vid.id)}
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
                  {editingId ? 'Edit Video' : 'Add New Video Reel'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-ivory/60 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Video Title
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
                      placeholder="Documentary, Behind The Scenes"
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="14:48"
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    YouTube URL (Embeddable)
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-xs text-ivory font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Custom Thumbnail URL
                  </label>
                  <input
                    type="text"
                    required
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-xs text-ivory font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Description
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
                    <span>Featured Video Highlight</span>
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
                    Save Video
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
