<template>
  <main class="container px-4">
    <app-async-value :value="player">
      <template v-slot:content="{ value }">
        <h2>Welcome {{value.description}}</h2>

        <h3><app-icon :icon="faPortrait" /> Characters</h3>
        <section>
          <app-character-card class="w-full" v-for="character of value.characters" :key="character.id" :character="character" />
        </section>

        <h3><app-icon :icon="faAtlas" /> Campaigns</h3>
        <section>
          <app-campaign-card class="w-full" v-for="campaign of value.campaigns" :key="campaign.id" :campaign="campaign" />
        </section>

        <h3><app-icon :icon="faMoneyBill" /> Subscription</h3>
        <section>
          <app-subscription-presenter class="w-full" :subscription="value.subscription" />
        </section>
      </template>
    </app-async-value>
  </main>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { faAtlas, faMoneyBill, faPortrait } from '@fortawesome/pro-regular-svg-icons';

import type { AsyncValue } from '@/store/async-store';
import type { PlayerEntity } from '@/store/business-types';
import { useStore } from '@/store';

import AppAsyncValue from '@/components/AppAsyncValue';
import AppCampaignCard from '@/containers/AppCampaignCard.vue';
import AppCharacterCard from '@/containers/AppCharacterCard.vue';
import AppIcon from '@/components/AppIcon';
import AppSubscriptionPresenter from '@/components/AppSubscriptionPresenter.vue';

const store = useStore();
const player = computed(() => store.getters['players/current'] as AsyncValue<PlayerEntity>);
store.dispatch('players/current_trigger');
</script>

<style scoped>
h2 { @apply text-2xl my-4; }
h3 { @apply text-xl mt-8 mb-2; }
section { @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-1 gap-4 my-4; }
</style>
