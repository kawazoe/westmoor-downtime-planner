<template>
  <main class="container px-4">
    <app-promise-presenter :value="characterStore">
      <template v-slot:content="{ value }">
        <h2>
          {{value.fullName}}
          <span class="text-base font-light tracking-tight italic text-gray-600">by {{value.owner.summary}}</span>
          <span class="text-base font-light tracking-tight italic text-gray-600">, for {{value.gameSystem.summary}}</span>
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
            <h3>Inventory</h3>
            <section>
              <app-non-fungible-resources :non-fungible-resources="value.resources.nonFungibles" />
            </section>
          </div>
        </div>

        <h3>Action Cards</h3>
        <section>
          <app-action-list></app-action-list>
        </section>

        <h3>Modifier Cards</h3>
        <section>
          <app-modifier-list></app-modifier-list>
        </section>
      </template>
    </app-promise-presenter>
  </main>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

import type { CombinedId } from '@/stores/coreTypes';
import { useCharactersCurrentStore } from '@/stores';

import AppFungibleResources from '@/components/AppFungibleResources.vue';
import AppNonFungibleResources from '@/components/AppNonFungibleResources.vue';
import AppPromisePresenter from '@/components/AppPromisePresenter';

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
