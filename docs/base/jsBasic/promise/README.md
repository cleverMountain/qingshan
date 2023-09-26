## PromiseA+规范


## 实现Promise
1. promise是一个对象，包含三个状态pending，fulfilled，rejected ，但同时只能为一个状态
2. pending 状态时，可能会转变为 fulfilled 或 rejected 状态
3. fulfilled 状态时，不能再状态为任何其他状态， 必须有一个 value，且不可改变
4. rejected 状态时, 不能再状态为任何其他状态，必须有一个 reason，且不可改变
5. 一个 promise 必须提供一个 then 方法，用来获取当前或最终的 value 或 reason，并接受两个参数
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
- 3.简单返回一个新的Promise
```js
then(resolve, reject) {
  if (this.status === 'fulfilled') {
    let res = resolve(this.value)
    return new Promise((resolve1, reject1) => {
      resolve1(res)
    })
  }
  if (this.status === 'rejected') {
    let res = reject(this.value)
    return new Promise((resolve1, reject1) => {
      reject1(res)
    })
  }
  // 收集函数
  if (this.status === 'pending') {
    debugger
    this.successCbs.push(resolve)
    this.failCbs.push(reject)
  }
}
```
