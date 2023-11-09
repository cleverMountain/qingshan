1. 在工作经常遇到树形数据与扁平数据的转化，比如菜单类型的的需求与递归组件

## 1.扁平数据树形化

1. 将扁平化的数据转化成树形，通常每个数据中含有一个自身的id及父亲id，通过自身id与父id确定父子关系

- 通过创建父子关系的列表实现,时间复杂度为0(2n)
```js
function flattenToTree(flatArray) {
  const tree = [];
  const lookup = {}
  // 创建查找表
  for (const item of flatArray) {
    lookup[item.id] = { ...item, children: [] };
  }
  console.log(lookup)
  // 构建树
  for (const item of flatArray) {
    if (item.parentId !== null) {
      // 找到父亲
      const parent = lookup[item.parentId];
      if (parent) {
        // 父亲存在则放自己进去
        parent.children.push(lookup[item.id]);
      }
    } else {
      tree.push(lookup[item.id]);
    }
  }
  console.log(tree)
  return tree;
}
```

- 通过递归实现


