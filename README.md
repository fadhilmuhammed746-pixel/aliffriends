# ALIF FRIENDS 12
### *"A Class. A Generation. A Thousand Memories."*

The official digital publication, magazine archive, newsroom, and cinematic media platform of **Alif Friends 12**.

Designed and built as an international-caliber digital publication combining the sophistication of a global editorial magazine, broadsheet newsroom, and cinematic media archive.

---

## 🌟 Visual Identity & Creative Direction

- **Midnight Navy (`#101827`)**: The commanding, timeless primary canvas.
- **Warm Ivory (`#F8F6F0`)**: Editorial text, delicate highlights, and print-inspired backgrounds.
- **Champagne Gold (`#C8A96B`)**: Monograms, awards, accents, and borders.
- **Deep Charcoal (`#17191F`)**: Structured editorial cards and reader containers.
- **Muted Grey (`#858995`)**: Secondary metadata, timestamps, and captions.
- **Typography**: Editorial serif typography (`Cinzel`, `Cormorant Garamond`) paired with modern UI grotesque (`Plus Jakarta Sans`).
- **Brand Assets**: Custom vector AF12 monogram seal and vector favicon.

---

## 🏛️ Website Structure & Core Modules

1. **Homepage Signature Experience (`/`)**:
   - Cinematic hero section with photographic storytelling and animated introduction.
   - Latest Editorial Stories, Featured Magazine Edition XII, Newsroom Headlines, Programs, Video Center reel, Photo Memories, Achievements, and Announcements.
2. **Digital Magazine Archive (`/magazine`)**:
   - Multi-edition cover archive (Editions X, XI, XII).
   - Dedicated detail pages (`/magazine/[id]`).
   - Interactive Online PDF Reader (`PdfReader.tsx`) with full-screen reading mode, zoom, rotation, and high-definition download.
3. **The Digital Newsroom (`/newspaper`)**:
   - Real-time breaking news dispatch ticker.
   - Categories: *Class News, Events, Achievements, Education, Editorial, Special Reports, Announcements*.
   - In-depth article pages (`/newspaper/[slug]`) with image galleries, view count tracking, and related stories.
4. **Programs & Conclaves (`/programs`)**:
   - Event chronicle for assemblies, mountain expeditions, and galas with dates, locations, video reels, and photo galleries.
5. **Cinematic Video Center (`/videos`)**:
   - YouTube embeds and direct video player (`VideoPlayer.tsx`), playlists, thumbnails, and dedicated cinema view (`/videos/[id]`).
   - Official YouTube channel link: `https://www.youtube.com/@AlifCreations12`.
6. **Class Photo Gallery (`/gallery`)**:
   - Visual heritage archive with category filters (*Special Moment, Event, Trip, Celebration, Competition*).
   - Interactive Lightbox viewer (`Lightbox.tsx`) with full-screen mode, slideshow auto-play, captions, and public vs restricted album toggles.
7. **Class Members Directory (`/members`)**:
   - Curated display profiles (Display Name, Position, Short Biography, Quote, Photograph).
   - Strict privacy safeguards: no personal phone numbers or addresses exposed.
   - Admin master toggle to enable or disable the section.
8. **Class Honours & Achievements (`/achievements`)**:
   - Rolling trophies, debate championships, and institutional awards with photos and verification tags.
9. **Official Announcements (`/announcements`)**:
   - Priority-coded class notices, assembly directives, and submission calls.
10. **Editorial Manifesto & About Us (`/about`)**:
    - Class origin story, mission, vision, founder quote, and publication philosophy.
11. **Official Contact Desk (`/contact`)**:
    - Verified Primary Email: `aliffreinds12@gmail.com` *(exact spelling preserved)*.
    - Verified Secondary Email: `aliffriends12@gmail.com` *(exact spelling preserved)*.
    - Official YouTube Channel: `https://www.youtube.com/@AlifCreations12`.
    - Official Instagram: `https://www.instagram.com/_alif_friends_/`.
    - Secure contact form with server-side validation and honeypot spam protection.
12. **Admin CMS & Control Room (`/admin`)**:
    - Total counts across all modules, published vs drafts, recent activity, and quick publish actions.
    - Full CRUD management for magazines, articles (with Rich Text Editor), programs, videos, gallery albums, members, achievements, and announcements.
    - Central Media Library (`/admin/media`) with upload, preview, and link copying.
    - Dedicated Change Password security suite in Admin Settings.

---

## 🔐 Administrator Authentication & Credentials

- **Admin Login URL**: `/admin/login`
- **Initial Username**: `admin`
- **Initial Password**: `alif12`

### Security Specifications:
- Passwords are **never** stored in plaintext; stored securely as salted bcrypt hashes.
- Server-side JWT session tokens (`jose`) delivered via `httpOnly`, `sameSite=lax` secure cookies.
- All administration endpoints and mutations are protected by `getAdminSession()`.
- **Change Password Feature**: Accessible at `/admin/settings` (validates current password, enforces minimum length, updates the salted hash in the database, and maintains session security).

---

## 🗄️ Database & Storage Architecture

The application implements a dual-resilient data architecture:
1. **Self-Contained Local Database (`data/af12_database.json`)**: Pre-configured with rich editorial seed data and atomic file writes. The project runs out-of-the-box with **zero external dependencies**.
2. **Supabase PostgreSQL Schema (`supabase/migrations/20250101000000_init_af12.sql`)**: Complete enterprise migration file featuring 12 PostgreSQL tables, Row Level Security (RLS) policies, indexes, and storage bucket configuration.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
\`\`\`bash
npm run build
npm run start
\`\`\`

---

## 🧪 Verified User Journeys

- ✅ **Public Visitor**: Browses the homepage, reads Edition XII in the online PDF reader, views newsroom dispatches, watches cinematic reels, and navigates full-screen photo slideshows.
- ✅ **Contact Desk**: Submits inquiries through the spam-protected form; emails routed to `aliffreinds12@gmail.com` and `aliffriends12@gmail.com`.
- ✅ **Administrator Login**: Authenticates at `/admin/login` with `admin` / `alif12`.
- ✅ **Editorial Publishing**: Creates articles with the rich text editor, uploads PDFs and cover artwork, schedules programs, and manages albums.
- ✅ **Security Verification**: Changes administrator password securely via `/admin/settings`; verified against bcrypt salted hash.
