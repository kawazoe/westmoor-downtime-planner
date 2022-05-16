<template>
  <main>
    <the-campaign-nav :campaign-cid="campaignCid"/>
    <router-view/>
  </main>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

import type { CombinedId } from '@/stores/coreTypes';
import TheCampaignNav from '@/containers/TheCampaignNav.vue';

defineProps({
  campaignCid: {
    type: String as unknown as PropType<CombinedId>,
    required: true,
  },
});
</script>

<style scoped>
</style>
