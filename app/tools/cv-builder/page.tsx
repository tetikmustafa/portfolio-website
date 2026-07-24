import { Suspense } from 'react';
import CvBuilderClient from '@/components/cv-builder/CvBuilderClient';

export default function CvBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading builder...</div>}>
      <CvBuilderClient />
    </Suspense>
  );
}
