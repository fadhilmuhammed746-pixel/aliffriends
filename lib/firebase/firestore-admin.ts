import { getAdminFirestore } from './admin';
import {
  WebsiteSettings,
  AdminUser,
  Magazine,
  Article,
  Program,
  VideoItem,
  GalleryAlbum,
  ClassMember,
  Achievement,
  Announcement,
  MediaAsset,
  ContactMessage,
  FinanceSummary,
  FinanceTransaction,
  FinanceAuditLog,
} from '../types';

/**
 * Returns true only if Firestore instance is available and active.
 */
export function isFirestoreActive(): boolean {
  try {
    return getAdminFirestore() !== null;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// Settings
// -----------------------------------------------------------------------------
export async function getFirestoreSettings(): Promise<WebsiteSettings | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('settings').doc('default').get();
    return doc.exists ? (doc.data() as WebsiteSettings) : null;
  } catch (err) {
    console.warn('[Firestore] getSettings fallback:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const ref = fs.collection('settings').doc('default');
    const existing = await ref.get();
    const updated = {
      ...(existing.exists ? existing.data() : {}),
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    await ref.set(updated, { merge: true });
    return updated as WebsiteSettings;
  } catch (err) {
    console.warn('[Firestore] saveSettings error:', (err as Error)?.message || err);
    return null;
  }
}

// -----------------------------------------------------------------------------
// Admin Users
// -----------------------------------------------------------------------------
export async function getFirestoreAdminUser(username: string): Promise<AdminUser | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const snap = await fs.collection('admin_users').where('username', '==', username).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as AdminUser;
  } catch (err) {
    console.warn('[Firestore] getAdminUser error:', (err as Error)?.message || err);
    return null;
  }
}

export async function getFirestoreAdminUsers(): Promise<AdminUser[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('admin_users').get();
    return snap.docs.map(d => d.data() as AdminUser);
  } catch (err) {
    console.warn('[Firestore] getAdminUsers error:', (err as Error)?.message || err);
    return [];
  }
}

export async function updateFirestoreAdminUser(id: string, partial: Partial<AdminUser>): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('admin_users').doc(id).set(partial, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore] updateAdminUser error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Magazines
// -----------------------------------------------------------------------------
export async function getFirestoreMagazines(): Promise<Magazine[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('magazines').get();
    return snap.docs.map(d => d.data() as Magazine);
  } catch (err) {
    console.warn('[Firestore] getMagazines error:', (err as Error)?.message || err);
    return [];
  }
}

export async function getFirestoreMagazineById(id: string): Promise<Magazine | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('magazines').doc(id).get();
    return doc.exists ? (doc.data() as Magazine) : null;
  } catch (err) {
    console.warn('[Firestore] getMagazineById error:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreMagazine(magazine: Magazine): Promise<Magazine | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('magazines').doc(magazine.id).set(magazine);
    return magazine;
  } catch (err) {
    console.warn('[Firestore] saveMagazine error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreMagazine(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('magazines').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteMagazine error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Articles
// -----------------------------------------------------------------------------
export async function getFirestoreArticles(): Promise<Article[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('articles').get();
    return snap.docs.map(d => d.data() as Article);
  } catch (err) {
    console.warn('[Firestore] getArticles error:', (err as Error)?.message || err);
    return [];
  }
}

export async function getFirestoreArticleById(id: string): Promise<Article | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('articles').doc(id).get();
    return doc.exists ? (doc.data() as Article) : null;
  } catch (err) {
    console.warn('[Firestore] getArticleById error:', (err as Error)?.message || err);
    return null;
  }
}

