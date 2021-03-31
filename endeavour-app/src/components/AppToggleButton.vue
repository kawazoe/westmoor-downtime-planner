<template>
  <button @click="toggle(!active)">
    <slot :active="active"></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'AppToggleButton',
  props: { active: { type: Boolean as PropType<boolean> } },
  emits: ['toggle'],
  setup(props, { emit }) {
    return {
      toggle(value: boolean) {
        emit('toggle', value);
      },
    };
  },
});
</script>

<style scoped>

</style>
