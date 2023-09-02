## 重写Object方法
### Object.create
```js
// 静态方法，创建一个对象，其__ptoto__是传入的对象
Object.prototype.myCreate = function (proto, propertiesObject) {
  let obj = {}
  obj.__proto__ = proto
  if (propertiesObject) {
    for (let key in propertiesObject) {
      if (propertiesObject.hasOwnProperty(key)) {
        Object.defineProperty(obj, key, propertiesObject[key])
      }
    }
  }
  return obj
}
// 关于静态方法定义
class Test {
  static test() {

  }
}
Test.test()
function Test1() {

}
Test.test1 = function() {

}
Test.test1()
```
### create
```js
// 创建一个对象，其__ptoto__是传入的对象
Object.prototype.myCreate = function (proto, propertiesObject) {
  let obj = {}
  obj.__proto__ = proto
  if (propertiesObject) {
    for (let key in propertiesObject) {
      if (propertiesObject.hasOwnProperty(key)) {
        Object.defineProperty(obj, key, propertiesObject[key])
      }
    }
  }
  return obj
}
```
