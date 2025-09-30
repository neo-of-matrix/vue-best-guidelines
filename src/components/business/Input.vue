<template>
  <div>
    <input ref="my-input" type="text" @input="inputChange" />
  </div>
</template>
<script setup lang="ts">
import { useTemplateRef, onMounted } from "vue";

const inputRef = useTemplateRef<HTMLInputElement>("my-input");
const inputChange = (event: Event) => {
  console.log((event.target as HTMLInputElement).value);
};

onMounted(() => {
  inputRef.value?.focus();
});
</script>
