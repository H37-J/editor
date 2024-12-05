const config: {
  theme: {
    extend: {
      screens: { xl: string; md: string; sm: string; xs: string; lg: string };
      colors: {
        background: string;
        neutral: { 750: string };
        foreground: string;
        dark?: { 1: string; 2: string }; // Make dark optional
      };
    };
  };
  content: string[];
  plugins: never[];
  important: boolean | string;
} = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '200px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        neutral: {
          750: 'rgb(51,51,51)',
        },
        dark: {
          1: '#242428',
          2: '#262626',
        },
      },
    },
  },
  plugins: [],
  important: true,
};

export default config;