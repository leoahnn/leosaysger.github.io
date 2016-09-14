function Asteroid(options) {
  options = options || {};

  this.x = options.x || 1;
  this.y = options.y || 1;
  this.xVel = options.xVel || (Math.random(3) + 1);
  this.yVel = options.yVel || (Math.random(3) + 1);
  this.size = options.size || (Math.random(10) + 10);
}

function Beam(options) {
  options = options || {};

  this.x = options.x || 1;
  this.y = options.y || 1;
  this.xVel = options.xVel || 1;
  this.yVel = options.yVel || 1;
  this.size = options.size || 10;
  this.direction = options.direction || 360;
}

function Ship(options) {
  options = options || {};

  this.x = options.x || 300;
  this.y = options.y || 300;
  this.xVel = options.xVel || 0;
  this.yVel = options.yVel || 0;
  this.direction = options.direction || 360;
  this.size = options.size || 10;
  this.rotate = function(direction) {
    if (direction === 'left') {
      this.direction -= 5;
      if (this.direction < 1) {
        this.direction = 360;
      }
    } else if (direction === 'right') {
      this.direction += 5;
      if (this.direction > 360) {
        this.direction = 1;
      }
    }
  };
  this.accelerate = function(positive) {
    var radians = (this.direction / 180) * Math.PI;
    if (positive) {
      this.xVel += Math.sin(radians) * 1;
      this.yVel -= Math.cos(radians) * 1;
    } else {
      this.xVel -= Math.sin(radians) * 1;
      this.yVel += Math.cos(radians) * 1;
    }
  };
}

// make super object for physics

Asteroid.prototype.tic = function() {
  this.x += this.xVel;
  this.y += this.yVel;
  if (this.x > 600) {
    this.x = 0;
  } else if (this.x < 0) {
    this.x = 600;
  }
  if (this.y > 600) {
    this.y = 0;
  } else if (this.y < 0) {
    this.y = 600;
  }
};

Ship.prototype = Object.create(Asteroid.prototype);
Ship.prototype.constructor = Ship;

Beam.prototype = Object.create(Asteroid.prototype);
Beam.prototype.constructor = Beam;



var MODEL = {

  asteroids: [],
  ships: [],
  beams: [],
  score: 0,

  init: function(num) {
    this.buildAsteroids(num);
    this.buildShip(3);
  },

  handleKeyCodes: function(keyCodes) {
    for (var i = 0 in keyCodes) {
      if (i == 32 && keyCodes[i]) {
        MODEL.buildBeam();
      }
      if (keyCodes[i]) {
        MODEL.updateShip(parseInt(i));
      }
    }
  },

  buildShip: function(num) {
    for (var i = 0; i < num; i++) {
      var ship = new Ship();
      this.ships.push(ship);
    }
  },

  buildBeam: function() {
    var ship = MODEL.ships[0];
    var options = {
      x: ship.x,
      y: ship.y,
      xVel: Math.sin(ship.direction / 180 * Math.PI) * 5,
      yVel: Math.cos(ship.direction / 180 * Math.PI) * -5,
      direction: ship.direction
    };
    var beam = new Beam(options);
    this.beams.push(beam);
  },

  buildAsteroids: function(num) {
    for (var i = 0; i < num; i++) {
      var side = this.getSide();
      var coords = this.calculateSide(side);
      var velocity = this.getVelocity();
      coords.xVel = velocity[0];
      coords.yVel = velocity[1];
      var ast = new Asteroid(coords);
      this.asteroids.push(ast);
    }
  },

  updateShip: function(keyCode) {
    switch (keyCode) {
      case 37:
        this.ships[0].rotate('left');
        break;
      case 39:
        this.ships[0].rotate('right');
        break;
      case 38:
        this.ships[0].accelerate(true);
        break;
      case 40:
        this.ships[0].accelerate(false);
        break;
      default:
        return;
    }
  },

  getVelocity: function() {
    var xVel = Math.floor(Math.random() * 3) + 1;
    var yVel = Math.floor(Math.random() * 3) + 1;
    if (Math.random() > 0.5) {
      xVel *= -1;
    }
    if (Math.random() > 0.5) {
      yVel *= -1;
    }
    return [xVel, yVel];
  },

  getSide: function() {
    var side = Math.floor(Math.random() * 4) + 1;
    var position = Math.floor(Math.random() * 600) + 1;
    return [side, position];
  },

  calculateSide: function(side) {
    switch (side[0]) {
      case 1:
        return {
          x: 0,
          y: side[1]
        };
      case 2:
        return {
          x: side[1],
          y: 0
        };
      case 3:
        return {
          x: 600,
          y: side[1]
        };
      case 4:
        return {
          x: side[1],
          y: 600
        };
      default:
        return "Nothing Here!";
    }
  },

  updateGame: function() {
    this.checkCollision();
    this.checkForDeath();
    var asteroids = this.asteroids;
    var beams = this.beams;
    for (var i = 0; i < asteroids.length; i++) {
      asteroids[i].tic();
    }
    for (var i = 0; i < beams.length; i++) {
      beams[i].tic();
    }
    if (this.ships[0]) {
      this.ships[0].tic();
    }
  },

  checkForDeath: function() {
    var asteroids = this.asteroids;
    var ship = this.ships[0];
    for (var i = asteroids.length - 1; i >= 0; i--) {
      if ((asteroids[i].x + asteroids[i].size + ship.size > ship.x) &&
        (asteroids[i].y + asteroids[i].size + ship.size > ship.y) &&
        (asteroids[i].x - asteroids[i].size - ship.size < ship.x) &&
        (asteroids[i].y - asteroids[i].size - ship.size < ship.y)) {
        MODEL.breakAsteroid(asteroids.splice(i, 1));
        MODEL.ships.shift();
      }
    }
  },

  checkCollision: function() {
    var asteroids = this.asteroids;
    var beams = this.beams;
    var i = (asteroids.length - 1)
    while (i >= 0) {
      for (var j = beams.length - 1; j >= 0; j--) {
        if ((asteroids[i].x + asteroids[i].size > beams[j].x) &&
          (asteroids[i].y + asteroids[i].size > beams[j].y) &&
          (asteroids[i].x - asteroids[i].size < beams[j].x) &&
          (asteroids[i].y - asteroids[i].size < beams[j].y)) {
          beams.splice(j, 1);
          MODEL.breakAsteroid(asteroids.splice(i, 1)[0]);
          MODEL.score++;
          i = (asteroids.length - 1)
          break;
        }
      }
      i--;
    }
  },

  breakAsteroid: function(asteroid) {
    if (asteroid.size > 6) {
      for (var i = 0; i < 2; i++) {
        var asteroidPiece = new Asteroid({
          x: asteroid.x,
          y: asteroid.y,
          size: Math.floor(asteroid.size * (Math.random() / 3) + 5)
        })
        MODEL.asteroids.push(asteroidPiece);
      }
    }
  }

};

