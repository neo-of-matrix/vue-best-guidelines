# Vue 3 开发完全指南：从基础到高级的最佳实践

## 组合式 API 优雅组织代码

**选项式 API - 代码分散**

```js
export default {
  data() {
    return { count: 0, name: "" };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
  computed: {
    doubleCount() {
      return this.count * 2;
    },
  },
  mounted() {
    console.log("组件挂载");
  },
};
```

**组合式 API - 逻辑集中**

```js
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const count = ref(0);
    const name = ref("");
    const doubleCount = computed(() => count.value * 2);
    const increment = () => {
      count.value++;
    };
    onMounted(() => {
      console.log("组件挂载");
    });
    return { count, name, doubleCount, increment };
  },
};
```

## 尽量使用 `<script setup>`

```js
<script setup>
import { ref, computed } from 'vue'

// 变量自动暴露给模板
const count = ref(0)
const name = ref('Vue3')

// 函数自动暴露
const increment = () => { count.value++ }

// 计算属性自动暴露
const greeting = computed(() => `Hello, ${name.value}!`)

// 组件自动注册（无需components选项）
import MyComponent from './MyComponent.vue'
</script>

<template>
  <div>
    <MyComponent />
    <button @click="increment">{{ count }}</button>
    <p>{{ greeting }}</p>
  </div>
</template>
```

## reactive 和 ref 的正确选择

建议使用 `ref()` 作为声明响应式状态的主要 API

```js
import { ref, reactive } from 'vue'

const count = ref(0)
const name = ref('')
const user = ref({
  name: '张三',
  age: 25,
  address: {
    city: '北京'
  }
})
// ✅ 尽量不要使用解构赋值, 这样无论是替换整个 Ref，还是单独修改 Ref 其中一个属性都会生效
const changeUser = () => {
  user.value = {
    name: "李四",
    age: 24,
    address: {
      city: "上海",
    },
  };
  user.value.name = "李四";
  user.value.age = 24;
  user.value.address.city = "上海";
};

<template>
  <div>
    <p>user name is {{ user.name }}</p>
    <p>user age is {{ user.age }}</p>
    <p>user city is {{ user.address.city }}</p>
    <button type="button" @click="changeUser">修改 user</button>
  </div>
</template>
```

## 计算属性可写

```js
<script setup>
import { ref, computed } from 'vue'

const price = ref(100)
const quantity = ref(2)
const discount = ref(0.1)

// 可写的计算属性
const total = computed({
  get: () => price.value * quantity.value * (1 - discount.value),
  set: (value) => {
    price.value = value / quantity.value / (1 - discount.value)
  }
})

// 修改 total 会自动更新 price
const updatePrice = () => {
  total.value = 500 // 自动重新计算 price
}
</script>
```

## watch 精准监听

```js
<script setup>
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)
const user = ref({
  name: "张三",
  age: 21,
  address: {
    city: "北京",
  },
});

// 监听单个 ref
watch(count, (newVal, oldVal) => {
  console.log(`count 从 ${oldVal} 变为 ${newVal}`)
})

// 监听多个基本数据类型属性
watch(
  [() => user.value.name, () => user.value.age, () => user.value.address.city],
  ([newName, newAge, newCity], [oldName, oldAge, oldCity]) => {
    console.log(
      `user name 从 ${oldName} 变为 ${newName}, age 从 ${oldAge} 变为 ${newAge}, city 从 ${oldCity} 变为 ${newCity}`
    );
  }
);

// 监听整个对象，user 重新赋值时候才会触发
// 数据放到外边，否则 watch 每次都会触发
const data = {
  name: "李四",
  age: 24,
  address: {
    city: "上海",
  },
};
const changeUserObject = () => {
  user.value = data;
};
watch(
  () => user.value,
  (newUser, oldUser) => {
    console.log(
      `user name 从 ${oldUser.name} 变为 ${newUser.name}, age 从 ${oldUser.age} 变为 ${newUser.age}, city 从 ${oldUser.address.city} 变为 ${newUser.address.city}`
    );
  }
  // 如果加上 deep，修改单一属性也会触发，请注意 newUser 和 oldUser 数据是相同的
  // {
  //   deep: true,
  // }
);

// watchEffect 相当于 watch 添加 immediate: true，自动检测回调函数里面使用的数据
watchEffect(()=>{
  console.log(`user name is ${user.value.name}`)
})
</script>
```

