export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: 'superadmin' | 'editor';
  createdAt: string;
  lastLogin?: string;
}

export interface Magazine {
  id: string;
  title: string;
  editionNumber: string;
  publicationDate: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  author: string;
  editor: string;
  pageCount?: number;
  fileSize?: string;
  isFeatured: boolean;
  isPublished: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ArticleCategory =
  | 'Class News'
  | 'Events'
  | 'Achievements'
  | 'Education'
  | 'Editorial'
  | 'Special Reports'
  | 'Announcements';

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: ArticleCategory;
  headlineStatus: boolean;
  breakingStatus: boolean;
  coverImage: string;
  content: string; // Rich HTML or Markdown
  author: string;
  authorRole?: string;
  publishedAt: string;
  viewCount: number;
  isPublished: boolean;
  galleryImages?: string[];
  videoUrl?: string;
  pdfUrl?: string;
  pdfTitle?: string;
  relatedTags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  coverImage: string;
  photos: string[];
  youtubeUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  pdfTitle?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  videoType: 'youtube' | 'direct';
  youtubeUrl?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  duration?: string;
  isFeatured: boolean;
  isPublished: boolean;
  collectionName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
  date?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  category: 'Event' | 'Trip' | 'Celebration' | 'Competition' | 'Special Moment' | 'Special Moments' | 'Events' | 'Trips' | 'Celebrations' | 'Competitions' | 'Other';
  description: string;
  coverImage: string;
  isRestricted: boolean; // public or restricted
  isPublished: boolean;
  isFeatured?: boolean;
  eventDate?: string;
  photos: GalleryPhoto[];
  videos?: string[];
  pdfUrl?: string;
  pdfTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photoUrl: string;
  quote?: string;
  orderIndex: number;
  category?: string;
  responsibility?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Award' | 'Competition' | 'Academic' | 'Special Recognition';
  date: string;
  description: string;
  awardedBy?: string;
  imageUrl: string;
  photos?: string[];
  videoUrl?: string;
  pdfUrl?: string;
  pdfTitle?: string;
  badgeTitle?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Notice' | 'Event' | 'Urgent' | 'General';
  date: string;
  content: string;
  coverImage?: string;
  photos?: string[];
  videoUrl?: string;
  pdfUrl?: string;
  pdfTitle?: string;
  priority: 'low' | 'medium' | 'high';
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSettings {
  siteName: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  heroBadge: string;
  heroImage: string;
  aboutStory: string;
  aboutMission: string;
  aboutVision: string;
  founderQuote: string;
  officialYoutube: string;
  officialInstagram: string;
  emailPrimary: string;
  emailSecondary: string;
  membersSectionEnabled: boolean;
  breakingTickerText: string;
  showBreakingTicker: boolean;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  category: 'image' | 'video' | 'pdf' | 'other';
  section?: string;
  contentId?: string;
  uploadedBy?: string;
  storageLocation?: 'local' | 'supabase';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

// -----------------------------------------------------------------------------
// Class Finance System Types (Strictly Private & Admin Protected)
// -----------------------------------------------------------------------------

export type TransactionType = 'income' | 'expense';

export type IncomeCategory =
  | 'Member Contributions'
  | 'Donations'
  | 'Event Collections'
  | 'Magazine Sales'
  | 'Other Income';

export type ExpenseCategory =
  | 'Program Expenses'
  | 'Printing'
  | 'Magazine Production'
  | 'Travel'
  | 'Food'
  | 'Decorations'
  | 'Equipment'
  | 'Other Expenses';

export type FinanceCategory = IncomeCategory | ExpenseCategory;

export interface FinanceTransaction {
  id: string; // e.g. TXN-001
  type: TransactionType;
  category: FinanceCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  counterparty: string; // 'Received from' or 'Paid to'
  description: string;
  notes?: string;
  receiptUrl?: string;
  balanceAfter: number;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceAuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'setup';
  transactionId?: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface FinanceSummary {
  currency: string;
  currencySymbol: string;
  openingBalance: number;
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  setupDate: string;
  lastUpdated: string;
}

export interface FinanceData {
  openingBalance: number;
  currency: string;
  currencySymbol: string;
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  setupDate: string;
  lastUpdated: string;
  transactions: FinanceTransaction[];
  auditLogs: FinanceAuditLog[];
}

export interface DatabaseSchema {
  adminUsers: AdminUser[];
  magazines: Magazine[];
  articles: Article[];
  programs: Program[];
  videos: VideoItem[];
  albums: GalleryAlbum[];
  members: ClassMember[];
  achievements: Achievement[];
  announcements: Announcement[];
  settings: WebsiteSettings;
  media: MediaAsset[];
  messages: ContactMessage[];
  finance: FinanceData;
}


