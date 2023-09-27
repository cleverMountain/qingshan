
## call
```js
// 改变this，立即执行，返回执行结果,传入参数为普通参数
Function.prototype.call = function(obj, ...argues) {
  // this调用者的方法
  obj.fn = this
  // this指向: 谁调用指向谁
  let res = obj.fn(...argues)
  delete obj.fn
  return res
}
```
## apply
```js
// 改变this，立即执行，返回执行结果,传入参数为数组
Function.prototype.apply = function(obj, argues) {
  obj.fn = this
  let res = obj.fn(...argues)
  delete obj.fn
  return res
}
```
## bind
```js
// 改变this，不立即执行，返回一个函数,传入参数为普通函数
Function.prototype.bind = function(obj, ...argues) {
  obj.fn = this
  return function() {
    let res = obj.fn(...argues)
    delete obj.fn
    return res
  }
}
```
## new
1. 执行new时的四个不步骤
2. 创建一个新的空对象
3. 设置空对象的原型链，并将新对象的__proto__指向构造函数的原型对象
4. 将构造函数的this指向绑定到this上
5. 如果第三步返回的结果是一个对象则返回这个对象，否则返回新创建的对象
```js
function myNew(...argue) {
  const obj = {}
  const newConstructor = argue[0]
  obj.__proto__ = newConstructor.prototype
  let res = newConstructor.call(obj, argue.slice(1))
  return typeof res === 'object' ? res : obj
}
``` 
