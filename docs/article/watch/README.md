1.最近在使用微信小程序时发现没有提供watch属性，便想着自己实现一个watch监听属性，仿照着vue2的watch国车过还算简单，下面是实现过程。

## 1.watch(Object.defineProperty)
1. html部分
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <input type="text" id="myInput" />
</body>

</html>
```

2. js部分
- page属性模拟微信小程序的page
- setWatcher传入page属性
- 对data进行数据劫持，获取watch的回调函数
- 当对应属性发生变化时，回调函数触发
- 需要注意的时候，当对象深度嵌套时需要递归劫持
- 支持同时监听多个属性 'obj.a, obj.b'
- 
```js
// 获取input元素
const inputElement = document.getElementById('myInput')
// 添加change事件监听器
inputElement.addEventListener('input', function (event) {
  const newValue = event.target.value;
  // console.log('输入框的值已变化：', newValue);
  page.data.obj.c = newValue
  // console.log(page.data.name);
  // 在这里执行你需要的操作
})
const page = {
  data: {
    name: '1',
    obj: {
      a: 1,
      c: {
        d: 1
      }
    }
  },
  watch: {
    name(newVal, oldVal) {
     console.log(newVal, oldVal)
    },
    obj : {
      handler: (newValue, oldValue) => {
        console.log(newValue, oldValue, '2')
      },
      deep: true
    },
  }
}
console.log(page)
function setWatcher(options) {
  const { data, watch } = options
  for (let k in watch) {
    // 'obj.a, obj.c.d': 同时监听多个时属性
    const newKey = k.replace(/\s/g, "");
    arrkeys = newKey.split(',')
    // console.log(keys)
    arrkeys.forEach(key => {
       let keys = key.split('.')
      const targetKey = keys[keys.length - 1]
      keys = keys.slice(0, -1)
      // 代理的数据对象
      const targetDate = keys.reduce((pre, cur) => {
        return pre[cur]
      }, data)
      // watcher的不同写法 函数 | 对象
      const handler = watch[k].handler || watch[k]
   
      // deep
      const deep = watch[k].deep || false
      defineReactive(targetDate, targetKey, handler, deep, options)
    })
  }
}
function defineReactive(data, key, handler, deep, options) {
  let val = data[key]
  // 如果是对象递归监听
  if (typeof val === 'object' && val !== null && deep) {
    for (let k in val) {
      defineReactive(val, k, handler, deep, options)
    }
  }
  Object.defineProperty(data, key, {
    set(newVal) {
      handler.call(options, newVal, val)
      val = newVal
      if (deep) {
        defineReactive(data, key, handler, deep, options);
      }
    },
    get() {
      return val
    }
  }
}
setWatcher(page)

```



## 2.使用proxy进行代理
- 1. 通过Refelect的set和get
- 2. 遇到深度对象时需递归代理 
- 3. 在set时，数组和对象的过程不同，但是数组的length与下标也是对象的属性，当使用push,pop,shift，onshift时数组下标与
     length均会改变，所以会两次触发set，此时过滤一次length即可
- 4. 在收集watche的回调函数时，根据不同的watcher写法收集

```js
function setWatcher(options) {
  let { data, watch } = options
  options.data = defineReactive(data, watch, options)
}
function defineReactive(data, watch, options) {
  // watch的回调函数
  const cbs = {}
  for (let key in watch) {
    const fn = watch[key]
    if (typeof fn == 'function') {
      cbs[key] = fn
    } else {
      cbs[key] = fn.handler
    }
  }
  let key = ''
  const handler = {
    set(target, property, value, receiver) {
      // 保存老值，避免被修改
      let oldValueObj = target[property]
      let oldVlueArr = JSON.parse(JSON.stringify(target))
      const success = Reflect.set(target, property, value, receiver);
      // 数组
      if (Array.isArray(target)) {
        key = key + property
        // 数组的时候，自身的length与小标也是属性，所以会走两次set，去掉length的一次即可
        if (key !== 'length') {
          // 获取对应的key
          let cbKey = (key + property).replace(/\.(push|pop|shift|unshift)\.length\.\d+$/, '')
          cbs[cbKey].call(options, target, oldVlueArr)
        }
        key = ''
      } else {
        // 对象
        if (target.hasOwnProperty(property)) {
          cbs[key + property].call(options, value, oldValueObj)
          key = ''
        }
      }
      return success;
    },
    get(target, property, receiver) {
      if (typeof property == 'string') {
        key += (property + '.')
      }
      // 对象是，递归代理
      const value = Reflect.get(target, property, receiver);
      if (typeof value === 'object' && value !== null) {
        return new Proxy(value, handler);
      }
      return value;
    }
  };
  return new Proxy(data, handler)
}
setWatcher(page)
```


## 3.自定义computed
1. 每个属性使用Object.defineProperty重新定义在data上
2. 在daat上定义computed的属性，使用setDta定义
3. computed中相关的属性变化时触发set，重新定义computed的值

```js
var page = {
  data: {
    name: '1',
    obj: {
      a: 10,
      c: {
        d: 1
      }
    }
  },
  computed: {
    computedName() {
      return this.data.name
    },
    computedA: {
      get() {
        return this.data.obj.a
      },
      set(val) {
        this.data.a = val - 2
      }
    }
  }

function setComputed(options) {
  const { data, computed } = options
  for (let key in data) {
    // 数据劫持
    if (key !== '__webviewId__' && key !== 'canIUseGetUserProfile') {
      defineReactive(key, data, options)
    }
  }
  for (let key in computed) {
    // 数据劫持
    defineComputed(key, computed, data, options)
  }
}
// 重新定义
function defineComputed(key, computed, data, options) {
  const getter = computed[key].get || computed[key]
  const setter = computed[key].set
  let obj = {}
  obj[key] = getter.call(options, data)
  options.setData(obj)
}
function defineReactive(key, data, options) {
  let val = data[key]
  if (typeof val == 'object' && val !== null) {
    for (let k in val) {
      defineReactive(k, val, options)
    }
  }
  Object.defineProperty(data, key, {
    get() {
      return val
    },
    set(value) {
      // 劫持
      val = value
      const { computed, data } = options
      for (let key in computed) {
        defineComputed(key, computed, data, options)
      }
    }
  })
}
```