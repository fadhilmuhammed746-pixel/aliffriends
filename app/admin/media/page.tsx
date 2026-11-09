'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { MediaUpload } from '@/components/admin/MediaUpload';
import {
  FolderOpen,
  Upload,
  Trash2,
  Copy,
  Check,
  Eye,
  Search,
  FileText,
  Video,
  Image as ImageIcon,
  LayoutGrid,
  List as ListIcon,
  AlertTriangle,
  X,
  ExternalLink,
  ShieldAlert,
  Calendar,
  Layers,
  Cloud,
  Database,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';

interface MediaItemWithUsage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  category: 'image' | 'video' | 'pdf' | 'other';
  section?: string;
  uploadedBy?: string;
  storageLocation?: 'supabase' | 'firebase' | 'local';
  createdAt: string;
  isUsed?: boolean;
  usageCount?: number;
  references?: Array<{ section: string; title: string; id: string }>;
}

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItemWithUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItemWithUsage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItemWithUsage | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [usageModalItem, setUsageModalItem] = useState<MediaItemWithUsage | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (sectionFilter !== 'all') params.append('section', sectionFilter);

      const res = await fetch(`/api/media?${params.toString()}`);
      const data = await res.json();
      if (data.media) setMediaList(data.media);
    } catch (err) {
      console.error('Fetch media failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [categoryFilter, sectionFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia();
  };

  // Cloud Storage Metrics & Provider identification
  const getProvider = (m: MediaItemWithUsage): 'firebase' | 'supabase' => {
    if (
      m.storageLocation === 'firebase' ||
      m.url.includes('firebasestorage') ||
      m.url.includes('storage.googleapis.com')
    ) {
      return 'firebase';
    }
    return 'supabase';
  };

  const targetStorageBytes = 1024 * 1024 * 1024; // 1.0 GB Target
  const totalStorageBytes = mediaList.reduce((acc, m) => acc + (m.size || 0), 0);
  const firebaseAssets = mediaList.filter((m) => getProvider(m) === 'firebase');
  const firebaseBytes = firebaseAssets.reduce((acc, m) => acc + (m.size || 0), 0);
  const supabaseAssets = mediaList.filter((m) => getProvider(m) === 'supabase');
  const supabaseBytes = supabaseAssets.reduce((acc, m) => acc + (m.size || 0), 0);
  const percentUsed = Math.min(100, (totalStorageBytes / targetStorageBytes) * 100);

  const handleCopy = (url: string, id: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const confirmDelete = async (force: boolean = false) => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');

    try {
      const res = await fetch(`/api/media/${deleteTarget.id}?force=${force}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || 'Failed to delete media asset.');
        return;
      }

      setDeleteTarget(null);
      fetchMedia();
    } catch (err: any) {
      setDeleteError(err.message || 'Delete operation failed.');
    } finally {
      setDeleting(false);
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink">
        <AdminHeader
          title="Central Media Library"
          subtitle="Enterprise media hub: search, upload, organize, inspect usages, and safely manage photography, magazine PDFs, and videos."
          action={
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-coral-light" />
              <span>Upload New Asset</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
          {/* Storage Capacity & Multi-Cloud Provider Dashboard */}
          <div className="bg-white border border-editorial-border rounded-2xl p-5 sm:p-6 shadow-subtle space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-editorial-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-forest/10 text-forest tracking-wider">
                    Cloud Storage Metrics
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Storage Engines Online
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-forest mt-1">
                  Repository Capacity & Provider Breakdown
                </h3>
                <p className="text-xs text-ink-muted">
                  Dual-cloud architecture active: Firebase Cloud Storage supports high-capacity assets up to 1 GB; Supabase Storage supports fast direct assets up to 50 MB.
                </p>
              </div>

              {/* Total Storage Metric Pill */}
              <div className="bg-canvas-warm border border-editorial-border rounded-xl px-4 py-2.5 flex items-center gap-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-tag text-ink-muted block">
                    Total Storage Allocated
                  </span>
                  <span className="font-mono text-base font-bold text-forest">
                    {formatBytes(totalStorageBytes)}
                  </span>
                  <span className="text-xs text-ink-muted font-mono ml-1">/ 1.0 GB Target</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-coral">
                    {percentUsed.toFixed(1)}%
                  </span>
                  <span className="text-[10px] block font-mono text-ink-muted">Used</span>
                </div>
              </div>
            </div>

            {/* Global Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                <span>Storage Utilization ({percentUsed.toFixed(2)}% of 1.0 GB target)</span>
                <span>{formatBytes(Math.max(0, targetStorageBytes - totalStorageBytes))} Free</span>
              </div>
              <div className="w-full h-2.5 bg-canvas-warm rounded-full overflow-hidden border border-editorial-border">
                <div
                  className="h-full bg-gradient-to-r from-forest via-emerald-600 to-coral transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(1, percentUsed)}%` }}
                />
              </div>
            </div>

            {/* Multi-Cloud Provider Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Firebase Cloud Storage Card */}
              <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-amber-600" />
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-amber-900">
                      Firebase Cloud Storage
                    </span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 font-bold">
                      Up to 1 GB
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800/80 font-sans">
                    Archival magazine PDFs, full-length 4K videos, and high-definition event recordings.
                  </p>
                  <div className="flex items-center gap-3 pt-2 text-xs font-mono">
                    <span className="font-bold text-amber-950">{formatBytes(firebaseBytes)}</span>
                    <span className="text-amber-700/80">•</span>
                    <span className="text-amber-800">{firebaseAssets.length} file(s) hosted</span>
                  </div>
                </div>
              </div>

              {/* Supabase Storage Card */}
              <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-700" />
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-emerald-950">
                      Supabase Storage
                    </span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-bold">
                      Up to 50 MB
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 font-sans">
                    Fast direct uploads, editorial articles, newspaper spreads, member portraits, and secure receipts.
                  </p>
                  <div className="flex items-center gap-3 pt-2 text-xs font-mono">
                    <span className="font-bold text-emerald-950">{formatBytes(supabaseBytes)}</span>
                    <span className="text-emerald-700/80">•</span>
                    <span className="text-emerald-800">{supabaseAssets.length} file(s) hosted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Search, Filters & View Toggle */}
          <div className="bg-white border border-editorial-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by file name or keyword..."
                  className="w-full pl-10 pr-4 py-2 bg-canvas border border-editorial-border rounded-xl text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </form>

              {/* View toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-canvas border border-editorial-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-forest text-white shadow-xs' : 'text-ink-muted hover:text-ink'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-forest text-white shadow-xs' : 'text-ink-muted hover:text-ink'
                    }`}
                    title="List View"
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-editorial-border text-xs">
              {/* Type Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">Type:</span>
                {[
                  { key: 'all', label: 'All Media' },
                  { key: 'image', label: 'Images' },
                  { key: 'video', label: 'Videos' },
                  { key: 'pdf', label: 'PDF Documents' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCategoryFilter(cat.key)}
                    className={`px-3 py-1 rounded-full text-[11px] font-sans transition-all ${
                      categoryFilter === cat.key
                        ? 'bg-forest text-white font-semibold'
                        : 'bg-canvas hover:bg-canvas-subtle text-ink-muted border border-editorial-border'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Section Filter */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">Section:</span>
                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="bg-canvas border border-editorial-border rounded-lg px-2.5 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest font-sans"
                >
                  <option value="all">All Sections</option>
                  <option value="magazine">Magazines</option>
                  <option value="newspaper">Newspaper</option>
                  <option value="gallery">Gallery</option>
                  <option value="video">Videos</option>
                  <option value="program">Programs</option>
                  <option value="achievement">Achievements</option>
                  <option value="member">Members</option>
                  <option value="announcement">Announcements</option>
                  <option value="finance">Finance</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
          </div>

          {/* Media Count Summary */}
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted px-1">
            <span>Showing {mediaList.length} media assets</span>
            <span>Total storage: {formatBytes(mediaList.reduce((acc, m) => acc + (m.size || 0), 0))}</span>
          </div>

          {/* Main Content Area */}
          {loading ? (
            <div className="text-center py-20 text-ink-muted font-serif italic text-sm">
              Loading enterprise media repository...
            </div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-editorial-border p-8 shadow-subtle space-y-3">
              <FolderOpen className="w-12 h-12 text-ink-muted/40 mx-auto" />
              <p className="font-serif text-lg text-ink font-semibold">No media assets found</p>
              <p className="text-xs text-ink-muted max-w-md mx-auto">
                No files match your current search or filter query. You can upload new photography, magazine PDFs, and video files directly.
              </p>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg text-xs font-semibold"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload First File
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaList.map((m) => {
                const isPdf = m.category === 'pdf';
                const isVideo = m.category === 'video';

                return (
                  <div
                    key={m.id}
                    className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-subtle hover:shadow-card transition-all group flex flex-col justify-between"
                  >
                    {/* Media Thumbnail */}
                    <div
                      onClick={() => setPreviewItem(m)}
                      className="relative aspect-square bg-canvas flex items-center justify-center overflow-hidden border-b border-editorial-border cursor-pointer group-hover:brightness-95 transition-all"
                    >
                      {m.category === 'image' ? (
                        <Image
                          src={m.url}
                          alt={m.filename}
                          fill
                          sizes="200px"
                          className="object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                      ) : isPdf ? (
                        <div className="flex flex-col items-center justify-center text-red-500">
                          <FileText className="w-12 h-12" />
                          <span className="text-[10px] font-mono font-bold uppercase mt-1">PDF Document</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-coral">
                          <Video className="w-12 h-12" />
                          <span className="text-[10px] font-mono font-bold uppercase mt-1">Video File</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <span className="absolute top-2 left-2 text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-forest/90 backdrop-blur text-white font-semibold shadow-xs">
                        {m.category}
                      </span>

                      {/* Usage Badge */}
                      {m.isUsed ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUsageModalItem(m);
                          }}
                          className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500 text-white font-bold shadow-xs hover:bg-amber-600 transition-colors"
                          title="Click to view linked publications"
                        >
                          In Use ({m.usageCount})
                        </button>
                      ) : (
                        <span className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 text-white/90">
                          Unlinked
                        </span>
                      )}
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-3 text-xs flex flex-col justify-between flex-1">
                      <div>
                        <p className="font-mono text-[11px] text-ink truncate mb-1 font-medium" title={m.originalName || m.filename}>
                          {m.originalName || m.filename}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-ink-muted font-mono">
                          <span>{formatBytes(m.size)}</span>
                          <span>{formatDate(m.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-mono mt-1.5 pt-1.5 border-t border-editorial-border/60">
                          <span className="text-ink-muted">Engine:</span>
                          {getProvider(m) === 'firebase' ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                              Firebase (1GB)
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                              Supabase (50MB)
                            </span>
                          )}
                        </div>
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
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy URL</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setPreviewItem(m)}
                            className="p-1 text-ink-muted hover:text-forest transition-colors rounded"
                            title="Preview Asset"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(m)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors rounded"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white border border-editorial-border rounded-2xl overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-canvas border-b border-editorial-border font-serif uppercase tracking-wider text-[11px] text-forest">
                    <tr>
                      <th className="py-3 px-4">Asset</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Section</th>
                      <th className="py-3 px-4">Engine</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Uploaded</th>
                      <th className="py-3 px-4">Usage Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-editorial-border">
                    {mediaList.map((m) => (
                      <tr key={m.id} className="hover:bg-canvas/50 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div
                            onClick={() => setPreviewItem(m)}
                            className="w-10 h-10 rounded-lg border border-editorial-border bg-canvas overflow-hidden relative flex items-center justify-center cursor-pointer flex-shrink-0"
                          >
                            {m.category === 'image' ? (
                              <Image src={m.url} alt={m.filename} fill sizes="40px" className="object-cover" />
                            ) : m.category === 'pdf' ? (
                              <FileText className="w-5 h-5 text-red-500" />
                            ) : (
                              <Video className="w-5 h-5 text-coral" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-mono text-xs text-ink truncate font-medium" title={m.originalName || m.filename}>
                              {m.originalName || m.filename}
                            </p>
                            <p className="font-mono text-[10px] text-ink-muted truncate" title={m.url}>
                              {m.url}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 uppercase font-mono text-[10px] text-ink-muted">
                          {m.category}
                        </td>
                        <td className="py-3 px-4 capitalize font-sans text-xs text-ink">
                          {m.section || 'General'}
                        </td>
                        <td className="py-3 px-4">
                          {getProvider(m) === 'firebase' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <Cloud className="w-3 h-3 text-amber-600" />
                              Firebase (1GB)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <Database className="w-3 h-3 text-emerald-600" />
                              Supabase (50MB)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-ink">
                          {formatBytes(m.size)}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-ink-muted">
                          {formatDate(m.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          {m.isUsed ? (
                            <button
                              type="button"
                              onClick={() => setUsageModalItem(m)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-mono hover:bg-amber-100 transition-colors"
                            >
                              <Layers className="w-3 h-3 text-amber-600" />
                              <span>Used in {m.usageCount} places</span>
                            </button>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono text-ink-muted bg-canvas border border-editorial-border">
                              Unlinked
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleCopy(m.url, m.id)}
                              className="p-1.5 text-forest hover:text-coral transition-colors"
                              title="Copy Link"
                            >
                              {copiedId === m.id ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setPreviewItem(m)}
                              className="p-1.5 text-ink-muted hover:text-forest transition-colors"
                              title="Preview Asset"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(m)}
                              className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Asset"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-canvas border border-editorial-border rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-editorial-border pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-coral" />
                <h3 className="font-serif font-bold text-base text-forest uppercase tracking-wider">
                  Direct Media Uploader
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUploadModalOpen(false);
                  fetchMedia();
                }}
                className="p-1.5 text-ink-muted hover:text-forest rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <MediaUpload
              label="Select or Drag Files to Upload"
              description="Upload photography, magazine PDFs, and video reels. Files will automatically be processed, virus-scanned, and cataloged."
              type="any"
              multiple={true}
              section="general"
              onChange={() => {
                fetchMedia();
              }}
            />

            <div className="flex items-center justify-end pt-3 border-t border-editorial-border">
              <button
                type="button"
                onClick={() => {
                  setUploadModalOpen(false);
                  fetchMedia();
                }}
                className="px-4 py-2 bg-forest text-white rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-editorial-border flex items-center justify-between bg-canvas">
              <div className="min-w-0 pr-4">
                <h3 className="font-serif font-bold text-sm text-forest truncate">
                  {previewItem.originalName || previewItem.filename}
                </h3>
                <p className="text-[11px] font-mono text-ink-muted mt-0.5">
                  {previewItem.mimeType} • {formatBytes(previewItem.size)} • Uploaded {formatDate(previewItem.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-forest hover:text-coral rounded"
                  title="Open in new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 text-ink-muted hover:text-forest rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 flex items-center justify-center bg-zinc-950 overflow-auto min-h-[300px]">
              {previewItem.category === 'image' ? (
                <img
                  src={previewItem.url}
                  alt={previewItem.filename}
                  className="max-h-[70vh] max-w-full object-contain rounded"
                />
              ) : previewItem.category === 'video' ? (
                <video
                  src={previewItem.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] max-w-full rounded"
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-xl max-w-md">
                  <FileText className="w-16 h-16 text-red-500 mx-auto mb-3" />
                  <p className="font-serif font-bold text-base text-forest mb-1">
                    PDF Document File
                  </p>
                  <p className="text-xs text-ink-muted mb-4 font-mono break-all">
                    {previewItem.filename}
                  </p>
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg text-xs font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 text-coral-light" />
                    Open PDF in Viewer
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Usage Information Modal */}
      {usageModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-canvas border border-editorial-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-editorial-border pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-forest" />
                <h3 className="font-serif font-bold text-sm text-forest uppercase tracking-wider">
                  Asset Usage References
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUsageModalItem(null)}
                className="p-1 text-ink-muted hover:text-forest"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-ink-muted">
              This media file is currently referenced in{' '}
              <span className="font-bold text-forest">{usageModalItem.usageCount} location(s)</span> across the platform:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {usageModalItem.references?.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-editorial-border rounded-xl text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-forest/10 text-forest font-bold">
                      {ref.section}
                    </span>
                    <p className="font-serif font-bold text-forest mt-1">{ref.title}</p>
                  </div>
                  <span className="font-mono text-[10px] text-ink-muted">{ref.id}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-editorial-border">
              <button
                type="button"
                onClick={() => setUsageModalItem(null)}
                className="px-4 py-2 bg-forest text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (with in-use warning) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-red-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <ShieldAlert className="w-7 h-7 flex-shrink-0" />
              <div>
                <h3 className="font-serif font-bold text-base text-red-700">
                  Delete Media Asset
                </h3>
                <p className="text-xs text-ink-muted font-mono truncate max-w-xs">
                  {deleteTarget.originalName || deleteTarget.filename}
                </p>
              </div>
            </div>

            {deleteTarget.isUsed ? (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Warning: This file is currently in use!</span>
                </div>
                <p>
                  This media item is referenced in <span className="font-bold">{deleteTarget.usageCount} publication(s)</span> including:
                </p>
                <ul className="list-disc pl-5 space-y-1 font-mono text-[11px]">
                  {deleteTarget.references?.slice(0, 3).map((r, i) => (
                    <li key={i}>{r.section}: {r.title}</li>
                  ))}
                </ul>
                <p className="font-medium text-[11px] text-amber-800 pt-1">
                  Deleting it will break these media displays on the public website.
                </p>
              </div>
            ) : (
              <p className="text-xs text-ink-muted">
                Are you sure you want to permanently delete this file? This action will remove it from disk and the media catalog.
              </p>
            )}

            {deleteError && (
              <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-editorial-border">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 border border-editorial-border text-ink hover:bg-canvas rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(deleteTarget.isUsed)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                {deleting ? 'Deleting...' : deleteTarget.isUsed ? 'Force Delete Anyway' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
