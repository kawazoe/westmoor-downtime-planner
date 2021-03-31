import { defineComponent, h } from 'vue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { library } from '@fortawesome/fontawesome-svg-core';

export const svgIconCache = (function SvgIconCache() {
  function extractDefinitions(): { [key: string]: { [key: string]: Record<string, unknown> } } {
    const { definitions } = library as { definitions?: { [key: string]: { [key: string]: Record<string, unknown> } } };

    if (!definitions) {
      throw new Error('Cannot extract private definitions property from font-awesome library object.');
    }

    return definitions;
  }

  let changed = true;
  let valuesCache: IconDefinition[] = [];

  function add(...definitions: IconDefinition[]): void {
    library.add(...definitions);
    changed = true;
  }

  function reset(): void {
    library.reset();
    changed = true;
  }

  function has(definition: IconDefinition): boolean {
    return !!extractDefinitions()[definition.prefix]?.[definition.iconName] || false;
  }

  function values(): IconDefinition[] {
    if (changed) {
      valuesCache = Object.entries(extractDefinitions())
        .map(([prefix, prefixed]) => Object.entries(prefixed as Record<string, unknown>)
          .map(([iconName, icon]) => ({ prefix, iconName, icon } as IconDefinition)))
        .reduce((acc, cur) => {
          acc.push(...cur); return acc;
        }, []);
    }

    return valuesCache;
  }

  return {
    add,
    reset,
    has,
    values,
  } as const;
})();

export default defineComponent({
  name: 'TheSvgIconCache',
  setup() {
    return () => h(
      'div',
      { class: 'svg-icon-cache' },
      svgIconCache.values().map(icon => h(FontAwesomeIcon, { icon, symbol: true })),
    );
  },
});
