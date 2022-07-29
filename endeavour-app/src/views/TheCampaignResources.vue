<template>
  <article class="container px-4">
    <h2>The Campaign's Resources Page</h2>

    <app-binder-presenter :value="progressiveResources.store">
      <template #initial>
        <div ref="resourcesLoader">...</div>
      </template>
      <template #nested="{pages, metadata}">
        <div class="flex gap-8">
          <aside v-if="metadata.facets">
            <div v-for="(facetCandidates, facetKey) in metadata.facets" :key="facetKey" class="mb-4">
              <h4 class="text-lg">{{facetKey}}</h4>
              <ol>
                <li v-for="{value, count} in facetCandidates" :key="value" class="flex justify-between gap-2">
                  <span>{{value}}</span>
                  <span>({{count}})</span>
                </li>
              </ol>
            </div>
          </aside>
          <ol class="flex-1">
            <app-binder-page-presenter v-for="page in pages" :value="page" :key="page.key">
              <template #content>
                <li v-for="{document, score} in page.value" :key="score">
                  <span>{{document.id}}</span>
                  <span>{{document.summary}}</span>
                </li>
              </template>
            </app-binder-page-presenter>
          </ol>
        </div>
        <div ref="resourcesLoader">...</div>
      </template>
    </app-binder-presenter>
  </article>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useFungibleResourcesSearchDataStore } from '@/stores';

import { useIntersectionObserver } from '@/components/intersectionObserverComposable';
import { useProgressiveBinder } from '@/components/binderComposables';

import AppBinderPagePresenter from '@/components/AppBinderPagePresenter';
import AppBinderPresenter from '@/components/AppBinderPresenter';

const useProgressiveResources = useProgressiveBinder(useFungibleResourcesSearchDataStore);
const progressiveResources = useProgressiveResources();

const resourcesLoader = ref<HTMLElement | null>(null);
useIntersectionObserver(resourcesLoader, e => e.isIntersecting && progressiveResources.trigger().then(() => !progressiveResources.currentPage?.metadata.last));
</script>

<style scoped>

</style>
