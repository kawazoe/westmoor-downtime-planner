<template>
  <div>
    <h4>{{subscription.description}}</h4>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

import type { SubscriptionEntity } from '@/store/business-types';

export default defineComponent({
  name: 'AppSubscriptionPresenter',
  props: {
    subscription: {
      type: Object as PropType<SubscriptionEntity>,
      required: true,
    },
  },
});
</script>

<style scoped>

</style>
