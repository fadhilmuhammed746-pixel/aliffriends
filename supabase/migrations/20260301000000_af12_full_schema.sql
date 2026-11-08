-- =============================================================================
-- ALIF FRIENDS 12 — COMPLETE PRODUCTION POSTGRESQL SCHEMA & STORAGE MIGRATION
-- Database schema for digital publication, magazines, newsroom, media, and admin CMS
-- Compatible with Supabase PostgreSQL, Next.js 15 App Router, and Vercel Cloud
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Website Settings Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    site_name TEXT NOT NULL DEFAULT 'ALIF FRIENDS 12',
    tagline TEXT NOT NULL DEFAULT 'A Class. A Generation. A Thousand Memories.',
    hero_heading TEXT NOT NULL DEFAULT 'A Generation of Fellowship, Excellence & Creative Vision',
    hero_subheading TEXT NOT NULL DEFAULT 'The definitive digital publication and cinematic media archive of Alif Friends 12.',
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

-- -----------------------------------------------------------------------------
-- 2. Admin Users Table (Secure authentication)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'superadmin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE
);

-- -----------------------------------------------------------------------------
-- 3. Magazines Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.magazines (
    id TEXT PRIMARY KEY,
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

-- -----------------------------------------------------------------------------
-- 4. Newspaper Articles Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
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
    video_url TEXT,
    pdf_url TEXT,
    pdf_title TEXT,
    related_tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 5. Programs Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    youtube_url TEXT,
    video_url TEXT,
    pdf_url TEXT,
    pdf_title TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 6. Videos Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.videos (
    id TEXT PRIMARY KEY,
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

-- -----------------------------------------------------------------------------
-- 7. Gallery Albums & Photos Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_albums (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    cover_image TEXT NOT NULL,
    is_restricted BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    event_date DATE,
    photos JSONB DEFAULT '[]'::jsonb,
    videos TEXT[] DEFAULT '{}',
    pdf_url TEXT,
    pdf_title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 8. Class Members Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.class_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    quote TEXT,
    order_index INTEGER DEFAULT 0,
    category TEXT,
    responsibility TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 9. Achievements Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    awarded_by TEXT,
    image_url TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    video_url TEXT,
    pdf_url TEXT,
    pdf_title TEXT,
    badge_title TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 10. Announcements Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    photos TEXT[] DEFAULT '{}',
    video_url TEXT,
    pdf_url TEXT,
    pdf_title TEXT,
    priority TEXT DEFAULT 'medium',
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 11. Media Assets Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size BIGINT NOT NULL,
    category TEXT NOT NULL,
    section TEXT,
    content_id TEXT,
    uploaded_by TEXT DEFAULT 'admin',
    storage_location TEXT DEFAULT 'supabase',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 12. Contact Messages Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 13. Class Finance: Summary (Strictly Private & Admin Protected)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.finance_summary (
    id TEXT PRIMARY KEY DEFAULT 'default',
    currency TEXT NOT NULL DEFAULT 'INR',
    currency_symbol TEXT NOT NULL DEFAULT '₹',
    opening_balance NUMERIC(12, 2) NOT NULL DEFAULT 1100.00,
    current_balance NUMERIC(12, 2) NOT NULL DEFAULT 1100.00,
    total_income NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_expenses NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    setup_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 14. Class Finance: Transactions (Strictly Private & Admin Protected)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.finance_transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    counterparty TEXT NOT NULL,
    description TEXT NOT NULL,
    notes TEXT,
    receipt_url TEXT,
    balance_after NUMERIC(12, 2) NOT NULL,
    added_by TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 15. Class Finance: Audit Logs (Strictly Private & Admin Protected)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.finance_audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'setup')),
    transaction_id TEXT,
    details TEXT NOT NULL,
    performed_by TEXT NOT NULL DEFAULT 'admin',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- Performance Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_magazines_published ON public.magazines(is_published, publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_programs_published ON public.programs(is_published, date DESC);
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_published ON public.gallery_albums(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_order ON public.class_members(order_index ASC);
CREATE INDEX IF NOT EXISTS idx_achievements_date ON public.achievements(is_published, date DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_date ON public.announcements(is_published, date DESC);
CREATE INDEX IF NOT EXISTS idx_finance_tx_date ON public.finance_transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_media_category ON public.media_assets(category);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_finance_audit_timestamp ON public.finance_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_articles_headlines ON public.articles(headline_status, breaking_status) WHERE is_published = true;

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- -----------------------------------------------------------------------------
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.finance_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Published Editorial Content
DROP POLICY IF EXISTS "Public can view settings" ON public.settings;
CREATE POLICY "Public can view settings" ON public.settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view published magazines" ON public.magazines;
CREATE POLICY "Public can view published magazines" ON public.magazines FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published programs" ON public.programs;
CREATE POLICY "Public can view published programs" ON public.programs FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published videos" ON public.videos;
CREATE POLICY "Public can view published videos" ON public.videos FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published gallery" ON public.gallery_albums;
CREATE POLICY "Public can view published gallery" ON public.gallery_albums FOR SELECT USING (is_published = true AND is_restricted = false);

DROP POLICY IF EXISTS "Public can view published members" ON public.class_members;
CREATE POLICY "Public can view published members" ON public.class_members FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published achievements" ON public.achievements;
CREATE POLICY "Public can view published achievements" ON public.achievements FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view published announcements" ON public.announcements;
CREATE POLICY "Public can view published announcements" ON public.announcements FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public can view media assets" ON public.media_assets;
CREATE POLICY "Public can view media assets" ON public.media_assets FOR SELECT USING (true);

-- Public Contact Form Insertion
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Service Role (Full Backend API Access)
-- When the server uses SUPABASE_SERVICE_ROLE_KEY, it automatically bypasses RLS in Supabase.
-- Explicit policies provide structured, audited service-role access:
DROP POLICY IF EXISTS "Service role full access settings" ON public.settings;
CREATE POLICY "Service role full access settings" ON public.settings FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access admin_users" ON public.admin_users;
CREATE POLICY "Service role full access admin_users" ON public.admin_users FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access magazines" ON public.magazines;
CREATE POLICY "Service role full access magazines" ON public.magazines FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access articles" ON public.articles;
CREATE POLICY "Service role full access articles" ON public.articles FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access programs" ON public.programs;
CREATE POLICY "Service role full access programs" ON public.programs FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access videos" ON public.videos;
CREATE POLICY "Service role full access videos" ON public.videos FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access gallery" ON public.gallery_albums;
CREATE POLICY "Service role full access gallery" ON public.gallery_albums FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access members" ON public.class_members;
CREATE POLICY "Service role full access members" ON public.class_members FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access achievements" ON public.achievements;
CREATE POLICY "Service role full access achievements" ON public.achievements FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access announcements" ON public.announcements;
CREATE POLICY "Service role full access announcements" ON public.announcements FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access media" ON public.media_assets;
CREATE POLICY "Service role full access media" ON public.media_assets FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access messages" ON public.contact_messages;
CREATE POLICY "Service role full access messages" ON public.contact_messages FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access finance_summary" ON public.finance_summary;
CREATE POLICY "Service role full access finance_summary" ON public.finance_summary FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access finance_transactions" ON public.finance_transactions;
CREATE POLICY "Service role full access finance_transactions" ON public.finance_transactions FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access finance_audit_logs" ON public.finance_audit_logs;
CREATE POLICY "Service role full access finance_audit_logs" ON public.finance_audit_logs FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- Default Initial Record Seeding (Idempotent)
-- -----------------------------------------------------------------------------
INSERT INTO public.settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.finance_summary (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Storage Buckets Configuration (Supabase Storage)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('af12-media', 'af12-media', true, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/x-png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'application/pdf', 'application/x-pdf', 'application/octet-stream']),
  ('af12-finance-receipts', 'af12-finance-receipts', false, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/x-png', 'image/webp', 'application/pdf', 'application/x-pdf', 'application/octet-stream'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies
DROP POLICY IF EXISTS "Public can view media files" ON storage.objects;
CREATE POLICY "Public can view media files" ON storage.objects 
  FOR SELECT USING (bucket_id = 'af12-media');

DROP POLICY IF EXISTS "Service role upload to media" ON storage.objects;
CREATE POLICY "Service role upload to media" ON storage.objects 
  FOR ALL USING (auth.role() = 'service_role');