## 组件通信的多种方式

### v-model 和 defineModel（父子通信）

```js
<!-- 子组件 -->
<script setup>
const countModel = defineModel({ default: 0 })

const changeCount = () => {
  countModel.value = countModel.value + 1;
};
</script>

<!-- 父组件 -->
<script setup>
const count = ref(0);
</script>
<template>
  <ChildComponent v-model="count" />
</template>
```

### provide/inject（跨级通信）

```js
<!-- 祖先组件 -->
<script setup>
import { provide, ref } from 'vue'

const theme = ref('dark')

// 提供数据给所有后代组件
provide('theme', theme)
provide('updateTheme', (newTheme) => {
  theme.value = newTheme
})
</script>

<!-- 后代组件 -->
<script setup>
import { inject } from 'vue'

const theme = inject('theme')
const updateTheme = inject('updateTheme')

// 修改主题
const toggleTheme = () => {
  updateTheme(theme.value === 'dark' ? 'light' : 'dark')
}
</script>
```

## 自定义 Hooks - 逻辑复用神器

```js
// hooks/useCounter.js
import { ref, computed } from "vue";

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => (count.value = initialValue);
  const double = computed(() => count.value * 2);
  return { count, increment, decrement, reset, double };
}

// 在组件中使用
<script setup>
  import {useCounter} from '@/hooks/useCounter' const 
  {(count, increment, double)} = useCounter(10)
</script>;
```

## 模板引用（Template Refs）技巧

```js
<template>
    <input ref="inputRef" type="text">
    <ChildComponent ref="child" />
    <div>
      <button @click="addField">Add Field</button>
      <div v-for="(field, index) in fields" :key="index">
        <input
          v-model="field.value"
          :ref="
            (el) => {
              if (el) {
                field.ref = el;
              }
            }
          "
        />
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref(null)
const childRef = useTemplateRef("child");

const list = ref([1, 2, 3]);
const itemRefs = useTemplateRef("items");

const fields = ref([{ value: "", ref: null }]);
const addField = () => {
  fields.value.push({ value: "", ref: null });
};
onMounted(() => {
  inputRef.value.focus()
  console.log(childRef.value) // 子组件实例
  console.log(itemRefs.value);
})
</script>
```

## 条件渲染的性能优化

```js
<template>
  <!-- ✅ 使用 v-show 频繁切换 -->
  <div v-show="isVisible">频繁显示隐藏的内容</div>

  <!-- ✅ 使用 v-if 初始条件 -->
  <div v-if="hasData">一次性判断的内容</div>

  <!-- ✅ 使用 Teleport 传送门 -->
  <Teleport to="body">
    <Modal v-if="showModal" />
  </Teleport>

  <!-- ✅ 使用 Suspense 异步组件 -->
  <Suspense>
    <template ##default>
      <AsyncComponent />
    </template>
    <template ##fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

## 样式和作用域技巧

```js
<template>
  <div class="container" :class="{ active: isActive, 'text-error': hasError }">
    <p :style="{ color: textColor, fontSize: fontSize + 'px' }">动态样式</p>
  </div>
</template>

<style scoped>
/* 作用域样式 */
.container {
  padding: 20px;
}

/* 深度选择器 */
.container :deep(.child-element) {
  color: red;
}

/* 全局样式 */
.container :global(.global-class) {
  margin: 10px;
}

/* CSS 变量 */
.container {
  --primary-color: ##42b983;
  color: var(--primary-color);
}
</style>
```

## 事件处理的高级技巧

```js
<template>
  <!-- 事件修饰符 -->
  <button @click.stop="handleClick">阻止冒泡</button>
  <form @submit.prevent="handleSubmit">阻止默认</form>
  <input @keyup.enter="submit" @keyup.esc="cancel">

  <!-- 多个事件 -->
  <div @click="handleClick" @mouseenter="handleMouseEnter"></div>

  <!-- 自定义事件 -->
  <MyComponent @custom-event="handleCustom" />
</template>

<script setup>
// 事件处理函数
const handleClick = (event) => {
  console.log('点击事件', event.target)
}

// 带参数的事件
const handleItemClick = (item, index, event) => {
  console.log('点击项目:', item, index)
}
</script>
```

## 生命周期的最佳实践

```js
<script setup>
import { onMounted, onUnmounted, onUpdated } from 'vue'

