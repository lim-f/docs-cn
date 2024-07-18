<!--
 * @Author: chenzhongsheng
 * @Date: 2024-07-17 17:24:26
 * @Description: Coding something
-->
# 安装使用

[Github](https://github.com/lim-f/react-lim)

react-lim 提供了针对主流构建工具的对应插件，不过仅提供从 Lim 源码编译到 react 源码，将 react 源码编译到 js 的工作需要开发者自行选择和引入。这么做的目的是为了降低耦合，使得开发者可以自由的选择 react 的编译插件。其次也可以方便已有项目快速接入 react-lim，仅需引入一个额外的插件即可。

react-lim 可以与 React Hooks 自由组合使用。

## 安装

```
npm i react-lim
```

## Vite 插件

```js
import { defineConfig } from 'vite'
import lim from 'react-lim/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [lim(), react()],
})
```

## Rollup 插件

```ts
import lim from 'react-lim/rollup'
export default {
    plugins: [
        lim(),
        // 此处需要自行引入Vue相关的编译插件
    ]
};
```

## Esbuild 插件

```ts
import lim from 'react-lim/esbuild'
import { build } from 'esbuild';

build({
    plugins: [
        lim(),
        // 此处需要自行引入Vue相关的编译插件
    ],
});
```

## Webpack loader

```ts
module.exports = {
    module: {
        rules: [{
            test: /(\.[tj]sx)$/,
            loader: 'react-lim/webpack',
            exclude: /node_modules/
        }]
        // 此处需要自行引入Vue相关的编译loader
    }
}
```