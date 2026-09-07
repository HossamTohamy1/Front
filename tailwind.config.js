/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif']
      },
      colors: {
        brand: {
          DEFAULT: '#5BC8F0',
          hover: '#3AAED4',
          light: '#C5EBFA',
        },
        background: 'var(--bg)',
        foreground: 'var(--fg)',
        card: {
          DEFAULT: 'var(--card-bg)',
          foreground: 'var(--card-fg)',
        },
        primary: {
          DEFAULT: 'var(--primary-color)',
          foreground: 'var(--primary-fg)',
        },
        secondary: {
          DEFAULT: 'var(--secondary-bg)',
          foreground: 'var(--secondary-fg)',
        },
        muted: {
          DEFAULT: 'var(--muted-bg)',
          foreground: 'var(--muted-fg)',
        },
        border: 'var(--border-color)',
        ring: 'var(--ring-color)',
        success: 'var(--success-color)',
        warning: 'var(--warning-color)',
        danger: 'var(--danger-color)',
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
      }
    },
  },
  plugins: [],
}
