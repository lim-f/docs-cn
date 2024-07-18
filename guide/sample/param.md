# 参数传递使用示例

## Vue Lim

<CodeBox name="Vue Parameter" :is-vue="true"/>

```vue
<script setup lim>
const persons = [ {
    name: 'Jack',
    age: 18,
}, {
    name: 'Bob',
    age: 19,
} ];
const addAge = (data) => data.age += 1;
</script>
<template>
    <div v-for="item, index in persons">
        <span>{{index}}: {{item.name}} age is {{item.age}}</span>
        <button @click="addAge(item)">Add Age</button>
    </div>
</template>
```

## React Lim

<CodeBox name="React Parameter"/>

```jsx
function App () {
    const persons = [ {
        name: 'Jack',
        age: 18,
    }, {
        name: 'Bob',
        age: 19,
    } ];
    const addAge = (data) => data.age += 1;
    return <>
        {
            persons.map((item, index) => (
                <div>
                    <span>{index}: {item.name} age is {item.age}</span>
                    <button onClick={() => addAge(item)}>Add Age</button>
                </div>
            ))
        }
    </>;
}
```