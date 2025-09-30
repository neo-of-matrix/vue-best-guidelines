<template>
  <div>
    <p>user name is {{ user.name }}</p>
    <p>user age is {{ user.age }}</p>
    <p>user city is {{ user.address.city }}</p>
    <button type="button" @click="changeUserObject">修改整个对象</button>&nbsp;
    <button type="button" @click="changeMultipleProperty">修改多个属性</button>
  </div>
</template>
<script setup lang="ts">
import { watch, watchEffect, ref } from "vue";
interface User {
  name: string;
  age: number;
  address: {
    city: string;
  };
}
const user = ref<User>({
  name: "张三",
  age: 21,
  address: {
    city: "北京",
  },
});

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
const changeMultipleProperty = () => {
  user.value.name = "李四";
  user.value.age = 24;
  user.value.address.city = "上海";
};
// 监听整个对象，user 重新赋值时候才会触发
watch(
  () => user.value,
  (newUser, oldUser) => {
    console.log(
      `user name 从 ${oldUser?.name} 变为 ${newUser.name}, age 从 ${oldUser?.age} 变为 ${newUser.age}, city 从 ${oldUser?.address?.city} 变为 ${newUser.address.city}`
    );
  }
  // 如果加上 deep，修改单一属性也会触发，请注意 newUser 和 oldUser 数据是相同的
  // {
  //   deep: true,
  // }
);
// 监听基本数据类型属性
watch(
  [() => user.value.name, () => user.value.age, () => user.value.address.city],
  ([newName, newAge, newCity], [oldName, oldAge, oldCity]) => {
    console.log(
      `user name 从 ${oldName} 变为 ${newName}, age 从 ${oldAge} 变为 ${newAge}, city 从 ${oldCity} 变为 ${newCity}`
    );
  }
);
// watchEffect 相当于 watch 添加 immediate: true，自动检测回调函数里面使用的数据
watchEffect(() => {
  console.log(`user name is ${user.value.name}`);
});
</script>
