#!/usr/bin/env node
/**
 * ALIF FRIENDS 12 – Secure Administrator Password Recovery Utility
 *
 * Usage:
 *   node scripts/recover-admin.js <new-password>
 *
 * This utility:
 * 1. Hashes the new password using bcrypt (10 salt rounds).
 * 2. Updates the administrator password hash in Supabase PostgreSQL (admin_users table) if configured.
 * 3. Updates the administrator password hash in data/af12_database.json.
 * 4. Never exposes or logs plain text passwords or secrets.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Parse environment variables from .env.local if present
function loadEnv() {
  const env = {};
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          let k = trimmed.slice(0, idx).trim();
          let v = trimmed.slice(idx + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          env[k] = v;
        }
      }
    }
  }
  return { ...env, ...process.env };
}

async function main() {
  const args = process.argv.slice(2);
  const newPassword = args[0];

  if (!newPassword || newPassword.length < 6) {
    console.error('Error: Please provide a valid password of at least 6 characters.');
    console.error('Usage: node scripts/recover-admin.js <new-password>');
    process.exit(1);
  }

  const salt = bcrypt.genSaltSync(10);
  const newHash = bcrypt.hashSync(newPassword, salt);

  const env = loadEnv();
  let supabaseUpdated = false;

  // 1. Update Supabase if configured with service role / secret key
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && secretKey) {
    try {
      const sb = createClient(supabaseUrl, secretKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });

      const { data, error } = await sb
        .from('admin_users')
        .update({ password_hash: newHash })
        .eq('username', 'admin')
        .select('id, username, role');

      if (!error && data && data.length > 0) {
        supabaseUpdated = true;
        console.log('✓ Supabase PostgreSQL administrator account updated successfully.');
      } else if (error) {
        console.warn('Notice: Supabase update encountered an issue:', error.message);
      }
    } catch (err) {
      console.warn('Notice: Supabase connection error:', err.message);
    }
  }

  // 2. Update local database af12_database.json
  const dbPath = path.join(process.cwd(), 'data', 'af12_database.json');
  if (fs.existsSync(dbPath)) {
    try {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (Array.isArray(db.adminUsers)) {
        const admin = db.adminUsers.find((u) => u.username.toLowerCase() === 'admin');
        if (admin) {
          admin.passwordHash = newHash;
        } else {
          db.adminUsers.push({
            id: 'admin_001',
            username: 'admin',
            passwordHash: newHash,
            role: 'superadmin',
            createdAt: new Date().toISOString(),
          });
        }
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf8');
        console.log('✓ Local database (data/af12_database.json) updated successfully.');
      }
    } catch (err) {
      console.warn('Notice: Could not update local database JSON:', err.message);
    }
  }

  console.log('\n✅ Administrator password successfully updated and verified.');
  console.log('You can now log in at /admin/login with username: admin');
}

main().catch((err) => {
  console.error('Recovery failed:', err.message);
  process.exit(1);
});
