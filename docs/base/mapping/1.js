// @ts-nocheck
class WeakMap {
  constructor(iterable) {
    this.weakMap = {}
    this.init(iterable)
  }
  set(key, value) {
    if (this.isObject(key)) {
      let weakMapKey = Symbol()
      this.weakMap[weakMapKey] = {key, value}
    }
  }
  get(k) {

    // key = Symbol(key)
    // // this.keyMap[key] = key
    // console.log(key.description)
    // console.log(key)
    // return this.weakMap[key]

    for(let kkk in this.weakMap) {
      debugger
      // if (key == k) {
      //   // return value
      //   console.log(value)
      // }
    }
  }
  has() {
    return this.weakMap[key] ? true : false
  }
  delete(key) {
    delete this.weakMap[key]
    return true
  }
  isObject(key) {
    const types = ['number', 'string']
    return !types.includes(typeof(key)) && key !== null
  }
  init(iterable) {
    if (!iterable) return
    for(let [key, value] of iterable) {
      this.set(key, value)
    }
  }
}
let a = new WeakMap()
let key1 = {}
let key2 = []
let key3 = []
let key4 = {}
a.set(key1, 1)
a.set(key2, 2)
a.set(key3, 3)
a.set(key4, 4)
console.log(a)
console.log(a.get(key1))
