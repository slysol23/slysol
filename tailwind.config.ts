import type { Config } from 'tailwindcss';

const config: Config = {
  important: true,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        fancyRadius: '31% 69% 23% 77% / 66% 18% 82% 34%',
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
      },
      animation: {
        customPulse: 'customPulse 2s forwards infinite',
        'left-to-right': 'leftToRight 3s ease',
      },
      colors: {
        primary1: '#0FABF6',
        primary2: '#455AB5',
        secondary: '#EB577B',
        primary: '#2B304B',
        pink: '#E62C5A',
        blue: '#393E58',
        slate: '#EBEDE8',
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
      },
    },
  },
  plugins: [],
};
export default config;