// 组件挂载
onMounted(() => {
  console.log('组件挂载完成')
  // 初始化操作、监听事件、获取数据
  window.addEventListener('resize', handleResize)
})

// 组件更新
onUpdated(() => {
  console.log('组件更新了')
  // DOM 更新后的操作
})

// 组件卸载
onUnmounted(() => {
  console.log('组件卸载')
  // 清理操作：移除事件监听、清除定时器
  window.removeEventListener('resize', handleResize)
})

// 错误处理
onErrorCaptured((error) => {
  console.error('捕获到错误:', error)
  return false // 阻止错误继续向上传播
})
</script>

```

## 路由和状态管理技巧

```js
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

// 路由操作
const goToUser = (userId) => {
  router.push(`/user/${userId}`)
}

// 状态管理
const user = computed(() => store.state.user)

const updateUser = () => {
  store.dispatch('user/updateUser', { name: '新名字' })
}

// 监听路由变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadUserData(newId)
  }
})
</script>
```

## TypeScript 支持

```ts
<script setup lang="ts">
import { ref, computed, provider, inject, useTemplateRef } from 'vue'

// 类型定义
interface User {
  name: string;
  age: number;
  address: {
    city: string;
  };
}

// 带类型的 ref
const user = ref<User>({
  name: "张三",
  age: 21,
  address: {
    city: "北京",
  },
})

// 带类型的 props
interface Props {
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// 带类型的 emits
const emit = defineEmits<{
  (e: "update:count", value: number): void;
}>();

// 带类型的计算属性
const doubleCount = computed<number>(() => modelRef.value * 2);

// defineModel
const countModel = defineModel<number>({ default: 0 });

// Ref
const inputRef = useTemplateRef<HTMLInputElement>("my-input");
const inputChange = (event: Event) => {
  console.log((event.target as HTMLInputElement).value);
};

// Provider 和 inject
const themeKey = Symbol() as InjectionKey<Ref<string>>;
provide(themeKey, readonly(theme));
provide("updateTheme", (newTheme: string) => {
  theme.value = newTheme;
});
const theme = inject(themeKey, ref("dark"));
const updateTheme = inject<(newTheme: string) => void>("updateTheme");
</script>
```

## 性能优化技巧

```js
<script setup>
import { shallowRef, markRaw } from 'vue'

// 操作 DOM 的第三方库使用
  const chartInstance = shallowRef<EChartsType | null>(null);

// 使数据脱离响应性系统
const heavyInstance = markRaw(new HeavyClass())

// 懒加载组件
const HeavyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)

// 计算属性缓存
const expensiveValue = computed(() => {
  return heavyCalculation(props.data)
})

// 防抖操作
import { debounce } from 'lodash-es'
const search = debounce((query) => {
  // 搜索逻辑
}, 300)
</script>
```

## 错误边界和调试

```js
<template>
      <ComponentThatMightError />
</template>

<script setup>
// 错误处理
const handleError = (error) => {
  console.error('组件错误:', error)
  // 上报错误到监控系统
}

// 开发环境调试
const debug = (message, ...args) => {
  if (import.meta.env.DEV) {
    console.log(`[DEBUG] ${message}`, ...args)
  }
}

// 使用调试函数
debug('组件状态:', { count, user })
</script>
```

## 第三方库集成

```js
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 图表库集成
const chartRef = ref(null)
let chartInstance = null

onMounted(() => {
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption({
    // 图表配置
  })
})

onUnmounted(() => {
  chartInstance?.dispose()
})

// UI 库集成
import { ElMessage } from 'element-plus'

const showMessage = () => {
  ElMessage.success('操作成功！')
}

// 工具库集成
import { cloneDeep, throttle } from 'lodash-es'

const throttledSearch = throttle((query) => {
  // 搜索逻辑
}, 300)
</script>

```

## 项目结构和最佳实践

```js
src/
├── components/         ## 公共组件
│   ├── base/           ## 基础组件
│   └── business/       ## 业务组件
├── views/              ## 页面组件
├── composables/        ## 组合式函数
├── stores/             ## 状态管理
├── utils/              ## 工具函数
├── types/              ## 类型定义
└── assets/             ## 静态资源
└── plugins/            ## 插件
└── hooks/              ## hooks
```