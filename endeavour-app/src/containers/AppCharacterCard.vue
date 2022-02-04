<template>
  <router-link :to="`${rel}/characters/${makeCid(character)}`">
    <app-entity-card :description="character.description" />
  </router-link>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

import type { CharacterEntity } from '@/store/business-types';
import { makeCid } from '@/store/core-types';
import { useRelativeRoute } from '@/router/routes';

import AppEntityCard from '@/components/AppEntityCard.vue';

defineProps({
  character: {
    type: Object as PropType<CharacterEntity>,
    required: true,
  },
});

const rel = useRelativeRoute();
</script>

<style scoped>

</style>
