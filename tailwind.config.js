/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],

  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "surface-dim": "#0e0e0e",
        "on-secondary-fixed-variant": "#6300e2",
        "on-primary-container": "#4d0057",
        "primary-fixed-dim": "#d946ef",
        "secondary-fixed": "#dac9ff",
        "secondary-fixed-dim": "#ceb9ff",
        "on-secondary-container": "#f8f1ff",
        "secondary": "#ac89ff",
        "on-primary-fixed": "#3c0040",
        "surface-bright": "#2c2c2c",
        "on-tertiary-container": "#001f36",
        "inverse-on-surface": "#565554",
        "surface": "#0e0e0e",
        "tertiary": "#4dafff",
        "tertiary-dim": "#15a4ff",
        "tertiary-fixed-dim": "#38aaff",
        "surface-container-highest": "#262626",
        "outline": "#777575",
        "on-tertiary-fixed": "#00192e",
        "on-surface": "#ffffff",
        "on-primary": "#570062",
        "surface-tint": "#d946ef",
        "inverse-primary": "#690076",
        "on-background": "#ffffff",
        "primary-container": "#d946ef",
        "surface-container-low": "#131313",
        "on-secondary-fixed": "#41009a",
        "on-tertiary": "#002c4a",
        "secondary-container": "#7000ff",
        "surface-container": "#1a1919",
        "inverse-surface": "#fcf8f8",
        "tertiary-container": "#00a2fd",
        "on-primary-fixed-variant": "#570062",
        "surface-variant": "#262626",
        "tertiary-fixed": "#65b7ff",
        "primary-fixed": "#d946ef",
        "outline-variant": "#494847",
        "surface-container-lowest": "#000000",
        "on-tertiary-fixed-variant": "#003c62",
        "on-surface-variant": "#adaaaa",
        "surface-container-high": "#201f1f",
        "primary": "#d946ef",
        "on-secondary": "#290067",
        "on-error": "#490006",
        "background": "#0e0e0e",
        "error-container": "#9f0519",
        "on-error-container": "#ffa8a3",
        "secondary-dim": "#874cff",
        "error-dim": "#d7383b",
        "error": "#ff716c",
        "primary-dim": "#a855f7"
      },
      fontFamily: {
        Manrope: ["Manrope", "sans-serif"],
        "headline": ["Space Grotesk"],
        "body": ["Inter"],
        "label": ["Inter"]
      },
      borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],

}

