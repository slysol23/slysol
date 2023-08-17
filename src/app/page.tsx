import ContainerLayout from '@/components/ContainerLayout';
import Button from '@/components/Button';
import Image from 'next/image';
import { Variants, motion } from 'framer-motion';
import AnimatedStar from '@/components/Home/AnimatedStar';

export default function Home() {
  const introPictureVariants: Variants = {
    hide: {
      opacity: 0,
      y: 500,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 2,
      },
    },
  };

  return (
    <ContainerLayout className="md:py-10 py-5">
      <div className="grid md:grid-cols-[40%_60%] gap-5">
        <div className="md:my-auto md:mx-0 mx-auto">
          <h1 className="lg:text-5xl md:text-4xl text-3xl font-bold text-[#6F83DC]">
            Your <br /> <span className="text-[#EB577B]">Gateway</span> <br />{' '}
            To Clever <br /> IT Solutions
          </h1>
          <Button text="REQUEST A CONSULTATION" className="md:mt-10 mt-5" />
        </div>
        <div className="flex items-center md:justify-end justify-center">
          <AnimatedStar />
          <div>
            <Image
              src="/images/home/header.png"
              alt="united hands"
              width={600}
              height={600}
            />
          </div>
        </div>
      </div>
    </ContainerLayout>
  );
}
