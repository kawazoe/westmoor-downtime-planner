<template>
  <nav>
    <app-toggle-button class="nav-toggle sx-2 sy-1" :active="expanded" @toggle="expanded = $event" v-slot="{ active }">
      <app-icon v-if="active" :icon="faTimes" class="fa-w-16"></app-icon>
      <app-icon v-else :icon="faBars" class="fa-w-16"></app-icon>
    </app-toggle-button>

    <vl-promise-presenter :value="campaignStore">
      <template v-slot:content="{ value }">
        <div class="nav-menu" :class="{ expanded }">
          <router-link class="nav-link sz-2" :to="`${rel}/endeavours`">Endeavours</router-link>
          <router-link class="nav-link sz-2" :to="`${rel}/actions`">Actions</router-link>
          <router-link class="nav-link sz-2" :to="`${rel}/resources`">Resources</router-link>
          <router-link class="nav-link sz-2" :to="`${rel}/characters`">Characters</router-link>
          <router-link class="nav-link sz-2" :to="`${rel}/settings`">Settings</router-link>
        </div>

        <h2 class="nav-brand sz-2" :title="value.summary">{{value.summary}}</h2>
      </template>
    </vl-promise-presenter>
  </nav>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue';
import type { PropType } from 'vue';

import { faBars, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { VlPromisePresenter } from 'velours';

import type { CombinedId } from '@/stores/coreTypes';
import { useRelativeRoute } from '@/composables/routes';

import { useCampaignsCurrentStore } from '@/stores';

import AppIcon from '@/components/AppIcon';
import AppToggleButton from '@/components/AppToggleButton.vue';

const props = defineProps({
  campaignCid: {
    type: String as unknown as PropType<CombinedId>,
    required: true,
  },
});

const rel = useRelativeRoute();

const campaignStore = useCampaignsCurrentStore();

watch(
  () => props.campaignCid,
  () => campaignStore.trigger(props.campaignCid),
  { immediate: true },
);

const expanded = ref(false);
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
