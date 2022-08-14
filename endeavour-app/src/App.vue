<template>
  <the-svg-icon-cache></the-svg-icon-cache>

  <app-promise-presenter :value="store">
    <template v-slot:content>
      <the-main-nav></the-main-nav>
      <router-view/>
      <the-footer></the-footer>
    </template>
  </app-promise-presenter>
</template>

<script lang="ts" setup>
import { useStore } from '@/stores';

import AppPromisePresenter from '@/components/AppPromisePresenter';
import TheFooter from '@/containers/TheFooter.vue';
import TheMainNav from '@/containers/TheMainNav.vue';
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
