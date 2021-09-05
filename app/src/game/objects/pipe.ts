// src/game/objects/pipe.ts

import { getGameHeight } from '../helpers';
import { PIPES } from 'game/assets';

export class Pipe extends Phaser.GameObjects.Image {
 constructor(scene: Phaser.Scene) {
   super(scene, 0, 0, PIPES, 0);
   this.setOrigin(0, 0);
   this.displayHeight = getGameHeight(scene) / 70;
   this.displayWidth = getGameHeight(scene) / 70;
 }

 public activate = (x: number, y: number, frame: number, velocityX: number) => {
    // Physics
    this.scene.physics.world.enable(this);
    (this.body as Phaser.Physics.Arcade.Body).setVelocityX(velocityX);

    this.setPosition(x, y);
    this.setFrame(frame);
  };

  public update = () => {
    if (this.x < -2 * this.displayWidth) {
      this.destroy();
    }
  }
}