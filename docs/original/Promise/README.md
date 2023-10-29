## PromiseA+规范
1. promise是一个对象，包含三个状态pending，fulfilled，rejected ，但同时只能为一个状态
2. pending 状态时，可能会转变为 fulfilled 或 rejected 状态
3. fulfilled 状态时，不能再状态为任何其他状态， 必须有一个 value，且不可改变
4. rejected 状态时, 不能再状态为任何其他状态，必须有一个 reason，且不可改变
5. 一个 promise 必须提供一个 then 方法，用来获取当前或最终的 value 或 reason，并接受两个参数

## 实现自己的Promise

- 1.最基本的Promise实现
```js
class Promise {
  constructor(fn) {
    // 处理resolve
    const resolve = (value) => {
      if (this.status === 'pending') { }
      this.value = value
      this.status = 'fulfilled'
    }
    // 处理reject
    const reject = (error) => {
      this.error = error
      this.status = 'rejected'
    }
    // 初始状态
    this.status = 'pending'
    this.value = ''
    this.error = ''
    try {
      fn(resolve, reject)
    } catch (err) {
      console.log(err)
    }
  }
  // then方法
  then(cb) {
    if (this.status === 'fulfilled') {
      cb(this.value)
    }
    if (this.status === 'rejected') {
      cb(this.error)
    }
  }
}
```
- 2.当new Promise过程时出现异步时，需要先收集执行的回调当获取结果是resolve或reject再触发回调
```js

class Promise {
  constructor(fn) {
    // 处理resolve
    const resolve = (value) => {
      // 延迟执行
      if (this.status === 'pending') {
        this.value = value
        this.status = 'fulfilled'
        // 执行成功的回调
        this.successCbs.forEach(cb => cb(value))
      }
    }
    // 处理reject
    const reject = (error) => {
      if (this.status === 'pending') {
        this.error = error
        this.status = 'rejected'
        // 执行失败的回调
        this.failCbs.forEach(cb => cb(error))
      }
    }
    // 初始状态
    this.status = 'pending'
    this.successCbs = []
    this.failCbs = []
    this.value = ''
    this.error = ''
    try {
      fn(resolve, reject)
    } catch (err) {
      console.log(err)
    }
  }
  // then方法
  then(resolve, reject) {
    // 成功
    if (this.status === 'fulfilled') {
      resolve(this.value)
    }
    // 失败
    if (this.status === 'rejected') {
      reject(this.error)
    }
    // 收集回调函数
    if (this.status === 'pending') {
      this.successCbs.push(resolve)
      this.failCbs.push(reject)
    }
  } 
}
```
- 3.then方法返回新的Promise,分为三种情况，状态为fulfilled，为rejected为pending
```js
then(onFulfilled, onRejected) {
  const promise2 = new Promise((resolve, reject) => {
    if (this.status === 'fulfilled') {
      setTimeout(() => {
        let res = onFulfilled(this.value) // 第一次执行成功后then的结果
        resolvePromise(promise2, res, resolve, reject)})
      
    } else if (this.status === 'rejected') {
      setTimeout(() => {
        let err = onRejected(this.error) // 第一次执行失败后then的结果
        resolvePromise(promise2, err, resolve, reject)
      })
    } else {
      this.successCbs.push(() => {
        setTimeout(() => {
          let res = onFulfilled(this.value) // 第一次执行成功后then的结果
          resolvePromise(promise2, res, resolve, reject)
        })
      })
      this.failCbs.push(() => {
        setTimeout(() => {
          let err = onRejected(this.error) // 第一次执行失败后then的结果
          resolvePromise(promise2, err, resolve, reject)
        })
      })
    }
  })
  return promise2
}
```
- 4.处理resolvePromise函数,需要分三种情况处理，返回promise 返回普通值 返回对象且该对象中有一个then方法
```js
function resolvePromise(promise2, res, resolve, reject) {
  /**
   * then(res => {
   *        return 1 || obj || Promise
   *      }
   * res 可能是undefined  或者是任意 或者promise
  */
  let called = false;
  if (promise2 !== res) {
    if (res instanceof Promise) {
      // 返回一个新的promise
      // p.then(res => new Promise(resolve => resolve(1)))
      res.then(ret => {
        resolvePromise(promise2, ret, resolve, reject)
      }, err => {
        reject(err)
      })
    } else if (res !== null && (typeof res === 'object' || typeof res === 'function')) {
      const then = res.then;
      if (typeof then === 'function') { 
        // 返回对象，有then方法
        // p.then(res => {then (resolve, reject) {resole(y)}})
        // 使用 res 作为上下文调用 then 方法，传入了两个参数 成功回调，失败回调
        // 执行then函数
        /*  p.then(res => {
             return {
                then: function (resolve, reject) {
                  resolve('来了') || reject('err')
              }
            }
          })
       */
        then.call(
          res,
          y => { // 成功回调
            if (called) return; // 如果已经调用过，直接返回
            called = true;
            // 递归处理 y
            resolvePromise(promise2, y, resolve, reject);
          },
          reason => { // 失败回调
            if (called) return; // 如果已经调用过，直接返回
            called = true;
            reject(reason);
          }
        );
      } else { // 如果 then 不是函数
        // 返回对象，且该对象没有then方法
        // p.then(res => {a: 1})
        resolve(res);
      }
    } else {
      // 返回普通值
      // p.then(res => 1)
      resolve(res)
    }
  }
}
```

