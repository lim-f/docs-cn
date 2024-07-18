<!--
 * @Author: chenzhongsheng
 * @Date: 2024-07-17 17:24:30
 * @Description: Coding something
-->
# 规则

## 启用规则

vue-lim 默认不会对所有 vue 文件开启编译。

当使用 `.lim.vue` 作为文件后缀时会开启 lim 的编译

当使用仅 `.vue` 作为后缀, 你需要添加 `lim` 属性到 script 标签来开启 lim 的编译，如下所示

```vue
<script setup lim>
    // ...
</script>
```

**目前仅支持 script setup 场景下使用**

## Composition API

vue-lim 可以和Composition API自由结合使用，Composition API的优先级高于vue-lim编译。

## API

vue-lim 编译可以在浏览器环境运行，使用方式如下

```js
import { transformVue } from 'vue-lim';
console.log(transformVue(`// some vue code`));
```

或者可以通过cdn引入

```html
<script src='https://cdn.jsdelivr.net/npm/vue-lim'></script>
<script>
console.log(VueLim.transformVue(`// some vue code`));
</script>
```
