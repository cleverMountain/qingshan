1. vuex中确定各个模块的父子关系，通过命名空间来确定
- 将一下模块的state经过转化得到存在父子关系的state树
```js
// 前
let option = {
  state: {
    a: 1
  },
  modules: {
    moduleB: {
      state: {
        b: 2
      },
      modules: {
        moduleC: {
          state: {
            c: 3
          }
        },
        moduleD: {
          state: {
            d: 4
          }
        }
      }
    }
  }
}
// 后
let state = {
  a: 1,
  moduleB: {
    b: 2,
    moduleC: {
      c: 3
    },
    moduleD: {
      d: 4
    }
  }
}
```

2. state中通过找到当前模块的父亲后，在父亲上添加属性,在寻找父亲中定义了一个findParent方法
- 累积的方式可以直接通过reduce去修改
- 也可以通过while循环去获取
```js
function get(option, path, root) {
  function findParent(path, cur) {
    // while循环
    // let parent
    // if (path.length === 1) {
    //   parent = cur
    // } else {
    //   while (path.length > 1) {
    //     const key = path.shift()
    //     parent = cur[key]
    //   }
    // }
    // return parent
    // 使用reduce
    path = path.slice(0, -1)
    return path.reduce((pre, item) => {
      return cur[item]
    }, cur)
  }
  if (path.length === 0) {
    root = option.state
  } else {
    const parent = findParent(path, root)
    const key = path[path.length - 1]
    parent[key] = option.state
  }
  const next = option.modules
  if (!next) return
  Object.keys(next).forEach(module => {
    get(next[module], path.concat(module), root)
  })
}
get(option, [])
```