<template>
  <div>
    <button type="button" @click="changeCount">
      count is {{ countModel }}
    </button>
    <p>double count is {{ doubleCount }}</p>
  </div>
</template>
<script setup lang="ts">
import {
  watch,
} from "vue";
import { useModelCounter } from "../../hooks/useModelCounter.ts";
const countModel = defineModel<number>({ default: 0 });
const { doubleCount, increment } = useModelCounter(countModel);
const changeCount = () => {
  increment();
};
// 监听基本类型数据
watch(
  () => countModel.value,
  (newCount, oldCount) => {
    console.log(`count 从 ${oldCount} 变为 ${newCount}`);
  }
);
</script>
