/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('postcss-preset-env')({
      stage: 2,
      features: { 'nesting-rules': false },
    }),
  ],
};
