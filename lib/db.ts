import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  isFirestoreActive,
  getFirestoreSettings,
  saveFirestoreSettings,
  getFirestoreAdminUser,
  getFirestoreAdminUsers,
  updateFirestoreAdminUser,
  getFirestoreMagazines,
  getFirestoreMagazineById,
  saveFirestoreMagazine,
  deleteFirestoreMagazine,
  getFirestoreArticles,
  getFirestoreArticleById,
  getFirestoreArticleBySlug,
  saveFirestoreArticle,
  deleteFirestoreArticle,
  getFirestorePrograms,
  getFirestoreProgramById,
  saveFirestoreProgram,
  deleteFirestoreProgram,
  getFirestoreVideos,
  getFirestoreVideoById,
  saveFirestoreVideo,
  deleteFirestoreVideo,
  getFirestoreAlbums,
  getFirestoreAlbumById,
  saveFirestoreAlbum,
  deleteFirestoreAlbum,
  getFirestoreMembers,
  getFirestoreMemberById,
  saveFirestoreMember,
  deleteFirestoreMember,
  getFirestoreAchievements,
  getFirestoreAchievementById,
  saveFirestoreAchievement,
  deleteFirestoreAchievement,
  getFirestoreAnnouncements,
  getFirestoreAnnouncementById,
  saveFirestoreAnnouncement,
  deleteFirestoreAnnouncement,
  getFirestoreMedia,
  getFirestoreMediaById,
  saveFirestoreMedia,
  deleteFirestoreMedia,
  getFirestoreMessages,
  saveFirestoreMessage,
  deleteFirestoreMessage,
  getFirestoreFinanceSummary,
  getFirestoreFinanceTransactions,
  getFirestoreFinanceTransactionById,
  getFirestoreFinanceAuditLogs,
  saveFirestoreFinanceSummary,
  saveFirestoreFinanceTransaction,
  deleteFirestoreFinanceTransaction,
  saveFirestoreFinanceAuditLog,
} from './firebase/firestore-admin';
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

