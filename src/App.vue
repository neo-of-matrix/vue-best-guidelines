<script setup lang="ts">
import { ref, provide, readonly } from "vue";
import HelloWorld from "./components/business/HelloWorld.vue";
import { themeKey } from "./composables/provider";
const theme = ref("dark");

// 提供数据给所有后代组件
provide(themeKey, readonly(theme));
provide("updateTheme", (newTheme: string) => {
  theme.value = newTheme;
});
</script>

<template>
  <HelloWorld />
</template>
