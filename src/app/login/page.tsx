'use client';

import { SignIn } from '@clerk/nextjs';
import MainLayout from '@/components/Layout/MainLayout';

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <SignIn />
      </div>
    </MainLayout>
  );
}