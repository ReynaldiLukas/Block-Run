class Game extends Phaser.Scene {

    constructor() {
        super('GameScene');
    }


    create() {
        //BACKGROUND
        this.bg1 = this.add.image(width / 2, height / 2, "bg");
        this.bg1.setDepth(0);
        this.bg2 = this.add.image(width / 2 + 501, height / 2, "bg");
        this.bg2.setDepth(0);

        //CAMERA
        this.cam = this.add.image(width / 2, height / 2, "empty");//camera di tengah, player di kiri layar
        this.cameras.main.startFollow(this.cam);

        //PLAYER
        this.player = this.physics.add.image(100, height - 175, "player");
        this.blocks = [this.player];//array blocks yang berisi baris vertikal player+block block
        //dalam blocks, player selalu di index 0 dan setiap ada block baru, ditempatin di blocks.length-1

        this.jarakPlayerKeUjungLayar = width - this.player.x + 50;
        //console.log(this.jarakPlayerKeUjungLayar);


        //INITIAL GROUND
        this.makeGround(0);
        this.makeGround(this.jarakPlayerKeUjungLayar);//initial extra ground



        //input player
        this.input.on('pointerdown', () => {
            this.makeBlock();//initial block
            this.timedEvent = this.time.addEvent({ delay: 120, callback: this.makeBlock, callbackScope: this, loop: true });//kalau ditahan bakal nambah terus
        });
        this.input.on('pointerup', () => {
            this.timedEvent.remove(false);
        });

        //TEXT PERFECT 
        this.perfectText = this.add.text(this.player.x, this.player.y, 'perfect!', { fontSize: '20px', fill: '#000' });
        this.perfectText.setDepth(3);
        this.perfectText.setAlpha(0);
        this.perfectTextAlpha = 0;

        //VARIABLE VARIABLE LAIN YANG DIBUTUHKAN
        this.speedX = 5; //kecepatan  x  block 
        this.speedBgX = 2;//kecepatan background
        this.speedY = 10;//kecepatan y block
        this.obsLength = 0;// variable untuk menyimpan length obstacle yang dipake buat tau motong berapa block dri player
        this.obstacle = false;//boolean supaya ada jeda antar obstacle
        this.hole = false;//boolean supaya tidak terjadi hole 2x 
        this.grounded = height - 175;//variable untuk menyimpan tinggi "ground" saat ini, berpengaruh ke simulasi kapan player harus jatuh
        this.holeArea = [0, 0];//array untuk menyimpan range dari lubang
        this.obsArea = [0, 0];//array untuk menyimpan range obstacle
        this.obs = this.physics.add.image(0, 0, "empty");//placeholder obs
        this.obs2 = this.physics.add.image(0, 0, "empty");//placeholder obs2
        this.scoreX = 0;//variable untuk menyimpan koordinat x yang kalau dilewati score akan bertambah
        this.ceiling = 200;//menyimpan tinggi maximal player (berpengaruh ke limit add block)
        this.tempCeiling = 200;//temporary ceiling yang berpengaruh untuk merubah ceiling
        this.bgCounter = 1;//counter bg 
        //this.worldTimer = 1.0;//world timer untuk mempercepat game
        this.gameoverBol = false;//boolean untuk nandain gameover udah atau belum. mencegah animasi gameover berkali kali
        this.bulletCounter = 0;//menyimpan banyaknya bullet obstacle

        //SCORE
        score = 0;
        this.scoreText = this.add.text(width / 2 - 87, height / 2 - 200, 'score: 0', { fontSize: '30px', fill: '#000' });
        this.scoreText.setDepth(5);


        //SMOKE
        this.empty = this.physics.add.image(this.player.x - 25, this.player.y + 20, "empty");//nantinya smoke nge follow ini, kalo follow blocks[L-1] nantinya kacau
        this.particles = this.add.particles('smoke');

        this.particles.createEmitter({
            follow: this.empty,
            lifespan: 800,
            speed: 0,
            scale: 0.09,
            frequency: 40,
        });

        //ARROW
        //animasi arrow
        this.anims.create({
            key: 'arrow',
            frames: this.anims.generateFrameNumbers('arrow', { frames: [0, 1] }),
            frameRate: 8,
            repeat: -1
        });
        this.arrows = [];//array menyimpan arrow yang selalu bakal ada di belakang player tapi alphanya 0 jadi ga keliatan
        for (let i = 0; i < 8; i++) {
            this.arrows[i] = this.add.sprite(this.player.x - 50, height - 175 - (50 * i), "arrow", { frames: [0] });
            this.arrows[i].setAlpha(0);
            this.arrows[i].anims.play('arrow');//animasi blinking selalu ada, hanya setAlphanya yang dimainkan
        }

        //BULLET
        this.bullets = [];//array menyimpan bullet


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

    makeObstacle(x) {
        this.random1 = Phaser.Math.Between(1, 3);//random1 untuk panjang obstacle
        this.random2 = Phaser.Math.Between(1, 7);//random 2 untuk tinggi obstacle dari tanah
        this.random3 = Phaser.Math.Between(0, ((7 - this.random2)));//random3 untuk tinggi obstacle dari atap
        for (let j = 0; j < this.random1; j++) {
            //atap
            for (let i = 1; i <= this.random3; i++) {
                this.obs2 = this.physics.add.image((x + 25) + j * 50, 125 + (i * 50), "obs");
                this.obs2.setDepth(3);

            }
            this.tempCeiling = 200 + (this.random3 * 50);
            //console.log(this.tempCeiling);
            //this.temp = this.random;
            //console.log(this.random);

            for (let i = 1; i <= this.random2; i++) {
                this.obs = this.physics.add.image((x + 25) + j * 50, height - (i * 50) - 125, "obs");
                this.obs.setDepth(3);
            }

            if (this.random3 == 0) {
                this.obs2.y = 0;//supaya tidak ada kasus blocknya tidak di generate tapi tetap nabrak
            }
        }
        this.obsArea = [x + 25, x + 25 + (this.random1 * 50)];
        this.scoreX = x + 25;
        //console.log("SCORE   " + this.scoreX);
        //console.log("obs" + this.random);
        return this.random2;
    }

    makeGroundWithObstacle(start, hole) {
        if (this.hole == true) {
            this.randomGround = Phaser.Math.Between(0, 4);//random untuk menyimpan tanah yang berpengaruh ke besar hole
            this.holeArea = [(start + 25), (start + 400 - (this.randomGround * 50))];//lebar hole dikurangi sama random ground (jadi ukuran hole random gitu)
            for (let j = 0; j <= 2; j++) {
                for (let i = 1; i <= this.randomGround; i++) {
                    this.ground = this.physics.add.image(start + (475 - (50 * i)), (height - (j * 50)) - 25, "dirt");
                    this.ground.setDepth(2);
                    this.ground = this.physics.add.image(start + (475 - (50 * i)), ((j * 50)) + 25, "dirt");
                    this.ground.setDepth(2);
                }
            }

            //console.log("LOBANG   " + this.scoreX);
            //console.log(this.holeArea[0]);
        }
        //ground after obstacle
        for (let j = 0; j <= 2; j++) {
            for (let i = 1; i <= 10; i++) {
                if (this.hole != true) {
                    this.ground = this.physics.add.image(start + (i * 50 - 25), (height - (j * 50)) - 25, "dirt");
                    this.ground = this.physics.add.image(start + (i * 50 - 25), ((j * 50)) + 25, "dirt");
                }
            }
        }
        if (this.hole != true) {
            this.return = this.makeObstacle(start);
        }
        return this.return;
        //this.makeObstacle(start);
    }

    makeBlock() {
        if (this.gameoverBol == false) {//supaya kalo udah gameover ga bisa input block
            if (this.player.y >= this.ceiling) {
                this.sound.play('block', { volume: 30 });
                for (let i = this.blocks.length - 1; i >= 0; i--) {
                    this.blocks[i].y -= 50;
                }
                this.b = this.physics.add.image(this.player.x, this.blocks[this.blocks.length - 1].y + 50, "block");
                this.blocks.push(this.b);
                //console.log("blocks ke-" + this.blocks.length);
                //this.blocks[0].y = this.blocks[0].y - 50;
            }
        }
    }

    changeBg() {
        if (this.bulletCounter < 7) {
            this.bulletCounter++;
        }

        //console.log("changed BG");

        if (score % 10000 >= 9000) {
            this.cameras.main.setBackgroundColor('0xd04ff0');
        }
        else if (score % 10000 >= 8000) {
            this.cameras.main.setBackgroundColor('0xede84e');
        }
        else if (score % 10000 >= 7000) {
            this.cameras.main.setBackgroundColor('0x49f555');
        }
        else if (score % 10000 >= 6000) {
            this.cameras.main.setBackgroundColor('0x2debd4');
        }
        else if (score % 10000 >= 5000) {
            this.cameras.main.setBackgroundColor('0x3e3bed');
        }
        else if (score % 10000 >= 4000) {
            this.cameras.main.setBackgroundColor('0xf78f39');
        }
        else if (score % 10000 >= 3000) {
            this.cameras.main.setBackgroundColor('0xf5d86e');
        }
        else if (score % 10000 >= 2000) {
            this.cameras.main.setBackgroundColor('0xf779b8');
        }
        else if (score % 10000 >= 1000) {
            this.cameras.main.setBackgroundColor('0xeb3131');
        }
        else if (score % 10000 >= 0) {
            this.cameras.main.setBackgroundColor('0xffffff');
        }


        // switch (score % 10000) {
        //     case 1000:
        //         this.cameras.main.setBackgroundColor('0xd04ff0');
        //         break;
        //     case 2000:
        //         this.cameras.main.setBackgroundColor('0xede84e');
        //         break;
        //     case 3000:
        //         this.cameras.main.setBackgroundColor('0x49f555');
        //         break;
        //     case 4000:
        //         this.cameras.main.setBackgroundColor('0x2debd4');
        //         break;
        //     case 5000:
        //         this.cameras.main.setBackgroundColor('0x3e3bed');
        //         break;
        //     case 6000:
        //         this.cameras.main.setBackgroundColor('0xf78f39');
        //         break;
        //     case 7000:
        //         this.cameras.main.setBackgroundColor('0xf5d86e');
        //         break;
        //     case 8000:
        //         this.cameras.main.setBackgroundColor('0xf779b8');
        //         break;
        //     case 9000:
        //         this.cameras.main.setBackgroundColor('0xeb3131');
        //         break;
        //     default:
        //         this.cameras.main.setBackgroundColor('0xffffff');

        // }

        this.bg1.setAlpha(0.5);
        this.bg2.setAlpha(0.5);
        //this.worldTimer += 0.1;

    }

    gameover() {//dipake untuk nabrak obsatacle atau bullet
        this.sound.play('bump', { volume: 0.3 });
        if (this.gameoverBol == false) {//dari pengalaman suka error, jadi pake gameover==false
            this.gameoverBol = true;
            //this.worldTimer = 0;
            this.player.setAlpha(0);
            this.dummyPlayer = this.add.image(this.player.x, this.player.y, "dummyPlayer");
            this.dummyPlayer.angle = 270;
            this.tweens.add({
                targets: this.dummyPlayer,
                x: this.player.x - 50,
                duration: 300,
                //delay: 10000,
            });
            this.tweens.add({
                targets: this.dummyPlayer,
                y: height - 175,
                duration: 500,
                delay: 300,

            });
            this.tweens.add({
                targets: this.dummyPlayer,
                y: height - 175,//supaya ga error, kalo ga ada ini jadi error "length undefined"
                duration: 100,
                delay: 800,
                onComplete: () => {
                    this.scene.start("ResultScene");
                }
            });

        }

    }

    gameover2() {//dipake untuk gameover nabrak ground deket hole
        this.sound.play("bump", { volume: 0.3 });//dari pengalaman suka error, jadi pake gameover==false
        if (this.gameoverBol == false) {
            this.gameoverBol = true;
            //this.worldTimer = 0;
            this.player.setAlpha(0);
            this.dummyPlayer = this.add.image(this.player.x, this.player.y, "dummyPlayer");
            this.dummyPlayer.angle = 270;
            this.tweens.add({
                targets: this.dummyPlayer,
                x: this.player.x - 50,
                duration: 300,
                //delay: 10000,
            });
            this.tweens.add({
                targets: this.dummyPlayer,
                y: height + 100,
                duration: 500,
                delay: 300,

            });
            this.tweens.add({
                targets: this.dummyPlayer,
                y: height + 100,//supaya ga error, kalo ga ada ini jadi error "length undefined"
                duration: 100,
                delay: 800,
                onComplete: () => {
                    this.scene.start("ResultScene");
                }
            });

        }

    }

    bulletObstacle() {
        //this.timedEvent = this.time.addEvent({ delay: 120, callback: this.makeBlock, callbackScope: this, loop: true });
        this.arr = [-1, -1, -1, -1, -1, -1, -1];//array buat menyimpan bullet (bullet ke-x adanya di koordinat y mana/ arr[x]=y) 
        this.bulletExist = [0, 0, 0, 0, 0, 0, 0];//array buat menyimpan bullet di koordinat y udah ada atau belum (supaya ga stacking ->jelek ke visual)

        for (let i = 0; i < this.bulletCounter; i++) {
            this.randomBullet = Phaser.Math.Between(0, this.obsLength - 1);
            //console.log(this.randomBullet);
            if (this.bulletExist[this.randomBullet] == 0) {
                this.arr[i] = this.randomBullet;
                this.bulletExist[this.randomBullet] = 1;
            }

        }

        if (this.arr[0] != -1) {
            this.sound.play('bullet');
            //blinking animation
            this.arrows[this.arr[0]].setAlpha(1);
            this.tweens.add({
                targets: this.arrows[this.arr[0]],
                delay: 200,
                completeDelay: 900,
                onComplete: () => {
                    this.arrows[this.arr[0]].setAlpha(0);
                    this.bullets[this.arr[0]] = this.physics.add.image(this.player.x - 200, height - 175 - (this.arr[0] * 50), "bullet");
                    this.physics.add.collider(this.player, this.bullets[this.arr[0]], () => {
                        this.gameover();
                    }, null, this);
                    this.bullets[this.arr[0]].setVelocityX(1200);
                }
            });
        }
        if (this.arr[1] != -1) {
            //blinking animation
            this.arrows[this.arr[1]].setAlpha(1);
            this.tweens.add({
                targets: this.arrows[this.arr[1]],
                delay: 200,
                completeDelay: 900,
                onComplete: () => {
                    this.arrows[this.arr[1]].setAlpha(0);
                    this.bullets[this.arr[1]] = this.physics.add.image(this.player.x - 200, height - 175 - (this.arr[1] * 50), "bullet");
                    this.physics.add.collider(this.player, this.bullets[this.arr[1]], () => {
                        this.gameover();
                    }, null, this);
                    this.bullets[this.arr[1]].setVelocityX(1200);
                }
            });
        }
        if (this.arr[2] != -1) {
            //blinking animation
            this.arrows[this.arr[2]].setAlpha(1);
            this.tweens.add({
                targets: this.arrows[this.arr[2]],
                delay: 200,
                completeDelay: 900,
                onComplete: () => {
                    this.arrows[this.arr[2]].setAlpha(0);
                    this.bullets[this.arr[2]] = this.physics.add.image(this.player.x - 200, height - 175 - (this.arr[2] * 50), "bullet");
                    this.physics.add.collider(this.player, this.bullets[this.arr[2]], () => {
                        this.gameover();
                    }, null, this);
                    this.bullets[this.arr[2]].setVelocityX(1200);
                }
            });
        }
        if (this.arr[3] != -1) {
            //blinking animation
            this.arrows[this.arr[3]].setAlpha(1);
            this.tweens.add({
                targets: this.arrows[this.arr[3]],
                delay: 200,
                completeDelay: 900,
                onComplete: () => {
                    this.arrows[this.arr[3]].setAlpha(0);
                    this.bullets[this.arr[3]] = this.physics.add.image(this.player.x - 200, height - 175 - (this.arr[3] * 50), "bullet");
                    this.physics.add.collider(this.player, this.bullets[this.arr[3]], () => {
                        this.gameover();
                    }, null, this);
                    this.bullets[this.arr[3]].setVelocityX(1200);
                }
            });
        }
        if (this.arr[4] != -1) {
            //blinking animation
            this.arrows[this.arr[4]].setAlpha(1);
            this.tweens.add({
                targets: this.arrows[this.arr[4]],
                delay: 200,
                completeDelay: 900,
                onComplete: () => {
                    this.arrows[this.arr[4]].setAlpha(0);
                    this.bullets[this.arr[4]] = this.physics.add.image(this.player.x - 200, height - 175 - (this.arr[4] * 50), "bullet");
                    this.physics.add.collider(this.player, this.bullets[this.arr[4]], () => {
                        this.gameover();
                    }, null, this);
                    this.bullets[this.arr[4]].setVelocityX(1200);
                }
            });
        }
        if (this.arr[5] != -1) {
            //blinking animation
            this.arrows[this.arr[5]].setAlpha(1);
            this.tweens.add({
                targets: this.arrows[this.arr[5]],
                delay: 200,
                completeDelay: 900,
                onComplete: () => {
                    this.arrows[this.arr[5]].setAlpha(0);
                    this.bullets[this.arr[5]] = this.physics.add.image(this.player.x - 200, height - 175 - (this.arr[5] * 50), "bullet");
                    this.physics.add.collider(this.player, this.bullets[this.arr[5]], () => {
                        this.gameover();
                    }, null, this);
                    this.bullets[this.arr[5]].setVelocityX(1200);
                }
            });
        }
        if (this.arr[6] != -1) {
            //blinking animation
            this.arrows[this.arr[6]].setAlpha(1);
            this.tweens.add({
                targets: this.arrows[this.arr[6]],
                delay: 200,
                completeDelay: 900,
                onComplete: () => {
                    this.arrows[this.arr[6]].setAlpha(0);
                    this.bullets[this.arr[6]] = this.physics.add.image(this.player.x - 200, height - 175 - (this.arr[6] * 50), "bullet");
                    this.physics.add.collider(this.player, this.bullets[this.arr[6]], () => {
                        this.gameover();
                    }, null, this);
                    this.bullets[this.arr[6]].setVelocityX(1200);
                }
            });
        }
    }


    update(time, delta) {

        if (this.gameoverBol == false) {
            this.empty.x += this.speedX;//* (delta / 1000);
            this.perfectText.x = this.player.x - 30;
            this.perfectText.y = this.player.y - 50;
            //console.log("bg1 " + this.bg1.x);
            //console.log("bg2 " + this.bg2.x);
            //console.log("player  " + (this.bg1.x - this.player.x));
            this.bg1.x += this.speedBgX;//* (delta / 1000);
            this.bg2.x += this.speedBgX;//* (delta / 1000);

            this.scoreText.x += this.speedX;//* (delta / 1000);


            //PLAYER MOVEMENT X
            //block yang dikasih speed cuma yang paling bawah, sisanya ngikutin speed block paling bawah
            this.blocks[this.blocks.length - 1].x += this.speedX;//* (delta / 1000);
            this.cam.x += this.speedX;//* (delta / 1000);


            //PLAYER MOVEMENT Y
            //untuk setiap block selain block paling bawah
            for (let i = this.blocks.length - 2; i >= 0; i--) {
                this.blocks[i].x = this.blocks[this.blocks.length - 1].x;//posisi x ngikutin block terbawah
                this.blocks[i].y = this.blocks[i + 1].y - 50;//posisi y mengikuti block dibawahnya -50
            }

            // DAERAH OBSTACLES
            //jika block terbawah sedang ada di daerah lubang
            if (this.blocks[this.blocks.length - 1].x > this.holeArea[0] && this.blocks[this.blocks.length - 1].x <= this.holeArea[1]) {
                this.grounded = height + 50000;//tinggi ground dibuat dalam sekali agar player jatuh 
                this.particles.pause();
            }
            //jika block terbawah sedang berada di daerah obstacle
            else if (this.blocks[this.blocks.length - 1].x > this.obsArea[0] && this.blocks[this.blocks.length - 1].x < this.obsArea[1]) {
                this.grounded = height - 175 - (this.obsLength * 50);//tinggi ground dibuat sama dengan tinggi obstacle
                this.particles.pause();
            }
            //selain itu, tinggi ground dibuat normal 
            else {
                this.grounded = height - 175;
                if (this.blocks[this.blocks.length - 1].y == height - 175) {
                    this.particles.resume();
                }

            }
            //jika posisi y BALOK PALING BAWAH lebih tinggi dari pada tinggi tanahnya
            if (this.blocks[this.blocks.length - 1].y < this.grounded) {
                if (this.blocks[this.blocks.length - 1].x > this.obs.x) {//if ini supaya player tidak langsung turun saat melewati obstacle
                    this.blocks[this.blocks.length - 1].y += this.speedY;//* (delta / 1000);//posisi y blocks ditambah agar player turun
                }
                //console.log("pog");
            }



            //CEILING 
            //jika player sedang berada di daerah obstacle
            if (this.blocks[this.blocks.length - 1].x >= this.obsArea[0] - 50 && this.blocks[this.blocks.length - 1].x <= this.obsArea[1]) {
                this.ceiling = this.tempCeiling;//tinggi atap dibuat sama dengan tinggi obstacle bagian atap
                //console.log("CELIING  " + this.ceiling);
            }
            //selain itu
            else {
                this.ceiling = 200;//tinggi ceiling dibuat normal
                //console.log("CELIING  " + this.ceiling);
            }





            //CEK NABRAK OBSTACLE NGGA
            if (this.blocks[0].x == this.obsArea[0] - 50) {
                if (this.blocks[0].y <= this.obs2.y) {//cek nabrak atap
                    this.gameover();
                }
                if (this.blocks[0].y >= this.obs.y) {//cek nabrak bawah
                    this.gameover();
                }
                else {//kalau tidak nabrak
                    for (let i = 0; i < this.obsLength; i++) {
                        this.blocks.pop();//blocks di pop sebanyak tinggi obstacle tanah
                    }
                    if (this.blocks.length == 1) {
                        this.sound.play('perfect');
                        this.tweens.addCounter({
                            from: 0,
                            to: 100,
                            duration: 400,
                            repeat: 0,
                            yoyo: true,
                            onUpdate: (value) => {
                                this.perfectTextAlpha = value.targets[0].value;
                            }

                        })
                    }
                }
                //console.log("fall");
                //console.log("length " + this.obsLength);
            }
            //}
            this.perfectText.setAlpha(this.perfectTextAlpha);


            //ngepop blocks yang kena ground setelah lubang
            for (let i = this.blocks.length - 1; i >= 1; i--) {
                if (this.blocks[i].y > height - 175 && this.blocks[i].x > this.holeArea[1] + 25) {
                    this.blocks.pop();
                }
            }
            // if (this.blocks[this.blocks.length - 1].y > height - 175 && this.blocks[this.blocks.length - 1].x > this.holeArea[1]) {
            //     this.blocks.pop();
            // }

            //ngecek jika nabrak ground setelah lubang maka gameover
            if (this.blocks[0].y > height - 175 && this.blocks[this.blocks.length - 1].x > this.holeArea[1]) {
                this.gameover2();
            }

            //ngecek jika player masuk jurang gameover
            if (this.blocks[0].y > height + 50) {
                this.sound.play('fall');
                this.gameoverBol = true;
                this.tweens.add({
                    targets: this.player,
                    completeDelay: 1500,
                    onComplete: () => {
                        this.scene.start("ResultScene");
                    }
                });

            }

            //BACKGROUND
            if (this.player.x - this.bg1.x >= 350 || this.player.x - this.bg2.x >= 350) {
                if (this.bgCounter % 2 == 1) {
                    this.bg1.x = this.bg2.x + 501;
                    this.bgCounter++;
                }
                else {
                    this.bg2.x = this.bg1.x + 501;
                    this.bgCounter++;
                }
            }


            //jika player sudah di titik tertentu maka generate lagi ground
            if (this.player.x % (this.jarakPlayerKeUjungLayar) == 0) {
                //jika obstacle belum keluar , maka buat obstacle
                if (this.obstacle == false) {
                    //console.log("MAKE OBS");
                    if (this.hole == false) {//jika hole nya false
                        this.random = Phaser.Math.Between(1, 5);//randomize keluar hole atau obstacle
                        //console.log("RANDOM VALUE   " + this.random);
                        if (this.random == 1) {
                            this.hole = true;
                            this.obsLength = this.makeGroundWithObstacle(this.player.x + this.jarakPlayerKeUjungLayar, this.hole);
                            //console.log("hole");
                        }
                        else {
                            this.hole = false;
                            this.obsLength = this.makeGroundWithObstacle(this.player.x + this.jarakPlayerKeUjungLayar, this.hole);
                            this.bulletObstacle();

                            //console.log("ground");
                        }
                    }
                    //kalau hole true, buat ground tanpa obstacle
                    else {
                        this.hole = false;
                        this.makeGround(this.player.x + this.jarakPlayerKeUjungLayar);
                        //console.log("HOLE ALREADY TRUE");
                    }
                    //this.obsLength = this.makeGroundWithObstacle(this.player.x + this.jarakPlayerKeUjungLayar, this.hole);
                    //console.log("obs " + this.obsLength);
                    //console.log("obs " + this.obs.x);
                    this.obstacle = true;
                }
                //jika sudah pernah ada obstacle, buat ground biasa (breathing room player)
                else {
                    this.makeGround(this.player.x + this.jarakPlayerKeUjungLayar);
                    this.obstacle = false;
                    //console.log("MAKE GROUND");
                }


                //console.log(this.obs.x);

            }


            //SCORING
            //jika blocks melewati posisi x untuk menambah scoer
            //if (this.blocks[0].x == this.scoreX) {
            score++;
            this.scoreText.setText(score);
            //console.log("score" + score);
            this.scoreText.setText('Score: ' + score);
            if (score % 1000 == 0) {
                this.cp = this.physics.add.image(this.player.x + this.jarakPlayerKeUjungLayar, height / 2, "checkpoint");
                this.cp.setDepth(1);
                this.bgChanged = true;
                
            }
            if (this.cp != undefined) {
                if (this.cp.x == this.player.x) {
                    this.changeBg();
                }
            }
            //ARROW MOVEMENT
            for (let i = 0; i < 8; i++) {
                this.arrows[i].x += this.speedX;//* (delta / 1000);
            }
        }




        //}




    }



}
//https://own-games.com/customLibrary/gameplay/6

//JURANG PAKAI DEPTH
// score
// setDepth
// this.add.text()
// this.add.text().setDepth


// cara collision:
// ga bisa langsung ditabrak sama obstaclenya
// maybe dicatet aja TINGGI obstacle berapa terus waktu posisi X block= X dari obstacle
// drop block sebanyak tinggi obstacle

// var rect1 = {x: 5, y: 5, width: 50, height: 50}
// var rect2 = {x: 20, y: 10, width: 10, height: 10}

// if (rect1.x < rect2.x + rect2.width &&
//    rect1.x + rect1.width > rect2.x &&
//    rect1.y < rect2.y + rect2.height &&
//    rect1.y + rect1.height > rect2.y) {
//     // collision detected!
// }

// // filling in the values =>

// if (5 < 30 &&
//     55 > 20 &&
//     5 < 20 &&
//     55 > 10) {
//     // collision detected!
// }


 // if (this.player.x - this.bg1.x == 345) {
            //     this.bg1 = this.add.image(this.bg2 + 501, height / 2, "bg");
            //     this.bg1.setDepth(0);
            // }
            // if (this.player.x - this.bg2.x == 345) {
            //     this.bg2 = this.add.image(this.bg1.x + 501, height / 2, "bg");
            //     this.bg2.setDepth(0);
            // }



//this.obstacles.push(this.obs);
                //this.physics.add.collider(this.blocks[0], this.obs2, () => {
                // if (this.gameover == false) {
                //     this.sound.play("bump", { volume: 0.3 });
                //     this.gameover = true;
                // }
                // this.tweens.addCounter({
                //     duration: 1000,
                //     onComplete: () => {
                //         px = this.player.x;
                //         py = this.player.y;
                //         ox = this.obstacle.x;
                //         oy = this.obstacle.y;
                //         sp = this.player.angle;
                //         so = this.obstacle.angle;
                // this.scene.start('ResultScene');
                //     }
                // });

                //}, null, this);