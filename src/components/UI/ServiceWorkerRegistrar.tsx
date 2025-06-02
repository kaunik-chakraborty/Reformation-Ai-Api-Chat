'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/utils/serviceWorker';

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    const timer = setTimeout(() => {
      registerServiceWorker().catch(err => {
        console.error('Failed to register service worker:', err);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
