
// 邻接矩阵
// 邻接表
// 广度优先搜索 Breadth-First-Search BFS
// 深度优先搜索 Depth-First-Search DFS
class Graph {
  constructor() {
    this.vertexes = [] // 顶点
    this.edges = Object.create(null) // 边
  }
  // 添加节点
  addVertexts() {
    for (let i = 0; i < arguments.length; i++) {
      const v = arguments[i]
      this.vertexes.push(v)
      this.edges[v] = []
    }
  }
  // 添加边
  addEdges(v1, v2) {
    // console.log(this.vertexes)
    // console.log(this.edges)
    this.edges[v1].push(v2) // 其他节点
    // this.edges[v2].push(v1) // 自己节点
  }
  // 获取所有边
  toString() {
    let str = ''
    for (let i = 0; i < this.vertexes.length; i++) {
      const key = this.vertexes[i]
      const item = this.edges[key]
      for (let j = 0; j < item.length; j++) {
        str += (key + '=>' + item[j]) + ','
      }
    }
    // console.log(str)
    return str.slice(0, -1)
  }
  // 初始化状态
  initStatus() {
    // white 没有访问  gray 访问了没有探索 black既访问了又探索了
    const colors = {}
    for (let i = 0; i < this.vertexes.length; i++) {
      colors[this.vertexes[i]] = 'white'
    }
    return colors
  }
  // 广度优先搜索
  bfs(initV, handler) {
    // 1.初始状态
    let colors = this.initStatus()
    console.log(colors)
    // 2.把顶点放进队列
    const queue = [initV]
    while (queue.length) {
      // 3.1开始探索
      const cur = queue.shift()
      colors[cur] = 'gray'
      // 3.2寻找子节点
      const chilren = this.edges[cur]
      for (let i = 0; i < chilren.length; i++) {
        // 白色未被访问
        if (colors[chilren[i]] == 'white') {
          queue.push(chilren[i])
          // 已访问未探索
          colors[chilren[i]] = 'gray'
        }


      }
      // 3.2探索完毕
      colors[cur] = 'black'
      // 4.处理节点
      handler(cur, this.edges[cur], colors)
    }
    console.log(colors)
  }
  // 深度优先搜索，需要先定义递归函数
  dfs(initV, handler) {
    // 1.初始状态
    let colors = this.initStatus()
    this.visit(initV, colors, handler)
  }
  visit(v, colors, handler) {

    // 1.将该节点状态修改为已访问未探索
    colors[v] = 'gray'
    // 2.执行处理函数
    handler(v, this.edges[v])
    let children = this.edges[v]
    // 3.递归访问其他节点
    for (let i = 0; i < children.length; i++) {
      let item = children[i]
      if (colors[item] == 'white') {
        // handler(item, this.edges[item])
        this.visit(item, colors, handler)
      }
      // 4.修改状态为已访问已探索
      colors[item] = 'black'
    }
  }
}

let graph = new Graph()
let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I']
graph.addVertexts(...arr)
graph.addEdges('A', 'B')
graph.addEdges('A', 'C')
graph.addEdges('A', 'D')
graph.addEdges('B', 'E')
graph.addEdges('B', 'F')
graph.addEdges('C', 'H')
graph.addEdges('D', 'I')

graph.bfs('A', (a, b, c) => {
  console.log(a, b, c)
})
console.log(graph)
