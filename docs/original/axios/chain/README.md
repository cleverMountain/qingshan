1. promise链条式调用,chain.shift()返回首个的处理函数，then后异步执行
```js
const handleA = (config) => {
  config.b = 2
  return config
}
const handleB = (config) => {
  config.c = 3
  return config
}
let promise = Promise.resolve({a: 1})
const chain = [handleA, handleB, handleC, handleD]
while(chain.length > 0) {
  promise = promise.then(chain.shift())
}
promise.then(res => {
  // {a: 1, b: 2, c: 3}
  console.log(res) 
})
```