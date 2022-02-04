<template>
  <the-svg-icon-cache></the-svg-icon-cache>

  <template v-if="ready">
    <the-main-nav></the-main-nav>
    <router-view/>
    <the-footer></the-footer>
  </template>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import TheFooter from '@/components/TheFooter.vue';
import TheMainNav from '@/components/TheMainNav.vue';
import TheSvgIconCache from '@/components/TheSvgIconCache';
import { useStore } from '@/store';

const store = useStore();
const ready = computed(() => store.getters['ready']?.status === 'success');
store.dispatch('ready_init');
</script>

<style>
/*noinspection CssUnusedSymbol*/
#app {
  @apply flex flex-col min-h-screen;

  main {
    @apply flex-grow;
  }
}
</style>
