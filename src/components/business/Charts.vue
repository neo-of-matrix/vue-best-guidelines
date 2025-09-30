<template>
  <div ref="chartDom" style="width: 600px; height: 400px"></div>
</template>
<script setup lang="ts">
import { onMounted, useTemplateRef, onErrorCaptured } from "vue";
import { useEcharts } from "../../hooks/useEcharts";
import type { ECOption } from "../../hooks/useEcharts";

const chartDom = useTemplateRef("chartDom");
const { setOption } = useEcharts(chartDom);
onMounted(() => {
  const option: ECOption = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  };
  setOption(option);
});
onErrorCaptured((error) => {
  console.error("捕获到错误:", error);
  // 上报错误到监控系统
  return false; // 阻止错误继续向上传播
});
const debug = (message: string, ...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};
debug("组件状态:", { chartDom });
</script>
