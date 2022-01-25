<template>
  <main class="container px-4">
    <template v-if="character.status === 'success'">
      <h2>
        {{character.value.fullName}}
        <span class="text-base font-light tracking-tight italic text-gray-600">by {{character.value.owner.description}}</span>
      </h2>

      <p>{{character.value.bio}}</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 grid-rows-1 gap-x-8">
        <div>
          <h3>Resources</h3>
          <section>
            <app-fungible-resources :fungible-resources="character.value.resources.fungibles" />
          </section>
        </div>

        <div>
          <h3>Items</h3>
          <section>
            <app-non-fungible-resources :non-fungible-resources="character.value.resources.nonFungibles" />
          </section>
        </div>
      </div>

      <h3>Cards</h3>
      <section>
        <app-modifier-list></app-modifier-list>
      </section>
    </template>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import type { PropType } from 'vue';

import type { AsyncValue } from '@/store/async-store';
import type { CharacterEntity } from '@/store/business-types';
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

    const character = computed(() => store.getters['characters/current'] as AsyncValue<CharacterEntity | null>);

    onMounted(() => {
      store.dispatch('characters/current_trigger', { id: props.characterCid });
    });

    return { character };
  },
});
</script>

<style scoped>
h2 { @apply text-2xl my-4; }
h3 { @apply text-xl mt-8 mb-2; }
</style>
