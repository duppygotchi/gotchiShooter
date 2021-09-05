// src/game/objects/coin.ts

import { getGameHeight } from '../helpers';
import { COINS } from 'game/assets';

export class Coin extends Phaser.GameObjects.Sprite {
 constructor(scene: Phaser.Scene) {
   super(scene, 0, 0, COINS, 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) / 24;
   this.displayWidth = getGameHeight(scene) / 24;

   this.anims.create({
        key: 'ghst',
        frames: this.anims.generateFrameNumbers(COINS, { start: 0, end: 10}),
        frameRate: 20,
        repeat: -1
    });

 }

 public activate = (x: number, y: number, frame: number, velocityX: number) => {
    // Physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(velocityX);

    this.setPosition(x, y);
    this.setFrame(frame);
    this.anims.play('ghst', true);
  };

  public update = () => {
    if (this.x < -2 * this.displayWidth) {
      this.destroy()
    }
  }

  public handleOverlap = () => {
    this.destroy();
  }

}