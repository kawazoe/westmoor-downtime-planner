<template>
  <the-svg-icon-cache></the-svg-icon-cache>

  <header class="p-2 sm:p-0 border-b-2 border-primary shadow-md">
    <the-main-nav></the-main-nav>
  </header>

  <main class="flex">
    <router-view/>
  </main>

  <footer>
    <the-footer></the-footer>
  </footer>
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
#app {
  display: flex;
  flex-direction: column;

  min-height: 100vh;

  main {
    flex-grow: 1;
  }
}
</style>
