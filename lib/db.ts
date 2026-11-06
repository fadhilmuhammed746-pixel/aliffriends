import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
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

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'af12_database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate seeded database structure
function getInitialSeedData(): DatabaseSchema {
  // Pre-hashed bcrypt for 'alif12'
  // $2a$10$76GjHw5n86V2X8eXjK8Mxeo03W6xRzN1w7.6o3cI98C6m8V.o7W/q or compute synchronously
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('alif12', salt);

  return {
    adminUsers: [
      {
        id: 'admin_001',
        username: 'admin',
        passwordHash: adminPasswordHash,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
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
        'Alif Friends 12 represents more than an academic cohort; it is a collective bond forged through shared ambition, creative curiosity, and lasting brotherhood. From our earliest classroom debates to grand state-level accolades, our journey reflects a generation devoted to honor, intellect, and brotherhood.',
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
      updatedAt: new Date().toISOString(),
    },
    magazines: [
      {
        id: 'mag_12',
        title: 'The Golden Epoch: Edition XII',
        editionNumber: 'Edition XII',
        publicationDate: '2026-03-15',
        description:
          'Our flagship 68-page annual publication featuring exclusive retrospective memoirs, teacher tributes, poetic anthologies, investigative student journalism, and a cinematic retrospective of the 2025–2026 academic calendar.',
        coverImage:
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        pdfUrl: '/uploads/sample-magazine-af12.pdf',
        author: 'Editorial Directorate',
        editor: 'Zayd M. & Farhan Ali',
        pageCount: 68,
        fileSize: '14.2 MB',
        isFeatured: true,
        isPublished: true,
        tags: ['Annual', 'Special Edition', 'Memoirs', 'Creative Arts'],
        createdAt: '2026-03-15T08:00:00Z',
        updatedAt: '2026-03-15T08:00:00Z',
      },
      {
        id: 'mag_11',
        title: 'Chronicles of Grit & Grace: Edition XI',
        editionNumber: 'Edition XI',
        publicationDate: '2025-09-10',
        description:
          'A rich literary and photographic exploration chronicling our transition into senior leadership, scientific innovations, sports championships, and reflections on character.',
        coverImage:
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
        pdfUrl: '/uploads/sample-magazine-af12.pdf',
        author: 'Literary Society AF12',
        editor: 'Tariq Rahman',
        pageCount: 52,
        fileSize: '11.8 MB',
        isFeatured: false,
        isPublished: true,
        tags: ['Literary', 'Autumn Issue', 'Leadership'],
        createdAt: '2025-09-10T08:00:00Z',
        updatedAt: '2025-09-10T08:00:00Z',
      },
      {
        id: 'mag_10',
        title: 'Inception: The Class of Visionaries: Edition X',
        editionNumber: 'Edition X',
        publicationDate: '2025-02-01',
        description:
          'The commemorative maiden issue that laid down the founding philosophy of Alif Friends 12, featuring original artwork, introductory essays, and historic inaugural group photographs.',
        coverImage:
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
        pdfUrl: '/uploads/sample-magazine-af12.pdf',
        author: 'Founding Committee',
        editor: 'Editorial Board',
        pageCount: 44,
        fileSize: '9.4 MB',
        isFeatured: false,
        isPublished: true,
        tags: ['Foundational', 'Inaugural', 'Class History'],
        createdAt: '2025-02-01T08:00:00Z',
        updatedAt: '2025-02-01T08:00:00Z',
      },
    ],
    articles: [
      {
        id: 'art_001',
        slug: 'alif-friends-12-triumphs-in-inter-collegiate-literary-conclave',
        title: 'Alif Friends 12 Triumphs in Inter-Collegiate Literary & Cultural Conclave',
        subtitle: 'Securing top honours in parliamentary debate, creative writing, and dramatic monologue.',
        category: 'Class News',
        headlineStatus: true,
        breakingStatus: false,
        coverImage:
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80',
        content: `
          <p class="lead">In an unprecedented demonstration of intellectual rigor and oratorical prowess, the student delegation of Alif Friends 12 clinched the coveted Championship Trophy at the 2026 Inter-Collegiate Literary Conclave.</p>
          <p>Held over three demanding days of parliamentary debating, extempore analysis, and theatrical monologue, the event witnessed participation from over thirty top regional institutions. The AF12 delegation stood out for its commanding articulation, depth of research, and exemplary sportsmanship.</p>
          <h3>A Defining Victory for the Class</h3>
          <p>"This triumph is not merely an institutional accolade; it is the culmination of months of rigorous preparation, late-night mock sessions in the media lab, and the unbreakable trust between our team members," remarked our head delegate during the post-valedictory press briefing.</p>
          <p>The judges unanimously praised the AF12 presentation on <em>'The Ethical Dimensions of Algorithmic Governance'</em>, emphasizing the depth of historical context and ethical clarity brought to the floor.</p>
          <blockquote>"True leadership is not the volume of your speech, but the clarity of your conviction and the dignity with which you respect opposing arguments."</blockquote>
          <p>As the trophy returns to our campus exhibition hall, the class celebrates not only the victory but the collective pride that unites every member of Alif Friends 12.</p>
        `,
        author: 'Zayd M.',
        authorRole: 'Editorial Secretary',
        publishedAt: '2026-03-20T10:00:00Z',
        viewCount: 1420,
        isPublished: true,
        galleryImages: [
          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
        ],
        relatedTags: ['Conclave', 'Debate', 'Championship', 'Academics'],
        createdAt: '2026-03-20T10:00:00Z',
        updatedAt: '2026-03-20T10:00:00Z',
      },
      {
        id: 'art_002',
        slug: 'a-decade-of-fellowship-the-story-behind-our-class-digital-archive',
        title: 'A Decade of Fellowship: The Story Behind Our Class Digital Archive',
        subtitle: 'How an ambitious student initiative transformed classroom memories into an international-grade publication platform.',
        category: 'Editorial',
        headlineStatus: false,
        breakingStatus: true,
        coverImage:
          'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1400&q=80',
        content: `
          <p class="lead">Every classroom experiences laughter, ambition, moments of pressure before examinations, and quiet breakthroughs that reshape lives. Yet, all too often, these invaluable human moments dissolve into faded photographs and forgotten text threads.</p>
          <p>When the Alif Friends 12 digital initiative was conceptualized, our guiding mandate was uncompromising: create a digital monument that honors our time together with the aesthetic reverence of a global publication.</p>
          <h3>Elevating Student Journalism</h3>
          <p>Rather than relying on generic social feeds, we designed a comprehensive ecosystem incorporating digital magazine reading, rich investigative reports, full-resolution photographic archives, and high-definition video archives.</p>
          <p>The result is what you see today: a living, breathing testament to what a class can achieve when creative discipline meets unwavering loyalty.</p>
        `,
        author: 'Farhan Ali',
        authorRole: 'Editor-in-Chief',
        publishedAt: '2026-03-18T14:30:00Z',
        viewCount: 980,
        isPublished: true,
        relatedTags: ['Editorial', 'Archive', 'Digital Media', 'Legacy'],
        createdAt: '2026-03-18T14:30:00Z',
        updatedAt: '2026-03-18T14:30:00Z',
      },
      {
        id: 'art_003',
        slug: 'special-report-the-creative-revolution-in-student-led-journalism',
        title: 'Special Report: The Creative Revolution in Student-Led Journalism',
        subtitle: 'Exploring how modern typography, documentary media, and editorial ethics define the new standard.',
        category: 'Special Reports',
        headlineStatus: false,
        breakingStatus: false,
        coverImage:
          'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=80',
        content: `
          <p class="lead">The landscape of institutional publications is undergoing a profound paradigm shift. No longer content with mimeographed newsletters or static PDF flyers, student editorial teams are operating with the sophistication of modern newsrooms.</p>
          <p>At Alif Friends 12, our editorial room operates on strict journalistic principles: factual precision, peer review, refined visual curation, and accessible storytelling.</p>
          <p>Through our YouTube productions under Alif Creations 12 and our quarterly print-to-digital journals, we provide each student contributor a premier platform to express their voice.</p>
        `,
        author: 'Media Board',
        authorRole: 'Investigative Desk',
        publishedAt: '2026-03-12T09:15:00Z',
        viewCount: 750,
        isPublished: true,
        relatedTags: ['Journalism', 'Media', 'Special Report'],
        createdAt: '2026-03-12T09:15:00Z',
        updatedAt: '2026-03-12T09:15:00Z',
      },
      {
        id: 'art_004',
        slug: 'grand-alif-annual-assembly-2026-schedule-and-broadcast',
        title: 'Grand Alif Annual Assembly 2026: Schedule, Keynotes & Live Broadcast Details',
        subtitle: 'All proceedings, guest lectures, and commemorative honours will be broadcast live via Alif Creations 12.',
        category: 'Events',
        headlineStatus: false,
        breakingStatus: false,
        coverImage:
          'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=80',
        content: `
          <p class="lead">Preparations for the flagship event of our academic year, the Grand Alif Annual Assembly 2026, have entered their final phase.</p>
          <p>Featuring keynote addresses by esteemed alumni mentors, ceremonial unveiling of the class yearbook, and musical performances by the AF12 Cultural Ensemble, this year's assembly promises to be our most memorable gathering yet.</p>
          <p>For class members and well-wishers attending remotely, the full four-hour ceremony will stream in 4K resolution on our official YouTube channel.</p>
        `,
        author: 'Event Committee',
        authorRole: 'Organizing Secretary',
        publishedAt: '2026-03-05T11:00:00Z',
        viewCount: 1120,
        isPublished: true,
        relatedTags: ['Assembly', 'Live Broadcast', 'Keynotes'],
        createdAt: '2026-03-05T11:00:00Z',
        updatedAt: '2026-03-05T11:00:00Z',
      },
    ],
    programs: [
      {
        id: 'prog_001',
        title: 'Grand Class Conclave & Cultural Gala 2026',
        category: 'Gala & Conclave',
        date: '2026-04-12',
        location: 'Royal Grand Convention Auditorium, Central Campus',
        description:
          'The premier formal gathering celebrating our collective accomplishments, featuring distinguished guest lectures, cultural recitals, award distributions, and the official release ceremony of Edition XII Magazine.',
        coverImage:
          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
        photos: [
          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
        ],
        youtubeUrl: 'https://www.youtube.com/@AlifCreations12',
        isFeatured: true,
        isPublished: true,
        createdAt: '2026-03-01T10:00:00Z',
        updatedAt: '2026-03-01T10:00:00Z',
      },
      {
        id: 'prog_002',
        title: 'Annual Class Expedition: The Nilgiris Highlands Journey',
        category: 'Expedition & Trip',
        date: '2026-01-20',
        location: 'Ooty & Nilgiri Mountain Range',
        description:
          'A transformative four-day wilderness expedition and leadership retreat in the misty Nilgiri hills. Trekking through pine forests, lakeside bonfires, and team-building summits under starry skies.',
        coverImage:
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
        photos: [
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
        ],
        youtubeUrl: 'https://www.youtube.com/@AlifCreations12',
        isFeatured: true,
        isPublished: true,
        createdAt: '2026-01-25T10:00:00Z',
        updatedAt: '2026-01-25T10:00:00Z',
      },
      {
        id: 'prog_003',
        title: 'Alif Community Outreach & Educational Drive',
        category: 'Community Service',
        date: '2025-11-15',
        location: 'City Youth Center & District Library',
        description:
          'A student-led philanthropic initiative delivering over 500 academic books, digital literacy kits, and science workshop sessions to underprivileged middle school students.',
        coverImage:
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=80',
        photos: [
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
        ],
        isFeatured: false,
        isPublished: true,
        createdAt: '2025-11-20T10:00:00Z',
        updatedAt: '2025-11-20T10:00:00Z',
      },
    ],
    videos: [
      {
        id: 'vid_001',
        title: 'Alif Friends 12: The Official Cinematic Documentary',
        description:
          'A masterfully crafted 15-minute documentary tracing the journey, struggles, camaraderie, and triumphs of the class of Alif Friends 12. Directed and edited by our in-house media team.',
        category: 'Documentary',
        videoType: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Clean embeddable video
        thumbnailUrl:
          'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=80',
        duration: '14:48',
        isFeatured: true,
        isPublished: true,
        collectionName: 'Cinematic Archive',
        createdAt: '2026-03-01T12:00:00Z',
        updatedAt: '2026-03-01T12:00:00Z',
      },
      {
        id: 'vid_002',
        title: 'Cultural Night 2026: Live Musical & Stage Highlights',
        description:
          'Electrifying musical ensemble performances, dramatic theatre plays, and spoken word tributes performed live on stage during the Annual Cultural Night.',
        category: 'Performances',
        videoType: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1400&q=80',
        duration: '09:22',
        isFeatured: false,
        isPublished: true,
        collectionName: 'Live Stage',
        createdAt: '2026-02-18T10:00:00Z',
        updatedAt: '2026-02-18T10:00:00Z',
      },
      {
        id: 'vid_003',
        title: 'Behind The Scenes: Crafting Edition XII Magazine',
        description:
          'Step inside the editing suite and print press room as our student designers and editors bring the 68-page Edition XII from rough concept to finished gold-foil hardcover.',
        category: 'Behind The Scenes',
        videoType: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1400&q=80',
        duration: '06:35',
        isFeatured: false,
        isPublished: true,
        collectionName: 'Editorial Room',
        createdAt: '2026-03-10T15:00:00Z',
        updatedAt: '2026-03-10T15:00:00Z',
      },
    ],
    albums: [
      {
        id: 'alb_001',
        title: 'The Class Heritage & Milestone Portraiture',
        category: 'Special Moment',
        description:
          'Formal and candid studio portraits capturing the faces, dignity, and individuality of every member of Alif Friends 12.',
        coverImage:
          'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
        isRestricted: false,
        isPublished: true,
        photos: [
          {
            id: 'ph_101',
            url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
            caption: 'The Executive Council & Class Leadership 2026',
            alt: 'Group portrait',
          },
          {
            id: 'ph_102',
            url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
            caption: 'Candid laughter in the central courtyard during lunch recess',
            alt: 'Courtyard memories',
          },
          {
            id: 'ph_103',
            url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
            caption: 'Collaborative workshop in the computer research laboratory',
            alt: 'Laboratory session',
          },
          {
            id: 'ph_104',
            url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
            caption: 'Editorial board reviewing first printed proofs of Edition XII',
            alt: 'Editorial review',
          },
        ],
        createdAt: '2026-03-01T10:00:00Z',
        updatedAt: '2026-03-01T10:00:00Z',
      },
      {
        id: 'alb_002',
        title: 'Highland Expedition: The Nilgiris Trek',
        category: 'Trip',
        description:
          'Sunrises over mountain ridges, campfire stories, and unforgettable trails through tea plantations during our senior trip.',
        coverImage:
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        isRestricted: false,
        isPublished: true,
        photos: [
          {
            id: 'ph_201',
            url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            caption: 'Ascending the peak at dawn under golden skies',
            alt: 'Mountain summit',
          },
          {
            id: 'ph_202',
            url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
            caption: 'Resting by the emerald mountain river',
            alt: 'River valley',
          },
          {
            id: 'ph_203',
            url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
            caption: 'Starry night vigil around the highland campfire',
            alt: 'Campfire',
          },
        ],
        createdAt: '2026-01-28T12:00:00Z',
        updatedAt: '2026-01-28T12:00:00Z',
      },
      {
        id: 'alb_003',
        title: 'Athletics & Sports Championship Day',
        category: 'Competition',
        description:
          'The energy, sweat, and glory of our athletes sweeping the podium in track & field and the football tournament.',
        coverImage:
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
        isRestricted: false,
        isPublished: true,
        photos: [
          {
            id: 'ph_301',
            url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
            caption: 'Sprint relay finals: the baton exchange that clinched gold',
            alt: 'Sprint finish',
          },
          {
            id: 'ph_302',
            url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
            caption: 'Football team lifting the championship shield',
            alt: 'Trophy celebration',
          },
        ],
        createdAt: '2025-12-10T14:00:00Z',
        updatedAt: '2025-12-10T14:00:00Z',
      },
    ],
    members: [
      {
        id: 'mem_001',
        name: 'Zayd Mohammed',
        position: 'Class President & Editorial Coordinator',
        bio: 'Passionate about public debate, student governance, and archival literature. Believes that every classmate possesses a unique spark that elevates the collective whole.',
        photoUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        quote: 'Leadership is service. When we lift one another, our entire generation rises.',
        orderIndex: 1,
        isPublished: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'mem_002',
        name: 'Farhan Ali',
        position: 'Editor-in-Chief & Creative Director',
        bio: 'Spearheads the publication layout, typography, and journalistic curation of the AF12 digital magazine and newspaper publications.',
        photoUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        quote: 'Words have the power to freeze time and immortalize shared moments.',
        orderIndex: 2,
        isPublished: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'mem_003',
        name: 'Rayyan Siddiqui',
        position: 'Head of Media & Cinematography',
        bio: 'Directs the cinematic documentaries and visual storytelling for Alif Creations 12. Enthusiast of 35mm photography and color grading.',
        photoUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        quote: 'Through the lens, even fleeting moments become enduring works of art.',
        orderIndex: 3,
        isPublished: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'mem_004',
        name: 'Bilal Khan',
        position: 'Sports Captain & Athletic Lead',
        bio: 'State-level sprinter and captain of the class football squad. Champions relentless discipline, physical fitness, and unyielding team spirit.',
        photoUrl:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
        quote: 'Victories are built on the cold mornings when no one is watching.',
        orderIndex: 4,
        isPublished: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'mem_005',
        name: 'Amaan Shaikh',
        position: 'Cultural Secretary & Event Curator',
        bio: 'Organizes our stage dramas, musical evenings, and cultural symposia. Passionate about classical poetry and contemporary theatre.',
        photoUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        quote: 'Art is the heartbeat that breathes soul into our academic years.',
        orderIndex: 5,
        isPublished: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'mem_006',
        name: 'Hamza Tariq',
        position: 'Academic Lead & Research Coordinator',
        bio: 'Top scorer in mathematics and computer sciences. Mentors peers in programming, debate research, and academic symposiums.',
        photoUrl:
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
        quote: 'Curiosity is the true engine of progress and discovery.',
        orderIndex: 6,
        isPublished: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ],
    achievements: [
      {
        id: 'ach_001',
        title: 'Grand Champions – State Youth Parliamentary Conclave',
        category: 'Competition',
        date: '2026-02-14',
        description:
          'The AF12 debating caucus out-argued 32 institutions over five rounds to win the prestigious rolling trophy for parliamentary excellence.',
        awardedBy: 'State Youth Assembly & Department of Higher Education',
        imageUrl:
          'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=1000&q=80',
        badgeTitle: 'First Place – Rolling Trophy',
        isFeatured: true,
        isPublished: true,
        createdAt: '2026-02-15T00:00:00Z',
        updatedAt: '2026-02-15T00:00:00Z',
      },
      {
        id: 'ach_002',
        title: 'Best Student Editorial Publication 2025–2026',
        category: 'Award',
        date: '2026-01-10',
        description:
          'Honoured for outstanding design aesthetics, ethical student reporting, and editorial maturity across the state education circle.',
        awardedBy: 'Collegiate Press & Media Association',
        imageUrl:
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
        badgeTitle: 'Editorial Gold Award',
        isFeatured: true,
        isPublished: true,
        createdAt: '2026-01-12T00:00:00Z',
        updatedAt: '2026-01-12T00:00:00Z',
      },
      {
        id: 'ach_003',
        title: 'Inter-District Football Championship Winners',
        category: 'Competition',
        date: '2025-11-28',
        description:
          'An undefeated tournament streak culminating in a dramatic 2-1 victory in the championship final against the defending champions.',
        awardedBy: 'District Athletics & Sports Federation',
        imageUrl:
          'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
        badgeTitle: 'Championship Shield',
        isFeatured: false,
        isPublished: true,
        createdAt: '2025-11-30T00:00:00Z',
        updatedAt: '2025-11-30T00:00:00Z',
      },
      {
        id: 'ach_004',
        title: 'Distinguished Citation in Community Outreach & Literacy',
        category: 'Special Recognition',
        date: '2025-10-18',
        description:
          'Commended for spearheading educational material distribution and computer literacy workshops across municipal schools.',
        awardedBy: 'Metropolitan Social Welfare Council',
        imageUrl:
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
        badgeTitle: 'Civic Honor Citation',
        isFeatured: false,
        isPublished: true,
        createdAt: '2025-10-20T00:00:00Z',
        updatedAt: '2025-10-20T00:00:00Z',
      },
    ],
    announcements: [
      {
        id: 'ann_001',
        title: 'Official Worldwide Release of Digital Magazine Edition XII',
        category: 'Notice',
        date: '2026-03-15',
        content:
          'The digital edition of our flagship publication "The Golden Epoch" is now accessible on all devices. High-resolution PDF downloads and the full-screen online reader are available in the Magazine section.',
        priority: 'high',
        isFeatured: true,
        isPublished: true,
        createdAt: '2026-03-15T09:00:00Z',
        updatedAt: '2026-03-15T09:00:00Z',
      },
      {
        id: 'ann_002',
        title: 'Call for Literary Submissions: Special Monsoon Supplement',
        category: 'General',
        date: '2026-03-25',
        content:
          'The editorial board invites essays, original poetry, photo essays, and scientific op-eds for the upcoming supplement. Submissions close on April 15th via our official editorial email.',
        priority: 'medium',
        isFeatured: false,
        isPublished: true,
        createdAt: '2026-03-25T10:00:00Z',
        updatedAt: '2026-03-25T10:00:00Z',
      },
      {
        id: 'ann_003',
        title: 'Grand Annual Assembly 2026 – Venue & Seating Guidelines',
        category: 'Event',
        date: '2026-04-01',
        content:
          'All attendees are requested to be seated by 09:30 AM at the Royal Grand Convention Auditorium. Formal attire is requested. Live stream links will be shared on our YouTube channel.',
        priority: 'high',
        isFeatured: true,
        isPublished: true,
        createdAt: '2026-04-01T08:00:00Z',
        updatedAt: '2026-04-01T08:00:00Z',
      },
    ],
    media: [
      {
        id: 'med_001',
        filename: 'af12-magazine-edition-12-cover.jpg',
        originalName: 'cover_edition_12.jpg',
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        mimeType: 'image/jpeg',
        size: 2450000,
        category: 'image',
        createdAt: '2026-03-15T08:00:00Z',
      },
      {
        id: 'med_002',
        filename: 'af12-assembly-banner.jpg',
        originalName: 'assembly_2026.jpg',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
        mimeType: 'image/jpeg',
        size: 3200000,
        category: 'image',
        createdAt: '2026-03-01T10:00:00Z',
      },
    ],
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
      auditLogs: [
        {
          id: 'log_init',
          action: 'setup',
          details: 'Class treasury established with initial opening balance of ₹1,100',
          performedBy: 'admin',
          timestamp: '2026-03-01T00:00:00Z',
        },
      ],
    },
  };
}

// Recalculates running balance for all transactions based on opening balance
function recalculateFinanceBalances(data: DatabaseSchema): void {
  if (!data.finance) return;
  const sorted = [...data.finance.transactions].sort((a, b) => {
    const dateCmp = a.date.localeCompare(b.date);
    if (dateCmp !== 0) return dateCmp;
    return a.createdAt.localeCompare(b.createdAt);
  });

  let running = data.finance.openingBalance;
  let totalInc = 0;
  let totalExp = 0;

  for (const t of sorted) {
    if (t.type === 'income') {
      running += t.amount;
      totalInc += t.amount;
    } else {
      running -= t.amount;
      totalExp += t.amount;
    }
    t.balanceAfter = running;
  }

  for (const t of data.finance.transactions) {
    const found = sorted.find((s) => s.id === t.id);
    if (found) {
      t.balanceAfter = found.balanceAfter;
    }
  }

  data.finance.currentBalance = running;
  data.finance.totalIncome = totalInc;
  data.finance.totalExpenses = totalExp;
  data.finance.lastUpdated = new Date().toISOString();
}

// Thread-safe read/write operations
let memoryCache: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  if (memoryCache) {
    return memoryCache;
  }

  if (!fs.existsSync(DB_FILE)) {
    const seed = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    memoryCache = seed;
    return seed;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const data: DatabaseSchema = JSON.parse(content);
    if (!data.finance) {
      data.finance = {
        openingBalance: 1100,
        currency: 'INR',
        currencySymbol: '₹',
        currentBalance: 1100,
        totalIncome: 0,
        totalExpenses: 0,
        setupDate: '2026-03-01T00:00:00Z',
        lastUpdated: '2026-03-01T00:00:00Z',
        transactions: [],
        auditLogs: [
          {
            id: 'log_init',
            action: 'setup',
            details: 'Class treasury established with initial opening balance of ₹1,100',
            performedBy: 'admin',
            timestamp: '2026-03-01T00:00:00Z',
          },
        ],
      };
      saveDatabase(data);
    }
    memoryCache = data;
    return data;
  } catch (err) {
    console.error('Error reading database file, re-initializing seed:', err);
    const seed = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    memoryCache = seed;
    return seed;
  }
}

