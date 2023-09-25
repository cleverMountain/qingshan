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
  let res = []
  let index = 0
  // 2.遇见一次yield则收集一次结果
  res.myYield = function (argue) {
    res.push({
      value: argue,
      index: ++index
    })
  }
  // 1.执行传入的函数
  fn.call(res, ...argue)
  // 绑定next函数
  res.next = function () {
    // 迭代完毕
    if (res.length <= 0) {
      return {
        value: undefined,
        done: true
      }
    } else {
      // 可继续迭代，每迭代一次，数组长度减1
      let obj = {
        value: res[0].value,
        done: false
      }
      res.shift()
      return obj
    }
  }
  // 返回迭代器
  return res
}

function makeIterator(start = 0, end = Infinity, step = 1) {
  for (let i = start; i < end; i += step) {
    this.myYield(i)
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
2. 包含next方法，执行后返回index和done
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

### 可迭代对象
1. 可迭代对象具备Symbol.iterator属性
2. 可使用for of进行迭代
3. 自定义可迭代对象 
```js
// 具有Symbol.iterator属性，该属性
const iterableObject = {
  [Symbol.iterator]: function() {
    let count = 1;
    return {
      next: function() {
        if (count <= 3) {
          return { value: count++, done: false };
        } else {
          return { done: true };
        }
      }
    };
  }，
  a: 1,
  b: 2
};
for (let k of iterableObject) {

}
```