<template>
  <div>
    <h4>{{subscription.description}}</h4>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

import type { SubscriptionEntity } from '@/stores/business-types';

defineProps({
  subscription: {
    type: Object as PropType<SubscriptionEntity>,
    required: true,
  },
});
</script>

<style scoped>

</style>
