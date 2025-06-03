import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that don't require authentication
const publicRoutes = createRouteMatcher([
  '/',
  '/docs',
  '/login',
  '/signup',
  '/api(.*)',
  '/chat',
  '/chat/(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow users to access public routes without authentication
  if (publicRoutes(req)) {
    return;
  }
  
  // For other routes, we'll check authentication
  // But we've already included chat routes in publicRoutes
  // so both authenticated and unauthenticated users can use the chat
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(js|css|jpg|jpeg|png|gif|ico|svg)).*)',
    // Always run for API routes
    '/api/(.*)',
  ],
};