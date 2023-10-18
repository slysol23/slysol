'use client';

import React from 'react';
import { useEffect } from 'react';

const Calendly = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div
      className="calendly-inline-widget border-2 border-primary2"
      data-url="https://calendly.com/sheikhhariszahid/30min?primary_color=4559b5"
      style={{ minWidth: '320px', height: '400px' }}
    />
  );
};

export default Calendly;
