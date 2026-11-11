import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { getSupabaseAdminClient, isSupabaseConfigured } from './supabase';
import {
  DatabaseSchema,
  AdminUser,
  Magazine,
  Article,
  Program,
  VideoItem,
  GalleryAlbum,
  ClassMember,
  Achievement,
  Announcement,
  WebsiteSettings,
  MediaAsset,
  ContactMessage,
  FinanceTransaction,
  FinanceSummary,
  FinanceAuditLog,
  TransactionType,
} from './types';

// Filesystem paths for local fallback only.
// In production or on Vercel, filesystem operations must never attempt to create or write /var/task/data.
const isServerless = Boolean(process.env.VERCEL || process.env.NODE_ENV === 'production');
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'af12_database.json');

// Memory cache for fallback
let memoryCache: DatabaseSchema | null = null;

function getInitialSeedData(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('alif12', salt);

  return {
    adminUsers: [
      {
        id: 'admin_001',
        username: 'admin',
        passwordHash: adminPasswordHash,
        role: 'superadmin',
        createdAt: '2026-03-01T00:00:00Z',
      },
    ],
    settings: {
      siteName: 'ALIF FRIENDS 12',
      tagline: 'A Class. A Generation. A Thousand Memories.',
      heroHeading: 'A Generation of Fellowship, Excellence & Creative Vision',
      heroSubheading:
        'The definitive digital publication and cinematic media archive of Alif Friends 12. Curating stories, magazine editions, photographic heritage, and shared milestones.',
      heroBadge: 'Official Class Media Publication',
      heroImage:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80',
      aboutStory:
        'Alif Friends 12 represents more than an academic cohort; it is a collective bond forged through shared ambition, creative curiosity, and lasting brotherhood.',
      aboutMission:
        'To document, celebrate, and perpetuate the creative, intellectual, and personal milestones of our class through world-class editorial journalism and cinematic archives.',
      aboutVision:
        'To serve as an enduring beacon of camaraderie and mutual achievement that inspires future generations to cherish unity and strive for collective greatness.',
      founderQuote:
        '"We entered these halls as disparate individuals with personal aspirations; we graduate as a unified generation whose shared memories will illuminate every path we take."',
      officialYoutube: 'https://www.youtube.com/@AlifCreations12',
      officialInstagram: 'https://www.instagram.com/_alif_friends_/',
      emailPrimary: 'aliffreinds12@gmail.com',
      emailSecondary: 'aliffriends12@gmail.com',
      membersSectionEnabled: true,
      breakingTickerText:
        'ALIF FRIENDS 12: Grand Reunion & Annual Magazine Edition XII is now officially live • Watch the new documentary on YouTube @AlifCreations12',
      showBreakingTicker: true,
      updatedAt: '2026-03-01T00:00:00Z',
    },
    magazines: [],
    articles: [],
    programs: [],
    videos: [],
    albums: [],
    members: [],
    achievements: [],
    announcements: [],
    media: [],
    messages: [],
    finance: {
      openingBalance: 1100,
      currency: 'INR',
      currencySymbol: '₹',
      currentBalance: 1100,
      totalIncome: 0,
      totalExpenses: 0,
      setupDate: '2026-03-01T00:00:00Z',
      lastUpdated: '2026-03-01T00:00:00Z',
      transactions: [],
      auditLogs: [],
    },
  };
}

// Safe local database reader for local offline development only.
// Never creates directories or writes files in production / Vercel.
function getLocalDatabase(): DatabaseSchema {
  if (memoryCache) return memoryCache;

  if (isServerless) {
    // In serverless environment without Supabase, return seed safely without touching disk
    const seed = getInitialSeedData();
    memoryCache = seed;
    return seed;
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('Local database read fallback notice:', err);
  }

  const seed = getInitialSeedData();
  memoryCache = seed;
  return seed;
}

function saveLocalDatabase(data: DatabaseSchema): void {
  memoryCache = data;
  if (isServerless) return; // Never write to disk in serverless

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_FILE);
  } catch (err) {
    console.warn('Local database write notice:', err);
  }
}

// -----------------------------------------------------------------------------
// Supabase Row <-> TypeScript Mappers
// -----------------------------------------------------------------------------

function toSettings(row: any): WebsiteSettings {
  return {
    siteName: row.site_name,
    tagline: row.tagline,
    heroHeading: row.hero_heading,
    heroSubheading: row.hero_subheading,
    heroBadge: row.hero_badge,
    heroImage: row.hero_image,
    aboutStory: row.about_story,
    aboutMission: row.about_mission,
    aboutVision: row.about_vision,
    founderQuote: row.founder_quote,
    officialYoutube: row.official_youtube,
    officialInstagram: row.official_instagram,
    emailPrimary: row.email_primary,
    emailSecondary: row.email_secondary,
    membersSectionEnabled: Boolean(row.members_section_enabled),
    breakingTickerText: row.breaking_ticker_text,
    showBreakingTicker: Boolean(row.show_breaking_ticker),
    updatedAt: row.updated_at,
  };
}

function toSettingsRow(settings: Partial<WebsiteSettings>): any {
  const row: any = {};
  if (settings.siteName !== undefined) row.site_name = settings.siteName;
  if (settings.tagline !== undefined) row.tagline = settings.tagline;
  if (settings.heroHeading !== undefined) row.hero_heading = settings.heroHeading;
  if (settings.heroSubheading !== undefined) row.hero_subheading = settings.heroSubheading;
  if (settings.heroBadge !== undefined) row.hero_badge = settings.heroBadge;
  if (settings.heroImage !== undefined) row.hero_image = settings.heroImage;
  if (settings.aboutStory !== undefined) row.about_story = settings.aboutStory;
  if (settings.aboutMission !== undefined) row.about_mission = settings.aboutMission;
  if (settings.aboutVision !== undefined) row.about_vision = settings.aboutVision;
  if (settings.founderQuote !== undefined) row.founder_quote = settings.founderQuote;
  if (settings.officialYoutube !== undefined) row.official_youtube = settings.officialYoutube;
  if (settings.officialInstagram !== undefined) row.official_instagram = settings.officialInstagram;
  if (settings.emailPrimary !== undefined) row.email_primary = settings.emailPrimary;
  if (settings.emailSecondary !== undefined) row.email_secondary = settings.emailSecondary;
  if (settings.membersSectionEnabled !== undefined) row.members_section_enabled = settings.membersSectionEnabled;
  if (settings.breakingTickerText !== undefined) row.breaking_ticker_text = settings.breakingTickerText;
  if (settings.showBreakingTicker !== undefined) row.show_breaking_ticker = settings.showBreakingTicker;
  row.updated_at = new Date().toISOString();
  return row;
}

function toAdminUser(row: any): AdminUser {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    role: row.role || 'superadmin',
    createdAt: row.created_at,
    lastLogin: row.last_login || undefined,
  };
}

