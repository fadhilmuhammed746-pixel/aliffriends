import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { FlipbookReader } from '@/components/magazine/FlipbookReader';
import { ArrowLeft, BookOpen, Download, Sparkles } from 'lucide-react';
import { Container, Badge, Card } from '@/components/ui';

export const revalidate = 0;

export default async function MagazineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const magazine = await db.getMagazineById(id);

  if (!magazine || !magazine.isPublished) {
    notFound();
  }

  return (
    <div className="py-10 sm:py-14 space-y-10 bg-canvas text-ink">
      <Container>
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/magazine"
            className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-tag text-forest hover:text-coral transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-coral" />
            <span>Back to Magazine Archive</span>
          </Link>
        </div>

        {/* Magazine Overview Header */}
        <Card className="p-6 sm:p-10 mb-10 flex flex-col md:flex-row gap-8 items-start shadow-editorial">
          <div className="magazine-cover-3-4 relative flex-shrink-0 w-40 sm:w-52 rounded-xl overflow-hidden border border-editorial-border bg-forest-950">
            <img
              src={magazine.coverImage}
              alt={magazine.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5">
              <Badge variant="forest">{magazine.editionNumber}</Badge>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="forest">{magazine.editionNumber}</Badge>
              <span className="text-xs font-mono text-ink-muted">
                Published: {magazine.publicationDate}
              </span>
              {magazine.isFeatured && (
                <Badge variant="urgent" icon={<Sparkles className="w-3 h-3" />}>
                  Featured Edition
                </Badge>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-black text-forest tracking-tight leading-tight">
              {magazine.title}
            </h1>

            <p className="text-sm sm:text-base text-ink-light leading-relaxed font-sans max-w-3xl">
              {magazine.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-editorial-border text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-tag text-ink-muted block">
                  Directorate
                </span>
                <span className="font-sans font-bold text-forest">{magazine.author}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-tag text-ink-muted block">
                  Editor(s)
                </span>
                <span className="font-sans font-bold text-forest">{magazine.editor}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-tag text-ink-muted block">
                  Document Extent
                </span>
                <span className="font-mono text-coral font-bold">{magazine.pageCount || 8} Pages</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-tag text-ink-muted block">
                  Archive File Size
                </span>
                <span className="font-mono text-coral font-bold">{magazine.fileSize || '14.2 MB'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Interactive Flipbook Reading Suite */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-editorial-border">
            <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-coral" />
              <span>Interactive Digital Flipbook Suite</span>
            </h2>
            <span className="text-xs text-ink-muted hidden sm:inline font-sans">
              Double-page spread with corner mouse dragging & mobile touch support
            </span>
          </div>

          <FlipbookReader
            pdfUrl={magazine.pdfUrl}
            title={magazine.title}
            coverImage={magazine.coverImage}
            editionNumber={magazine.editionNumber}
            author={magazine.author}
            editor={magazine.editor}
            pageCount={magazine.pageCount}
          />
        </div>
      </Container>
    </div>
  );
}
