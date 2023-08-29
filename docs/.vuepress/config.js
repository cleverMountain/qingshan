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
      }
    ],

    sidebar: {
      '/base/': [
        {
          title: 'js相关',
          children: [
            {
              title: "关于数组方法",
              path: '/base/jsBasic/array/'
            },
            {
              title: "关于对象方法",
              path: '/base/jsBasic/object/'
            },
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
      ]
    },



  }
}
