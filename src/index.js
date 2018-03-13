const nodeWidth = 15
const horizontalSpace = 50
const verticalSpace = 50

class Tree {
  constructor(data, children) {
    this.data = data
    this.children = children
  }

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

const tree = new Tree(
  5,
  [new Tree(6, [new Tree(10), new Tree(5), new Tree(1)]),
  new Tree(8, [new Tree(10), new Tree(1)]),
  new Tree(10, [new Tree(10), new Tree(15), new Tree(18, [new Tree(5)])])]
)

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const origin = [ctx.canvas.width/2, 40]

const drawNode = function(ctx, center) {
  ctx.lineTo(center[0]-nodeWidth/2, center[1])
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(center[0]-nodeWidth/2, center[1], nodeWidth, 0, 2 * Math.PI)
  ctx.fill()
}

const drawTree = function(ctx, tree, center) {
  drawNode(ctx, center)
  ctx.moveTo(center[0]-nodeWidth/2, center[1])
  const baseWidth = tree.width
  var origin = center[0]-(baseWidth/2)
  if (tree.children !== undefined) {
    tree.children.forEach((child) => {
      const childWidth = child.width
      const childCenter = [origin+(childWidth/2), center[1]+verticalSpace]
      ctx.moveTo(center[0]-nodeWidth/2, center[1])
      drawTree(ctx, child, childCenter)
      origin = childCenter[0] + childWidth/2 + horizontalSpace
    })
  }
}

drawTree(ctx, tree, origin)

