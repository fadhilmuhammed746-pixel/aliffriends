const fs = require('fs');
const path = require('path');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Load .env.local
const env = {};
if (fs.existsSync('.env.local')) {
  fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) {
      const k = line.slice(0, idx).trim();
      const v = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      env[k] = v;
    }
  });
}

function getFirestoreInstance() {
  if (getApps().length > 0) {
    return getFirestore(getApps()[0]);
  }

  const projectId = env.FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  let privateKey = env.FIREBASE_PRIVATE_KEY;
  const serviceAccountRaw = env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountRaw) {
    let sa;
    if (serviceAccountRaw.trim().startsWith('{')) {
      sa = JSON.parse(serviceAccountRaw);
    } else {
      sa = JSON.parse(Buffer.from(serviceAccountRaw, 'base64').toString('utf8'));
    }
    const app = initializeApp({ credential: cert(sa), projectId: sa.projectId || projectId });
    return getFirestore(app);
  }

  if (clientEmail && privateKey && projectId) {
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');
    const app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
    return getFirestore(app);
  }

  throw new Error(
    'Firebase Admin credentials not found in .env.local!\n' +
    'Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY\n' +
    'or set FIREBASE_SERVICE_ACCOUNT_KEY in .env.local before running this migration.'
  );
}

async function migrate() {
  console.log('--- ALIF FRIENDS 12 -> FIREBASE CLOUD FIRESTORE MIGRATION ---');
  const db = getFirestoreInstance();
  console.log('✓ Successfully authenticated with Firebase Admin Firestore.');

  const dbPath = path.join(__dirname, '../data/af12_database.json');
  if (!fs.existsSync(dbPath)) {
    throw new Error('Local database file not found at: ' + dbPath);
  }

  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // 1. Settings
  if (data.settings) {
    console.log('Migrating settings...');
    await db.collection('settings').doc('default').set(data.settings);
    console.log('✓ Settings migrated.');
  }

  // 2. Admin Users
  if (data.adminUsers && data.adminUsers.length > 0) {
    console.log(`Migrating ${data.adminUsers.length} admin users...`);
    for (const u of data.adminUsers) {
      await db.collection('admin_users').doc(u.id).set(u);
    }
    console.log('✓ Admin users migrated.');
  }

  // 3. Magazines
  if (data.magazines && data.magazines.length > 0) {
    console.log(`Migrating ${data.magazines.length} magazines...`);
    for (const m of data.magazines) {
      await db.collection('magazines').doc(m.id).set(m);
    }
    console.log('✓ Magazines migrated.');
  }

  // 4. Articles
  if (data.articles && data.articles.length > 0) {
    console.log(`Migrating ${data.articles.length} articles...`);
    for (const a of data.articles) {
      await db.collection('articles').doc(a.id).set(a);
    }
    console.log('✓ Articles migrated.');
  }

  // 5. Programs
  if (data.programs && data.programs.length > 0) {
    console.log(`Migrating ${data.programs.length} programs...`);
    for (const p of data.programs) {
      await db.collection('programs').doc(p.id).set(p);
    }
    console.log('✓ Programs migrated.');
  }

  // 6. Videos
  if (data.videos && data.videos.length > 0) {
    console.log(`Migrating ${data.videos.length} videos...`);
    for (const v of data.videos) {
      await db.collection('videos').doc(v.id).set(v);
    }
    console.log('✓ Videos migrated.');
  }

  // 7. Gallery Albums
  if (data.albums && data.albums.length > 0) {
    console.log(`Migrating ${data.albums.length} gallery albums...`);
    for (const a of data.albums) {
      await db.collection('gallery_albums').doc(a.id).set(a);
    }
    console.log('✓ Gallery albums migrated.');
  }

  // 8. Class Members
  if (data.members && data.members.length > 0) {
    console.log(`Migrating ${data.members.length} class members...`);
    for (const m of data.members) {
      await db.collection('class_members').doc(m.id).set(m);
    }
    console.log('✓ Class members migrated.');
  }

  // 9. Achievements
  if (data.achievements && data.achievements.length > 0) {
    console.log(`Migrating ${data.achievements.length} achievements...`);
    for (const a of data.achievements) {
      await db.collection('achievements').doc(a.id).set(a);
    }
    console.log('✓ Achievements migrated.');
  }

  // 10. Announcements
  if (data.announcements && data.announcements.length > 0) {
    console.log(`Migrating ${data.announcements.length} announcements...`);
    for (const a of data.announcements) {
      await db.collection('announcements').doc(a.id).set(a);
    }
    console.log('✓ Announcements migrated.');
  }

  // 11. Media Assets
  if (data.media && data.media.length > 0) {
    console.log(`Migrating ${data.media.length} media assets...`);
    for (const m of data.media) {
      await db.collection('media_assets').doc(m.id).set(m);
    }
    console.log('✓ Media assets migrated.');
  }

  // 12. Finance
  if (data.finance) {
    console.log('Migrating finance summary, transactions, and audit logs...');
    const { transactions, auditLogs, ...summary } = data.finance;
    await db.collection('finance_summary').doc('default').set(summary);

    if (transactions && transactions.length > 0) {
      for (const t of transactions) {
        await db.collection('finance_transactions').doc(t.id).set(t);
      }
    }

    if (auditLogs && auditLogs.length > 0) {
      for (const l of auditLogs) {
        await db.collection('finance_audit_logs').doc(l.id).set(l);
      }
    }
    console.log('✓ Finance records migrated.');
  }

  console.log('=== COMPLETE FIREBASE MIGRATION FINISHED SUCCESSFULLY ===');
}

migrate().catch(err => {
  console.error('[Migration Error]:', err.message);
  process.exit(1);
});
