'use client';

/**
 * Lightweight, privacy-respecting client analytics helper for ALIF FRIENDS 12.
 * Completely independent of Firebase SDK.
 */

export async function trackCustomEvent(eventName: string, params: Record<string, any> = {}) {
  // Safe client event tracker (no-op or lightweight internal logging)
  if (process.env.NODE_ENV === 'development') {
    // Debug logging in development only
    // console.debug(`[Analytics] ${eventName}:`, params);
  }
}

export async function trackPageView(pagePath: string, pageTitle?: string) {
  if (pagePath.startsWith('/admin') || pagePath.startsWith('/api')) return;
  await trackCustomEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || (typeof document !== 'undefined' ? document.title : ''),
  });
}

export async function trackMagazineView(edition: number | string, title: string) {
  await trackCustomEvent('view_magazine', {
    edition: String(edition),
    magazine_title: title,
  });
}

export async function trackArticleView(articleId: string, title: string, category: string) {
  await trackCustomEvent('view_article', {
    article_id: articleId,
    article_title: title,
    article_category: category,
  });
}

export async function trackVideoPlay(videoId: string, title: string) {
  await trackCustomEvent('play_video', {
    video_id: videoId,
    video_title: title,
  });
}

export async function trackGalleryView(albumId: string, albumTitle: string) {
  await trackCustomEvent('view_gallery', {
    album_id: albumId,
    album_title: albumTitle,
  });
}

export async function trackAppDownloadClick(location: 'header' | 'hero' | 'footer' | 'menu' | 'modal') {
  await trackCustomEvent('app_download_click', {
    button_location: location,
    timestamp: Date.now(),
  });
}

export async function trackEngagement(action: string, category: string, label?: string) {
  await trackCustomEvent('user_engagement_action', {
    action,
    category,
    label: label || '',
  });
}
