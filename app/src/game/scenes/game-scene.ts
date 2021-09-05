import {  LEFT_CHEVRON, BG, CLICK, 
          BOOP, COLLECTING, EXPLODING, 
          EXPLOSION, STARS, COINS, 
          BOMBS, FIRING } from 'game/assets';
import { AavegotchiGameObject } from 'types';
import { getGameWidth, getGameHeight, getRelative } from '../helpers';
import { Player, Pipe, ScoreZone, Liquidator, Laser, Star, Coin, Bomb } from 'game/objects';
import { Socket } from "socket.io-client";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

/**
 * Scene where gameplay takes place
 */
export class GameScene extends Phaser.Scene {
  private socket?: Socket;
  private player?: Player;
  private selectedGotchi?: AavegotchiGameObject;
  private pipes?: Phaser.GameObjects.Group;
  private scoreZone?: Phaser.GameObjects.Group;
  // private shotsZone?: Phaser.GameObjects.Group;
  private bg?: Phaser.GameObjects.Image;
  private image0?: Phaser.GameObjects.TileSprite;
  private bgscroll?: Phaser.GameObjects.TileSprite;
  private stars?: Phaser.GameObjects.Group;

  private liquidators?: Phaser.GameObjects.Group;
  private lasers?: Phaser.GameObjects.Group;
  // private laser?: Phaser.GameObjects.Image;

  // Sounds
  private back?: Phaser.Sound.BaseSound;
  private boop?: Phaser.Sound.BaseSound;
  private collecting?: Phaser.Sound.BaseSound;
  private bang?: Phaser.Sound.BaseSound;
  private firing?: Phaser.Sound.BaseSound;

  // Items
  private coins?: Phaser.GameObjects.Group;
  private bombs?: Phaser.GameObjects.Group;

  // Score
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;

  // Shots fired
  private shots = 100;
  private speed = 200;
  private numcoin = 5;
  private numbomb = 25;
  private shotsText?: Phaser.GameObjects.Text;

  private isGameOver = false;

  private iter = 0;

  constructor() {
    super(sceneConfig);
  }

  init = (data: { selectedGotchi: AavegotchiGameObject }): void => {
    this.selectedGotchi = data.selectedGotchi;
    this.speed = this.selectedGotchi?.withSetsNumericTraits[0];
    this.shots = this.selectedGotchi?.withSetsNumericTraits[1];
    this.numcoin = Math.floor(this.selectedGotchi?.withSetsNumericTraits[2]/10);
    this.numbomb =  55 - Math.floor(this.selectedGotchi?.withSetsNumericTraits[3]/2);
  };

