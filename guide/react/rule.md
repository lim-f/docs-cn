<!--
 * @Author: chenzhongsheng
 * @Date: 2024-07-17 17:24:30
 * @Description: Coding something
-->
# 规则

## 启用规则

react-lim 默认不会对所有 react 文件开启编译。

当使用 `.lim.tsx` 或者 `.lim.jsx` 作为文件后缀时会开启 lim 的编译

当使用仅 `.tsx` 或者 `.jsx` 时，需要在文件头部添加 `'use lim'` 或者 `// use lim` 来开启 lim编译

```jsx
'use lim'

// some code...
```

```jsx
// use lim

// some code...
```

## React Hooke

react-lim 可以和React Hooke自由结合使用，React Hooke的优先级高于react-lim编译。

## API

react-lim 编译可以在浏览器环境运行，使用方式如下

```js
import { transformReact } from 'react-lim';
console.log(transformReact(`// some react code`));
```

或者可以通过cdn引入

```html
<script src='https://cdn.jsdelivr.net/npm/react-lim'></script>
<script>
console.log(ReactLim.transformReact(`// some react code`));
</script>
```
