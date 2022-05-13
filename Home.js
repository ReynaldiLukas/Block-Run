class Home extends Phaser.Scene {

  constructor() {
    super('HomeScene');
  }

  create() {

    if (isPlayed == false) {//supaya musik tidak dimainkan >1x kalo abis gameover balik ke home
      this.sound.play('music', { loop: true, volume: 0.7 });
      isPlayed = true;
    }
    this.makeGround(0);
    this.background = this.add.image(width / 2, height / 2, "bg");
    this.background.setDepth(1);

    this.textJudul = this.add.image(width / 2, -100, "title");
    this.textJudul.scale = 1;
    this.textJudul.setDepth(3);

    this.playButton = this.add.image(width / 2, height + 100, "play").setInteractive();
    this.playButton.setDepth(3);
    this.playButton.on('pointerdown', () => {
      this.playButton.scale = 0.9;
    })
    this.playButton.on('pointerup', () => {
      this.scene.start("GameScene");
      this.playButton.scale = 1;
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
      targets: this.textJudul,
      y: 150,
      ease: 'Power1',
      duration: 1000,
      delay: 500,
    });
    this.tweens.add({
      targets: this.playButton,
      y: 600,
      ease: 'Power1',
      duration: 1000,
      delay: 1000,

    });

  }



}