function toMagazine(row: any): Magazine {
  return {
    id: row.id,
    title: row.title,
    editionNumber: row.edition_number,
    publicationDate: row.publication_date,
    description: row.description,
    coverImage: row.cover_image,
    pdfUrl: row.pdf_url,
    author: row.author,
    editor: row.editor,
    pageCount: row.page_count ?? undefined,
    fileSize: row.file_size ?? undefined,
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toMagazineRow(m: Partial<Magazine>): any {
  const row: any = {};
  if (m.title !== undefined) row.title = m.title;
  if (m.editionNumber !== undefined) row.edition_number = m.editionNumber;
  if (m.publicationDate !== undefined) row.publication_date = m.publicationDate;
  if (m.description !== undefined) row.description = m.description;
  if (m.coverImage !== undefined) row.cover_image = m.coverImage;
  if (m.pdfUrl !== undefined) row.pdf_url = m.pdfUrl;
  if (m.author !== undefined) row.author = m.author;
  if (m.editor !== undefined) row.editor = m.editor;
  if (m.pageCount !== undefined) row.page_count = m.pageCount;
  if (m.fileSize !== undefined) row.file_size = m.fileSize;
  if (m.isFeatured !== undefined) row.is_featured = m.isFeatured;
  if (m.isPublished !== undefined) row.is_published = m.isPublished;
  if (m.tags !== undefined) row.tags = m.tags;
  return row;
}

function toArticle(row: any): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || undefined,
    category: row.category,
    headlineStatus: Boolean(row.headline_status),
    breakingStatus: Boolean(row.breaking_status),
    coverImage: row.cover_image,
    content: row.content,
    author: row.author,
    authorRole: row.author_role || undefined,
    publishedAt: row.published_at,
    viewCount: row.view_count || 0,
    isPublished: Boolean(row.is_published),
    galleryImages: row.gallery_images || [],
    videoUrl: row.video_url || undefined,
    pdfUrl: row.pdf_url || undefined,
    pdfTitle: row.pdf_title || undefined,
    relatedTags: row.related_tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toArticleRow(a: Partial<Article>): any {
  const row: any = {};
  if (a.slug !== undefined) row.slug = a.slug;
  if (a.title !== undefined) row.title = a.title;
  if (a.subtitle !== undefined) row.subtitle = a.subtitle;
  if (a.category !== undefined) row.category = a.category;
  if (a.headlineStatus !== undefined) row.headline_status = a.headlineStatus;
  if (a.breakingStatus !== undefined) row.breaking_status = a.breakingStatus;
  if (a.coverImage !== undefined) row.cover_image = a.coverImage;
  if (a.content !== undefined) row.content = a.content;
  if (a.author !== undefined) row.author = a.author;
  if (a.authorRole !== undefined) row.author_role = a.authorRole;
  if (a.publishedAt !== undefined) row.published_at = a.publishedAt;
  if (a.viewCount !== undefined) row.view_count = a.viewCount;
  if (a.isPublished !== undefined) row.is_published = a.isPublished;
  if (a.galleryImages !== undefined) row.gallery_images = a.galleryImages;
  if (a.videoUrl !== undefined) row.video_url = a.videoUrl;
  if (a.pdfUrl !== undefined) row.pdf_url = a.pdfUrl;
  if (a.pdfTitle !== undefined) row.pdf_title = a.pdfTitle;
  if (a.relatedTags !== undefined) row.related_tags = a.relatedTags;
  return row;
}

function toProgram(row: any): Program {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    location: row.location,
    description: row.description,
    coverImage: row.cover_image,
    photos: row.photos || [],
    youtubeUrl: row.youtube_url || undefined,
    videoUrl: row.video_url || undefined,
    pdfUrl: row.pdf_url || undefined,
    pdfTitle: row.pdf_title || undefined,
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toProgramRow(p: Partial<Program>): any {
  const row: any = {};
  if (p.title !== undefined) row.title = p.title;
  if (p.category !== undefined) row.category = p.category;
  if (p.date !== undefined) row.date = p.date;
  if (p.location !== undefined) row.location = p.location;
  if (p.description !== undefined) row.description = p.description;
  if (p.coverImage !== undefined) row.cover_image = p.coverImage;
  if (p.photos !== undefined) row.photos = p.photos;
  if (p.youtubeUrl !== undefined) row.youtube_url = p.youtubeUrl;
  if (p.videoUrl !== undefined) row.video_url = p.videoUrl;
  if (p.pdfUrl !== undefined) row.pdf_url = p.pdfUrl;
  if (p.pdfTitle !== undefined) row.pdf_title = p.pdfTitle;
  if (p.isFeatured !== undefined) row.is_featured = p.isFeatured;
  if (p.isPublished !== undefined) row.is_published = p.isPublished;
  return row;
}

function toVideo(row: any): VideoItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    videoType: row.video_type || 'youtube',
    youtubeUrl: row.youtube_url || undefined,
    videoUrl: row.video_url || undefined,
    thumbnailUrl: row.thumbnail_url,
    duration: row.duration || undefined,
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    collectionName: row.collection_name || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toVideoRow(v: Partial<VideoItem>): any {
  const row: any = {};
  if (v.title !== undefined) row.title = v.title;
  if (v.description !== undefined) row.description = v.description;
  if (v.category !== undefined) row.category = v.category;
  if (v.videoType !== undefined) row.video_type = v.videoType;
  if (v.youtubeUrl !== undefined) row.youtube_url = v.youtubeUrl;
  if (v.videoUrl !== undefined) row.video_url = v.videoUrl;
  if (v.thumbnailUrl !== undefined) row.thumbnail_url = v.thumbnailUrl;
  if (v.duration !== undefined) row.duration = v.duration;
  if (v.isFeatured !== undefined) row.is_featured = v.isFeatured;
  if (v.isPublished !== undefined) row.is_published = v.isPublished;
  if (v.collectionName !== undefined) row.collection_name = v.collectionName;
  return row;
}

function toAlbum(row: any): GalleryAlbum {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description || '',
    coverImage: row.cover_image,
    isRestricted: Boolean(row.is_restricted),
    isPublished: Boolean(row.is_published),
    isFeatured: Boolean(row.is_featured),
    eventDate: row.event_date || undefined,
    photos: row.photos || [],
    videos: row.videos || [],
    pdfUrl: row.pdf_url || undefined,
    pdfTitle: row.pdf_title || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toAlbumRow(a: Partial<GalleryAlbum>): any {
  const row: any = {};
  if (a.title !== undefined) row.title = a.title;
  if (a.category !== undefined) row.category = a.category;
  if (a.description !== undefined) row.description = a.description;
  if (a.coverImage !== undefined) row.cover_image = a.coverImage;
  if (a.isRestricted !== undefined) row.is_restricted = a.isRestricted;
  if (a.isPublished !== undefined) row.is_published = a.isPublished;
  if (a.isFeatured !== undefined) row.is_featured = a.isFeatured;
  if (a.eventDate !== undefined) row.event_date = a.eventDate;
  if (a.photos !== undefined) row.photos = a.photos;
  if (a.videos !== undefined) row.videos = a.videos;
  if (a.pdfUrl !== undefined) row.pdf_url = a.pdfUrl;
  if (a.pdfTitle !== undefined) row.pdf_title = a.pdfTitle;
  return row;
}

function toMember(row: any): ClassMember {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    bio: row.bio,
    photoUrl: row.photo_url,
    quote: row.quote || undefined,
    orderIndex: row.order_index ?? 0,
    category: row.category || undefined,
    responsibility: row.responsibility || undefined,
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toMemberRow(m: Partial<ClassMember>): any {
  const row: any = {};
  if (m.name !== undefined) row.name = m.name;
  if (m.position !== undefined) row.position = m.position;
  if (m.bio !== undefined) row.bio = m.bio;
  if (m.photoUrl !== undefined) row.photo_url = m.photoUrl;
  if (m.quote !== undefined) row.quote = m.quote;
  if (m.orderIndex !== undefined) row.order_index = m.orderIndex;
  if (m.category !== undefined) row.category = m.category;
  if (m.responsibility !== undefined) row.responsibility = m.responsibility;
  if (m.isPublished !== undefined) row.is_published = m.isPublished;
  return row;
}

function toAchievement(row: any): Achievement {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    description: row.description,
    awardedBy: row.awarded_by || undefined,
    imageUrl: row.image_url,
    photos: row.photos || [],
    videoUrl: row.video_url || undefined,
    pdfUrl: row.pdf_url || undefined,
    pdfTitle: row.pdf_title || undefined,
    badgeTitle: row.badge_title || undefined,
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toAchievementRow(a: Partial<Achievement>): any {
  const row: any = {};
  if (a.title !== undefined) row.title = a.title;
  if (a.category !== undefined) row.category = a.category;
  if (a.date !== undefined) row.date = a.date;
  if (a.description !== undefined) row.description = a.description;
  if (a.awardedBy !== undefined) row.awarded_by = a.awardedBy;
  if (a.imageUrl !== undefined) row.image_url = a.imageUrl;
  if (a.photos !== undefined) row.photos = a.photos;
  if (a.videoUrl !== undefined) row.video_url = a.videoUrl;
  if (a.pdfUrl !== undefined) row.pdf_url = a.pdfUrl;
  if (a.pdfTitle !== undefined) row.pdf_title = a.pdfTitle;
  if (a.badgeTitle !== undefined) row.badge_title = a.badgeTitle;
  if (a.isFeatured !== undefined) row.is_featured = a.isFeatured;
  if (a.isPublished !== undefined) row.is_published = a.isPublished;
  return row;
}

function toAnnouncement(row: any): Announcement {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.date,
    content: row.content,
    coverImage: row.cover_image || undefined,
    photos: row.photos || [],
    videoUrl: row.video_url || undefined,
    pdfUrl: row.pdf_url || undefined,
    pdfTitle: row.pdf_title || undefined,
    priority: row.priority || 'medium',
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toAnnouncementRow(an: Partial<Announcement>): any {
  const row: any = {};
  if (an.title !== undefined) row.title = an.title;
  if (an.category !== undefined) row.category = an.category;
  if (an.date !== undefined) row.date = an.date;
  if (an.content !== undefined) row.content = an.content;
  if (an.coverImage !== undefined) row.cover_image = an.coverImage;
  if (an.photos !== undefined) row.photos = an.photos;
  if (an.videoUrl !== undefined) row.video_url = an.videoUrl;
  if (an.pdfUrl !== undefined) row.pdf_url = an.pdfUrl;
  if (an.pdfTitle !== undefined) row.pdf_title = an.pdfTitle;
  if (an.priority !== undefined) row.priority = an.priority;
  if (an.isFeatured !== undefined) row.is_featured = an.isFeatured;
  if (an.isPublished !== undefined) row.is_published = an.isPublished;
  return row;
}

function toMedia(row: any): MediaAsset {
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.original_name,
    url: row.url,
    mimeType: row.mime_type,
    size: row.size,
    category: row.category,
    section: row.section || undefined,
    contentId: row.content_id || undefined,
    uploadedBy: row.uploaded_by || 'admin',
    storageLocation: row.storage_location || 'supabase',
    createdAt: row.created_at,
  };
}

function toMediaRow(md: Partial<MediaAsset>): any {
  const row: any = {};
  if (md.filename !== undefined) row.filename = md.filename;
  if (md.originalName !== undefined) row.original_name = md.originalName;
  if (md.url !== undefined) row.url = md.url;
  if (md.mimeType !== undefined) row.mime_type = md.mimeType;
  if (md.size !== undefined) row.size = md.size;
  if (md.category !== undefined) row.category = md.category;
  if (md.section !== undefined) row.section = md.section;
  if (md.contentId !== undefined) row.content_id = md.contentId;
  if (md.uploadedBy !== undefined) row.uploaded_by = md.uploadedBy;
  if (md.storageLocation !== undefined) row.storage_location = md.storageLocation;
  return row;
}

function toMessage(row: any): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status || 'unread',
    createdAt: row.created_at,
  };
}

function toFinanceSummary(row: any, transactionCount = 0): FinanceSummary {
  return {
    currency: row?.currency || 'INR',
    currencySymbol: row?.currency_symbol || '₹',
    openingBalance: Number(row?.opening_balance ?? 1100),
    currentBalance: Number(row?.current_balance ?? 1100),
    totalIncome: Number(row?.total_income ?? 0),
    totalExpenses: Number(row?.total_expenses ?? 0),
    transactionCount,
    setupDate: row?.setup_date || '2026-03-01T00:00:00Z',
    lastUpdated: row?.last_updated || new Date().toISOString(),
  };
}

function toFinanceTransaction(row: any): FinanceTransaction {
  return {
    id: row.id,
    type: row.type,
    category: row.category,
    amount: Number(row.amount),
    date: row.date,
    counterparty: row.counterparty,
    description: row.description,
    notes: row.notes || undefined,
    receiptUrl: row.receipt_url || undefined,
    balanceAfter: Number(row.balance_after),
    addedBy: row.added_by || 'admin',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toFinanceAuditLog(row: any): FinanceAuditLog {
  return {
    id: row.id,
    action: row.action,
    transactionId: row.transaction_id || undefined,
    details: row.details,
    performedBy: row.performed_by || 'admin',
    timestamp: row.timestamp,
  };
}

// -----------------------------------------------------------------------------
// Unified Data Access API
// All methods use Supabase PostgreSQL when available, or safe local fallback.
// -----------------------------------------------------------------------------

export const db = {
  // Settings
  async getSettings(): Promise<WebsiteSettings> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (!error && data) {
        return toSettings(data);
      }
    }
    return getLocalDatabase().settings;
  },

  async updateSettings(partial: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const client = getSupabaseAdminClient();
    if (client) {
      const updateData = toSettingsRow(partial);
      const { data, error } = await client
        .from('settings')
        .upsert({ id: 'default', ...updateData }, { onConflict: 'id' })
        .select('*')
        .single();

      if (!error && data) {
        return toSettings(data);
      }
      throw new Error(`Failed to update settings in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    local.settings = {
      ...local.settings,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    saveLocalDatabase(local);
    return local.settings;
  },

  // Admin Users
  async getAdminByUsername(username: string): Promise<AdminUser | null> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('admin_users')
        .select('*')
        .ilike('username', username)
        .maybeSingle();

      if (!error && data) {
        return toAdminUser(data);
      }
      return null;
    }

    const local = getLocalDatabase();
    return local.adminUsers.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  async updateAdminPassword(userId: string, newPasswordHash: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client
        .from('admin_users')
        .update({ password_hash: newPasswordHash })
        .eq('id', userId);

      return !error;
    }

    const local = getLocalDatabase();
    const admin = local.adminUsers.find((u) => u.id === userId);
    if (!admin) return false;
    admin.passwordHash = newPasswordHash;
    saveLocalDatabase(local);
    return true;
  },

  // Magazines
  async getMagazines(onlyPublished = true): Promise<Magazine[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      let query = client
        .from('magazines')
        .select('*')
        .order('publication_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (onlyPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(toMagazine);
      }
    }

    const items = getLocalDatabase().magazines;
    return onlyPublished ? items.filter((m) => m.isPublished) : items;
  },

  async getMagazineById(id: string): Promise<Magazine | null> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('magazines')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return toMagazine(data);
      }
      return null;
    }

    return getLocalDatabase().magazines.find((m) => m.id === id) || null;
  },

  async createMagazine(magazine: Omit<Magazine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Magazine> {
    const id = `mag_${Date.now()}`;
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        id,
        ...toMagazineRow(magazine),
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await client.from('magazines').insert(row).select('*').single();
      if (!error && data) {
        return toMagazine(data);
      }
      throw new Error(`Failed to create magazine in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    const newMag: Magazine = {
      ...magazine,
      id,
      createdAt: now,
      updatedAt: now,
    };
    local.magazines.unshift(newMag);
    saveLocalDatabase(local);
    return newMag;
  },

  async updateMagazine(id: string, partial: Partial<Magazine>): Promise<Magazine | null> {
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        ...toMagazineRow(partial),
        updated_at: now,
      };
      const { data, error } = await client.from('magazines').update(row).eq('id', id).select('*').single();
      if (!error && data) {
        return toMagazine(data);
      }
      return null;
    }

    const local = getLocalDatabase();
    const index = local.magazines.findIndex((m) => m.id === id);
    if (index === -1) return null;
    local.magazines[index] = {
      ...local.magazines[index],
      ...partial,
      updatedAt: now,
    };
    saveLocalDatabase(local);
    return local.magazines[index];
  },

  async deleteMagazine(id: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client.from('magazines').delete().eq('id', id);
      return !error;
    }

    const local = getLocalDatabase();
    local.magazines = local.magazines.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Articles
  async getArticles(onlyPublished = true): Promise<Article[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      let query = client
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .order('created_at', { ascending: false });

      if (onlyPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(toArticle);
      }
    }

    const items = getLocalDatabase().articles;
    return onlyPublished ? items.filter((a) => a.isPublished) : items;
  },

  async getArticleBySlugOrId(identifier: string): Promise<Article | null> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('articles')
        .select('*')
        .or(`slug.eq.${identifier},id.eq.${identifier}`)
        .maybeSingle();

      if (!error && data) {
        return toArticle(data);
      }
      return null;
    }

    return getLocalDatabase().articles.find((a) => a.slug === identifier || a.id === identifier) || null;
  },

  async createArticle(article: Omit<Article, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'>): Promise<Article> {
    const id = `art_${Date.now()}`;
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        id,
        ...toArticleRow(article),
        view_count: 0,
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await client.from('articles').insert(row).select('*').single();
      if (!error && data) {
        return toArticle(data);
      }
      throw new Error(`Failed to create article in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    const newArt: Article = {
      ...article,
      id,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    local.articles.unshift(newArt);
    saveLocalDatabase(local);
    return newArt;
  },

  async updateArticle(id: string, partial: Partial<Article>): Promise<Article | null> {
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        ...toArticleRow(partial),
        updated_at: now,
      };
      const { data, error } = await client.from('articles').update(row).eq('id', id).select('*').single();
      if (!error && data) {
        return toArticle(data);
      }
      return null;
    }

    const local = getLocalDatabase();
    const index = local.articles.findIndex((a) => a.id === id);
    if (index === -1) return null;
    local.articles[index] = {
      ...local.articles[index],
      ...partial,
      updatedAt: now,
    };
    saveLocalDatabase(local);
    return local.articles[index];
  },

  async incrementArticleView(id: string): Promise<void> {
    const client = getSupabaseAdminClient();
    if (client) {
      try {
        const { data } = await client
          .from('articles')
          .select('id, view_count')
          .or(`id.eq.${id},slug.eq.${id}`)
          .maybeSingle();

        if (data) {
          await client
            .from('articles')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id);
        }
        return;
      } catch (err) {
        console.warn('Increment view warning:', err);
      }
    }

    const local = getLocalDatabase();
    const art = local.articles.find((a) => a.id === id || a.slug === id);
    if (art) {
      art.viewCount = (art.viewCount || 0) + 1;
      saveLocalDatabase(local);
    }
  },

  async deleteArticle(id: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client.from('articles').delete().eq('id', id);
      return !error;
    }

    const local = getLocalDatabase();
    local.articles = local.articles.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Programs
  async getPrograms(onlyPublished = true): Promise<Program[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      let query = client
        .from('programs')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (onlyPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(toProgram);
      }
    }

    const items = getLocalDatabase().programs;
    return onlyPublished ? items.filter((p) => p.isPublished) : items;
  },

  async getProgramById(id: string): Promise<Program | null> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('programs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return toProgram(data);
      }
      return null;
    }

    return getLocalDatabase().programs.find((p) => p.id === id) || null;
  },

  async createProgram(prog: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program> {
    const id = `prog_${Date.now()}`;
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        id,
        ...toProgramRow(prog),
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await client.from('programs').insert(row).select('*').single();
      if (!error && data) {
        return toProgram(data);
      }
      throw new Error(`Failed to create program in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    const newProg: Program = {
      ...prog,
      id,
      createdAt: now,
      updatedAt: now,
    };
    local.programs.unshift(newProg);
    saveLocalDatabase(local);
    return newProg;
  },

  async updateProgram(id: string, partial: Partial<Program>): Promise<Program | null> {
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        ...toProgramRow(partial),
        updated_at: now,
      };
      const { data, error } = await client.from('programs').update(row).eq('id', id).select('*').single();
      if (!error && data) {
        return toProgram(data);
      }
      return null;
    }

    const local = getLocalDatabase();
    const index = local.programs.findIndex((p) => p.id === id);
    if (index === -1) return null;
    local.programs[index] = {
      ...local.programs[index],
      ...partial,
      updatedAt: now,
    };
    saveLocalDatabase(local);
    return local.programs[index];
  },

  async deleteProgram(id: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client.from('programs').delete().eq('id', id);
      return !error;
    }

    const local = getLocalDatabase();
    local.programs = local.programs.filter((p) => p.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Videos
  async getVideos(onlyPublished = true): Promise<VideoItem[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      let query = client
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (onlyPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(toVideo);
      }
    }

    const items = getLocalDatabase().videos;
    return onlyPublished ? items.filter((v) => v.isPublished) : items;
  },

  async getVideoById(id: string): Promise<VideoItem | null> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('videos')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return toVideo(data);
      }
      return null;
    }

    return getLocalDatabase().videos.find((v) => v.id === id) || null;
  },

  async createVideo(vid: Omit<VideoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<VideoItem> {
    const id = `vid_${Date.now()}`;
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        id,
        ...toVideoRow(vid),
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await client.from('videos').insert(row).select('*').single();
      if (!error && data) {
        return toVideo(data);
      }
      throw new Error(`Failed to create video in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    const newVid: VideoItem = {
      ...vid,
      id,
      createdAt: now,
      updatedAt: now,
    };
    local.videos.unshift(newVid);
    saveLocalDatabase(local);
    return newVid;
  },

  async updateVideo(id: string, partial: Partial<VideoItem>): Promise<VideoItem | null> {
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        ...toVideoRow(partial),
        updated_at: now,
      };
      const { data, error } = await client.from('videos').update(row).eq('id', id).select('*').single();
      if (!error && data) {
        return toVideo(data);
      }
      return null;
    }

    const local = getLocalDatabase();
    const index = local.videos.findIndex((v) => v.id === id);
    if (index === -1) return null;
    local.videos[index] = {
      ...local.videos[index],
      ...partial,
      updatedAt: now,
    };
    saveLocalDatabase(local);
    return local.videos[index];
  },

  async deleteVideo(id: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client.from('videos').delete().eq('id', id);
      return !error;
    }

    const local = getLocalDatabase();
    local.videos = local.videos.filter((v) => v.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Gallery Albums
  async getAlbums(onlyPublished = true): Promise<GalleryAlbum[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      let query = client
        .from('gallery_albums')
        .select('*')
        .order('event_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (onlyPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(toAlbum);
      }
    }

    const items = getLocalDatabase().albums;
    return onlyPublished ? items.filter((a) => a.isPublished) : items;
  },

  async getAlbumById(id: string): Promise<GalleryAlbum | null> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('gallery_albums')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return toAlbum(data);
      }
      return null;
    }

    return getLocalDatabase().albums.find((a) => a.id === id) || null;
  },

  async createAlbum(album: Omit<GalleryAlbum, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryAlbum> {
    const id = `alb_${Date.now()}`;
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        id,
        ...toAlbumRow(album),
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await client.from('gallery_albums').insert(row).select('*').single();
      if (!error && data) {
        return toAlbum(data);
      }
      throw new Error(`Failed to create gallery album in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    const newAlb: GalleryAlbum = {
      ...album,
      id,
      createdAt: now,
      updatedAt: now,
    };
    local.albums.unshift(newAlb);
    saveLocalDatabase(local);
    return newAlb;
  },

  async updateAlbum(id: string, partial: Partial<GalleryAlbum>): Promise<GalleryAlbum | null> {
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        ...toAlbumRow(partial),
        updated_at: now,
      };
      const { data, error } = await client.from('gallery_albums').update(row).eq('id', id).select('*').single();
      if (!error && data) {
        return toAlbum(data);
      }
      return null;
    }

    const local = getLocalDatabase();
    const index = local.albums.findIndex((a) => a.id === id);
    if (index === -1) return null;
    local.albums[index] = {
      ...local.albums[index],
      ...partial,
      updatedAt: now,
    };
    saveLocalDatabase(local);
    return local.albums[index];
  },

  async deleteAlbum(id: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client.from('gallery_albums').delete().eq('id', id);
      return !error;
    }

    const local = getLocalDatabase();
    local.albums = local.albums.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Class Members
  async getMembers(onlyPublished = true): Promise<ClassMember[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      let query = client
        .from('class_members')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });

      if (onlyPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(toMember);
      }
    }

    const items = getLocalDatabase().members;
    const sorted = [...items].sort((a, b) => a.orderIndex - b.orderIndex);
    return onlyPublished ? sorted.filter((m) => m.isPublished) : sorted;
  },

  async getMemberById(id: string): Promise<ClassMember | null> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('class_members')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return toMember(data);
      }
      return null;
    }

    return getLocalDatabase().members.find((m) => m.id === id) || null;
  },

  async createMember(member: Omit<ClassMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClassMember> {
    const id = `mem_${Date.now()}`;
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        id,
        ...toMemberRow(member),
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await client.from('class_members').insert(row).select('*').single();
      if (!error && data) {
        return toMember(data);
      }
      throw new Error(`Failed to create member in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    const newMem: ClassMember = {
      ...member,
      id,
      createdAt: now,
      updatedAt: now,
    };
    local.members.push(newMem);
    saveLocalDatabase(local);
    return newMem;
  },

  async updateMember(id: string, partial: Partial<ClassMember>): Promise<ClassMember | null> {
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        ...toMemberRow(partial),
        updated_at: now,
      };
      const { data, error } = await client.from('class_members').update(row).eq('id', id).select('*').single();
      if (!error && data) {
        return toMember(data);
      }
      return null;
    }

    const local = getLocalDatabase();
    const index = local.members.findIndex((m) => m.id === id);
    if (index === -1) return null;
    local.members[index] = {
      ...local.members[index],
      ...partial,
      updatedAt: now,
    };
    saveLocalDatabase(local);
    return local.members[index];
  },

  async deleteMember(id: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client.from('class_members').delete().eq('id', id);
      return !error;
    }

    const local = getLocalDatabase();
    local.members = local.members.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Achievements
  async getAchievements(onlyPublished = true): Promise<Achievement[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      let query = client
        .from('achievements')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (onlyPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(toAchievement);
      }
    }

    const items = getLocalDatabase().achievements;
    return onlyPublished ? items.filter((a) => a.isPublished) : items;
  },

  async createAchievement(ach: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Achievement> {
    const id = `ach_${Date.now()}`;
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        id,
        ...toAchievementRow(ach),
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await client.from('achievements').insert(row).select('*').single();
      if (!error && data) {
        return toAchievement(data);
      }
      throw new Error(`Failed to create achievement in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    const newAch: Achievement = {
      ...ach,
      id,
      createdAt: now,
      updatedAt: now,
    };
    local.achievements.unshift(newAch);
    saveLocalDatabase(local);
    return newAch;
  },

  async updateAchievement(id: string, partial: Partial<Achievement>): Promise<Achievement | null> {
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        ...toAchievementRow(partial),
        updated_at: now,
      };
      const { data, error } = await client.from('achievements').update(row).eq('id', id).select('*').single();
      if (!error && data) {
        return toAchievement(data);
      }
      return null;
    }

    const local = getLocalDatabase();
    const index = local.achievements.findIndex((a) => a.id === id);
    if (index === -1) return null;
    local.achievements[index] = {
      ...local.achievements[index],
      ...partial,
      updatedAt: now,
    };
    saveLocalDatabase(local);
    return local.achievements[index];
  },

  async deleteAchievement(id: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client.from('achievements').delete().eq('id', id);
      return !error;
    }

    const local = getLocalDatabase();
    local.achievements = local.achievements.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Announcements
  async getAnnouncements(onlyPublished = true): Promise<Announcement[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      let query = client
        .from('announcements')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (onlyPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map(toAnnouncement);
      }
    }

    const items = getLocalDatabase().announcements;
    return onlyPublished ? items.filter((a) => a.isPublished) : items;
  },

  async createAnnouncement(ann: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> {
    const id = `ann_${Date.now()}`;
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        id,
        ...toAnnouncementRow(ann),
        created_at: now,
        updated_at: now,
      };
      const { data, error } = await client.from('announcements').insert(row).select('*').single();
      if (!error && data) {
        return toAnnouncement(data);
      }
      throw new Error(`Failed to create announcement in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    const newAnn: Announcement = {
      ...ann,
      id,
      createdAt: now,
      updatedAt: now,
    };
    local.announcements.unshift(newAnn);
    saveLocalDatabase(local);
    return newAnn;
  },

  async updateAnnouncement(id: string, partial: Partial<Announcement>): Promise<Announcement | null> {
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        ...toAnnouncementRow(partial),
        updated_at: now,
      };
      const { data, error } = await client.from('announcements').update(row).eq('id', id).select('*').single();
      if (!error && data) {
        return toAnnouncement(data);
      }
      return null;
    }

    const local = getLocalDatabase();
    const index = local.announcements.findIndex((a) => a.id === id);
    if (index === -1) return null;
    local.announcements[index] = {
      ...local.announcements[index],
      ...partial,
      updatedAt: now,
    };
    saveLocalDatabase(local);
    return local.announcements[index];
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client.from('announcements').delete().eq('id', id);
      return !error;
    }

    const local = getLocalDatabase();
    local.announcements = local.announcements.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Media Assets
  async getMedia(): Promise<MediaAsset[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(toMedia);
      }
    }

    return getLocalDatabase().media;
  },

  async getMediaById(id: string): Promise<MediaAsset | null> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('media_assets')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return toMedia(data);
      }
      return null;
    }

    return getLocalDatabase().media.find((m) => m.id === id) || null;
  },

  async getMediaUsage(urlOrFilename: string): Promise<{ isUsed: boolean; references: Array<{ section: string; title: string; id: string }> }> {
    const references: Array<{ section: string; title: string; id: string }> = [];
    if (!urlOrFilename) return { isUsed: false, references };

    const target = urlOrFilename.trim();
    const targetFile = target.split('/').pop() || target;

    const matches = (value?: string | null) => {
      if (!value) return false;
      return value === target || value.includes(targetFile);
    };

    const client = getSupabaseAdminClient();
    if (client) {
      const [mags, arts, progs, vids, albs, mems, achs, anns] = await Promise.all([
        client.from('magazines').select('id, title, cover_image, pdf_url'),
        client.from('articles').select('id, title, cover_image, pdf_url, video_url, gallery_images, content'),
        client.from('programs').select('id, title, cover_image, video_url, pdf_url, photos'),
        client.from('videos').select('id, title, thumbnail_url, video_url'),
        client.from('gallery_albums').select('id, title, cover_image, pdf_url, photos, videos'),
        client.from('class_members').select('id, name, photo_url'),
        client.from('achievements').select('id, title, image_url, pdf_url, video_url, photos'),
        client.from('announcements').select('id, title, cover_image, pdf_url, video_url, photos, content'),
      ]);

      mags.data?.forEach((m) => {
        if (matches(m.cover_image) || matches(m.pdf_url)) {
          references.push({ section: 'Magazine', title: m.title, id: m.id });
        }
      });
      arts.data?.forEach((a) => {
        if (
          matches(a.cover_image) ||
          matches(a.pdf_url) ||
          matches(a.video_url) ||
          a.gallery_images?.some(matches) ||
          (a.content && a.content.includes(targetFile))
        ) {
          references.push({ section: 'Newspaper', title: a.title, id: a.id });
        }
      });
      progs.data?.forEach((p) => {
        if (
          matches(p.cover_image) ||
          matches(p.video_url) ||
          matches(p.pdf_url) ||
          p.photos?.some(matches)
        ) {
          references.push({ section: 'Program', title: p.title, id: p.id });
        }
      });
      vids.data?.forEach((v) => {
        if (matches(v.thumbnail_url) || matches(v.video_url)) {
          references.push({ section: 'Video', title: v.title, id: v.id });
        }
      });
      albs.data?.forEach((g) => {
        if (
          matches(g.cover_image) ||
          matches(g.pdf_url) ||
          g.photos?.some((ph: any) => matches(typeof ph === 'string' ? ph : ph?.url)) ||
          g.videos?.some(matches)
        ) {
          references.push({ section: 'Gallery Album', title: g.title, id: g.id });
        }
      });
      mems.data?.forEach((mem) => {
        if (matches(mem.photo_url)) {
          references.push({ section: 'Class Member', title: mem.name, id: mem.id });
        }
      });
      achs.data?.forEach((ach) => {
        if (
          matches(ach.image_url) ||
          matches(ach.pdf_url) ||
          matches(ach.video_url) ||
          ach.photos?.some(matches)
        ) {
          references.push({ section: 'Achievement', title: ach.title, id: ach.id });
        }
      });
      anns.data?.forEach((ann) => {
        if (
          matches(ann.cover_image) ||
          matches(ann.pdf_url) ||
          matches(ann.video_url) ||
          ann.photos?.some(matches) ||
          (ann.content && ann.content.includes(targetFile))
        ) {
          references.push({ section: 'Announcement', title: ann.title, id: ann.id });
        }
      });

      return {
        isUsed: references.length > 0,
        references,
      };
    }

    const data = getLocalDatabase();
    data.magazines?.forEach((m) => {
      if (matches(m.coverImage) || matches(m.pdfUrl)) {
        references.push({ section: 'Magazine', title: m.title, id: m.id });
      }
    });
    data.articles?.forEach((a) => {
      if (
        matches(a.coverImage) ||
        matches(a.pdfUrl) ||
        matches(a.videoUrl) ||
        a.galleryImages?.some(matches) ||
        (a.content && a.content.includes(targetFile))
      ) {
        references.push({ section: 'Newspaper', title: a.title, id: a.id });
      }
    });

    return {
      isUsed: references.length > 0,
      references,
    };
  },

  async createMedia(media: Omit<MediaAsset, 'id' | 'createdAt'>): Promise<MediaAsset> {
    const id = `med_${Date.now()}`;
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        id,
        ...toMediaRow(media),
        created_at: now,
      };
      const { data, error } = await client.from('media_assets').insert(row).select('*').single();
      if (!error && data) {
        return toMedia(data);
      }
      throw new Error(`Failed to create media record in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    const newMed: MediaAsset = {
      ...media,
      id,
      createdAt: now,
    };
    local.media.unshift(newMed);
    saveLocalDatabase(local);
    return newMed;
  },

  async deleteMedia(id: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client.from('media_assets').delete().eq('id', id);
      return !error;
    }

    const local = getLocalDatabase();
    local.media = local.media.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Contact Messages
  async getMessages(): Promise<ContactMessage[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(toMessage);
      }
    }

    return getLocalDatabase().messages;
  },

  async createMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> {
    const id = `msg_${Date.now()}`;
    const now = new Date().toISOString();
    const client = getSupabaseAdminClient();

    if (client) {
      const row = {
        id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        status: 'unread',
        created_at: now,
      };
      const { data, error } = await client.from('contact_messages').insert(row).select('*').single();
      if (!error && data) {
        return toMessage(data);
      }
      throw new Error(`Failed to save message in Supabase: ${error?.message}`);
    }

    const local = getLocalDatabase();
    const newMsg: ContactMessage = {
      ...msg,
      id,
      status: 'unread',
      createdAt: now,
    };
    local.messages.unshift(newMsg);
    saveLocalDatabase(local);
    return newMsg;
  },

  async deleteMessage(id: string): Promise<boolean> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { error } = await client.from('contact_messages').delete().eq('id', id);
      return !error;
    }

    const local = getLocalDatabase();
    local.messages = local.messages.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // ---------------------------------------------------------------------------
  // Class Finance System (Private & Administrator Controlled)
  // ---------------------------------------------------------------------------

  async getFinanceSummary(): Promise<FinanceSummary> {
    const client = getSupabaseAdminClient();
    if (client) {
      const [{ data: sumData }, { count }] = await Promise.all([
        client.from('finance_summary').select('*').eq('id', 'default').maybeSingle(),
        client.from('finance_transactions').select('*', { count: 'exact', head: true }),
      ]);

      if (sumData) {
        return toFinanceSummary(sumData, count || 0);
      }
    }

    const local = getLocalDatabase();
    return {
      currency: local.finance.currency,
      currencySymbol: local.finance.currencySymbol,
      openingBalance: local.finance.openingBalance,
      currentBalance: local.finance.currentBalance,
      totalIncome: local.finance.totalIncome,
      totalExpenses: local.finance.totalExpenses,
      transactionCount: local.finance.transactions.length,
      setupDate: local.finance.setupDate,
      lastUpdated: local.finance.lastUpdated,
    };
  },

  async getFinanceTransactions(filters?: {
    type?: TransactionType;
    category?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<FinanceTransaction[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      let query = client
        .from('finance_transactions')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }

      const { data, error } = await query;
      if (!error && data) {
        let results = data.map(toFinanceTransaction);
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(
            (t) =>
              t.description.toLowerCase().includes(q) ||
              t.counterparty.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q) ||
              t.id.toLowerCase().includes(q)
          );
        }
        return results;
      }
    }

    const local = getLocalDatabase();
    let txs = [...local.finance.transactions];
    if (filters?.type) txs = txs.filter((t) => t.type === filters.type);
    if (filters?.category && filters.category !== 'all') txs = txs.filter((t) => t.category === filters.category);
    if (filters?.startDate) txs = txs.filter((t) => t.date >= filters.startDate!);
    if (filters?.endDate) txs = txs.filter((t) => t.date <= filters.endDate!);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.counterparty.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    return txs;
  },

  async getFinanceTransactionById(id: string): Promise<FinanceTransaction | null> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('finance_transactions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return toFinanceTransaction(data);
      }
      return null;
    }

    const local = getLocalDatabase();
    return local.finance.transactions.find((t) => t.id === id) || null;
  },

  async createFinanceTransaction(
    tx: Omit<FinanceTransaction, 'id' | 'balanceAfter' | 'createdAt' | 'updatedAt'>
  ): Promise<{ transaction: FinanceTransaction; summary: FinanceSummary }> {
    const client = getSupabaseAdminClient();
    if (client) {
      // 1. Fetch current summary and all transactions to compute running balances
      const [{ data: summaryRow }, { data: allTxs }] = await Promise.all([
        client.from('finance_summary').select('*').eq('id', 'default').single(),
        client.from('finance_transactions').select('*').order('date', { ascending: true }).order('created_at', { ascending: true }),
      ]);

      const openingBalance = Number(summaryRow?.opening_balance ?? 1100);
      const nextCount = (allTxs?.length || 0) + 1;
      const txId = `TXN-${String(nextCount).padStart(3, '0')}`;
      const now = new Date().toISOString();
      const amount = Number(tx.amount);

      // Insert new transaction row
      const newRow = {
        id: txId,
        type: tx.type,
        category: tx.category,
        amount,
        date: tx.date,
        counterparty: tx.counterparty,
        description: tx.description,
        notes: tx.notes || null,
        receipt_url: tx.receiptUrl || null,
        balance_after: 0, // Recalculated below
        added_by: tx.addedBy || 'admin',
        created_at: now,
        updated_at: now,
      };

      await client.from('finance_transactions').insert(newRow);

      // Recompute all running balances chronologically
      const { data: updatedTxs } = await client
        .from('finance_transactions')
        .select('*')
        .order('date', { ascending: true })
        .order('created_at', { ascending: true });

      let running = openingBalance;
      let totalIncome = 0;
      let totalExpenses = 0;

      if (updatedTxs) {
        for (const item of updatedTxs) {
          const itemAmt = Number(item.amount);
          if (item.type === 'income') {
            running += itemAmt;
            totalIncome += itemAmt;
          } else {
            running -= itemAmt;
            totalExpenses += itemAmt;
          }
          if (item.balance_after !== running) {
            await client.from('finance_transactions').update({ balance_after: running }).eq('id', item.id);
          }
        }
      }

      // Update summary row
      await client
        .from('finance_summary')
        .update({
          current_balance: running,
          total_income: totalIncome,
          total_expenses: totalExpenses,
          last_updated: now,
        })
        .eq('id', 'default');

      // Record audit log
      await client.from('finance_audit_logs').insert({
        id: `audit_${Date.now()}`,
        action: 'create',
        transaction_id: txId,
        details: `Recorded ${tx.type.toUpperCase()}: ₹${amount.toLocaleString('en-IN')} (${tx.category}) - ${tx.description}`,
        performed_by: tx.addedBy || 'admin',
        timestamp: now,
      });

      const savedTx = await this.getFinanceTransactionById(txId);
      const updatedSummary = await this.getFinanceSummary();
      return {
        transaction: savedTx!,
        summary: updatedSummary,
      };
    }

    // Local fallback
    const local = getLocalDatabase();
    const count = local.finance.transactions.length + 1;
    const txId = `TXN-${String(count).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newTx: FinanceTransaction = {
      ...tx,
      id: txId,
      amount: Number(tx.amount),
      balanceAfter: 0,
      createdAt: now,
      updatedAt: now,
    };
    local.finance.transactions.unshift(newTx);
    local.finance.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'create',
      transactionId: txId,
      details: `Recorded ${tx.type.toUpperCase()}: ₹${Number(tx.amount).toLocaleString('en-IN')} (${tx.category}) - ${tx.description}`,
      performedBy: tx.addedBy || 'admin',
      timestamp: now,
    });

    let running = local.finance.openingBalance;
    let income = 0;
    let expenses = 0;
    const sorted = [...local.finance.transactions].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
    for (const t of sorted) {
      if (t.type === 'income') {
        running += t.amount;
        income += t.amount;
      } else {
        running -= t.amount;
        expenses += t.amount;
      }
      t.balanceAfter = running;
    }
    local.finance.currentBalance = running;
    local.finance.totalIncome = income;
    local.finance.totalExpenses = expenses;
    local.finance.lastUpdated = now;
    saveLocalDatabase(local);

    return {
      transaction: local.finance.transactions.find((t) => t.id === txId)!,
      summary: await this.getFinanceSummary(),
    };
  },

  async updateFinanceTransaction(
    id: string,
    partial: Partial<Omit<FinanceTransaction, 'id' | 'balanceAfter' | 'createdAt' | 'updatedAt'>>,
    performedBy = 'admin'
  ): Promise<{ transaction: FinanceTransaction | null; summary: FinanceSummary }> {
    const client = getSupabaseAdminClient();
    if (client) {
      const now = new Date().toISOString();
      const updateData: any = { updated_at: now };
      if (partial.type !== undefined) updateData.type = partial.type;
      if (partial.category !== undefined) updateData.category = partial.category;
      if (partial.amount !== undefined) updateData.amount = Number(partial.amount);
      if (partial.date !== undefined) updateData.date = partial.date;
      if (partial.counterparty !== undefined) updateData.counterparty = partial.counterparty;
      if (partial.description !== undefined) updateData.description = partial.description;
      if (partial.notes !== undefined) updateData.notes = partial.notes;
      if (partial.receiptUrl !== undefined) updateData.receipt_url = partial.receiptUrl;

      await client.from('finance_transactions').update(updateData).eq('id', id);

      // Recompute running balances
      const [{ data: summaryRow }, { data: updatedTxs }] = await Promise.all([
        client.from('finance_summary').select('*').eq('id', 'default').single(),
        client.from('finance_transactions').select('*').order('date', { ascending: true }).order('created_at', { ascending: true }),
      ]);

      const openingBalance = Number(summaryRow?.opening_balance ?? 1100);
      let running = openingBalance;
      let totalIncome = 0;
      let totalExpenses = 0;

      if (updatedTxs) {
        for (const item of updatedTxs) {
          const itemAmt = Number(item.amount);
          if (item.type === 'income') {
            running += itemAmt;
            totalIncome += itemAmt;
          } else {
            running -= itemAmt;
            totalExpenses += itemAmt;
          }
          if (item.balance_after !== running) {
            await client.from('finance_transactions').update({ balance_after: running }).eq('id', item.id);
          }
        }
      }

      await client
        .from('finance_summary')
        .update({
          current_balance: running,
          total_income: totalIncome,
          total_expenses: totalExpenses,
          last_updated: now,
        })
        .eq('id', 'default');

      await client.from('finance_audit_logs').insert({
        id: `audit_${Date.now()}`,
        action: 'update',
        transaction_id: id,
        details: `Updated ${id}: category ${partial.category || 'unchanged'}`,
        performed_by: performedBy,
        timestamp: now,
      });

      const updatedTx = await this.getFinanceTransactionById(id);
      const summary = await this.getFinanceSummary();
      return { transaction: updatedTx, summary };
    }

    // Local fallback
    const local = getLocalDatabase();
    const index = local.finance.transactions.findIndex((t) => t.id === id);
    if (index === -1) return { transaction: null, summary: await this.getFinanceSummary() };

    const oldTx = local.finance.transactions[index];
    const now = new Date().toISOString();
    local.finance.transactions[index] = {
      ...oldTx,
      ...partial,
      amount: partial.amount !== undefined ? Number(partial.amount) : oldTx.amount,
      updatedAt: now,
    };
    saveLocalDatabase(local);
    return {
      transaction: local.finance.transactions[index],
      summary: await this.getFinanceSummary(),
    };
  },

  async deleteFinanceTransaction(
    id: string,
    performedBy = 'admin'
  ): Promise<{ success: boolean; summary: FinanceSummary }> {
    const client = getSupabaseAdminClient();
    if (client) {
      const now = new Date().toISOString();
      await client.from('finance_transactions').delete().eq('id', id);

      const [{ data: summaryRow }, { data: updatedTxs }] = await Promise.all([
        client.from('finance_summary').select('*').eq('id', 'default').single(),
        client.from('finance_transactions').select('*').order('date', { ascending: true }).order('created_at', { ascending: true }),
      ]);

      const openingBalance = Number(summaryRow?.opening_balance ?? 1100);
      let running = openingBalance;
      let totalIncome = 0;
      let totalExpenses = 0;

      if (updatedTxs) {
        for (const item of updatedTxs) {
          const itemAmt = Number(item.amount);
          if (item.type === 'income') {
            running += itemAmt;
            totalIncome += itemAmt;
          } else {
            running -= itemAmt;
            totalExpenses += itemAmt;
          }
          if (item.balance_after !== running) {
            await client.from('finance_transactions').update({ balance_after: running }).eq('id', item.id);
          }
        }
      }

      await client
        .from('finance_summary')
        .update({
          current_balance: running,
          total_income: totalIncome,
          total_expenses: totalExpenses,
          last_updated: now,
        })
        .eq('id', 'default');

      await client.from('finance_audit_logs').insert({
        id: `audit_${Date.now()}`,
        action: 'delete',
        transaction_id: id,
        details: `Deleted transaction ${id}`,
        performed_by: performedBy,
        timestamp: now,
      });

      const summary = await this.getFinanceSummary();
      return { success: true, summary };
    }

    const local = getLocalDatabase();
    local.finance.transactions = local.finance.transactions.filter((t) => t.id !== id);
    saveLocalDatabase(local);
    return { success: true, summary: await this.getFinanceSummary() };
  },

  async getFinanceAuditLogs(): Promise<FinanceAuditLog[]> {
    const client = getSupabaseAdminClient();
    if (client) {
      const { data, error } = await client
        .from('finance_audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (!error && data) {
        return data.map(toFinanceAuditLog);
      }
    }

    return getLocalDatabase().finance.auditLogs || [];
  },
};
