<template>
  <h2>The Campaigns Page</h2>

  <div id="nav">
    <router-link :to="`${rel}/1`">Campaign 1</router-link> |
    <router-link :to="`${rel}/2`">Campaign 2</router-link> |
    <router-link :to="`${rel}/3`">Campaign 3</router-link>
  </div>

  <router-view/>
</template>

<script>
import { defineComponent } from 'vue';
import { useRelativeRoute } from '@/router/routes';

export default defineComponent({
  name: 'TheCampaigns',
  setup() {
    const rel = useRelativeRoute();

    return { rel };
  },
});
</script>

<style scoped>

</style>
