import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Bell, Calendar, Flame, Sparkles, FileText, Video, Download } from 'lucide-react';

export const revalidate = 0;

export default function AnnouncementsPage() {
  const announcements = db.getAnnouncements(true);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-canvas text-ink">
      {/* Masthead */}
      <div className="border-b border-editorial-border pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
          <Bell className="w-3.5 h-3.5 text-coral" />
          <span>Official Dispatch Desk</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest tracking-tight">
          Notices & Announcements
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed font-sans max-w-2xl mx-auto">
          The verified communication board for Alif Friends 12. Check here for official press releases, event timetables, literary deadlines, and assembly directives.
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`rounded-2xl p-6 sm:p-8 border shadow-card transition-all ${
              ann.priority === 'high'
                ? 'bg-white border-coral/50 ring-1 ring-coral/20'
                : 'bg-white border-editorial-border hover:border-forest/40'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded border font-bold ${
                    ann.priority === 'high'
                      ? 'bg-coral-50 text-coral border-coral/30'
                      : 'bg-forest-50 text-forest border-forest-100'
                  }`}
                >
                  {ann.category}
                </span>

                {ann.priority === 'high' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coral text-white font-bold flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    High Priority
                  </span>
                )}

                {ann.isFeatured && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forest text-white font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-ink-muted">
                <Calendar className="w-3.5 h-3.5 text-forest" />
                <span>Published: {ann.date}</span>
              </div>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest mb-3 leading-snug">
              {ann.title}
            </h2>

            <p className="text-sm text-ink-light leading-relaxed font-sans whitespace-pre-line">
              {ann.content}
            </p>

            {/* Banner or Photos */}
            {ann.coverImage && (
              <div className="mt-4 rounded-xl overflow-hidden border border-editorial-border max-h-72">
                <img src={ann.coverImage} alt={ann.title} className="w-full h-full object-cover" />
              </div>
            )}

            {ann.photos && ann.photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ann.photos.map((ph, pIdx) => (
                  <div key={pIdx} className="aspect-video rounded-lg overflow-hidden border border-editorial-border">
                    <img src={ph} alt={`Notice Attachment ${pIdx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Video Attachment */}
            {ann.videoUrl && (
              <div className="mt-4 rounded-xl overflow-hidden bg-black border border-editorial-border aspect-video max-h-80">
                <video src={ann.videoUrl} controls className="w-full h-full object-contain" />
              </div>
            )}

            {/* PDF Circular Download */}
            {ann.pdfUrl && (
              <div className="mt-4 p-4 rounded-xl bg-canvas border border-editorial-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="font-serif font-bold text-xs text-forest">
                      {ann.pdfTitle || 'Official Circular Document.pdf'}
                    </p>
                    <p className="font-mono text-[10px] text-ink-muted">PDF Bulletin Attachment</p>
                  </div>
                </div>
                <a
                  href={ann.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-forest hover:bg-forest-light text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-editorial-border flex items-center justify-between text-[11px] font-mono text-ink-muted">
              <span>Alif Friends 12 Secretariat</span>
              <span className="text-coral font-bold">Official Dispatch</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
