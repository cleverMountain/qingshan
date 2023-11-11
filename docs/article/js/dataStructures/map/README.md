## 1.Map
1. 类似原生map的封装，与字典结构类似
- set：添加元素
- get：获取某个元素
- size: 集合的带线啊哦
- has：是否存在某个元素
- delete：删除某个元素
- clear：清空集合
- keys：获取集合元素的key值
- values：获取集合元素的ve=alue
- forEach：循环集合
- entries：迭代集合，可以使用for of
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
## 2.Set
1. 类似原生set的封装
- add：添加元素
- has：是否存某个集合
- delete：删除集合
- clear：清空集合
- forEach：循环机和
- entries：迭代集合
```js
class Set {
  constructor(initial) {
    let symbol = 'Symbol.iterator'
    this.set = initial || []
    
  }
  add(target) {
    if (!this.set.has(target)) {
      this.set.push(target)
    }
  }
  has(target) {
    return this.set.includes(target)
  }
  clear() {
    this.set = []
    return true
  }
  delete(target) {
    if (this.set.has(target)) {
      const index = this.set.indexOf(target)
      this.set.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  forEach(cb) {
    for (let i = 0; i < this.set.length; i++) {
      cb(this.set[i], i, this.set)
    }
  }
  keys() {
    return this.entries()
  }
  values() {
    return this.entries()
  }
  // 生成器
  entries() {
    let index = 0
    return {
      next: () => {
        if (index < this.set.length) {
          return {
            done: false,
            value: this.set[index++]
          }
        } else {
          return {
            done: true,
            value: undefined
          }
        }
      }
    }
  }
  // 可迭代属性
  [Symbol.iterator]() {
    return this.entries()
  }
}

let set = new Set([1, 2, 3])
const iterate = set.keys()
console.log(iterate.next())
// const iterate = set.entries()
// console.log(iterate.next())
// console.log(iterate.next())
// console.log(iterate.next())
// console.log(iterate.next())
for(let k of set) {
  console.log(k)
}
console.log(set)
```
