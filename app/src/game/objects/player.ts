import { getGameWidth, getGameHeight, getRelative } from 'game/helpers';
import { Laser, Bomb } from 'game/objects';
import { FIRING } from 'game/assets';

interface Props {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: string;
  frame?: number;
}

export class Player extends Phaser.GameObjects.Sprite {
  private cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  public speed = 200;

  private keyW;
  private keyS;
  private keyA;
  private keyD;
  private keySpace;
  // private jumpKey: Phaser.Input.Keyboard.Key;
  // private moveUpKey: Phaser.Input.Keyboard.Key;
  // private moveDownKey: Phaser.Input.Keyboard.Key;
  private pointer: Phaser.Input.Pointer;
  // private isFlapping = false;
  // private isMovingUp = false;
  // private isMovingDown = false;
  private isDead = false;
  private isShooting = false;

  // private bombs: Phaser.GameObjects.Group;

  private firing?: Phaser.Sound.BaseSound;

  constructor({ scene, x, y, key }: Props) {
    super(scene, x, y, key);

    // Add animations
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(key || '', { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'flap',
      frames: this.anims.generateFrameNumbers(key || '', { frames: [ 1, 0 ]}),
      frameRate: 2,
    });
    this.anims.create({
      key: 'dead',
      frames: this.anims.generateFrameNumbers(key || '', { frames: [ 2 ]}),
    });

    // physics
    this.scene.physics.world.enable(this);
    // (this.body as Phaser.Physics.Arcade.Body).setGravityY(getGameHeight(this.scene) * 0.5);
    // (this.body as Phaser.Physics.Arcade.Body).setSize(90, 120);
    (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
    // sprite
    this.setOrigin(getRelative(10, scene), 0); // 5 to the left; default (0, 0)
    this.setDisplaySize(this.displayHeight * getGameHeight(scene) / 1200, this.displayHeight * getGameHeight(scene) / 1200);

    // input
    this.pointer = this.scene.input.activePointer;
    this.cursorKeys = scene.input.keyboard.createCursorKeys();

    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // this.lasers = scene.physics.add.group({ classType: Laser });
    // this.bombs = scene.physics.add.group({ classType: Bomb });

    this.scene.add.existing(this);

    this.firing = scene.sound.add(FIRING, { loop: false });
  }

  public getShoot(): boolean {
    return this.isShooting;
  }

  public setShoot(fired: boolean): void {
    this.isShooting = fired;
  }

  public getDead(): boolean {
    return this.isDead;
  }

  public setDead(dead: boolean): void {
    this.isDead = dead;
    this.anims.play('dead');
  }

  //check if off the screen
  public update(): void {
    // if (this.y > getGameHeight(this.scene) || this.y < 0) {
    //   this.setDead(true);
    // }

    // Every frame, we create a new velocity for the sprite based on what keys the player is holding down.
    const velocity = new Phaser.Math.Vector2(0, 0);
    // Horizontal movement
    switch (true) {
      case this.cursorKeys?.left.isDown || this.keyA.isDown:
        velocity.x -= 1;
        this.anims.play('idle', false);
        break;
      case this.cursorKeys?.right.isDown || this.keyD.isDown:
        velocity.x += 1;
        this.anims.play('idle', false);
        break;
      default:
        this.anims.play('idle', true);
    }

    // // Vertical movement
    switch (true) {
      case this.cursorKeys?.down.isDown || this.keyS.isDown:
        velocity.y += 1;
        this.anims.play('idle', false);
        break;
      case this.cursorKeys?.up.isDown || this.keyW.isDown:
        velocity.y -= 1;
        this.anims.play('idle', false);
        break;
      default:
        this.anims.play('idle', true);
    }


    switch (true) {
      case this.keySpace.isDown:
        this.isShooting = true;
        this.anims.play('flap', true);
        break;
    }




    // // We normalize the velocity so that the player is always moving at the same speed, regardless of direction.
    const normalizedVelocity = velocity.normalize();
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(normalizedVelocity.x * this.speed, normalizedVelocity.y * this.speed);
  }
}
