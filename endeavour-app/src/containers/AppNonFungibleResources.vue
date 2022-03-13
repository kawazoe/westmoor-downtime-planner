<template>
  <app-table :header="[['Description']]"
             :content="content" />
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import type { PropType } from 'vue';

import type { EntityRef } from '@/stores/core-types';
import type { NonFungibleResourceId } from '@/stores/business-types';

import AppTable from '@/components/AppTable.vue';

const props = defineProps({
  nonFungibleResources: {
    type: Array as PropType<EntityRef<NonFungibleResourceId>[]>,
    required: true,
  },
});

const content = computed(() => props.nonFungibleResources.map(r => [r.description]));
</script>

<style scoped></style>
