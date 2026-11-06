import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Share2,
  Clock,
  Tag,
  ArrowRight,
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
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/newspaper"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-gold hover:text-gold-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Newsroom</span>
        </Link>
      </div>

      {/* Header Deck */}
      <div className="space-y-4 border-b border-gold/20 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-gold/15 text-gold border border-gold/30">
            {article.category}
          </span>
          {article.breakingStatus && (
            <span className="text-xs uppercase font-mono px-3 py-1 rounded bg-red-950 text-red-300 border border-red-500/40 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              Breaking Dispatch
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory tracking-wide leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="font-serif italic text-lg sm:text-xl text-gold-light/90 leading-relaxed">
            {article.subtitle}
          </p>
        )}

        {/* Byline and metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gold/15 text-xs text-muted-light font-mono">
          <div className="flex items-center gap-3">
            <span className="text-ivory font-bold">{article.author}</span>
            {article.authorRole && (
              <>
                <span>•</span>
                <span className="text-gold/80">{article.authorRole}</span>
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

          <div className="flex items-center gap-2 text-gold">
            <Eye className="w-3.5 h-3.5" />
            <span>{(article.viewCount || 0) + 1} Reads</span>
          </div>
        </div>
      </div>

      {/* Lead Cover Image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-gold/20">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="bg-charcoal border border-gold/20 rounded-2xl p-6 sm:p-12 shadow-xl">
        <div
          className="prose prose-invert max-w-none text-ivory/90 font-sans text-base leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Gallery inside article (if any) */}
        {article.galleryImages && article.galleryImages.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gold/15 space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-gold font-bold">
              Dispatch Photographic Gallery
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.galleryImages.map((img, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gold/20">
                  <img src={img} alt="Story photo" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {article.relatedTags && article.relatedTags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gold/15 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gold font-mono uppercase">Filed under:</span>
            {article.relatedTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded bg-navy text-ivory/80 border border-gold/20 font-mono text-[11px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Stories */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-gold/20 space-y-6">
          <h3 className="font-serif text-xl font-bold text-ivory">
            Related Dispatches & News
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/newspaper/${rel.slug}`}
                className="bg-charcoal border border-gold/15 hover:border-gold/40 rounded-xl overflow-hidden p-4 block group transition-all"
              >
                <img
                  src={rel.coverImage}
                  alt={rel.title}
                  className="w-full aspect-video object-cover rounded-lg border border-gold/20 mb-3"
                />
                <span className="text-[10px] uppercase font-mono text-gold block mb-1">
                  {rel.category}
                </span>
                <h4 className="font-serif text-sm font-bold text-ivory group-hover:text-gold transition-colors line-clamp-2">
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
