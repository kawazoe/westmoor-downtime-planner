<template>
  <nav class="nav-campaign">
    <div class="nav-campaign-menu">
      <router-link class="nav-link" :to="`${rel}/endeavours`">Endeavours</router-link>
      <router-link class="nav-link" :to="`${rel}/activities`">Activities</router-link>
      <router-link class="nav-link" :to="`${rel}/resources`">Resources</router-link>
      <router-link class="nav-link" :to="`${rel}/characters`">Characters</router-link>
      <router-link class="nav-link" :to="`${rel}/settings`">Settings</router-link>
    </div>

    <h2 class="nav-campaign-brand" :title="campaign.name">{{campaign.name}}</h2>
  </nav>

  <router-view/>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';
import { useRelativeRoute } from '@/router/routes';
import { useStore } from 'vuex';

import type { AppState } from '@/store';

export default defineComponent({
  name: 'TheCampaign',
  props: {
    campaignId: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore<AppState>();
    const campaign = computed(() => (store.state as AppState).campaigns.find(c => c.id === props.campaignId));

    const rel = useRelativeRoute();

    return { rel, campaign };
  },
});
</script>

<style scoped>
.nav-campaign {
  @apply flex flex-col-reverse sm:flex-row justify-between items-center m-2;

  .nav-campaign-menu {
    @apply flex;

    .nav-link {
      @apply my-1 sm:my-0;
      @apply mx-0.5 sm:mx-1 lg:mx-2;
      @apply py-2;
      @apply px-1 sm:px-1 md:px-2;
      @apply hover:text-primary-light;

      &:first-of-type {
        @apply ml-0
      }
      &:last-of-type {
        @apply mr-0;
      }
    }
  }

  .nav-campaign-brand {
    @apply ml-0 sm:ml-8 text-xl text-gray-500 font-serif truncate;
  }
}
</style>
