<template>
  <div>
    <p>当前主题：{{ theme }}</p>
    <button type="button" @click="toggleTheme">切换主题</button>
  </div>
</template>
<script setup lang="ts">
import { ref, inject } from "vue";
import { themeKey } from "../../composables/provider";
const theme = inject(themeKey, ref("dark"));
const updateTheme = inject<(newTheme: string) => void>("updateTheme");
const toggleTheme = () => {
  updateTheme?.(theme.value === "dark" ? "light" : "dark");
};
</script>
