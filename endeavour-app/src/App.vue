<template>
  <the-svg-icon-cache></the-svg-icon-cache>

  <app-async-value :value="store">
    <template v-slot:content>
      <the-main-nav></the-main-nav>
      <router-view/>
      <the-footer></the-footer>
    </template>
  </app-async-value>
</template>

<script lang="ts" setup>
import { useStore } from '@/stores';

import AppAsyncValue from '@/components/AppAsyncValue';
import TheFooter from '@/components/TheFooter.vue';
import TheMainNav from '@/components/TheMainNav.vue';
import TheSvgIconCache from '@/components/TheSvgIconCache';

const store = useStore();
store.trigger();
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
