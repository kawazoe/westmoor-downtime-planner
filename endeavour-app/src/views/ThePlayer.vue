<template>
  <main class="container px-4">
    <h2>Welcome {{player.description}}</h2>

    <h3><app-icon :icon="faPortrait" /> Characters</h3>
    <section>
      <app-character-card class="w-full" v-for="character of player.characters" :key="character.id" :character="character" />
    </section>

    <h3><app-icon :icon="faAtlas" /> Campaigns</h3>
    <section>
      <app-campaign-card class="w-full" v-for="campaign of player.campaigns" :key="campaign.id" :campaign="campaign" />
    </section>

    <h3><app-icon :icon="faMoneyBill" /> Subscription</h3>
    <section>
      <app-subscription-presenter class="w-full" :subscription="player.subscription" />
    </section>
  </main>
</template>

<script>
import { computed, defineComponent } from 'vue';

import { faAtlas, faMoneyBill, faPortrait } from '@fortawesome/pro-regular-svg-icons';

import { useStore } from '@/store';

import AppCampaignCard from '@/containers/AppCampaignCard';
import AppCharacterCard from '@/containers/AppCharacterCard';
import AppIcon from '@/components/AppIcon';
import AppSubscriptionPresenter from '@/components/AppSubscriptionPresenter';

export default defineComponent({
  name: 'ThePlayer',
  components: { AppSubscriptionPresenter, AppCampaignCard, AppCharacterCard, AppIcon },
  setup() {
    const store = useStore();
    const player = computed(() => store.state.player);

    return { faPortrait, faAtlas, faMoneyBill, player };
  },
});
</script>

<style scoped>
h2 { @apply text-2xl my-4; }
h3 { @apply text-xl mt-8 mb-2; }
section { @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-1 gap-4 my-4; }
</style>
