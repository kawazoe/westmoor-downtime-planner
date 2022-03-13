/* eslint-env node */
const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: [{ pattern: /svg.*/ }, { pattern: /fa.*/ }],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: {
        light: colors.blue['700'],
        DEFAULT: colors.blue['800'],
        dark: colors.blue['900'],
      },
      secondary: {
        light: colors.yellow['100'],
        DEFAULT: colors.yellow['200'],
        dark: colors.yellow['300'],
      },
      success: {
        light: colors.green['500'],
        DEFAULT: colors.green['600'],
        dark: colors.green['700'],
      },
      danger: {
        light: colors.red['500'],
        DEFAULT: colors.red['700'],
        dark: colors.red['800'],
      },
      warning: {
        light: colors.amber['300'],
        DEFAULT: colors.amber['500'],
        dark: colors.amber['600'],
      },
      info: {
        light: colors.cyan['300'],
        DEFAULT: colors.cyan['400'],
        dark: colors.cyan['500'],
      },
      gray: colors.stone,
      black: colors.black,
      white: colors.white,
    },
    container: { center: true },
  },
  variants: { extend: { safeZone: ['responsive'] } },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('./tailwind/safe-zone'),
    require('./tailwind/border-spacing'),
  ],
};
