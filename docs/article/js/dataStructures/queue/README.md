

队列： 队列（Queue）是一种常见的数据结构，遵循先进先出的原则,以下是队列的操作
- enqueue：向队列尾部添加一个( 或多个 )新的项
- dequeue：移除队列的第一( 即排在队列最前面的 )项，并返回被移除的元素
- front：返回队列中第一个元素, 队列不做任何变动
- isEmpty：如果队列中不包含任何元素，返回true，否则返回false
- size：返回队列包含的元素个数，与数组的length属性类似
- toString：将队列中的内容, 转成字符串形式

## 1. 队列的封装
- 基于数组
```js
function Queue() {
  this.queue = [].concat(...arguments)
}
// 向队列尾部添加一个( 或多个 )新的项
Queue.prototype.enqueue = function () {
  const length = this.queue.length
  for (let i = 0; i < arguments.length; i++) {
    this.queue[length + i] = arguments[i]
  }
}
// 移除队列的第一( 即排在队列最前面的 )项，并返回被移除的元素。
Queue.prototype.dequeue = function () {
  for (let i = 0; i < this.queue.length - 1; i++) {
    this.queue[i] = this.queue[i + 1]
  } 
  let res = this.queue[0]
  this.queue.length--
  return res
}
// 返回队列中第一个元素, 队列不做任何变动
Queue.prototype.front = function () {
  const length = this.queue.length
  return this.queue[length - 1]
}
// 如果队列中不包含任何元素，返回true，否则返回false
Queue.prototype.isEmpty = function () {
  return this.queue.length > 0 ? false : true
}
// 返回队列包含的元素个数，与数组的length属性类似
Queue.prototype.size = function () {
  return this.queue.length
}
// 将队列中的内容, 转成字符串形式
Queue.prototype.toString = function () {
  let str = ''
  const length = this.queue.length
  for (let i = 0; i < length; i++) {
    str += this.queue[i]
  }
  return str
}
```


## 2.队列应用：击鼓传花

```js
const arr = ['a', 'b', 'c', 'd', 'e']
function getTarget(arr, num) {
  const newArr = Array.from(arr)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = {
      name: arr[i],
      index: i + 1
    }
    newArr.push()
  }
  const queue = new Queue(arr)
  while (queue.size() > 1) {
    const que = queue.queue
    if (que[0].index % 7 != 0) {
      let res = queue.dequeue()
      res.index = que.length + que[0].index
      queue.enqueue(res)
    } else {
      queue.dequeue()
    }
  }
  const res = queue.front()
  res.index = newArr.findIndex(item => item == res.name)
  console.log(res)
  return res
}
getTarget(arr, 7)
```