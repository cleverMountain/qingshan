
// 链地址法
class HashTable {
  constructor() {
    // 属性
    this.storage = []
    // 数量
    this.count = 0
    this.limit = 7
    this.loadFactor = 0 // 装填因子
  }
  hashFunc(str, size) {
    let hashCode = 0
    for (let i = 0; i < str.length; i++) {
      hashCode = 37 * hashCode + str.charCodeAt(i)
    }
    let index = hashCode & size
    return index
  }
  // 添加元素
  put(key, value) {
    // 是否需要扩容

    // 获取下标
    const index = this.hashFunc(key, this.limit)
    // 查询链表该出是否已经存在数据
    let target = this.storage[index]
    // 如果没有则添加
    if (!target) {
      this.storage[index] = target = {}
    }
    if (!target[key]) {
      this.count++

    }
    // 判断target是否已经存在key，如果存在分覆盖，没有则添加
    target[key] = value
    this.loadFactor = (this.count) / this.limit
    console.log(this.loadFactor)
    if (this.loadFactor > 0.75) {
      console.log(this.loadFactor)
      this.resize(this.getPrime(this.limit * 2))
    }
  }
  // 获取元素
  get(key) {
    // 获取下标
    const index = this.hashFunc(key, this.limit)
    // 查询链表该出是否已经存在数据
    let target = this.storage[index]
    if (!target) return -1
    return target[key]
  }
  // 删除
  remove(key) {
    // 获取下标
    const index = this.hashFunc(key, this.limit)
    // 查询链表该出是否已经存在数据
    let target = this.storage[index]
    // 没有返回false，有则删除并返回true
    if (!target) return false
    if (target.hasOwnProperty(key)) {
      this.count--
    }
    delete target[key]
    this.loadFactor = this.count / this.limit
    // 减容
    if (this.limit > 7 && this.loadFactor < 0.25) {
      this.resize(this.getPrime(this.limit / 2))
    }
    return true
  }
  // 扩容
  resize(limit) {
    const oldStorage = this.storage
    this.storage = []
    this.count = 0
    this.limit = limit
    this.loadFactor = 0
    for (let i = 0; i < oldStorage.length; i++) {
      const target = oldStorage[i]
      if (!target) {
        continue
      }
      for (let key in target) {
        this.put(key, target[key])
      }
    }
  }
  // 判断质数
  isPrime(number) {
    for (let i = 2; i < number; i++) {
      if (number % i == 0) {
        return false
      }
    }
    return true
  }
  // 获取质数
  getPrime(number) {
    let isPrimed = this.isPrime(number)
    if (isPrimed) {
      return number
    }
    while (!isPrimed) {
      number += 1
      isPrimed = this.isPrime(number)
    }
    return number
  }
}
const hashTable = new HashTable()
hashTable.put('a', '你')
hashTable.put('b', 2)
hashTable.put('c', '你')
hashTable.put('d', 2)
hashTable.put('e', '你')
hashTable.put('f', 2)

console.log(hashTable)
