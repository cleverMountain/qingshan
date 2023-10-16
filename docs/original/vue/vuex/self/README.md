1. Store构造函数，通过传入的options收集模块并安装，如果存在插件的话安装完毕后注册插件
- _mutations
- _actions
- _actions
- 插件：发布订阅模式，注册插件时通过subscrib收集插件,通过publish调用函数
- commit
- dispatch
```js
let that
class Store {
  constructor(options) {
    // 插件持久化存储时需要先将options的参数替换成localstorage中的数据
    this.replacdState(options)
    /**
     * 收集modules
     * a: {
     *  modules: {
     *    b
     *  }
     * }
    */
    this._modules = new ModuleCollection(options)
    // mutatios收集的同步commit函数
    this._mutations = Object.create(null)
    // actios收集的异步的dispatch函数
    this._actions = Object.create(null)
    this._getters = Object.create(null)
    // 收集插件方法，订阅
    this.cbs = []
    const state = this._modules.root.state
    // 安装模块
    installModule(this, state, [], this._modules.root)
    // 注册插件
    this.registerPlugin(options)

    that = this
  }
  // commit函数，触发_mutations收集的函数
  commit(method, paload) {
    let old = that.$state
    console.log(that.$state)
    that._mutations[method].forEach(cb => {
      cb.call(this, that.state, paload)
      // debugger
      console.log(that.$state)
      // this.subscrib(null, method, this.state)
      that.publish(that.$state, old, method)
    })
  }
  // dispatch函数，触发actions收集的函数
  dispatch(method, paload) {
    this._actions[method].forEach(cb => {
      cb.call(this, this, paload)
    })
  }
```

2. ModuleCollection构造函数，收集mudules，在收集modules时通过Module构造函数组装module,并通过register注册module，在注册module时重点是确认各个模块的父子关系
- root，根module，通过register在root上添加子模块
```js
class ModuleCollection {
  constructor(options) {
    this.root = null
    this.register([], options)
  }
  // 注册模块，深度递归注册
  register(path, rootModule) {
    let newModule = new Module(rootModule)
    rootModule.newModule = newModule
    if (!this.root) {
      this.root = newModule
    } else {
      // 父亲
      let parent = path.slice(0, -1).reduce((pre, item) => {
        pre = pre._children[item]
        return pre
      }, this.root)
      let key = path[path.length - 1]
      parent._children[key] = newModule
    }
    let obj = newModule._raw.modules
    if (obj) {
      Object.keys(obj).forEach(key => {
        // 栈结构确认父子关系
        this.register(path.concat(key), obj[key])
      })
    }
  }
}
```

3. Module构造函数，统一管理模块状态
- _raw，当前的module
- _children，子模块
```js
class Module {
  constructor(options) {
    // 当前的module
    this._raw = options
    // 子module
    this._children = {}
    // 当前的状态
    this.state = options.state
  }
  // 循环安装mutations
  forEachmutations(cb) {
    if (this._raw.mutations) {
      forEachObj(this._raw.mutations, cb)
    }
  }
  // 循环安装actions
  forEachActions(cb) {
    if (this._raw.actions) {
      forEachObj(this._raw.actions, cb)
    }
  }
}
```

4. installModule，收集完成module后，开始安装module
- state： 确定state的父子关系
- frontPath： 命名空间
```js
const installModule = (store, rootState, path, newModule) => {
  /**
   * 确当state的父子关系
   * state: {
   *   a: 1
   *   moduleB: {
   *     c: 2
   *   }
   * }
  */
  if (path.length === 0) {
    store.state = rootState
  } else {
    // 确定父子关系
    let key = path[path.length - 1]
    let parent = path.slice(0, -1).reduce((pre, cur) => {
      pre = pre[cur]
      return pre
    }, store.state)

    parent[key] = rootState

  }
  // 简化的命名空间
  let frontPath = path.length > 0 ? path.join('/') + '/' : ''
  // 安装mutation模块
  newModule.forEachmutations((key, value) => {
    store._mutations[frontPath + key] = store._mutations[frontPath + key] || []
    store._mutations[frontPath + key].push(value)
  })
  // 安装actions模块
  newModule.forEachActions((key, value) => {
    store._actions[frontPath + key] = store._actions[frontPath + key] || []
    store._actions[frontPath + key].push(value)
  })
  if (newModule._children) {
    forEachObj(newModule._children, (key, value) => {
      installModule(store, value.state, path.concat(key), value)
    })
  }
}
```

5. 辅助函数mapState， mapMutations及mapActions，通过这些函数返回对应的函数和state状态
```js
mapState() {
  let obj = {}
  for(let k in this.$state) {
    obj[k] = computed(() => this.$state[k])
  }
  return obj
}
mapMutations() {
  let obj = {}
  for(let k in this.mutations) {
    obj[k] = this.mutations[k]
  }
  return obj
}
mapActions() {
  let obj = {}
  for(let k in this.actions) {
    obj[k] = this.mutations[k]
  }
  return obj
}
```
6. vuex插件机制,持久化存储的插件，插件形态的是函数
```js
function persistedState (store) {
  // 订阅
  store.subscrib((state) => {
    localStorage.setItem('vuex', JSON.stringify(state))
  })
}
```

7. 注册插件
```js
registerPlugin(options) {
  if (!options.plugins) return
  options.plugins.forEach(plugin => {
    plugin.call(this, this)
  })
}
// 发布
publish(newState, oldState, method) {
  that.cbs.forEach(cb => cb(newState, oldState, method))
}
// 订阅
subscrib(cb) {
  this.cbs.push(cb)
}
// 初始化状态
replacdState(options) {
  let newState = localStorage.getItem('vuex')
  if (newState) {
    options.state = JSON.parse(newState)
  }
}
```

8. github地址:  <https://github.com/cleverMountain/store>
