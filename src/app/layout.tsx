import Header from '@/components/Header';
import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Basic } from 'next/font/google';
import Footer from '@/components/Footer';

const NeueMachina = localFont({
  src: [
    {
      path: '../../public/fonts/NeueMachina-Light.otf',
      weight: '100',
    },
    {
      path: '../../public/fonts/NeueMachina-Regular.otf',
      weight: '400',
    },
    {
      path: '../../public/fonts/NeueMachina-Ultrabold.otf',
      weight: '700',
    },
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
  description: 'Slysol home page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${NeueMachina.variable} ${basic.variable}`}>
        <Header />
        <main className="mt-[69px] font-basic">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
