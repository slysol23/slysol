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
      '/images/portfolio/orangeshine-1.png',
      '/images/portfolio/orangeshine-2.png',
      '/images/portfolio/orangeshine-3.png',
    ],
    title: 'OrangeShine',
    subTitle: 'ECOMERCE PLATFORM',
    description:
      'Orange Shine is an e-commerce platform based in the United States that accommodates numerous vendors and clients. The platform boasts an extensive collection of products ranging from clothing to essential apparel, offering a diverse selection for consumers.',
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
      '/images/portfolio/alignerbase-1.jpg',
      '/images/portfolio/alignerbase-2.jpg',
      '/images/portfolio/alignerbase-3.png',
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
      '/images/portfolio/aligner-portal-1.png',
      '/images/portfolio/aligner-portal-2.png',
      '/images/portfolio/aligner-portal-3.png',
    ],
    title: 'AlignerBase Portal',
    subTitle: 'DENTAL & HEALTH CARE PORTAL',
    description: `The AlignerBase Portal is a comprehensive web portal designed specifically for dental professionals to facilitate efficient tracking and management of treatment plans throughout the design workflow. With this platform, dental professionals can monitor their patient's treatment progress and communicate directly with their design team to request revisions and adjustments as needed to achieve the desired results.`,
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
      '/images/portfolio/sharove-1.png',
      '/images/portfolio/sharove-2.png',
      '/images/portfolio/sharove-3.png',
    ],
    title: 'Sharove',
    subTitle: 'ECOMERCE PLATFORM',
    description: `Sharove is the 2.0 version of the OrangeShine.com E-Commerce platform. The scope is to expanded the platform's capabilities to serve both business (B2B) and individual (B2C) customers.`,
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
      '/images/portfolio/degree-1.png',
      '/images/portfolio/degree-2.png',
      '/images/portfolio/degree-3.png',
    ],
    title: 'Degree 37',
    subTitle: 'HEALTH CARE PLATFORM',
    description:
      'Degree37 is a dynamic company dedicated to revolutionizing the blood donation landscape. With a heartfelt commitment to saving lives, Degree37 streamlines the donation process, making it more accessible and rewarding for donors. The organization tirelessly works to bridge gaps between blood centers and donors by leveraging cutting-edge technologies, fostering educational outreach, and hosting engaging blood drives.',
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
      '/images/portfolio/mk-2.png',
      '/images/portfolio/mk-3.png',
    ],
    title: 'MK Engineering',
    subTitle: 'PORTFOLIO SITE',
    description:
      'MK Engineering is an Engineering firm based in Pakistan. The scope of this project was to provide a platform where the company can display their portfolio, products and the accomplishments.',
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
      '/images/portfolio/iblag-1.svg',
      '/images/portfolio/iblag-2.svg',
      '/images/portfolio/iblag-3.svg',
    ],
    title: 'Iblag',
    subTitle: 'REAL-TIME COMMUNICATION',
    description:
      'Iblagh is an end-to-end encryption-based chat application for members of the organization. This chat app lets you start discussions one on one and between group members as well. Members can also create and share surveys in the chat groups. The election module is also introduced in later development for multi-hierarchy departments.',
    date: '27-May-2024',
    TechStacks: ['PHP', 'CodeIgnitor', 'Kotlin', 'AWS', 'Restful API', 'MySQL'],
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
                  {card.TechStacks.length
                    ? card.TechStacks.map((techStack, index) =>
                        index > 0 && index <= card.TechStacks.length
                          ? `${techStack} | `
                          : techStack,
                      )
                    : ''}
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Card;
