import { createCommentVNode, defineComponent, unref } from 'vue';
import type { PropType, Slot, Slots, VNode } from 'vue';

import type { AsyncPageStatus, BinderStatus, EnumerableBinderAdapter, IndexableBinderAdapter } from '@/composables/binders';
import type { EnumerableBinderStore, IndexableBinderStore } from '@/stores/binderStore';

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
      type: Object as PropType<
      EnumerableBinderAdapter<unknown[], unknown> |
      EnumerableBinderStore<unknown[], unknown> |
      IndexableBinderAdapter<unknown[], unknown> |
      IndexableBinderStore<unknown[], unknown>
      >,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => pickSlot(
      unref(props.value.status),
      slots,
    )(props.value);
  },
});