  public create(): void {
    this.socket = this.game.registry.values.socket;
    this.socket?.emit('gameStarted');

    // Add layout
    this.bg = this.add.image(getGameWidth(this) / 2, getGameHeight(this) / 2, BG).setDisplaySize(getGameWidth(this), getGameHeight(this));
    // this.image0 = this.add.tileSprite(getGameWidth(this) / 2, getGameHeight(this) / 2, getGameWidth(this), getGameHeight(this), BG);
    // this.bgscroll = this.add.tileSprite(getGameWidth(this) / 2, getGameHeight(this) / 2, getGameWidth(this), getGameHeight(this), BG);
    
    this.back = this.sound.add(CLICK, { loop: false });
    this.boop = this.sound.add(BOOP, { loop: false });
    this.collecting = this.sound.add(COLLECTING, { loop: false });
    this.bang = this.sound.add(EXPLODING, { loop: false });
    this.firing = this.sound.add(FIRING, { loop: false });
    
    this.createBackButton();

    this.anims.create({
        key: 'explosion',
        frames: this.anims.generateFrameNumbers(EXPLOSION, {start: 0, end: 16}),
        frameRate: 20,
        repeat: 0,
    });

    this.scoreText = this.add
      .text(getGameWidth(this) / 2, getGameHeight(this) / 2 - getRelative(450, this), 'score: ' + this.score.toString(), {
        color: '#00FF00',
      })
      .setFontSize(getRelative(80, this))
      .setOrigin(0.5)
      .setDepth(1);

    this.shotsText = this.add
      .text(getRelative(250, this), getGameHeight(this) / 2 + getRelative(450, this), 'shots: ' + this.shots.toString(), {
        color: '#FF66DD',
      })
      .setFontSize(getRelative(80, this))
      .setOrigin(0.5)
      .setDepth(1);
    
    // Add a player sprite that can be moved around.
    this.player = new Player({
      scene: this,
      x: getGameWidth(this) / 2,
      y: getGameHeight(this) / 2,
      key: this.selectedGotchi?.spritesheetKey || '',
    });
    this.player.speed = 2*this.speed;

    // Add enemies
    this.liquidators = this.add.group({
      maxSize: 1,
      classType: Liquidator,
      runChildUpdate: true,
    });

    this.addLiquidatorRow();

    // Add pipes
    this.pipes = this.add.group({
      maxSize: 25,
      classType: Pipe,
      runChildUpdate: true,
    });

    // this.addPipeRow();

    // Add Coins
    this.coins = this.add.group({
      maxSize: 10,
      classType: Coin,
      runChildUpdate: true,
    });

    this.addCoinsCloud();

    this.bombs = this.add.group({
      maxSize: 55,
      classType: Bomb,
      runChildUpdate: true,
    });

    this.addBombsAttack();

    this.lasers = this.add.group({ classType: Laser })

    this.scoreZone = this.add.group({ classType: ScoreZone });

    // this.shotsZone = this.add.group({ classType: ShotsZone });


    // this.stars = this.add.group({
    //   maxSize: 25,
    //   classType: Star,
    //   runChildUpdate: true,
    // });

    // this.addStarsBack();

    // this.time.addEvent({
    //   delay: 2000,
    //   callback: this.addPipeRow,
    //   callbackScope: this,
    //   loop: true,
    // });
    // this.time.addEvent({
    // delay: 2000,
    // callback: this.addStarsBack,
    // callbackScope: this,
    // loop: true,
    // });
    // this.time.addEvent({
    // delay: 2000,
    // callback: this.addCoinsCloud,
    // callbackScope: this,
    // loop: true,
    // });
    // this.time.addEvent({
    // delay: 2000,
    // callback: this.addBombsAttack,
    // callbackScope: this,
    // loop: true,
    // });

  }

 private addPipeRow = () => {   
    const x = getGameWidth(this);
    const size = getGameHeight(this) / 7;
    const velocityX = -getGameWidth(this) / 5;
    const gap = Math.floor(Math.random() * 4) + 1;

    for (let i = 1; i < 7; i++) {
      if (i !== gap && i !== gap + 1) {
        const frame = i === gap - 1 ? 2 : i === gap + 2 ? 0 : 1;
        this.addPipe(x, size * i, frame, velocityX);
      } else if (i === gap) {
        this.addScoreZone(x, size * i, velocityX);
      }
    }
  };

  private addPipe = (x: number, y: number, frame: number, velocityX: number): void => {
    const pipe: Pipe = this.pipes?.get();
    pipe.activate(x, y, frame, velocityX);
  }; 


  private addStarsBack = () => { 
    const x = getGameWidth(this);
    const y = getGameHeight(this) /2;
    const velocityX = -getGameWidth(this) / 5;
    const frame = 0;
    this.addStar(x, y, frame, velocityX);
  };

  private addStar = (x: number, y: number, frame: number, velocityX: number): void => {
    const star: Star = this.stars?.get();
    star.activate(x, y, frame, velocityX);
  }; 


  private addCoinsCloud = () => { 
    for (let i = 1; i <= this.numcoin; i++){
      const x = Phaser.Math.Between(getGameWidth(this)/4, 3*getGameWidth(this)/4);
      const y = Phaser.Math.Between(getGameHeight(this)/4, 3*getGameHeight(this)/4);
      const velocityX = 0;
      const frame = i;
      this.addCoin(x, y, frame, velocityX);
    }
    // this.addCoin(x, y, frame, velocityX);
  };

