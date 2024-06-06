import Container from '@/components/Container';
import Button from '@/components/Button';
import Image from 'next/image';
import WhyUs from '@/components/Home/WhyUs';
import Slider from '@/components/Home/ClientFeedback/Slider';
import { Metadata } from 'next';
import { CiMail, CiPhone } from 'react-icons/ci';
import Header from '@/components/Header';
import SubTitle from '@/components/SubTitle';
import Section from '@/components/Section';
import MainHeading from '@/components/MainHeading';
import ServicesShowcase from '@/components/Home/ServicesShowcase';
import Title from '@/components/Title';
import GradientText from '@/components/GradientText';
import PerfectCenter from '@/components/PerfectCenter';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  description:
    'Welcome to SlySol - Your Ultimate IT Solution Provider. Elevate your business with our expert Web Development, Application Development, and Internal App Development services. Unlock innovative solutions tailored to your needs and drive digital transformation with SlySol by your side.',
};

export default function Home() {
  return (
    <>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#CBFCD8] via-[#B9E6E6] to-[#96BCFD]">
        <div className="border-b-[1px] md:text-sm text-xs sm:py-0 py-1">
          <Container
            hScreen={false}
            className="sm:h-[50px] flex sm:flex-row flex-col justify-between items-center gap-1"
          >
            <p>Mon-Fri: 11:00 AM - 8:00 PM</p>
            <div className="flex sm:flex-row flex-col sm:gap-5 gap-1 items-center">
              <div className="flex gap-1 items-center">
                <CiPhone />
                <p>+92-3104150111</p>
              </div>
              <div className="flex gap-1 items-center">
                <CiMail />
                <p>sheikh.haris.zahid@slysol.com</p>
              </div>
            </div>
          </Container>
        </div>
        <Container className="h-full" hScreen={false}>
          <Header />
          <Section>
            <div className="grid lg:grid-cols-2 md:gap-20 gap-10 items-center">
              <div>
                <SubTitle text="WELCOME TO OUR COMPANY" />
                <Title className="xl:w-2/3 lg:w-3/4 sm:w-1/2 w-2/3">
                  Clear Thinking Makes{' '}
                  <span className="text-primary2 font-semibold">
                    Bright Future!
                  </span>
                </Title>
                <p className="text-mute md:py-8 py-5">
                  Where we see every digital platform as an opportunity to
                  upscale your business
                </p>
                <Button text="Discover More" className="py-3" />
              </div>
              <div className="relative lg:w-full sm:w-3/4 w-full m-auto">
                <div className="border-[2px] animate-fancyBorder2 py-3 absolute w-full h-full -translate-x-6 translate-y-10 border-slate" />
                <div className="border-[2px] animate-fancyBorder absolute w-full h-full border-secondary sm:translate-y-0 -translate-y-9" />
                <div className="sm:rounded-fancyRadius2 rounded-lg sm:h-[500px] h-[400px] relative overflow-hidden">
                  <Image
                    src="/images/home/header.png"
                    alt="company header"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </Section>
        </Container>
      </div>

      {/* Who are we */}
      <Container hScreen={false}>
        <Section>
          <div className="grid lg:grid-cols-2 md:gap-20 gap-10 items-center">
            <Image
              src="/images/home/who-are-we.png"
              alt="team"
              width={1000}
              height={800}
              className="w-full h-auto rounded-lg lg:order-1 order-2"
            />
            <div className="lg:order-2 order-1">
              <SubTitle text="WHO ARE WE" />
              <Title text="Slysol" />
              <p className="md:mt-8 mt-5 text-mute">
                {`Your strategic partner in navigating the rapidly evolving
                landscape of digital innovation. At SlySol, we're a team of
                experts in software development, AI integration, cloud
                computing, IT consulting, and digital marketing. Our goal is to
                help clients make the most of technology to reach their dreams,
                whether that means streamlining operations, improving customer
                experiences, or growing their business. Experience the
                difference with SlySol.`}
              </p>
              <button className="btn-outline md:py-3 mdpx-8 py-2 px-5 md:text-base text-sm md:mt-8 mt-5">
                LEARN MORE
              </button>
            </div>
          </div>
        </Section>
      </Container>

      {/* Modern Tech Section */}
      <div className="relative w-full h-screen bg-fixed bg-center bg-no-repeat bg-cover bg-modern-tech">
        <div className="absolute xl:left-1/4 lg:left-1/3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <SubTitle text="MODERN" white />
          <Title className="text-white xl:w-2/3 lg:w-3/4 sm:w-1/2 w-2/3">
            <h1>Tech & Software Design</h1>
          </Title>
        </div>
      </div>

      {/* Services-Section */}
      <Container hScreen={false}>
        <Section>
          <div className="flex flex-col gap-3 justify-center items-center">
            <SubTitle text="OUR SERVICES" />
            <Title text="Services We Provide" className="font-normal" />
            <p className="text-mute sm:w-1/2 text-center">
              We are a one stop digital shop, providing you with all the digital
              solutions specially when the world is changing into AI.
            </p>
          </div>
          <ServicesShowcase />
        </Section>
      </Container>

      {/* Developing Better Future */}
      <div className="relative md:h-screen h-[400px] w-full">
        <Image
          src="/images/home/better-future.jpg"
          alt="white wave background"
          fill
        />
        <PerfectCenter className="text-center">
          <GradientText>
            <Title
              className="text-center font-semibold !leading-tight"
              text="Developing a Better Future for All Our Users."
            />
          </GradientText>
          <button className="btn-outline py-3 px-10 mt-8">VIEW MORE</button>
        </PerfectCenter>
      </div>

      {/* WHY US SECTION */}
      <WhyUs />

      {/* Innovative design approach */}
      <div className="relative md:block hidden">
        <div className="absolute w-full h-full bg-black opacity-40" />
        <video
          width="100%"
          height="100vh"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        >
          <source src="/videos/innovative-design.mp4" type="video/mp4" />
        </video>
        <PerfectCenter>
          <Title
            text="A Innovative & Futuristic Approach To Make Your Product Grow"
            className="text-white text-center font-semibold"
          />
        </PerfectCenter>
      </div>

      {/* Clients Feedback */}
      <Slider />
      <Footer />
    </>
  );
}