var VIEW = {
  init: function() {
    VIEW.keyPressListener();
  },

  render: function(asteroids, ships, beams, score) {
    var canvas = $('#canvas').get(0);
    canvas.width = 600;
    canvas.height = 600;
    canvas.width = canvas.width;
    for (var i = 0; i < asteroids.length; i++) {
      VIEW.drawAsteroid(asteroids[i], canvas);
    }
    for (var i = 0; i < beams.length; i++) {
      VIEW.drawBeam(beams[i], canvas);
    }
    VIEW.drawShip(ships, canvas);
    $('.score').remove();
    VIEW.score(score, ships.length);
  },

  keyPressListener: function() {
    var map = {
      32: false,
      37: false,
      38: false,
      39: false,
      40: false
    };
    $(document).keydown(function(e) {
      if (e.keyCode in map) {
        map[e.keyCode] = true;
        e.preventDefault();
        CONTROLLER.rotateShip(map);
      }
    }).keyup(function(e) {
      if (e.keyCode in map) {
        map[e.keyCode] = false;
      }
    });
  },


  drawShip: function(ships, canvas) {
    var ship = ships[0];
    var context = canvas.getContext("2d");
    var centerX = ship.x;
    var centerY = ship.y;
    var shipImage = new Image();
    shipImage.src = 'asteroid_ship.ico';
    var width = shipImage.width;
    var height = shipImage.height;

    var angleInRadians = (ship.direction / 180) * Math.PI;

    context.translate(centerX, centerY);
    context.rotate(angleInRadians);
    context.drawImage(shipImage, -width / 2, -height / 2, width, height);
  },

  drawAsteroid: function(asteroid, canvas) {
    var context = canvas.getContext("2d");
    var centerX = asteroid.x;
    var centerY = asteroid.y;
    var radius = asteroid.size;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.closePath();
  },

  drawBeam: function(beam, canvas) {
    var context = canvas.getContext("2d");
    var startX = beam.x;
    var startY = beam.y;
    var length = beam.size;
    var rotation = beam.direction / 180 * Math.PI;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineWidth = 3;
    context.lineTo(startX + Math.sin(rotation) * length, startY - Math.cos(rotation) * length);
    context.strokeStyle = '#FFF';
    context.stroke();
  },

  score: function(score, lives) {
    $score = $('<div>');
    $score.addClass('score');
    $score.text("Score: " + score + " Lives: " + lives);
    $score.appendTo($('.game'));
  },


  renderEndGame: function() {
    $(document).off();
    alert("Game Over Man!")
  }

};

var CONTROLLER = {
  init: function(num) {
    MODEL.init(num);
    VIEW.init();
  },

  gameLoop: function() {
    CONTROLLER.interval = window.setInterval(function() {
      VIEW.render(MODEL.asteroids, MODEL.ships, MODEL.beams, MODEL.score);
      MODEL.updateGame();
      CONTROLLER.checkGameOver();
    }, 50);
  },

  checkGameOver: function() {
    if (MODEL.ships.length === 0) {
      CONTROLLER.stopLoop();
      VIEW.renderEndGame();
    }
  },

  rotateShip: function(keyCodes) {
    MODEL.handleKeyCodes(keyCodes);
  },

  stopLoop: function() {
    window.clearInterval(CONTROLLER.interval);
  }
};

$(document).ready(function() {
  CONTROLLER.init(20);
  CONTROLLER.gameLoop();
});
