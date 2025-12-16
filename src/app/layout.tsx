// @ts-ignore: Allow side-effect import of global CSS without type declarations
import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Basic } from 'next/font/google';
import { AppContextsProvider } from 'providers';
import { SessionProvider } from 'next-auth/react';

const NeueMachina = localFont({
  src: [
    { path: '../../public/fonts/NeueMachina-Light.otf', weight: '100' },
    { path: '../../public/fonts/NeueMachina-Regular.otf', weight: '400' },
    { path: '../../public/fonts/NeueMachina-Ultrabold.otf', weight: '700' },
  ],
  variable: '--font-neue',
});

const basic = Basic({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-basic',
});

export const metadata: Metadata = {
  title: 'Home | Slysol',
  generator: 'Next.js',
  applicationName: 'Slysol',
  category: 'technology',
  referrer: 'origin-when-cross-origin',
  keywords: ['Slysol', 'Web Development', 'App Development'],
  metadataBase: new URL('https://slysol.com'),
  authors: [{ name: 'Slysol' }, { name: 'Slysol', url: 'https://slysol.com' }],
  colorScheme: 'light',
  creator: 'SlySol',
  publisher: 'Slysol',
  openGraph: {
    url: 'https://slysol.com',
    siteName: 'Slysol',
    locale: 'en_US',
    type: 'website',
  },
  formatDetection: { email: true, address: true, telephone: true },
  icons: { icon: '/icon.png' },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="WSFplsjjbt13v0ikzPDoAG_kE1hkZhqI1kD2wv5WpiM"
        />
        <script src="/ckeditor/ckeditor.js" async></script>
      </head>
      <body className={`${NeueMachina.variable} ${basic.variable} text-dark`}>
        <SessionProvider>
          <AppContextsProvider>{children}</AppContextsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
