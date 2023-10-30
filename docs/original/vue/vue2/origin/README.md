## 1. 从构造函数new Vue说起
- new Vuw(options),选项式：将须向的参数通过对象的方式传入
```js
// 传入el，data，created，methods
const vm = new Vue({
  el: '#app',
  data: {},
  created() {},
  methods: {}
})
```
- 源码中的构造函数Vue
- 调用initMixin方法在原型对象上添加_init方法
- new Vue时调用
```js
function Vue(options) {
  // 2.初始化选项，执行原型对象上的_init函数
  this._init(options);
}
function initMixin(Vue) {
  Vue.prototype._init = function(options) {}
}
// 在构造函数Vue的原型对象上添加——init方法
initMixin(Vue);
```
##  2. new调用时触发的_init方法,主要初始化了生命周期，方法，数据，状态等等
- initLifecycle(vm)初始化生命周期
- initProxy(vm)初始化代理
- initEvents(vm)初始化事件
- 注册生命周期beforeCreate与beforeCreate
- initState(vm)方法会初始化方法，data，computed等等，所以created之前beforeCreated之后访问不到data，method等
```js
Vue.prototype._init = function (options) {
  var vm = this
  resolveConstructorOptions(vm.constructor)
  vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    );
  {
  initProxy(vm);
  // expose real self
  vm._self = vm;
  // 初始化生命周
  initLifecycle(vm);
  // 初始化事件
  initEvents(vm);
  initRender(vm);
  callHook(vm, 'beforeCreate');
  initInjections(vm); // resolve injections before data/props
  // 初始化状态
  initState(vm);
  initProvide(vm); // resolve provide after data/props
  callHook(vm, 'created')
  if (vm.$options.el) 
    let d = vm.$mount(vm.$options.el);
    return
  }
};
``` 


## 3. initState(vm)初始化状态
- 初始化prop
- 初始化方法
- 初始化data
- 初始化computed
- 初始化watch
```js
function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;
  // 有prop初始化prop
  if (opts.props) { initProps(vm, opts.props); }
  // 初始化方法
  if (opts.methods) { initMethods(vm, opts.methods); }
  // 初始化data
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  // 初始化computed
  if (opts.computed) { initComputed(vm, opts.computed) }
  // 初始化watch
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}
```

## 4. 初始化methods
- 对方法的一种代理，在vm实例上绑定方法,this.method = vm.method = vm.$options.method
```js
function initMethods(vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
```


