<template>
  <the-svg-icon-cache></the-svg-icon-cache>

  <template v-if="ready">
    <the-main-nav></the-main-nav>
    <router-view/>
    <the-footer></the-footer>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';

import TheFooter from '@/components/TheFooter.vue';
import TheMainNav from '@/components/TheMainNav.vue';
import TheSvgIconCache from '@/components/TheSvgIconCache';
import { useStore } from '@/store';

export default defineComponent({
  name: 'App',
  components: { TheFooter, TheMainNav, TheSvgIconCache },
  setup() {
    const store = useStore();
    const ready = computed(() => store.getters['init']?.status === 'success');

    onMounted(() => {
      store.dispatch('init_trigger');
    });

    return { ready };
  },
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
