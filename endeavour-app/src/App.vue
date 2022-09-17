<template>
  <the-svg-icon-cache></the-svg-icon-cache>

  <vl-promise-presenter :value="store">
    <template v-slot:content>
      <the-main-nav></the-main-nav>
      <router-view/>
      <the-footer></the-footer>
    </template>
  </vl-promise-presenter>
</template>

<script lang="ts" setup>
import { VlPromisePresenter } from 'velours';

import { useStore } from '@/stores';

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
