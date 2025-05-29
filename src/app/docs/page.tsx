import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import Button from '@/components/UI/Button';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-6">
            Documentation
          </h1>
          <div className="bg-[var(--card)] p-8 rounded-[var(--global-radius)] border border-[var(--border)] shadow-sm">
            <p className="text-xl text-[var(--muted)] mb-8">
              Our comprehensive documentation is coming soon...
            </p>
            <div className="flex justify-center">
              <Link href="/">
                <Button variant="primary">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}