function getLocalDatabase(): DatabaseSchema {
  if (memoryCache) return memoryCache;

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
  if (isServerless) return;

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
// Database Operations (Firebase Cloud Firestore with Local Fallback)
// -----------------------------------------------------------------------------

export const db = {
  // Settings
  async getSettings(): Promise<WebsiteSettings> {
    if (isFirestoreActive()) {
      const fsSettings = await getFirestoreSettings();
      if (fsSettings) return fsSettings;
    }
    return getLocalDatabase().settings;
  },

  async updateSettings(partial: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    if (isFirestoreActive()) {
      const saved = await saveFirestoreSettings(partial);
      if (saved) return saved;
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
    if (isFirestoreActive()) {
      const u = await getFirestoreAdminUser(username);
      if (u) return u;
    }
    const local = getLocalDatabase();
    return local.adminUsers.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  async updateAdminPassword(userId: string, newPasswordHash: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await updateFirestoreAdminUser(userId, { passwordHash: newPasswordHash });
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
    if (isFirestoreActive()) {
      const items = await getFirestoreMagazines();
      if (items.length > 0) {
        const sorted = items.sort((a, b) => new Date(b.publicationDate || b.createdAt).getTime() - new Date(a.publicationDate || a.createdAt).getTime());
        return onlyPublished ? sorted.filter((m) => m.isPublished) : sorted;
      }
    }
    const items = getLocalDatabase().magazines;
    return onlyPublished ? items.filter((m) => m.isPublished) : items;
  },

  async getMagazineById(id: string): Promise<Magazine | null> {
    if (isFirestoreActive()) {
      const m = await getFirestoreMagazineById(id);
      if (m) return m;
    }
    return getLocalDatabase().magazines.find((m) => m.id === id) || null;
  },

  async createMagazine(magazine: Omit<Magazine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Magazine> {
    const id = `mag_${Date.now()}`;
    const now = new Date().toISOString();
    const newMag: Magazine = {
      ...magazine,
      id,
      createdAt: now,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreMagazine(newMag);
    }
    const local = getLocalDatabase();
    local.magazines.unshift(newMag);
    saveLocalDatabase(local);
    return newMag;
  },

  async updateMagazine(id: string, partial: Partial<Magazine>): Promise<Magazine | null> {
    const now = new Date().toISOString();
    const existing = await this.getMagazineById(id);
    if (!existing) return null;
    const updated: Magazine = {
      ...existing,
      ...partial,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreMagazine(updated);
    }
    const local = getLocalDatabase();
    const idx = local.magazines.findIndex((m) => m.id === id);
    if (idx !== -1) {
      local.magazines[idx] = updated;
      saveLocalDatabase(local);
    }
    return updated;
  },

  async deleteMagazine(id: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await deleteFirestoreMagazine(id);
    }
    const local = getLocalDatabase();
    local.magazines = local.magazines.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Articles / Newspaper
  async getArticles(onlyPublished = true): Promise<Article[]> {
    if (isFirestoreActive()) {
      const items = await getFirestoreArticles();
      if (items.length > 0) {
        const sorted = items.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
        return onlyPublished ? sorted.filter((a) => a.isPublished) : sorted;
      }
    }
    const items = getLocalDatabase().articles;
    return onlyPublished ? items.filter((a) => a.isPublished) : items;
  },

  async getArticleById(id: string): Promise<Article | null> {
    if (isFirestoreActive()) {
      const a = await getFirestoreArticleById(id);
      if (a) return a;
    }
    return getLocalDatabase().articles.find((a) => a.id === id) || null;
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (isFirestoreActive()) {
      const a = await getFirestoreArticleBySlug(slug);
      if (a) return a;
    }
    return getLocalDatabase().articles.find((a) => a.slug === slug) || null;
  },

  async getArticleBySlugOrId(idOrSlug: string): Promise<Article | null> {
    const byId = await this.getArticleById(idOrSlug);
    if (byId) return byId;
    return this.getArticleBySlug(idOrSlug);
  },

  async incrementArticleView(id: string): Promise<void> {
    const existing = await this.getArticleById(id);
    if (existing) {
      await this.updateArticle(id, { viewCount: (existing.viewCount || 0) + 1 });
    }
  },

  async createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
    const id = `art_${Date.now()}`;
    const now = new Date().toISOString();
    const newArt: Article = {
      ...article,
      id,
      createdAt: now,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreArticle(newArt);
    }
    const local = getLocalDatabase();
    local.articles.unshift(newArt);
    saveLocalDatabase(local);
    return newArt;
  },

  async updateArticle(id: string, partial: Partial<Article>): Promise<Article | null> {
    const now = new Date().toISOString();
    const existing = await this.getArticleById(id);
    if (!existing) return null;
    const updated: Article = {
      ...existing,
      ...partial,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreArticle(updated);
    }
    const local = getLocalDatabase();
    const idx = local.articles.findIndex((a) => a.id === id);
    if (idx !== -1) {
      local.articles[idx] = updated;
      saveLocalDatabase(local);
    }
    return updated;
  },

  async deleteArticle(id: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await deleteFirestoreArticle(id);
    }
    const local = getLocalDatabase();
    local.articles = local.articles.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Programs
  async getPrograms(onlyPublished = false): Promise<Program[]> {
    let items: Program[] = [];
    if (isFirestoreActive()) {
      items = await getFirestorePrograms();
    }
    if (items.length === 0) {
      items = getLocalDatabase().programs;
    }
    const sorted = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return onlyPublished ? sorted.filter((p) => p.isPublished) : sorted;
  },

  async getProgramById(id: string): Promise<Program | null> {
    if (isFirestoreActive()) {
      const p = await getFirestoreProgramById(id);
      if (p) return p;
    }
    return getLocalDatabase().programs.find((p) => p.id === id) || null;
  },

  async createProgram(program: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program> {
    const id = `prog_${Date.now()}`;
    const now = new Date().toISOString();
    const newProg: Program = {
      ...program,
      id,
      createdAt: now,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreProgram(newProg);
    }
    const local = getLocalDatabase();
    local.programs.unshift(newProg);
    saveLocalDatabase(local);
    return newProg;
  },

  async updateProgram(id: string, partial: Partial<Program>): Promise<Program | null> {
    const now = new Date().toISOString();
    const existing = await this.getProgramById(id);
    if (!existing) return null;
    const updated: Program = {
      ...existing,
      ...partial,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreProgram(updated);
    }
    const local = getLocalDatabase();
    const idx = local.programs.findIndex((p) => p.id === id);
    if (idx !== -1) {
      local.programs[idx] = updated;
      saveLocalDatabase(local);
    }
    return updated;
  },

  async deleteProgram(id: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await deleteFirestoreProgram(id);
    }
    const local = getLocalDatabase();
    local.programs = local.programs.filter((p) => p.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Videos
  async getVideos(onlyPublished = false): Promise<VideoItem[]> {
    let items: VideoItem[] = [];
    if (isFirestoreActive()) {
      items = await getFirestoreVideos();
    }
    if (items.length === 0) {
      items = getLocalDatabase().videos;
    }
    const sorted = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return onlyPublished ? sorted.filter((v) => v.isPublished) : sorted;
  },

  async getVideoById(id: string): Promise<VideoItem | null> {
    if (isFirestoreActive()) {
      const v = await getFirestoreVideoById(id);
      if (v) return v;
    }
    return getLocalDatabase().videos.find((v) => v.id === id) || null;
  },

  async createVideo(video: Omit<VideoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<VideoItem> {
    const id = `vid_${Date.now()}`;
    const now = new Date().toISOString();
    const newVid: VideoItem = {
      ...video,
      id,
      createdAt: now,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreVideo(newVid);
    }
    const local = getLocalDatabase();
    local.videos.unshift(newVid);
    saveLocalDatabase(local);
    return newVid;
  },

  async updateVideo(id: string, partial: Partial<VideoItem>): Promise<VideoItem | null> {
    const now = new Date().toISOString();
    const existing = await this.getVideoById(id);
    if (!existing) return null;
    const updated: VideoItem = {
      ...existing,
      ...partial,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreVideo(updated);
    }
    const local = getLocalDatabase();
    const idx = local.videos.findIndex((v) => v.id === id);
    if (idx !== -1) {
      local.videos[idx] = updated;
      saveLocalDatabase(local);
    }
    return updated;
  },

  async deleteVideo(id: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await deleteFirestoreVideo(id);
    }
    const local = getLocalDatabase();
    local.videos = local.videos.filter((v) => v.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Gallery Albums
  async getAlbums(onlyPublished = false): Promise<GalleryAlbum[]> {
    let items: GalleryAlbum[] = [];
    if (isFirestoreActive()) {
      items = await getFirestoreAlbums();
    }
    if (items.length === 0) {
      items = getLocalDatabase().albums;
    }
    const sorted = items.sort((a, b) => new Date(b.eventDate || b.createdAt).getTime() - new Date(a.eventDate || a.createdAt).getTime());
    return onlyPublished ? sorted.filter((a) => a.isPublished) : sorted;
  },

  async getAlbumById(id: string): Promise<GalleryAlbum | null> {
    if (isFirestoreActive()) {
      const a = await getFirestoreAlbumById(id);
      if (a) return a;
    }
    return getLocalDatabase().albums.find((a) => a.id === id) || null;
  },

  async createAlbum(album: Omit<GalleryAlbum, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryAlbum> {
    const id = `alb_${Date.now()}`;
    const now = new Date().toISOString();
    const newAlb: GalleryAlbum = {
      ...album,
      id,
      createdAt: now,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreAlbum(newAlb);
    }
    const local = getLocalDatabase();
    local.albums.unshift(newAlb);
    saveLocalDatabase(local);
    return newAlb;
  },

  async updateAlbum(id: string, partial: Partial<GalleryAlbum>): Promise<GalleryAlbum | null> {
    const now = new Date().toISOString();
    const existing = await this.getAlbumById(id);
    if (!existing) return null;
    const updated: GalleryAlbum = {
      ...existing,
      ...partial,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreAlbum(updated);
    }
    const local = getLocalDatabase();
    const idx = local.albums.findIndex((a) => a.id === id);
    if (idx !== -1) {
      local.albums[idx] = updated;
      saveLocalDatabase(local);
    }
    return updated;
  },

  async deleteAlbum(id: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await deleteFirestoreAlbum(id);
    }
    const local = getLocalDatabase();
    local.albums = local.albums.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Class Members
  async getMembers(onlyPublished = false): Promise<ClassMember[]> {
    let items: ClassMember[] = [];
    if (isFirestoreActive()) {
      items = await getFirestoreMembers();
    }
    if (items.length === 0) {
      items = getLocalDatabase().members;
    }
    const sorted = items.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    return onlyPublished ? sorted.filter((m) => m.isPublished) : sorted;
  },

  async getMemberById(id: string): Promise<ClassMember | null> {
    if (isFirestoreActive()) {
      const m = await getFirestoreMemberById(id);
      if (m) return m;
    }
    return getLocalDatabase().members.find((m) => m.id === id) || null;
  },

  async createMember(member: Omit<ClassMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClassMember> {
    const id = `mem_${Date.now()}`;
    const now = new Date().toISOString();
    const newMem: ClassMember = {
      ...member,
      id,
      createdAt: now,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreMember(newMem);
    }
    const local = getLocalDatabase();
    local.members.push(newMem);
    saveLocalDatabase(local);
    return newMem;
  },

  async updateMember(id: string, partial: Partial<ClassMember>): Promise<ClassMember | null> {
    const now = new Date().toISOString();
    const existing = await this.getMemberById(id);
    if (!existing) return null;
    const updated: ClassMember = {
      ...existing,
      ...partial,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreMember(updated);
    }
    const local = getLocalDatabase();
    const idx = local.members.findIndex((m) => m.id === id);
    if (idx !== -1) {
      local.members[idx] = updated;
      saveLocalDatabase(local);
    }
    return updated;
  },

  async deleteMember(id: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await deleteFirestoreMember(id);
    }
    const local = getLocalDatabase();
    local.members = local.members.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Achievements
  async getAchievements(onlyPublished = false): Promise<Achievement[]> {
    let items: Achievement[] = [];
    if (isFirestoreActive()) {
      items = await getFirestoreAchievements();
    }
    if (items.length === 0) {
      items = getLocalDatabase().achievements;
    }
    const sorted = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return onlyPublished ? sorted.filter((a) => a.isPublished) : sorted;
  },

  async getAchievementById(id: string): Promise<Achievement | null> {
    if (isFirestoreActive()) {
      const a = await getFirestoreAchievementById(id);
      if (a) return a;
    }
    return getLocalDatabase().achievements.find((a) => a.id === id) || null;
  },

  async createAchievement(achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Achievement> {
    const id = `ach_${Date.now()}`;
    const now = new Date().toISOString();
    const newAch: Achievement = {
      ...achievement,
      id,
      createdAt: now,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreAchievement(newAch);
    }
    const local = getLocalDatabase();
    local.achievements.unshift(newAch);
    saveLocalDatabase(local);
    return newAch;
  },

  async updateAchievement(id: string, partial: Partial<Achievement>): Promise<Achievement | null> {
    const now = new Date().toISOString();
    const existing = await this.getAchievementById(id);
    if (!existing) return null;
    const updated: Achievement = {
      ...existing,
      ...partial,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreAchievement(updated);
    }
    const local = getLocalDatabase();
    const idx = local.achievements.findIndex((a) => a.id === id);
    if (idx !== -1) {
      local.achievements[idx] = updated;
      saveLocalDatabase(local);
    }
    return updated;
  },

  async deleteAchievement(id: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await deleteFirestoreAchievement(id);
    }
    const local = getLocalDatabase();
    local.achievements = local.achievements.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Announcements
  async getAnnouncements(onlyPublished = false): Promise<Announcement[]> {
    let items: Announcement[] = [];
    if (isFirestoreActive()) {
      items = await getFirestoreAnnouncements();
    }
    if (items.length === 0) {
      items = getLocalDatabase().announcements;
    }
    const sorted = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return onlyPublished ? sorted.filter((a) => a.isPublished) : sorted;
  },

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    if (isFirestoreActive()) {
      const a = await getFirestoreAnnouncementById(id);
      if (a) return a;
    }
    return getLocalDatabase().announcements.find((a) => a.id === id) || null;
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> {
    const id = `ann_${Date.now()}`;
    const now = new Date().toISOString();
    const newAnn: Announcement = {
      ...announcement,
      id,
      createdAt: now,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreAnnouncement(newAnn);
    }
    const local = getLocalDatabase();
    local.announcements.unshift(newAnn);
    saveLocalDatabase(local);
    return newAnn;
  },

  async updateAnnouncement(id: string, partial: Partial<Announcement>): Promise<Announcement | null> {
    const now = new Date().toISOString();
    const existing = await this.getAnnouncementById(id);
    if (!existing) return null;
    const updated: Announcement = {
      ...existing,
      ...partial,
      updatedAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreAnnouncement(updated);
    }
    const local = getLocalDatabase();
    const idx = local.announcements.findIndex((a) => a.id === id);
    if (idx !== -1) {
      local.announcements[idx] = updated;
      saveLocalDatabase(local);
    }
    return updated;
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await deleteFirestoreAnnouncement(id);
    }
    const local = getLocalDatabase();
    local.announcements = local.announcements.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Media Assets
  async getMedia(): Promise<MediaAsset[]> {
    if (isFirestoreActive()) {
      const items = await getFirestoreMedia();
      if (items.length > 0) return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return getLocalDatabase().media;
  },

  async getMediaById(id: string): Promise<MediaAsset | null> {
    if (isFirestoreActive()) {
      const m = await getFirestoreMediaById(id);
      if (m) return m;
    }
    return getLocalDatabase().media.find((m) => m.id === id) || null;
  },

  async createMedia(media: Omit<MediaAsset, 'id' | 'createdAt'>): Promise<MediaAsset> {
    const id = `med_${Date.now()}`;
    const now = new Date().toISOString();
    const newMed: MediaAsset = {
      ...media,
      id,
      storageLocation: media.storageLocation || 'firebase',
      createdAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreMedia(newMed);
    }
    const local = getLocalDatabase();
    local.media.unshift(newMed);
    saveLocalDatabase(local);
    return newMed;
  },

  async deleteMedia(id: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await deleteFirestoreMedia(id);
    }
    const local = getLocalDatabase();
    local.media = local.media.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
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
    data.programs?.forEach((p) => {
      if (
        matches(p.coverImage) ||
        matches(p.videoUrl) ||
        matches(p.pdfUrl) ||
        p.photos?.some(matches)
      ) {
        references.push({ section: 'Program', title: p.title, id: p.id });
      }
    });
    data.videos?.forEach((v) => {
      if (matches(v.thumbnailUrl) || matches(v.videoUrl)) {
        references.push({ section: 'Video', title: v.title, id: v.id });
      }
    });
    data.albums?.forEach((g) => {
      if (
        matches(g.coverImage) ||
        matches(g.pdfUrl) ||
        g.photos?.some((ph: any) => matches(typeof ph === 'string' ? ph : ph?.url)) ||
        g.videos?.some(matches)
      ) {
        references.push({ section: 'Gallery Album', title: g.title, id: g.id });
      }
    });
    data.members?.forEach((mem) => {
      if (matches(mem.photoUrl)) {
        references.push({ section: 'Class Member', title: mem.name, id: mem.id });
      }
    });
    data.achievements?.forEach((ach) => {
      if (
        matches(ach.imageUrl) ||
        matches(ach.pdfUrl) ||
        matches(ach.videoUrl) ||
        ach.photos?.some(matches)
      ) {
        references.push({ section: 'Achievement', title: ach.title, id: ach.id });
      }
    });
    data.announcements?.forEach((ann) => {
      if (
        matches(ann.coverImage) ||
        matches(ann.pdfUrl) ||
        matches(ann.videoUrl) ||
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
  },

  // Contact Messages
  async getMessages(): Promise<ContactMessage[]> {
    if (isFirestoreActive()) {
      const items = await getFirestoreMessages();
      if (items.length > 0) return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return getLocalDatabase().messages;
  },

  async createMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<ContactMessage> {
    const id = `msg_${Date.now()}`;
    const now = new Date().toISOString();
    const newMsg: ContactMessage = {
      ...msg,
      id,
      status: 'unread',
      createdAt: now,
    };
    if (isFirestoreActive()) {
      await saveFirestoreMessage(newMsg);
    }
    const local = getLocalDatabase();
    local.messages.unshift(newMsg);
    saveLocalDatabase(local);
    return newMsg;
  },

  async deleteMessage(id: string): Promise<boolean> {
    if (isFirestoreActive()) {
      await deleteFirestoreMessage(id);
    }
    const local = getLocalDatabase();
    local.messages = local.messages.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Finance System (Private & Administrator Controlled)
  async getFinanceSummary(): Promise<FinanceSummary> {
    if (isFirestoreActive()) {
      const summary = await getFirestoreFinanceSummary();
      const txs = await getFirestoreFinanceTransactions();
      if (summary) {
        return {
          ...summary,
          transactionCount: txs.length,
        };
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
    let txs: FinanceTransaction[] = [];
    if (isFirestoreActive()) {
      txs = await getFirestoreFinanceTransactions();
    }
    if (txs.length === 0) {
      txs = [...getLocalDatabase().finance.transactions];
    }
    if (filters?.type) txs = txs.filter((t) => t.type === filters.type);
    if (filters?.category && filters.category !== 'all') txs = txs.filter((t) => t.category === filters.category);
    if (filters?.startDate) txs = txs.filter((t) => t.date >= filters.startDate!);
    if (filters?.endDate) txs = txs.filter((t) => t.date <= filters.endDate!);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          (t.counterparty && t.counterparty.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }
    return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getFinanceTransactionById(id: string): Promise<FinanceTransaction | null> {
    if (isFirestoreActive()) {
      const t = await getFirestoreFinanceTransactionById(id);
      if (t) return t;
    }
    return getLocalDatabase().finance.transactions.find((t) => t.id === id) || null;
  },

  async addTransaction(
    tx: Omit<FinanceTransaction, 'id' | 'balanceAfter' | 'createdAt' | 'updatedAt'>,
    adminUsername: string
  ): Promise<FinanceTransaction> {
    const id = `tx_${Date.now()}`;
    const now = new Date().toISOString();
    const local = getLocalDatabase();

    const amount = Number(tx.amount);
    let newBalance = local.finance.currentBalance;
    if (tx.type === 'income') {
      newBalance += amount;
      local.finance.totalIncome += amount;
    } else {
      newBalance -= amount;
      local.finance.totalExpenses += amount;
    }
    local.finance.currentBalance = newBalance;
    local.finance.lastUpdated = now;

    const newTx: FinanceTransaction = {
      ...tx,
      id,
      amount,
      balanceAfter: newBalance,
      createdAt: now,
      updatedAt: now,
    };

    local.finance.transactions.unshift(newTx);

    const auditLog: FinanceAuditLog = {
      id: `log_${Date.now()}`,
      action: 'create',
      transactionId: id,
      performedBy: adminUsername,
      timestamp: now,
      details: `Created ${tx.type} transaction: ${tx.description} for ₹${amount}. Balance: ₹${newBalance}`,
    };
    local.finance.auditLogs.unshift(auditLog);
    saveLocalDatabase(local);

    if (isFirestoreActive()) {
      await saveFirestoreFinanceTransaction(newTx);
      const { transactions, auditLogs, ...summary } = local.finance;
      await saveFirestoreFinanceSummary(summary);
      await saveFirestoreFinanceAuditLog(auditLog);
    }

    return newTx;
  },

  async createFinanceTransaction(
    tx: Omit<FinanceTransaction, 'id' | 'balanceAfter' | 'createdAt' | 'updatedAt'>,
    adminUsername = 'admin'
  ): Promise<{ transaction: FinanceTransaction; summary: FinanceSummary }> {
    const transaction = await this.addTransaction(tx, adminUsername);
    const summary = await this.getFinanceSummary();
    return { transaction, summary };
  },

  async updateTransaction(
    id: string,
    partial: Partial<FinanceTransaction>,
    adminUsername: string
  ): Promise<FinanceTransaction | null> {
    const now = new Date().toISOString();
    const local = getLocalDatabase();
    const idx = local.finance.transactions.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    const existing = local.finance.transactions[idx];
    const updated: FinanceTransaction = {
      ...existing,
      ...partial,
      updatedAt: now,
    };

    // Recalculate balances
    let running = local.finance.openingBalance;
    let income = 0;
    let expenses = 0;
    const sorted = [...local.finance.transactions];
    sorted[idx] = updated;
    sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    local.finance.transactions = sorted.reverse();

    const auditLog: FinanceAuditLog = {
      id: `log_${Date.now()}`,
      action: 'update',
      transactionId: id,
      performedBy: adminUsername,
      timestamp: now,
      details: `Updated transaction ${id}. New balance: ₹${running}`,
    };
    local.finance.auditLogs.unshift(auditLog);
    saveLocalDatabase(local);

    if (isFirestoreActive()) {
      await saveFirestoreFinanceTransaction(updated);
      const { transactions, auditLogs, ...summary } = local.finance;
      await saveFirestoreFinanceSummary(summary);
      await saveFirestoreFinanceAuditLog(auditLog);
    }

    return updated;
  },

  async updateFinanceTransaction(
    id: string,
    partial: Partial<FinanceTransaction>,
    adminUsername: string
  ): Promise<{ transaction: FinanceTransaction | null; summary: FinanceSummary }> {
    const transaction = await this.updateTransaction(id, partial, adminUsername);
    const summary = await this.getFinanceSummary();
    return { transaction, summary };
  },

  async deleteTransaction(id: string, adminUsername: string): Promise<boolean> {
    const now = new Date().toISOString();
    const local = getLocalDatabase();
    const idx = local.finance.transactions.findIndex((t) => t.id === id);
    if (idx === -1) return false;

    const [deleted] = local.finance.transactions.splice(idx, 1);

    // Recalculate balances
    let running = local.finance.openingBalance;
    let income = 0;
    let expenses = 0;
    const sorted = [...local.finance.transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    local.finance.transactions = sorted.reverse();

    const auditLog: FinanceAuditLog = {
      id: `log_${Date.now()}`,
      action: 'delete',
      transactionId: id,
      performedBy: adminUsername,
      timestamp: now,
      details: `Deleted ${deleted.type} transaction ${id} (${deleted.description}). New balance: ₹${running}`,
    };
    local.finance.auditLogs.unshift(auditLog);
    saveLocalDatabase(local);

    if (isFirestoreActive()) {
      await deleteFirestoreFinanceTransaction(id);
      const { transactions, auditLogs, ...summary } = local.finance;
      await saveFirestoreFinanceSummary(summary);
      await saveFirestoreFinanceAuditLog(auditLog);
    }

    return true;
  },

  async deleteFinanceTransaction(
    id: string,
    adminUsername: string
  ): Promise<{ success: boolean; summary: FinanceSummary }> {
    const success = await this.deleteTransaction(id, adminUsername);
    const summary = await this.getFinanceSummary();
    return { success, summary };
  },

  async getFinanceAuditLogs(): Promise<FinanceAuditLog[]> {
    if (isFirestoreActive()) {
      const logs = await getFirestoreFinanceAuditLogs();
      if (logs.length > 0) return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return getLocalDatabase().finance.auditLogs;
  },
};
