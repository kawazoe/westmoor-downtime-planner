import { computed, inject } from 'vue';
import { useRoute, viewDepthKey } from 'vue-router';
import type { ComputedRef } from 'vue';

export function useRelativeRoute(): ComputedRef<string> {
  const route = useRoute();
  const depth = inject(viewDepthKey, route.matched.length);

  return computed(() => {
    const path = route.matched[depth - 1].path;
    return Object.entries(route.params)
      .sort((([aKey], [bKey]) => (aKey.length > bKey.length ? 1 : aKey.length < bKey.length ? -1 : 0)))
      .reduce((acc, [key, param]) => acc.replace(`:${key}`, param as string), path);
  });
}
