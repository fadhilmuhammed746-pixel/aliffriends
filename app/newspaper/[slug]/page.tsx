import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  ArrowLeft,
  Calendar,
  Eye,
  Flame,
} from 'lucide-react';

export const revalidate = 0;

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = db.getArticleBySlugOrId(slug);

  if (!article || !article.isPublished) {
    notFound();
  }

  // Increment view
  db.incrementArticleView(article.id);

  // Related articles
  const allArticles = db.getArticles(true);
  const related = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || true))
    .slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-canvas text-ink">
      {/* Back button */}
      <div>
        <Link
          href="/newspaper"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-forest hover:text-coral transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-coral" />
          <span>Back to Newsroom</span>
        </Link>
      </div>

      {/* Header Deck */}
      <div className="space-y-4 border-b border-editorial-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-forest-50 text-forest border border-forest-100 font-bold">
            {article.category}
          </span>
          {article.breakingStatus && (
            <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-coral text-white font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              Breaking Dispatch
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-forest tracking-tight leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="font-editorial italic text-lg sm:text-2xl text-ink-light leading-relaxed">
            {article.subtitle}
          </p>
        )}

        {/* Byline and metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-editorial-border text-xs text-ink-muted font-mono">
          <div className="flex items-center gap-3">
            <span className="text-forest font-bold">{article.author}</span>
            {article.authorRole && (
              <>
                <span>•</span>
                <span className="text-coral font-medium">{article.authorRole}</span>
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
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-card border border-editorial-border bg-white">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content with Editorial Drop Cap */}
      <div className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-12 shadow-card">
        <div
          className="editorial-dropcap prose-editorial max-w-none text-ink-light font-sans text-base sm:text-lg leading-relaxed space-y-5"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Gallery inside article */}
        {article.galleryImages && article.galleryImages.length > 0 && (
          <div className="mt-12 pt-8 border-t border-editorial-border space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-forest font-bold">
              Dispatch Photographic Gallery
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.galleryImages.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-editorial-border shadow-subtle">
                  <img src={img} alt="Story photo" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {article.relatedTags && article.relatedTags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-editorial-border flex flex-wrap items-center gap-2 text-xs">
            <span className="text-forest font-mono uppercase font-semibold">Filed under:</span>
            {article.relatedTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded bg-canvas text-forest border border-editorial-border font-mono text-[11px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Stories */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-editorial-border space-y-6">
          <h3 className="font-serif text-2xl font-bold text-forest">
            Related Dispatches & News
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/newspaper/${rel.slug}`}
                className="bg-white border border-editorial-border hover:border-forest/40 rounded-xl overflow-hidden p-4 block group transition-all shadow-subtle"
              >
                <img
                  src={rel.coverImage}
                  alt={rel.title}
                  className="w-full aspect-video object-cover rounded-lg border border-editorial-border mb-3"
                />
                <span className="text-[10px] uppercase font-mono text-coral font-bold block mb-1">
                  {rel.category}
                </span>
                <h4 className="font-serif text-sm font-bold text-forest group-hover:text-coral transition-colors line-clamp-2">
                  {rel.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
