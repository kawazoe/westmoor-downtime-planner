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

<script lang="ts">
import { defineComponent } from 'vue';

import { faEdit, faTrash } from '@fortawesome/pro-regular-svg-icons';

import AppButton from '@/components/AppButton.vue';
import AppIcon from '@/components/AppIcon';

export default defineComponent({
  name: 'AppEntityCard',
  components: { AppButton, AppIcon },
  props: {
    description: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { faEdit, faTrash };
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
