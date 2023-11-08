(function () {
  class VirtualList {
    constructor(options) {
      const { container, list, itemHeight, gap, total } = options
      this.container = document.getElementById(container)
      this.list = document.getElementById(list)
      this.itemHeight = itemHeight
      this.gap = gap
      this.total = total
      this.startIndex = 0
      this.lastIndex = this.startIndex + this.gap
      this.map = new Map()
      this.init()
    }
    init() {
      this.renderList()
      this.container.addEventListener('scroll', this.update.bind(this))
    }
    // 渲染
    renderList() {
      for (let i = this.startIndex; i < this.lastIndex; i++) {
        if (!this.map.has(i)) {
          let item = this.createItem(i)
          this.list.appendChild(item)
          this.map.set(i, item)
        }
      }
    }
    // 创建item
    createItem(index) {
      let item = document.createElement('div')
      item.className = 'item-list'
      item.innerHTML = 'item' + index
      item.style.height = this.itemHeight + 'px'
      item.style.top = (index * this.itemHeight) + 'px'
      return item
    }
    // 更新
    update(e) {
      const scrollTop = e.srcElement.scrollTop
      this.startIndex = Math.max(0, Math.floor((scrollTop / this.itemHeight)))
      this.lastIndex = Math.min(this.startIndex + this.gap, this.total)
      this.renderList()
      this.delList()
    }
    // 删除
    delList() {
      this.map.forEach((item, index) => {
        if (index < this.startIndex || index > this.lastIndex) {
          this.list.removeChild(item)
          this.map.delete(index)
        }
      })
    }
  }
  window.VirtualList = VirtualList
})();