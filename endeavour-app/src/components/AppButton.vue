<template>
  <button class="w-8 h-8 rounded bg-primary text-white">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'AppButton' });
</script>

<style scoped>

</style>
