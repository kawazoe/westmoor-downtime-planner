import { createCommentVNode, defineComponent } from 'vue';
import type { PropType, Slot, Slots, VNode } from 'vue';

import type { AsyncStatus, AsyncValue } from '@/store/async-store';

const undefinedSlot = (): VNode[] => [createCommentVNode('app-async-value:unresolved-slot-mapping')];
const pickSlot = (status: AsyncStatus, isEmpty: boolean, slots: Slots): Slot => {
  switch (status) {
    case 'initial':
      return slots['initial'] || slots['loading'] || undefinedSlot;
    case 'loading':
      return slots['loading'] || undefinedSlot;
    case 'success':
      return (isEmpty && slots['empty']) || slots['content'] || slots['default'] || undefinedSlot;
    case 'error':
      return slots['error'] || undefinedSlot;
    case 'refreshing':
      return slots['refreshing'] || (isEmpty && slots['empty']) || slots['content'] || slots['default'] || undefinedSlot;
    case 'retrying':
      return slots['retrying'] || slots['error'] || undefinedSlot;
    default:
      return undefinedSlot;
  }
};

export default defineComponent({
  name: 'AppAsyncValue',
  props: {
    value: {
      type: Object as PropType<AsyncValue<unknown>>,
      required: true,
    },
    emptyPredicate: {
      type: Function as PropType<(value: AsyncValue<unknown>) => boolean>,
      required: false,
      default: (v: AsyncValue<unknown>) => {
        switch (v.status) {
          case 'success':
          case 'refreshing':
            return v.value == null || v.value === '' || (Array.isArray(v.value) && v.value.length === 0);
          default:
            return false;
        }
      },
    },
  },
  setup(props, { slots }) {
    return () => {
      const isEmpty = props.emptyPredicate(props.value);
      return pickSlot(props.value.status, isEmpty, slots)(props.value, { isEmpty });
    };
  },
});
