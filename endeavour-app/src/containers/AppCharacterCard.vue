<template>
  <router-link :to="`${rel}/characters/${makeCid(character)}`">
    <app-entity-card :description="character.description" />
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

import type { CharacterEntity } from '@/store/business-types';
import { makeCid } from '@/store/core-types';
import { useRelativeRoute } from '@/router/routes';

import AppEntityCard from '@/components/AppEntityCard.vue';

export default defineComponent({
  name: 'AppCharacterCard',
  components: { AppEntityCard },
  props: {
    character: {
      type: Object as PropType<CharacterEntity>,
      required: true,
    },
  },
  setup() {
    const rel = useRelativeRoute();

    return { makeCid, rel };
  },
});
</script>

<style scoped>

</style>
