## 整体结构

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