export function saveDatabase(data: DatabaseSchema): void {
  memoryCache = data;
  const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_FILE);
}

// Data Access API
export const db = {
  // Settings
  getSettings: () => getDatabase().settings,
  updateSettings: (partial: Partial<WebsiteSettings>) => {
    const data = getDatabase();
    data.settings = {
      ...data.settings,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(data);
    return data.settings;
  },

  // Admin Users
  getAdminByUsername: (username: string) => {
    const data = getDatabase();
    return data.adminUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());
  },
  updateAdminPassword: (userId: string, newPasswordHash: string) => {
    const data = getDatabase();
    const admin = data.adminUsers.find((u) => u.id === userId);
    if (!admin) return false;
    admin.passwordHash = newPasswordHash;
    saveDatabase(data);
    return true;
  },

  // Magazines
  getMagazines: (onlyPublished = true) => {
    const items = getDatabase().magazines;
    return onlyPublished ? items.filter((m) => m.isPublished) : items;
  },
  getMagazineById: (id: string) => {
    return getDatabase().magazines.find((m) => m.id === id);
  },
  createMagazine: (magazine: Omit<Magazine, 'id' | 'createdAt' | 'updatedAt'>) => {
    const data = getDatabase();
    const newMag: Magazine = {
      ...magazine,
      id: `mag_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.magazines.unshift(newMag);
    saveDatabase(data);
    return newMag;
  },
  updateMagazine: (id: string, partial: Partial<Magazine>) => {
    const data = getDatabase();
    const index = data.magazines.findIndex((m) => m.id === id);
    if (index === -1) return null;
    data.magazines[index] = {
      ...data.magazines[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(data);
    return data.magazines[index];
  },
  deleteMagazine: (id: string) => {
    const data = getDatabase();
    data.magazines = data.magazines.filter((m) => m.id !== id);
    saveDatabase(data);
    return true;
  },

  // Articles
  getArticles: (onlyPublished = true) => {
    const items = getDatabase().articles;
    return onlyPublished ? items.filter((a) => a.isPublished) : items;
  },
  getArticleBySlugOrId: (identifier: string) => {
    return getDatabase().articles.find((a) => a.slug === identifier || a.id === identifier);
  },
  createArticle: (article: Omit<Article, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'>) => {
    const data = getDatabase();
    const newArt: Article = {
      ...article,
      id: `art_${Date.now()}`,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.articles.unshift(newArt);
    saveDatabase(data);
    return newArt;
  },
  updateArticle: (id: string, partial: Partial<Article>) => {
    const data = getDatabase();
    const index = data.articles.findIndex((a) => a.id === id);
    if (index === -1) return null;
    data.articles[index] = {
      ...data.articles[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(data);
    return data.articles[index];
  },
  incrementArticleView: (id: string) => {
    const data = getDatabase();
    const art = data.articles.find((a) => a.id === id || a.slug === id);
    if (art) {
      art.viewCount = (art.viewCount || 0) + 1;
      saveDatabase(data);
    }
  },
  deleteArticle: (id: string) => {
    const data = getDatabase();
    data.articles = data.articles.filter((a) => a.id !== id);
    saveDatabase(data);
    return true;
  },

  // Programs
  getPrograms: (onlyPublished = true) => {
    const items = getDatabase().programs;
    return onlyPublished ? items.filter((p) => p.isPublished) : items;
  },
  getProgramById: (id: string) => {
    return getDatabase().programs.find((p) => p.id === id);
  },
  createProgram: (prog: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>) => {
    const data = getDatabase();
    const newProg: Program = {
      ...prog,
      id: `prog_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.programs.unshift(newProg);
    saveDatabase(data);
    return newProg;
  },
  updateProgram: (id: string, partial: Partial<Program>) => {
    const data = getDatabase();
    const index = data.programs.findIndex((p) => p.id === id);
    if (index === -1) return null;
    data.programs[index] = {
      ...data.programs[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(data);
    return data.programs[index];
  },
  deleteProgram: (id: string) => {
    const data = getDatabase();
    data.programs = data.programs.filter((p) => p.id !== id);
    saveDatabase(data);
    return true;
  },

  // Videos
  getVideos: (onlyPublished = true) => {
    const items = getDatabase().videos;
    return onlyPublished ? items.filter((v) => v.isPublished) : items;
  },
  getVideoById: (id: string) => {
    return getDatabase().videos.find((v) => v.id === id);
  },
  createVideo: (vid: Omit<VideoItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const data = getDatabase();
    const newVid: VideoItem = {
      ...vid,
      id: `vid_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.videos.unshift(newVid);
    saveDatabase(data);
    return newVid;
  },
  updateVideo: (id: string, partial: Partial<VideoItem>) => {
    const data = getDatabase();
    const index = data.videos.findIndex((v) => v.id === id);
    if (index === -1) return null;
    data.videos[index] = {
      ...data.videos[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(data);
    return data.videos[index];
  },
  deleteVideo: (id: string) => {
    const data = getDatabase();
    data.videos = data.videos.filter((v) => v.id !== id);
    saveDatabase(data);
    return true;
  },

  // Gallery Albums
  getAlbums: (onlyPublished = true) => {
    const items = getDatabase().albums;
    return onlyPublished ? items.filter((a) => a.isPublished) : items;
  },
  getAlbumById: (id: string) => {
    return getDatabase().albums.find((a) => a.id === id);
  },
  createAlbum: (album: Omit<GalleryAlbum, 'id' | 'createdAt' | 'updatedAt'>) => {
    const data = getDatabase();
    const newAlb: GalleryAlbum = {
      ...album,
      id: `alb_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.albums.unshift(newAlb);
    saveDatabase(data);
    return newAlb;
  },
  updateAlbum: (id: string, partial: Partial<GalleryAlbum>) => {
    const data = getDatabase();
    const index = data.albums.findIndex((a) => a.id === id);
    if (index === -1) return null;
    data.albums[index] = {
      ...data.albums[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(data);
    return data.albums[index];
  },
  deleteAlbum: (id: string) => {
    const data = getDatabase();
    data.albums = data.albums.filter((a) => a.id !== id);
    saveDatabase(data);
    return true;
  },

  // Members
  getMembers: (onlyPublished = true) => {
    const items = getDatabase().members;
    const sorted = [...items].sort((a, b) => a.orderIndex - b.orderIndex);
    return onlyPublished ? sorted.filter((m) => m.isPublished) : sorted;
  },
  getMemberById: (id: string) => {
    return getDatabase().members.find((m) => m.id === id);
  },
  createMember: (member: Omit<ClassMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    const data = getDatabase();
    const newMem: ClassMember = {
      ...member,
      id: `mem_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.members.push(newMem);
    saveDatabase(data);
    return newMem;
  },
  updateMember: (id: string, partial: Partial<ClassMember>) => {
    const data = getDatabase();
    const index = data.members.findIndex((m) => m.id === id);
    if (index === -1) return null;
    data.members[index] = {
      ...data.members[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(data);
    return data.members[index];
  },
  deleteMember: (id: string) => {
    const data = getDatabase();
    data.members = data.members.filter((m) => m.id !== id);
    saveDatabase(data);
    return true;
  },

  // Achievements
  getAchievements: (onlyPublished = true) => {
    const items = getDatabase().achievements;
    return onlyPublished ? items.filter((a) => a.isPublished) : items;
  },
  createAchievement: (ach: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const data = getDatabase();
    const newAch: Achievement = {
      ...ach,
      id: `ach_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.achievements.unshift(newAch);
    saveDatabase(data);
    return newAch;
  },
  updateAchievement: (id: string, partial: Partial<Achievement>) => {
    const data = getDatabase();
    const index = data.achievements.findIndex((a) => a.id === id);
    if (index === -1) return null;
    data.achievements[index] = {
      ...data.achievements[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(data);
    return data.achievements[index];
  },
  deleteAchievement: (id: string) => {
    const data = getDatabase();
    data.achievements = data.achievements.filter((a) => a.id !== id);
    saveDatabase(data);
    return true;
  },

  // Announcements
  getAnnouncements: (onlyPublished = true) => {
    const items = getDatabase().announcements;
    return onlyPublished ? items.filter((a) => a.isPublished) : items;
  },
  createAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const data = getDatabase();
    const newAnn: Announcement = {
      ...ann,
      id: `ann_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.announcements.unshift(newAnn);
    saveDatabase(data);
    return newAnn;
  },
  updateAnnouncement: (id: string, partial: Partial<Announcement>) => {
    const data = getDatabase();
    const index = data.announcements.findIndex((a) => a.id === id);
    if (index === -1) return null;
    data.announcements[index] = {
      ...data.announcements[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(data);
    return data.announcements[index];
  },
  deleteAnnouncement: (id: string) => {
    const data = getDatabase();
    data.announcements = data.announcements.filter((a) => a.id !== id);
    saveDatabase(data);
    return true;
  },

  // Media
  getMedia: () => getDatabase().media,
  createMedia: (media: Omit<MediaAsset, 'id' | 'createdAt'>) => {
    const data = getDatabase();
    const newMed: MediaAsset = {
      ...media,
      id: `med_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    data.media.unshift(newMed);
    saveDatabase(data);
    return newMed;
  },
  deleteMedia: (id: string) => {
    const data = getDatabase();
    data.media = data.media.filter((m) => m.id !== id);
    saveDatabase(data);
    return true;
  },

  // Messages
  getMessages: () => getDatabase().messages,
  createMessage: (msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) => {
    const data = getDatabase();
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    data.messages.unshift(newMsg);
    saveDatabase(data);
    return newMsg;
  },
  deleteMessage: (id: string) => {
    const data = getDatabase();
    data.messages = data.messages.filter((m) => m.id !== id);
    saveDatabase(data);
    return true;
  },

  // Class Finance System (Private & Administrator Controlled)
  getFinanceSummary: (): FinanceSummary => {
    const data = getDatabase();
    return {
      currency: data.finance.currency,
      currencySymbol: data.finance.currencySymbol,
      openingBalance: data.finance.openingBalance,
      currentBalance: data.finance.currentBalance,
      totalIncome: data.finance.totalIncome,
      totalExpenses: data.finance.totalExpenses,
      transactionCount: data.finance.transactions.length,
      setupDate: data.finance.setupDate,
      lastUpdated: data.finance.lastUpdated,
    };
  },

  getFinanceTransactions: (filters?: {
    type?: TransactionType;
    category?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): FinanceTransaction[] => {
    const data = getDatabase();
    let txs = [...data.finance.transactions];

    if (filters?.type) {
      txs = txs.filter((t) => t.type === filters.type);
    }
    if (filters?.category && filters.category !== 'all') {
      txs = txs.filter((t) => t.category === filters.category);
    }
    if (filters?.startDate) {
      txs = txs.filter((t) => t.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      txs = txs.filter((t) => t.date <= filters.endDate!);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.counterparty.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    return txs;
  },

  getFinanceTransactionById: (id: string): FinanceTransaction | null => {
    const data = getDatabase();
    return data.finance.transactions.find((t) => t.id === id) || null;
  },

  createFinanceTransaction: (
    tx: Omit<FinanceTransaction, 'id' | 'balanceAfter' | 'createdAt' | 'updatedAt'>
  ): { transaction: FinanceTransaction; summary: FinanceSummary } => {
    const data = getDatabase();
    const count = data.finance.transactions.length + 1;
    const txId = `TXN-${String(count).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newTx: FinanceTransaction = {
      ...tx,
      id: txId,
      amount: Number(tx.amount),
      balanceAfter: 0,
      createdAt: now,
      updatedAt: now,
    };

    data.finance.transactions.unshift(newTx);

    data.finance.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'create',
      transactionId: txId,
      details: `Recorded ${tx.type.toUpperCase()}: ₹${Number(tx.amount).toLocaleString('en-IN')} (${tx.category}) - ${tx.description}`,
      performedBy: tx.addedBy || 'admin',
      timestamp: now,
    });

    recalculateFinanceBalances(data);
    saveDatabase(data);

    const savedTx = data.finance.transactions.find((t) => t.id === txId)!;
    return {
      transaction: savedTx,
      summary: db.getFinanceSummary(),
    };
  },

  updateFinanceTransaction: (
    id: string,
    partial: Partial<Omit<FinanceTransaction, 'id' | 'balanceAfter' | 'createdAt' | 'updatedAt'>>,
    performedBy = 'admin'
  ): { transaction: FinanceTransaction | null; summary: FinanceSummary } => {
    const data = getDatabase();
    const index = data.finance.transactions.findIndex((t) => t.id === id);
    if (index === -1) return { transaction: null, summary: db.getFinanceSummary() };

    const oldTx = data.finance.transactions[index];
    const now = new Date().toISOString();

    data.finance.transactions[index] = {
      ...oldTx,
      ...partial,
      amount: partial.amount !== undefined ? Number(partial.amount) : oldTx.amount,
      updatedAt: now,
    };

    data.finance.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'update',
      transactionId: id,
      details: `Updated ${id}: amount ₹${data.finance.transactions[index].amount.toLocaleString('en-IN')}, category ${data.finance.transactions[index].category}`,
      performedBy,
      timestamp: now,
    });

    recalculateFinanceBalances(data);
    saveDatabase(data);

    return {
      transaction: data.finance.transactions.find((t) => t.id === id) || null,
      summary: db.getFinanceSummary(),
    };
  },

  deleteFinanceTransaction: (
    id: string,
    performedBy = 'admin'
  ): { success: boolean; summary: FinanceSummary } => {
    const data = getDatabase();
    const tx = data.finance.transactions.find((t) => t.id === id);
    if (!tx) return { success: false, summary: db.getFinanceSummary() };

    data.finance.transactions = data.finance.transactions.filter((t) => t.id !== id);

    data.finance.auditLogs.unshift({
      id: `audit_${Date.now()}`,
      action: 'delete',
      transactionId: id,
      details: `Deleted transaction ${id} (was ${tx.type} of ₹${tx.amount.toLocaleString('en-IN')})`,
      performedBy,
      timestamp: new Date().toISOString(),
    });

    recalculateFinanceBalances(data);
    saveDatabase(data);

    return {
      success: true,
      summary: db.getFinanceSummary(),
    };
  },

  getFinanceAuditLogs: (): FinanceAuditLog[] => {
    const data = getDatabase();
    return data.finance.auditLogs || [];
  },
};

