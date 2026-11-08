/**
 * ALIF FRIENDS 12 — Idempotent Supabase PostgreSQL Data Migration Script
 * Migrates all records from data/af12_database.json to Supabase PostgreSQL.
 * Safe to re-run; uses upsert on primary keys.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Optional: Load .env.local if present
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function runMigration() {
  console.log('===============================================================');
  console.log('   ALIF FRIENDS 12 — SUPABASE POSTGRESQL DATA MIGRATION        ');
  console.log('===============================================================');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in environment.');
    console.error('Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const dbFile = path.join(__dirname, '..', 'data', 'af12_database.json');

  if (!fs.existsSync(dbFile)) {
    console.error(`❌ Source database file not found at: ${dbFile}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(dbFile, 'utf8');
  const data = JSON.parse(raw);

  console.log('\n[1/15] Migrating Website Settings...');
  const settingsRow = {
    id: 'default',
    site_name: data.settings.siteName,
    tagline: data.settings.tagline,
    hero_heading: data.settings.heroHeading,
    hero_subheading: data.settings.heroSubheading,
    hero_badge: data.settings.heroBadge,
    hero_image: data.settings.heroImage,
    about_story: data.settings.aboutStory,
    about_mission: data.settings.aboutMission,
    about_vision: data.settings.aboutVision,
    founder_quote: data.settings.founderQuote,
    official_youtube: data.settings.officialYoutube,
    official_instagram: data.settings.officialInstagram,
    email_primary: data.settings.emailPrimary,
    email_secondary: data.settings.emailSecondary,
    members_section_enabled: data.settings.membersSectionEnabled,
    breaking_ticker_text: data.settings.breakingTickerText,
    show_breaking_ticker: data.settings.showBreakingTicker,
    updated_at: data.settings.updatedAt || new Date().toISOString(),
  };
  const { error: errSettings } = await supabase.from('settings').upsert(settingsRow, { onConflict: 'id' });
  if (errSettings) throw new Error(`Settings migration error: ${errSettings.message}`);
  console.log('  ✓ Settings migrated successfully');

  console.log('\n[2/15] Migrating Admin Users...');
  for (const u of data.adminUsers) {
    const { error } = await supabase.from('admin_users').upsert({
      id: u.id,
      username: u.username,
      password_hash: u.passwordHash,
      role: u.role || 'superadmin',
      created_at: u.createdAt || new Date().toISOString(),
      last_login: u.lastLogin || null,
    }, { onConflict: 'id' });
    if (error) throw new Error(`Admin users migration error: ${error.message}`);
  }
  console.log(`  ✓ ${data.adminUsers.length} Admin User(s) migrated`);

  console.log('\n[3/15] Migrating Magazines...');
  for (const m of data.magazines) {
    const { error } = await supabase.from('magazines').upsert({
      id: m.id,
      title: m.title,
      edition_number: m.editionNumber,
      publication_date: m.publicationDate,
      description: m.description,
      cover_image: m.coverImage,
      pdf_url: m.pdfUrl,
      author: m.author,
      editor: m.editor,
      page_count: m.pageCount || 0,
      file_size: m.fileSize || null,
      is_featured: Boolean(m.isFeatured),
      is_published: Boolean(m.isPublished),
      tags: m.tags || [],
      created_at: m.createdAt || new Date().toISOString(),
      updated_at: m.updatedAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Magazines migration error: ${error.message}`);
  }
  console.log(`  ✓ ${data.magazines.length} Magazine(s) migrated`);

  console.log('\n[4/15] Migrating Newspaper Articles...');
  for (const a of data.articles) {
    const { error } = await supabase.from('articles').upsert({
      id: a.id,
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle || null,
      category: a.category,
      headline_status: Boolean(a.headlineStatus),
      breaking_status: Boolean(a.breakingStatus),
      cover_image: a.coverImage,
      content: a.content,
      author: a.author,
      author_role: a.authorRole || null,
      published_at: a.publishedAt || new Date().toISOString(),
      view_count: a.viewCount || 0,
      is_published: Boolean(a.isPublished),
      gallery_images: a.galleryImages || [],
      video_url: a.videoUrl || null,
      pdf_url: a.pdfUrl || null,
      pdf_title: a.pdfTitle || null,
      related_tags: a.relatedTags || [],
      created_at: a.createdAt || new Date().toISOString(),
      updated_at: a.updatedAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Articles migration error: ${error.message}`);
  }
  console.log(`  ✓ ${data.articles.length} Article(s) migrated`);

  console.log('\n[5/15] Migrating Programs...');
  for (const p of data.programs) {
    const { error } = await supabase.from('programs').upsert({
      id: p.id,
      title: p.title,
      category: p.category,
      date: p.date,
      location: p.location,
      description: p.description,
      cover_image: p.coverImage,
      photos: p.photos || [],
      youtube_url: p.youtubeUrl || null,
      video_url: p.videoUrl || null,
      pdf_url: p.pdfUrl || null,
      pdf_title: p.pdfTitle || null,
      is_featured: Boolean(p.isFeatured),
      is_published: Boolean(p.isPublished),
      created_at: p.createdAt || new Date().toISOString(),
      updated_at: p.updatedAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Programs migration error: ${error.message}`);
  }
  console.log(`  ✓ ${data.programs.length} Program(s) migrated`);

  console.log('\n[6/15] Migrating Videos...');
  for (const v of data.videos) {
    const { error } = await supabase.from('videos').upsert({
      id: v.id,
      title: v.title,
      description: v.description,
      category: v.category,
      video_type: v.videoType || 'youtube',
      youtube_url: v.youtubeUrl || null,
      video_url: v.videoUrl || null,
      thumbnail_url: v.thumbnailUrl,
      duration: v.duration || null,
      is_featured: Boolean(v.isFeatured),
      is_published: Boolean(v.isPublished),
      collection_name: v.collectionName || null,
      created_at: v.createdAt || new Date().toISOString(),
      updated_at: v.updatedAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Videos migration error: ${error.message}`);
  }
  console.log(`  ✓ ${data.videos.length} Video(s) migrated`);

  console.log('\n[7/15] Migrating Gallery Albums...');
  for (const g of data.albums) {
    const { error } = await supabase.from('gallery_albums').upsert({
      id: g.id,
      title: g.title,
      category: g.category,
      description: g.description || null,
      cover_image: g.coverImage,
      is_restricted: Boolean(g.isRestricted),
      is_published: Boolean(g.isPublished),
      is_featured: Boolean(g.isFeatured),
      event_date: g.eventDate || null,
      photos: g.photos || [],
      videos: g.videos || [],
      pdf_url: g.pdfUrl || null,
      pdf_title: g.pdfTitle || null,
      created_at: g.createdAt || new Date().toISOString(),
      updated_at: g.updatedAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Gallery migration error: ${error.message}`);
  }
  console.log(`  ✓ ${data.albums.length} Album(s) migrated`);

  console.log('\n[8/15] Migrating Class Members...');
  for (const m of data.members) {
    const { error } = await supabase.from('class_members').upsert({
      id: m.id,
      name: m.name,
      position: m.position,
      bio: m.bio,
      photo_url: m.photoUrl,
      quote: m.quote || null,
      order_index: m.orderIndex || 0,
      category: m.category || null,
      responsibility: m.responsibility || null,
      is_published: Boolean(m.isPublished),
      created_at: m.createdAt || new Date().toISOString(),
      updated_at: m.updatedAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Class members migration error: ${error.message}`);
  }
  console.log(`  ✓ ${data.members.length} Member(s) migrated`);

  console.log('\n[9/15] Migrating Achievements...');
  for (const a of data.achievements) {
    const { error } = await supabase.from('achievements').upsert({
      id: a.id,
      title: a.title,
      category: a.category,
      date: a.date,
      description: a.description,
      awarded_by: a.awardedBy || null,
      image_url: a.imageUrl,
      photos: a.photos || [],
      video_url: a.videoUrl || null,
      pdf_url: a.pdfUrl || null,
      pdf_title: a.pdfTitle || null,
      badge_title: a.badgeTitle || null,
      is_featured: Boolean(a.isFeatured),
      is_published: Boolean(a.isPublished),
      created_at: a.createdAt || new Date().toISOString(),
      updated_at: a.updatedAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Achievements migration error: ${error.message}`);
  }
  console.log(`  ✓ ${data.achievements.length} Achievement(s) migrated`);

  console.log('\n[10/15] Migrating Announcements...');
  for (const an of data.announcements) {
    const { error } = await supabase.from('announcements').upsert({
      id: an.id,
      title: an.title,
      category: an.category,
      date: an.date,
      content: an.content,
      cover_image: an.coverImage || null,
      photos: an.photos || [],
      video_url: an.videoUrl || null,
      pdf_url: an.pdfUrl || null,
      pdf_title: an.pdfTitle || null,
      priority: an.priority || 'medium',
      is_featured: Boolean(an.isFeatured),
      is_published: Boolean(an.isPublished),
      created_at: an.createdAt || new Date().toISOString(),
      updated_at: an.updatedAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Announcements migration error: ${error.message}`);
  }
  console.log(`  ✓ ${data.announcements.length} Announcement(s) migrated`);

  console.log('\n[11/15] Migrating Media Assets...');
  for (const md of (data.media || [])) {
    const { error } = await supabase.from('media_assets').upsert({
      id: md.id,
      filename: md.filename,
      original_name: md.originalName,
      url: md.url,
      mime_type: md.mimeType,
      size: md.size,
      category: md.category,
      section: md.section || null,
      content_id: md.contentId || null,
      uploaded_by: md.uploadedBy || 'admin',
      storage_location: md.storageLocation || 'supabase',
      created_at: md.createdAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Media assets migration error: ${error.message}`);
  }
  console.log(`  ✓ ${(data.media || []).length} Media Asset(s) migrated`);

  console.log('\n[12/15] Migrating Contact Messages...');
  for (const msg of (data.messages || [])) {
    const { error } = await supabase.from('contact_messages').upsert({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      status: msg.status || 'unread',
      created_at: msg.createdAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Contact messages migration error: ${error.message}`);
  }
  console.log(`  ✓ ${(data.messages || []).length} Message(s) migrated`);

  console.log('\n[13/15] Migrating Class Finance: Summary...');
  const fin = data.finance || { openingBalance: 1100, currentBalance: 1100, totalIncome: 0, totalExpenses: 0 };
  const { error: errFinSum } = await supabase.from('finance_summary').upsert({
    id: 'default',
    currency: fin.currency || 'INR',
    currency_symbol: fin.currencySymbol || '₹',
    opening_balance: fin.openingBalance,
    current_balance: fin.currentBalance,
    total_income: fin.totalIncome || 0,
    total_expenses: fin.totalExpenses || 0,
    setup_date: fin.setupDate || new Date().toISOString(),
    last_updated: fin.lastUpdated || new Date().toISOString(),
  }, { onConflict: 'id' });
  if (errFinSum) throw new Error(`Finance summary migration error: ${errFinSum.message}`);
  console.log(`  ✓ Finance summary migrated. Balance: ₹${fin.currentBalance.toLocaleString('en-IN')}`);

  console.log('\n[14/15] Migrating Class Finance: Transactions...');
  for (const t of (fin.transactions || [])) {
    const { error } = await supabase.from('finance_transactions').upsert({
      id: t.id,
      type: t.type,
      category: t.category,
      amount: t.amount,
      date: t.date,
      counterparty: t.counterparty,
      description: t.description,
      notes: t.notes || null,
      receipt_url: t.receiptUrl || null,
      balance_after: t.balanceAfter,
      added_by: t.addedBy || 'admin',
      created_at: t.createdAt || new Date().toISOString(),
      updated_at: t.updatedAt || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Finance transactions migration error: ${error.message}`);
  }
  console.log(`  ✓ ${(fin.transactions || []).length} Finance Transaction(s) migrated`);

  console.log('\n[15/15] Migrating Class Finance: Audit Logs...');
  for (const log of (fin.auditLogs || [])) {
    const { error } = await supabase.from('finance_audit_logs').upsert({
      id: log.id,
      action: log.action,
      transaction_id: log.transactionId || null,
      details: log.details,
      performed_by: log.performedBy || 'admin',
      timestamp: log.timestamp || new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Finance audit logs migration error: ${error.message}`);
  }
  console.log(`  ✓ ${(fin.auditLogs || []).length} Finance Audit Log(s) migrated`);

  console.log('\n===============================================================');
  console.log('✅ ALL 15 DATA COLLECTIONS MIGRATED TO SUPABASE POSTGRESQL');
  console.log('===============================================================');
}

runMigration().catch((e) => {
  console.error('\n❌ MIGRATION FAILED:', e);
  process.exit(1);
});
