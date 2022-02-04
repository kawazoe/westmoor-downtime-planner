<template>
  <table class="border-compact border-separate w-full shadow-md rounded-lg">
    <thead>
    <tr v-for="(row, rowIndex) of header"
        :key="row.join(',') + rowIndex">
      <th v-for="(col, index) of row"
          :key="col + index"
          class="px-2 py-1 bg-gray-100 border-t-2 border-b-2 text-left"
          :class="{
            'border-l-2': index === 0,
            'rounded-tl-lg': index === 0,
            'border-r-2': index === row.length - 1,
            'rounded-tr-lg': index === row.length - 1,
            ...headerClass(row, index),
          }">
        {{col}}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="content.length === 0">
      <td :colspan="header[0]?.length ?? 1"
          class="px-2 pt-0.5 pb-1 border-2 border-t-0 rounded-b-lg text-center italic font-light tracking-tight">
        Go play!
      </td>
    </tr>
    <tr v-for="(row, rowIndex) of content"
        :key="row.join(',') + rowIndex">
      <td v-for="(col, index) of row"
          :key="col + index"
          class="px-2 py-0.5"
          :class="{
            'pb-1': rowIndex === content.length -1,
            'border-l-2': index === 0,
            'border-r-2': index === row.length - 1,
            'border-b-2': rowIndex === content.length -1,
            'rounded-bl-lg': rowIndex === content.length -1 && index === 0,
            'rounded-br-lg': rowIndex === content.length -1 && index === row.length - 1,
            ...contentClass(row, index),
          }">
        {{col}}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';

defineProps({
  header: {
    type: Array as PropType<string[][]>,
    default: () => [],
  },
  headerClass: {
    type: Function as PropType<(row: string[], index: number) => Record<string, unknown>>,
    default: () => ({}),
  },
  content: {
    type: Array as PropType<string[][]>,
    default: () => [],
  },
  contentClass: {
    type: Function as PropType<(row: string[], index: number) => Record<string, unknown>>,
    default: () => ({}),
  },
});
</script>

<style scoped></style>
