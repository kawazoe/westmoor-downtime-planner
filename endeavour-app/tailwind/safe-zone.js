/* eslint-env node */
const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addUtilities, theme, variants }) => {
  const safeZoneUtilities = Object.entries(theme('spacing'))
    .filter(([, value]) => !`${value}`.startsWith('-'))
    .map(([key, value]) => [
      [`.sz-${key}`, { margin: `-${value}`, padding: `${value}` }],
      [
        `.sx-${key}`, {
          'margin-left': `-${value}`,
          'margin-right': `-${value}`,
          'padding-left': `${value}`,
          'padding-right': `${value}`,
        },
      ],
      [
        `.sy-${key}`, {
          'margin-top': `-${value}`,
          'margin-bottom': `-${value}`,
          'padding-top': `${value}`,
          'padding-bottom': `${value}`,
        },
      ],
      [`.sl-${key}`, { 'margin-left': `-${value}`, 'padding-left': `${value}` }],
      [`.sr-${key}`, { 'margin-right': `-${value}`, 'padding-right': `${value}` }],
      [`.st-${key}`, { 'margin-top': `-${value}`, 'padding-top': `${value}` }],
      [`.sb-${key}`, { 'margin-bottom': `-${value}`, 'padding-bottom': `${value}` }],
    ])
    .reduce((acc, cur) => [...acc, ...cur], []);

  addUtilities(Object.fromEntries(safeZoneUtilities), variants('safeZone'));
}, { variants: { safeZone: [] } });
