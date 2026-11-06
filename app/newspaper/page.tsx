import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ArticleCategory } from '@/lib/types';
import {
  Newspaper,
  Flame,
  Search,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  Tag,
  Star,
} from 'lucide-react';

const categories: ArticleCategory[] = [
  'Class News',
  'Events',
  'Achievements',
  'Education',
  'Editorial',
  'Special Reports',
  'Announcements',
];

export const revalidate = 0;

export default async function NewspaperIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  let articles = db.getArticles(true);

  if (category) {
    articles = articles.filter(
      (a) => a.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (q) {
    const query = q.toLowerCase();
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.subtitle?.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query)
    );
  }

  const leadHeadline = articles.find((a) => a.headlineStatus) || articles[0];
  const otherStories = articles.filter((a) => a.id !== leadHeadline?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Masthead */}
      <div className="border-b-2 border-gold/30 pb-6 text-center space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-light border-b border-gold/15 pb-2">
          <span>ALIF FRIENDS 12 PRESS & DISPATCHES</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>VOLUME XII • ISSUE NO. 1</span>
        </div>

        <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl text-ivory tracking-widest uppercase">
          THE AF12 CHRONICLE
        </h1>

        <p className="font-serif italic text-gold text-sm sm:text-base max-w-xl mx-auto">
          &ldquo;Independent student journalism, cultural critique, and authentic class records.&rdquo;
        </p>
      </div>

      {/* Category Navigation Bar */}
      <div className="border-y border-gold/20 py-2.5 flex items-center justify-between gap-4 overflow-x-auto text-xs">
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Link
            href="/newspaper"
            className={`px-3 py-1.5 rounded-lg uppercase tracking-wider font-serif font-bold transition-colors ${
              !category ? 'bg-gold text-navy' : 'text-ivory/80 hover:text-gold'
            }`}
          >
            All Stories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/newspaper?category=${encodeURIComponent(cat)}`}
              className={`px-3 py-1.5 rounded-lg uppercase tracking-wider font-serif font-medium whitespace-nowrap transition-colors ${
                category?.toLowerCase() === cat.toLowerCase()
                  ? 'bg-gold text-navy font-bold'
                  : 'text-ivory/70 hover:text-ivory hover:bg-charcoal'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form method="GET" action="/newspaper" className="relative flex-shrink-0">
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Search stories..."
            className="pl-8 pr-3 py-1 bg-charcoal border border-gold/20 rounded-lg text-xs text-ivory placeholder-muted focus:outline-none focus:border-gold w-36 sm:w-48"
          />
          <Search className="w-3.5 h-3.5 text-gold/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Lead Headline Story (if not filtered or found) */}
      {leadHeadline && (
        <div className="bg-charcoal border border-gold/25 rounded-2xl overflow-hidden shadow-2xl group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <Link
              href={`/newspaper/${leadHeadline.slug}`}
              className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden block"
            >
              <img
                src={leadHeadline.coverImage}
                alt={leadHeadline.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-[10px] uppercase font-mono px-3 py-1 rounded bg-navy/90 text-gold border border-gold/40">
                  {leadHeadline.category}
                </span>
                {leadHeadline.breakingStatus && (
                  <span className="text-[10px] uppercase font-mono px-3 py-1 rounded bg-red-950 text-red-300 border border-red-500/40 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-400" />
                    Breaking
                  </span>
                )}
              </div>
            </Link>

            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-muted-light block mb-2">
                  {new Date(leadHeadline.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  • By {leadHeadline.author}
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory group-hover:text-gold transition-colors leading-tight mb-4">
                  <Link href={`/newspaper/${leadHeadline.slug}`}>{leadHeadline.title}</Link>
                </h2>

                {leadHeadline.subtitle && (
                  <p className="text-sm text-ivory/80 font-sans leading-relaxed mb-6">
                    {leadHeadline.subtitle}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gold/15 flex items-center justify-between">
                <span className="text-[11px] font-mono text-gold/80">
                  {leadHeadline.viewCount || 0} Reader Views
                </span>
                <Link
                  href={`/newspaper/${leadHeadline.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-gold uppercase tracking-wider hover:text-gold-light"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Stories */}
      <div>
        <h3 className="font-serif text-lg font-bold text-ivory mb-6 border-b border-gold/15 pb-2">
          {category ? `${category} Articles` : 'Recent Reports & Dispatches'}
        </h3>

        {otherStories.length === 0 && !leadHeadline ? (
          <div className="text-center py-16 bg-charcoal rounded-2xl border border-gold/15">
            <Newspaper className="w-10 h-10 text-gold/40 mx-auto mb-3" />
            <p className="font-serif text-lg text-ivory">No articles match your search criteria.</p>
            <Link href="/newspaper" className="text-xs text-gold underline mt-2 inline-block">
              Clear filters and view all stories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherStories.map((art) => (
              <div
                key={art.id}
                className="bg-charcoal border border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <Link href={`/newspaper/${art.slug}`} className="block relative aspect-video overflow-hidden">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy/90 text-gold border border-gold/30">
                    {art.category}
                  </span>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-muted-light block mb-1">
                      {new Date(art.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      • By {art.author}
                    </span>

                    <h4 className="font-serif text-base sm:text-lg font-bold text-ivory group-hover:text-gold transition-colors mb-2 line-clamp-2 leading-snug">
                      <Link href={`/newspaper/${art.slug}`}>{art.title}</Link>
                    </h4>

                    {art.subtitle && (
                      <p className="text-xs text-muted-light line-clamp-2 leading-relaxed">
                        {art.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gold/15 mt-4 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-gold/70">{art.viewCount || 0} reads</span>
                    <Link
                      href={`/newspaper/${art.slug}`}
                      className="font-serif font-bold text-gold hover:text-gold-light flex items-center gap-1 uppercase tracking-wider"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
