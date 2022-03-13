/* eslint-env node */
const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addUtilities, variants }) => {
  addUtilities({
    '.border-spacing-unset': { 'border-spacing': 'unset' },
    '.border-compact': { 'border-spacing': '0' },
  }, variants('borderSpacing'));
}, { variants: { borderSpacing: [] } });
