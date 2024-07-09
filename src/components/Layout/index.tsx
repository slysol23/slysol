import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';
import Container from '../Container';

interface LayoutProps {
  children: ReactNode;
  container?: boolean;
}

export default function Layout({ children, container = false }: LayoutProps) {
  return (
    <>
      <Container hScreen={false}>
        <Header />
      </Container>
      <main className="font-basic">
        {container ? <Container>{children}</Container> : children}
      </main>
      <Footer />
    </>
  );
}
