import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Flame,
  Video,
  FileText,
  Download,
} from 'lucide-react';
import {
  Container,
  Card,
  Badge,
  Button,
} from '@/components/ui';

export const revalidate = 0;

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await db.getArticleBySlugOrId(slug);

  if (!article || !article.isPublished) {
    notFound();
  }

  // Increment view
  await db.incrementArticleView(article.id);

  // Related articles
  const allArticles = await db.getArticles(true);
  const related = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || true))
    .slice(0, 3);

  return (
    <article className="py-12 sm:py-16 space-y-10 bg-canvas text-ink">
      <Container size="narrow">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/newspaper"
            className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-tag text-forest hover:text-coral transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-coral" />
            <span>Back to Newsroom</span>
          </Link>
        </div>

        {/* Header Deck */}
        <div className="space-y-4 border-b border-editorial-border pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="forest">{article.category}</Badge>
            {article.breakingStatus && (
              <Badge variant="urgent" icon={<Flame className="w-3.5 h-3.5" />}>
                Breaking Dispatch
              </Badge>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-forest tracking-tight leading-[1.05]">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="font-cormorant italic text-xl sm:text-2xl text-ink-light leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Byline & Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-editorial-border text-xs text-ink-muted font-mono">
            <div className="flex items-center gap-3">
              <span className="text-forest font-bold">{article.author}</span>
              {article.authorRole && (
                <>
                  <span>•</span>
                  <span className="text-coral font-semibold">{article.authorRole}</span>
                </>
              )}
              <span>•</span>
              <span>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-forest font-semibold">
              <Eye className="w-3.5 h-3.5 text-coral" />
              <span>{(article.viewCount || 0) + 1} Reads</span>
            </div>
          </div>
        </div>

        {/* Lead Cover Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-card border border-editorial-border bg-white my-8">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content with Editorial Drop Cap (~68ch max-width) */}
        <Card className="p-6 sm:p-12 shadow-card my-8">
          <div
            className="editorial-dropcap prose-editorial max-w-prose mx-auto text-ink font-sans leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Gallery inside article */}
          {article.galleryImages && article.galleryImages.length > 0 && (
            <div className="mt-12 pt-8 border-t border-editorial-border space-y-4 max-w-prose mx-auto">
              <h4 className="font-serif text-sm uppercase tracking-tag text-forest font-bold">
                Dispatch Photographic Gallery
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {article.galleryImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-editorial-border shadow-subtle">
                    <img src={img} alt="Story photograph" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Attachment */}
          {article.videoUrl && (
            <div className="mt-8 pt-8 border-t border-editorial-border space-y-3 max-w-prose mx-auto">
              <h4 className="font-serif text-sm uppercase tracking-tag text-forest font-bold flex items-center gap-2">
                <Video className="w-4 h-4 text-coral" />
                <span>Video & Broadcast Attachment</span>
              </h4>
              <div className="aspect-video rounded-xl overflow-hidden bg-forest-950 border border-forest-800">
                {article.videoUrl.includes('youtube') || article.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={article.videoUrl.replace('watch?v=', 'embed/')}
                    title="Article Video"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                ) : (
                  <video src={article.videoUrl} controls className="w-full h-full object-contain" />
                )}
              </div>
            </div>
          )}

          {/* PDF Document Attachment */}
          {article.pdfUrl && (
            <div className="mt-8 pt-8 border-t border-editorial-border space-y-3 max-w-prose mx-auto">
              <h4 className="font-serif text-sm uppercase tracking-tag text-forest font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-coral" />
                <span>Official Circular & Documentation</span>
              </h4>
              <div className="p-4 rounded-xl bg-canvas-warm border border-editorial-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-coral flex-shrink-0" />
                  <div>
                    <p className="font-serif font-bold text-sm text-forest">
                      {article.pdfTitle || 'Official Document Dispatch.pdf'}
                    </p>
                    <p className="font-mono text-[10px] text-ink-muted">PDF Document Attachment</p>
                  </div>
                </div>
                <a
                  href={article.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-forest text-white rounded-xl text-xs font-serif font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-forest-800 transition-colors flex-shrink-0 shadow-subtle"
                >
                  <Download className="w-3.5 h-3.5 text-coral-light" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          )}

          {/* Tags */}
          {article.relatedTags && article.relatedTags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-editorial-border flex flex-wrap items-center gap-2 text-xs max-w-prose mx-auto">
              <span className="text-forest font-mono uppercase font-bold text-[11px] tracking-tag">Filed under:</span>
              {article.relatedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-canvas-warm text-forest border border-editorial-border font-mono text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Related Stories */}
        {related.length > 0 && (
          <div className="pt-10 border-t border-editorial-border space-y-6">
            <h3 className="font-serif text-2xl font-bold text-forest">
              Related Dispatches & News
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Card
                  key={rel.id}
                  className="p-4 block group transition-all"
                  hoverEffect={true}
                >
                  <Link href={`/newspaper/${rel.slug}`}>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-editorial-border mb-3 bg-canvas">
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]"
                      />
                    </div>
                    <Badge variant="coral" size="sm" className="mb-1">
                      {rel.category}
                    </Badge>
                    <h4 className="font-serif text-sm font-bold text-forest group-hover:text-coral transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </article>
  );
}
