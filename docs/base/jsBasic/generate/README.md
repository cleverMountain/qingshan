## 生成器
1. 第一项是一个函数，称为生成器函数，执行后返回一个迭代器
2. 生成器具有一个next方法，执行时返回一个对象，key值为done和value标识是否可继续迭代
3. 生成器函数使用 function*语法编写
4. yield 关键字用于暂停和恢复生成器函数

```js
// 示例
function* makeRangeIterator(start = 0, end = Infinity, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}
var a = makeRangeIterator(1, 10, 2);
a.next(); // {value: 1, done: false}
```


- 简单实现一个自己的生成器函数
```js
/**
 * 1.生成器是一个函数
 * 2.返回一个迭代器，迭代器有一个next方法，
 * 3.执行next方法返回对象，value和done为key
 * 4.yield可以中断和继续生成器
*/

// 生成器
function myGenerate(fn, ...argue) {
  const iterator = []
  let index = 0
  // 2.遇见一次yield则收集一次结果
  iterator.iteYield = function (argue) {
    iterator.push({
      value: argue,
      index: ++index
    })
  }
  // 1.执行传入的函数
  fn.call(iterator, ...argue)
  // 绑定next函数
  iterator.next = function () {
    // 迭代完毕
    if (iterator.length <= 0) {
      return {
        value: undefined,
        done: true
      }
    } else {
      // 可继续迭代，每迭代一次，数组长度减1
      let obj = {
        value: iterator[0].value,
        done: false
      }
      iterator.shift()
      return obj
    }
  }
  // 返回迭代器
  return iterator
}

function makeIterator(start = 0, end = Infinity, step = 1) {
  for (let i = start; i < end; i += step) {
    this.iteYield(i)
  }
}
const ite = myGenerate(makeIterator, 1, 10 ,3)
console.log(ite.next()) // {value: 1, done: false}
console.log(ite.next()) // {value: 4, done: false}
console.log(ite.next()) // {value: 7, done: false}
console.log(ite.next()) // {value: undefined, done: true}
```



## 迭代器
1. 迭代器是一个对象
2. 实现了迭代器协议(Iterator Protocol)，该协议要求迭代器对象包含next方法，执行后返回index和done的对象
3. 模拟数组的迭代器
```js
const arr = [1, 2]
function generate(arr) {
  const len = arr.length
  let index = 0
  this.next = function () {
    // next方法返回一个对象
    return {
      done: index < len ? false : true,
      value: arr[index++]
    }
  }
  // 返回一个对象，对象身上有一个next方法
  return this
}

let arrIte = generate(arr)
console.log(arrIte.next()) // {value: 1, done: false}
console.log(arrIte.next()) // {value: 2, done: false}
console.log(arrIte.next()) // {value: undefined, done: true}
```
4. 模拟对象的迭代器
```js
const obj = {
  a: 1,
  b: 2,
}
function generate (obj) {
  const keys = Object.keys(obj)
  const len = keys.length
  let index = 0
  this.next = function () {
    const key = keys[index++]
    return {
      key,
      value: obj[key],
      done: index < len ? false :  true
    }
  }
  return this
}
console.log(objIte.next()) // {key: a, value: 1, done: false}
console.log(objIte.next()) // {key: b, value: 2, done: false}
console.log(objIte.next()) // {key: undefined, value: undefined, done: true}
```

## 可迭代对象
1. 可迭代对象具备Symbol.iterator属性
2. 可使用for of进行迭代
3. 自定义可迭代对象 
```js
// 具有Symbol.iterator属性
// Symbol.iterator属性是一个生成器函数，该函数返回next方法
const iterableObject = {
  [Symbol.iterator]: function () {
    const obj = this
    const res = Object.keys(obj)
    const length = res.length
    let index = 0
    return {
      next: function () {
        if (index < length) {
          return {
            value: {
              key: res[index],
              value: obj[res[index++]]
            },
            dnoe: false
          }
        } else {
          return {
            done: true
          }
        }
      }
    };
  },
  a: 1,
  b: 2
};
for (let k of iterableObject) {
  // {key: a, value: 1}
  // {key: b, value: 2}
  console.log(k)
}
```
5. for of原理，通过可迭代对象执行for of时可以知道，for of会一直执行该迭代对象的next方法，知道该方法返回的done会true时则停止
6. 实现for of
```js
const arr = [1, 2, 3]
function forOf(iteObj) {
  // 调用迭代对象方法返回迭代器
  const iterator = iteObj[Symbol.iterator]()
  // 执行next方法
  let res = iterator.next()
  // 直到返回done为true时停止
  while(!res.done) {
    // 执行回调函数
    cb(res.value)
    res = iterator.next()
  }
}
// 执行forOf并传入回调函数 
forOf(arr, (...argue) => {
  console.log(...argue)
})
```