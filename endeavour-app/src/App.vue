<template>
  <app-svg-icon-cache></app-svg-icon-cache>

  <header>
    <nav>
      <ul>
        <li><router-link to="/"><app-icon :icon="faChevronRight"></app-icon> Landing</router-link></li>
        <li><router-link to="/campaigns"><app-icon :icon="faChevronRight"></app-icon> Campaigns</router-link></li>
        <li><router-link to="/player">Player</router-link></li>
        <li><router-link to="/tos">Terms of Service</router-link></li>
      </ul>
    </nav>
  </header>

  <main>
    <router-view/>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';

import AppIcon from '@/components/AppIcon';
import AppSvgIconCache from '@/components/AppSvgIconCache';

export default defineComponent({
  name: 'App',
  components: { AppIcon, AppSvgIconCache },
  setup() {
    return { faChevronRight };
  },
});
</script>
