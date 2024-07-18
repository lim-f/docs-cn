# 待办列表示例

## Vue Lim

<CodeBox name="Vue Todo List" :is-vue="true"/>

```vue
<script setup lim>
let current = '';
let hideDone = false;
let todo = [];
const addTodo = ()=>{
  todo.push({
    content: current,
    done: false,
  })
}
const deleteItem = (index)=>{
  todo.splice(index, 1);
}
</script>
<template>
  <input v-model="current"/> 
  <button @click="addTodo">Add Todo</button>
  <button @click="hideDone = !hideDone">{{hideDone ? 'Show' : 'Hide'}} Done Items</button>
  <div v-for="(item, index) in todo" v-show="!hideDone || !item.done">
    <span :style="{ 'text-decoration': item.done ? 'line-through': 'none' }">
      {{ index }}: {{ item.content }}
    </span>
    <button @click="item.done = !item.done">{{ item.done ? 'Undo': 'Done' }}</button>
    <button @click="deleteItem(index)">Delete</button>
  </div>
</template>
```

## React Lim

<CodeBox name="React Todo List"/>

```jsx
function App () {
    let current = '';
    let hideDone = false;
    const todo = [];

    const addTodo = () => {
        todo.push({
            content: current,
            done: false,
        });
    };
    const deleteItem = (index) => {
        todo.splice(index, 1);
    };
    return <>
        <input onInput={e => current = e.target.value}/>
        <button onClick={addTodo}>Add Todo</button>
        <button onClick={() => hideDone = !hideDone}>{hideDone ? 'Show' : 'Hide'} Done Items</button>
        {
            todo.map((item, index) => hideDone && item.done ? null : (<div>
                <span style={{ 'textDecoration': item.done ? 'line-through' : 'none' }}>
                    { index }: { item.content }
                </span>
                <button onClick={() => item.done = !item.done}>{ item.done ? 'Undo' : 'Done' }</button>
                <button onClick={() => deleteItem(index)}>Delete</button>
            </div>))
        }
    </>;
}
```