<!--
 * @Author: chenzhongsheng
 * @Date: 2024-07-17 17:38:36
 * @Description: Coding something
-->
# 双向绑定示例

## Vue Lim

<CodeBox name="Vue Binding" :is-vue="true"/>

```vue
<script setup lim>
let value = 'Hello';
</script>
<template>
  <input v-model="value"/>
  <div> Binding value is {{value}}</div>
</template>
```

## React Lim

<CodeBox name="React Binding"/>

```jsx
function App () {
    let value = 'Hello';
    return <>
        <input onInput={e => value = e.target.value} value={value}/>
        <div> Binding value is {value}</div>
    </>;
}
```