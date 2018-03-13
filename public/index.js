'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var scale = 1.0;
var nodeWidth = 15 * scale;
var horizontalSpace = 50 * scale;
var verticalSpace = 50 * scale;

var Tree = function () {
  function Tree(data, children) {
    _classCallCheck(this, Tree);

    this.data = data;
    this.children = children;
  }

  _createClass(Tree, [{
    key: 'width',
    get: function get() {
      if (this.children === undefined || this.children.length == 0) {
        return nodeWidth;
      } else {
        var sum = 0;
        for (var i = 0; i < this.children.length; i++) {
          sum += this.children[i].width;
        }
        return sum + horizontalSpace * (this.children.length - 1);
      }
    }
  }]);

  return Tree;
}();

var tree = new Tree(5, [new Tree(6, [new Tree(10), new Tree(5), new Tree(1)]), new Tree(8, [new Tree(10), new Tree(1)]), new Tree(10, [new Tree(10), new Tree(15), new Tree(18, [new Tree(5)])])]);

var container = document.getElementById('container');
var canvas = document.createElement('canvas', {
  width: window.innerWidth,
  height: window.innerHeight,
  style: 'width=100%; height=100%;'
});
container.appendChild(canvas);

var drawNode = function drawNode(ctx, center, text) {
  ctx.lineTo(center[0] - nodeWidth / 2, center[1]);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(center[0] - nodeWidth / 2, center[1], nodeWidth, 0, 2 * Math.PI);
  ctx.fill();

  ctx.save();
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(text, center[0] - nodeWidth / 2, center[1] + nodeWidth / 2);
  ctx.restore();
};

var drawTree = function drawTree(ctx, tree, center) {
  drawNode(ctx, center, tree.data);
  ctx.moveTo(center[0] - nodeWidth / 2, center[1]);
  var baseWidth = tree.width;
  var origin = center[0] - baseWidth / 2;
  if (tree.children !== undefined) {
    tree.children.forEach(function (child) {
      var childWidth = child.width;
      var childCenter = [origin + childWidth / 2, center[1] + verticalSpace];
      ctx.moveTo(center[0] - nodeWidth / 2, center[1]);
      drawTree(ctx, child, childCenter, child.data);
      origin = childCenter[0] + childWidth / 2 + horizontalSpace;
    });
  }
};

var reload = function reload() {
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerHeight * scale;
  canvas.height = window.innerHeight * scale;
  var origin = [ctx.canvas.width / 2, 40];
  drawTree(ctx, tree, origin);
};

window.onresize = reload;
window.onload = reload;
//# sourceMappingURL=index.js.map
