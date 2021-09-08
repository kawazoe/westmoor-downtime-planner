const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addUtilities, e, theme, variants }) => {
  const safeZoneUtilities = Object.entries(theme('spacing'))
    .filter(([, value]) => !`${value}`.startsWith('-'))
    .map(([key, value]) => [
      [`.sz-${e(key)}`, { margin: `-${value}`, padding: `${value}` }],
      [
        `.sx-${e(key)}`, {
          'margin-left': `-${value}`,
          'margin-right': `-${value}`,
          'padding-left': `${value}`,
          'padding-right': `${value}`,
        },
      ],
      [
        `.sy-${e(key)}`, {
          'margin-top': `-${value}`,
          'margin-bottom': `-${value}`,
          'padding-top': `${value}`,
          'padding-bottom': `${value}`,
        },
      ],
      [`.sl-${e(key)}`, { 'margin-left': `-${value}`, 'padding-left': `${value}` }],
      [`.sr-${e(key)}`, { 'margin-right': `-${value}`, 'padding-right': `${value}` }],
      [`.st-${e(key)}`, { 'margin-top': `-${value}`, 'padding-top': `${value}` }],
      [`.sb-${e(key)}`, { 'margin-bottom': `-${value}`, 'padding-bottom': `${value}` }],
    ])
    .reduce((acc, cur) => [...acc, ...cur], []);

  addUtilities(Object.fromEntries(safeZoneUtilities), variants('safeZone'));
}, { variants: { safeZone: [] } });
