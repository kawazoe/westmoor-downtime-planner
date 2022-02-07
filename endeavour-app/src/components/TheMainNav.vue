<template>
  <header class="border-b-2 border-primary shadow-md">
    <nav>
      <router-link class="nav-brand sz-2" to="/">endeavour</router-link>

      <div class="nav-menu items-center">
        <app-async-value :value="campaigns">
          <template v-slot:content="{ value }">
            <router-link class="nav-link text-2xl sz-2"
                         v-for="campaign of value.data"
                         :to="`/campaigns/${makeCid(campaign)}`"
                         :title="campaign.description"
                         :key="campaign.id">
              <app-icon :icon="campaign.icon" />
            </router-link>
          </template>
        </app-async-value>

        <app-async-value :value="player">
          <template v-slot:content>
            <router-link class="nav-link text-2xl sz-2" to="/player">
              <app-icon :icon="faUser" />
            </router-link>
          </template>
          <template v-slot:empty>
            <router-link class="nav-link sz-2" to="/pricing">Pricing</router-link>
            <router-link class="nav-link sz-2" to="/sign-in">Sign In</router-link>
          </template>
        </app-async-value>
      </div>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import type { CampaignEntity, PlayerEntity } from '@/store/business-types';
import type { AsyncValue } from '@/store/async-store';
import { makeCid } from '@/store/core-types';
import type { RestData } from '@/store/core-types';
import { useStore } from '@/store';

import { faUser } from '@fortawesome/pro-solid-svg-icons';

import AppAsyncValue from '@/components/AppAsyncValue';
import AppIcon from '@/components/AppIcon';

const store = useStore();
const campaigns = computed(() => store.getters['campaigns/data'] as AsyncValue<RestData<CampaignEntity>>);
const player = computed(() => store.getters['players/current'] as AsyncValue<PlayerEntity>);
store.dispatch('campaigns/data_trigger');
store.dispatch('players/current_trigger');
</script>

<style scoped>
nav {
  @apply container flex items-center justify-between px-4 py-2;

  .nav-brand {
    @apply text-2xl hover:text-primary-light;
  }

  .nav-menu {
    @apply flex gap-6;

    .nav-link {
      @apply uppercase;
      @apply hover:text-primary-light;
    }

    /*noinspection CssUnusedSymbol*/
    .router-link-active {
      @apply font-medium text-primary-dark;
    }
  }
}
</style>
