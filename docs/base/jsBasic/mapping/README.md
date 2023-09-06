## Map
```js
function Map(initial) {
  this.map = {}
  if (initial) {
    for (let i = 0; i < initial.length; i++) {
      const [key, value] = initial[i]
      this.map[key] = value
    }
  }
}
Map.prototype.set = function (key, value) {
  this.map[key] = value
}
Map.prototype.get = function (key) {
  return this.map[key]
}
Map.prototype.size = function () {
  return Object.keys(this.map).length
}
Map.prototype.has = function (key) {
  return this.map[key] ? true : false
}
Map.prototype.delete = function (key) {
  if (Object.keys(this.map).includes(key)) {
    delete this.map.key
  } else {
    return '属性不存在'
  }
}
Map.prototype.clear = function () {
  this.map = {}
  return true
}
Map.prototype.keys = function () {
  return Object.keys(this.map)
}
Map.prototype.values = function () {
  return Object.values(this.map)
}
Map.prototype.forEach = function (cb) {
  const keys = this.keys()
  const values = this.values()
  for (let i = 0; i < keys.length; i++) {
    cb(keys[i], values[i], this.map)
  }
}
/**
 * 1.可迭代对象的标识，定义在原型对向上或自身
 * 2.使用for of循环时自动调用该方法，并且返回一个next方法
 * 3.该方法是一个迭代器，返回next方法
 */
Map.prototype[Symbol.iterator] = function () {
  let index = 0;
  const keys = Object.keys(this.map),
    values = Object.values(this.map)
  return {
    next() {
      if (index < keys.length) {
        return {
          done: false,
          value: {
            key: keys[index],
            value: values[index++]
          }
        };
      } else {
        return { done: true, value: undefined };
      }
    }
  }
}
// 返回一个迭代器，调用next方法
Map.prototype.entries = Map.prototype[Symbol.iterator]


let map = new Map() 
map.set('a', 1) 
console.log(map) // Map: {a: 1}
for (let { key, value } of map) {
  console.log(key, value) // {a: 1}
}
let iterate = map.entries()
console.log(iterate) // {next: fn()}
console.log(iterate.next()) // {done: false, value: {key: a, value: 1}}
console.log(iterate.next()) // {done: true, value: undefined}

map.forEach((key, value, ori) => {
  console.log(key, value, ori) // a 1 {a: 1}
})

```
