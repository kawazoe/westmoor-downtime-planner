<template>
  <div class="container flex flex-col sm:flex-row">
    <div class="nav-campaigns">
      <AppCampaignLink v-for="campaign of campaigns" :campaign="campaign" :key="campaign.id" />
    </div>

    <div class="min-w-0 flex-grow">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';

import { useRelativeRoute } from '@/router/routes';

import AppCampaignLink from '@/components/AppCampaignLink.vue';
import type { AppState } from '@/store';

export default defineComponent({
  name: 'TheCampaigns',
  components: { AppCampaignLink },
  setup() {
    const store = useStore<AppState>();
    const campaigns = computed(() => store.state.campaigns);

    const rel = useRelativeRoute();

    return { rel, campaigns };
  },
});
</script>

<style scoped>
.nav-campaigns {
  @apply flex flex-row sm:flex-col justify-evenly sm:justify-start;
  @apply border-primary border-b-2 sm:border-r-2 sm:border-b-0 p-2;
}
</style>
