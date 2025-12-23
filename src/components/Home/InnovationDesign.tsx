'use client';

import React from 'react';
import PerfectCenter from '../PerfectCenter';
import Title from '../Title';
import Lottie from 'react-lottie';
import innovatinDesignLottie from '../../../public/lotties/innovation-design-lottie.json';
import GradientText from '../GradientText';

const InnovationDesign = () => {
  return (
    <div className="relative md:block hidden h-screen">
      <div className="absolute w-full h-full opacity-40" />
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: innovatinDesignLottie,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
          },
        }}
        style={{
          height: '100%',
          width: '100%',
          opacity: 0.5,
        }}
      />
      <PerfectCenter>
        <GradientText>
          <Title
            text="A Innovative & Futuristic Approach To Make Your Product Grow"
            className="text-center font-semibold p-5 !leading-tight"
          />
        </GradientText>
      </PerfectCenter>
    </div>
  );
};

export default InnovationDesign;
