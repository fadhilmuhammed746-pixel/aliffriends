'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Magazine } from '@/lib/types';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function AdminMagazinesPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [editionNumber, setEditionNumber] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [author, setAuthor] = useState('Editorial Board');
  const [editor, setEditor] = useState('AF12 Editors');
  const [pageCount, setPageCount] = useState(64);
  const [fileSize, setFileSize] = useState('12.5 MB');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Uploading state
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const fetchMagazines = async () => {
    try {
      const res = await fetch('/api/magazines?all=true');
      const data = await res.json();
      if (data.magazines) setMagazines(data.magazines);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  const resetForm = () => {
    setTitle('');
    setEditionNumber('');
    setPublicationDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setCoverImage('');
    setPdfUrl('');
    setAuthor('Editorial Board');
    setEditor('AF12 Editors');
    setPageCount(64);
    setFileSize('12.5 MB');
    setIsFeatured(false);
    setIsPublished(true);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (mag: Magazine) => {
    setEditingId(mag.id);
    setTitle(mag.title);
    setEditionNumber(mag.editionNumber);
    setPublicationDate(mag.publicationDate);
    setDescription(mag.description);
    setCoverImage(mag.coverImage);
    setPdfUrl(mag.pdfUrl);
    setAuthor(mag.author);
    setEditor(mag.editor);
    setPageCount(mag.pageCount || 64);
    setFileSize(mag.fileSize || '12.5 MB');
    setIsFeatured(mag.isFeatured);
    setIsPublished(mag.isPublished);
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = type === 'pdf';
    if (isPdf) setUploadingPdf(true);
    else setUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', isPdf ? 'pdf' : 'image');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (isPdf) {
          setPdfUrl(data.url);
          setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
          if (data.pageCount) {
            setPageCount(data.pageCount);
          }
        } else {
          setCoverImage(data.url);
        }
      }
    } catch (err) {
      alert('Upload failed: ' + err);
    } finally {
      if (isPdf) setUploadingPdf(false);
      else setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      editionNumber,
      publicationDate,
      description,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      pdfUrl: pdfUrl || '/uploads/sample-magazine-af12.pdf',
      author,
      editor,
      pageCount: Number(pageCount),
      fileSize,
      isFeatured,
      isPublished,
    };

    try {
      if (editingId) {
        await fetch(`/api/magazines/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/magazines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      fetchMagazines();
    } catch (err) {
      alert('Failed to save magazine: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this magazine edition?')) return;
    try {
      await fetch(`/api/magazines/${id}`, { method: 'DELETE' });
      fetchMagazines();
    } catch (err) {
      alert('Delete failed: ' + err);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink">
        <AdminHeader
          title="Digital Magazines Archive"
          subtitle="Publish, edit, and organize digital magazine editions and downloadable PDFs."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all hover:shadow-forest/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Edition</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16 text-muted font-serif italic text-sm">
              Loading magazine editions...
            </div>
          ) : magazines.length === 0 ? (
            <div className="text-center py-16 bg-white border border-editorial-border rounded-xl p-8">
              <BookOpen className="w-10 h-10 text-muted mx-auto mb-3" />
              <p className="font-serif text-lg text-ink font-semibold">No magazine editions published yet</p>
              <p className="text-xs text-muted mt-1 mb-4">Click "Add New Edition" to publish the inaugural publication.</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-forest text-white text-xs uppercase font-sans font-semibold tracking-wider rounded-lg"
              >
                Create Edition
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {magazines.map((mag) => (
                <div
                  key={mag.id}
                  className="bg-white border border-editorial-border rounded-xl overflow-hidden shadow-editorial hover:shadow-editorial-lg transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[3/4] bg-canvas-subtle overflow-hidden border-b border-editorial-border">
                    <img
                      src={mag.coverImage}
                      alt={mag.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-forest/90 backdrop-blur text-canvas border border-forest-light/40 font-semibold shadow-sm">
                        {mag.editionNumber}
                      </span>
                      {mag.isFeatured && (
                        <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-coral text-white font-bold shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded border font-semibold ${
                          mag.isPublished
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-stone-100 text-stone-600 border-stone-300'
                        }`}
                      >
                        {mag.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-ink mb-1 group-hover:text-forest transition-colors">
                        {mag.title}
                      </h3>
                      <p className="text-xs text-muted line-clamp-2 font-sans mb-3 leading-relaxed">
                        {mag.description}
                      </p>
                      <div className="text-[11px] font-mono text-muted space-y-0.5 mb-4 bg-canvas/70 p-2.5 rounded-lg border border-editorial-border">
                        <div className="truncate"><span className="text-ink font-semibold">Editors:</span> {mag.editor}</div>
                        <div><span className="text-ink font-semibold">Date:</span> {mag.publicationDate} • {mag.pageCount || 0} Pages</div>
                        <div><span className="text-ink font-semibold">Size:</span> {mag.fileSize || '12.5 MB'}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-editorial-border flex items-center justify-between">
                      <a
                        href={`/magazine/${mag.id}`}
                        target="_blank"
                        className="text-xs text-forest hover:text-coral flex items-center gap-1.5 font-sans font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read Online</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(mag)}
                          className="p-1.5 text-muted hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                          title="Edit Magazine"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(mag.id)}
                          className="p-1.5 text-muted hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                          title="Delete Magazine"
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

        {/* Modal Editor */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-forest/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-editorial-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-ink">
              <div className="flex items-center justify-between border-b border-editorial-border pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest">
                    {editingId ? 'Edit Magazine Edition' : 'Publish New Magazine Edition'}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">Manage edition specifications, cover artwork, and PDF files.</p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Magazine Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Golden Epoch"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Edition Number
                    </label>
                    <input
                      type="text"
                      required
                      value={editionNumber}
                      onChange={(e) => setEditionNumber(e.target.value)}
                      placeholder="Edition XII"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Publication Date
                    </label>
                    <input
                      type="date"
                      required
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Page Count
                    </label>
                    <input
                      type="number"
                      value={pageCount}
                      onChange={(e) => setPageCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      File Size
                    </label>
                    <input
                      type="text"
                      value={fileSize}
                      onChange={(e) => setFileSize(e.target.value)}
                      placeholder="14.2 MB"
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Author / Directorate
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Editor(s)
                    </label>
                    <input
                      type="text"
                      value={editor}
                      onChange={(e) => setEditor(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Editorial Summary / Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest"
                    placeholder="Briefly describe the themes, highlights, and content within this edition..."
                  />
                </div>

                {/* Upload Cover & PDF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-canvas border border-editorial-border">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-forest mb-1">
                      Cover Artwork URL
                    </label>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://... or upload below"
                      className="w-full px-3 py-2 bg-white border border-editorial-border rounded-lg text-xs text-ink mb-2 focus:outline-none focus:border-forest"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-forest/5 border border-editorial-border hover:border-forest/40 rounded-lg text-xs text-ink cursor-pointer transition-colors shadow-sm font-sans font-medium">
                      <Upload className="w-3.5 h-3.5 text-forest" />
                      <span>{uploadingCover ? 'Uploading...' : 'Upload Cover File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'cover')}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-forest mb-1">
                      PDF Document URL
                    </label>
                    <input
                      type="text"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="/uploads/... or upload below"
                      className="w-full px-3 py-2 bg-white border border-editorial-border rounded-lg text-xs text-ink mb-2 focus:outline-none focus:border-forest"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-forest/5 border border-editorial-border hover:border-forest/40 rounded-lg text-xs text-ink cursor-pointer transition-colors shadow-sm font-sans font-medium">
                      <FileText className="w-3.5 h-3.5 text-forest" />
                      <span>{uploadingPdf ? 'Uploading PDF...' : 'Upload PDF Document'}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'pdf')}
                      />
                    </label>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-sans font-medium text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-coral w-4 h-4 rounded"
                    />
                    <span>Set as Featured Edition</span>
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
                    Save Magazine
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