export async function getFirestoreArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const snap = await fs.collection('articles').where('slug', '==', slug).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as Article;
  } catch (err) {
    console.warn('[Firestore] getArticleBySlug error:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreArticle(article: Article): Promise<Article | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('articles').doc(article.id).set(article);
    return article;
  } catch (err) {
    console.warn('[Firestore] saveArticle error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreArticle(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('articles').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteArticle error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Programs
// -----------------------------------------------------------------------------
export async function getFirestorePrograms(): Promise<Program[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('programs').get();
    return snap.docs.map(d => d.data() as Program);
  } catch (err) {
    console.warn('[Firestore] getPrograms error:', (err as Error)?.message || err);
    return [];
  }
}

export async function getFirestoreProgramById(id: string): Promise<Program | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('programs').doc(id).get();
    return doc.exists ? (doc.data() as Program) : null;
  } catch (err) {
    console.warn('[Firestore] getProgramById error:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreProgram(program: Program): Promise<Program | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('programs').doc(program.id).set(program);
    return program;
  } catch (err) {
    console.warn('[Firestore] saveProgram error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreProgram(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('programs').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteProgram error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Videos
// -----------------------------------------------------------------------------
export async function getFirestoreVideos(): Promise<VideoItem[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('videos').get();
    return snap.docs.map(d => d.data() as VideoItem);
  } catch (err) {
    console.warn('[Firestore] getVideos error:', (err as Error)?.message || err);
    return [];
  }
}

export async function getFirestoreVideoById(id: string): Promise<VideoItem | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('videos').doc(id).get();
    return doc.exists ? (doc.data() as VideoItem) : null;
  } catch (err) {
    console.warn('[Firestore] getVideoById error:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreVideo(video: VideoItem): Promise<VideoItem | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('videos').doc(video.id).set(video);
    return video;
  } catch (err) {
    console.warn('[Firestore] saveVideo error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreVideo(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('videos').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteVideo error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Gallery Albums
// -----------------------------------------------------------------------------
export async function getFirestoreAlbums(): Promise<GalleryAlbum[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('gallery_albums').get();
    return snap.docs.map(d => d.data() as GalleryAlbum);
  } catch (err) {
    console.warn('[Firestore] getAlbums error:', (err as Error)?.message || err);
    return [];
  }
}

export async function getFirestoreAlbumById(id: string): Promise<GalleryAlbum | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('gallery_albums').doc(id).get();
    return doc.exists ? (doc.data() as GalleryAlbum) : null;
  } catch (err) {
    console.warn('[Firestore] getAlbumById error:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreAlbum(album: GalleryAlbum): Promise<GalleryAlbum | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('gallery_albums').doc(album.id).set(album);
    return album;
  } catch (err) {
    console.warn('[Firestore] saveAlbum error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreAlbum(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('gallery_albums').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteAlbum error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Members
// -----------------------------------------------------------------------------
export async function getFirestoreMembers(): Promise<ClassMember[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('class_members').get();
    return snap.docs.map(d => d.data() as ClassMember);
  } catch (err) {
    console.warn('[Firestore] getMembers error:', (err as Error)?.message || err);
    return [];
  }
}

export async function getFirestoreMemberById(id: string): Promise<ClassMember | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('class_members').doc(id).get();
    return doc.exists ? (doc.data() as ClassMember) : null;
  } catch (err) {
    console.warn('[Firestore] getMemberById error:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreMember(member: ClassMember): Promise<ClassMember | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('class_members').doc(member.id).set(member);
    return member;
  } catch (err) {
    console.warn('[Firestore] saveMember error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreMember(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('class_members').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteMember error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Achievements
// -----------------------------------------------------------------------------
export async function getFirestoreAchievements(): Promise<Achievement[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('achievements').get();
    return snap.docs.map(d => d.data() as Achievement);
  } catch (err) {
    console.warn('[Firestore] getAchievements error:', (err as Error)?.message || err);
    return [];
  }
}

export async function getFirestoreAchievementById(id: string): Promise<Achievement | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('achievements').doc(id).get();
    return doc.exists ? (doc.data() as Achievement) : null;
  } catch (err) {
    console.warn('[Firestore] getAchievementById error:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreAchievement(achievement: Achievement): Promise<Achievement | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('achievements').doc(achievement.id).set(achievement);
    return achievement;
  } catch (err) {
    console.warn('[Firestore] saveAchievement error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreAchievement(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('achievements').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteAchievement error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Announcements
// -----------------------------------------------------------------------------
export async function getFirestoreAnnouncements(): Promise<Announcement[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('announcements').get();
    return snap.docs.map(d => d.data() as Announcement);
  } catch (err) {
    console.warn('[Firestore] getAnnouncements error:', (err as Error)?.message || err);
    return [];
  }
}

export async function getFirestoreAnnouncementById(id: string): Promise<Announcement | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('announcements').doc(id).get();
    return doc.exists ? (doc.data() as Announcement) : null;
  } catch (err) {
    console.warn('[Firestore] getAnnouncementById error:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreAnnouncement(announcement: Announcement): Promise<Announcement | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('announcements').doc(announcement.id).set(announcement);
    return announcement;
  } catch (err) {
    console.warn('[Firestore] saveAnnouncement error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreAnnouncement(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('announcements').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteAnnouncement error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Media Assets
// -----------------------------------------------------------------------------
export async function getFirestoreMedia(): Promise<MediaAsset[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('media_assets').get();
    return snap.docs.map(d => d.data() as MediaAsset);
  } catch (err) {
    console.warn('[Firestore] getMedia error:', (err as Error)?.message || err);
    return [];
  }
}

export async function getFirestoreMediaById(id: string): Promise<MediaAsset | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('media_assets').doc(id).get();
    return doc.exists ? (doc.data() as MediaAsset) : null;
  } catch (err) {
    console.warn('[Firestore] getMediaById error:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreMedia(media: MediaAsset): Promise<MediaAsset | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('media_assets').doc(media.id).set(media);
    return media;
  } catch (err) {
    console.warn('[Firestore] saveMedia error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreMedia(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('media_assets').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteMedia error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Messages
// -----------------------------------------------------------------------------
export async function getFirestoreMessages(): Promise<ContactMessage[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('contact_messages').get();
    return snap.docs.map(d => d.data() as ContactMessage);
  } catch (err) {
    console.warn('[Firestore] getMessages error:', (err as Error)?.message || err);
    return [];
  }
}

export async function saveFirestoreMessage(message: ContactMessage): Promise<ContactMessage | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('contact_messages').doc(message.id).set(message);
    return message;
  } catch (err) {
    console.warn('[Firestore] saveMessage error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreMessage(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('contact_messages').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteMessage error:', (err as Error)?.message || err);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Finance
// -----------------------------------------------------------------------------
export async function getFirestoreFinanceSummary(): Promise<FinanceSummary | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('finance_summary').doc('default').get();
    return doc.exists ? (doc.data() as FinanceSummary) : null;
  } catch (err) {
    console.warn('[Firestore] getFinanceSummary error:', (err as Error)?.message || err);
    return null;
  }
}

export async function getFirestoreFinanceTransactions(): Promise<FinanceTransaction[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('finance_transactions').get();
    return snap.docs.map(d => d.data() as FinanceTransaction);
  } catch (err) {
    console.warn('[Firestore] getFinanceTransactions error:', (err as Error)?.message || err);
    return [];
  }
}

export async function getFirestoreFinanceTransactionById(id: string): Promise<FinanceTransaction | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const doc = await fs.collection('finance_transactions').doc(id).get();
    return doc.exists ? (doc.data() as FinanceTransaction) : null;
  } catch (err) {
    console.warn('[Firestore] getFinanceTransactionById error:', (err as Error)?.message || err);
    return null;
  }
}

export async function getFirestoreFinanceAuditLogs(): Promise<FinanceAuditLog[]> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return [];
    const snap = await fs.collection('finance_audit_logs').get();
    return snap.docs.map(d => d.data() as FinanceAuditLog);
  } catch (err) {
    console.warn('[Firestore] getFinanceAuditLogs error:', (err as Error)?.message || err);
    return [];
  }
}

export async function saveFirestoreFinanceSummary(summary: Partial<FinanceSummary>): Promise<FinanceSummary | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    const ref = fs.collection('finance_summary').doc('default');
    const existing = await ref.get();
    const updated = {
      ...(existing.exists ? existing.data() : {}),
      ...summary,
      lastUpdated: new Date().toISOString(),
    };
    await ref.set(updated, { merge: true });
    return updated as FinanceSummary;
  } catch (err) {
    console.warn('[Firestore] saveFinanceSummary error:', (err as Error)?.message || err);
    return null;
  }
}

export async function saveFirestoreFinanceTransaction(transaction: FinanceTransaction): Promise<FinanceTransaction | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('finance_transactions').doc(transaction.id).set(transaction);
    return transaction;
  } catch (err) {
    console.warn('[Firestore] saveFinanceTransaction error:', (err as Error)?.message || err);
    return null;
  }
}

export async function deleteFirestoreFinanceTransaction(id: string): Promise<boolean> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return false;
    await fs.collection('finance_transactions').doc(id).delete();
    return true;
  } catch (err) {
    console.warn('[Firestore] deleteFinanceTransaction error:', (err as Error)?.message || err);
    return false;
  }
}

export async function saveFirestoreFinanceAuditLog(log: FinanceAuditLog): Promise<FinanceAuditLog | null> {
  try {
    const fs = getAdminFirestore();
    if (!fs) return null;
    await fs.collection('finance_audit_logs').doc(log.id).set(log);
    return log;
  } catch (err) {
    console.warn('[Firestore] saveFinanceAuditLog error:', (err as Error)?.message || err);
    return null;
  }
}
