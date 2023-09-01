import Container from '@/components/Container';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 | Slysol',
  description:
    'The content you are trying to reach is not present in this website try different keywords',
  keywords: 'Slysol',
};

export default function NotFound() {
  return (
    <>
      <Container className="text-3xl font-neue text-center flex flex-col items-center">
        <Link href={'/'}>
          <Image
            src="/icons/slysol-icon.svg"
            alt="Slysol"
            width={100}
            height={100}
          />
        </Link>
        <p className="mt-8">404 | Could not find requested resource</p>
      </Container>
    </>
  );
}
