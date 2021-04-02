<template>
  <div class="nav">
    <div class="nav-header-section">
      <router-link class="nav-brand" to="/">endeavour</router-link>
      <app-toggle-button class="nav-button" :active="expanded" @toggle="expanded = $event" v-slot:default="props">
        <app-icon v-if="props.active" :icon="faTimes" class="fa-w-16"></app-icon>
        <app-icon v-else :icon="faBars" class="fa-w-16"></app-icon>
      </app-toggle-button>
    </div>

    <nav class="nav-main-section flex" :class="{ 'hidden': !expanded }">
      <router-link class="nav-link" to="/">Landing</router-link>
      <router-link class="nav-link" to="/campaigns">Campaigns</router-link>
      <router-link class="nav-link" to="/player">Player</router-link>
      <router-link class="nav-link" to="/tos">Terms of Service</router-link>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { faBars, faTimes } from '@fortawesome/pro-solid-svg-icons';

import AppIcon from '@/components/AppIcon';
import AppToggleButton from '@/components/AppToggleButton.vue';

export default defineComponent({
  name: 'TheMainNav',
  components: { AppToggleButton, AppIcon },
  setup() {
    const expanded = ref(false);

    return { faBars, faTimes, expanded };
  },
});
</script>

<style scoped>
.nav {
  @apply container sm:flex sm:justify-between sm:items-baseline lg:items-center;

  .nav-header-section {
    @apply flex justify-between text-2xl;

    .nav-brand {
      @apply py-2 sm:px-2 hover:text-primary-light;
    }

    .nav-button {
      @apply block sm:hidden px-3 border-2 border-black rounded;
    }
  }

  .nav-main-section {
    @apply mt-2 sm:mt-0 sm:flex flex-col sm:flex-row sm:justify-end uppercase;

    .nav-link {
      @apply my-1 sm:my-0;
      @apply sm:mx-1 lg:mx-2;
      @apply py-2;
      @apply sm:px-1 md:px-2;
      @apply hover:text-primary-light;

      &:first-of-type {
        @apply ml-0;
      }
      &:last-of-type {
        @apply mr-0;
      }
    }

    /*noinspection CssUnusedSymbol*/
    .router-link-active {
      @apply font-medium;
    }
  }
}
</style>
