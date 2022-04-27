import { createCommentVNode, defineComponent } from 'vue';
import type { PropType, Slot, Slots, VNode } from 'vue';

import type { AsyncPage, AsyncPageStatus, BinderStatus } from '@/stores/binderStore';

const undefinedSlot = (status: BinderStatus | AsyncPageStatus) => (): VNode[] => [createCommentVNode(`app-binder-page-presenter:unresolved-slot-mapping:${status}`)];
function pickSlot(status: AsyncPageStatus, slots: Slots): Slot {
  switch (status) {
    case 'loading':
      return slots['loading'] || undefinedSlot(status);
    case 'content':
      return slots['content'] || slots['default'] || undefinedSlot(status);
    case 'empty':
      return slots['empty'] || slots['content'] || slots['default'] || undefinedSlot(status);
    case 'error':
      return slots['error'] || undefinedSlot(status);
    case 'refreshing':
      return slots['refreshing'] || slots['content'] || slots['efault'] || undefinedSlot(status);
    case 'retrying':
      return slots['retrying'] || slots['error'] || undefinedSlot(status);
    default:
      return undefinedSlot(status);
  }
}

export default defineComponent({
  name: 'AppBinderPagePresenter',
  props: {
    value: {
      type: Object as PropType<AsyncPage<unknown>>,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => pickSlot(
      props.value.status,
      slots,
    )(props.value);
  },
});
