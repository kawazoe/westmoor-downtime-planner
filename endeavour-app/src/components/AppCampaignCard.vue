<template>
  <router-link :to="`/campaigns/${makeCid(campaign)}`">
    <app-entity-card :description="campaign.description" />
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

import type { CampaignEntity } from '@/store/business-types';
import { makeCid } from '@/store/core-types';

import AppEntityCard from '@/components/AppEntityCard.vue';

export default defineComponent({
  name: 'AppCampaignCard',
  components: { AppEntityCard },
  props: {
    campaign: {
      type: Object as PropType<CampaignEntity>,
      required: true,
    },
  },
  setup() {
    return { makeCid };
  },
});
</script>

<style scoped>

</style>