  private addCoin = (x: number, y: number, frame: number, velocityX: number): void => {
    const coin: Coin = this.coins?.get();
    coin.activate(x, y, frame, velocityX);
  }; 

  private addBombsAttack = () => { 
    for (let i = 1; i <= this.numbomb; i++){
      const x = Phaser.Math.Between(getGameWidth(this), 1.2*getGameWidth(this));
      const y = Phaser.Math.Between(getGameHeight(this)/7, getGameHeight(this));
      const velocityX = -getGameWidth(this)/5;
      const VelocityY = -getGameHeight(this)/5;
      const frame = 0;
      this.addBomb(x, y, frame, velocityX);
    }
  };

  private addBomb = (x: number, y: number, frame: number, velocityX: number): void => {
    const bomb: Bomb = this.bombs?.get();
    bomb.activate(x, y, frame, velocityX);
  }; 


 private addLiquidatorRow = () => {   
    const x = getGameWidth(this) +200 ;
    const y = getGameWidth(this) / 2;
    const velocityX = getGameWidth(this) / 10;
    const frame = 1;

    const liquidator: Liquidator = this.liquidators?.get();
    liquidator.activate(x, y, frame, velocityX);
  };

  // private addLiquidator = (x: number, y: number, frame: number, velocityX: number): void => {
  //   const liquidator: Liquidator = this.liquidators?.get();
  //   liquidator.activate(x, y, frame, velocityX);
  // }; 

  private addLasersGroup = (x: number, y: number): void => {
    // const x = getGameWidth(this) +200 ;
    // const y = getGameWidth(this) + 200;
    const frame = 0;
    const velocityX = getGameWidth(this) / 2;
    this.addLaser(x, y, frame, velocityX);
  }

  private addLaser = (x: number, y: number, frame: number, velocityX: number): void =>{
    const laser: Laser = this.lasers?.get();
    laser.activate(x, y, frame, velocityX);
  }

  private addScoreZone = (x: number, y: number, velocityX: number): void => {
    const height = 2 * getGameHeight(this) / 7;
    const width = getGameHeight(this) / 7;
    this.scoreZone?.add(
      new ScoreZone({
        scene: this,
        x,
        y,
        width,
        height,
        velocityX
      })
    )
  };




  private createBackButton = () => {
    this.add
      .image(getRelative(54, this), getRelative(54, this), LEFT_CHEVRON)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .setDisplaySize(getRelative(94, this), getRelative(94, this))
      .on('pointerdown', () => {
        this.back?.play();
        window.history.back();
      });
  };

  private addScore = (x: number): void => {
    if (this.scoreText) {
      this.score += x;
      this.scoreText.setText('score: '+this.score.toString());
    }
  };

  private countDownShots = () => {
    if (this.shotsText) {
      this.shots -= 1;
      this.shotsText.setText('shots: '+this.shots.toString());
    }
  };
  public countUpShots = () => {
    if (this.shotsText) {
      this.shots +=1;
      this.shotsText.setText('shots: '+this.shots.toString());
    }
  }


  private destroyBomb = () =>
  {
      const bomb: Bomb = this.bombs?.get();
      const laser: Laser = this.lasers?.get();
      bomb.destroy();
      laser.destroy();

      // score += 10;
      // scoreText.setText('Score: ' + score);
      // shots += 1;
      // shotsText.setText('Shots: ' + shots);

  }
  private destroyEnemy = () =>
  {
    // explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
    // explosion.play('explode');
    // this.sound.play('sndExplode1');

    // liquidator.disableBody(true, true);
    // laser.disableBody(true, true);

    // laser.destroy();

    // score += 30;
    // scoreText.setText('Score: ' + score);
    // shots += 1;
    // shotsText.setText('Shots: ' + shots);

    // Create enemy again
    // if (enemies.countActive(true) === 0)
    // {
    //   enemies.children.iterate(function (child) 
    //   {
    //     child.enableBody(true, Phaser.Math.Between(500,750), Phaser.Math.Between(100, 500), true, true);
    //   });
    // }
  }


