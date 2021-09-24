<template>
  <app-table :header="[['Description']]"
             :content="content" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';

import type { EntityRef } from '@/store/core-types';
import type { NonFungibleResourceId } from '@/store/business-types';

import AppTable from '@/components/AppTable.vue';

export default defineComponent({
  name: 'app-non-fungible-resources',
  components: { AppTable },
  props: {
    nonFungibleResources: {
      type: Array as PropType<EntityRef<NonFungibleResourceId>[]>,
      required: true,
    },
  },
  setup(props) {
    const content = computed(() => props.nonFungibleResources.map(r => [r.description]));

    return { content };
  },
});
</script>

<style scoped></style>
