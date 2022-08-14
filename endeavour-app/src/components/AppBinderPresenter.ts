import { createCommentVNode, defineComponent } from 'vue';
import type { PropType, Slot, Slots, VNode } from 'vue';

import type { AsyncPageStatus, Binders, BinderStatus } from '@/composables/binders';
import type { BinderStore } from '@/stores/binderStore';

const undefinedSlot = (status: BinderStatus | AsyncPageStatus) => (): VNode[] => [createCommentVNode(`app-binder-presenter:unresolved-slot-mapping:${status}`)];
const pickSlot = (status: BinderStatus, slots: Slots): Slot => {
  switch (status) {
    case 'initial':
      return slots['initial'] || undefinedSlot(status);
    case 'nested':
      return slots['nested'] || slots['default'] || undefinedSlot(status);
    case 'error':
      return slots['error'] || undefinedSlot(status);
    case 'retrying':
      return slots['retrying'] || slots['error'] || undefinedSlot(status);
    default:
      return undefinedSlot(status);
  }
};

export default defineComponent({
  name: 'AppBinderPresenter',
  props: {
    value: {
      type: Object as PropType<Binders<unknown> | BinderStore<unknown[], unknown>>,
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
