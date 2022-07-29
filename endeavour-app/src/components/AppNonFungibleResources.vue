<template>
  <app-table :header="[['Summary']]"
             :content="content" />
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import type { PropType } from 'vue';

import type { EntityRef } from '@/stores/coreTypes';
import type { NonFungibleResourceId } from '@/stores/businessTypes';

import AppTable from '@/components/AppTable.vue';

const props = defineProps({
  nonFungibleResources: {
    type: Array as PropType<EntityRef<NonFungibleResourceId>[]>,
    required: true,
  },
});

const content = computed(() => props.nonFungibleResources.map(r => [r.summary]));
</script>

<style scoped></style>
