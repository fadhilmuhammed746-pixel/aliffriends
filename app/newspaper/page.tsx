import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ArticleCategory } from '@/lib/types';
import {
  Newspaper,
  Flame,
  Search,
  ArrowRight,
  Eye,
} from 'lucide-react';
import {
  Container,
  SectionHeader,
  Button,
  Badge,
  Card,
  EmptyState,
} from '@/components/ui';

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
  let articles = await db.getArticles(true);

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
    <div className="py-12 sm:py-16 space-y-12 bg-canvas text-ink">
      <Container>
        {/* Editorial Broadsheet Masthead */}
        <div className="border-b-2 border-forest pb-6 text-center space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted border-b border-editorial-border pb-2">
            <span>AF12 PRESS & INTERNATIONAL DESK</span>
            <span suppressHydrationWarning className="hidden sm:inline">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span>EDITION NO. XII</span>
          </div>

          <h1 className="font-serif font-black text-4xl sm:text-7xl md:text-8xl text-forest tracking-tight uppercase leading-[0.95]">
            THE AF12 CHRONICLE
          </h1>

          <p className="font-cormorant italic text-coral text-base sm:text-xl max-w-xl mx-auto">
            &ldquo;Independent student journalism, cultural critique, and authentic class records.&rdquo;
          </p>
        </div>

        {/* Category Navigation Bar & Search */}
        <div className="border-y border-editorial-border py-3 my-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <Link
              href="/newspaper"
              className={`px-3.5 py-1.5 rounded-full uppercase tracking-tag font-serif text-[11px] font-bold transition-colors select-none ${
                !category ? 'bg-forest text-white' : 'text-ink-muted hover:text-forest hover:bg-forest-50'
              }`}
            >
              All Stories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/newspaper?category=${encodeURIComponent(cat)}`}
                className={`px-3.5 py-1.5 rounded-full uppercase tracking-tag font-serif text-[11px] font-semibold whitespace-nowrap transition-colors select-none ${
                  category?.toLowerCase() === cat.toLowerCase()
                    ? 'bg-forest text-white'
                    : 'text-ink-muted hover:text-forest hover:bg-forest-50'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Search Box */}
          <form method="GET" action="/newspaper" className="relative w-full md:w-64 flex-shrink-0">
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Search dispatches..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-editorial-border rounded-xl text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-forest transition-colors font-sans"
            />
            <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>
        </div>

        {articles.length === 0 ? (
          <EmptyState
            icon={<Newspaper className="w-6 h-6" />}
            title="No Dispatches Found"
            description="No articles matched your criteria. Try adjusting your category filter or search query."
            actionHref="/newspaper"
            actionLabel="Reset Newsroom Filters"
          />
        ) : (
          <div className="space-y-12">
            {/* Lead Story Feature */}
            {leadHeadline && (
              <Card
                className="p-0 overflow-hidden border border-editorial-border shadow-card hover:border-forest/40 transition-all group"
                hoverEffect={true}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <Link
                    href={`/newspaper/${leadHeadline.slug}`}
                    className="lg:col-span-7 block relative aspect-[16/10] overflow-hidden bg-canvas"
                  >
                    <img
                      src={leadHeadline.coverImage}
                      alt={leadHeadline.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge variant="forest">{leadHeadline.category}</Badge>
                      {leadHeadline.breakingStatus && (
                        <Badge variant="urgent" icon={<Flame className="w-3 h-3" />}>
                          Breaking
                        </Badge>
                      )}
                    </div>
                  </Link>

                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
                        <span>{new Date(leadHeadline.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>By {leadHeadline.author}</span>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-4xl font-black text-forest group-hover:text-coral transition-colors leading-tight">
                        <Link href={`/newspaper/${leadHeadline.slug}`}>
                          {leadHeadline.title}
                        </Link>
                      </h2>

                      {leadHeadline.subtitle && (
                        <p className="font-cormorant italic text-base sm:text-lg text-ink-light leading-relaxed">
                          {leadHeadline.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 border-t border-editorial-border mt-6 flex items-center justify-between">
                      <span className="text-xs font-mono text-ink-muted">
                        {leadHeadline.viewCount || 0} Reads
                      </span>
                      <Button
                        href={`/newspaper/${leadHeadline.slug}`}
                        variant="coral"
                        size="sm"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Read Lead Story
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Other Stories Grid: 12-column editorial layout */}
            {otherStories.length > 0 && (
              <div>
                <h3 className="text-xs uppercase font-serif tracking-tag text-forest font-bold border-b border-editorial-border pb-3 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-coral" />
                  <span>Further Dispatches & Reports</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherStories.map((story) => (
                    <Card
                      key={story.id}
                      className="p-0 flex flex-col justify-between group"
                      hoverEffect={true}
                    >
                      <Link
                        href={`/newspaper/${story.slug}`}
                        className="block relative aspect-[16/10] overflow-hidden bg-canvas"
                      >
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.03]"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="forest" size="sm">{story.category}</Badge>
                        </div>
                      </Link>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-ink-muted mb-2">
                            <span>{new Date(story.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>3 min read</span>
                          </div>

                          <h4 className="font-serif text-lg sm:text-xl font-bold text-forest group-hover:text-coral transition-colors mb-2 leading-snug line-clamp-2">
                            <Link href={`/newspaper/${story.slug}`}>{story.title}</Link>
                          </h4>

                          {story.subtitle && (
                            <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed font-sans mb-4">
                              {story.subtitle}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 border-t border-editorial-border flex items-center justify-between text-xs">
                          <span className="text-[11px] font-mono text-ink-muted">
                            {story.author}
                          </span>
                          <Link
                            href={`/newspaper/${story.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-serif font-bold text-forest hover:text-coral uppercase tracking-tag"
                          >
                            <span>Read</span>
                            <ArrowRight className="w-3 h-3 text-coral" />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
