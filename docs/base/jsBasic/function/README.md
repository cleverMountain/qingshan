## bind___call___apply
### call
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
### apply
```js
// 改变this，立即执行，返回执行结果,传入参数为数组
Function.prototype.apply = function(obj, argues) {
  obj.fn = this
  let res = obj.fn(...argues)
  delete obj.fn
  return res
}
```
### bind
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
