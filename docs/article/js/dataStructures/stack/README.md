



1. 栈是是一种基本的数据结构，它遵循后进先出的原则，栈是通过数组封装，修改慢，查找快
- push: 入栈
- pop： 出栈，删除栈顶元素，返回被删除的元素
- peek: 返回栈顶元素，不对栈作修改
- isEmpty： 判断栈是否为空
- size：获取栈的个数
- toString: 将栈的所有内容义字符串返回
## 1.栈的封装
```js
class Stack {
  constructor() {
    // 使用数组来模拟栈结
    this.stack = [...arguments]
    // 置空原型链
    this.stack.__proto__ = null 
    // return this.stack
  }
  // 压栈
  push(element) {
    const length = this.stack.length
    this.stack[length] = element
  }
  // 删除栈顶元素，返回被删除的元素
  pop() {
    const length = this.stack.length
    let res = this.stack[length - 1]
    this.stack.length = length - 1
    return res
  }
  // 返回栈顶元素，不对栈作修改
  peek() {
    const length = this.stack.length
    return this.stack[length -1]
  }
  // 栈是否为空
  isEmpty() {
    return this.stack.length > 0 ? false : true
  }
  // 栈的个数
  size() {
    return this.stack.length
  }
  // 将栈的所有内容义字符串返回
  toString() {
    let str = ''
    const length = this.stack.length
    for(let i = 0; i < length; i++) {
      str += this.stack[i]
    }
    return str
  },
  stringSort() {
    let str = ''
    const length = this.stack.length - 1
    for(let i = length; i > 0; i--) {
      str += this.stack[i]
    }
    return str
  }
}
```

## 2.栈结构的应用: 10进制转2进制
- 将10进制转化为2进制
```js
function decToBin(number) {
  const stack = new Stack()
  while (number > 0) {
    stack.push(number % 2)
    number = Math.floor(number / 2)  
  }
  return stack.stringSort()
}
```


## 3.栈结构的应用: 中缀表达式转后缀表达式

## 4.栈结构的应用: 深度优先搜索