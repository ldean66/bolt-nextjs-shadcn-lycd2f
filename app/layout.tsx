import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'More Than Conquerors – Breast Cancer Awareness Movement',
  description: 'More Than Conquerors: Breast Cancer Awareness Movement empowering women to conquer cancer together.',
  openGraph: {
    title: 'More Than Conquerors – Breast Cancer Awareness Movement',
    description: 'Join the movement: More Than Conquerors supports and uplifts women affected by breast cancer.',
    images: '/img/MTCLogo_FullColor.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}