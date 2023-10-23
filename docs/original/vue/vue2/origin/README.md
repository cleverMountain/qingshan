1. 从构造函数new Vue说起
- new Vuw(options),选项式：将须向的参数通过对象的方式传入
```js
// 传入el，data，created，methods
const vm = new Vue({
  el: '#app',
  data: {},
  created() {},
  methods: {}
})
```
- 源码中的构造函数Vue
- 调用initMixin方法在原型对象上添加_init方法
- new Vue时调用
```js
function Vue(options) {
  // 2.初始化选项，执行原型对象上的_init函数
  this._init(options);
}
function initMixin(Vue) {
  Vue.prototype._init = function(options) {}
}
// 在构造函数Vue的原型对象上添加——init方法
initMixin(Vue);
```
2. new调用时触发的_init方法,主要初始化了生命周期，方法，数据，状态等等
- initLifecycle(vm)初始化生命周期
- initProxy(vm)初始化代理
- initEvents(vm)初始化事件
- 注册生命周期beforeCreate与beforeCreate
- initState(vm)方法会初始化方法，data，computed等等，所以created之前beforeCreated之后访问不到data，method等
```js
Vue.prototype._init = function (options) {
  var vm = this
  resolveConstructorOptions(vm.constructor)
  vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    );
  {
  initProxy(vm);
  // expose real self
  vm._self = vm;
  // 初始化生命周
  initLifecycle(vm);
  // 初始化事件
  initEvents(vm);
  initRender(vm);
  callHook(vm, 'beforeCreate');
  initInjections(vm); // resolve injections before data/props
  // 初始化状态
  initState(vm);
  initProvide(vm); // resolve provide after data/props
  callHook(vm, 'created')
  if (vm.$options.el) 
    let d = vm.$mount(vm.$options.el);
    return
  }
};
``` 


3. initState(vm)初始化状态
- 初始化prop
- 初始化方法
- 初始化data
- 初始化computed
- 初始化watch
```js
function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;
  // 有prop初始化prop
  if (opts.props) { initProps(vm, opts.props); }
  // 初始化方法
  if (opts.methods) { initMethods(vm, opts.methods); }
  // 初始化data
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  // 初始化computed
  if (opts.computed) { initComputed(vm, opts.computed) }
  // 初始化watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

4. 初始化methods
- 对方法的一种代理，在vm实例上绑定方法,this.method = vm.method = vm.$options.method
```js
function initMethods(vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
```


5. 初始化data
- 判断data的类型，如果是函数则data.call(vm)，否则为data
- 在vm上添加_data属性，用于代理this.key
- 对data的所有key进行代理
- this.key = this._data.key
```js
function initData(vm) {
  const { data, methods } = vm.$options
  // 判断是都是函数
  dataTmp = vm._data = typeof data === 'function' ? data.call(vm) : data
  // proxy(vm, '_data', key)
  let keys = Object.keys(dataTmp)
  let len = keys.length
  while (len--) {
    let key = keys[len]
    // 代理
    proxy(vm, '_data', key)
  }
  // 监听
  observe(data, true /* asRootData */)
}
let sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};
// 代理
function proxy(target, sourceKey, key) {
  // 重写get
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  };
  // 重写set
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

6. 对data进行监听
```js
observe(data, true)
```