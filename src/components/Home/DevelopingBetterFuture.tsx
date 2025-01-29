'use client';

import React from 'react';
import PerfectCenter from '../PerfectCenter';
import GradientText from '../GradientText';
import Title from '../Title';
import Lottie from 'react-lottie';
import betterFutureLottie from '../../../public/lotties/better-future-lottie.json';

const DevelopingBetterFuture = () => {
  return (
    <div className="relative h-[400px] md:h-screen overflow-hidden w-full">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: betterFutureLottie,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }}
        style={{
          height: '100%',
          width: '100%',
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
