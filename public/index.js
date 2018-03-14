'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var scale = 1.0;
var nodeWidth = 15 * scale;
var horizontalSpace = 50 * scale;
var verticalSpace = 50 * scale;

var compare = function compare(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (a === b) {
      return 0;
    }
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
  } else if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  } else if (a.compare !== undefined && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === (typeof b === 'undefined' ? 'undefined' : _typeof(b))) {
    return a.compare(b);
  }
};

var Tree = function () {
  function Tree() {
    _classCallCheck(this, Tree);
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

var BinaryTree = function (_Tree) {
  _inherits(BinaryTree, _Tree);

  function BinaryTree(data, left, right) {
    _classCallCheck(this, BinaryTree);

    var _this = _possibleConstructorReturn(this, (BinaryTree.__proto__ || Object.getPrototypeOf(BinaryTree)).call(this));

    _this.data = data;
    _this.left = left;
    _this.right = right;

    if (typeof data === 'number') {
      _this.meta = {};
      var h = data / 100 * 300;
      _this.meta.color = 'hsl(' + h + ', 100%, 50%)';
      _this.meta.textColor = 'white';
    }
    return _this;
  }

  _createClass(BinaryTree, [{
    key: 'find',
    value: function find(value) {
      switch (compare(value, this.data)) {
        case -1:
          return this.left.find(value);
        case 0:
          return this;
        case 1:
          return this.right.find(value);
      }
    }
  }, {
    key: 'insert',
    value: function insert(value) {
      switch (compare(value, this.data)) {
        case -1:
          if (this.left === undefined) {
            this.left = new BinaryTree(value);
          } else {
            this.left.insert(value);
          }
          break;
        case 1:
          if (this.right === undefined) {
            this.right = new BinaryTree(value);
          } else {
            this.right.insert(value);
          }
          break;
      }
    }
  }, {
    key: 'children',
    get: function get() {
      return [this.left, this.right].filter(function (v) {
        return v !== undefined;
      });
    }
  }]);

  return BinaryTree;
}(Tree);

var red = 'red';
var black = 'black';

var RedBlackTree = function (_BinaryTree) {
  _inherits(RedBlackTree, _BinaryTree);

  function RedBlackTree(data, color, parent, left, right) {
    _classCallCheck(this, RedBlackTree);

    var _this2 = _possibleConstructorReturn(this, (RedBlackTree.__proto__ || Object.getPrototypeOf(RedBlackTree)).call(this, data, left, right));

    _this2.color = color || black;
    _this2.parent = parent;

    _this2.meta = {
      color: color,
      textColor: 'white'
    };
    return _this2;
  }

  _createClass(RedBlackTree, [{
    key: 'replaceSelfInParent',
    value: function replaceSelfInParent(node) {
      if (this.parent.right === this) {
        this.parent.right = node;
      } else {
        this.parent.left = node;
      }
    }
  }, {
    key: 'setLeft',
    value: function setLeft(node) {
      node.parent = this;
      this.left = node;
    }
  }, {
    key: 'setRight',
    value: function setRight(node) {
      node.parent = this;
      this.right = node;
    }
  }, {
    key: 'rotateLeft',
    value: function rotateLeft() {
      var newNode = this.right;
      if (newNode === undefined) {
        throw new Error('Cannot set leaf as internal node');
      }
      this.setRight(newNode.left);
      this.replaceSelfInParent(newNode);
      this.parent = newNode;
    }
  }, {
    key: 'rotateRight',
    value: function rotateRight() {
      var newNode = this.left;
      if (newNode === undefined) {
        throw new Error('Cannot set leaf as internal node');
      }
      this.setLeft(newNode.right);
      this.replaceSelfInParent(newNode);
      this.parent = newNode;
    }
  }, {
    key: 'insert',
    value: function insert(value) {
      switch (compare(value, this.data)) {
        case -1:
          if (this.left !== undefined) {
            this.left.insert(value);
          } else {
            this.left = new RedBlackTree(value, this.color === black ? red : black, this);
          }
          break;
        case 1:
          if (this.right !== undefined) {
            this.right.insert(value);
          } else {
            this.right = new RedBlackTree(value, this.color === black ? red : black, this);
          }
          break;
      }
    }
  }, {
    key: 'grandparent',
    get: function get() {
      return this.parent.parent;
    }
  }, {
    key: 'sibling',
    get: function get() {
      if (this.parent.right === this) {
        return this.parent.left;
      } else {
        return this.parent.right;
      }
    }
  }]);

  return RedBlackTree;
}(BinaryTree);

var nodeCount = 30;
var randomNumber = function randomNumber() {
  return Math.floor(Math.random() * 100);
};
var tree = new RedBlackTree(randomNumber());
for (var i = 0; i < nodeCount; i++) {
  tree.insert(randomNumber());
}

console.log(tree);

var container = document.getElementById('container');
var canvas = document.createElement('canvas');
container.appendChild(canvas);

var drawLine = function drawLine(ctx, center, tree) {
  ctx.lineTo(center[0] - nodeWidth / 2, center[1]);
  ctx.stroke();
};

var drawNode = function drawNode(ctx, center, tree) {
  ctx.save();
  if (tree.meta) {
    ctx.fillStyle = tree.meta.color || '#000000';
  }
  ctx.beginPath();
  ctx.arc(center[0] - nodeWidth / 2, center[1], nodeWidth, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
};

var drawLabel = function drawLabel(ctx, center, tree) {
  ctx.save();
  ctx.font = "20px Arial";
  if (tree.meta) {
    ctx.fillStyle = tree.meta.textColor;
  }
  ctx.textAlign = "center";
  ctx.fillText(tree.data, center[0] - nodeWidth / 2, center[1] + nodeWidth / 2);
  ctx.restore();
};

var drawTree = function drawTree(ctx, tree, center, fn) {
  fn(ctx, center, tree);
  ctx.moveTo(center[0] - nodeWidth / 2, center[1]);
  var baseWidth = tree.width;
  var origin = center[0] - baseWidth / 2;
  if (tree.children !== undefined) {
    tree.children.forEach(function (child) {
      var childWidth = child.width;
      var childCenter = [origin + childWidth / 2, center[1] + verticalSpace];
      ctx.moveTo(center[0] - nodeWidth / 2, center[1]);
      drawTree(ctx, child, childCenter, fn);
      origin = childCenter[0] + childWidth / 2 + horizontalSpace;
    });
  }
};

var reload = function reload() {
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerHeight * scale;
  canvas.height = window.innerHeight * scale;
  var origin = [ctx.canvas.width / 2, 20];
  drawTree(ctx, tree, origin, drawLine);
  drawTree(ctx, tree, origin, drawNode);
  drawTree(ctx, tree, origin, drawLabel);
};

window.onresize = reload;
window.onload = reload;
//# sourceMappingURL=index.js.map
