<template>
  <div class="child-element">
    <p>子组件内容</p>
  </div>
  <div class="global-class">全局样式</div>
  <p>{{ props.count }}</p>
  <button type="button" @click="emit('update:count', props.count + 1)">
    增加
  </button>
</template>
<script setup lang="ts">
interface Props {
  count?: number;
}
const emit = defineEmits<{
  (e: "update:count", value: number): void;
}>();
const props = withDefaults(defineProps<Props>(), {
  count: 0,
});
defineExpose({
  count: props.count,
});
</script>
