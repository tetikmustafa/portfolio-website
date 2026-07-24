import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV Builder | Mustafa Tetik',
  description:
    'AI-powered ATS resume tailoring and LaTeX-to-PDF compilation tool by Mustafa Tetik.',
  robots: { index: false, follow: false }, // Private tool — no indexing
};

export default function CvBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