## 5. 初始化data
- 判断data的类型，如果是函数则data.call(vm)，否则为data
- 在vm上添加_data属性，用于代理this.key
- 对data的所有key进行代理
- this.key = this._data.key
```js
function initData(vm) {
  const { data, methods } = vm.$options
  // 判断是都是函数
  dataTmp = vm._data = typeof data === 'function' ? data.call(vm) : data
  // proxy(vm, '_data', key)
  let keys = Object.keys(dataTmp)
  let len = keys.length
  while (len--) {
    let key = keys[len]
    // 代理
    proxy(vm, '_data', key)
  }
  // 监听
  observe(data, true /* asRootData */)
}
let sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};
// 代理
function proxy(target, sourceKey, key) {
  // 重写get
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key]
  };
  // 重写set
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

## 6. 对data进行监听,对象部分,不做依赖收集的
- 监听数据时，通过new Observer实现
- 当遇到没有被监听的对象时添加__ob__表示已监听过
- 调用Observer原型的上wlak方法，遍历添加自己的属性
- 调用defineReactive方法添加getter与setter
- defineReactive方法中递归添加key，当是对象时，通过父级的get返回子级，子级也再进行observe
```js
function Observer(value) {
  this.value = value;
  if (typeof value == 'object') {
    // 添加__ob__属性
    def(value, '__ob__', this);
  }
  if (typeof value == 'object') {
    // 遍历
    this.walk(value);
  }
}
Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    // 定义响应式
    defineReactive$$1(obj, keys[i]);
  }
};
function defineReactive$$1(obj,key) {
  var property = Object.getOwnPropertyDescriptor(obj, key);
  var getter = property && property.get;
  var setter = property && property.set;
  let val = obj[key]
  // 递归监听
  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // 形成父子级的关系
      var value = getter ? getter.call(obj) : val
      return value
    },
    set: function reactiveSetter(newVal) {}
  })
}
function observe(value, asRootData) {
  ob = new Observer(value);
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}
observe(data, true)
```



## 7. 数据劫持数组部分
- 重新定义一个数组方法的对象
- 重写push、pop、shift、unshift、splice、sort、reverse可以改变原数组的方法
- 当数据调用以上方法时就走重写的方法
- 将原数组数据的原型链指向新的数组方法对象
- 调用observeArray方法监听数组
```js
// 获取原数组方法的原型对象
var arrayProto = Array.prototype;
// 创建一个新对象，该新对象的原型对象指向arrayProto
var arrayMethods = Object.create(arrayProto);
var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];
methodsToPatch.forEach(function (method) {
  var original = arrayProto[method];
  // 在arrayMethods定义push，pop等方法，重写数组方法
  def(arrayMethods, method, function mutator() {
    var args = [], len = arguments.length;
    while (len--) args[len] = arguments[len];
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted) }
    return result 
});
// 将数组数据的__ptoto__指向数组方法后的对象
function protoAugment(target, src) {
  target.__proto__ = src;
}
function Observer(value) {
  this.value = value;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    protoAugment(value, arrayMethods);
    // 监听数组数据
    this.observeArray(value);
  }
}
Observer.prototype.observeArray = function(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};
```

 
## 8. 生命周期beforeCreate与created
- beforeCreate之前没有初始化data与方法，无法调用
- created之后，已经created，可以调用data与methods
```js
callHook(vm, 'beforeCreate');
initInjections(vm); // resolve injections before data/props
// 初始化状态
initState(vm);
initProvide(vm); // resolve provide after data/props
callHook(vm, 'created')
function callHook(vm, hook) {
  // 获取生命周期函数，通过mergeOPtions后已经是数组
  var handlers = vm.$options[hook];
  var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        // 调用每个声明周期的函数
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
}
function invokeWithErrorHandling(handler, context, args, vm, info) {
  var res;
  try {
    // 调用
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}
```

## 9.模板挂载vm.$mount(vm.$options.el)
- 初始化完成后，在生命周期created之后开始对模板进行挂载
- 调用Vue原型对象上的$mount方法
- 挂载模板时优先使用选项里面的template模板，如果没有则使用获取的el作为模板
```js
callHook(vm, 'created');
vm.$mount(vm.$options.el)
Vue.prototype.$mount = function(el) {
  el = el && query(el);
  var options = this.$options;
  if (!options.render)   
    var template = options.template;
    // 模板挂载 如果有template就优先使用template
    if (template) {
      if (typeof template === 'string') {
        template = idToTemplate(template);
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        return this
      }
    } else if (el) {
      // 其次使用el，得到dom节点
      template = getOuterHTML(el)
    }  
}
```

## 10.compileToFunction(template)将template模板编译成render函数
- 分为三步，将template变成ast语法树
- 将ast语法树变成语法树字符串
- 将语法树字符串变成render函数
```js
function compileToFunction(template) {
  // console.log(template)
  // 创建ast语法树
  const ast = parseHTML(template)
  // 把语法树变成字符串
  const code = generate(ast)
  // console.log(code)
  // // 将字符串变成render函数,模板引擎with + new Function() {}
  const render = new Function(`with(this){return ${code}}`)
  // console.log(render)
  return render
}
```

## 11. parseHTML(template)获取ast语法树
- 解析template时，通过匹配开始标签，结束标签，文本来对模板进行解析
- 当遇到开始标签时，通过parseStartTag方法解析开始标签
- 遇到结束标签时，使用advance方法直接跳过
- 遇到文本时通过chars处理文本
- 通过stack栈结构来确定标签的父子关系
```js
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;   // 小a-z 大A到Z 标签名称： div  span a-aa
//?: 匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 捕获这种 <my:xx> </my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
//属性匹配   <div id="atts"></div>  // aa = "aa" | aa = 'aa'
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的  <div></div>  <br/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{xx}}  默认的 双大括号
//vue3 一摸一样的
function createASTELement(tagName, attrs) {
    return {
        tag: tagName, //标签名称
        type: 1, //元素类型
        children: [],// 孩子列表
        attrs,   //属性集合
        parent: null  // 父元素
    }
}
let root,
    currentParent,
    stack = []
function start(tagName, attrs) {
    let element = createASTELement(tagName, attrs)
    if (!root) {
        root = element
    }
    currentParent = element
    stack.push(element)
}
function end() {
    // 从栈中取出一个
    const element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
        element.parent = currentParent
        currentParent.children.push(element)
    }
}
function chars(text) {
    // console.log(text)
    text = text.replace(/\s/g, '')
    if (text) {
        currentParent.children.push({
            type: 3, //元素类型
            text,// 孩子列表
        })
    }
}


