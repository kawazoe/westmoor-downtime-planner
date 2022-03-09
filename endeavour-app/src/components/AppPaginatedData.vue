<template>
  <slot :data="props.collection[1]"></slot>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

const props = defineProps({
  collection: {
    type: Array as PropType<unknown[]>,
    default: () => ([]),
  },
});
</script>

<style scoped>

</style>
