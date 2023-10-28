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
            {
              title: '语音播报',
              path: '/article/video/'
            },
            {
              title: '时间格式化',
              path: '/article/formatDate/'
            },
            {
              title: 'vue2的数据劫持',
              path: '/article/observe/'
            }
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
            },
            {
              title: 'vue2',
              children: [
                {
                  title: '源码',
                  path: '/original/vue/vue2/origin/'
                }
              ]
            },
            {
              title: 'vuex',
              children: [
                {
                  title: '源码',
                  path: '/original/vue/vuex/read/'
                },
                {
                  title: '完成自己的vuex',
                  path: '/original/vue/vuex/self/'
                },
                {
                  title: '命名空间',
                  path: '/original/vue/vuex/nameSpace/'
                }
              ]
            }
          ]
        },
        {
          title: 'axios',
          children: [
            {
              title: '源码',
              path: '/original/axios/read/'
            },
            {
              title: '自己的简易axios',
              path: '/original/axios/self/'
            },
            {
              title: '关于Promise数组链',
              path: '/original/axios/chain/'
            }
          ]
        },
        {
          title: 'lodash',
          children: [
            {
              title: '整体结构',
              path: '/original/lodash/all/'
            },
            {
              title: '函数部分',
              path: '/original/lodash/function/'
            }
          ]
        }
      ]
    }
  }
}
