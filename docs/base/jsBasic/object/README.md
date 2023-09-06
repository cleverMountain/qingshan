## Object.create
```js
Object.prototype.create = function (proto, propertiesObject) {
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