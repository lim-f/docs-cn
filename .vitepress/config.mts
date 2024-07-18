/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-10 00:53:27
 * @Description: Coding something
 */
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  title: `Lim Docs`,
  description: "Mark Framework Easier to Use",
  base: isProd ? '/docs-cn/': '/',
  outDir: './docs',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: 'https://shiyix.cn/images/lim-logo.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    // ['meta', { property: 'og:title', content: ogTitle }],
    // ['meta', { property: 'og:image', content: ogImage }],
    // ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: "Mark Framework Easier to Use" }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@lim_f' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['link', { rel: 'stylesheet', href: isProd 
      ? 'https://unpkg.com/easy-icon@1.1.0/offline/css/easy-icon.css'
      : `/easy-icon.offline.css` 
    }],
  ],
  locales: {
    root: { label: '简体中文' },
    en: { label: 'English', link: 'https://lim-f.github.io/docs' },
  },
  themeConfig: {
    logo: 'https://shiyix.cn/images/lim-logo.png',
    siteTitle: 'Lim Framework',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/intro' },
      { text: '演练场', link: 'https://lim-f.github.io/playground' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            {
              text: '介绍',
              link: '/guide/intro',
            },
            {
              text: '快速开始',
              link: '/guide/start',
            },
          ]
        },
        {
          text: 'Vue Lim',
          items: [
            {
              text: '安装使用',
              link: '/guide/vue/install',
            },
            {
              text: '规则',
              link: '/guide/vue/rule',
            },
          ]
        },
        {
          text: 'React Lim',
          items: [
            {
              text: '安装使用',
              link: '/guide/react/install',
            },
            {
              text: '规则',
              link: '/guide/react/rule',
            },
          ]
        },
        {
          text: '示例',
          items: [
            {
              text: '计数器',
              link: '/guide/sample/counter',
            },
            {
              text: '数据绑定',
              link: '/guide/sample/binding',
            },
            {
              text: '待办列表',
              link: '/guide/sample/todo',
            },
            {
              text: '参数传递',
              link: '/guide/sample/param',
            },
          ]
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lim-f' }
    ],
    footer: {
      message: 'LimF 2022-present',
      copyright: '@github/lim-f',
    }
  }
})
