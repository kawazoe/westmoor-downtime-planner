import { createCommentVNode, defineComponent } from 'vue';
import type { PropType, Slot, Slots, VNode } from 'vue';

import type { AsyncStatus, AsyncValue } from '@/store/async-store';

const undefinedSlot = (): VNode[] => [createCommentVNode('app-async-value:unresolved-slot-mapping')];
const pickSlot = (status: AsyncStatus, slots: Slots): Slot => {
  switch (status) {
    case 'initial':
      return slots['initial'] || slots['loading'] || undefinedSlot;
    case 'loading':
      return slots['loading'] || undefinedSlot;
    case 'content':
      return slots['content'] || slots['default'] || undefinedSlot;
    case 'empty':
      return slots['empty'] || slots['content'] || slots['default'] || undefinedSlot;
    case 'error':
      return slots['error'] || undefinedSlot;
    case 'refreshing':
      return slots['refreshing'] || slots['content'] || slots['default'] || undefinedSlot;
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
  },
  setup(props, { slots }) {
    return () => pickSlot(props.value.status, slots)(props.value);
  },
});
