import { onMounted, onUnmounted, shallowRef } from "vue";
import type { Ref } from "vue";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import type { LineSeriesOption } from "echarts/charts";
import type { GridComponentOption } from "echarts/components";
import type { ComposeOption, EChartsType } from "echarts/core";
type ECOption = ComposeOption<LineSeriesOption | GridComponentOption>;
echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

export function useEcharts(domRef: Ref<HTMLElement | null>) {
  const chartInstance = shallowRef<EChartsType | null>(null);

  // 初始化图表
  const initChart = () => {
    if (!domRef.value) return;
    chartInstance.value = echarts.init(domRef.value);
  };

  // 设置图表选项
  const setOption = (option: ECOption) => {
    if (!chartInstance.value) return;
    chartInstance.value.setOption(option);
  };

  // 组件挂载时初始化
  onMounted(() => {
    initChart();
  });

  // 组件卸载时销毁
  onUnmounted(() => {
    if (chartInstance.value) {
      chartInstance.value.dispose();
      chartInstance.value = null;
    }
  });

  return {
    chartInstance,
    setOption,
  };
}

export type { ECOption };
