import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { BookOpen, Download, Eye, Calendar, Sparkles } from 'lucide-react';
import {
  Container,
  SectionHeader,
  Button,
  Badge,
  Card,
  EmptyState,
} from '@/components/ui';

export const revalidate = 0;

export default async function MagazineArchivePage() {
  const magazines = await db.getMagazines(true);

  return (
    <div className="py-16 sm:py-20 bg-canvas text-ink">
      <Container>
        {/* Header */}
        <SectionHeader
          centered={true}
          eyebrow="Archival Publication Library"
          eyebrowColor="coral"
          title="Digital Magazine Archive"
          subtitle="Immerse yourself in our premier annual printed-magazine-inspired publications. Browse comprehensive retrospective memoirs, essays, photographic spreads, and realistic interactive flipbooks."
        />

        {magazines.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-6 h-6" />}
            title="No Magazine Editions Published Yet"
            description="The editorial committee is curating the next volume. Check back shortly for our upcoming release."
            actionHref="/"
            actionLabel="Return to Frontpage"
          />
        ) : (
          /* Grid of Magazines: 3:4 print-style covers */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {magazines.map((mag) => (
              <Card
                key={mag.id}
                className="p-0 flex flex-col justify-between group"
                hoverEffect={true}
              >
                {/* 3:4 Print-Style Cover Presentation */}
                <div className="p-4 sm:p-5 bg-canvas-warm border-b border-editorial-border">
                  <Link
                    href={`/magazine/${mag.id}`}
                    className="magazine-cover-3-4 block relative rounded-lg overflow-hidden bg-forest-950 border border-editorial-border group"
                  >
                    <img
                      src={mag.coverImage}
                      alt={mag.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="forest">{mag.editionNumber}</Badge>
                      {mag.isFeatured && (
                        <Badge variant="urgent" icon={<Sparkles className="w-3 h-3" />}>
                          Featured
                        </Badge>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-coral mb-2 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{mag.publicationDate} • {mag.pageCount || 0} Pages</span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest group-hover:text-coral transition-colors mb-2 leading-tight">
                      <Link href={`/magazine/${mag.id}`}>{mag.title}</Link>
                    </h2>

                    <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed mb-4 font-sans">
                      {mag.description}
                    </p>

                    <div className="text-[11px] font-mono text-ink-muted space-y-1 border-t border-editorial-border pt-3">
                      <div>Director: <span className="text-forest font-semibold">{mag.author}</span></div>
                      <div>Editor: <span className="text-forest font-semibold">{mag.editor}</span></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 border-t border-editorial-border mt-5 flex items-center justify-between gap-3">
                    <Button
                      href={`/magazine/${mag.id}`}
                      variant="forest"
                      size="sm"
                      className="flex-1"
                      icon={<Eye className="w-3.5 h-3.5 text-coral-light" />}
                      iconPosition="left"
                    >
                      Read Flipbook
                    </Button>

                    <a
                      href={`/api/magazines/${mag.id}/download`}
                      download={`${mag.title}.pdf`}
                      className="p-2.5 bg-white hover:bg-canvas-warm text-forest border border-editorial-border hover:border-forest rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                      title="Download PDF"
                      aria-label={`Download ${mag.title} PDF`}
                    >
                      <Download className="w-4 h-4 text-coral" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
