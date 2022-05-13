const config = {
    type: Phaser.AUTO,
    width: 500,
    height: 700,
    pixelArt: true,

    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [Preload, Home, Game, Result]
};
new Phaser.Game(config);
var height = config.height;
var width = config.width;
var score;
var isPlayed = false;
   //https://arifz.medium.com/phaser-3-tricks-make-circle-image-2b8e0de609de