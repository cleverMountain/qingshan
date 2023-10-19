# lodash整体架构

1. 匿名函数自执行
```js
;(function() {

}.call(this))
``` 

2. 暴露lodash
```js
var runInContext = function runInContext(content) {
  // 自身是一个函数
  function lodash() {
    
  }
  // 在lodash上绑定属性
  lodash.after = after
  ...
  return lodash
}
// 得到lodash
var _ = runInContext();
if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
  // amd(异步加载模块)，通过defin定义
  root._ = _;
  define(function() {
    return _;
  });
}
else if (freeModule) {
  // cjs,module.exports
  (freeModule.exports = _)._ = _;
  freeExports._ = _;
}
else {
  // 浏览器的es6环境，root为window
  root._ = _;
}
```

3. runInContext方法
- 3.1定义lodash,返回LodashWrapper实例
```js
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value; // 传入的值
  this.__actions__ = []; // 
  this.__chain__ = !!chainAll; // false 不支持链式调用 
  this.__index__ = 0;
  this.__values__ = undefined;
}
function runInContext(content) {
    function lodash(value) {

      return new LodashWrapper(value);
    }
  // 在lodash上绑定属性
  lodash.after = after
  ...
  return lodash
}
```
- 3.2 绑定LodashWrapper原型
```js
// 空函数
function baseLodash() {}
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;
// 重新定义LodashWrapper原型对象
LodashWrapper.prototype = baseCreate(baseLodash.prototype);
// 在原型对象上在添加constructor，该构造函数又重新指回LodashWrapper
LodashWrapper.prototype.constructor = LodashWrapper;
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      // Object.create
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());
```

4. mixin函数
- 4.1  mixin(lodash, lodash),在lodash原型上添加lodash属性
```js
mixin(lodash, lodash)
function mixin(object, source, options) {
  // 所有方法的key及名字
  var props = keys(source),
      methodNames = baseFunctions(source, props);
  // 是否可链式调用
  var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
      isFunc = isFunction(object);
  arrayEach(methodNames, function(methodName) {
    var func = source[methodName];
    object[methodName] = func;
    if (isFunc) {
      // 在原型上定义属性
      object.prototype[methodName] = function() {
        var chainAll = this.__chain__;
        if (chain || chainAll) {
          var result = object(this.__wrapped__),
              actions = result.__actions__ = copyArray(this.__actions__);
          actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
          result.__chain__ = chainAll;
          return result;
        }
        return func.apply(object, arrayPush([this.value()], arguments));
      };
    }
  });
  return object;
}
```

# 函数部分
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