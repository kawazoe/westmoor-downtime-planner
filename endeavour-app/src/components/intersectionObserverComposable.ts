import { onBeforeUnmount, ref, watch } from 'vue';
import type { Ref } from 'vue';

const createDefaultIntersectionEvent = (): IntersectionObserverEntry => ({
  boundingClientRect: new DOMRectReadOnly(0, 0, 0, 0),
  intersectionRatio: 0,
  intersectionRect: new DOMRectReadOnly(0, 0, 0, 0),
  isIntersecting: true,
  rootBounds: new DOMRectReadOnly(0, 0, 0, 0),
  target: document.documentElement,
  time: performance.now(),
});

export function useIntersectionObserver(
  target: Ref<HTMLElement | null>,
  callback: (entry: IntersectionObserverEntry) => Promise<unknown> | unknown,
  options?: IntersectionObserverInit,
): { isIntersecting: Ref<boolean>, disconnect: () => void } {
  if (!('IntersectionObserver' in window)) {
    callback(createDefaultIntersectionEvent());
  }

  const isIntersecting = ref<boolean>(false);
  const repeater = async (entry: IntersectionObserverEntry): Promise<void> => {
    if (isIntersecting.value && await callback(entry)) {
      setTimeout(() => repeater(entry));
    }
  };
  const observer = new IntersectionObserver(
    async entries => {
      const entry = entries[0] ?? createDefaultIntersectionEvent();
      isIntersecting.value = entry.isIntersecting;
      await repeater(entry);
    },
    options,
  );

  onBeforeUnmount(() => {
    if (target.value) {
      observer.unobserve(target.value);
    }
  });
  watch(target, (newTarget, oldTarget) => {
    if (oldTarget) {
      observer.unobserve(oldTarget);
    }
    if (newTarget) {
      observer.observe(newTarget);
    }
  });

  return {
    isIntersecting,
    disconnect: () => observer.disconnect(),
  };
}
