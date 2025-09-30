// hooks/useModelCounter.js
import { computed } from "vue";
import type { Ref } from "vue";
function useModelCounter(modelRef: Ref<number>) {
  const increment = () => modelRef.value++;
  const doubleCount = computed<number>(() => modelRef.value * 2);
  return { doubleCount, increment };
}

export { useModelCounter };
