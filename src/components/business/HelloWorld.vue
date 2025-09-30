<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from "vue";
import Count from "./Count.vue";
import User from "./User.vue";
import Price from "./Price.vue";
import Theme from "./Theme.vue";
import Input from "./Input.vue";
import ChildComponent from "./ChildComponent.vue";
import Field from "./Field.vue";
import Charts from "./Charts.vue";
const count = ref(0);
const setCount = (countNum: number) => {
  count.value = countNum;
};

type ChildComponentType = InstanceType<typeof ChildComponent>;
const childRef = useTemplateRef<ChildComponentType>("child");
onMounted(() => {
  console.log(childRef.value);
});
</script>

<template>
  <div class="container">
    <Count v-model="count" />
    <hr />
    <User />
    <hr />
    <Price />
    <hr />
    <Theme />
    <hr />
    <Input />
    <hr />
    <ChildComponent ref="child" :count="count" @update:count="setCount" />
    <hr />
    <Field />
    <hr />
    <Charts />
  </div>
</template>

<style scoped>
/* 作用域样式 */
.container {
  --primary-color: white;
  color: var(--primary-color);
}
/* 深度选择器 */
.container :deep(.child-element) {
  color: red;
}

/* 全局样式 */
.container :global(.global-class) {
  color: #0547f1;
}
</style>
