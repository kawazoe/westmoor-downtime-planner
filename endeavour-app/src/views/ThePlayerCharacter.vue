<template>
  <main class="container px-4">
    <h2>
      {{character.fullName}}
      <span class="text-base font-light tracking-tight italic text-gray-600">by {{character.owner.description}}</span>
    </h2>

    <p>{{character.bio}}</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 grid-rows-1 gap-x-8">
      <div>
        <h3>Resources</h3>
        <section>
          <app-fungible-resources :fungible-resources="fungibleResources" />
        </section>
      </div>

      <div>
        <h3>Items</h3>
        <section>
          <app-non-fungible-resources :non-fungible-resources="nonFungibleResources" />
        </section>
      </div>
    </div>

    <h3>Cards</h3>
    <section>
      <app-modifier-list></app-modifier-list>
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';

import { _throw } from '@/lib/functional/_throw';
import type { CombinedId } from '@/store/core-types';
import { useStore } from '@/store';

import AppFungibleResources from '@/containers/AppFungibleResources.vue';
import AppNonFungibleResources from '@/containers/AppNonFungibleResources.vue';

export default defineComponent({
  name: 'ThePlayerCharacter',
  components: { AppNonFungibleResources, AppFungibleResources },
  props: {
    characterCid: {
      type: String as unknown as PropType<CombinedId>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const character = computed(() => store.getters['characters/byCid'](props.characterCid) ?? _throw(new Error('Missing character.')));
    const fungibleResources = computed(() => Array.from(character.value.resources.fungibles));
    const nonFungibleResources = computed(() => character.value.resources.nonFungibles);

    return { character, fungibleResources, nonFungibleResources };
  },
});
</script>

<style scoped>
h2 { @apply text-2xl my-4; }
h3 { @apply text-xl mt-8 mb-2; }
</style>
