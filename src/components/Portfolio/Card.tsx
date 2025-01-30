'use client';
import React, { useRef } from 'react';
import SubTitle from '../SubTitle';
import MainHeading from '../MainHeading';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface CardData {
  id: number;
  images: string[];
  title: string;
  subTitle: string;
  description: string;
  date: string;
  TechStacks: string[];
}

const cardsData: CardData[] = [
  {
    id: 1,
    images: [
      '/images/portfolio/orangeshine-1.webp',
      '/images/portfolio/orangeshine-2.webp',
      '/images/portfolio/orangeshine-3.webp',
    ],
    title: 'OrangeShine',
    subTitle: 'ECOMERCE PLATFORM',
    description:
      'OrangeShine is an e-commerce platform based in the United States, designed to support a wide range of vendors and clients. The platform offers an extensive collection of products, ranging from clothing to essential apparel, catering to a diverse selection of consumer needs.',
    date: '27-May-2024',
    TechStacks: [
      'ReactJS',
      'NextJS',
      'Python',
      'Django',
      'FastAPI',
      'ETL',
      'ElasticSearch',
      'WebSocket',
      'Database Schemas',
      'Apache Kafka',
      'AWS Cognito',
      'LogStash',
      'NodeJS',
      'NestJS',
      'TypeScript',
      'MaterialUI',
      'TailwindCSS',
      'PostgreSQL',
      'GraphQL',
      'KeyCloak',
    ],
  },
  {
    id: 2,
    images: [
      '/images/portfolio/alignerbase-1.webp',
      '/images/portfolio/alignerbase-2.webp',
      '/images/portfolio/alignerbase-3.webp',
    ],
    title: 'AlignerBase',
    subTitle: 'DENTAL & HEALTH CARE PLATFORM',
    description:
      'AlignerBase Platform empowers dental professionals to track treatment plans at every stage of the design workflow, facilitating direct communication with their design team. This seamless collaboration allows for easy requests for plan revisions, ensuring treatment plan perfection and optimal patient care. Domain: Dental and Health Care',
    date: '27-May-2024',
    TechStacks: [
      'React.js',
      'Django',
      'DRF',
      'Stripe',
      '3D Viewer',
      'Amazon S3',
      'AWS EC2',
      'AWS Lambda',
      'WebSocket',
      'Dockerization',
      'Swagger API',
    ],
  },
  {
    id: 3,
    images: [
      '/images/portfolio/aligner-portal-1.webp',
      '/images/portfolio/aligner-portal-2.webp',
      '/images/portfolio/aligner-portal-3.webp',
    ],
    title: 'AlignerBase Portal',
    subTitle: 'DENTAL & HEALTH CARE PORTAL',
    description: `AlignerBase Portal, a user-friendly web portal designed specifically for dental professionals to streamline the tracking and management of treatment plans throughout the design workflow. This platform enables dental professionals to efficiently monitor patient progress and facilitates direct communication with their design team to request revisions and adjustments, ensuring optimal treatment outcomes.`,
    date: '27-May-2024',
    TechStacks: [
      'React.js',
      'Django',
      'DRF',
      'Stripe',
      '3D Viewer',
      'Amazon S3',
      'AWS EC2',
      'AWS Lambda',
      'WebSocket',
      'Dockerization',
      'Swagger API',
    ],
  },
  {
    id: 4,
    images: [
      '/images/portfolio/sharove-1.webp',
      '/images/portfolio/sharove-2.webp',
      '/images/portfolio/sharove-3.webp',
    ],
    title: 'Sharove',
    subTitle: 'ECOMERCE PLATFORM',
    description: `The 2.0 update of the OrangeShine.com website was a significant upgrade that expanded the platform’s capabilities to serve both business (B2B) and individual (B2C) customers. This project involved enhancing the site's functionality while ensuring a seamless user experience for both customer segments.`,
    date: '27-May-2024',
    TechStacks: [
      'ReactJS',
      'NextJS',
      'Python',
      'Django',
      'FastAPI',
      'ETL',
      'ElasticSearch',
      'WebSocket',
      'Database Schemas',
      'Apache Kafka',
      'AWS Cognito',
      'LogStash',
      'NodeJS',
      'NestJS',
      'TypeScript',
      'MaterialUI',
      'TailwindCSS',
      'PostgreSQL',
      'GraphQL',
      'KeyCloak',
    ],
  },
  {
    id: 5,
    images: [
      '/images/portfolio/degree-1.webp',
      '/images/portfolio/degree-2.webp',
      '/images/portfolio/degree-3.webp',
    ],
    title: 'Degree 37',
    subTitle: 'HEALTH CARE PLATFORM',
    description:
      'Degree37 is an organization focused on improving the blood donation process through an efficient ERP platform. The platform makes it easier for donors and blood centers to connect, streamlining the donation process and creating a more rewarding experience for donors.',
    date: '27-May-2024',
    TechStacks: [
      'ReactJS',
      'NextJS',
      'WebSocket',
      'Database Schemas',
      'Apache Kafka',
      'AWS Cognito',
      'LogStash',
      'NodeJS',
      'NestJS',
      'TypeScript',
      'MaterialUI',
      'TailwindCSS',
      'PostgreSQL',
      'GraphQL',
      'KeyCloak',
    ],
  },
  {
    id: 6,
    images: [
      '/images/portfolio/mk-1.webp',
      '/images/portfolio/mk-2.webp',
      '/images/portfolio/mk-3.webp',
    ],
    title: 'MK Engineering',
    subTitle: 'PORTFOLIO SITE',
    description:
      'A professional and responsive website for MK Engineering, an engineering firm. The platform serves as a digital hub for the company to showcase its portfolio, products, and accomplishments, enhancing its online presence and credibility.',
    date: '27-May-2024',
    TechStacks: [
      'ReactJS',
      'NextJS',
      'TailwindCSS',
      'MaterialUI',
      'Strappi Integration',
      'AWS',
    ],
  },
  {
    id: 7,
    images: [
      '/images/portfolio/iblag-1.webp',
      '/images/portfolio/iblag-2.webp',
      '/images/portfolio/iblag-3.webp',
    ],
    title: 'Iblag',
    subTitle: 'REAL-TIME COMMUNICATION',
    description:
      'Iblagh is a secure, end-to-end encryption-based chat application designed specifically for organization members. The platform facilitates both one-on-one and group discussions, ensuring safe and private communication within teams.',
    date: '27-May-2024',
    TechStacks: ['PHP', 'CodeIgnitor', 'Kotlin', 'AWS', 'Restful API', 'MySQL'],
  },
  {
    id: 8,
    images: [
      '/images/portfolio/pashione-1.webp',
      '/images/portfolio/pashione-2.webp',
      '/images/portfolio/pashione-3.webp',
    ],
    title: 'Pashione',
    subTitle: 'MULTI VENDOR ECOMERCE PLATFORM',
    description:
      'Pashione is a social commerce platform designed to transform the fashion landscape for Africans and beyond. Built to bridge the gap in access to global fashion brands, Pashione offers a seamless, scalable, and feature-rich e-commerce experience.',
    date: '27-May-2024',
    TechStacks: [
      'ReactJS',
      'NextJS',
      'Django',
      'DRF',
      'Redis',
      'AWS',
      'Stripe',
      'OneApp',
      'PostgreSQL',
      'Celery',
      'RabbitMQ',
      'Swagger API',
    ],
  },
  {
    id: 9,
    images: [
      '/images/portfolio/merlin-1.webp',
      '/images/portfolio/merlin-2.webp',
      '/images/portfolio/merlin-3.webp',
    ],
    title: 'Merlin Models',
    subTitle: 'AI-Powered Financial Analysis & Forecasting',
    description:
      'This AI-powered tool enables users to upload various types of financial data, including images, PDFs, text files, and Excel sheets containing income statements, profit and loss reports, and balance sheets. The system intelligently detects the input type, extracts relevant financial information, and processes it using a custom AI model to predict future growth through financial forecasting.',
    date: '27-May-2024',
    TechStacks: [
      'ReactJS',
      'NextJS',
      'Django',
      'DRF',
      'Redis',
      'AWS',
      'PostgreSQL',
      'Celery',
      'Pyxl',
    ],
  },
  {
    id: 10,
    images: [
      '/images/portfolio/nejo-ai-1.webp',
      '/images/portfolio/nejo-ai-2.webp',
      '/images/portfolio/nejo-ai-3.webp',
    ],
    title: 'Nejo AI',
    subTitle:
      'AI-Powered Tool for Turning Documents into Engaging Audio Summaries',
    description:
      'An innovative AI-powered tool that transforms lengthy documents into engaging, podcast-style audio. Designed to enhance learning efficiency, this solution extracts key insights and summaries from documents, converting them into high-quality spoken content.',
    date: '27-May-2024',
    TechStacks: [
      'ReactJS',
      'NextJS',
      'Django',
      'DRF',
      'Redis',
      'AWS',
      'PostgreSQL',
      'Celery',
      'Docker',
      'Stripe',
    ],
  },
  {
    id: 11,
    images: [
      '/images/portfolio/neuronus-1.webp',
      '/images/portfolio/neuronus-2.webp',
      '/images/portfolio/neuronus-3.webp',
    ],
    title: 'Neuronus Computing',
    subTitle: 'Portfolio for Neuronus, Powered by Strapi CMS',
    description:
      'A fully animated and responsive portfolio website for Neuronus, designed to showcase their projects, blogs, and company details in an engaging and dynamic manner. The platform is powered by Strapi CMS, enabling seamless content management and updates.',
    date: '27-May-2024',
    TechStacks: [
      'ReactJS',
      'NextJS',
      'TailwindCSS',
      'Strapi Integration',
      'Custom Animations',
      'AWS',
    ],
  },
];

