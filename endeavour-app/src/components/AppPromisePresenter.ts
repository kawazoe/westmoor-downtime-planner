import { createCommentVNode, defineComponent, unref } from 'vue';
import type { PropType, Slot, Slots, VNode } from 'vue';

import type { PromiseAdapter, PromiseStatus } from '@/composables/promises';
import type { PromiseStore } from '@/stores/promiseStore';

const undefinedSlot = (status: PromiseStatus) => (): VNode[] => [createCommentVNode(`app-promise-presenter:unresolved-slot-mapping:${status}`)];
const pickSlot = (status: PromiseStatus, slots: Slots): Slot => {
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
  name: 'AppPromisePresenter',
  props: {
    value: {
      type: Object as PropType<PromiseAdapter<unknown[], unknown> | PromiseStore<unknown[], unknown>>,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => pickSlot(unref(props.value.status), slots)(props.value);
  },
});
