'use client';

import React from 'react';
import Script from 'next/script';

const Calendly = () => {
  return (
    <>
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/sheikhhariszahid/30min?primary_color=4559b5"
        style={{ minWidth: '320px', height: '700px' }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        type="text/javascript"
        async
      />
    </>
  );
};

export default Calendly;
