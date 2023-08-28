import Header from '@/components/Header';
import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
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
      <body className={`${NeueMachina.variable} font-sans]`}>
        <Header />
        <main className="mt-[69px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
