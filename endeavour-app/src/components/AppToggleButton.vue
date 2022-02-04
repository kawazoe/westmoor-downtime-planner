<template>
  <button @click="toggle(!active)">
    <slot :active="active"></slot>
  </button>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';
import type { PropType } from 'vue';

defineProps({ active: { type: Boolean as PropType<boolean> } });
const emit = defineEmits(['toggle']);

function toggle(value: boolean): void {
  emit('toggle', value);
}
</script>

<style scoped>

</style>
