
## 函数部分
1. _.before(n, func)
- 创建一个调用func的函数，通过this绑定和创建函数的参数调用func，调用次数不超过 n 次。 之后再调用这个函数，将返回一次最后调用func的结果。
```js
function before(n, func) {
  var result;
  // 必须是函数
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  // 次数
  n = toInteger(n);
  // 闭包，返回一个新函数，利用保存的次数n，每调用一次n就--,
  // 当n > 0时调用传入的方法，并返回值，当n < 0时不调用直接返回undefined
  return function() {
    if (--n > 0) {
      result = func.apply(this, arguments);
    }
    if (n <= 1) {
      func = undefined;
    }
    return result;
  };
}
```

2. _.after(n, func)
```js
function after(n, func) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  n = toInteger(n);
  return function() {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
}
```

3. _.ary(func, [n=func.length])
- func.length是参数的长度
- 创建一个调用func的函数。调用func时最多接受 n个参数，忽略多出的参数。
```js
function ary(func, n, guard) {
  n = guard ? undefined : n;
  n = (func && n == null) ? func.length : n;
  return createWrap();
}
function createWrap () {
  result createHybrid.apply(undefined, newData)
  return setWrapToString(setter(result, newData), func, bitmask);
}
function createHybrid() {
  function wrapper() {

  }
  return wrapper
}
// 最后返回的是wrapper
function wrapper() {
  // 获取参数长度
  var length = arguments.length,
      args = Array(length), // 空数组
      index = length
  // args = JSON.parse(JSON.strgify(arguments))
  while (index--) {
    args[index] = arguments[index];
  }
  return fn.apply(thisBinding, args);
}

// 自己简单实现
// 创建一个函数，最多接受两个参数
function ary(func, n) {
  return function() {
   let length = arguments.length
       args = []     
   while(n--) {
    args[index] = arguments[index]
   }
   return func.apply(this, args)
  }
}
```

4. _.bindKey(object, key, [partials])
- 创建一个函数,在object[key]上通过接收partials附加参数，调用这个方法。
```js
// 与ary类似
// 简单实现
function bindKey() {
  let obj = arguments[0],
      key = arguments[1],
      length = arguments.length,
      args = []
  while (length > 2) {
    args[length - 3] = arguments[length - 1]
    length--
  }
  return function () {
    let len = arguments.length
    while(len <= 1) {
      args[len] = arguments[len - 1]
      len++
    }
    return obj[key].apply(obj, args)
  }
}
```


5. _.curry(func, [arity=func.length])
- 柯里化
```js
// 与_ary类似也是通过createWrap函数创建一个链条
function curry(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, WRAP_CURRY_FLAG, arity);
  result.placeholder = curry.placeholder;
  return result;
}
// 返回wrapper时
function wrapper() {
  // 获取到的参数长度小于需要的长度时返回createRecurry继续获取函数
  if (length < arity) {
    return createRecurry();
  }
  // 参数收集完毕，执行
  var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
  return apply(fn, this, args);
}
// 简单实现自己的柯里化函数
function curry(func) {
  let length = func.length,
    args = [],
    cur = function () {
      args.push(...arguments)
      if (args.length != length) {
        // 继续返回cur收集参数
        return cur
      } else {
        func.apply(this, args)
      }
    }
  return cur
}
```

6. _.memoize(func, [resolver])
- 函数记忆，保存函数的返回值，当遇到同一个缓存值时不再运行函数返回缓存的值
```js
function memoize(func, resolver) {
  var memoized = function() {
    var args = arguments,
        // key
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  // 保存值
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}
// 简单实现
function memoize(func) {
  const cache = new Map()
  return function () {
    const key = JSON.stringify(arguments[0])
    if (cache.get(key)) {
      return cache.get(key)
    }
    let res = func.apply(null, arguments)
    cache.set(key, res)
    return res
  }
}
```


7. _.once(func)
- 创建一个只能调用 func 一次的函数。 重复调用返回第一次调用的结果
```js
// 底层使用before实现的，当次数为2时
function once(func) {
  return before(2, func);
}
// 简单实现
function before(func, n) {
  let res
  return function () {
    if (n > 0) {
      res = func.apply(this)
      n--
    } else {
      func = undefined
    }
    return res
  }
}
```

8. _.debounce(func, [wait=0], [options=])
- 防抖
```js
// 简单实现
function debounce(func, wait, options) {
  let timer
  wait = wait || 1000
  let { leading } = options
  return function () {
    let that = this
    if (leading == true) {
      // 立即执行
      func.apply(that, arguments)
      leading = false
    } else {
      // 防抖
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        func.apply(that, arguments)
      }, wait)
    }
  }
}
```

9. _.throttle(func, [wait=0], [options=])
- 节流
```js
// 简单节流
function throttle(func, wait) {
  let pre = new Date().getTime()
  return function () {
    let that = this
    let now = new Date().getTime()
    if (now - pre > wait) {
      func.apply(that, arguments)
      pre = now
    } 
  }
}
```