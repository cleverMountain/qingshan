# 重写数组方法
## forEach__filter___find___some___map___every__reduce
### forEach
```js
Array.prototype.forEach = function(cb, obj) {
  const _this = this
  for(let i = 0; i < _this.length; i++) {
    cb.call(obj, _this[i], i, _this)
  }
}
```
### filter
```js
Array.prototype.filter = function(cb, obj) {
  const _this = this
  let res = []
  for (let i = 0; i < _this.length; i++) {
    if (cb.call(obj, _this[i], i, _this)) {
      res.push(_this[i])
    }
  }
  // 返回一个满足条件的新数组
  return res
}
```
### find
```js
Array.prototype.find = function(cb, obj) {
  const _this = this
  for (let i = 0; i < _this.length; i++) {
    // 满足条件则返回
    if (cb.call(obj, _this[i], i, _this)) {
      return _this[i]
    }
  }
}
```
### map
```js
Array.prototype.map = function(cb, obj) {
  const _this = this
  let res = []
  for (let i = 0; i < _this.length; i++) {
    res.push(cb.call(obj, _this[i], i, _this))
  }
  // 返回新数组
  return res
}
```
### some
```js
Array.prototype.some = function(cb, obj) {
  const _this = this
  let res = false
  for (let i = 0; i < _this.length; i++) {
    if (cb.call(obj, _this[i], i, _this)) {
      return true
    } else {
      res = false
    }
  }
  return res
}
```
### every
```js
Array.prototype.every = function(cb, obj) {
  const _this = this
  let res = true
  for (let i = 0; i < _this.length; i++) {
    if (cb.call(obj, _this[i], i, _this)) {
      res = true
    } else {
      return false
    }
  }
  return res
}
```
### reduce
```js
Array.prototype.reduce = function(cb, initialValue) {
  const _this = this
  for(let i = 0; i < _this.length; i++) {
    initialValue = cb(initialValue, _this[i], i, _this)
  }
  // 返回initialValue
  return initialValue
}
```
## push__pop___shift__unshift
### push
```js
// 改变原数组，返回长度
Array.prototype.push = function(item) {
  this[this.length] = item
  return this.length
}
```
### pop
```js
// 删除最后一个元素并返回删除的元素
Array.prototype.pop = function() {
  let res = this[this.length - 1]
  this.length--
  return res
}
```
### shift
```js
// 删除第一个元素并返回删除的元素
Array.prototype.shift = function() {
  let res = this[0]
  for (let i = 0; i < this.length; i++) {
    this[i] = this[i + 1]
  }
  this.length--
  return res
}
```
### unshift
```js
// 在开始处添加元素并返回长度
Array.prototype.unshift = function(item) {
  for (let i = this.length; i >= 0; i--) {
   if (i === 0) {
    this[i] = item
   } else {
    this[i] = this[i- 1]
   }
  }
  return this.length
}
```

## 其他方法
### join
```js
// 分割数组，返回字符串长度
Array.prototype.join = function (separator) {
  separator = separator || ''
  let res = ''
  for (let i = 0; i < this.length; i++) {
    res += this[i] + separator
  }
  return res.slice(0, res.length)
}
```
### split
```js
// 将字符串组合成数组，并返回数组
Array.prototype.split = function (separator) {
  // separator = separator || ','
  // let arr = ''
  // for (let i = 0; i < this.length; i++) {
  //   if (i < this.length - 1) {
  //     str += this[i] + separator
  //   } else {
  //     str += this[i]
  //   }
  // }
  // return str
  if (separator) {
    return [this]
  } else {
    // let index = 0
    let index = this.
  }
}

```
