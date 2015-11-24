(function () {

// CREACION DEL JUEGO, MEDIDAS Y METODOS

var ancho = $(window).width() >= 320 ? $(window).width() - 100 : 320;
var alto = $(window).height() >= 240 ? $(window).height() - 100 : 240;

var game;

// FIN DE CREACION DEL JUEGO


function preload() {

    game.load.image("star", "./assets/star.png");
    game.load.image("pipe", "./assets/pipe.png");
    game.load.image("ground", "./assets/platform.png");
    game.load.spritesheet("boy", "./assets/aereo.png", 42.5, 49);

}

var skin = localStorage.getItem("player") == null ? 'dude' : localStorage.getItem("player");

var player;
var ground;
var cursors;

var stars;
var pipe;
var tubo;
    
var score = 0;
var scoreText;
var maxScore;

function create() {

    maxScore = localStorage.getItem("maxScore")==null ? 0 : localStorage.getItem("maxScore");

    gameOver = null;
    game.time.events.start();

    // FISICAS DEL JUEGO
    game.physics.startSystem(Phaser.Physics.Arcade);


    // BACKGROUND
    game.stage.backgroundColor = "#66FF00";


    // SUELO
    ground = game.add.group();
    ground.enableBody = true;

    var suelo = ground.create(0, alto/2 -32, 'ground');

    suelo.scale.setTo(5,1); // 4. se repite x 4 veces --- 1. No se repite
    suelo.body.immovable = true; //No se puede mover


    // JUGADOR
    player = game.add.sprite(ancho/2 - 24, alto/2 +25, skin);

    // ACTIVA FISICAS PARA EL JUGADOR
    game.physics.arcade.enable(player);

    // PROPIEDADES FISICAS DEL JUGADOR

    player.body.immovable = true;
    player.body.bounce.y = 0; // REBOTE Y
    player.body.bounce.x = 0; // REBOTE X
    player.body.gravity.y = 0; // ALTURA DE SALTO
    //player.body.collideWorldBounds = true; // REBOTE CONTRA BORDES

    // ANIMACIONES JUGADOR
    // name, frames, frameRate, loop
    player.animations.add('right', [18,19,20,21,22,23], 10, true);
    player.animations.add('left', [18,19,20,21,22,23], 10, true);
    player.animations.add('up', [30,31,32,33,34,35], 10, true);
    player.animations.add('down', [6,7,8,9,10,11], 10, true);
    player.animations.add('right-down', [12,13,14,15,16,17], 10, true);
    player.animations.add('right-up', [24,25,26,27,28,29], 10, true);
    //player.animations.start('right');


    // TEXTO
    maxScore = parseInt(maxScore);
    scoreText = game.add.text(16, 10, 'Score: ' + score + '\nBest: ' + maxScore, {
        fontSize : '16px', fill : '#000'
    });
    
    pipe = game.add.group();
    pipe.enableBody = true;
    tubo = pipe.create(ancho, 100, 'pipe');

   
    cursors = game.input.keyboard.createCursorKeys();


}

function upload() {

    game.physics.arcade.collide(player, ground);
    game.physics.arcade.collide(player, pipe);

    
    if(
        cursors.up.isUp &&
        cursors.down.isUp &&
        cursors.right.isUp &&
        cursors.left.isUp
      )
        player.animations.frame = 0;
    
    
    player.body.velocity.y = 0;
    player.body.velocity.x = 0;
    tubo.body.velocity.x = 0;
    tubo.body.velocity.y = 0;
    
    if(cursors.up.isDown){
        player.animations.play('up');
        //player.body.velocity.y = -150;
        tubo.body.velocity.y = 150;
    }

    if(cursors.down.isDown){
        player.animations.play('down');
        //player.body.velocity.y = 150;
        tubo.body.velocity.y = -150;
    }

    if(cursors.left.isDown){
        //player.body.velocity.x = -150;        
        tubo.body.velocity.x = 150;        
    }

    if(cursors.right.isDown){
        player.animations.play('right');
        //player.body.velocity.x = 150;        
        tubo.body.velocity.x = -150;        
    }
    
    
    if(cursors.right.isDown && cursors.up.isDown)
        player.animations.play('right-up');
    
    if(cursors.right.isDown && cursors.down.isDown)
        player.animations.play('right-down');


}

var states = {preload : preload, create: create, update: upload};

game = new Phaser.Game(ancho, alto, Phaser.AUTO, 'START', states);

})();

