const scale = 1.0
const nodeWidth = 15 * scale
const horizontalSpace = 50 * scale
const verticalSpace = 50 * scale

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

const container = document.getElementById('container')
var canvas = document.createElement(
  'canvas',
  {
    width: window.innerWidth,
    height: window.innerHeight,
    style: 'width=100%; height=100%;'
  }
)
container.appendChild(canvas)

const drawNode = function(ctx, center, text) {
  ctx.lineTo(center[0]-nodeWidth/2, center[1])
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(center[0]-nodeWidth/2, center[1], nodeWidth, 0, 2 * Math.PI)
  ctx.fill()

  ctx.save()
  ctx.font = "20px Arial"
  ctx.fillStyle = "white"
  ctx.textAlign = "center"
  ctx.fillText(text, center[0]-nodeWidth/2, center[1]+nodeWidth/2)
  ctx.restore()
}

const drawTree = function(ctx, tree, center) {
  drawNode(ctx, center, tree.data)
  ctx.moveTo(center[0]-nodeWidth/2, center[1])
  const baseWidth = tree.width
  var origin = center[0]-(baseWidth/2)
  if (tree.children !== undefined) {
    tree.children.forEach((child) => {
      const childWidth = child.width
      const childCenter = [origin+(childWidth/2), center[1]+verticalSpace]
      ctx.moveTo(center[0]-nodeWidth/2, center[1])
      drawTree(ctx, child, childCenter, child.data)
      origin = childCenter[0] + childWidth/2 + horizontalSpace
    })
  }
}

const reload = function() {
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerHeight * scale
  canvas.height = window.innerHeight * scale
  const origin = [ctx.canvas.width/2, 40]
  drawTree(ctx, tree, origin)
}

window.onresize = reload
window.onload = reload
