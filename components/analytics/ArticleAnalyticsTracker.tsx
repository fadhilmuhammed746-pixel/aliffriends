'use client';

import { useEffect } from 'react';
import { trackArticleView } from '@/lib/firebase/analytics';

interface ArticleAnalyticsTrackerProps {
  id: string;
  title: string;
  category: string;
}

export function ArticleAnalyticsTracker({ id, title, category }: ArticleAnalyticsTrackerProps) {
  useEffect(() => {
    trackArticleView(id, title, category);
  }, [id, title, category]);

  return null;
}
