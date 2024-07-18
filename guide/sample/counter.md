# Counter示例

## Vue Lim

<CodeBox name="Vue Counter" :is-vue="true"/>

```vue
<script setup lim>
let count = 0;
</script>
<template>
  <button @click="count++">count is {{ count }}</button>
</template>
```

## React Lim

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