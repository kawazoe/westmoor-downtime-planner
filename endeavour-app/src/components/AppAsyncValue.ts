import { createCommentVNode, defineComponent } from 'vue';
import type { PropType, Slot, Slots, VNode } from 'vue';

import type { Store } from 'pinia';

import type { AsyncStatus, AsyncValue } from '@/stores/promiseStore';

const undefinedSlot = (status: AsyncStatus) => (): VNode[] => [createCommentVNode(`app-async-value:unresolved-slot-mapping:${status}`)];
const pickSlot = (status: AsyncStatus, slots: Slots): Slot => {
  switch (status) {
    case 'initial':
      return slots['initial'] || slots['loading'] || undefinedSlot(status);
    case 'loading':
      return slots['loading'] || undefinedSlot(status);
    case 'content':
      return slots['content'] || slots['default'] || undefinedSlot(status);
    case 'empty':
      return slots['empty'] || slots['content'] || slots['default'] || undefinedSlot(status);
    case 'error':
      return slots['error'] || undefinedSlot(status);
    case 'refreshing':
      return slots['refreshing'] || slots['content'] || slots['default'] || undefinedSlot(status);
    case 'retrying':
      return slots['retrying'] || slots['error'] || undefinedSlot(status);
    default:
      return undefinedSlot(status);
  }
};

export default defineComponent({
  name: 'AppAsyncValue',
  props: {
    value: {
      type: Object as PropType<AsyncValue<unknown> | Store<string, AsyncValue<unknown>, unknown, unknown>>,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => pickSlot(props.value.status, slots)(props.value);
  },
});
