<template>
  <router-link :to="`/campaigns/${makeCid(campaign)}`">
    <app-entity-card :description="campaign.description" />
  </router-link>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

import type { CampaignEntity } from '@/store/business-types';
import { makeCid } from '@/store/core-types';

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
