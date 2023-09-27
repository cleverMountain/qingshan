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
