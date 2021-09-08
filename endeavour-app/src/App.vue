<template>
  <the-svg-icon-cache></the-svg-icon-cache>

  <the-main-nav></the-main-nav>
  <router-view/>
  <the-footer></the-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TheFooter from '@/components/TheFooter.vue';
import TheMainNav from '@/components/TheMainNav.vue';
import TheSvgIconCache from '@/components/TheSvgIconCache';

export default defineComponent({
  name: 'App',
  components: { TheFooter, TheMainNav, TheSvgIconCache },
});
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
