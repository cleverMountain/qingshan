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
              title: "重写数组方法",
              path: '/base/jsBasic/array/'
            },
            {
              title: "重写对象方法",
              path: '/base/jsBasic/object/'
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
          title: '技术文章',
        }
      ],
      '/original/': [
        {
          title: '源码系列',
        }
      ]
    }
  }
}
