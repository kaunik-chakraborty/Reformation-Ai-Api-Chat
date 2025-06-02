/**
 * Service Worker Registration Utility
 * 
 * This utility safely registers a service worker only when the document is in a valid state
 * and the environment supports service workers.
 */

export function registerServiceWorker(swPath: string = '/service-worker.js'): Promise<ServiceWorkerRegistration | null> {
  return new Promise((resolve, reject) => {
    // Only register in secure contexts (HTTPS or localhost)
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported in this browser');
      return resolve(null);
    }

    // Check if we're in a browser context
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      console.log('Not in browser context');
      return resolve(null);
    }

    // Wait for the page to be fully loaded and in a valid state
    const registerWhenReady = () => {
      // Only register when document is fully loaded and ready
      if (document.readyState === 'complete') {
        // Delay registration slightly to ensure document is in valid state
        setTimeout(() => {
          navigator.serviceWorker.register(swPath)
            .then((registration) => {
              console.log('Service Worker registered successfully:', registration.scope);
              resolve(registration);
            })
            .catch((error) => {
              console.error('Service Worker registration failed:', error);
              reject(error);
            });
        }, 100);
      } else {
        // If document not ready, wait and try again
        window.addEventListener('load', registerWhenReady, { once: true });
      }
    };

    registerWhenReady();
  });
}

/**
 * Unregister all service workers and clear caches
 */
export function unregisterServiceWorkers(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!('serviceWorker' in navigator)) {
      return resolve(false);
    }

    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
        console.log('Service workers unregistered');
        
        // Also clear caches
        if ('caches' in window) {
          caches.keys()
            .then((cacheNames) => {
              return Promise.all(
                cacheNames.map((cacheName) => {
                  return caches.delete(cacheName);
                })
              );
            })
            .then(() => {
              console.log('Caches cleared');
              resolve(true);
            });
        } else {
          resolve(true);
        }
      });
  });
}