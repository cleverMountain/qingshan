1. 剖析vue2的数据劫持,vue2中对数组和对象的处理方法不同
2. 对象的劫持部分 
- 源码中的observer方法,返回一个Observer实例
```js
const obj = {
  a: 1,
  b: {
    c: 2
  }
}
function observe(data) {
  const ob = new Observer(data)
  return ob
}
observe(obj)
```
- Observer类，添加value属性 ，并调用wlak方法在对象上依次添加属性
```js
class Observer{
  constructor(value) {
    this.valeu = value
    // 对象生效
    if(typeof value === 'object' && valeu !== null) {
      this.walk(value)
    }
  }
  walk(obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }
}
```
- defineReactive定义响应式
- 且在该方法中通过递归监听实现对象的多级代理
```js
function defineReactive(obj, key) {
  // 对象自己的getter,调用时返回自己的值
  var property = Object.getOwnPropertyDescriptor(obj, key);
  var getter = property && property.get;
  var setter = property && property.set;
  let  val = obj[key];
  // 递归监听
  let childOb = new observer(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // 父子关系
      var value = getter ? getter.call(obj) : val;
      return value
    },
    set: function reactiveSetter(newVal) {}
  });
}
```
- 简单实现一个自己的defineReactive方法
```js
let obj = {
  a: 1,
  b: {
    c: 2
  }
}
function defineReactive(obj) {
  for (let key in obj) {
    const value = obj[key]
    if (typeof value == 'object' && value !== null) {
      // 重新定义了b,b的地址未改变了,obj中的b也跟着改变了
      defineReactive(value)
    } else {
      Object.defineProperty(obj, key, {
        get() {
          return value
        }
      })
    }
  }
}
defineReactive(obj)
```

3. 数组的劫持
- 数组的劫持通过重写数组的push、pop、shift、unshift、splice、sort、reverse的方法，当调用以上方法时触发重写的方法
```js
const arrayProto = Array.prototype;
// 创建一个新对象，该新对象的原型对象指向arrayProto
const arrayMethods = Object.create(arrayProto);
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];
methodsToPatch.forEach(function (method) 
  const original = arrayProto[method];
  console.log(method)
  Object.defineProperty(arrayMethods, method, {
    value: function () 
      const args = [], len = arguments.length;
      while (len--) args[len] = arguments[len];
      const result = original.apply(this, args);
      const ob = this.__ob__;
      let inserted = null;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      // console.log(inserted)
      return result
    }
  }
})
function bindProto(target, src) {
  target.__proto__ = src
}
bindProto(arr, arrayMethods)
arr.push(4)
```

4. vue2数据劫持的缺点
- 数组，只有调用push、pop、shift、unshift、splice、sort、reverse方法时才会触发notify去更新视图
- 通过下标修改数组时无法触发这些方法所以不会去更新视图
- 对象，当监听对象时使用Object.defineProperty的setter,当对象增加或删除某个属性时无法监听改变，此外数据的深度太深时递归劫持时，可能会导致调用堆栈溢出


5. vue2中当需要改变数组中的某个元素或者删除某个对象的属性时，通过$set与$delete
- 数组时，都是调用重写的splice方法进行删除
- 对象时，使用原始的delete，然后强制更新视图
```js
// $set
Vue.prototype.$set = function(target, key, val) {
  // 修改数组
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    // 调用重写的splice方法后notify通知更新视图
    target.splice(key, 1, val);
    return val
  }
  // 修改对象时，会触发setter函数，对象时可以自己修改的
  if (key in target && !(key in Object.prototype)) {  
    target[key] = val;
    return val
  }
}
// $delete
Vue.prototype.$delete = function(target, key) {
  // 数组时，也是调用splice方法
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return
  }
  // 对象时
  var ob = (target).__ob__;
  delete target[key];
  // 更新视图
  ob.dep.notify();
}
```