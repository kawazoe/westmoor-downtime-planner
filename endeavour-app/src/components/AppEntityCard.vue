<template>
  <div class="flex justify-between items-baseline p-2 border border-primary rounded-md shadow">
    <h4 class="p-2 overflow-hidden overflow-ellipsis whitespace-nowrap">{{description}}</h4>
    <div class="flex-shrink-0">
      <app-button class="button" @click.prevent="">
        <app-icon :icon="faTrash" />
      </app-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import { faTrash } from '@fortawesome/pro-regular-svg-icons';

import AppButton from '@/components/AppButton.vue';
import AppIcon from '@/components/AppIcon';

defineProps({
  description: {
    type: String,
    required: true,
  },
});

</script>

<style scoped>
.button {
  @apply mx-1;

  &:last-of-type {
    @apply mr-0.5;
  }
}
</style>
