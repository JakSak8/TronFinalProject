// Code modified from https://github.com/JDStraughan/html5-lightcycles/blob/master/main.js
// Used as a base for Tron game functionality
alert("javascript loaded");

var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

player1 = {
	type:'user1',
	width: 10,
	height: 10,
	color: "#FF00FF",
	history: [],
	curr_dir: null
}

player2 = {
	type: 'user2',
	width: 10,
	height: 10,
	color: "#FF355E",
	history: [],
	curr_dir: null
}

p1keys = {
	up: [38],
	down: [40],
	left: [37],
	right: [39],
	start_game: [13, 32]
}

p2keys = {
	up: [87],
	down: [83],
	left: [65],
	right: [68],
	start_game: [13, 32],
}

p1lastKey = null;
p2lastkey = null;

game = {
  
  over: false,
  
  start: function() {
    cycle.resetPlayer1();
    cycle.resetPlayer2();
    game.over = false;
    player2.curr_dir = "right";
    player1.curr_dir = "left";
    game.resetCanvas();
  },
  
  stop: function(cycle) {
    game.over = true;
    context.fillStyle = '#FFF';
    //context.font = (canvas.height / 15) + 'px sans-serif';
    context.textAlign = 'center';
    winner = cycle.type == 'USER2' ? 'USER1' : 'USER2';
    context.fillText('GAME OVER - ' + winner + ' WINS', canvas.width/2, canvas.height/2);
    context.fillText('press START to replay', canvas.width/2, canvas.height/2 + (cycle.height * 3)); 
    cycle.color = "#F00";
  },
  
  newLevel: function() {
    cycle.resetPlayer();
    cycle.resetEnemy();
    this.resetCanvas();
  },
  
  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
};

cycle = {
  
  resetPlayer1: function() {
    player1.x = canvas.width - (canvas.width / (player1.width / 2) + 4);
    player1.y = (canvas.height / 2) + (player1.height / 2);
    player1.color = 'red';
    player1.history = [];    
    player1.current_direction = "left";
  },
  
  resetPlayer2: function() {
    player2.x = (canvas.width / (player2.width / 2) - 4);
    player2.y = (canvas.height / 2) + (player2.height / 2);
    player2.color = 'blue';
    player2.history = [];
    player2.current_direction = "right";
  },
  
  move: function(cycle, opponent) {
    switch(cycle.current_direction) {
      case 'up':
        cycle.y -= cycle.height;
        break;
      case 'down':
        cycle.y += cycle.height;
        break;
      case 'right':
        cycle.x += cycle.width;
        break;
      case 'left':
        cycle.x -= cycle.width;
        break;
    }
    if (this.checkCollision(cycle, opponent)) {
      game.stop(cycle);
    }
    coords = this.generateCoords(cycle);
    cycle.history.push(coords);
  },

  checkCollision: function(cycle, opponent) {
    if ((cycle.x < (cycle.width / 2)) || 
        (cycle.x > canvas.width - (cycle.width / 2)) || 
        (cycle.y < (cycle.height / 2)) || 
        (cycle.y > canvas.height - (cycle.height / 2)) || 
        (cycle.history.indexOf(this.generateCoords(cycle)) >= 0) || 
        (opponent.history.indexOf(this.generateCoords(cycle)) >= 0)) {
      return true;
    }
  },
  
  p1isCollision: function(x,y) {
    coords = x + ',' + y;
    if (x < (player2.width / 2) || 
        x > canvas.width - (player2.width / 2) || 
        y < (player2.height / 2) || 
        y > canvas.height - (player2.height / 2) || 
        player2.history.indexOf(coords) >= 0 || 
        player1.history.indexOf(coords) >= 0) {
      return true;
    }    
  },

  p2isCollision: function(x,y) {
    coords = x + ',' + y;
    if (x < (payer1.width / 2) || 
        x > canvas.width - (player1.width / 2) || 
        y < (player1.height / 2) || 
        y > canvas.height - (player1.height / 2) || 
        player1.history.indexOf(coords) >= 0 || 
        player2.history.indexOf(coords) >= 0) {
      return true;
    }    
  },
  
  generateCoords: function(cycle) {
    return cycle.x + "," + cycle.y;
  },
  
  draw: function(cycle) {
    context.fillStyle = cycle.color;
    context.beginPath();
    context.moveTo(cycle.x - (cycle.width / 2), cycle.y - (cycle.height / 2));
    context.lineTo(cycle.x + (cycle.width / 2), cycle.y - (cycle.height / 2));
    context.lineTo(cycle.x + (cycle.width / 2), cycle.y + (cycle.height / 2));
    context.lineTo(cycle.x - (cycle.width / 2), cycle.y + (cycle.height / 2));
    context.closePath();
    context.fill();
  }
  
};

p1inverseDirection = function() {
  switch(player1.current_direction) {
    case 'up':
      return 'down';
      break;
    case 'down':
      return 'up';
      break;
    case 'right':
      return 'left';
      break;
    case 'left':
      return 'right';
      break;
  }
};

p2inverseDirection = function() {
  switch(player2.current_direction) {
    case 'up':
      return 'down';
      break;
    case 'down':
      return 'up';
      break;
    case 'right':
      return 'left';
      break;
    case 'left':
      return 'right';
      break;
  }
};

Object.prototype.getKey = function(value){
  for(var key in this){
    if(this[key] instanceof Array && this[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
};

addEventListener("keydown", function (e) {
    p1lastKey = p1keys.getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(p1lastKey) >= 0  && p1lastKey != p1inverseDirection()) {
      player1.current_direction = p1lastKey;
    } else if (['start_game'].indexOf(p1lastKey) >= 0  && game.over) {
      game.start();
    }
}, false);

addEventListener("keydown", function (e) {
    p2lastKey = p2keys.getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(p2lastKey) >= 0  && p2lastKey != p2inverseDirection()) {
      player2.current_direction = p2lastKey;
    } else if (['start_game'].indexOf(p2lastKey) >= 0  && game.over) {
      game.start();
    }
}, false);

loop = function() {
  if (game.over === false) {
    cycle.move(player1, player2);
    cycle.move(player2, player1);
    cycle.draw(player1);
    cycle.draw(player2);
  }
};

main = function() {
  game.start();
  setInterval(loop, 100);  
}();