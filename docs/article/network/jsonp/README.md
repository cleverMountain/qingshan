### jsonp
1. 使用腾讯地图搜索地点时需要向腾讯地图发送请求获取结果，由于浏览器的同源策略存在跨域问题，刚好该接口又支持jsonp请求，所以使用jsonp发起请求
2. jsonp原理时利用script的标签在通过src属性获取资源时没有同源策略的限制，通过将回调函数作为参数传递给后台，当后台接收到请求后，将回调函数执行字符串返回，此时提前定义在前端的回调函数便执行
- 1.node端返回数据
```js
// node端
const express = require("express");
const app = express();
app.get("/api/data", (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // res.header('Access-Control-Allow-Headers', '*');
  const { callback } = req.query;
  const responseData = { "name": "John", "age": 30 };

  if (callback) {
    // 如果有回调函数参数，返回 JSONP 格式的响应
    // 也可以使用res.jsonp(jsonData); 
    // 返回回调函数
    res.send(`${callback}(${JSON.stringify(responseData)})`)
  }
});
app.use((req, res, next) => {

  next();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
- 2.前台执行jsonp请求
```js
function jsonp(url, params) {
  return new Promise(resolve => {
    // 组装url
    const cllback = 'jsonpCallback'
    url += '?' + 'callback' + '=' + cllback
    if (Object.keys.length > 0) {
      for (let key in params) {
        url += '&' + key + '=' + params[key]
      }
    }
    // 添加script标签
    const script = document.createElement("script");
    script.src = url;
    // 发起请求
    document.body.appendChild(script);
    window.jsonpCallback = function (data) {
      // 成功返回数据
      resolve(data)
      document.body.removeChild(script)
    }
  })
}
jsonp('http://localhost:3000/api/data').then(res => {
  console.log(res)
})
```