export function parseHTML(html) {
    //1解析标签  <div id="my">hello {{name}} <span>world</span></div>
    while (html) { // 只要html 不为空字符串就一直执行下去
        let textEnd = html.indexOf('<');
        if (textEnd === 0) {

            const startTagMatch = parseStartTag() //开始标签匹配结果
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)

                continue; //中断（循环中）的一个迭代，如果发生指定的条件。然后继续循环中的下一个迭代。
            }

            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                end()
                advance(endTagMatch[0].length)
                continue
            }
            // console.log(html)
        }
        //文本 
        let text;
        if (textEnd > 0) {
            // console.log(textEnd)
            text = html.substring(0, textEnd)
            if (text) {//处理文本
                chars(text)
                advance(text.length)

            }

        }
    }
    //删除标签
    function advance(n) { //将字符串进行截取操作，再跟新到html
        html = html.substring(n)

    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            /**
             *  复杂写法
             *  let end = html.match(startTagClose),
             *  attr = attr = html.match(attribute)
             *  // 匹配到attr但是没有匹配到闭合标签,循环匹配attr并将其push进attrs
             *  while(!end && attr) {
             *     console.log(attr)
             *     match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5] })
             *     advance(attr[0].length)
             *     end = html.match(startTagClose)
             *     attr = attr = html.match(attribute)
             *  }
             */
            let end,
                attr
            // 匹配到attr但是没有匹配到闭合标签,循环匹配attr并将其push进attrs
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
                advance(attr[0].length)
            }
            // 匹配到闭合标签结束处理
            if (end) {
                advance(end[0].length)
                return match
            }
        }
    }
    // console.log(root)
    return root
}
```




## 12. generate(ast)将ast语法树变成对应字符串
- 通过ast获取对应字符串，包含_c(处理标签),_v(处理文本),_s(处理变量)
```js
//思路
//  <div id="app" style="color:red"> hello {{name}}<p>hello1</P> </div>
//变成 render()
// render(){
//      return _c("div",{id:"app",style:{color:"res"}},_v('hello'+_s(name)),_c('p'，null,_v('hello1)))
//    }
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //注意正则匹配 lastIndex

// attrs
function genProps(attrs) {
    //处理属性
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        //注意;   style："color:red;font-size: 20px
        if (attr.name === 'style') {
            let obj = {} //对样式进行特殊处理
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj //
        }
        //其他  'id:app',注意最后会多个属性化 逗号
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`  // -1为最后一个字符串的位置  演示一下 
    // let reg =/a/g    reg.test('ad') false  
}

function genChildren(children) {
    if (children) {
        let res = children.map(child => gen(child))
        return res.join(',')
    }
}
function gen(node) { //获取到的元素
    //注意 是什么类型  文本   div
    if (node.type === 1) {
        return generate(node) //生成元素节点的字符串
    } else {
        let text = node.text // 获取文本  注意  普通的文本  hello{{name}}?{{num}}
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`  // _v(html)  _v('hello'+_s(name))
        }
        let tokens = [] //存放每一段的代码
        let lastIndex = defaultTagRE.lastIndex = 0;//如果正则是全局模式 需要每次使用前变为0
        let match;// 每次匹配到的结果  exec 获取 {{name}}
        while (match = defaultTagRE.exec(text)) {
            // console.log(match) 获取到 又{{}}  元素
            //  console.log(match)
            let index = match.index;// 保存匹配到的索引
            // hello{{name}} ? {{num}}
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index))) //添加的是文本
                //    console.log(tokens)
            }
            //{{name}} 添加{{}} aa
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length //最后 {{}} 索引位置
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        //最终返回出去

        return `_v(${tokens.join("+")})`
    }


}
//语法层面的转移
export function generate(el) {

    //方法 拼接字符串  源码也是这样操作 [{}]    ${el.attrs.length?`{style:{color:red}}`:'undefined'}
    let code = `_c('${el.tag}', ${el.attrs ? genProps(el.attrs) : null}, ${el.children ? genChildren(el.children) : null})`
    /**
     *   root         prop         child                                        child          
     * _c('div', {id: 'app'},_c('div', null, _v(_s(name)+ "jello" + _s(age)), _c('div'))
     * 
     */
    return code
}
```


## 13. 得到render函数
```js
const render = new Function(`with(this){return ${code}}`)
// console.log(render)
return render
```
