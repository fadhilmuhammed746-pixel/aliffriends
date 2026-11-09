'use client';

import { logEvent } from 'firebase/analytics';
import { getAnalyticsInstance } from './client';

/**
 * Strips sensitive PII and limits string lengths for analytics event parameters
 */
function sanitizeParam(val: any): string | number | boolean {
  if (typeof val === 'number' || typeof val === 'boolean') {
    return val;
  }
  if (!val) return '';
  const str = String(val).trim();
  // Never collect email addresses
  if (str.includes('@') && str.includes('.')) {
    return '[REDACTED_EMAIL]';
  }
  return str.slice(0, 100);
}

/**
 * Helper to safely log an event to Firebase Analytics
 */
export async function trackCustomEvent(eventName: string, params: Record<string, any> = {}) {
  try {
    const analytics = await getAnalyticsInstance();
    if (!analytics) return;

    // Sanitize parameters to prevent leaking sensitive info
    const safeParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(params)) {
      if (['password', 'email', 'phone', 'amount', 'token', 'secret'].includes(key.toLowerCase())) {
        continue;
      }
      safeParams[key] = sanitizeParam(value);
    }

    logEvent(analytics, eventName, safeParams);
  } catch (err) {
    // Analytics failure should never break UI execution
    console.debug('Analytics logEvent notice:', err);
  }
}

/**
 * Tracks public page views (excludes admin & internal routes)
 */
export async function trackPageView(pagePath: string, pageTitle?: string) {
  if (pagePath.startsWith('/admin') || pagePath.startsWith('/api')) {
    return;
  }
  await trackCustomEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || (typeof document !== 'undefined' ? document.title : ''),
  });
}

/**
 * Tracks Magazine 3D Flipbook interactions & views
 */
export async function trackMagazineView(edition: number | string, title: string) {
  await trackCustomEvent('view_magazine', {
    edition: String(edition),
    magazine_title: title,
    content_type: 'magazine',
  });
}

/**
 * Tracks Newspaper article views
 */
export async function trackArticleView(articleId: string, title: string, category: string) {
  await trackCustomEvent('view_article', {
    article_id: articleId,
    article_title: title,
    article_category: category,
    content_type: 'newspaper',
  });
}

/**
 * Tracks Video plays and documentary interactions
 */
export async function trackVideoPlay(videoId: string, title: string) {
  await trackCustomEvent('play_video', {
    video_id: videoId,
    video_title: title,
    content_type: 'video',
  });
}

/**
 * Tracks Photo Gallery album views
 */
export async function trackGalleryView(albumId: string, albumTitle: string) {
  await trackCustomEvent('view_gallery', {
    album_id: albumId,
    album_title: albumTitle,
    content_type: 'gallery',
  });
}

/**
 * Tracks Download App button clicks across Desktop Header, Mobile Menu, Hero, and Footer
 */
export async function trackAppDownloadClick(location: 'header' | 'hero' | 'footer' | 'menu' | 'modal') {
  await trackCustomEvent('app_download_click', {
    button_location: location,
    timestamp: Date.now(),
  });
}

/**
 * Tracks general editorial engagement
 */
export async function trackEngagement(action: string, category: string, label?: string) {
  await trackCustomEvent('user_engagement_action', {
    action,
    category,
    label: label || '',
  });
}