  public update(): void {

    // Every frame, we update the player
    this.player?.update();

    if (this.player && !this.player?.getDead()) {
      this.player.update();

      // Update Enemy
      if (this.score >= 1000) {
        this.iter += 1;
      }
      else if (this.score >= 400 && this.score < 1000) {
        this.iter += 0.4;
      }
      else if (this.score >= 200 && this.score < 400) {
        this.iter += 0.3;
      }
      else if (this.score >= 100 && this.score < 200) {
        this.iter += 0.2;
      }
      else {
        this.iter += 0.1;
      }
      
      if (this.liquidators?.countActive(true) === 1){
        this.liquidators?.shiftPosition(35*Math.cos(4*this.iter) + 3.5*getGameWidth(this)/4 - 10*this.iter, this.player.y + 100*Math.sin(3*this.iter));
        this.physics.overlap(
        this.liquidators,
        this.bombs,
        (liquidator, bomb) => {
          // (liquidator as Liquidator).handleOverlap();
          (bomb as Bomb).handleOverlap();
          this.bang?.play();
         });
      }
      else {
        this.addLiquidatorRow();
        this.iter = 0;
      }


      // SHOOTING
      if (this.player?.getShoot() === true) {
        if (this.shots > 0) {
          this.countDownShots();
          this.addLasersGroup(this.player.x, this.player.y);
          this.firing?.play();
          this.player?.setShoot(false);          
        }
      }

      // this.bgscroll?.tilePositionX(-50*this.iter+getGameWidth(this)/2);

      // SCORE EVENTS
      this.physics.overlap(
        this.player,
        this.coins,
        (_, coin) => {
          (coin as Coin).handleOverlap();
          // this.addScore();
          this.collecting?.play();
          this.countUpShots();
        }
      );

      if (this.lasers) {
          this.physics.overlap(
            this.lasers,
            this.bombs,
            (laser, bomb) => {
              (laser as Laser).handleOverlap();
              (bomb as Bomb).handleOverlap();
              this.bang?.play();            
              this.addScore(1);
            });

          this.physics.overlap(
            this.lasers,
            this.liquidators,
            (laser, liquidator) => {
              (laser as Laser).handleOverlap();
              (liquidator as Liquidator).handleOverlap();
              this.bang?.play();   
              this.addScore(10);  
              // this.anims.play('explosion', true);
            });

      }
      if (this.coins?.countActive(true) === 0){
        this.addCoinsCloud();
      }


      if (this.bombs?.countActive(true) === 0){
        this.addBombsAttack();
      }


      // DEATH CONDITIONS
      this.physics.overlap(
        this.player,
        this.liquidators,
        () => {
          this.player?.setDead(true);
          this.boop?.play();
        },
        undefined,
        this,
      );
      this.physics.overlap(
        this.player,
        this.bombs,
        () => {
          this.bang?.play();
          this.player?.anims.play('explosion', true);
          this.player?.setDead(true);
        },
        undefined,
        this,
      );

      // this.physics.overlap(
      //   this.player,
      //   this.scoreZone,
      //   (_, zone) => {
      //     (zone as ScoreZone).handleOverlap();
      //     this.addScore();
      //   }
      // );


      // this.physics.overlap(
      //   this.player,
      //   this.shotsZone,
      //   (_, zone) => {
      //     (zone as ShotsZone).handleOverlap();
      //     this.countShots();
      //   }
      // )
    } else {   
      if (!this.isGameOver) {
        this.isGameOver = true;
        this.socket?.emit('gameOver', {score: this.score});
        window.history.back();
      }
      Phaser.Actions.Call(
        (this.pipes as Phaser.GameObjects.Group).getChildren(),
        (pipe) => {
          (pipe.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
        },
        this,
      );
    }

    // if (this.player && this.player.y > this.sys.canvas.height) {
    //   window.history.back();
    // }
  }
}

