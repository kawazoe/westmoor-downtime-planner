<template>
  <main class="container px-4">
    <app-async-value :value="characterStore">
      <template v-slot:content="{ value }">
        <h2>
          {{value.fullName}}
          <span class="text-base font-light tracking-tight italic text-gray-600">by {{value.owner.description}}</span>
        </h2>

        <p>{{value.bio}}</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 grid-rows-1 gap-x-8">
          <div>
            <h3>Resources</h3>
            <section>
              <app-fungible-resources :fungible-resources="value.resources.fungibles" />
            </section>
          </div>

          <div>
            <h3>Items</h3>
            <section>
              <app-non-fungible-resources :non-fungible-resources="value.resources.nonFungibles" />
            </section>
          </div>
        </div>

        <h3>Cards</h3>
        <section>
          <app-modifier-list></app-modifier-list>
        </section>
      </template>
    </app-async-value>
  </main>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

import type { CombinedId } from '@/stores/coreTypes';
import { useCharactersCurrentStore } from '@/stores';

import AppAsyncValue from '@/components/AppAsyncValue';
import AppFungibleResources from '@/containers/AppFungibleResources.vue';
import AppNonFungibleResources from '@/containers/AppNonFungibleResources.vue';

const props = defineProps({
  characterCid: {
    type: String as unknown as PropType<CombinedId>,
    required: true,
  },
});

const characterStore = useCharactersCurrentStore();

characterStore.trigger(props.characterCid);
</script>

<style scoped>
h2 { @apply text-2xl my-4; }
h3 { @apply text-xl mt-8 mb-2; }
</style>
