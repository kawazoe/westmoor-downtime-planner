<template>
  <header class="border-b-2 border-primary shadow-md">
    <nav>
      <router-link class="nav-brand sz-2" to="/">endeavour</router-link>

      <div class="nav-menu items-center">
        <router-link class="nav-link text-2xl sz-2"
                     v-for="campaign of campaigns"
                     :to="`/campaigns/${makeCid(campaign)}`"
                     :title="campaign.description"
                     :key="campaign.id">
          <app-icon :icon="campaign.icon" />
        </router-link>
        <template v-if="player">
          <router-link class="nav-link text-2xl sz-2" to="/player">
            <app-icon :icon="faUser" />
          </router-link>
        </template>
        <template v-else>
          <router-link class="nav-link sz-2" to="/pricing">Pricing</router-link>
          <router-link class="nav-link sz-2" to="/sign-in">Sign In</router-link>
        </template>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { makeCid } from '@/store/core-types';
import { useStore } from '@/store';

import { faBars, faTimes, faUser } from '@fortawesome/pro-solid-svg-icons';

import AppIcon from '@/components/AppIcon';

export default defineComponent({
  name: 'TheMainNav',
  components: { AppIcon },
  setup() {
    const store = useStore();
    const player = computed(() => store.state.player);
    const campaigns = computed(() => store.state.campaigns);

    const expanded = ref(false);

    return { makeCid, faBars, faTimes, faUser, player, campaigns, expanded };
  },
});
</script>

<style scoped>
nav {
  @apply container flex items-center justify-between px-4 py-2;

  .nav-brand {
    @apply text-2xl hover:text-primary-light;
  }

  .nav-menu {
    @apply flex gap-6;

    .nav-link {
      @apply uppercase;
      @apply hover:text-primary-light;
    }

    /*noinspection CssUnusedSymbol*/
    .router-link-active {
      @apply font-medium text-primary-dark;
    }
  }
}
</style>
