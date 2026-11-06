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
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Digital Magazines Archive"
          subtitle="Publish, edit, and organize digital magazine editions and downloadable PDFs."
          action={
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-gold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Edition</span>
            </button>
          }
        />

        <div className="p-6 sm:p-8 max-w-7xl">
          {loading ? (
            <div className="text-center py-12 text-muted-light font-serif">Loading editions...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {magazines.map((mag) => (
                <div
                  key={mag.id}
                  className="bg-charcoal border border-gold/20 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-navy-950 overflow-hidden">
                    <img
                      src={mag.coverImage}
                      alt={mag.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy/90 text-gold border border-gold/40">
                        {mag.editionNumber}
                      </span>
                      {mag.isFeatured && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold text-navy font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                          mag.isPublished
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {mag.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-ivory mb-1">
                        {mag.title}
                      </h3>
                      <p className="text-xs text-muted-light line-clamp-2 font-sans mb-3">
                        {mag.description}
                      </p>
                      <div className="text-[11px] font-mono text-gold/80 space-y-0.5 mb-4">
                        <div>Editors: {mag.editor}</div>
                        <div>Date: {mag.publicationDate} • {mag.pageCount || 0} Pages</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                      <a
                        href={`/magazine/${mag.id}`}
                        target="_blank"
                        className="text-xs text-gold hover:underline flex items-center gap-1 font-serif"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read Online</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(mag)}
                          className="p-1.5 text-ivory/70 hover:text-gold hover:bg-navy rounded transition-colors"
                          title="Edit Magazine"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(mag.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded transition-colors"
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
          <div className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-charcoal border border-gold/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-gold/15 pb-4 mb-6">
                <h3 className="font-serif text-lg font-bold text-ivory">
                  {editingId ? 'Edit Magazine Edition' : 'Publish New Magazine Edition'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-ivory/60 hover:text-gold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Magazine Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Golden Epoch"
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Edition Number
                    </label>
                    <input
                      type="text"
                      required
                      value={editionNumber}
                      onChange={(e) => setEditionNumber(e.target.value)}
                      placeholder="Edition XII"
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Publication Date
                    </label>
                    <input
                      type="date"
                      required
                      value={publicationDate}
                      onChange={(e) => setPublicationDate(e.target.value)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Page Count
                    </label>
                    <input
                      type="number"
                      value={pageCount}
                      onChange={(e) => setPageCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      File Size
                    </label>
                    <input
                      type="text"
                      value={fileSize}
                      onChange={(e) => setFileSize(e.target.value)}
                      placeholder="14.2 MB"
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Author / Directorate
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                      Editor(s)
                    </label>
                    <input
                      type="text"
                      value={editor}
                      onChange={(e) => setEditor(e.target.value)}
                      className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-serif tracking-wider text-ivory/80 mb-1">
                    Editorial Summary / Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Upload Cover & PDF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-navy border border-gold/15">
                  <div>
                    <label className="block text-xs uppercase font-serif tracking-wider text-gold mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="https://... or upload below"
                      className="w-full px-3 py-2 bg-charcoal border border-gold/20 rounded-lg text-xs text-ivory mb-2"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-charcoal hover:bg-charcoal-soft border border-gold/30 rounded text-xs text-ivory/80 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-gold" />
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
                    <label className="block text-xs uppercase font-serif tracking-wider text-gold mb-1">
                      PDF Document URL
                    </label>
                    <input
                      type="text"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="/uploads/... or upload below"
                      className="w-full px-3 py-2 bg-charcoal border border-gold/20 rounded-lg text-xs text-ivory mb-2"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-charcoal hover:bg-charcoal-soft border border-gold/30 rounded text-xs text-ivory/80 cursor-pointer">
                      <FileText className="w-3.5 h-3.5 text-gold" />
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
                  <label className="flex items-center gap-2 text-xs font-serif cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-gold w-4 h-4"
                    />
                    <span>Set as Featured Edition</span>
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
                    className="px-4 py-2 bg-charcoal hover:bg-charcoal-soft text-xs text-ivory rounded-lg border border-gold/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold hover:bg-gold-light text-navy font-serif font-bold text-xs uppercase tracking-wider rounded-lg shadow-gold"
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
