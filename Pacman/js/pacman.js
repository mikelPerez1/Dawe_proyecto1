// >=test1
// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

window.onload = function init() {
  var game = new GF();

  game.start();
};

// >=test1
// GAME FRAMEWORK
var GF = function () {
  // >=test2
  // variables para contar frames/s, usadas por measureFPS
  var frameCount = 0;
  var lastTime;
  var fpsContainer;
  var fps;
  var mov;
  // >=test4
  //  variable global temporalmente para poder testear el ejercicio
  inputStates = {};

  // >=test10
  const TILE_WIDTH = 24,
    TILE_HEIGHT = 24;
  var numGhosts = 4;
  var ghostcolor = {};
  ghostcolor[0] = "rgba(255, 0, 0, 255)";
  ghostcolor[1] = "rgba(255, 128, 255, 255)";
  ghostcolor[2] = "rgba(128, 255, 255, 255)";
  ghostcolor[3] = "rgba(255, 128, 0,   255)";
  ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
  ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost

  // >=test10
  // hold ghost objects
  var ghosts = {};

  // >=test10
  var Ghost = function (id, ctx) {
    this.x = 0;
    this.y = 0;
    this.velX = 0;
    this.velY = 0;
    this.speed = 1;

    this.nearestRow = 0;
    this.nearestCol = 0;

    this.ctx = ctx;

    this.id = id;
    this.homeX = 0;
    this.homeY = 0;

    this.draw = function () {
      // test10
      // Tu código aquí
      // Pintar cuerpo de fantasma
      // Pintar ojos
      // test12
      // Tu código aquí
      // Asegúrate de pintar el fantasma de un color u otro dependiendo del estado del fantasma y de thisGame.ghostTimer
      // siguiendo el enunciado
      // test13
      // Tu código aquí
      // El cuerpo del fantasma sólo debe dibujarse cuando el estado del mismo es distinto a Ghost.SPECTACLES
    }; // draw

    this.move = function () {
      // test10
      // Tu código aquí
      // test13
      // Tu código aquí
      // Si el estado del fantasma es Ghost.SPECTACLES
      // Mover el fantasma lo más recto posible hacia la casilla de salida
    };
  }; // fin clase Ghost

  // >=test12
  // static variables
  Ghost.NORMAL = 1;
  Ghost.VULNERABLE = 2;
  Ghost.SPECTACLES = 3;

  // >=test5
  var Level = function (ctx) {
    this.ctx = ctx;
    this.lvlWidth = 0;
    this.lvlHeight = 0;

    this.map = [];
    //var map = [];
    var level = this;
    this.pellets = 0;
    this.powerPelletBlinkTimer = 0;

    this.setMapTile = function (row, col, newValue) {
      // test5
      // Tu código aquí
      level = this;
      thisLevel.map[col].push(newValue);
    };

    this.getMapTile = function (row, col) {
      // test5
      // Tu código aquí

      return thisLevel.map[row][col];
    };

    this.printMap = function () {
      // test5
      // Tu código aquí
      let numeros2 = "";
      for (var j = 0; j < thisLevel.map.length / 2; j++) {
        for (var i = 0; i < thisLevel.map[j].length; i++) {
          numeros2 += level.getMapTile(j, i);
          numeros2 += " ";
        }
        console.log(numeros2);
        numeros2 = "";
      }
    };

    this.loadLevel = function () {
      // test5
      // Tu código aquí
      // leer res/levels/1.txt y guardarlo en el atributo map
      // haciendo uso de setMapTile
      var url = "https://raw.githubusercontent.com/AinhoY/froga/main/1.txt";

      var consulta = new XMLHttpRequest();
      consulta.open("GET", url);

      consulta.onload = function () {
        if (consulta.status == 200) {
          var respuesta = consulta.responseText;

          var datos = respuesta.split("\n");

          var width = datos[0].split(" ")[2];
          var height = datos[1].split(" ")[2];
          thisLevel.lvlHeight=height;
          thisLevel.lvlWidth=width;
          for (var k = 0; k < height; k++) {
            thisLevel.map[k] = new Array();
          }
          for (var j = 0; j < height; j++) {
            var values = datos[j + 4].split(" ");
            thisLevel.map.push(j);

            for (var i = 0; i < width; i++) {
              var valor = parseInt(values[i]);
              if (valor == 4) {
                player.homex = i;
                player.homey = j;
                console.log("empiece " + j + " " + i);
              }
              if (valor == 2) {
                thisLevel.pellets = thisLevel.pellets + 1;
              }
              level.setMapTile(i, j, valor);
            }
          }

          //level.printMap();
        }
        //level.drawMap();
        //player.draw(player.x,player.y);
      };
      consulta.send();

      // test10
      // Tu código aquí
    };

    // >=test6
    this.drawMap = function () {
      var TILE_WIDTH = thisGame.TILE_WIDTH;
      var TILE_HEIGHT = thisGame.TILE_HEIGHT;
      this.powerPelletBlinkTimer += 1;

      var tileID = {
        "door-h": 20,
        "door-v": 21,
        "pellet-power": 3,
      };

      // test6
      // Tu código aquí
      try {
        for (var i = 0; i <= thisGame.screenTileSize[1]; i++) {
          for (var j = 0; j <= thisGame.screenTileSize[0]; j++) {
            var valor = this.getMapTile(j, i);

            if (valor >= 100) {
              ctx.beginPath();
              ctx.moveTo(i * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.lineTo((i + 1) * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.lineTo((i + 1) * TILE_WIDTH, (j + 1) * TILE_HEIGHT);
              ctx.lineTo(i * TILE_WIDTH, (j + 1) * TILE_HEIGHT);
              ctx.lineTo(i * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.closePath();
              ctx.fillStyle = "Blue";
              ctx.fill();
            } else if (valor == 3 && this.powerPelletBlinkTimer < 30) {
              ctx.beginPath();
              ctx.moveTo(i * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.lineTo((i + 1) * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.lineTo((i + 1) * TILE_WIDTH, (j + 1) * TILE_HEIGHT);
              ctx.lineTo(i * TILE_WIDTH, (j + 1) * TILE_HEIGHT);
              ctx.lineTo(i * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.closePath();
              ctx.fillStyle = "Black";
              ctx.fill();
              ctx.beginPath();
              ctx.arc(
                i * TILE_WIDTH + TILE_WIDTH / 2,
                j * TILE_HEIGHT + TILE_HEIGHT / 2,
                5,
                0,
                2 * Math.PI,
                false
              );
              ctx.fillStyle = "Red";
              ctx.fill();
            } else if (valor == 2) {
              ctx.beginPath();
              ctx.moveTo(i * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.lineTo((i + 1) * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.lineTo((i + 1) * TILE_WIDTH, (j + 1) * TILE_HEIGHT);
              ctx.lineTo(i * TILE_WIDTH, (j + 1) * TILE_HEIGHT);
              ctx.lineTo(i * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.closePath();
              ctx.fillStyle = "Black";
              ctx.fill();
              ctx.beginPath();
              ctx.arc(
                i * TILE_WIDTH + TILE_WIDTH / 2,
                j * TILE_HEIGHT + TILE_HEIGHT / 2,
                5,
                0,
                2 * Math.PI,
                false
              );
              ctx.fillStyle = "White";
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.moveTo(i * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.lineTo((i + 1) * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.lineTo((i + 1) * TILE_WIDTH, (j + 1) * TILE_HEIGHT);
              ctx.lineTo(i * TILE_WIDTH, (j + 1) * TILE_HEIGHT);
              ctx.lineTo(i * TILE_WIDTH, j * TILE_HEIGHT);
              ctx.closePath();
              ctx.fillStyle = "Black";
              ctx.fill();
            }
          }
        }
        if (this.powerPelletBlinkTimer == 60) {
          this.powerPelletBlinkTimer = 0;
        }
      } catch (e) {}
    };

    // >=test7
    this.isWall = function (row, col) {
      // test7
      // Tu código aquí
      if (this.getMapTile(col, row) > 99) {
        return true;
      } else {
        return false;
      }
    };

    // >=test7
    this.checkIfHitWall = function (
      possiblePlayerX,
      possiblePlayerY,
      row,
      col
    ) {
      // test7
      // Tu código aquí
      // Determinar si el jugador va a moverse a una fila,columna que tiene pared
      // Hacer uso de isWall

      c1 = Math.floor(possiblePlayerX / thisGame.TILE_WIDTH);
      c2 = Math.ceil(possiblePlayerX / thisGame.TILE_WIDTH);
      r1 = Math.floor(possiblePlayerY / thisGame.TILE_HEIGHT);
      r2 = Math.ceil(possiblePlayerY / thisGame.TILE_HEIGHT);
      cols = [c1];
      rows = [r1];

      if (c1 != c2) {
        cols.push(c2);
      }
      if (r1 != r2) {
        rows.push(r2);
      }

      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        for (var j = 0; j < cols.length; j++) {
          var c = cols[j];
          if (this.isWall(c, r)) {
            return true;
          }
        }
      }

      return false;
    };

    // >=test11
    this.checkIfHit = function (playerX, playerY, x, y, holgura) {
      // Test11
      // Tu código aquí
    };

    // >=test8
    this.checkIfHitSomething = function (playerX, playerY, row, col) {
      var tileID = {
        "door-h": 20,
        "door-v": 21,
        "pellet-power": 3,
        pellet: 2,
      };

      // test8
      // Tu código aquí
      // Gestiona la recogida de píldoras
      try {
        if (this.getMapTile(col, row) == 2) {
          level.map[col][row] = 0;
          thisLevel.pellets = thisLevel.pellets - 1;
          if (thisLevel.pellets == 0) {
            console.log("has ganado");
          }
        } else if (this.getMapTile(col, row) == 20) {
          player.x = (this.lvlWidth - 2) * thisGame.TILE_WIDTH;
          if (player.velX < 0) {
            player.x = (this.lvlWidth - 2) * thisGame.TILE_WIDTH;
          } else {
            player.x = thisGame.TILE_WIDTH;
          }
        } else if (this.getMapTile(col, row) == 21) {
          //player.y = (this.lvlHeight - 2) * thisGame.TILE_HEIGHT;
          if (player.velY < 0) {
            player.y = (this.lvlHeight - 2) * thisGame.TILE_HEIGHT;
          } else {
            player.y = thisGame.TILE_HEIGHT;
          }
        }
      } catch (e) {
        console.log(e);
      }

      // test9
      // Tu código aquí
      // Gestiona las puertas teletransportadoras

      // test12
      // Tu código aquí
      // Gestiona la recogida de píldoras de poder
      // (cambia el estado de los fantasmas)
    };
  }; // end Level

  // >=test2
  var Pacman = function () {
    this.radius = 10;
    this.x = 0;
    this.y = 0;
    this.speed = 1 ;
    this.angle1 = 0.25;
    this.angle2 = 1.75;
    this.homex = 0;
    this.homey = 0;
    this.reiniciado = false;
    this.nearestRow = 0;
    this.nearestCol = 0;
  };

  // >=test3
  //bol es un booleano k utilizo en el test 3
  //var bol=true;

  Pacman.prototype.move = function () {
    // test3 / test4 / test7
    // Tu código aquí
    //test3
    /*
		if(pacman.posX > (w-pacman.radius)){
			bol=false;
		}
		if(pacman.posX < (0+pacman.radius)){
			bol=true;
		}
		if(bol){
		pacman.posX=pacman.posX+pacman.speed;
		}
		else{
		pacman.posX=pacman.posX-pacman.speed;
		}
		*/

    //test 4
    var r = Math.ceil(player.x / 24);
    var c = Math.ceil(player.y / 24);
    player.nearestRow = r;
    player.nearestCol = c;
    try{
    if(!thisLevel.checkIfHitWall(player.x+ player.velX, player.y+player.velY,player.nearestRow,player.nearestCol)){
     
      player.x=player.x+player.velX;
      player.y=player.y+player.velY;
    


    }
    else{
      player.velX=0;
      player.velY=0;
      
    }
  }
  catch(e){
    console.log(e);
  }

    //player.draw(player.x,player.y);

    //pacman.draw(pacman.posX,pacman.posY);

    ///////////////

    // >=test8: introduce esta instrucción
    // dentro del código implementado en el test7:
    // tras actualizar this.x  y  this.y...
    // check for collisions with other tiles (pellets, etc)

    thisLevel.checkIfHitSomething(
      this.x,
      this.y,
      this.nearestRow,
      this.nearestCol
    );

    // test11
    // Tu código aquí
    // check for collisions with the ghosts

    // test13
    // Tu código aquí
    // Si chocamos contra un fantasma y su estado es Ghost.VULNERABLE
    // cambiar velocidad del fantasma y pasarlo a modo Ghost.SPECTACLES

    // test14
    // Tu código aquí.
    // Si chocamos contra un fantasma cuando éste esta en estado Ghost.NORMAL --> cambiar el modo de juego a HIT_GHOST
  };

  // >=test2
  // Función para pintar el Pacman
  // En el test2 se llama drawPacman(x, y) {
  Pacman.prototype.draw = function (x, y) {
    // Pac Man
    // test2
    // Tu código aquí
    // ojo: en el test2 esta función se llama drawPacman(x,y))
    /*
		ctx.beginPath();
ctx.arc(x+pacman.radius, y+pacman.radius, pacman.radius, pacman.angle1 * Math.PI, (1+pacman.angle1) * Math.PI, false);
ctx.fillStyle = "Yellow";
ctx.fill();
ctx.beginPath();
ctx.arc(x+pacman.radius, y+pacman.radius, pacman.radius, (1-pacman.angle1) * Math.PI, pacman.angle2 * Math.PI, false);
ctx.fill();

***test 2 pero con la variable pacman cambiada a player:
*/
    ctx.beginPath();
    ctx.arc(
      x + player.radius,
      y + player.radius,
      player.radius,
      player.angle1 * Math.PI,
      (1 + player.angle1) * Math.PI,
      false
    );
    ctx.fillStyle = "Yellow";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      x + player.radius,
      y + player.radius,
      player.radius,
      (1 - player.angle1) * Math.PI,
      player.angle2 * Math.PI,
      false
    );
    ctx.fill();
  };

  // >=test5
  var player = new Pacman();

  // >=test10
  for (var i = 0; i < numGhosts; i++) {
    ghosts[i] = new Ghost(i, canvas.getContext("2d"));
  }

  // >=test5
  var thisGame = {
    getLevelNum: function () {
      return 0;
    },

    // >=test14
    setMode: function (mode) {
      this.mode = mode;
      this.modeTimer = 0;
    },

    // >=test6
    screenTileSize: [24, 21],

    // >=test5
    TILE_WIDTH: 24,
    TILE_HEIGHT: 24,

    // >=test12
    ghostTimer: 0,

    // >=test14
    NORMAL: 1,
    HIT_GHOST: 2,
    GAME_OVER: 3,
    WAIT_TO_START: 4,
    modeTimer: 0,
  };

  // >=test5
  var thisLevel = new Level(canvas.getContext("2d"));
  thisLevel.loadLevel(thisGame.getLevelNum());
  // thisLevel.printMap();

  // >=test2
  var measureFPS = function (newTime) {
    // la primera ejecución tiene una condición especial

    if (lastTime === undefined) {
      lastTime = newTime;
      return;
    }

    // calcular el delta entre el frame actual y el anterior
    var diffTime = newTime - lastTime;

    if (diffTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = newTime;
    }

    // mostrar los FPS en una capa del documento
    // que hemos construído en la función start()

    fpsContainer.innerHTML = "FPS: " + fps;
    fpsContainer.style.color = "Red";
    frameCount++;
  };

  // >=test3
  // clears the canvas content
  var clearCanvas = function () {
    ctx.clearRect(0, 0, w, h);
  };

  // >=test4
  var checkInputs = function () {
    // test4
    // Tu código aquí (reestructúralo para el test7)
    try{
      if (inputStates.right == true) {
        if (!thisLevel.checkIfHitWall(player.x + player.speed, player.y,player.nearestRow,player.nearestCol) && player.x<(w-player.radius*2)) {
          player.velX = player.speed;
          player.velY = 0;
          inputStates.left=false;
          if(inputStates.up){
          inputStates.down=false;
          }
          else if(inputStates.down){
          inputStates.up=false;
          }else {inputStates.down=false;}
          
        }
      }
      if (inputStates.left == true) {
        if (!thisLevel.checkIfHitWall(player.x - player.speed, player.y,player.nearestRow,player.nearestCol) && player.x>0) {
          player.velX = -player.speed;
          player.velY = 0;
          inputStates.right=false;
          if(inputStates.up){
            inputStates.down=false;
            }
            else if(inputStates.down){
            inputStates.up=false;
            }else {inputStates.down=false;}
        }
      }
      if (inputStates.up == true) {
        if (!thisLevel.checkIfHitWall(player.x, player.y-player.speed,player.nearestRow,player.nearestCol) && player.y>0) {
          player.velX = 0;
          player.velY = -player.speed;
          inputStates.down=false;
          if(inputStates.right){
            inputStates.left=false;
            }
            else if(inputStates.left){
            inputStates.right=false;
            }else {inputStates.left=false;}
        }
      }
      if (inputStates.down == true) {
        if (!thisLevel.checkIfHitWall(player.x, player.y+player.speed,player.nearestRow,player.nearestCol) && player.y<(h-player.radius*2)) {
          player.velX = 0;
          player.velY = player.speed;
          inputStates.up=false;
          if(inputStates.right){
            inputStates.left=false;
            }
            else if(inputStates.left){
            inputStates.right=false;
            }else {inputStates.left=false;}
        }
      }
    }catch(e){
  
    }
    // test7
    // Tu código aquí
    // LEE bien el enunciado, especialmente la nota de ATENCION que
    // se muestra tras el test 7
  };

  // >=test12
  var updateTimers = function () {
    // test12
    // Tu código aquí
    // Actualizar thisGame.ghostTimer (y el estado de los fantasmas, tal y como se especifica en el enunciado)
    // test14
    // Tu código aquí
    // actualiza modeTimer...
  };

  // >=test1
  var mainLoop = function (time) {
    // test1
    // Tu codigo aquí (solo tu código y la instrucción requestAnimationFrame(mainLoop);)
    // A partir del test2 deberás borrar lo implementado en el test1

    measureFPS(time);
    // Función Main, llamada en cada frame
    //requestAnimationFrame(mainLoop);
    // >=test2
    // main function, called each frame

    // test14
    // Tu código aquí
    // sólo en modo NORMAL

    // >=test4
    checkInputs();

    // test10
    // Tu código aquí
    // Mover fantasmas

    // >=test3
    //ojo: en el test3 esta instrucción es pacman.move()
    player.move();

    if (!player.reiniciado) {
      if (player.homex != 0 && player.homey != 0) {
        player.x = player.homex * 24;
        player.y = player.homey * 24;
        player.reiniciado = true;
      }
    }
    // test14
    // Tu código aquí
    // en modo HIT_GHOST
    // seguir el enunciado...

    // test14
    // Tu código aquí
    // en modo WAIT_TO_START
    // seguir el enunciado...

    // >=test2
    // Clear the canvas
    clearCanvas();

    // >=test6
    thisLevel.drawMap();

    // test10
    // Tu código aquí
    // Pintar fantasmas

    // >=test3
    //ojo: en el test3 esta instrucción es pacman.draw()
    player.draw(player.x, player.y);

    // >=test12
    updateTimers();

    // call the animation loop every 1/60th of second
    // comentar esta instrucción en el test3
    requestAnimationFrame(mainLoop);

    var start = function () {
      requestAnimationFrame(mainLoop);
    };
    // Nuestro GameFramework sólo muestra una función pública al exterior (el mé
    return {
      start: start,
    };
  };

  // >=test4
  var addListeners = function () {
    // add the listener to the main, window object, and update the states
    // test4
    // Tu código aquí

    document.addEventListener(
      "keydown",
      (event) => {
        var name = event.key;

        var code = event.code;

        // Alert the key name and key code on keydown
        /*switch (name){
				case "ArrowRight":
					mov="right";
					console.log(code);
					inputStates.right=true;
					inputStates.left=false;
					inputStates.up=false;
					inputStates.down=false;
				case "ArrowLeft":
					mov="left";
					inputStates.right=false;
					inputStates.left=true;
					inputStates.up=false;
					inputStates.down=false;
				case "ArrowUp":
					mov="up";
					inputStates.right=false;
					inputStates.left=false;
					inputStates.up=true;
					inputStates.down=false;
				case "ArrowDown":
					mov="down";
					inputStates.right=false;
					inputStates.left=false;
					inputStates.up=false;
					inputStates.down=true;
				
			}*/
      inputStates.right=false;
      inputStates.left = false;
      inputStates.down=false;
      inputStates.up=false;


        if (name == "ArrowRight") {
          mov = "right";
          inputStates.right = true;
          inputStates.left = false;
            
        }
        if (name == "ArrowLeft") {
          mov = "left";
          inputStates.left = true;
          inputStates.right = false;

        }
        if (name == "ArrowUp") {
          mov = "up";
          inputStates.up = true;
          inputStates.down=false;
        }
        if (name == "ArrowDown") {
          mov = "down";
          inputStates.down = true;
          inputStates.up=false;
        }
      },
      false
    );
  };

  //>=test7
  var reset = function () {
    // test12
    // Tu código aquí
    // probablemente necesites inicializar los atributos de los fantasmas
    // (x,y,velX,velY,state, speed)

    // test7
    // Tu código aquí
    // Inicialmente Pacman debe empezar a moverse en horizontal hacia la derecha, con una velocidad igual a su atributo speed
    // inicializa la posición inicial de Pacman tal y como indica el enunciado
    var bol = false;
    var r;
    var c;

    player.x = player.homex * 24;
    player.y = player.homey * 24;

    /*
		for (var i=0;i<thisLevel.map.length;i++){
			for(var j=0;j<thisLevel.map[i].length;j++){
				if(thisLevel.getMapTile(i,j)==4){
					r=i;
					c=j;
					console.log(i+" "+j);
					break;
				}
			}
		}
		*/
    // test10
    // Tu código aquí
    // Inicializa los atributos x,y, velX, velY, speed de la clase Ghost de forma conveniente

    // >=test14
    thisGame.setMode(thisGame.NORMAL);
  };

  // >=test1
  var start = function () {
    // >=test2
    // adds a div for displaying the fps value
    fpsContainer = document.createElement("div");
    document.body.appendChild(fpsContainer);

    // >=test4
    addListeners();

    // >=test7
    reset();

    // start the animation
    requestAnimationFrame(mainLoop);
  };

  // >=test1
  //our GameFramework returns a public API visible from outside its scope
  return {
    start: start,

    // solo para el test 10
    ghost: Ghost, // exportando Ghost para poder probarla

    // solo para estos test: test12 y test13
    ghosts: ghosts,

    // solo para el test12
    thisLevel: thisLevel,

    // solo para el test 13
    //Ghost: Ghost

    // solo para el test14
    //thisGame: thisGame
  };
};

// >=test1
var game = new GF();
game.start();

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
