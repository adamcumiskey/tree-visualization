const randomNumber = function() { return Math.floor(Math.random() * 100) }

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
    this.left = left
    this.right = right
    this.setData(data)
  }

  setData(data) {
    this.data = data
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
    if (!this.data) {
      this.setData(value)
      return
    }
    switch (compare(value, this.data)) {
      case -1:
        if (this.left === undefined) {
          this.left = new BinaryTree(value)
          return this.root
        } else {
          return this.left.insert(value)
        }
        break
      case 0:
        return this.root
      case 1:
        if (this.right === undefined) {
          this.right = new BinaryTree(value)
          return this.root
        } else {
          return this.right.insert(value)
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

  get root() {
    if (this.parent) {
      return this.parent.root
    } else {
      return this
    }
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

  setLeft(node) {
    if (node) {
      node.parent = this
      this.left = node
    } else {
      this.left = undefined
    }
  }

  setRight(node) {
    if (node) {
      node.parent = this
      this.right = node
    } else {
      this.right = undefined
    }
  }

  replaceSelfInParent(node) {
    if (!this.parent) {
      node.parent = undefined
    } else if (this.parent.right && this.parent.right === this) {
      this.parent.setRight(node)
    } else {
      this.parent.setLeft(node)
    }
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
    this.setRight(newNode.left)
    this.replaceSelfInParent(newNode)
    newNode.setLeft(this)
  }

  rotateRight() {
    var newNode = this.left
    if (newNode === undefined) {
      throw new Error('Cannot set leaf as internal node')
    }
    this.setLeft(newNode.right)
    this.replaceSelfInParent(newNode)
    newNode.setRight(this)
  }

  repair() {
    if (this.parent === undefined) {
      this.setColor(black)
      return this.root
    } else if (this.parent.color === black) {
      // all good
      return this.root
    } else if (this.uncle && this.uncle.color === red) {
      this.parent.setColor(black)
      this.uncle.setColor(black)
      this.grandparent.setColor(red)
      return this.grandparent.repair()
    } else {
      var n = this
      var p = n.parent
      var g = n.grandparent
      if (g) {
        if (g.left && n === g.left.right) {
          p.rotateLeft()
          n = n.left
        } else if (g.right && n === g.right.left) {
          p.rotateRight()
          n = n.right
        }
        p = n.parent
        g = n.grandparent
        if (n == p.left) {
          g.rotateRight()
        } else {
          g.rotateLeft()
        }
        p.setColor(black)
        g.setColor(red)
      }
      return this.root
    }
  }

  insert(value) {
    if (!self.data) {
      self.data = value
      return this.root
    }
    switch (compare(value, this.data)) {
      case -1:
        if (this.left !== undefined) {
          return this.left.insert(value)
        } else {
          this.left = new RedBlackTree(value, red, this)
          return this.left.repair()
        }
        /* jshint -W086 */
      case 0:
        return this.root
      case 1:
        if (this.right !== undefined) {
          return this.right.insert(value)
        } else {
          this.right = new RedBlackTree(value, red, this)
          return this.right.repair()
        }
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
  if (!tree.data) return
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

const scale = 1.0
const nodeWidth = 15 * scale
const horizontalSpace = 50 * scale
const verticalSpace = 50 * scale
const nodeCount = 30

const canvas = document.getElementById('canvas')
const valueList = document.getElementById('value-list')
const insertInput = document.getElementById('insert-input')
const insertSubmit = document.getElementById('insert-submit')
const insertRandom = document.getElementById('insert-random')
const nukeSubmit = document.getElementById('nuke-submit')

const ctx = canvas.getContext('2d')

var inserted
var tree

const init = function() {
  inserted = [randomNumber()]
  tree = new RedBlackTree(inserted[0])
}

const draw = function() {
  const origin = [ctx.canvas.width/2, 20]
  drawTree(ctx, tree, origin, drawLine)
  drawTree(ctx, tree, origin, drawNode)
  drawTree(ctx, tree, origin, drawLabel)
}

const redraw = function() {
  canvas.width = innerHeight * scale
  canvas.height = innerHeight * scale
  valueList.innerHTML = "[" + inserted.join(', ') + "]"
  draw()
}

const insert = function(event) {
  const value = parseInt(insertInput.value)
  if (value) {
    inserted.push(value)
    tree = tree.insert(value)
    redraw()
  }
}

const insertRnd = function(event) {
  const newInt = randomNumber()
  inserted.push(newInt)
  tree = tree.insert(newInt)
  redraw()
}

const nuke = function(event) {
  init()
  redraw()
}

init()

insertSubmit.onclick = insert
insertRandom.onclick = insertRnd
nukeSubmit.onclick = nuke
window.onresize = redraw
window.onload = redraw