## Promise周边及实现
### Promise.catch
1. 捕获错误，reject方法
```js
catch(reject) {
  return this.then(resolve, reject)
}
```
### Promise.resolve
1. 返回一个成功的promise
```js
static resolve(value) {
  return new Promise(resolve => {
    resolve(value)
  })
}
```
### Promise.reject
1. 返回一个失败的promise
```js
static reject(error) {
  return new Promise((resolve, reject) => {
    reject(error)
  })
}
```
### Promise.all
1. 返回所有成功的promise
2. 结果与传入的顺序对应，不根据promise返回的顺序
```js
static all(argue) {
  return new Promise((resolve, reject) => {
    const res = []
    let resLength = 0 // 结果长度
    for (let i = 0; i < argue.length; i++) {
      const item = argue[i]
      if (item instanceof Promise) {
        // promise
        item.then(ret => {
          // 保证peomise的顺序及每个promise拿到结果后再返回
          res[i] = ret
          resLength++ 
          // 相等时才返回
          if (resLength === argue.length) {
            resolve(res)
          }
        })
      } else {
        // 普通值
        res.push(item)
        resLength++
        if (resLength === argue.length) {
          resolve(res)
        }
      }
    }
  })
}
```
### Promise.any
1. 返回最开的成功的promise
2. 普通值也视为成功的promise
```js
static any(argue) {
  // 判断有没有promise
  return new Promise(resolve => {
    for (let i = 0; i < argue.length; i++) {
      const item = argue[i]
      if (item instanceof Promise) {
    
        item.then(res => {
          resolve(res)
        }, err => {
          // inject停止
          return
        })
      } else {
        resolve(argue[i])
      }
    }
  })
}
```
### Promise.race
1. 只能接受成功的promise
2. 返回最快的promise
```js
static race(argue) {
  // 判断有没有promise
  return new Promise(resolve => {
    for (let i = 0; i < argue.length; i++) {
      const item = argue[i]
      if (item instanceof Promise) {
        item.then(res => {
          resolve(res)
        })
      } else {
        resolve(argue[i])
      }
    }
  })
}
```
### Promise.allSettled
1. 获取传入promise的状态及结果
```js
static allSettled(argue) {
  return new Promise((resolve, reject) => {
    const res = []
    let resLength = 0 // 结果长度
    for (let i = 0; i < argue.length; i++) {
      const item = argue[i]
      if (item instanceof Promise) {
        // promise
        item.then(ret => {
          // 保证peomise的顺序及每个promise拿到结果后再返回
          res[i] = {
            status: "fulfilled",
            value: ret,
          }
          resLength++
          // 相等时才返回
          if (resLength === argue.length) {
            resolve(res)
          }
        }, err => {
          res[i] = {
            status: "rejected",
            value: err,
          }
          resLength++
          // 相等时才返回
          if (resLength === argue.length) {
            resolve(res)
          }
        })
      } else {
        // 普通值
        res.push({
          status: "fulfilled",
          value: argue[i],
        })
        resLength++
        if (resLength === argue.length) {
          resolve(res)
        }
      }
    }
  })
}
```
## async与await
1. async/await是一种语法糖
2. async函数会返回一个promise对象
3. await等待结果执行  
```js
async function getResult() {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    });
  })
  await new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(2);
    });
  })
  await new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(3);
    });
  })
}

getResult() //  分别输出1,2,3
```
3. 通过上面的运行来看await似乎生成器函数有某种关系
```js
function* generate() {
  yield new Promise(resolve => {
    setTimeout(() => {
      resolve(1)
    })
  })
  yield new Promise(resolve => {
    setTimeout(() => {
      resolve(2)
    })
  })
  yield new Promise(resolve => {
    setTimeout(() => {
      resolve(3)
    })
  })
}
const ite = generate()
console.log(ite.next().value.then(res => console.log(res))) // 1
console.log(ite.next().value.then(res => console.log(res))) // 2
console.log(ite.next().value.then(res => console.log(res))) // 3
```
4.如果有几个yield就要执行几次next，通过递归实现
```js
function* generate() {
  yield new Promise(resolve => {
    setTimeout(() => {
      resolve(1)
    })
  })
  yield new Promise(resolve => {
    setTimeout(() => {
      resolve(2)
    })
  })
  yield new Promise(resolve => {
    setTimeout(() => {
      resolve(3)
    })
  })
}
const ite = generate()
// co函数
const co = (iterator, data = []) => {
  const obj = iterator.next()
  if (obj.done) {
    return
  } else {
    obj.value.then(res => {
      data.push(res)
      return co(iterator, data)
    })
  }
}
co(ite)
```