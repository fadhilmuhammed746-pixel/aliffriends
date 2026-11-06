'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<MediaAssetSummary[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Accept attribute string
  const acceptAttr =
    type === 'image'
      ? 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif'
      : type === 'video'
      ? 'video/mp4,video/webm,video/quicktime,video/x-matroska'
      : type === 'pdf'
      ? 'application/pdf,.pdf'
      : 'image/*,video/*,application/pdf';

  const defaultLimit = type === 'image' ? 15 : 100;
  const effectiveLimitMB = maxSizeMB || defaultLimit;

  // Format bytes
  const formatBytes = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Upload a single file
  const uploadFile = async (file: File): Promise<string | null> => {
    // Client-side size check
    if (file.size > effectiveLimitMB * 1024 * 1024) {
      throw new Error(`File '${file.name}' exceeds the maximum limit of ${effectiveLimitMB} MB.`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', section);

    abortControllerRef.current = new AbortController();

    // Use XMLHttpRequest for live progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.success && data.url) {
              resolve(data.url);
            } else {
              reject(new Error(data.error || 'Upload failed.'));
            }
          } catch {
            reject(new Error('Invalid response from server.'));
          }
        } else {
          try {
            const data = JSON.parse(xhr.responseText);
            reject(new Error(data.error || `Upload failed with status ${xhr.status}.`));
          } catch {
            reject(new Error(`Server error (${xhr.status}).`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload.'));
      xhr.onabort = () => reject(new Error('Upload cancelled.'));

      xhr.send(formData);
    });
  };

  // Handle file selection (drag or browse)
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
          const url = await uploadFile(file);
          if (url) newUrls.push(url);
        }

        const combined = [...currentList, ...newUrls];
        onChange(combined);
        setSuccessMessage(`Successfully uploaded ${newUrls.length} file(s).`);
      } else {
        const file = files[0];
        const url = await uploadFile(file);
        if (url) {
          onChange(url);
          setSuccessMessage(`'${file.name}' uploaded successfully.`);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Upload processing failed.');
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setUploading(false);
    setProgress(0);
  };

  // Open Media Library Modal
  const openLibraryModal = async () => {
    setLibraryModalOpen(true);
    setLibraryLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.media) {
        // Filter by category if specific
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

  // Reorder for multiple
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!Array.isArray(value)) return;
    const newItems = [...value];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    onChange(newItems);
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
          {/* Visual element */}
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

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-mono font-medium text-ink truncate" title={url}>
                {url.split('/').pop() || url}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-canvas-subtle border border-editorial-border text-ink-muted">
                  {isPdf ? 'Document' : isVideo ? 'Video' : 'Image'}
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-forest hover:text-coral font-sans flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </a>
              </div>
            </div>
          </div>

          {/* Action buttons */}
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

        {/* Video Player Preview if direct video */}
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
          Max: {effectiveLimitMB}MB • {type.toUpperCase()}
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

      {/* Upload Dropzone (shown if no single value OR if multiple mode) */}
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
            <div className="py-3 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-forest">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-coral" />
                  Uploading file...
                </span>
                <span className="font-bold">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-canvas-subtle rounded-full overflow-hidden border border-editorial-border">
                <div
                  className="h-full bg-forest transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button
                type="button"
                onClick={cancelUpload}
                className="text-[11px] text-red-600 hover:underline"
              >
                Cancel Upload
              </button>
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
                  Supports {type === 'image' ? 'JPG, PNG, WEBP, SVG' : type === 'video' ? 'MP4, WEBM, MOV' : type === 'pdf' ? 'PDF Documents' : 'Media files'} up to {effectiveLimitMB}MB
                </p>
              </div>

              {/* Library Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={openLibraryModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas hover:bg-canvas-subtle text-forest border border-editorial-border text-[11px] font-sans font-semibold transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-coral" />
                  <span>Choose from Central Media Library</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Single Value Display */}
      {!multiple && singleValue && renderSinglePreview(singleValue)}

      {/* Multiple Values Display */}
      {multiple && multipleValues.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-ink-muted">
            <span>Attached Media ({multipleValues.length})</span>
            <span>Drag or use arrows to reorder</span>
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
                          alt={`Gallery item ${index + 1}`}
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
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveItem(index, 'up')}
                      className="p-1 text-ink-muted hover:text-forest disabled:opacity-20 rounded"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === multipleValues.length - 1}
                      onClick={() => moveItem(index, 'down')}
                      className="p-1 text-ink-muted hover:text-forest disabled:opacity-20 rounded"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(itemUrl)}
                      className="p-1 text-red-500 hover:text-red-700 rounded ml-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage('')} className="p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          <Check className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span className="flex-1">{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage('')} className="p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Central Media Library Selection Modal */}
      {libraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-canvas border border-editorial-border rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-editorial-border flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-forest text-white flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-coral-light" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-forest uppercase tracking-wider">
                    Select from Central Media Library
                  </h3>
                  <p className="text-[11px] text-ink-muted">
                    Choose an existing {type !== 'any' ? type : 'media'} asset without re-uploading
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLibraryModalOpen(false)}
                className="p-1.5 text-ink-muted hover:text-forest hover:bg-canvas rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-editorial-border bg-white/50 flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by file name or keyword..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-editorial-border rounded-lg text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>
              <span className="text-[11px] font-mono text-ink-muted">
                {libraryAssets.length} assets
              </span>
            </div>

            {/* Modal Content Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {libraryLoading ? (
                <div className="py-16 text-center text-ink-muted text-xs font-mono">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-coral" />
                  Loading library files...
                </div>
              ) : libraryAssets.length === 0 ? (
                <div className="py-16 text-center text-ink-muted text-xs">
                  <FolderOpen className="w-10 h-10 mx-auto mb-2 text-ink-muted/40" />
                  No matching media assets found in the library.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {libraryAssets
                    .filter(
                      (a) =>
                        !librarySearch ||
                        a.filename.toLowerCase().includes(librarySearch.toLowerCase()) ||
                        a.originalName?.toLowerCase().includes(librarySearch.toLowerCase())
                    )
                    .map((asset) => {
                      const isPdf = asset.category === 'pdf';
                      const isVid = asset.category === 'video';

                      return (
                        <div
                          key={asset.id}
                          onClick={() => handleSelectFromLibrary(asset.url)}
                          className="group border border-editorial-border hover:border-forest rounded-xl overflow-hidden bg-white p-2 flex flex-col justify-between cursor-pointer transition-all hover:shadow-card hover:-translate-y-0.5"
                        >
                          <div className="w-full h-24 relative rounded-lg overflow-hidden bg-canvas flex items-center justify-center">
                            {isPdf ? (
                              <div className="flex flex-col items-center justify-center text-red-500">
                                <FileText className="w-8 h-8" />
                                <span className="text-[9px] font-mono font-bold mt-1">PDF</span>
                              </div>
                            ) : isVid ? (
                              <div className="flex flex-col items-center justify-center text-coral">
                                <Video className="w-8 h-8" />
                                <span className="text-[9px] font-mono font-bold mt-1">VIDEO</span>
                              </div>
                            ) : (
                              <Image
                                src={asset.url}
                                alt={asset.originalName || asset.filename}
                                fill
                                sizes="140px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                          </div>

                          <div className="mt-2">
                            <p className="text-[11px] font-mono text-ink truncate font-medium" title={asset.originalName || asset.filename}>
                              {asset.originalName || asset.filename}
                            </p>
                            <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mt-1">
                              <span>{formatBytes(asset.size)}</span>
                              <span className="uppercase text-[9px] px-1 py-0.5 bg-canvas rounded">
                                {asset.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-editorial-border bg-white flex items-center justify-end">
              <button
                type="button"
                onClick={() => setLibraryModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-editorial-border text-xs font-sans text-ink hover:bg-canvas transition-colors"
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
