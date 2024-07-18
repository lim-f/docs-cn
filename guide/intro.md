<!--
  * @Author: chenzhongsheng
  * @Date: 2023-09-08 13:17:31
  * @Description: Coding something
-->
# 介绍

## 什么是 Lim?

Lim 是 Less is More 的缩写，其本质是一个编译器，用于编译Vue或者React代码，使得开发者可以无需使用 Composition API 或 React Hooks。

Lim 通过静态分析代码中变量的依赖与变更关系，找出UI依赖并且发生了或可能发生变更的变量。对这些变量进行对应框架的改写，并且同时修改其所有引用。

以下分别举Vue和React的计数器示例：

<CodeBox name="Vue Counter" :is-vue="true"/>

```vue
<script setup lim>
let count = 0;
</script>
<template>
  <button @click="count++">count is {{ count }}</button>
</template>
```

<CodeBox name="React Counter"/>

```jsx
function App () {
    let count = 1;
    const increase = () => count ++;
    return <button onClick={increase}>
        count is {count}
    </button>;
}
```

## 兼容性

Lim 只有编译时，没有运行时。并且编译产物是完全的Vue或者React代码，因此，Lim可以和Vue或React的第三方生态库完美适配，无需考虑使用新框架带来的生态不完善的问题。