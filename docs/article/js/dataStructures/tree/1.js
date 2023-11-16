class Node {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
  }
}
class BinarySearchTree {
  constructor() {
    this.root = null
  }
  insert(key) {
    const node = new Node(key)
    // 没有根节点
    if (!this.root) {
      this.root = node
    } else {
      // 有根节点
      this.travelsalInsert(this.root, node)
    }
  }
  travelsalInsert(preNode, node) {
    // 左树
    if (preNode.key > node.key) {
      // 左树为空时node则直接赋值左树
      if (!preNode.left) {
        preNode.left = node
      } else {
        // 又把左树当做顶点继续比较
        this.travelsalInsert(preNode.left, node)
      }
    } else {
      // 右数
      if (!preNode.right) {
        preNode.right = node
      } else {
        this.travelsalInsert(preNode.right, node)
      }
    }
  }
  // 遍历(深度优先搜索)
  travelsal(handler) {
    this.travelsalVisit(this.root, handler)
  }
  travelsalVisit(node, handler) {
    if (!node) return false
    handler(node.key)
    if (node.left) {
      this.travelsalVisit(node.left, handler)
    }
    if (node.right) {
      this.travelsalVisit(node.right, handler)
    }
  }
  // 广度优先搜索
  bfs(handler) {
    // 思路也是一样的，定义一个队列，把最根放入队列，当访问的时候取出来，如果
    // 访问这个节点相连还有其它节点时继续放进队列，一直到队列的长度为0
    let queue = [this.root]
    while (queue.length) {
      let cur = queue.shift()
      if (cur.left) {
        queue.push(cur.left)
      }
      if (cur.right) {
        queue.push(cur.right)
      }
      handler(cur.key)
    }
  }
  // 获取小大值
  getMin() {
    let root = this.root
    let res
    while (root.left) {
      root = root.left
      res = root.key
    }
    return res
  }
  // 获取最大值
  getMax() {
    let root = this.root
    let res
    while (root.right) {
      root = root.right
      res = root.key
    }
    return res
  }
  // 判断是否存在
  has(key) {
    let root = this.root
    while (root) {
      if (root.key > key) {
        root = root.left
      } else if (root.key < key) {
        root = root.right
      } else {
        return true
      }
    }
    return false
  }
  // 删除操作
  remove(key) {
    // 先找到node及node的父亲
    const nodeObj = this.find(this.root, key)
    const { self, parent, isLeft } = nodeObj
    console.log(nodeObj)
    // 叶子节点
    if (!self.left && !self.right) {
      if (isLeft) {
        parent.left = null
      } else {
        parent.right = null
      }
    }
    // 单节点
    if (!self.left || !self.right) {
      if (isLeft) {
        parent.right = self.left || self.right
      } else {
        parent.left = self.left || self.right
      }
    }
    // 双节点
    if (self.left && self.right) {
      // 父节点是单节点
      if (!parent.left || !parent.right) {
        parent.left = self.left
        parent.right = self.right
      }
      // 父亲是双节点
      if (parent.left && parent.right) {
        if (isLeft) {
          let left = parent.left = self.right
          // 一直往后找
          while (left.left) {
            left = left.left
          }
          left.left = self.left
        } else {
          let right = parent.right = self.right
          while (right.right) {
            right = right.right
          }
          right.right = self.left
        }
      }
    }
  }
  // 找到并返回某个节点
  find(root, key) {
    return this.travelsalFind(root, key)
  }
  // 递归寻找
  travelsalFind(root, key, parent) {
    if (root.key === key) {
      return {
        self: root,
        parent,
        isLeft: parent.key < key ? true : false
      }
    } else if (root.key > key) {
      return this.travelsalFind(root.left, key, root)
    } else {
      return this.travelsalFind(root.right, key, root)
    }
    return false
  }
}
