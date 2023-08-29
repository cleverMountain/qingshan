// import sidebarArr from './config/sidebar'
module.exports = {
  title: 'note',
  description: 'Just a note about js',
  base: '/qingshan/',
  themeConfig: {
    // sidebar: {
    //   '/foo/': [
    //     '',     /* /foo/ */
    //     'one',  /* /foo/one.html */
    //     'two'   /* /foo/two.html */
    //   ],

    //   '/bar/': [
    //     '',      /* /bar/ */
    //     'three', /* /bar/three.html */
    //     'four'   /* /bar/four.html */
    //   ],
    // },
    // sidebar: {
    //   '/guide/': [
    //     '',        // 对应 guide 文件夹的 README.md 文件
    //     'getting-started',
    //     'configuration'
    //     // 添加更多的侧边栏链接
    //   ]
    // },
    sidebar: {
      '/guide/': [{
        title: 'js基础',
        collapsable: true, // 是否能收起来
        children: [
          'configuration',
          'getting-started'
        ]
      }],
      '/': ['/guide/']
    },
    nav: [
      { text: '指南', link: '/guid312e1' },
      { text: 'API 文档', link: '/api1' },
      { text: 'GitHub', link: 'https://github.com/your-repo' }
    ],

  }
  // themeConfig: {
  //   nav: [
  //     { text: '首页', link: '/' },
  //     { text: '关于', link: '/about/' },
  //     // 添加更多的导航链接
  //   ],
  //   sidebar: {
  //     '/guide/': [
  //       '',        // 对应 guide 文件夹的 README.md 文件
  //       'getting-started',
  //       'configuration'
  //       // 添加更多的侧边栏链接
  //     ]
  //   }
  // }
}
