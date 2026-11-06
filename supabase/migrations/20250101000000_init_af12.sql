-- ALIF FRIENDS 12: Production PostgreSQL Migration Schema
-- Database schema for digital publication, magazines, newsroom, media, and admin CMS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Website Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name TEXT NOT NULL DEFAULT 'ALIF FRIENDS 12',
    tagline TEXT NOT NULL DEFAULT 'A Class. A Generation. A Thousand Memories.',
    hero_heading TEXT NOT NULL,
    hero_subheading TEXT NOT NULL,
    hero_badge TEXT DEFAULT 'Official Class Media Publication',
    hero_image TEXT,
    about_story TEXT,
    about_mission TEXT,
    about_vision TEXT,
    founder_quote TEXT,
    official_youtube TEXT NOT NULL DEFAULT 'https://www.youtube.com/@AlifCreations12',
    official_instagram TEXT NOT NULL DEFAULT 'https://www.instagram.com/_alif_friends_/',
    email_primary TEXT NOT NULL DEFAULT 'aliffreinds12@gmail.com',
    email_secondary TEXT NOT NULL DEFAULT 'aliffriends12@gmail.com',
    members_section_enabled BOOLEAN DEFAULT true,
    breaking_ticker_text TEXT,
    show_breaking_ticker BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'superadmin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 3. Magazines Table
CREATE TABLE IF NOT EXISTS public.magazines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    edition_number TEXT NOT NULL,
    publication_date DATE NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    author TEXT NOT NULL,
    editor TEXT NOT NULL,
    page_count INTEGER DEFAULT 0,
    file_size TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Newspaper Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    headline_status BOOLEAN DEFAULT false,
    breaking_status BOOLEAN DEFAULT false,
    cover_image TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    author_role TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    gallery_images TEXT[] DEFAULT '{}',
    related_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Programs Table
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    youtube_url TEXT,
    video_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Videos Table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    video_type TEXT NOT NULL DEFAULT 'youtube',
    youtube_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT NOT NULL,
    duration TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    collection_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Gallery Albums & Photos Table
CREATE TABLE IF NOT EXISTS public.gallery_albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    cover_image TEXT NOT NULL,
    is_restricted BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    photos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Class Members Table
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    quote TEXT,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    awarded_by TEXT,
    image_url TEXT NOT NULL,
    badge_title TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size BIGINT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Indexes for High Performance Editorial Browsing
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_magazines_published ON public.magazines(is_published, publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_programs_published ON public.programs(is_published, date DESC);
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_published ON public.gallery_albums(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_order ON public.class_members(order_index ASC);

-- Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magazines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can view published content
CREATE POLICY "Public can view published settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Public can view published magazines" ON public.magazines FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published programs" ON public.programs FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published videos" ON public.videos FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published gallery" ON public.gallery_albums FOR SELECT USING (is_published = true AND is_restricted = false);
CREATE POLICY "Public can view published members" ON public.class_members FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published achievements" ON public.achievements FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published announcements" ON public.announcements FOR SELECT USING (is_published = true);

-- Public can insert contact messages (spam-checked via server API)
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

