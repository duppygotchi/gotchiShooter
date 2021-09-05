// src/game/objects/bomb.ts

import { getGameHeight } from '../helpers';
import { BOMBS, EXPLOSION } from 'game/assets';
import { Player, Laser } from 'game/objects';

export class Bomb extends Phaser.GameObjects.Sprite {
 constructor(scene: Phaser.Scene) {
   super(scene, 0, 0, BOMBS, 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) / 16;
   this.displayWidth = getGameHeight(scene) / 16;

   this.anims.create({
      key: 'explosion',
      frames: this.scene.anims.generateFrameNumbers(EXPLOSION, {start: 0, end: 16}),
      frameRate: 20,
      repeat: -1,
    });

 }

 public activate = (x: number, y: number, frame: number, velocityX: number) => {
    // Physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(velocityX);

    this.setPosition(x, y);
    this.setFrame(frame);
  };

  public update = () => {
    if (this.x < -this.displayWidth) {
      this.destroy()
    }
  }

  public handleOverlap = () => {
    this.anims.play('explosion', true);
    this.destroy();
  }

}