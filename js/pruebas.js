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
    game.load.spritesheet("dude", "./assets/dude.png", 32, 48);
    game.load.spritesheet("boy", "./assets/player.png", 23, 34);

}

var skin = localStorage.getItem("player") == null ? 'dude' : localStorage.getItem("player");

var player;
var ground;
var cursors;

var stars;
var pipe;

var score = 0;
var scoreText;
var maxScore;

var gameOver;

function create() {

    maxScore = localStorage.getItem("maxScore")==null ? 0 : localStorage.getItem("maxScore");

    gameOver = null;
    game.time.events.start();

    // FISICAS DEL JUEGO
    game.physics.startSystem(Phaser.Physics.Arcade);


    // BACKGROUND
    game.stage.backgroundColor = "#87CEEB";


    // SUELO
    ground = game.add.group();
    ground.enableBody = true;

    var suelo = ground.create(0, alto -32, 'ground');

    suelo.scale.setTo(5,1); // 4. se repite x 4 veces --- 1. No se repite
    suelo.body.immovable = true; //No se puede mover


    // JUGADOR
    player = game.add.sprite(ancho*0.2, alto-80, skin);

    // ACTIVA FISICAS PARA EL JUGADOR
    game.physics.arcade.enable(player);

    // PROPIEDADES FISICAS DEL JUGADOR

    //player.body.immovable = true;
    player.body.bounce.y = 0; // REBOTE Y
    player.body.bounce.x = 0; // REBOTE X
    player.body.gravity.y = 1000; // ALTURA DE SALTO
    //player.body.collideWorldBounds = true; // REBOTE CONTRA BORDES

    // ANIMACIONES JUGADOR
    // name, frames, frameRate, loop
    //player.animations.add('left', [0,1,2,3], 10, true);
    player.animations.add('right', [5,6,7,8], 10, true);
    //player.animations.start('right');


    // ESTRELLAS
    stars = game.add.group();
    stars.enableBody = true;

    game.time.events.loop(1500, createStars);
    createStars();


    // TUBERIAS
    pipe = game.add.group();
    pipe.enableBody = true;

    game.time.events.loop(3000, createPipe);
    createPipe();


    // TEXTO
    maxScore = parseInt(maxScore);
    scoreText = game.add.text(16, 10, 'Score: ' + score + '\nBest: ' + maxScore, {
        fontSize : '16px', fill : '#000'
    });


    game.input.onDown.add(function(){
        if(player.body.touching.down)
            player.body.velocity.y = -550;

        if(gameOver != null)
            game.state.restart(true, true);
    });

}

function upload() {

    game.physics.arcade.collide(player, ground);

    game.physics.arcade.collide(player, pipe, finish, null, this);
    game.physics.arcade.overlap(player, stars, addPoints, null, this);

    player.animations.play('right');

    if(gameOver == null){
        score += 0.25;

        if(score % 2 == 1)
        scoreText.text = 'Score: ' + score + '\nBest: ' + maxScore;
    }


    /*
    if(player.x <= 0)
        finish();
    */

}

function addPoints(player, star){
    star.kill();
    score += 10;
}


function createStars() {

    var starY = Math.random()*(200 - 65) + 65;
    star = stars.create(ancho * 0.9, alto - starY, 'star');
    star.body.velocity.x = -250;
    //star.immovable = true;

}

function createPipe() {

    var pipeY = Math.random()*(120 - 65) + 65;
    tubo = pipe.create(ancho, alto - pipeY, 'pipe');
    tubo.body.velocity.x = -1*(150 + score*0.5);

}

function finish(){

    game.time.events.stop();

    gameOver = game.add.text(ancho/2 -64, alto /2 - 64, 'Game Over', {
        fontSize : '64px', fill : '#000', fontStyle : 'bold'
    });
    game.add.text(ancho/2 - 100, alto /2, 'Click volver a jugar', {
        fontSize : '64px', fill : '#000', fontStyle : 'bold'
    });

    localStorage.setItem("maxScore",Math.max(score,maxScore));
    score = 0;

    player.kill();
}


var states = {preload : preload, create: create, update: upload};

game = new Phaser.Game(ancho, alto, Phaser.AUTO, 'START', states);

})();

$(".nav li").on('click', function() {

    if($(this).text() == "Player1")
        localStorage.setItem("player", "dude");
    else
        localStorage.setItem("player", "boy");

    game.state.restart(true, true);
});
