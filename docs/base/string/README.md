## String.prototype.at
1. 某个字符串某个下标的字符
2. index为正或负数
```js
String.prototype.at = function(index) {
  let res = ''
  const str = this
  // return index >=0 ? str[index] : 
  if (index >=0 ) {
    return str[index]
  } else {
    let newStr= ''
    for(let i = str.length; i--; i > 0){
      newStr += str[i]
    }
    return newStr[Math.abs(index)] 
  }
}
```

## String.prototype.concat
1. 拼接字符串并返回新的字符串
```js
String.prototype.concat = function() {
  const str = ''
  str += this
  Array.prototype.forEach(st => {
    str += st
  })
  return str
}
```

## String.prototype.endsWith
1. 判断是否含有以某个字符串结尾
2. 两个参数，一个为目标字符串，一个为下标位置，默认为目标字符串长度
```js
String.prototype.endsWith = function(target, length = target.length) {
  let res = ''
  const allLnegth = this.length
  for(let i = allLength - length; i++; i < allLength) {
    res += this[i]
  }
  return res === target ? true :  false
}
```

## String.prototype.includes
1. 判断是否含有以某个字符串
2. 两个参数，一个为目标字符串，一个为下标位置，默认为0
```js
String.prototype.includes = function(target, index = 0) {
  // 遍历源字符串的每个字符
  let first = target[0]
  let sourceString = this
  const length = target.length
  // 收集可能性
  const kinds = []
  for (let i = index; i <= sourceString.length; i++) {
    if (sourceString[i] === first) {
      let str = ''
      for(let j = i; j < length + i; j++) {
        str += sourceString[j]
      }
      kinds.push(str)
    }
  }
  // 存在则返回
  for(let k = 0 ; k < kinds.length; k++) {
    if (kinds[k] === target) {
      return true
    } else {
      return false
    }
  }
  return false
}
```

## String.prototype.includes
1. 获取第一次出现的下标
2. 两个参数，一个为目标字符串，一个为下标位置，默认为0
```js
String.prototype.includes = function(target, index = 0) {
  // 遍历源字符串的每个字符
  let first = target[0]
  let res = 0
  let sourceString = this
  const length = target.length
  // 收集可能性
  const kinds = []
  const indexs = []
  for (let i = index; i <= sourceString.length; i++) {
    if (sourceString[i] === first) {
      let str = ''
      for(let j = i; j < length + i; j++) {
        str += sourceString[j]
      }
      kinds.push(str)
      indexs.push(i)
    }
  }
  // 存在则返回
  for(let k = 0 ; k < kinds.length; k++) {
    if (kinds[k] === targetString) {
      res = indexS[k]
    }
  }
  return res
}
```