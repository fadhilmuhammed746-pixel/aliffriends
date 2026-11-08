/**
 * ALIF FRIENDS 12 — Cloud Media Migration to Supabase Storage
 * Reads files in public/uploads and uploads them to the public 'af12-media' bucket.
 * Retains original local backups and generates cloud URLs.
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
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function runMediaMigration() {
  console.log('===============================================================');
  console.log('   ALIF FRIENDS 12 — SUPABASE STORAGE MEDIA MIGRATION          ');
  console.log('===============================================================');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in environment.');
    console.error('Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    console.log('No local public/uploads directory found. Nothing to migrate.');
    return;
  }

  const files = fs.readdirSync(uploadsDir).filter((f) => !f.startsWith('.'));
  console.log(`Found ${files.length} local files in public/uploads/:\n`, files);

  // Ensure 'af12-media' bucket exists
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const mediaBucket = buckets?.find((b) => b.id === 'af12-media' || b.name === 'af12-media');
    if (!mediaBucket) {
      console.log('Creating af12-media bucket...');
      await supabase.storage.createBucket('af12-media', { public: true, fileSizeLimit: 262144000 });
    }
  } catch (err) {
    console.warn('Bucket check/creation notice (may already exist via SQL migration):', err.message);
  }

  const urlMap = {};

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) continue;

    console.log(`\nUploading ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(file).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' : ext === '.mp4' ? 'video/mp4' : ext === '.png' ? 'image/png' : 'image/jpeg';

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('af12-media')
      .upload(file, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadErr) {
      console.error(`  ❌ Failed to upload ${file}:`, uploadErr.message);
    } else {
      const { data: pubData } = supabase.storage.from('af12-media').getPublicUrl(file);
      urlMap[`/uploads/${file}`] = pubData.publicUrl;
      console.log(`  ✓ Uploaded successfully! Cloud URL: ${pubData.publicUrl}`);
    }
  }

  console.log('\n===============================================================');
  console.log('Summary of Cloud Media Mapping:');
  console.log(JSON.stringify(urlMap, null, 2));
  console.log('===============================================================');
}

runMediaMigration().catch((e) => {
  console.error('\n❌ MEDIA MIGRATION FAILED:', e);
  process.exit(1);
});
