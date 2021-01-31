<template>
  <h2>The Campaign Page</h2>

  <div id="nav">
    <router-link :to="`${rel}/activities`">Activities</router-link> |
    <router-link :to="`${rel}/characters`">Characters</router-link> |
    <router-link :to="`${rel}/endeavours`">Endeavours</router-link> |
    <router-link :to="`${rel}/resources`">Resources</router-link>
  </div>

  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRelativeRoute } from '@/router/routes';

export default defineComponent({
  name: 'TheCampaign',
  setup() {
    const rel = useRelativeRoute();

    return { rel };
  },
});
</script>

<style scoped>

</style>
