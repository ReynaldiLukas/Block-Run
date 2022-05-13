class Result extends Phaser.Scene {

    constructor() {
        super('ResultScene');
    }



    create() {
        this.makeGround(0);
        this.background = this.add.image(width / 2, height / 2, "bg");
        this.background.setDepth(0);

        this.score = this.add.image(width / 2, (height / 2) - 500, "score");
        this.score.setDepth(3);

        this.scoreText = this.add.text(width / 2 - 10, (height / 2) - 500, score, { fill: "#535353", font: '900 35px Courier', resolution: 5 }),
            this.restartButton = this.add.image((width / 2) - 55, ((height / 2) + 70) - 500, "playAgain").setInteractive(),
            this.homeButton = this.add.image((width / 2) + 55, ((height / 2) + 70) - 500, "home").setInteractive(),
            this.homeButton.scale = 0.3;

        this.scoreText.setDepth(3);
        this.restartButton.setDepth(3);
        this.homeButton.setDepth(3);

        this.restartButton.on('pointerdown', () => {
            this.restartButton.scale = 0.9;
        })
        this.restartButton.on('pointerup', () => {
            this.restartButton.scale = 1;
            this.outro1();
        })

        this.homeButton.on('pointerdown', () => {
            this.homeButton.scale = 0.25;
        })
        this.homeButton.on('pointerup', () => {
            this.homeButton.scale = 0.3;
            this.outro2();
        })


        this.intro();

    }
    makeGround(start) {
        for (let j = 0; j <= 2; j++) {
            for (let i = 1; i <= 10; i++) {
                this.ground = this.physics.add.image(start + (i * 50 - 25), (height - (j * 50)) - 25, "dirt");//tanah
                this.ground.setDepth(2);
                this.ground = this.physics.add.image(start + (i * 50 - 25), ((j * 50)) + 25, "dirt");//atap
                this.ground.setDepth(2);
            }
        }
    }
    intro() {
        this.tweens.add({
            targets: this.score,
            y: height / 2,
            duration: 500
        });
        this.tweens.add({
            targets: this.scoreText,
            y: height / 2,
            duration: 500,
        });
        this.tweens.add({
            targets: this.homeButton,
            y: (height / 2) + 70,
            duration: 500
        });
        this.tweens.add({
            targets: this.restartButton,
            y: (height / 2) + 70,
            duration: 500,
        });
    }

    outro1() {
        this.tweens.add({
            targets: this.score,
            y: -300,
            duration: 600
        });
        this.tweens.add({
            targets: this.scoreText,
            y: -300,
            duration: 600,
        });
        this.tweens.add({
            targets: this.homeButton,
            y: -300,
            duration: 600
        });
        this.tweens.add({
            targets: this.restartButton,
            y: -300,
            duration: 600,
            onComplete: () => {
                this.scene.start("GameScene");
            }
        });
    }

    outro2() {
        this.tweens.add({
            targets: this.score,
            y: -300,
            duration: 600
        });
        this.tweens.add({
            targets: this.scoreText,
            y: -300,
            duration: 600,
        });
        this.tweens.add({
            targets: this.homeButton,
            y: -300,
            duration: 600
        });
        this.tweens.add({
            targets: this.restartButton,
            y: -300,
            duration: 600,
            onComplete: () => {
                this.scene.start("HomeScene");
            }
        });
    }
}