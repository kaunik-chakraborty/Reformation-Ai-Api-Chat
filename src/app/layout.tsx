import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import '../styles/code.css';
import ThemeProvider from '../components/UI/ThemeProvider';

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
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 