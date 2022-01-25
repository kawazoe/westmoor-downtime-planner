<template>
  <app-table :header="[['Name', 'Amount']]"
             :content="content"
             :header-class="(row, index) => ({ 'text-right': index === row.length - 1 })"
             :content-class="(row, index) => ({ 'text-right': index === row.length - 1 })"></app-table>
</template>

<script lang="ts">
import * as A from 'fp-ts/Array';
import { computed, defineComponent } from 'vue';
import { pipe } from 'fp-ts/function';
import type { PropType } from 'vue';

import type { EntityRef } from '@/store/core-types';
import type { FungibleResourceId } from '@/store/business-types';

import AppTable from '@/components/AppTable.vue';

export default defineComponent({
  name: 'app-fungible-resources',
  components: { AppTable },
  props: {
    fungibleResources: {
      type: Object as PropType<[EntityRef<FungibleResourceId>, number][]>,
      required: true,
    },
  },
  setup(props) {
    const content = computed(() => pipe(
      props.fungibleResources,
      A.map(([resource, amount]) => [resource.description, `${amount}`]),
    ));

    return { content };
  },
});
</script>

<style scoped></style>
