'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import * as tus from 'tus-js-client';
import {
  Upload,
  X,
  FileText,
  Video,
  Image as ImageIcon,
  Check,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  Eye,
  Trash2,
  Clock,
  Gauge,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

export type MediaType = 'image' | 'video' | 'pdf' | 'any';

interface MediaUploadProps {
  label: string;
  description?: string;
  type?: MediaType;
  value?: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  section?: string;
  maxSizeMB?: number;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
  required?: boolean;
  className?: string;
}

interface MediaAssetSummary {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  category: 'image' | 'video' | 'pdf' | 'other';
  section?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  label,
  description,
  type = 'image',
  value,
  onChange,
  multiple = false,
  section = 'general',
  maxSizeMB,
  aspectRatio = 'auto',
  required = false,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [activeFileName, setActiveFileName] = useState('');
  const [lastSelectedFile, setLastSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<MediaAssetSummary[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const tusUploadRef = useRef<tus.Upload | null>(null);

  // Accept attribute string
  const acceptAttr =
    type === 'image'
      ? 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif'
      : type === 'video'
      ? 'video/mp4,video/webm,video/quicktime,video/x-matroska'
      : type === 'pdf'
      ? 'application/pdf,.pdf'
      : 'image/*,video/*,application/pdf';

  // Global supported maximum size is 250 MB
  const defaultLimit = 250;
  const effectiveLimitMB = maxSizeMB || defaultLimit;

  // Format bytes helper
  const formatBytes = (bytes?: number) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Perform Direct Supabase Storage Upload
  // Large files stream directly to Supabase Storage and NEVER pass through Vercel Functions.
  const uploadFileDirect = async (file: File): Promise<string | null> => {
    // 1. Client-side size check (250 MB limit)
    if (file.size > effectiveLimitMB * 1024 * 1024) {
      throw new Error(`File '${file.name}' exceeds the maximum allowed limit of ${effectiveLimitMB} MB.`);
    }

    setLastSelectedFile(file);
    setActiveFileName(file.name);
    setTotalBytes(file.size);
    setUploadedBytes(0);
    setUploadSpeed('');
    setEstimatedTime('');

    // 2. Obtain signed upload authorization from server (only JSON metadata, 0 file bytes)
    const signRes = await fetch('/api/upload/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        section,
      }),
    });

    if (!signRes.ok) {
      const errData = await signRes.json().catch(() => ({}));
      throw new Error(errData.error || `Upload authorization failed with HTTP ${signRes.status}.`);
    }

    const signData = await signRes.json();
    if (!signData.success || !signData.signedUrl) {
      throw new Error(signData.error || 'Failed to acquire secure cloud upload token.');
    }

    const { signedUrl, path: uniqueFileName, publicUrl, category } = signData;

    // 3. Direct browser-to-Supabase transfer with live progress tracking
    const startTime = Date.now();
    let lastLoaded = 0;
    let lastTime = startTime;

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.open('PUT', signedUrl);
      xhr.setRequestHeader(
        'Content-Type',
        file.type || (category === 'pdf' ? 'application/pdf' : 'application/octet-stream')
      );
      xhr.setRequestHeader('x-upsert', 'false');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
          setProgress(percent);
          setUploadedBytes(event.loaded);
          setTotalBytes(event.total);

          const now = Date.now();
          const elapsedSec = (now - lastTime) / 1000;
          if (elapsedSec >= 0.4) {
            const bytesPerSec = (event.loaded - lastLoaded) / elapsedSec;
            if (bytesPerSec > 0) {
              const speedStr =
                bytesPerSec >= 1024 * 1024
                  ? `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`
                  : `${Math.round(bytesPerSec / 1024)} KB/s`;
              setUploadSpeed(speedStr);

              const remainingBytes = event.total - event.loaded;
              const remainingSec = Math.round(remainingBytes / bytesPerSec);
              if (remainingSec <= 1) {
                setEstimatedTime('Finalizing...');
              } else if (remainingSec < 60) {
                setEstimatedTime(`${remainingSec}s remaining`);
              } else {
                const mins = Math.floor(remainingSec / 60);
                const secs = remainingSec % 60;
                setEstimatedTime(`${mins}m ${secs}s remaining`);
              }
            }
            lastLoaded = event.loaded;
            lastTime = now;
          }
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          resolve();
        } else {
          reject(
            new Error(
              `Direct storage transfer rejected (HTTP ${xhr.status}: ${
                xhr.statusText || 'Upload error'
              }).`
            )
          );
        }
      };

      xhr.onerror = () =>
        reject(new Error('Network connectivity lost during direct storage transfer.'));
      xhr.onabort = () => reject(new Error('Upload cancelled.'));

      xhr.send(file);
    });

    // 4. Local fast PDF page-count extraction (non-blocking)
    let detectedPageCount: number | undefined = undefined;
    if (category === 'pdf' || file.name.endsWith('.pdf')) {
      try {
        const slice = await file.slice(0, 512 * 1024).text();
        const countMatch = slice.match(/\/Count\s+(\d+)/);
        if (countMatch) {
          detectedPageCount = parseInt(countMatch[1], 10);
        }
      } catch {
        // Non-blocking
      }
    }

    // 5. Complete registration in database (metadata only)
    const completeRes = await fetch('/api/upload/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: uniqueFileName,
        originalName: file.name,
        url: publicUrl || signedUrl,
        mimeType: file.type || (category === 'pdf' ? 'application/pdf' : 'application/octet-stream'),
        size: file.size,
        category: category || 'other',
        section,
        pageCount: detectedPageCount,
      }),
    });

    if (!completeRes.ok) {
      const errData = await completeRes.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to catalog file metadata (${completeRes.status}).`);
    }

    const completeData = await completeRes.json();
    return completeData.url;
  };

  // Handle files selection
  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setErrorMessage('');
    setSuccessMessage('');
    setUploading(true);
    setProgress(0);

    try {
      if (multiple) {
        const currentList = Array.isArray(value) ? [...value] : value ? [value] : [];
        const newUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const url = await uploadFileDirect(file);
          if (url) newUrls.push(url);
        }

        const combined = [...currentList, ...newUrls];
        onChange(combined);
        setSuccessMessage(`Successfully uploaded ${newUrls.length} file(s) directly to cloud storage.`);
      } else {
        const file = files[0];
        const url = await uploadFileDirect(file);
        if (url) {
          onChange(url);
          setSuccessMessage(`'${file.name}' uploaded successfully to persistent cloud storage.`);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Direct cloud upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
      xhrRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Retry upload
  const handleRetry = () => {
    if (lastSelectedFile) {
      handleFiles([lastSelectedFile]);
    }
  };

  // Cancel upload
  const cancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    if (tusUploadRef.current) {
      tusUploadRef.current.abort();
      tusUploadRef.current = null;
    }
    setUploading(false);
    setProgress(0);
    setErrorMessage('Upload cancelled.');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Open Media Library Modal
  const openLibraryModal = async () => {
    setLibraryModalOpen(true);
    setLibraryLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.media) {
        let list: MediaAssetSummary[] = data.media;
        if (type !== 'any') {
          list = list.filter((m) => m.category === type);
        }
        setLibraryAssets(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    if (multiple) {
      const currentList = Array.isArray(value) ? [...value] : value ? [value] : [];
      if (!currentList.includes(url)) {
        onChange([...currentList, url]);
      }
    } else {
      onChange(url);
    }
    setLibraryModalOpen(false);
    setSuccessMessage('Media selected from library.');
  };

  const removeItem = (targetUrl: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((u) => u !== targetUrl));
    } else {
      onChange('');
    }
    setSuccessMessage('');
  };

  // Render Single Preview
  const renderSinglePreview = (url: string) => {
    const isPdf = url.toLowerCase().includes('.pdf') || type === 'pdf';
    const isVideo =
      url.toLowerCase().match(/\.(mp4|webm|mov|mkv)$/i) ||
      type === 'video' ||
      url.includes('youtube.com') ||
      url.includes('youtu.be');

    return (
      <div className="relative border border-editorial-border rounded-xl bg-white p-3 shadow-subtle group">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {isPdf ? (
              <div className="w-12 h-14 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center text-red-600 flex-shrink-0">
                <FileText className="w-6 h-6" />
                <span className="text-[9px] font-mono font-bold uppercase mt-0.5">PDF</span>
              </div>
            ) : isVideo ? (
              <div className="w-16 h-12 bg-forest-900 border border-forest-700 rounded-lg flex items-center justify-center text-coral-light flex-shrink-0 relative overflow-hidden">
                <Video className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-lg border border-editorial-border overflow-hidden relative flex-shrink-0 bg-canvas">
                <Image
                  src={url}
                  alt="Uploaded media preview"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-mono font-medium text-ink truncate" title={url}>
                {url.split('/').pop() || url}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-canvas-subtle border border-editorial-border text-ink-muted">
                  {isPdf ? 'PDF Document' : isVideo ? 'Video' : 'Image'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  Direct Storage
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-forest hover:text-coral font-sans flex items-center gap-1 transition-colors ml-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-ink-muted hover:text-forest hover:bg-canvas rounded-lg transition-colors border border-editorial-border"
              title="Replace File"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={openLibraryModal}
              className="p-1.5 text-ink-muted hover:text-forest hover:bg-canvas rounded-lg transition-colors border border-editorial-border"
              title="Pick from Library"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => removeItem(url)}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
              title="Remove File"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isVideo && !url.includes('youtube') && (
          <div className="mt-3 rounded-lg overflow-hidden border border-editorial-border bg-black max-h-48">
            <video src={url} controls className="w-full max-h-48 object-contain" />
          </div>
        )}
      </div>
    );
  };

  const singleValue = typeof value === 'string' ? value : '';
  const multipleValues = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label & Description */}
      <div className="flex items-center justify-between">
        <label className="block font-serif text-xs uppercase tracking-wider font-bold text-forest">
          {label} {required && <span className="text-coral">*</span>}
        </label>
        <span className="text-[10px] font-mono text-ink-muted">
          Supported: Up to {effectiveLimitMB} MB • Direct Cloud Upload
        </span>
      </div>

      {description && <p className="text-[11px] text-ink-muted">{description}</p>}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptAttr}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
        }}
        className="hidden"
      />

      {/* Upload Dropzone */}
      {(!singleValue || multiple) && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
            isDragging
              ? 'border-forest bg-forest/5 scale-[1.01]'
              : 'border-editorial-border hover:border-forest/40 bg-white'
          }`}
        >
          {uploading ? (
            <div className="py-4 space-y-3.5 max-w-md mx-auto">
              {/* File title & percentage */}
              <div className="flex items-center justify-between text-xs font-mono text-forest">
                <span className="flex items-center gap-2 truncate max-w-[240px]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-coral flex-shrink-0" />
                  <span className="truncate">{activeFileName || 'Uploading file...'}</span>
                </span>
                <span className="font-bold text-sm text-forest-900">{progress}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-canvas-subtle rounded-full overflow-hidden border border-editorial-border">
                <div
                  className="h-full bg-gradient-to-r from-forest to-emerald-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Stats: Bytes, Speed, Remaining Time */}
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
                <span>
                  {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
                </span>
                {uploadSpeed && (
                  <span className="inline-flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-forest" />
                    {uploadSpeed}
                  </span>
                )}
                {estimatedTime && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-coral" />
                    {estimatedTime}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={cancelUpload}
                  className="px-3 py-1 rounded text-xs font-mono text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                >
                  Cancel Upload
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-canvas flex items-center justify-center text-forest border border-editorial-border">
                {type === 'pdf' ? (
                  <FileText className="w-5 h-5 text-coral" />
                ) : type === 'video' ? (
                  <Video className="w-5 h-5 text-coral" />
                ) : (
                  <Upload className="w-5 h-5 text-forest" />
                )}
              </div>

              <div>
                <p className="text-xs font-sans text-ink">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-bold text-forest hover:text-coral transition-colors underline mr-1"
                  >
                    Click to browse
                  </button>
                  or drag and drop your file here
                </p>
                <p className="text-[10px] text-ink-muted mt-0.5">
                  Direct cloud transfer • Large files supported up to {effectiveLimitMB} MB
                </p>
              </div>

              {/* Central Media Library Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={openLibraryModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas hover:bg-canvas-subtle text-forest border border-editorial-border text-[11px] font-sans font-semibold transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-coral" />
                  <span>Choose from Media Library</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message with Retry */}
      {errorMessage && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {lastSelectedFile && !uploading && (
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 hover:bg-red-200 text-red-900 font-mono text-[11px] font-bold transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Single Value Display */}
      {!multiple && singleValue && renderSinglePreview(singleValue)}

      {/* Multiple Values Display */}
      {multiple && multipleValues.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span>Attached Media ({multipleValues.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {multipleValues.map((itemUrl, index) => {
              const isPdf = itemUrl.toLowerCase().includes('.pdf');
              const isVid = itemUrl.toLowerCase().match(/\.(mp4|webm|mov)$/i);

              return (
                <div
                  key={`${itemUrl}_${index}`}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-editorial-border bg-white shadow-subtle gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-[10px] text-ink-muted font-bold w-4">
                      {index + 1}.
                    </span>

                    {isPdf ? (
                      <FileText className="w-7 h-7 text-red-500 flex-shrink-0" />
                    ) : isVid ? (
                      <Video className="w-7 h-7 text-coral flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg border border-editorial-border overflow-hidden relative flex-shrink-0 bg-canvas">
                        <Image
                          src={itemUrl}
                          alt={`Media item ${index + 1}`}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-[11px] font-mono text-ink truncate" title={itemUrl}>
                        {itemUrl.split('/').pop() || itemUrl}
                      </p>
                      <a
                        href={itemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-forest hover:text-coral font-sans flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(itemUrl)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-100 flex-shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      {libraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-editorial-border max-w-3xl w-full max-h-[85vh] flex flex-col shadow-editorial overflow-hidden">
            <div className="p-4 border-b border-editorial-border flex items-center justify-between bg-canvas">
              <div>
                <h3 className="font-serif font-bold text-forest text-base">Select from Media Library</h3>
                <p className="text-xs text-ink-muted">Choose an existing cloud-stored asset</p>
              </div>
              <button
                type="button"
                onClick={() => setLibraryModalOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-editorial-border bg-white">
              <input
                type="text"
                placeholder="Search media by filename..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-editorial-border rounded-lg focus:outline-none focus:border-forest font-mono"
              />
            </div>

            <div className="p-4 overflow-y-auto flex-1 min-h-[300px]">
              {libraryLoading ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-2 text-ink-muted">
                  <RefreshCw className="w-6 h-6 animate-spin text-coral" />
                  <span className="text-xs font-mono">Loading library assets...</span>
                </div>
              ) : libraryAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-ink-muted space-y-1">
                  <FolderOpen className="w-8 h-8 text-ink-muted/40" />
                  <p className="text-xs">No media assets found in library.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {libraryAssets
                    .filter((m) =>
                      m.filename.toLowerCase().includes(librarySearch.toLowerCase()) ||
                      m.originalName?.toLowerCase().includes(librarySearch.toLowerCase())
                    )
                    .map((asset) => {
                      const isPdf = asset.category === 'pdf' || asset.url.endsWith('.pdf');
                      const isVid = asset.category === 'video';

                      return (
                        <div
                          key={asset.id}
                          onClick={() => handleSelectFromLibrary(asset.url)}
                          className="border border-editorial-border rounded-xl p-2 bg-white hover:border-forest hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center group"
                        >
                          <div className="w-full h-24 relative rounded-lg overflow-hidden bg-canvas mb-2 flex items-center justify-center border border-editorial-border/60">
                            {isPdf ? (
                              <div className="flex flex-col items-center justify-center text-red-500">
                                <FileText className="w-8 h-8" />
                                <span className="text-[9px] font-mono font-bold mt-1 uppercase">PDF</span>
                              </div>
                            ) : isVid ? (
                              <div className="flex items-center justify-center text-coral">
                                <Video className="w-8 h-8" />
                              </div>
                            ) : (
                              <Image
                                src={asset.url}
                                alt={asset.filename}
                                fill
                                sizes="120px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-ink truncate w-full" title={asset.originalName || asset.filename}>
                            {asset.originalName || asset.filename}
                          </p>
                          <span className="text-[9px] font-mono text-ink-muted mt-0.5 uppercase">
                            {formatBytes(asset.size)}
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-editorial-border bg-canvas flex justify-end">
              <button
                type="button"
                onClick={() => setLibraryModalOpen(false)}
                className="px-4 py-2 text-xs font-sans font-semibold rounded-lg bg-white border border-editorial-border text-ink hover:bg-canvas-subtle transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
