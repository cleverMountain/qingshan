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
