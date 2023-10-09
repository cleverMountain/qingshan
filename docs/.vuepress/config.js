// import sidebarArr from './config/sidebar'
const path = require('path')
module.exports = {
  title: '青山的博客',
  description: 'Just a note about js',
  base: '/qingshan/',
  stylus: {
    import: [
      path.resolve(__dirname, './styles/index.styl')
    ]
  },
  themeConfig: {
    nav: [
      {
        text: "主页",
        link: "/",
      },
      {
        text: "基础知识",
        link: "/base/",
      },
      {
        text: "技术文章",
        link: "/article/",
      },
      {
        text: '源码系列',
        link: '/original/'
      },
    ],

    sidebar: {
      '/base/': [
        {
          title: 'js相关',
          children: [
            {
              title: "Array",
              path: '/base/jsBasic/array/'
            },
            {
              title: "Object",
              path: '/base/jsBasic/object/'
            },
            {
              title: "String",
              path: '/base/jsBasic/string/'
            },
            {
              title: "集合",
              path: '/base/jsBasic/mapping/'
            },
            {
              title: "函数",
              path: '/base/jsBasic/function/'
            },
            {
              title: '迭代器、生成器及可迭代对象',
              path: '/base/jsBasic/generate/'
            },
            {
              title: 'Promise',
              path: '/base/jsBasic/promise/'
            }
          ]
        },
        {
          title: "CSS",
          link: "/articles/CSS/",
        },
      ],
      '/article/': [
        {
          title: '网络',
          children: [
            {
              title: 'jsonp',
              path: '/article/network/jsonp/'
            },
          ]
        },
        {
          title: '其他',
          children: [
            {
              title: '算法',
              children: [
                {
                  title: '双指针类',
                  path: '/article/other/math/two/'
                }
              ]
            },
          ]
        }
      ],
      '/original/': [
        {
          title: 'vue',
          children: [
            {
              title: 'vue3代理',
              path: '/original/vue/proxy/'
            }
          ]
        }
      ]
    }
  }
}
