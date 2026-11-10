'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { VideoItem } from '@/lib/types';
import { Video, Plus, Trash2, Edit, Eye, Play, X, Sparkles } from 'lucide-react';

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
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink">
        <AdminHeader
          title="Cinematic Video Center"
          subtitle="Manage YouTube channel broadcasts, cinematic reels, and video archives."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all hover:shadow-forest/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Video</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16 text-muted font-serif italic text-sm">
              Loading cinematic video reels...
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-16 bg-white border border-editorial-border rounded-xl p-8">
              <Video className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="font-serif text-lg text-ink font-semibold">No video productions published yet</p>
              <p className="text-xs text-muted mt-1 mb-4">Click "Add New Video" to link YouTube productions and documentaries.</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-forest text-white text-xs uppercase font-sans font-semibold tracking-wider rounded-lg"
              >
                Upload Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-editorial hover:shadow-editorial-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video bg-canvas-subtle border-b border-editorial-border overflow-hidden">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-forest/30 flex items-center justify-center group-hover:bg-forest/20 transition-colors">
                      <div className="w-11 h-11 rounded-full bg-forest/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded bg-forest/90 backdrop-blur text-canvas font-semibold shadow-sm">
                        {vid.category}
                      </span>
                      {vid.isFeatured && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-coral text-white font-bold shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-2.5 right-2.5 text-[10px] font-mono bg-forest/90 text-canvas px-2 py-0.5 rounded shadow-sm">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-ink mb-1 group-hover:text-forest transition-colors">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">{vid.description}</p>
                    </div>

                    <div className="pt-3 border-t border-editorial-border flex items-center justify-between mt-4">
                      <a
                        href={`/videos/${vid.id}`}
                        target="_blank"
                        className="text-xs text-forest hover:text-coral flex items-center gap-1.5 font-sans font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Watch Player</span>
                      </a>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(vid)}
                          className="p-1.5 text-muted hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                          title="Edit Video"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vid.id)}
                          className="p-1.5 text-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                          title="Delete Video"
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
                    {editingId ? 'Edit Video Feature' : 'Add New Video Production'}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">Link YouTube broadcasts, manage descriptions, and set custom thumbnails.</p>
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
                    Video Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Alif Friends 12 - Ten Year Retrospective"
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
                      placeholder="Documentary, Behind The Scenes"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="14:48"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Video Source Type */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-sans font-bold text-forest cursor-pointer">
                      <input
                        type="radio"
                        name="videoType"
                        value="youtube"
                        checked={videoType === 'youtube'}
                        onChange={() => setVideoType('youtube')}
                        className="accent-coral"
                      />
                      <span>YouTube Embed Link</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-sans font-bold text-forest cursor-pointer">
                      <input
                        type="radio"
                        name="videoType"
                        value="direct"
                        checked={videoType === 'direct'}
                        onChange={() => setVideoType('direct')}
                        className="accent-forest"
                      />
                      <span>Direct Video Upload (MP4 / WEBM)</span>
                    </label>
                  </div>

                  {videoType === 'youtube' ? (
                    <div>
                      <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-forest mb-1">
                        YouTube URL (Watch link or embed)
                      </label>
                      <input
                        type="text"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2.5 bg-white border border-editorial-border rounded-lg text-xs text-ink font-mono focus:outline-none focus:border-forest"
                      />
                    </div>
                  ) : (
                    <MediaUpload
                      label="Upload Video File"
                      description="Upload native MP4, WEBM, or MOV video file (Supported: Up to 1 GB per file)."
                      type="video"
                      section="video"
                      value={videoUrl}
                      onChange={(url) => setVideoUrl(url)}
                      required={true}
                    />
                  )}
                </div>

                {/* Custom Thumbnail */}
                <div className="p-4 rounded-xl bg-canvas border border-editorial-border">
                  <MediaUpload
                    label="Custom Video Thumbnail Poster"
                    description="Upload custom poster artwork for the player preview (JPG, PNG, WEBP)."
                    type="image"
                    section="video"
                    value={thumbnailUrl}
                    onChange={(url) => setThumbnailUrl(url)}
                    required={true}
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Description & Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Summarize the video highlights, interviewees, and production credits..."
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
                    <span>Featured Video Highlight</span>
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
