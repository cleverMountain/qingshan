## 1. 从构造函数new Vue说起
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
##  2. new调用时触发的_init方法,主要初始化了生命周期，方法，数据，状态等等
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


## 3. initState(vm)初始化状态
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

## 4. 初始化methods
- 对方法的一种代理，在vm实例上绑定方法,this.method = vm.method = vm.$options.method
```js
function initMethods(vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
```


## 5. 初始化data
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

## 6. 对data进行监听,对象部分,不做依赖收集的
- 监听数据时，通过new Observer实现
- 当遇到没有被监听的对象时添加__ob__表示已监听过
- 调用Observer原型的上wlak方法，遍历添加自己的属性
- 调用defineReactive方法添加getter与setter
- defineReactive方法中递归添加key，当是对象时，通过父级的get返回子级，子级也再进行observe
```js
function Observer(value) {
  this.value = value;
  if (typeof value == 'object') {
    // 添加__ob__属性
    def(value, '__ob__', this);
  }
  if (typeof value == 'object') {
    // 遍历
    this.walk(value);
  }
}
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    // 定义响应式
    defineReactive$$1(obj, keys[i]);
  }
};
function defineReactive$$1(obj,key) {
  var property = Object.getOwnPropertyDescriptor(obj, key);
  var getter = property && property.get;
  var setter = property && property.set;
  let val = obj[key]
  // 递归监听
  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // 形成父子级的关系
      var value = getter ? getter.call(obj) : val
      return value
    },
    set: function reactiveSetter(newVal) {}
  })
}
function observe(value, asRootData) {
  ob = new Observer(value);
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}
observe(data, true)
```



## 7. 数据劫持数组部分
- 重新定义一个数组方法的对象
- 重写push、pop、shift、unshift、splice、sort、reverse可以改变原数组的方法
- 当数据调用以上方法时就走重写的方法
- 将原数组数据的原型链指向新的数组方法对象
- 调用observeArray方法监听数组
```js
// 获取原数组方法的原型对象
var arrayProto = Array.prototype;
// 创建一个新对象，该新对象的原型对象指向arrayProto
var arrayMethods = Object.create(arrayProto);
var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];
methodsToPatch.forEach(function (method) {
  var original = arrayProto[method];
  // 在arrayMethods定义push，pop等方法，重写数组方法
  def(arrayMethods, method, function mutator() {
    var args = [], len = arguments.length;
    while (len--) args[len] = arguments[len];
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted) }
    return result 
});
// 将数组数据的__ptoto__指向数组方法后的对象
function protoAugment(target, src) {
  target.__proto__ = src;
}
function Observer(value) {
  this.value = value;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    protoAugment(value, arrayMethods);
    // 监听数组数据
    this.observeArray(value);
  }
}
Observer.prototype.observeArray = function(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};
```

 
## 8. 生命周期beforeCreate与created
- beforeCreate之前没有初始化data与方法，无法调用
- created之后，已经created，可以调用data与methods
```js
callHook(vm, 'beforeCreate');
initInjections(vm); // resolve injections before data/props
// 初始化状态
initState(vm);
initProvide(vm); // resolve provide after data/props
callHook(vm, 'created')
function callHook(vm, hook) {
  // 获取生命周期函数，通过mergeOPtions后已经是数组
  var handlers = vm.$options[hook];
  var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        // 调用每个声明周期的函数
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
}
function invokeWithErrorHandling(handler, context, args, vm, info) {
  var res;
  try {
    // 调用
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}
```

## 9.模板挂载vm.$mount(vm.$options.el)
- 初始化完成后，在生命周期created之后开始对模板进行挂载
- 调用Vue原型对象上的$mount方法
- 挂载模板时优先使用选项里面的template模板，如果没有则使用获取的el作为模板
```js
callHook(vm, 'created');
vm.$mount(vm.$options.el)
Vue.prototype.$mount = function(el) {
  el = el && query(el);
  var options = this.$options;
  if (!options.render)   
    var template = options.template;
    // 模板挂载 如果有template就优先使用template
    if (template) {
      if (typeof template === 'string') {
        template = idToTemplate(template);
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        return this
      }
    } else if (el) {
      // 其次使用el，得到dom节点
      template = getOuterHTML(el)
    }  
}
```