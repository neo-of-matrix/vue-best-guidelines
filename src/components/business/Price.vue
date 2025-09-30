<template>
    <div>
      <p>price is {{ price }}</p>
      <p>quantity is {{ quantity }}</p>
      <p>discount is {{ discount }}</p>
      <p>total is {{ total }}</p>
      <!-- 数量折扣不变，修改总价计算单价 -->
      <button type="button" @click="updatePrice">更新 total</button>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import type { Ref } from "vue";
const price: Ref<number> = ref(10);
const quantity: Ref<number> = ref(2);
const discount: Ref<number> = ref(0.1);

// 可写的计算属性
const total = computed({
  get: () => price.value * quantity.value * (1 - discount.value),
  set: (value) => {
    price.value = value / quantity.value / (1 - discount.value);
  },
});

// 修改 total 会自动更新 price
const updatePrice = () => {
  total.value = 36; // 自动重新计算 price
};
</script>
