'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MediaAsset } from '@/lib/types';
import { FolderOpen, Upload, Trash2, Copy, Check, Eye, Search, FileText, Video, Image as ImageIcon } from 'lucide-react';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.media) setMediaList(data.media);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', file.type.includes('pdf') ? 'pdf' : file.type.includes('video') ? 'video' : 'image');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.media) {
        fetchMedia();
      }
    } catch (err) {
      alert('Upload failed: ' + err);
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this media asset?')) return;
    try {
      await fetch(`/api/media/${id}`, { method: 'DELETE' });
      fetchMedia();
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  const filteredMedia = mediaList.filter(
    (m) =>
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.originalName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink">
        <AdminHeader
          title="Central Media Library"
          subtitle="Upload, search, preview, and organize digital photography, magazine PDFs, and video reels."
          action={
            <label className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all hover:shadow-forest/20 flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-4 h-4 text-white" />
              <span>{uploading ? 'Uploading File...' : 'Upload Asset'}</span>
              <input
                type="file"
                className="hidden"
                disabled={uploading}
                onChange={handleFileUpload}
              />
            </label>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media files by name..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-editorial-border rounded-xl text-xs text-ink placeholder-muted focus:outline-none focus:border-forest shadow-sm"
            />
          </div>

          {loading ? (
            <div className="text-center py-16 text-muted font-serif italic text-sm">
              Loading media repository...
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-editorial-border p-8 shadow-editorial">
              <FolderOpen className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="font-serif text-lg text-ink font-semibold">No media files found</p>
              <p className="text-xs text-muted mt-1">Upload high-resolution photography, magazine PDFs, or video reels using the button above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-editorial hover:shadow-editorial-lg transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-canvas-subtle flex items-center justify-center overflow-hidden border-b border-editorial-border">
                    {m.category === 'image' ? (
                      <img src={m.url} alt={m.filename} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                    ) : m.category === 'pdf' ? (
                      <FileText className="w-12 h-12 text-forest/70" />
                    ) : (
                      <Video className="w-12 h-12 text-coral/80" />
                    )}
                    <span className="absolute bottom-2 left-2 text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-forest/90 backdrop-blur text-canvas font-semibold shadow-sm">
                      {m.category}
                    </span>
                  </div>

                  <div className="p-3 text-xs flex flex-col justify-between flex-1">
                    <div>
                      <p className="font-mono text-[11px] text-ink truncate mb-1 font-medium" title={m.originalName || m.filename}>
                        {m.originalName || m.filename}
                      </p>
                      <p className="text-[10px] text-muted font-mono">
                        {(m.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <div className="pt-2 border-t border-editorial-border flex items-center justify-between mt-3">
                      <button
                        onClick={() => handleCopy(m.url, m.id)}
                        className="text-[10px] text-forest hover:text-coral flex items-center gap-1 font-mono font-semibold transition-colors"
                        title="Copy direct link"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1">
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-muted hover:text-forest transition-colors"
                          title="Open Asset"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1 text-muted hover:text-coral transition-colors"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
