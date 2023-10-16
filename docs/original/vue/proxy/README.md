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

## toRef(toRefs)
1. 将传入的值转化成ref，分4种情况
- 传入的ref，返回ref
- 传入的函数
- 仅仅传入的是对象
- 传入的是对象，对象的key及默认值
2. 通过isRef判断，当前对象是否存在__v_isRef属性
3. toRefs将对象的每个属性toref后再覆盖原属性
```js
function toRef(source, key, defaultValue) {
  // 是ref直接返回
  if (isRef(source)) {
    return source;
  } else if (isFunction(source)) {
    return new GetterRefImpl(source);
  } else if (isObject(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    // 不是再通过ref包装一下
    return ref(source);
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
// 传入的是函数
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this.__v_isRef = true; // ref标志
    this.__v_isReadonly = true;
  }
  get value() {
    // .value是调用该方法，结果：value || undefined
    return this._getter();
  }
}
// 传入的是对象，对象的key及默认值
const obj = {}
toRef(obj, 'a', 1)
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  // 非ref返回ObjectRefImpl
  return isRef(val) ? val : new ObjectRefImpl(
    source,
    key,
    defaultValue
  );
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  // .value返回传入的默认值
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
// toRefs
function toRefs(object) {
  const ret = isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
```

## createApp
1. 创建一个初步的app
-  创建app的过程： 1.ensureRenderer()
                  2.createRenderer()
                  3.baseCreateRenderer()
                  4.createApp()
                  5.createAppApi()
- createAppApi过程
2. 创建app的准备
```js
function ensureRenderer() {
  renderer = renderer || createRenderer(rendererOptions)
  return renderer
}
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
const createApp = (...args) => {
  /**
   * 返回的app
   * {
   *   render,
   *   hydrate,
   *   createApp: createAppApi
   * }
   */
  const app = ensureRenderer()
  // 调用app.createApp其实是调用createAppApi
  app = app.createApp(...args);
  ....
}
```
3. createAppApi过程
```js
// 在app上添加其他属性use,mixin,component,directive等
function createAppAPI(render, hydrate) {
  return function createApp(rootComponent, rootProps = null) {
    const context = createAppContext();
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
      },
      set config(v) {
      },
      use
      mixin,
      component,
      directive,
      mount, // 最开始的mount方法，后面会重写
      unmoun,
      provide,
      runWithContext
    };
    return app;
  };
}
```

4. 重写改mount方法
```js
const createApp = (...args) => {
  const app = ensureRenderer()
  app = app.createApp(...args);
  const { mount } = app;
  app.mount = () => {}
  return app;
}
```

