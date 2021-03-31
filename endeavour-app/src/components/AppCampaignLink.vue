<template>
  <router-link class="nav-link" :to="`${rel}/${campaign.id}`">
    <app-icon :icon="campaign.icon" :title="campaign.name"></app-icon>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AppIcon from '@/components/AppIcon';
import { useRelativeRoute } from '@/router/routes';

export default defineComponent({
  name: 'AppCampaignLink',
  components: { AppIcon },
  props: { campaign: {} },
  setup() {
    const rel = useRelativeRoute();
    return { rel };
  },
});
</script>

<style scoped>
.nav-link {
  @apply text-5xl mx-1 sm:mx-0 sm:my-1 hover:text-primary-light;

  &:first-of-type {
    @apply ml-0 mt-0
  }
  &:last-of-type {
    @apply mr-0 mb-0;
  }
}
</style>
