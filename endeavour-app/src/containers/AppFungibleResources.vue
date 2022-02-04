<template>
  <app-table :header="[['Name', 'Amount']]"
             :content="content"
             :header-class="(row, index) => ({ 'text-right': index === row.length - 1 })"
             :content-class="(row, index) => ({ 'text-right': index === row.length - 1 })"></app-table>
</template>

<script lang="ts" setup>
import * as A from 'fp-ts/Array';
import { computed, defineProps } from 'vue';
import { pipe } from 'fp-ts/function';
import type { PropType } from 'vue';

import type { EntityRef } from '@/store/core-types';
import type { FungibleResourceId } from '@/store/business-types';

import AppTable from '@/components/AppTable.vue';

const props = defineProps({
  fungibleResources: {
    type: Object as PropType<[EntityRef<FungibleResourceId>, number][]>,
    required: true,
  },
});

const content = computed(() => pipe(
  props.fungibleResources,
  A.map(([resource, amount]) => [resource.description, `${amount}`]),
));
</script>

<style scoped></style>
