<template>
  <slot :data="props.collection.data" :page="props.collection.page" :page-size="props.collection.pageSize"></slot>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

import type { RelativeRestData } from '@/store/core-types';

const props = defineProps({
  collection: {
    type: Object as PropType<RelativeRestData<unknown>>,
    default: () => ({ data: [], page: 0, pageSize: 0 }),
  },
});
</script>

<style scoped>

</style>
