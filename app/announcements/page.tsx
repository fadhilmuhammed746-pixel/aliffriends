import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Bell, Calendar, Flame, Sparkles, FileText, Download } from 'lucide-react';
import {
  Container,
  SectionHeader,
  Badge,
  Card,
  EmptyState,
} from '@/components/ui';

export const revalidate = 0;

export default async function AnnouncementsPage() {
  const announcements = await db.getAnnouncements(true);

  return (
    <div className="py-16 sm:py-20 space-y-12 bg-canvas text-ink">
      <Container size="narrow">
        {/* Masthead */}
        <SectionHeader
          centered={true}
          eyebrow="Official Dispatch Desk"
          eyebrowColor="coral"
          title="Notices & Announcements"
          subtitle="The verified communication board for Alif Friends 12. Check here for official press releases, event timetables, literary deadlines, and assembly directives."
        />

        {announcements.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-6 h-6" />}
            title="No Active Bulletins"
            description="There are currently no urgent announcements or dispatches from the secretariat."
            actionHref="/"
            actionLabel="Return to Frontpage"
          />
        ) : (
          /* Priority-Coded Announcements List */
          <div className="space-y-6">
            {announcements.map((ann) => {
              const isUrgent = ann.priority === 'high';
              const isGeneral = ann.priority === 'medium';

              // Priority-coded left border: coral = high/urgent, forest = medium/general, grey = low/info
              const priorityBorderClass = isUrgent
                ? 'border-l-4 border-l-coral'
                : isGeneral
                ? 'border-l-4 border-l-forest'
                : 'border-l-4 border-l-ink-subtle';

              return (
                <Card
                  key={ann.id}
                  className={`p-6 sm:p-8 space-y-4 shadow-card hover:border-forest/40 transition-colors ${priorityBorderClass}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={isUrgent ? 'coral' : 'forest'}>
                        {ann.category}
                      </Badge>

                      {isUrgent && (
                        <Badge variant="urgent" icon={<Flame className="w-3 h-3" />}>
                          High Priority
                        </Badge>
                      )}

                      {ann.isFeatured && (
                        <Badge variant="forest" icon={<Sparkles className="w-3 h-3" />}>
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono text-ink-muted">
                      <Calendar className="w-3.5 h-3.5 text-forest" />
                      <span>Published: {ann.date}</span>
                    </div>
                  </div>

                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest leading-snug">
                    {ann.title}
                  </h2>

                  <p className="text-sm text-ink-light leading-relaxed font-sans whitespace-pre-line">
                    {ann.content}
                  </p>

                  {/* Banner / Cover Image */}
                  {ann.coverImage && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-editorial-border max-h-72">
                      <img src={ann.coverImage} alt={ann.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Attached Photos */}
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
                    <div className="mt-4 rounded-xl overflow-hidden bg-forest-950 border border-forest-800 aspect-video max-h-80">
                      <video src={ann.videoUrl} controls className="w-full h-full object-contain" />
                    </div>
                  )}

                  {/* PDF Circular Download */}
                  {ann.pdfUrl && (
                    <div className="mt-4 p-4 rounded-xl bg-canvas-warm border border-editorial-border flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-coral flex-shrink-0" />
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
                        className="px-3.5 py-1.5 bg-forest hover:bg-forest-800 text-white rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-subtle flex-shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 text-coral-light" />
                        <span>Download PDF</span>
                      </a>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-editorial-border flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span>Alif Friends 12 Secretariat</span>
                    <span className="text-coral font-bold uppercase tracking-tag">Official Dispatch</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
