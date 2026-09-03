import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GOVERNMENT OF INDIA | MPLADS AUDIT DIRECTORATE // NIREEKSHAK',
  description:
    'National Intelligent Real-Time Evaluation & Explainable Knowledge System for High-Risk Audit of MPLADS Projects (SIH26102)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gruv-bgHard text-gruv-fg min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
