/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sharon Display', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        ui: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        background: '#ffffff',
        foreground: '#20252a',
        card: '#f4f6f8',
        'card-foreground': '#20252a',
        primary: '#00a868',
        'primary-foreground': '#ffffff',
        secondary: '#f4f4f5',
        'secondary-foreground': '#111111',
        muted: '#f4f4f5',
        'muted-foreground': '#667781',
        accent: '#00a868',
        'accent-foreground': '#ffffff',
        border: '#d5dee8',
        ring: '#00a868',
        'surface-container': '#f8fafc',
        'surface-container-high': '#ffffff',
        'surface-inverse': '#ffffff',
        'surface-inverse-foreground': '#20252a',
      },
      borderRadius: {
        card: '16px',
        input: '8px',
        button: '9999px',
        pill: '9999px',
      }
    },
  },
  plugins: [],
}
