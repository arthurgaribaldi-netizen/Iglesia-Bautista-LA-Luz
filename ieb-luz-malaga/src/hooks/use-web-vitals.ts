'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals';

export function useWebVitals() {
  useEffect(() => {
    const sendToAnalytics = (metric: any) => {
      // Send to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }

      // Send to Sentry
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.addBreadcrumb({
          category: 'web-vitals',
          message: `${metric.name}: ${metric.value}`,
          level: 'info',
          data: {
            name: metric.name,
            value: metric.value,
            id: metric.id,
            delta: metric.delta,
          },
        });
      }
    };

    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);
}
