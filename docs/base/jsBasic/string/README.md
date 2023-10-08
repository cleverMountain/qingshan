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
String.prototype.includes = function(target, length = 0) {
  let res = ''
  const allLnegth = this.length
  for(let i = allLength - length; i++; i < allLength) {
    res += this[i]
  }
  return res === target ? true :  false
}
```