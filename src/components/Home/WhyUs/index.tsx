import Container from '@/components/Container';
import ScrollAnimation from '@/components/ScrollAnimation';
import Section from '@/components/Section';
import Title from '@/components/Title';
import Image from 'next/image';
import React from 'react';

const WhyUs = () => {
  const whyUsContent = [
    {
      imageSrc: '/images/home/why-us1.png',
      heading: 'Reach New Heights',
      description:
        'With Slysol elevate your journey and reach new heights of success through our expert guidance and unwavering support.',
    },
    {
      imageSrc: '/images/home/why-us2.png',
      heading: 'Always At Your Service',
      description:
        'Our 24-hour support ensures your peace of mind, resolving your queries swiftly and efficiently.',
    },
    {
      imageSrc: '/images/home/why-us3.png',
      heading: 'Better Experince',
      description:
        'Upgrade your journey with us for a better experience, where excellence is our standard and your satisfaction is our goal.',
    },
  ];

  return (
    <Container>
      <Section>
        <Title text="Why Us" className="text-center" />
        <div
          className="grid lg:grid-cols-[12.5%_25%_25%_25%_12.5%]
       md:grid-cols-3 gap-10 justify-center sm:pt-10 pt-5"
        >
          <div className="hidden lg:block"></div>
          {whyUsContent.map((content, index) => (
            <div key={`whyUsContent-${index}`} className="text-center">
              <ScrollAnimation>
                <Image
                  src={content.imageSrc}
                  alt={content.heading}
                  width={200}
                  height={200}
                  className="mx-auto mb-5"
                />
              </ScrollAnimation>
              <h3 className="font-bold mb-2">{content.heading}</h3>
              <p className="text-sm">{content.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </Container>
  );
};

export default WhyUs;
