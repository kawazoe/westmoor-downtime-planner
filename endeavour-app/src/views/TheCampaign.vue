<template>
  <main>
    <the-campaign-nav :campaign-cid="campaignCid"/>
    <router-view/>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

import type { CombinedId } from '@/store/core-types';
import TheCampaignNav from '@/components/TheCampaignNav.vue';

export default defineComponent({
  name: 'TheCampaign',
  components: { TheCampaignNav },
  props: {
    campaignCid: {
      type: String as unknown as PropType<CombinedId>,
      required: true,
    },
  },
});
</script>

<style scoped>
</style>
