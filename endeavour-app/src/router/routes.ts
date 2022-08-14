import { computed, inject } from 'vue';
import type { ComputedRef } from 'vue';

import { matchedRouteKey, useRoute } from 'vue-router';

import { _throw } from '@/lib/_throw';

function longestToShortest(aKey: string, bKey: string) {
  return aKey.length > bKey.length
    ? 1
    : aKey.length < bKey.length
      ? -1
      : 0;
}

export function useRelativeRoute(): ComputedRef<string> {
  const route = useRoute();
  const closestRoute = inject(matchedRouteKey);

  return computed(() => {
    const path = closestRoute?.value?.path ?? _throw(new Error('[useRelativeRoute] could not find the closest RouterView.'));
    return Object.entries(route.params)
      .sort(([aKey], [bKey]) => longestToShortest(aKey, bKey))
      .reduce((acc, [key, param]) => acc.replace(`:${key}`, param as string), path);
  });
}
