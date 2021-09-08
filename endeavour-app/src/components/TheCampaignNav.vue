<template>
  <nav>
    <app-toggle-button class="nav-toggle sx-2 sy-1" :active="expanded" @toggle="expanded = $event" v-slot="{ active }">
      <app-icon v-if="active" :icon="faTimes" class="fa-w-16"></app-icon>
      <app-icon v-else :icon="faBars" class="fa-w-16"></app-icon>
    </app-toggle-button>

    <div class="nav-menu" :class="{ expanded }">
      <router-link class="nav-link sz-2" :to="`${rel}/endeavours`">Endeavours</router-link>
      <router-link class="nav-link sz-2" :to="`${rel}/activities`">Activities</router-link>
      <router-link class="nav-link sz-2" :to="`${rel}/resources`">Resources</router-link>
      <router-link class="nav-link sz-2" :to="`${rel}/characters`">Characters</router-link>
      <router-link class="nav-link sz-2" :to="`${rel}/settings`">Settings</router-link>
    </div>

    <h2 class="nav-brand sz-2" :title="campaign.description">{{campaign.description}}</h2>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { PropType } from 'vue';

import { faBars, faTimes } from '@fortawesome/pro-regular-svg-icons';

import { _throw, find } from '@/lib/functional';
import { byRef, splitCid } from '@/store/core-types';
import { CampaignId } from '@/store/business-types';
import { useRelativeRoute } from '@/router/routes';
import { useStore } from '@/store';

import AppIcon from '@/components/AppIcon';
import AppToggleButton from '@/components/AppToggleButton.vue';

export default defineComponent({
  name: 'TheCampaignNav',
  components: { AppIcon, AppToggleButton },
  props: {
    campaignCid: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const rel = useRelativeRoute();

    const store = useStore();
    const campaign = computed(() => find(
      byRef(...splitCid(props.campaignCid, CampaignId)),
      store.state.campaigns,
    ) ?? _throw(new Error('Invalid campaign id.')));

    const expanded = ref(false);

    return { faTimes, faBars, rel, campaign, expanded };
  },
});
</script>

<style scoped>
nav {
  @apply container flex flex-row-reverse sm:flex-row gap-2 sm:gap-8 items-center justify-between px-4 py-2;

  .nav-toggle { @apply sm:hidden; }
  .nav-menu {
    @apply hidden sm:flex flex-col sm:flex-row gap-4 sm:gap-6;
    &.expanded {
      @apply absolute sm:static flex self-stretch sm:self-auto sz-4 shadow-lg sm:shadow-none;
      @apply mt-10 sm:mt-0;
    }

    .nav-link { @apply hover:text-primary-light; }
  }

  .nav-brand { @apply text-xl text-gray-500 font-serif truncate; }
}
</style>
