'use client';

import React from 'react';
import PerfectCenter from '../PerfectCenter';
import GradientText from '../GradientText';
import Title from '../Title';
import { DotLottieReact, DotLottie } from '@lottiefiles/dotlottie-react';

const DevelopingBetterFuture = () => {
  const dotLottieRef = React.useRef<DotLottie | null>(null);

  return (
    <div className="relative h-[400px] md:h-screen overflow-hidden w-full">
      <DotLottieReact
        src={'/lotties/better-future-lottie.json'}
        loop={true}
        autoplay={true}
        style={{
          height: '100%',
          width: '100%',
        }}
        dotLottieRefCallback={(dotLottie) => {
          dotLottieRef.current = dotLottie;
        }}
      />
      <PerfectCenter className="text-center">
        <GradientText>
          <Title
            className="text-center font-semibold !leading-tight"
            text="Developing a Better Future for All Our Users."
          />
        </GradientText>
        <a href="/services">
          <button className="btn-outline py-2 md:py-3 px-10 mt-5 md:mt-8 text-sm md:text-base">
            View More
          </button>
        </a>
      </PerfectCenter>
    </div>
  );
};

export default DevelopingBetterFuture;
