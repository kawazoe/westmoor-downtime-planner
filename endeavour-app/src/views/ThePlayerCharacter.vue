<template>
  <main class="container px-4">
    <h2>
      {{character.fullName}}
      <span class="text-base font-light tracking-tight italic text-gray-600">by {{character.owner.description}}</span>
    </h2>

    <p>{{character.bio}}</p>

    <h3>Resources</h3>
    <section>
      <app-fungible-resource-list></app-fungible-resource-list>
    </section>

    <h3>Items</h3>
    <section>
      <app-non-fungible-resource-list></app-non-fungible-resource-list>
    </section>

    <h3>Cards</h3>
    <section>
      <app-modifier-list></app-modifier-list>
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';

import type { CombinedId } from '@/store/core-types';
import { useStore } from '@/store';

export default defineComponent({
  name: 'ThePlayerCharacter',
  props: {
    characterCid: {
      type: String as unknown as PropType<CombinedId>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const character = computed(() => store.state.characters[props.characterCid]);

    return { character };
  },
});
</script>

<style scoped>
h2 { @apply text-2xl my-4; }
h3 { @apply text-xl mt-8 mb-2; }
</style>
