### 双指针
1. 偶数奇数排列，分别定义奇偶指针
2. 在最后一位判断奇偶，分别与当前指针替换
3. 指针+2，当某一个指针位置超过length则结束
```js
const arr = [1, 2, 3, 2, 2, 7]
function changePos(arr, i, j) {
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
let n = arr.length
// odd even奇偶指针
for (let odd = 1, even = 0; odd < n && even < n;) {
  if (arr[n - 1] % 2 == 0) {
    // 偶数修改位置
    changePos(arr, even, n - 1)
    // 移动指针
    even += 2
  } else {
    // 奇数
    changePos(arr, odd, n - 1)
    // 移动指针
    odd += 2
  }
}
```