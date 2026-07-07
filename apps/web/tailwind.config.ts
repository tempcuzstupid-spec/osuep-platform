import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand: luxury purple / black / chrome
        ink: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        midnight: {
          50:  '#f5f5f7',
          100: '#e4e4e7',
          200: '#a1a1aa',
          300: '#71717a',
          400: '#52525b',
          500: '#3f3f46',
          600: '#27272a',
          700: '#1c1c1f',
          800: '#131316',
          900: '#0a0612',
          950: '#050308',
        },
        chrome: {
          50:  '#f8fafc',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617',
        },
        gold: {
          400: '#f5b700',
          500: '#c8862a',
          600: '#a06b1e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-luxe': 'linear-gradient(135deg, #2e1065 0%, #4c1d95 30%, #1c1c1f 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
        'gradient-chrome': 'linear-gradient(180deg, #0a0612 0%, #1c1c1f 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
      },
      boxShadow: {
        'chrome': 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 0 rgba(0,0,0,0.4)',
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.35)',
        'glow-gold': '0 0 30px rgba(245, 183, 0, 0.25)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