const Card = () => {
  const [currentImage, setCurrentImage] = React.useState(2);
  const [currentCard, setCurrentCard] = React.useState(cardsData[0]);
  const [allCards, setAllCards] = React.useState(cardsData.slice(1));
  const [animation, setAnimation] = React.useState({
    image1: {},
    image2: {},
    image3: {},
    placeholder1: {
      x: ['0vw'],
      y: ['0vh'],
      scale: [1],
      opacity: [0],
    },
    placeholder2: {
      x: ['0vw'],
      y: ['0vh'],
      scale: [1],
      opacity: [0],
    },
    placeholder3: {
      x: ['0vw'],
      y: ['0vh'],
      scale: [1],
      opacity: [0],
    },
  });

  const cardVisible = useRef<HTMLDivElement>(null);

  const scrollToCard = () => {
    cardVisible?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCardClick = (id: number) => {
    const filteredCardsData = cardsData.filter(
      (cardData) => cardData.id !== id,
    );
    const selectedCardData = allCards.filter((cardData) => cardData.id === id);
    setAllCards(filteredCardsData);
    setCurrentCard(selectedCardData[0]);
  };

  const handleNext = () => {
    setTimeout(() => {
      setCurrentImage((prev) => (prev === 2 ? 0 : prev + 1));
    }, 600);
    setAnimation((prev) => {
      return {
        ...prev,
        image1: {
          x: ['0vw'],
          y: ['5vh', '0vh'],
          opacity: [0, 0, 0, 0.8, 1],
        },
        image2: {
          x: ['10vw', '0vw'],
          y: ['5vh', '0vh'],
          opacity: [0, 0, 0, 0.8, 1],
        },
        image3: {
          x: ['-10vw', '0vw'],
          y: ['-10vh', '0vh'],
          opacity: [0, 0, 0, 0.8, 1],
        },
        placeholder1: {
          x: ['5vw', '30vw'],
          y: ['0vh', '-5vh', '-2vh'],
          scale: [0.8],
          opacity: [0.6, 0.2, 0],
        },
        placeholder2: {
          x: ['0vw'],
          y: ['-4vh', '-12vh'],
          scale: [0.8],
          opacity: [0.6, 0.2, 0],
        },
        placeholder3: {
          x: ['-8vw', '-30vw'],
          y: ['0vh', '15vh'],
          scale: [0.5],
          opacity: [0.6, 0.2, 0],
        },
      };
    });
    setTimeout(() => {
      setAnimation((prev) => ({
        ...prev,
        image1: {
          x: ['0vw'],
          y: ['0vh'],
          opacity: [1],
        },
        image2: {
          x: ['0vw'],
          y: ['0vh'],
          opacity: [1],
        },
        image3: {
          x: ['0vw'],
          y: ['0vh'],
          opacity: [1],
        },
        placeholder1: {
          x: ['0vw'],
          y: ['0vh'],
          scale: [1],
          opacity: [0],
        },
        placeholder2: {
          x: ['0vw'],
          y: ['0vh'],
          scale: [1],
          opacity: [0],
        },
        placeholder3: {
          x: ['0vw'],
          y: ['0vh'],
          scale: [1],
          opacity: [0],
        },
      }));
    }, 1500);
  };

  const handlePrev = () => {
    setTimeout(() => {
      setCurrentImage((prev) => (prev === 0 ? 2 : prev - 1));
    }, 600);
    setAnimation({
      image1: {
        x: ['10vw', '0vw'],
        y: ['-5vh', '0vh'],
        opacity: [0, 0, 0, 0.8, 1],
      },
      image2: {
        x: ['0vw'],
        y: ['-5vh', '0vh'],
        opacity: [0, 0, 0, 0.8, 1],
      },
      image3: {
        x: ['-10vw', '0vw'],
        y: ['10vh', '0vh'],
        opacity: [0, 0, 0, 0.8, 1],
      },
      placeholder1: {
        x: ['0vw'],
        y: ['4vh', '12vh'],
        scale: [0.8],
        opacity: [0.6, 0.2, 0],
      },
      placeholder2: {
        x: ['5vw', '30vw'],
        y: ['0vh', '5vh', '2vh'],
        scale: [0.8],
        opacity: [0.6, 0.2, 0],
      },
      placeholder3: {
        x: ['-8vw', '-30vw'],
        y: ['0vh', '-15vh'],
        scale: [0.5],
        opacity: [0.6, 0.2, 0],
      },
    });
    setTimeout(() => {
      setAnimation({
        image1: {
          x: ['0vw'],
          y: ['0vh'],
          opacity: [1],
        },
        image2: {
          x: ['0vw'],
          y: ['0vh'],
          opacity: [1],
        },
        image3: {
          x: ['0vw'],
          y: ['0vh'],
          opacity: [1],
        },
        placeholder1: {
          x: ['0vw'],
          y: ['0vh'],
          scale: [1],
          opacity: [0],
        },
        placeholder2: {
          x: ['0vw'],
          y: ['0vh'],
          scale: [1],
          opacity: [0],
        },
        placeholder3: {
          x: ['0vw'],
          y: ['0vh'],
          scale: [1],
          opacity: [0],
        },
      });
    }, 1500);
  };

  return (
    <>
      <div className="flex gap-10" ref={cardVisible}>
        <div className="w-1/5 m-auto lg:block hidden">
          <div className="relative">
            <motion.div animate={animation.image1} transition={{ duration: 2 }}>
              <Image
                src={
                  currentCard.images[
                    currentImage === 2 ? 0 : currentImage === 0 ? 1 : 2
                  ]
                }
                className="w-full h-[200px] object-cover shadow-md rounded-xl mb-5 cursor-pointer"
                alt={currentCard.title}
                width={500}
                height={500}
              />
            </motion.div>
            <motion.div
              animate={animation.placeholder1}
              transition={{ duration: 1 }}
              className="absolute h-full w-full top-0 rounded-lg"
            >
              <Image
                src={
                  currentCard.images[
                    currentImage === 2 ? 0 : currentImage === 0 ? 1 : 2
                  ]
                }
                className="w-full h-[200px] object-cover shadow-md rounded-xl"
                alt={currentCard.title}
                width={500}
                height={500}
              />
            </motion.div>
          </div>
          <div className="relative">
            <motion.div animate={animation.image2} transition={{ duration: 2 }}>
              <Image
                src={
                  currentCard.images[
                    currentImage === 2 ? 1 : currentImage === 0 ? 2 : 0
                  ]
                }
                className="w-full h-[200px] object-cover shadow-md rounded-xl cursor-pointer"
                alt={currentCard.title}
                width={500}
                height={500}
              />
            </motion.div>
            <motion.div
              animate={animation.placeholder2}
              transition={{ duration: 1 }}
              className="absolute h-full w-full top-0 rounded-lg"
            >
              <Image
                src={
                  currentCard.images[
                    currentImage === 2 ? 1 : currentImage === 0 ? 2 : 0
                  ]
                }
                className="w-full h-[200px] object-cover rounded-xl"
                alt={currentCard.title}
                width={500}
                height={500}
              />
            </motion.div>
          </div>
        </div>
        <div className="bg-slate grid md:grid-cols-[2fr_3fr] md:gap-8 gap-12 p-5 rounded-2xl flex-1 shadow-xl">
          <div className="flex flex-col justify-between md:order-1 order-2">
            <div>
              <SubTitle text={currentCard.subTitle} />
              <MainHeading text={currentCard.title} />
              <p className="text-mute mt-3">{currentCard.description}</p>
            </div>
            <div className="gap-5 md:flex hidden">
              <ChevronLeftIcon
                width={35}
                cursor={'pointer'}
                onClick={handlePrev}
              />
              <ChevronRightIcon
                width={35}
                cursor={'pointer'}
                onClick={handleNext}
              />
            </div>
          </div>
          <div className="relative md:order-2 order-1">
            <motion.div animate={animation.image3} transition={{ duration: 2 }}>
              <Image
                src={currentCard.images[currentImage]}
                alt={currentCard.title}
                height={1000}
                width={1000}
                className="w-full md:h-[400px] h-[200px] object-contain rounded-xl"
              />
            </motion.div>
            <motion.div
              animate={animation.placeholder3}
              transition={{ duration: 1 }}
              className="absolute h-full w-full top-0 rounded-lg"
            >
              <Image
                src={currentCard.images[currentImage]}
                alt={currentCard.title}
                height={1000}
                width={1000}
                className="w-full md:h-[400px] h-[200px] object-cover rounded-xl"
              />
            </motion.div>
            <div className="flex gap-5 absolute -bottom-10 w-full justify-center md:hidden">
              <ChevronLeftIcon
                width={35}
                cursor={'pointer'}
                onClick={handlePrev}
              />
              <ChevronRightIcon
                width={35}
                cursor={'pointer'}
                onClick={handleNext}
              />
            </div>
          </div>
        </div>
      </div>
      {/* ALL Products */}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-10 md:pt-20 pt-10">
        {cardsData
          .filter((card) => card.title !== currentCard.title)
          .map((card) => (
            <div
              className="overflow-hidden rounded-lg shadow-lg"
              key={card.title}
              onClick={() => {
                handleCardClick(card.id);
                scrollToCard();
              }}
            >
              <Image
                src={card.images[0]}
                alt=""
                width={1000}
                height={600}
                className="w-full h-[200px] object-cover"
              />
              <div className="p-4 text-center mt-5 h-[200px]">
                <MainHeading text={card.title} />
                <p className="text-mute text-sm">{card.date}</p>
                <p className="text-mute text-xs mt-5">
                  {card.TechStacks.join(' | ')}
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Card;
