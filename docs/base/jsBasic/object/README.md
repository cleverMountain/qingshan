## Object.create
1. 对象上的静态方法
2. 创建一个对象，对象的__proto__指向传入的第一个参数
3. 对象的属性为传入的第二个参数
4. 返回这个对象
```js
Object.create = function (proto, propertiesObject) {
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

## Object.keys__Object.values
1. 对象上的静态方法
2. 获取对象的key或value并以数组的形式返回
```js
Object.keys = function (obj) {
  const res = []
  for(let key in obj) {
    res.push(key)
  }
  return res
}
Object.value = function (obj) {
  const res = []
  for(let key in obj) {
    res.push(obj[key])
  }
  return res
}
```

## Object.assign
1. Object.assign() 方法将所有可枚举（Object.propertyIsEnumerable() 返回 true）的自有（Object.hasOwnProperty() 返回 true）属性
2. 从一个或多个源对象复制到目标对象，返回修改后的对象。
3. 原型上以及原型链上的属性不赋值
4. 不适合拷贝属性的getters和setters，如果要考虑赋值可以使用Object.getOwnPropertyDescriptor() 和 Object.defineProperty()
5. 浅拷贝
```js
Object.assign = function() {
  let obj = {}
  Arra.prototype.forEach(item => {
    for (let k in item) {
      // 有自己的属性并且可以被遍历
      if (item.hasOwnProperty(k) && item.propertyIsEnumerable(k)) {
        obj[k] = item[k]
      }
    }
  })
  return obj
}
```

## Object.defineProperties
1. 在对象身上定义属性
2. obj传入的对象， props描述器
3. 主要是调用Object.defineProperty完成
```js
Object.defineProperties = function(obj, props) {
  for (let k in props) {
    if (props.hasOwnProperty(k)) {
      Object.defineProperty(obj, k, props[k])
    }
  }
}
```