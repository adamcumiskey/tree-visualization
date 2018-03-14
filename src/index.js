const scale = 1.0
const nodeWidth = 15 * scale
const horizontalSpace = 50 * scale
const verticalSpace = 50 * scale

const compare = function(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (a === b) { return 0 }
    if (a < b) { return -1 }
    if (a > b) { return 1 }
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  } else if (a.compare !== undefined && typeof a === typeof b) {
    return a.compare(b)
  }
}

class Tree {
  get width() {
    if (this.children === undefined || this.children.length == 0) {
      return nodeWidth
    } else {
      var sum = 0;
      for (var i = 0; i < this.children.length; i++) {
        sum += this.children[i].width
      }
      return sum + (horizontalSpace * (this.children.length - 1))
    }
  }

}

class BinaryTree extends Tree {
  constructor(data, left, right) {
    super()
    this.data = data
    this.left = left
    this.right = right

    if (typeof data === 'number') {
      this.meta = {}
      var h = (data/100)*300
      this.meta.color = `hsl(${h}, 100%, 50%)`
    }
  }

  get children() {
    return [this.left, this.right].filter(v => v !== undefined)
  }

  find(value) {
    switch (compare(value, this.data)) {
      case -1:
        return this.left.find(value)
      case 0:
        return this
      case 1:
        return this.right.find(value)
    }
  }

  insert(value) {
    switch (compare(value, this.data)) {
      case -1:
        if (this.left === undefined) {
          this.left = new BinaryTree(value)
        } else {
          this.left.insert(value)
        }
        break
      case 1:
        if (this.right === undefined) {
          this.right = new BinaryTree(value)
        } else {
          this.right.insert(value)
        }
    }
  }

}

const nodeCount = 30
const randomNumber = function() { return Math.floor(Math.random() * 100) }
var tree = new BinaryTree(randomNumber())
for (var i = 0; i < nodeCount; i++) {
  tree.insert(randomNumber())
}

const container = document.getElementById('container')
const canvas = document.createElement('canvas')
container.appendChild(canvas)

const drawLine = function(ctx, center, tree) {
  ctx.lineTo(center[0]-nodeWidth/2, center[1])
  ctx.stroke()
}

const drawNode = function(ctx, center, tree) {
  ctx.save()
  ctx.fillStyle = tree.meta.color || '#000000'
  ctx.beginPath()
  ctx.arc(center[0]-nodeWidth/2, center[1], nodeWidth, 0, 2 * Math.PI)
  ctx.fill()
  ctx.restore()
}

const drawLabel = function(ctx, center, tree) {
  ctx.save()
  ctx.font = "20px Arial"
  ctx.fillStyle = "black"
  ctx.textAlign = "center"
  ctx.fillText(tree.data, center[0]-nodeWidth/2, center[1]+nodeWidth/2)
  ctx.restore()
}

const drawTree = function(ctx, tree, center, fn) {
  fn(ctx, center, tree)
  ctx.moveTo(center[0]-nodeWidth/2, center[1])
  const baseWidth = tree.width
  var origin = center[0]-(baseWidth/2)
  if (tree.children !== undefined) {
    tree.children.forEach((child) => {
      const childWidth = child.width
      const childCenter = [origin+(childWidth/2), center[1]+verticalSpace]
      ctx.moveTo(center[0]-nodeWidth/2, center[1])
      drawTree(ctx, child, childCenter, fn)
      origin = childCenter[0] + childWidth/2 + horizontalSpace
    })
  }
}

const reload = function() {
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerHeight * scale
  canvas.height = window.innerHeight * scale
  const origin = [ctx.canvas.width/2, 20]
  drawTree(ctx, tree, origin, drawLine)
  drawTree(ctx, tree, origin, drawNode)
  drawTree(ctx, tree, origin, drawLabel)
}

window.onresize = reload
window.onload = reload
