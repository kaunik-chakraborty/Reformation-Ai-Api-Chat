// ✅ No 'use client' here
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import '../styles/code.css';
import ThemeProvider from '../components/UI/ThemeProvider';
import ClientOnly from '@/components/UI/ClientOnly';
import CustomCursor from '@/components/UI/CustomCursor';
import ServiceWorkerRegistrar from '../components/UI/ServiceWorkerRegistrar';

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Reformation AI - Intelligent Conversations',
  description: 'Experience the power of AI-driven conversations with Reformation AI. Get instant, intelligent responses to your questions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeProvider>
          {children}
          <ClientOnly>
            <CustomCursor />
            <ServiceWorkerRegistrar /> {/* Moved useEffect here */}
          </ClientOnly>
        </ThemeProvider>
      </body>
    </html>
  );
}
