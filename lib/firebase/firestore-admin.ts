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
 * Returns Firestore instance if Firebase Admin is configured and initialized.
 */
export function isFirestoreActive(): boolean {
  return getAdminFirestore() !== null;
}

// -----------------------------------------------------------------------------
// Settings
// -----------------------------------------------------------------------------
export async function getFirestoreSettings(): Promise<WebsiteSettings | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('settings').doc('default').get();
  return doc.exists ? (doc.data() as WebsiteSettings) : null;
}

export async function saveFirestoreSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings | null> {
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
}

// -----------------------------------------------------------------------------
// Admin Users
// -----------------------------------------------------------------------------
export async function getFirestoreAdminUser(username: string): Promise<AdminUser | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const snap = await fs.collection('admin_users').where('username', '==', username).limit(1).get();
  if (snap.empty) return null;
  return snap.docs[0].data() as AdminUser;
}

export async function getFirestoreAdminUsers(): Promise<AdminUser[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('admin_users').get();
  return snap.docs.map(d => d.data() as AdminUser);
}

export async function updateFirestoreAdminUser(id: string, partial: Partial<AdminUser>): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('admin_users').doc(id).set(partial, { merge: true });
  return true;
}

// -----------------------------------------------------------------------------
// Magazines
// -----------------------------------------------------------------------------
export async function getFirestoreMagazines(): Promise<Magazine[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('magazines').get();
  return snap.docs.map(d => d.data() as Magazine);
}

export async function getFirestoreMagazineById(id: string): Promise<Magazine | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('magazines').doc(id).get();
  return doc.exists ? (doc.data() as Magazine) : null;
}

export async function saveFirestoreMagazine(magazine: Magazine): Promise<Magazine | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('magazines').doc(magazine.id).set(magazine);
  return magazine;
}

export async function deleteFirestoreMagazine(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('magazines').doc(id).delete();
  return true;
}

// -----------------------------------------------------------------------------
// Articles
// -----------------------------------------------------------------------------
export async function getFirestoreArticles(): Promise<Article[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('articles').get();
  return snap.docs.map(d => d.data() as Article);
}

export async function getFirestoreArticleById(id: string): Promise<Article | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('articles').doc(id).get();
  return doc.exists ? (doc.data() as Article) : null;
}

export async function getFirestoreArticleBySlug(slug: string): Promise<Article | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const snap = await fs.collection('articles').where('slug', '==', slug).limit(1).get();
  if (snap.empty) return null;
  return snap.docs[0].data() as Article;
}

export async function saveFirestoreArticle(article: Article): Promise<Article | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('articles').doc(article.id).set(article);
  return article;
}

export async function deleteFirestoreArticle(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('articles').doc(id).delete();
  return true;
}

// -----------------------------------------------------------------------------
// Programs
// -----------------------------------------------------------------------------
export async function getFirestorePrograms(): Promise<Program[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('programs').get();
  return snap.docs.map(d => d.data() as Program);
}

export async function getFirestoreProgramById(id: string): Promise<Program | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('programs').doc(id).get();
  return doc.exists ? (doc.data() as Program) : null;
}

export async function saveFirestoreProgram(program: Program): Promise<Program | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('programs').doc(program.id).set(program);
  return program;
}

export async function deleteFirestoreProgram(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('programs').doc(id).delete();
  return true;
}

// -----------------------------------------------------------------------------
// Videos
// -----------------------------------------------------------------------------
export async function getFirestoreVideos(): Promise<VideoItem[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('videos').get();
  return snap.docs.map(d => d.data() as VideoItem);
}

export async function getFirestoreVideoById(id: string): Promise<VideoItem | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('videos').doc(id).get();
  return doc.exists ? (doc.data() as VideoItem) : null;
}

export async function saveFirestoreVideo(video: VideoItem): Promise<VideoItem | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('videos').doc(video.id).set(video);
  return video;
}

export async function deleteFirestoreVideo(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('videos').doc(id).delete();
  return true;
}

// -----------------------------------------------------------------------------
// Gallery Albums
// -----------------------------------------------------------------------------
export async function getFirestoreAlbums(): Promise<GalleryAlbum[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('gallery_albums').get();
  return snap.docs.map(d => d.data() as GalleryAlbum);
}

export async function getFirestoreAlbumById(id: string): Promise<GalleryAlbum | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('gallery_albums').doc(id).get();
  return doc.exists ? (doc.data() as GalleryAlbum) : null;
}

export async function saveFirestoreAlbum(album: GalleryAlbum): Promise<GalleryAlbum | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('gallery_albums').doc(album.id).set(album);
  return album;
}

export async function deleteFirestoreAlbum(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('gallery_albums').doc(id).delete();
  return true;
}

// -----------------------------------------------------------------------------
// Members
// -----------------------------------------------------------------------------
export async function getFirestoreMembers(): Promise<ClassMember[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('class_members').get();
  return snap.docs.map(d => d.data() as ClassMember);
}

