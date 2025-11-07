'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const ScrollHandler = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  return null;
};

export default ScrollHandler;
