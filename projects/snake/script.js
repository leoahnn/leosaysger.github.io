function Snake(x, y) {
  this.length = 1;
  this.body = [
    [x, y]
  ];
}


view = {

  render: function() {
    $('#game-grid').empty();
    var gridSize = controller.getGridSize();
    for (var i = 0; i < gridSize; i++) {
      var $row = $('<div></div>');
      $row.addClass('row');
      $row.prependTo('#game-grid');
      for (var j = 0; j < gridSize; j++) {
        var $cell = $('<div></div>');
        // if grid is empty
        var cellContent = controller.getGridCell(j, i)
        if (cellContent === "food") {
          $cell.addClass("food");
        } else if (cellContent === "snake") {
          $cell.addClass("snake");
        }
        $cell.addClass('cell');
        $cell.attr('id', String(j) + "-" + String(i));
        $cell.appendTo($row);
      }
    }
  },

  showGameOver: function() {
    $gameOverMessage = $('<div class="game-over"><p>Game over man!</p></div>');
    $gameOverMessage.insertBefore('#game-grid');
  }

}

gridModel = {

  grid: [],
  food: [],

  init: function(size) {
    for (var i = 0; i < size; i++) {
      this.grid.push([]);
      for (var j = 0; j < size; j++) {
        this.grid[i].push(null);
      }
    }
    this.snake = new Snake(3, 3);
    gridModel.placeSnake();
    gridModel.placeFood();
  },

  placeFood: function() {
    var x = 0;
    var y = 0;
    do {
      x = Math.floor(Math.random() * this.grid.length)
      y = Math.floor(Math.random() * this.grid.length)
    } while (this.grid[x][y] === "snake");
    this.grid[x][y] = "food";
    this.food = [x, y];
  },

  checkFood: function(x, y) {
    if (this.food[0] === x && this.food[1] === y) {
      console.log("chomp");
      this.placeFood();
      return true;
    }
    return false;
  },

  placeSnake: function() {
    var snakeBody = this.snake.body
    for (var i = 0; i < snakeBody.length; i++) {
      this.grid[snakeBody[i][0]][snakeBody[i][1]] = "snake";
    }
  },


  moveSnake: function() {
    var snakeBody = this.snake.body;
    var x = snakeBody[snakeBody.length - 1][0];
    var y = snakeBody[snakeBody.length - 1][1];
    switch (controller.currentDirection) {
      case "left":
        x -= 1;
        break;

      case "right":
        x += 1;
        break;

      case "up":
        y += 1;
        break;

      case "down":
        y -= 1;
        break;

      default:
        return;
    };
    this.snake.headX = x;
    this.snake.headY = y;
    if (!controller.checkBounds(x, y)) {
      return;
    };
    this.snake.body.push([x, y]);
    if (gridModel.checkFood(x, y)) {
      gridModel.snake.length++;
    } else {
      var oldSnake = gridModel.snake.body.shift();
      gridModel.grid[oldSnake[0]][oldSnake[1]] = null;
    }
    gridModel.placeSnake();
  },

}

controller = {

  currentDirection: null,

  init: function() {
    gridModel.init(15);
    this.setEventListeners();
    interval = setInterval(this.playGame, 200);
    view.render();
  },

  playGame: function() {
    gridModel.moveSnake()
    view.render();
  },

  gameOver: function() {
    clearInterval(interval);
    view.showGameOver();
  },

  checkBounds: function(x, y) {
    var bounds = controller.getGridSize();
    if ((x >= bounds || y >= bounds || x < 0 || y < 0) || (gridModel.grid[x][y] === "snake")) {
      controller.gameOver();
      return false;
    }
    return true;
  },

  getSnakeCoords: function() {
    var snakeBody = gridModel.snake.body;
    return snakeBody[snakeBody.length - 1];
  },

  getGridSize: function() {
    return gridModel.grid.length;
  },

  getGridCell: function(x, y) {
    var cell = gridModel.grid[x][y];
    if (cell === "food") {
      return "food";
    } else if (cell) {
      return "snake";
    } else {
      return null;
    }
  },

  setEventListeners: function() {
    $(document).keydown(function(e) {
      switch (e.which) {
        case 37: // left
          if (controller.currentDirection == "right") {
            break;
          }
          controller.currentDirection = "left";
          break;

        case 38: // up
          if (controller.currentDirection == "up") {
            break;
          }
          controller.currentDirection = "up";
          break;

        case 39: // right
          if (controller.currentDirection == "left") {
            break;
          }
          controller.currentDirection = "right";
          break;

        case 40: // down
          if (controller.currentDirection == "up") {
            break;
          }
          controller.currentDirection = "down";
          break;

        default:
          return; // exit this handler for other keys
      }
      e.preventDefault(); // prevent the default action (scroll / move caret)
    });
  }
}



$(document).ready(function() {
  controller.init();
})
