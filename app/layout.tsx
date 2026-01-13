import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : new URL('https://morethan-conquerors.com');

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'More Than Conquerors',
    template: '%s | More Than Conquerors',
  },
  description:
    'More Than Conquerors is a nonprofit breast cancer support and education organization empowering patients, survivors, caregivers, and families with resources, community, and hope.',
  keywords: [
    'More Than Conquerors',
    'breast cancer support',
    'breast cancer education',
    'breast cancer resources',
    'breast cancer survivors',
    'caregivers',
    'community support group',
    'Clifton NJ',
    'New Jersey nonprofit',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'More Than Conquerors',
    title: 'More Than Conquerors – Breast Cancer Support & Education',
    description:
      'Support and education for patients, survivors, caregivers, and families affected by breast cancer. Resources, community, and ways to get involved.',
    images: [
      {
        url: '/img/MTCLogo_FullColor.png',
        width: 1200,
        height: 630,
        alt: 'More Than Conquerors logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'More Than Conquerors – Breast Cancer Support & Education',
    description:
      'Support and education for patients, survivors, caregivers, and families affected by breast cancer.',
    images: ['/img/MTCLogo_FullColor.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}