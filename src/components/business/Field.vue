<template>
  <div>
    <button @click="addField">Add Field</button>&nbsp;
    <button @click="submit">submit</button>
    <div v-for="(field, index) in fields" :key="index">
      <input
        v-model="field.value"
        :ref="(el) => (field.ref = el as HTMLInputElement)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";

const fields: Ref<{ value: string; ref: HTMLInputElement | null }[]> = ref([
  { value: "", ref: null },
]);
const addField = () => {
  fields.value.push({ value: "", ref: null });
};
const submit = () => {
  console.log(fields.value.map((field) => field.value));
};
</script>
