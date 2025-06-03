'use client';

import { SignUp } from '@clerk/nextjs';
import MainLayout from '@/components/Layout/MainLayout';

export default function SignUpPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <SignUp />
      </div>
    </MainLayout>
  );
}