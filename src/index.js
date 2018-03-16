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
      this.meta.textColor = 'white'
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
        break
    }
  }

}

const red = 'red'
const black = 'black'

class RedBlackTree extends BinaryTree {
  constructor(data, color, parent, left, right) {
    super(data, left, right)
    this.color = color || black
    this.parent = parent

    this.meta = {
      color: this.color,
      textColor: 'white'
    }
  }

  get children() {
    return [this.left, this.right].filter(v => v !== undefined)
  }

  get grandparent() {
    if (this.parent) {
      return this.parent.parent
    } else {
      return undefined
    }
  }

  get sibling() {
    if (this.parent.right === this) {
      return this.parent.left
    } else {
      return this.parent.right
    }
  }

  get uncle() {
    return this.parent.sibling
  }

  replaceSelfInParent(node) {
    if (this.parent.right && this.parent.right === this) {
      this.parent.right = node
    } else {
      this.parent.left = node
    }
  }

  setLeft(node) {
    node.parent = this
    this.left = node
  }

  setRight(node) {
    node.parent = this
    this.right = node
  }

  setColor(color) {
    this.color = color
    this.meta.color = color
  }

  rotateLeft() {
    var newNode = this.right
    if (newNode === undefined) {
      throw new Error('Cannot set leaf as internal node')
    }
    if (newNode.left) {
      this.setRight(newNode.left)
    }
    this.replaceSelfInParent(newNode)
    this.parent = newNode
  }

  rotateRight() {
    var newNode = this.left
    if (newNode === undefined) {
      throw new Error('Cannot set leaf as internal node')
    }
    if (newNode.right) {
      this.setLeft(newNode.right)
    }
    this.replaceSelfInParent(newNode)
    this.parent = newNode
  }

  repair() {
    if (this.parent === undefined) {
      this.setColor(black)
    } else if (this.parent.color === black) {
      // all good
    } else if (this.uncle && this.uncle.color === red) {
      this.parent.setColor(black)
      this.uncle.setColor(black)
      this.grandparent.setColor(red)
      this.grandparent.repair()
    } else {
      var p = this.parent
      var g = this.grandparent
      if (g) {
        if (g.left && this === g.left.right) {
          g.setLeft(this)
        } else if (g.right && this === g.right.left) {
          p.rotateRight()
        }
        if (p === this.left) {
          g.rotateRight()
        } else {
          g.rotateLeft()
        }
        p.setColor(black)
        g.setColor(red)
      }
    }
  }

  insert(value) {
    var inserted;
    switch (compare(value, this.data)) {
      case -1:
        if (this.left !== undefined) {
          this.left.insert(value)
        } else {
          inserted = new RedBlackTree(value, red, this)
          this.left = inserted
        }
        break
      case 1:
        if (this.right !== undefined) {
          this.right.insert(value)
        } else {
          inserted = new RedBlackTree(value, red, this)
          this.right = inserted
        }
        break
    }

    if (inserted) {
      inserted.repair()
    }
  }

}


const drawLine = function(ctx, center, tree) {
  ctx.lineTo(center[0]-nodeWidth/2, center[1])
  ctx.stroke()
}

const drawNode = function(ctx, center, tree) {
  ctx.save()
  if (tree.meta) {
    ctx.fillStyle = tree.meta.color || '#000000'
  }
  ctx.beginPath()
  ctx.arc(center[0]-nodeWidth/2, center[1], nodeWidth, 0, 2 * Math.PI)
  ctx.fill()
  ctx.fillStyle = 'black'
  ctx.stroke()
  ctx.restore()
}

const drawLabel = function(ctx, center, tree) {
  ctx.save()
  ctx.font = "20px sans-serif"
  if (tree.meta) {
    ctx.fillStyle = tree.meta.textColor
  }
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

const nodeCount = 30
const delay = 20
const randomNumber = function() { return Math.floor(Math.random() * 100) }
const container = document.getElementById('container')
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
container.appendChild(canvas)

const draw = function() {
  const origin = [ctx.canvas.width/2, 20]
  drawTree(ctx, tree, origin, drawLine)
  drawTree(ctx, tree, origin, drawNode)
  drawTree(ctx, tree, origin, drawLabel)
}

var drawnNodes = 0
var tree = new BinaryTree(randomNumber())

const reload = function() {
  canvas.width = innerHeight * scale
  canvas.height = innerHeight * scale
  draw()

  if (drawnNodes < nodeCount) {
    drawnNodes++
    tree.insert(randomNumber())
    setTimeout(reload, delay)
  }
}

window.onresize = reload
window.onload = reload
