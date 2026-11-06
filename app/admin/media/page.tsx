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
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Central Media Library"
          subtitle="Upload, search, preview, and organize digital photography, magazine PDFs, and video reels."
          action={
            <label className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-gold cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-navy" />
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

        <div className="p-6 sm:p-8 max-w-7xl space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media files by name..."
              className="w-full pl-10 pr-4 py-2 bg-charcoal border border-gold/20 rounded-xl text-xs text-ivory focus:outline-none focus:border-gold"
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-light font-serif">Loading media library...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-16 bg-charcoal rounded-2xl border border-gold/15">
              <FolderOpen className="w-10 h-10 text-gold/40 mx-auto mb-3" />
              <p className="text-sm font-serif text-ivory">No media files found.</p>
              <p className="text-xs text-muted-light mt-1">Upload photos, covers, or PDFs using the button above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((m) => (
                <div
                  key={m.id}
                  className="bg-charcoal border border-gold/20 rounded-xl overflow-hidden shadow group flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-navy-950 flex items-center justify-center overflow-hidden">
                    {m.category === 'image' ? (
                      <img src={m.url} alt={m.filename} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : m.category === 'pdf' ? (
                      <FileText className="w-12 h-12 text-gold/70" />
                    ) : (
                      <Video className="w-12 h-12 text-gold/70" />
                    )}
                    <span className="absolute bottom-2 left-2 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-navy/90 text-gold border border-gold/20">
                      {m.category}
                    </span>
                  </div>

                  <div className="p-3 text-xs">
                    <p className="font-mono text-[11px] text-ivory truncate mb-1" title={m.originalName || m.filename}>
                      {m.originalName || m.filename}
                    </p>
                    <p className="text-[10px] text-muted-light font-mono">
                      {(m.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                    <div className="pt-2 border-t border-gold/15 flex items-center justify-between mt-2">
                      <button
                        onClick={() => handleCopy(m.url, m.id)}
                        className="text-[10px] text-gold hover:underline flex items-center gap-1 font-mono"
                        title="Copy direct link"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
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
                          className="p-1 text-ivory/60 hover:text-gold"
                          title="Open Asset"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1 text-red-400 hover:text-red-300"
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