export async function getFirestoreMemberById(id: string): Promise<ClassMember | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('class_members').doc(id).get();
  return doc.exists ? (doc.data() as ClassMember) : null;
}

export async function saveFirestoreMember(member: ClassMember): Promise<ClassMember | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('class_members').doc(member.id).set(member);
  return member;
}

export async function deleteFirestoreMember(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('class_members').doc(id).delete();
  return true;
}

// -----------------------------------------------------------------------------
// Achievements
// -----------------------------------------------------------------------------
export async function getFirestoreAchievements(): Promise<Achievement[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('achievements').get();
  return snap.docs.map(d => d.data() as Achievement);
}

export async function getFirestoreAchievementById(id: string): Promise<Achievement | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('achievements').doc(id).get();
  return doc.exists ? (doc.data() as Achievement) : null;
}

export async function saveFirestoreAchievement(achievement: Achievement): Promise<Achievement | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('achievements').doc(achievement.id).set(achievement);
  return achievement;
}

export async function deleteFirestoreAchievement(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('achievements').doc(id).delete();
  return true;
}

// -----------------------------------------------------------------------------
// Announcements
// -----------------------------------------------------------------------------
export async function getFirestoreAnnouncements(): Promise<Announcement[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('announcements').get();
  return snap.docs.map(d => d.data() as Announcement);
}

export async function getFirestoreAnnouncementById(id: string): Promise<Announcement | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('announcements').doc(id).get();
  return doc.exists ? (doc.data() as Announcement) : null;
}

export async function saveFirestoreAnnouncement(announcement: Announcement): Promise<Announcement | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('announcements').doc(announcement.id).set(announcement);
  return announcement;
}

export async function deleteFirestoreAnnouncement(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('announcements').doc(id).delete();
  return true;
}

// -----------------------------------------------------------------------------
// Media Assets
// -----------------------------------------------------------------------------
export async function getFirestoreMedia(): Promise<MediaAsset[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('media_assets').get();
  return snap.docs.map(d => d.data() as MediaAsset);
}

export async function getFirestoreMediaById(id: string): Promise<MediaAsset | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('media_assets').doc(id).get();
  return doc.exists ? (doc.data() as MediaAsset) : null;
}

export async function saveFirestoreMedia(media: MediaAsset): Promise<MediaAsset | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('media_assets').doc(media.id).set(media);
  return media;
}

export async function deleteFirestoreMedia(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('media_assets').doc(id).delete();
  return true;
}

// -----------------------------------------------------------------------------
// Messages
// -----------------------------------------------------------------------------
export async function getFirestoreMessages(): Promise<ContactMessage[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('contact_messages').get();
  return snap.docs.map(d => d.data() as ContactMessage);
}

export async function saveFirestoreMessage(message: ContactMessage): Promise<ContactMessage | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('contact_messages').doc(message.id).set(message);
  return message;
}

export async function deleteFirestoreMessage(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('contact_messages').doc(id).delete();
  return true;
}

// -----------------------------------------------------------------------------
// Finance
// -----------------------------------------------------------------------------
export async function getFirestoreFinanceSummary(): Promise<FinanceSummary | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('finance_summary').doc('default').get();
  return doc.exists ? (doc.data() as FinanceSummary) : null;
}

export async function getFirestoreFinanceTransactions(): Promise<FinanceTransaction[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('finance_transactions').get();
  return snap.docs.map(d => d.data() as FinanceTransaction);
}

export async function getFirestoreFinanceTransactionById(id: string): Promise<FinanceTransaction | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  const doc = await fs.collection('finance_transactions').doc(id).get();
  return doc.exists ? (doc.data() as FinanceTransaction) : null;
}

export async function getFirestoreFinanceAuditLogs(): Promise<FinanceAuditLog[]> {
  const fs = getAdminFirestore();
  if (!fs) return [];
  const snap = await fs.collection('finance_audit_logs').get();
  return snap.docs.map(d => d.data() as FinanceAuditLog);
}

export async function saveFirestoreFinanceSummary(summary: Partial<FinanceSummary>): Promise<FinanceSummary | null> {
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
}

export async function saveFirestoreFinanceTransaction(transaction: FinanceTransaction): Promise<FinanceTransaction | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('finance_transactions').doc(transaction.id).set(transaction);
  return transaction;
}

export async function deleteFirestoreFinanceTransaction(id: string): Promise<boolean> {
  const fs = getAdminFirestore();
  if (!fs) return false;
  await fs.collection('finance_transactions').doc(id).delete();
  return true;
}

export async function saveFirestoreFinanceAuditLog(log: FinanceAuditLog): Promise<FinanceAuditLog | null> {
  const fs = getAdminFirestore();
  if (!fs) return null;
  await fs.collection('finance_audit_logs').doc(log.id).set(log);
  return log;
}
