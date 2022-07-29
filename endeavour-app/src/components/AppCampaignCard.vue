<template>
  <router-link :to="`/campaigns/${makeCid(campaign)}`">
    <app-entity-card :summary="campaign.summary" />
  </router-link>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

import type { CampaignEntity } from '@/stores/businessTypes';
import { makeCid } from '@/stores/coreTypes';

import AppEntityCard from '@/components/AppEntityCard.vue';

defineProps({
  campaign: {
    type: Object as PropType<CampaignEntity>,
    required: true,
  },
});
</script>

<style scoped>

</style>
