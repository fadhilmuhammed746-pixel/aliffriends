import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import defaultSeedData from '../data/af12_database.json';
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
  return JSON.parse(JSON.stringify(defaultSeedData)) as unknown as DatabaseSchema;
}

function getLocalDatabase(): DatabaseSchema {
  if (memoryCache) return memoryCache;

  // In serverless / Vercel, check /tmp/af12_database.json first if mutated
  if (isServerless) {
    try {
      const tmpPath = '/tmp/af12_database.json';
      if (fs.existsSync(tmpPath)) {
        const raw = fs.readFileSync(tmpPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.magazines)) {
          memoryCache = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const seed = defaultSeedData as unknown as DatabaseSchema;
        parsed.settings = parsed.settings || seed.settings;
        parsed.adminUsers = Array.isArray(parsed.adminUsers) && parsed.adminUsers.length > 0 ? parsed.adminUsers : seed.adminUsers;
        parsed.magazines = Array.isArray(parsed.magazines) && parsed.magazines.length > 0 ? parsed.magazines : seed.magazines;
        parsed.articles = Array.isArray(parsed.articles) && parsed.articles.length > 0 ? parsed.articles : seed.articles;
        parsed.programs = Array.isArray(parsed.programs) && parsed.programs.length > 0 ? parsed.programs : seed.programs;
        parsed.videos = Array.isArray(parsed.videos) && parsed.videos.length > 0 ? parsed.videos : seed.videos;
        parsed.albums = Array.isArray(parsed.albums) && parsed.albums.length > 0 ? parsed.albums : seed.albums;
        parsed.members = Array.isArray(parsed.members) && parsed.members.length > 0 ? parsed.members : seed.members;
        parsed.achievements = Array.isArray(parsed.achievements) && parsed.achievements.length > 0 ? parsed.achievements : seed.achievements;
        parsed.announcements = Array.isArray(parsed.announcements) && parsed.announcements.length > 0 ? parsed.announcements : seed.announcements;
        parsed.media = Array.isArray(parsed.media) && parsed.media.length > 0 ? parsed.media : seed.media;
        parsed.messages = Array.isArray(parsed.messages) ? parsed.messages : [];
        parsed.finance = parsed.finance || seed.finance;
        memoryCache = parsed;
        return parsed;
      }
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
  if (isServerless) {
    try {
      fs.writeFileSync('/tmp/af12_database.json', JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // ignore in serverless
    }
    return;
  }

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
    try {
      if (isFirestoreActive()) {
        const fsSettings = await getFirestoreSettings();
        if (fsSettings && fsSettings.siteName) return fsSettings;
      }
    } catch (err) {
      console.warn('getSettings Firestore fallback notice:', err);
    }
    const local = getLocalDatabase();
    return local.settings || (defaultSeedData as unknown as DatabaseSchema).settings;
  },

  async updateSettings(partial: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    try {
      if (isFirestoreActive()) {
        const saved = await saveFirestoreSettings(partial);
        if (saved) return saved;
      }
    } catch (err) {
      console.warn('updateSettings Firestore fallback notice:', err);
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
    try {
      if (isFirestoreActive()) {
        const u = await getFirestoreAdminUser(username);
        if (u) return u;
      }
    } catch (err) {
      console.warn('getAdminByUsername Firestore fallback notice:', err);
    }
    const local = getLocalDatabase();
    return local.adminUsers?.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  async updateAdminPassword(userId: string, newPasswordHash: string): Promise<boolean> {
    try {
      if (isFirestoreActive()) {
        await updateFirestoreAdminUser(userId, { passwordHash: newPasswordHash });
      }
    } catch (err) {
      console.warn('updateAdminPassword Firestore fallback notice:', err);
    }
    const local = getLocalDatabase();
    const admin = local.adminUsers?.find((u) => u.id === userId);
    if (!admin) return false;
    admin.passwordHash = newPasswordHash;
    saveLocalDatabase(local);
    return true;
  },

  // Magazines
  async getMagazines(onlyPublished = true): Promise<Magazine[]> {
    try {
      if (isFirestoreActive()) {
        const items = await getFirestoreMagazines();
        if (items && items.length > 0) {
          const sorted = items.sort((a, b) => new Date(b.publicationDate || b.createdAt).getTime() - new Date(a.publicationDate || a.createdAt).getTime());
          return onlyPublished ? sorted.filter((m) => m.isPublished !== false) : sorted;
        }
      }
    } catch (err) {
      console.warn('getMagazines Firestore fallback notice:', err);
    }
    const items = getLocalDatabase().magazines || [];
    const sorted = [...items].sort((a, b) => new Date(b.publicationDate || b.createdAt).getTime() - new Date(a.publicationDate || a.createdAt).getTime());
    return onlyPublished ? sorted.filter((m) => m.isPublished !== false) : sorted;
  },

  async getMagazineById(id: string): Promise<Magazine | null> {
    try {
      if (isFirestoreActive()) {
        const m = await getFirestoreMagazineById(id);
        if (m) return m;
      }
    } catch (err) {
      console.warn('getMagazineById Firestore fallback notice:', err);
    }
    return getLocalDatabase().magazines?.find((m) => m.id === id) || null;
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreMagazine(newMag);
      }
    } catch (err) {
      console.warn('createMagazine Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreMagazine(updated);
      }
    } catch (err) {
      console.warn('updateMagazine Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await deleteFirestoreMagazine(id);
      }
    } catch (err) {
      console.warn('deleteMagazine Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.magazines = local.magazines.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Articles / Newspaper
  async getArticles(onlyPublished = true): Promise<Article[]> {
    try {
      if (isFirestoreActive()) {
        const items = await getFirestoreArticles();
        if (items && items.length > 0) {
          const sorted = items.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
          return onlyPublished ? sorted.filter((a) => a.isPublished !== false) : sorted;
        }
      }
    } catch (err) {
      console.warn('getArticles Firestore fallback notice:', err);
    }
    const items = getLocalDatabase().articles || [];
    const sorted = [...items].sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
    return onlyPublished ? sorted.filter((a) => a.isPublished !== false) : sorted;
  },

  async getArticleById(id: string): Promise<Article | null> {
    try {
      if (isFirestoreActive()) {
        const a = await getFirestoreArticleById(id);
        if (a) return a;
      }
    } catch (err) {
      console.warn('getArticleById Firestore fallback notice:', err);
    }
    return getLocalDatabase().articles?.find((a) => a.id === id) || null;
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      if (isFirestoreActive()) {
        const a = await getFirestoreArticleBySlug(slug);
        if (a) return a;
      }
    } catch (err) {
      console.warn('getArticleBySlug Firestore fallback notice:', err);
    }
    return getLocalDatabase().articles?.find((a) => a.slug === slug) || null;
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreArticle(newArt);
      }
    } catch (err) {
      console.warn('createArticle Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreArticle(updated);
      }
    } catch (err) {
      console.warn('updateArticle Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await deleteFirestoreArticle(id);
      }
    } catch (err) {
      console.warn('deleteArticle Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.articles = local.articles.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Programs
  async getPrograms(onlyPublished = false): Promise<Program[]> {
    let items: Program[] = [];
    try {
      if (isFirestoreActive()) {
        items = await getFirestorePrograms();
      }
    } catch (err) {
      console.warn('getPrograms Firestore fallback notice:', err);
    }
    if (!items || items.length === 0) {
      items = getLocalDatabase().programs || [];
    }
    const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return onlyPublished ? sorted.filter((p) => p.isPublished !== false) : sorted;
  },

  async getProgramById(id: string): Promise<Program | null> {
    try {
      if (isFirestoreActive()) {
        const p = await getFirestoreProgramById(id);
        if (p) return p;
      }
    } catch (err) {
      console.warn('getProgramById Firestore fallback notice:', err);
    }
    return getLocalDatabase().programs?.find((p) => p.id === id) || null;
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreProgram(newProg);
      }
    } catch (err) {
      console.warn('createProgram Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreProgram(updated);
      }
    } catch (err) {
      console.warn('updateProgram Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await deleteFirestoreProgram(id);
      }
    } catch (err) {
      console.warn('deleteProgram Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.programs = local.programs.filter((p) => p.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Videos
  async getVideos(onlyPublished = false): Promise<VideoItem[]> {
    let items: VideoItem[] = [];
    try {
      if (isFirestoreActive()) {
        items = await getFirestoreVideos();
      }
    } catch (err) {
      console.warn('getVideos Firestore fallback notice:', err);
    }
    if (!items || items.length === 0) {
      items = getLocalDatabase().videos || [];
    }
    const sorted = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return onlyPublished ? sorted.filter((v) => v.isPublished !== false) : sorted;
  },

  async getVideoById(id: string): Promise<VideoItem | null> {
    try {
      if (isFirestoreActive()) {
        const v = await getFirestoreVideoById(id);
        if (v) return v;
      }
    } catch (err) {
      console.warn('getVideoById Firestore fallback notice:', err);
    }
    return getLocalDatabase().videos?.find((v) => v.id === id) || null;
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreVideo(newVid);
      }
    } catch (err) {
      console.warn('createVideo Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreVideo(updated);
      }
    } catch (err) {
      console.warn('updateVideo Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await deleteFirestoreVideo(id);
      }
    } catch (err) {
      console.warn('deleteVideo Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.videos = local.videos.filter((v) => v.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Gallery Albums
  async getAlbums(onlyPublished = false): Promise<GalleryAlbum[]> {
    let items: GalleryAlbum[] = [];
    try {
      if (isFirestoreActive()) {
        items = await getFirestoreAlbums();
      }
    } catch (err) {
      console.warn('getAlbums Firestore fallback notice:', err);
    }
    if (!items || items.length === 0) {
      items = getLocalDatabase().albums || [];
    }
    const sorted = [...items].sort((a, b) => new Date(b.eventDate || b.createdAt).getTime() - new Date(a.eventDate || a.createdAt).getTime());
    return onlyPublished ? sorted.filter((a) => a.isPublished !== false) : sorted;
  },

  async getAlbumById(id: string): Promise<GalleryAlbum | null> {
    try {
      if (isFirestoreActive()) {
        const a = await getFirestoreAlbumById(id);
        if (a) return a;
      }
    } catch (err) {
      console.warn('getAlbumById Firestore fallback notice:', err);
    }
    return getLocalDatabase().albums?.find((a) => a.id === id) || null;
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreAlbum(newAlb);
      }
    } catch (err) {
      console.warn('createAlbum Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreAlbum(updated);
      }
    } catch (err) {
      console.warn('updateAlbum Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await deleteFirestoreAlbum(id);
      }
    } catch (err) {
      console.warn('deleteAlbum Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.albums = local.albums.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Class Members
  async getMembers(onlyPublished = false): Promise<ClassMember[]> {
    let items: ClassMember[] = [];
    try {
      if (isFirestoreActive()) {
        items = await getFirestoreMembers();
      }
    } catch (err) {
      console.warn('getMembers Firestore fallback notice:', err);
    }
    if (!items || items.length === 0) {
      items = getLocalDatabase().members || [];
    }
    const sorted = [...items].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    return onlyPublished ? sorted.filter((m) => m.isPublished !== false) : sorted;
  },

  async getMemberById(id: string): Promise<ClassMember | null> {
    try {
      if (isFirestoreActive()) {
        const m = await getFirestoreMemberById(id);
        if (m) return m;
      }
    } catch (err) {
      console.warn('getMemberById Firestore fallback notice:', err);
    }
    return getLocalDatabase().members?.find((m) => m.id === id) || null;
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreMember(newMem);
      }
    } catch (err) {
      console.warn('createMember Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreMember(updated);
      }
    } catch (err) {
      console.warn('updateMember Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await deleteFirestoreMember(id);
      }
    } catch (err) {
      console.warn('deleteMember Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.members = local.members.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Achievements
  async getAchievements(onlyPublished = false): Promise<Achievement[]> {
    let items: Achievement[] = [];
    try {
      if (isFirestoreActive()) {
        items = await getFirestoreAchievements();
      }
    } catch (err) {
      console.warn('getAchievements Firestore fallback notice:', err);
    }
    if (!items || items.length === 0) {
      items = getLocalDatabase().achievements || [];
    }
    const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return onlyPublished ? sorted.filter((a) => a.isPublished !== false) : sorted;
  },

  async getAchievementById(id: string): Promise<Achievement | null> {
    try {
      if (isFirestoreActive()) {
        const a = await getFirestoreAchievementById(id);
        if (a) return a;
      }
    } catch (err) {
      console.warn('getAchievementById Firestore fallback notice:', err);
    }
    return getLocalDatabase().achievements?.find((a) => a.id === id) || null;
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreAchievement(newAch);
      }
    } catch (err) {
      console.warn('createAchievement Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreAchievement(updated);
      }
    } catch (err) {
      console.warn('updateAchievement Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await deleteFirestoreAchievement(id);
      }
    } catch (err) {
      console.warn('deleteAchievement Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.achievements = local.achievements.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Announcements
  async getAnnouncements(onlyPublished = false): Promise<Announcement[]> {
    let items: Announcement[] = [];
    try {
      if (isFirestoreActive()) {
        items = await getFirestoreAnnouncements();
      }
    } catch (err) {
      console.warn('getAnnouncements Firestore fallback notice:', err);
    }
    if (!items || items.length === 0) {
      items = getLocalDatabase().announcements || [];
    }
    const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return onlyPublished ? sorted.filter((a) => a.isPublished !== false) : sorted;
  },

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    try {
      if (isFirestoreActive()) {
        const a = await getFirestoreAnnouncementById(id);
        if (a) return a;
      }
    } catch (err) {
      console.warn('getAnnouncementById Firestore fallback notice:', err);
    }
    return getLocalDatabase().announcements?.find((a) => a.id === id) || null;
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreAnnouncement(newAnn);
      }
    } catch (err) {
      console.warn('createAnnouncement Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreAnnouncement(updated);
      }
    } catch (err) {
      console.warn('updateAnnouncement Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        await deleteFirestoreAnnouncement(id);
      }
    } catch (err) {
      console.warn('deleteAnnouncement Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.announcements = local.announcements.filter((a) => a.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Media Assets
  async getMedia(): Promise<MediaAsset[]> {
    try {
      if (isFirestoreActive()) {
        const items = await getFirestoreMedia();
        if (items && items.length > 0) return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (err) {
      console.warn('getMedia Firestore fallback notice:', err);
    }
    const items = getLocalDatabase().media || [];
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getMediaById(id: string): Promise<MediaAsset | null> {
    try {
      if (isFirestoreActive()) {
        const m = await getFirestoreMediaById(id);
        if (m) return m;
      }
    } catch (err) {
      console.warn('getMediaById Firestore fallback notice:', err);
    }
    return getLocalDatabase().media?.find((m) => m.id === id) || null;
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreMedia(newMed);
      }
    } catch (err) {
      console.warn('createMedia Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.media.unshift(newMed);
    saveLocalDatabase(local);
    return newMed;
  },

  async deleteMedia(id: string): Promise<boolean> {
    try {
      if (isFirestoreActive()) {
        await deleteFirestoreMedia(id);
      }
    } catch (err) {
      console.warn('deleteMedia Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        const items = await getFirestoreMessages();
        if (items && items.length > 0) return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (err) {
      console.warn('getMessages Firestore notice:', err);
    }
    const items = getLocalDatabase().messages || [];
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    try {
      if (isFirestoreActive()) {
        await saveFirestoreMessage(newMsg);
      }
    } catch (err) {
      console.warn('createMessage Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.messages.unshift(newMsg);
    saveLocalDatabase(local);
    return newMsg;
  },

  async deleteMessage(id: string): Promise<boolean> {
    try {
      if (isFirestoreActive()) {
        await deleteFirestoreMessage(id);
      }
    } catch (err) {
      console.warn('deleteMessage Firestore notice:', err);
    }
    const local = getLocalDatabase();
    local.messages = local.messages.filter((m) => m.id !== id);
    saveLocalDatabase(local);
    return true;
  },

  // Finance System (Private & Administrator Controlled)
  async getFinanceSummary(): Promise<FinanceSummary> {
    try {
      if (isFirestoreActive()) {
        const summary = await getFirestoreFinanceSummary();
        const txs = await getFirestoreFinanceTransactions();
        if (summary) {
          return {
            ...summary,
            transactionCount: txs?.length || 0,
          };
        }
      }
    } catch (err) {
      console.warn('getFinanceSummary Firestore notice:', err);
    }
    const local = getLocalDatabase();
    const fin = local.finance || (defaultSeedData as unknown as DatabaseSchema).finance;
    return {
      currency: fin?.currency || 'INR',
      currencySymbol: fin?.currencySymbol || '₹',
      openingBalance: fin?.openingBalance || 1100,
      currentBalance: fin?.currentBalance || 1100,
      totalIncome: fin?.totalIncome || 0,
      totalExpenses: fin?.totalExpenses || 0,
      transactionCount: fin?.transactions?.length || 0,
      setupDate: fin?.setupDate || '2026-03-01T00:00:00Z',
      lastUpdated: fin?.lastUpdated || new Date().toISOString(),
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
    try {
      if (isFirestoreActive()) {
        txs = await getFirestoreFinanceTransactions();
      }
    } catch (err) {
      console.warn('getFinanceTransactions Firestore notice:', err);
    }
    if (!txs || txs.length === 0) {
      txs = [...(getLocalDatabase().finance?.transactions || [])];
    }
    if (filters?.type) txs = txs.filter((t) => t.type === filters.type);
    if (filters?.category && filters.category !== 'all') txs = txs.filter((t) => t.category === filters.category);
    if (filters?.startDate) txs = txs.filter((t) => t.date >= filters.startDate!);
    if (filters?.endDate) txs = txs.filter((t) => t.date <= filters.endDate!);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.description?.toLowerCase().includes(q) ||
          (t.counterparty && t.counterparty.toLowerCase().includes(q)) ||
          t.category?.toLowerCase().includes(q) ||
          t.id?.toLowerCase().includes(q)
      );
    }
    return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getFinanceTransactionById(id: string): Promise<FinanceTransaction | null> {
    try {
      if (isFirestoreActive()) {
        const t = await getFirestoreFinanceTransactionById(id);
        if (t) return t;
      }
    } catch (err) {
      console.warn('getFinanceTransactionById Firestore notice:', err);
    }
    return getLocalDatabase().finance?.transactions?.find((t) => t.id === id) || null;
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

    try {
      if (isFirestoreActive() && local.finance) {
        await saveFirestoreFinanceTransaction(newTx);
        const { transactions, auditLogs, ...summary } = local.finance;
        await saveFirestoreFinanceSummary(summary);
        await saveFirestoreFinanceAuditLog(auditLog);
      }
    } catch (err) {
      console.warn('addTransaction Firestore notice:', err);
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

    try {
      if (isFirestoreActive() && local.finance) {
        await saveFirestoreFinanceTransaction(updated);
        const { transactions, auditLogs, ...summary } = local.finance;
        await saveFirestoreFinanceSummary(summary);
        await saveFirestoreFinanceAuditLog(auditLog);
      }
    } catch (err) {
      console.warn('updateTransaction Firestore notice:', err);
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

    try {
      if (isFirestoreActive() && local.finance) {
        await deleteFirestoreFinanceTransaction(id);
        const { transactions, auditLogs, ...summary } = local.finance;
        await saveFirestoreFinanceSummary(summary);
        await saveFirestoreFinanceAuditLog(auditLog);
      }
    } catch (err) {
      console.warn('deleteTransaction Firestore notice:', err);
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
    try {
      if (isFirestoreActive()) {
        const logs = await getFirestoreFinanceAuditLogs();
        if (logs && logs.length > 0) return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
    } catch (err) {
      console.warn('getFinanceAuditLogs Firestore notice:', err);
    }
    return getLocalDatabase().finance?.auditLogs || [];
  },
};
