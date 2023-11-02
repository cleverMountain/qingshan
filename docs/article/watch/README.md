## 1.微信小程序
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

  <script>

    // 获取input元素
    const inputElement = document.getElementById('myInput');

    // 添加change事件监听器
    inputElement.addEventListener('input', function (event) {
      const newValue = event.target.value;
      // console.log('输入框的值已变化：', newValue);
      page.data.obj.c = newValue
      // console.log(page.data.name);
      // 在这里执行你需要的操作
    });

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
      for(let key in watch) {
        let keys = key.split('.')
        // 代理key值
        const targetKey = keys[keys.length - 1]
        keys = keys.slice(0, -1)
        // 代理的数据对象
        const targetDate = keys.reduce((pre, cur) => {
          return pre[cur]
        }, data)
        // watcher的不同写法 函数 | 对象
        const handler = watch[key].handler || watch[key]
        // deep
        const deep = watch[key].deep || false
        defineReactive(targetDate, targetKey, handler, deep, options)
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
      })

    }
    setWatcher(page)
    // const obj = {
    //   a: 1,
    //   c: {
    //     d: 1
    //   }
    // }
    // Object.keys(obj).forEach(key => {
    //  defineReactive(obj, key)
    // })
    // function defineReactive(obj, key) {
    //   const val = obj[key]
    //   if (typeof val === 'object') {
    //     for(let k in val) {
    //       defineReactive(val, k)
    //     }
    //   }
    //   Object.defineProperty(obj, key, {
    //     set(newVal) {
    //       val = newVal
    //     },
    //     get() {
    //       // console.log(val)
    //       return val
    //     }
    //   })
    // }
    // console.log(obj)
  </script>
</body>

</html>
```