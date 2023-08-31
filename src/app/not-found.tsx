import Container from '@/components/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 | Slysol',
  description:
    'The content you are trying to reach is not present in this website try different keywords',
  keywords: 'Slysol',
};

export default function NotFound() {
  return (
    <>
      <Container className="text-3xl font-neue text-center">
        <p>404 | Could not find requested resource</p>
      </Container>
    </>
  );
}
