## reactive
1. 返回一个对象的响应式代理
```js
// 代理时的拦截处理函数
const mutableHandlers = {
  get: get$1,
  set: set$1,
  deleteProperty,
  has: has$1,
  ownKeys
};
// 代理时的拦截处理函数
const mutableCollectionHandlers = {
  get:  createInstrumentationGetter(false, false)
};
function reactive(target) {
  return createReactiveObject(
    target,
    false,
    mutableHandlers, // 数组和对象的handler get set deleteProperty has ownKeys
    mutableCollectionHandlers, // 集合的handler get
    reactiveMap
  );
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0  : targetTypeMap(toRawType(value));
}
// 1 对象 2 集合 0 基本类型
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1 ;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2 ;
    default:
      return 0 ;
  }
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  // 如果已经代理过了，直接返回代理后的对象
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  // 判断target类型，0 | 1 | 2，通过不同类型
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2  ? collectionHandlers : baseHandlers
  );
  // 收集代理，用于判断是否已经代理过
  proxyMap.set(target, proxy);
  // 返回代理
  return proxy;
}
```

## ref
1. ref是一个函数，传入一个值返回一个响应式的对象
2. 当传入的参数是一个对象时，ref还是会经过reactive方法进行代理
```js
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  // 已经是响应式对象则返回该响应式对象
  if (isRef(rawValue)) {
    return rawValue;
  }
  // 响应式对象
  let res = new RefImpl(rawValue, shallow);
  return res
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value); 
    // 使用_value代理value
    // 如果是对象是则会通过reactive进行代理，基本类型时直接返回value
    this._value = __v_isShallow ? value : toReactive(value);
  }
  // .value时调用get返回_vakue
  get value() {
    trackRefValue(this);
    return this._value;
  }
  // .value = ?时
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, newVal);
    }
  }
}
```
