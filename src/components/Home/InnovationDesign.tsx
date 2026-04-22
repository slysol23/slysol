'use client';

import React from 'react';
import PerfectCenter from '../PerfectCenter';
import Title from '../Title';
import { DotLottieReact, DotLottie } from '@lottiefiles/dotlottie-react';
import GradientText from '../GradientText';

const InnovationDesign = () => {
  const dotLottieRef = React.useRef<DotLottie | null>(null);

  return (
    <div className="relative md:block hidden w-full h-screen">
      <div className="absolute w-full h-full opacity-40" />
      <DotLottieReact
        src={'/lotties/innovation-design-lottie.json'}
        loop={true}
        autoplay={true}
        layout={{ fit: 'cover', align: [0.5, 0.5] }}
        className="absolute inset-0 w-full h-full opacity-50"
        dotLottieRefCallback={(dotLottie) => {
          dotLottieRef.current = dotLottie;
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
