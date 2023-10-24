1. 常用库的时间格式化format('YYYY-MM-DD')转化成想要的时间格式，接下来实现一个自己的format方法
```js
function formatDateWithRegex(date, format) {
  const map = {
    'YYYY': date.getFullYear(), // 年
    'MM': date.getMonth() + 1, // 月
    'DD': date.getDate(), // 日
    'hh': date.getHours(), // 时
    'mm': date.getMinutes(), // 分
    'ss': date.getSeconds() // 秒
  }
  // 全局正则匹配替换
  return format.replace(/YYYY|MM|DD|hh|mm|ss/g, match => 
    // padStart用0填充至两位
    return String(map[match]).padStart(2, '0')
  });
}
```

2. 关于replace的使，可以替换字符串，也可以使用正则
- 使用字符串
- 使用回调函数
```js
/**
 * match 匹配到的字符
 * index 下标
 * origin 原字符串
 * 返回值 需替换的值
*/
const str = 'aaaa'.replace('a', (match, index, origin) => {
  return 'a'
})
```


3. 重写,不考虑正则表达式的情况
```js
String.prototype.replace = function(target, cbOrStr) {
  const isCb = Object.prototype.toString.call(cbOrStr) === '[object Function]'
  const str = this
  for(let i = 0; i < str.length; i++) {
      if (str[i] === target && isCb) {
        // 函数
        str[i] = cbOrStr(target, i, str)
        break
      } else if (str[i] === target && !isCb) {
        // 非函数
        str[i] = cbOrStr
        break
      }
  }
  // 返回值
  return str
}
```
