import type { Config } from 'tailwindcss';
const plugin = require('tailwindcss/plugin');

const config: Config = {
  // important: true,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        fancyRadius: '31% 69% 23% 77% / 66% 18% 82% 34%',
        fancyRadius2: '62% 38% 58% 42% / 52% 37% 63% 48%',
      },
      keyframes: {
        customPulse: {
          '0%': {
            transform: 'scale(0.6)',
            opacity: '1',
            boxShadow: 'inset 0px 0px 25px 3px #105AF2',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '0',
            boxShadow: 'none',
          },
        },
        leftToRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        rightToLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fancyBorder: {
          '0%': {
            borderRadius: '31% 69% 23% 77% / 66% 18% 82% 34%',
          },
          '50%': {
            borderRadius: '43% 57% 36% 64% / 36% 63% 37% 64%',
          },
          '100%': {
            borderRadius: '31% 69% 23% 77% / 66% 18% 82% 34%',
          },
        },
        fancyBorder2: {
          '0%': {
            borderRadius: '70% 30% 58% 42% / 34% 69% 31% 66%',
          },
          '50%': {
            borderRadius: '70% 30% 83% 17% / 34% 37% 63% 66% ',
          },
          '100%': {
            borderRadius: '70% 30% 58% 42% / 34% 69% 31% 66%',
          },
        },
        opacity: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        customPulse: 'customPulse 2s forwards infinite',
        'left-to-right': 'leftToRight 2s ease',
        'right-to-left': 'rightToLeft 2s ease',
        fancyBorder: 'fancyBorder 2s linear infinite',
        fancyBorder2: 'fancyBorder 2s linear infinite',
        opacity: 'opacity 2s ease-in-out',
      },
      colors: {
        primary1: '#0FABF6',
        primary2: '#455AB5',
        secondary: '#EB577B',
        primary: '#2B304B',
        pink: '#E62C5A',
        blue: '#393E58',
        slate: '#EBEDE8',
        dark: '#1c1c25',
        mute: '#7b7e86',
      },
      fontFamily: {
        // sans: ['var(--font-neue)'],
        neue: ['var(--font-neue)'],
        basic: ['var(--font-basic)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'modern-tech': `url('/images/home/modern-tech.webp')`,
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }: any) => {
      matchUtilities(
        {
          'animation-delay': (value: any) => {
            return {
              'animation-delay': value,
            };
          },
        },
        {
          values: theme('transitionDelay'),
        },
      );
    }),
  ],
};
export default config;
