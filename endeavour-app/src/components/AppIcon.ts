import { defineComponent, h } from 'vue';
import type { PropType, VNode } from 'vue';
import type { DefineComponent } from '@vue/runtime-core';

import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

import { _throw } from '@/lib/functional';
import { svgIconCache } from './TheSvgIconCache';

// This is done to avoid directly referencing the IconPrefix and IconName type which is killing eslint performance.
const pseudoFindIconDefinition = findIconDefinition as
  (lookup: {prefix: string, iconName: string}) => IconDefinition;

function toIconDefinition(icon: IconDefinition | [string, string] | string): IconDefinition {
  if (typeof icon === 'object' && !Array.isArray(icon)) {
    return icon;
  }

  if (Array.isArray(icon)) {
    return pseudoFindIconDefinition({ prefix: icon[0], iconName: icon[1] });
  }

  return pseudoFindIconDefinition({ prefix: 'far', iconName: icon });
}

const faIcon = (FontAwesomeIcon as unknown as DefineComponent<FontAwesomeIconProps>);
const faSetup = faIcon.setup || _throw(new Error('Missing FontAwesomeIcon setup function'));

/**
 * This component fixes some of FontAwesome oddities when it comes to props typings and add support for sprites.
 */
export default defineComponent({
  name: 'AppIcon',

  props: {
    border: {
      type: Boolean,
      default: false,
    },
    fixedWidth: {
      type: Boolean,
      default: false,
    },
    flip: {
      type: String as PropType<'horizontal' | 'vertical' | 'both'>,
      default: null,
      validator: (value: string) => ['horizontal', 'vertical', 'both'].indexOf(value) > -1,
    },
    icon: {
      type: [Object, Array, String] as PropType<IconDefinition | [string, string] | string>,
      required: true,
    },
    mask: {
      type: [Object, Array, String] as PropType<IconDefinition | [string, string] | string>,
      default: null,
    },
    listItem: {
      type: Boolean,
      default: false,
    },
    pull: {
      type: String as PropType<'right' | 'left'>,
      default: null,
      validator: (value: string) => ['right', 'left'].indexOf(value) > -1,
    },
    pulse: {
      type: Boolean,
      default: false,
    },
    rotation: {
      type: [String, Number] as PropType<'90' | '180' | '270' | 90 | 180 | 270>,
      default: null,
      validator: (value: string | number) => [90, 180, 270].indexOf(+value) > -1,
    },
    swapOpacity: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<'lg' | 'xs' | 'sm' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x'>,
      default: null,
      validator: (value: string) => ['lg', 'xs', 'sm', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'].indexOf(value) > -1,
    },
    spin: {
      type: Boolean,
      default: false,
    },
    transform: {
      type: [String, Object] as PropType<string | Record<string, unknown>>,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    inverse: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const faRender = faSetup.call(this, props, context);
    if (typeof faRender !== 'function') {
      console.error('Invalid FontAwesomeIcon render function for icon: ', props.icon);
      return () => h('i', { icon: props.icon });
    }

    return () => {
      const definition = toIconDefinition(props.icon);

      if (definition && svgIconCache.has(definition)) {
        const faVNode = faRender() as VNode;
        const symbol = `#${definition.prefix}-fa-${definition.iconName}`;

        return h('svg', faVNode.props, [h('use', { 'xlink:href': symbol })]);
      }

      return h(faIcon, props);
    };
  },
});
