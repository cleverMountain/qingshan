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
          title: "Array",
          path: '/base/array/'
        },
        {
          title: "Object",
          path: '/base/object/'
        },
        {
          title: "String",
          path: '/base/string/'
        },
        {
          title: "集合",
          path: '/base/mapping/'
        },
        {
          title: "函数",
          path: '/base/function/'
        },
        {
          title: '迭代器、生成器及可迭代对象',
          path: '/base/generate/'
        },
        {
          title: 'Promise',
          path: '/base/promise/'
        },
        {
          title: "CSS",
          link: "/articles/CSS/",
        },
      ],
      '/article/': [
        {
          title: '自定义微信小程序watch与computed',
          path: '/article/watch/'
        },
        {
          title: 'js的数据结构与算法',
          children: [
            {
              title: '数据结构',
              collapsable: false,  // 
              children: [
                {
                  title: '栈',
                  path: '/article/js/dataStructures/stack/'
                },
                {
                  title: '队列',
                  path: '/article/js/dataStructures/queue/'
                },
                {
                  title: '链表',
                  path: '/article/js/dataStructures/linkList/'
                },
                {
                  title: '集合',
                  path: '/article/js/dataStructures/map/'
                },
                {
                  title: '哈希表',
                  path: '/article/js/dataStructures/hashMap/'
                },
                {
                  title: '树结构',
                  path: '/article/js/dataStructures/tree/'
                },
                {
                  title: '图论',
                  path: '/article/js/dataStructures/graph/'
                }
              ]
            },
            {
              title: '算法',
              children: [
                {
                  title: '排序算法',
                  path: '/article/js/algorithms/bubbleSort/'
                }
              ]
            }
          ]
        },
        {
          title: '数组树形化与扁平化',
          path: '/article/treeData/'
        },
        {
          title: 'jsonp',
          path: '/article/jsonp/'
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
        },
        {
          title: '瀑布流',
          path: '/article/waterfallFlow/'
        },
        {
          title: '虚拟列表',
          path: '/article/virList/'
        },


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
        },
        {
          title: 'Promise',
          path: '/original/Promise/'
        }
      ]
    }
  }
}
