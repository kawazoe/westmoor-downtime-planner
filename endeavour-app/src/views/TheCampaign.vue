<template>
  <main>
    <the-campaign-nav :campaign-cid="campaignCid"/>
    <router-view/>
  </main>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

import type { CombinedId } from '@/stores/core-types';
import TheCampaignNav from '@/components/TheCampaignNav.vue';

defineProps({
  campaignCid: {
    type: String as unknown as PropType<CombinedId>,
    required: true,
  },
});
</script>

<style scoped>
</style>
