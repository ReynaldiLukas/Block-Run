class Preload extends Phaser.Scene {

    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('dirt', 'Assets/dirt.jpg');
        this.load.image('bg', 'Assets/background.jpg');
        this.load.image('player', 'Assets/char.jpg');
        this.load.image('empty', 'Assets/empty.png');
        this.load.image('block', 'Assets/block.png');
        this.load.image('obs', 'Assets/obstacle.jpg');
        this.load.image('empty', 'Assets/empty.png');
        this.load.image('home', 'Assets/Home.png');
        this.load.image('playAgain', 'Assets/playAgain.png');
        this.load.image('score', 'Assets/score.png');
        this.load.image('title', 'Assets/title.png');
        this.load.image('play', 'Assets/play.png');
        this.load.image('checkpoint', 'Assets/checkpoint.png');
        this.load.image('dummyPlayer', 'Assets/charDed.jpg');
        this.load.audio('music', 'Assets/music.mp3');
        this.load.audio('bump', 'Assets/bump.mp3');
        this.load.image('smoke', 'Assets/smoke.png');
        this.load.image('bullet', 'Assets/bullet2.png');
        this.load.audio('bullet', 'Assets/cannon.mp3');
        this.load.audio('block', 'Assets/block.mp3');
        this.load.audio('perfect', 'Assets/perfect.mp3');
        this.load.audio('fall', 'Assets/fall.mp3');
        this.load.spritesheet('arrow', 'Assets/arrow3.png', { frameWidth: 50, frameHeight: 50 });
    }

    create() {
        this.scene.start('HomeScene');
    }
}
